import { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { WebLinksAddon } from '@xterm/addon-web-links';
import '@xterm/xterm/css/xterm.css';
import { useArena } from '../store';

export default function TerminalPane({ fullscreen = false }: { fullscreen?: boolean }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const send = useArena((s) => s.send);
  const setSink = useArena((s) => s.setTerminalSink);
  const theme = useArena((s) => s.theme);
  const sessionDead = useArena((s) => s.sessionDead);

  // el send del store llega DESPUÉS del mount; guardamos siempre el último
  // valor en un ref para que onData/onResize nunca cierren sobre un `send`
  // null (bug histórico: «escribo y no se ve nada»).
  const sendRef = useRef(send);
  sendRef.current = send;

  useEffect(() => {
    if (!hostRef.current) return;
    const term = new Terminal({
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: 14,
      theme: {
        background: '#161a20',
        foreground: '#d8dee9',
        cursor: '#88c0d0',
        selectionBackground: '#3b4252',
        black: '#2e3440',
        red: '#bf616a',
        green: '#a3be8c',
        yellow: '#ebcb8b',
        blue: '#81a1c1',
        magenta: '#b48ead',
        cyan: '#88c0d0',
        white: '#d8dee9',
        brightBlack: '#4c566a',
        brightWhite: '#eceff4',
      },
      allowProposedApi: true,
      scrollback: 5000,
      cursorBlink: true,
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    fitRef.current = fit;
    term.loadAddon(new WebLinksAddon());
    // Copiar selección con Ctrl+C / Ctrl+Shift+C / Cmd+C. Con texto marcado
    // estos atajos copian y NO mandan SIGINT; sin selección, Ctrl+C sigue
    // abortando el comando en curso como un terminal normal. (Ctrl+Shift+C
    // sin selección no se puede capturar: el navegador abre DevTools.)
    term.attachCustomKeyEventHandler((ev) => {
      if (ev.type !== 'keydown') return true;
      const keyC = ev.key?.toLowerCase?.() === 'c' || ev.code === 'KeyC';
      if (!keyC || !(ev.ctrlKey || ev.metaKey)) return true;
      const sel = term.getSelection();
      if (!sel) return true; // SIGINT clásico
      void navigator.clipboard.writeText(sel).catch(() => undefined);
      term.write('\r\n\x1b[90m— selección copiada (Ctrl+V pega) —\x1b[0m\r\n');
      return false; // no pasa al shell
    });
    term.open(hostRef.current);
    term.onResize(({ cols, rows }) =>
      sendRef.current?.({ type: 'resize', payload: { cols, rows } }),
    );
    term.onData((data) => sendRef.current?.({ type: 'input', payload: { data } }));
    term.write('\x1b[90mconectando con el contenedor de sesión…\x1b[0m\r\n');
    termRef.current = term;
    setSink((s: string) => term.write(s));
    // handle de tests (visual/e2e): selección programática en la terminal.
    // Siempre disponible: el test visual corre contra el build de producción.
    (window as unknown as { __arenaTerm?: Terminal }).__arenaTerm = term;

    const ro = new ResizeObserver(() => {
      try {
        fit.fit();
      } catch {
        /* aún sin layout */
      }
    });
    ro.observe(hostRef.current);
    const timeout = setTimeout(() => {
      try {
        fit.fit();
      } catch {
        /* noop */
      }
    }, 50);

    return () => {
      ro.disconnect();
      clearTimeout(timeout);
      fitRef.current = null;
      delete (window as unknown as { __arenaTerm?: Terminal }).__arenaTerm;
      term.dispose();
      setSink(null);
    };
  }, []);

  // foco en cuanto hay `send` (la conexión acaba de abrir) y al volver al tab
  useEffect(() => {
    if (send) termRef.current?.focus();
  }, [send, sessionDead]);

  // en pantalla completa la terminal sube a fuente mayor y re-encaje;
  // el re-fit doble (30 ms + 350 ms) asegura que bash/readline queda con la
  // medida final tras asentar el layout (mitiga ecos desfasados "raros")
  useEffect(() => {
    const term = termRef.current;
    if (!term) return;
    term.options.fontSize = fullscreen ? 16 : 14;
    const t1 = setTimeout(() => {
      try {
        fitRef.current?.fit();
      } catch {
        /* noop */
      }
    }, 30);
    const t2 = setTimeout(() => {
      try {
        fitRef.current?.fit();
        term.scrollToBottom();
      } catch {
        /* noop */
      }
    }, 350);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [fullscreen]);

  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible' && send) termRef.current?.focus();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [send]);

  useEffect(() => {
    if (sessionDead) {
      termRef.current?.write(`\r\n\x1b[38;5;203mla sesión terminó (${sessionDead}) — pulsa Reanudar\x1b[0m\r\n`);
    }
  }, [sessionDead]);

  return (
    <div
      className={`arena-terminal ${theme === 'crt' ? 'crt' : ''} rounded-xl bg-[#161a20] shadow-glow p-3 h-full w-full overflow-hidden`}
      onClick={() => termRef.current?.focus()}
    >
      <div ref={hostRef} className="h-full w-full" aria-label="terminal del dojo" />
    </div>
  );
}
