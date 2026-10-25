import { useEffect, useState } from 'react';
import { useArena, ensurePlayerId } from '../store';
import { exportProfilePdf } from '../lib/pdf';

/**
 * Modal «informe PDF»: genera el PDF del perfil del jugador (portada,
 * estadísticas, niveles resueltos, logros, diploma y código de verificación).
 */
export function ExportPdfModal({ onClose }: { onClose: () => void }) {
  const playerId = useArena((s) => s.playerId) ?? ensurePlayerId();
  const xp = useArena((s) => s.xp);
  const rank = useArena((s) => s.rank);
  const nextRankAt = useArena((s) => s.nextRankAt);
  const welcome = useArena((s) => s.welcome);
  const level = useArena((s) => s.level);
  const connected = useArena((s) => s.connected);
  const [name, setName] = useState(() => localStorage.getItem('arena-player-name') ?? 'agente del dojo');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const generate = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const file = await exportProfilePdf({
        playerId,
        playerName: name.trim() || 'agente del dojo',
        xp,
        rank,
        nextRankAt,
        tracks: welcome?.tracks ?? [],
        currentLevelTitle: level?.title ?? null,
      });
      localStorage.setItem('arena-player-name', name.trim());
      setMsg({ kind: 'ok', text: `informe generado ✓ → ${file}` });
    } catch (e) {
      setMsg({ kind: 'err', text: `no se pudo generar el PDF: ${(e as Error).message}` });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="informe en PDF"
      onClick={onClose}
      tabIndex={-1}
    >
      <div
        className="arena-pop w-full max-w-lg rounded-xl border border-edge bg-[#161a20] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-edge/70 bg-[#1b2028]">
          <span aria-hidden>🧾</span>
          <span className="font-mono text-xs text-frost/80">informe del jugador en PDF</span>
          <button
            onClick={onClose}
            aria-label="cerrar (Esc)"
            className="ml-auto shrink-0 rounded px-2 py-0.5 text-sm text-frost/70 hover:text-nord6 hover:bg-edge/60"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4 text-sm">
          <div className="rounded-lg border border-morado/40 bg-morado/10 p-3 space-y-2">
            <p className="text-[11px] uppercase tracking-widest text-morado">qué incluye el informe</p>
            <ul className="text-xs text-frost/85 space-y-1 leading-relaxed">
              <li>▸ portada con tu nombre visible, id de jugador, XP y rango</li>
              <li>▸ resumen: XP, niveles, tiempo total, pistas e intentos</li>
              <li>▸ progreso por sección con barras de color</li>
              <li>▸ tabla completa de niveles resueltos (con fechas)</li>
              <li>▸ logros, checksum de integridad y diploma sellado</li>
            </ul>
          </div>

          <label className="block space-y-1">
            <span className="text-[11px] uppercase tracking-widest text-frost/70">nombre visible en el PDF</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={34}
              placeholder="p. ej. ruxdev, agente007…"
              className="w-full rounded-lg bg-[#0d1117] border border-edge/60 px-3 py-2 text-sm text-nord6 placeholder:text-frost/40 focus:border-morado outline-none"
            />
          </label>

          <div className="flex gap-2 items-center flex-wrap">
            <button
              onClick={() => void generate()}
              disabled={busy}
              className="rounded-lg bg-morado/25 hover:bg-morado/35 border border-morado/50 text-morado px-3 py-2 text-xs font-medium disabled:opacity-40"
            >
              {busy ? '…generando PDF' : '⬇ generar y descargar PDF'}
            </button>
            <span className="text-[11px] text-frost/60">
              {connected ? 'con sesión activa: incluye el estado completo del servidor' : 'sin servidor: se usa el estado local'}
            </span>
          </div>

          {msg && (
            <div
              className={`text-xs rounded-lg p-2.5 border ${
                msg.kind === 'ok' ? 'bg-verde/10 border-verde/40 text-verde' : 'bg-coral/10 border-coral/40 text-coral'
              }`}
              role="status"
            >
              {msg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
