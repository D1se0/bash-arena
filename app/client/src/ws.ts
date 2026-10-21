import { useEffect, useRef } from 'react';
import { ensurePlayerId, useArena } from './store';

/** Conexión WebSocket a /ws con reintentos suaves y wire-up al store. */
export function useArenaSocket(): { restart: () => void } {
  const wsRef = useRef<WebSocket | null>(null);
  const setSend = useArena((s) => s.setSend);
  const ingest = useArena((s) => s.ingest);
  const setConnected = useArena((s) => s.setConnected);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let closed = false;
    let retry = 0;

    const connect = () => {
      const proto = location.protocol === 'https:' ? 'wss:' : 'ws:';
      const url = `${proto}//${location.host}/ws`;
      ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        retry = 0;
        ws!.send(JSON.stringify({ type: 'hello', payload: { playerId: ensurePlayerId() } }));
        setConnected(true);
        // arranca la sesión (nivel actual del jugador)
        setTimeout(() => ws?.send(JSON.stringify({ type: 'start', payload: {} })), 150);
      };
      ws.onmessage = (ev) => {
        try {
          ingest(JSON.parse(ev.data));
        } catch {
          /* ignora mensajes corruptos */
        }
      };
      ws.onclose = () => {
        setConnected(false);
        if (!closed) {
          retry = Math.min(retry + 1, 5);
          setTimeout(connect, 800 * retry);
        }
      };
      ws.onerror = () => ws?.close();
    };

    connect();
    setSend((msg: Record<string, unknown>) => {
      if (ws && ws.readyState === 1) ws.send(JSON.stringify(msg));
    });
    return () => {
      closed = true;
      ws?.close();
    };
  }, []);

  return { restart: () => wsRef.current?.close() };
}
