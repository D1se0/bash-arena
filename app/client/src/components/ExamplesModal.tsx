import { useEffect } from 'react';
import type { LevelExample } from '../store';

/**
 * Popup «ejemplos»: cómo debería verse la SALIDA del nivel (sin mostrar el
 * comando). Estilo terminal: ventana con traffic lights, bloques de ejemplo
 * con la flag de demo y nota de que la sesión real trae otra flag.
 */
export function ExamplesModal({
  levelId,
  examples,
  onClose,
}: {
  levelId: string;
  examples: LevelExample[];
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`ejemplos del nivel ${levelId}`}
      onClick={onClose}
    >
      <div
        className="arena-pop w-full max-w-2xl rounded-xl border border-edge bg-[#161a20] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* chrome tipo ventana de terminal */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-edge/70 bg-[#1b2028]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" aria-hidden />
          <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" aria-hidden />
          <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" aria-hidden />
          <span className="ml-2 font-mono text-xs text-frost/80 truncate">
            ejemplos · {levelId}
          </span>
          <button
            onClick={onClose}
            aria-label="cerrar ejemplos (Esc)"
            title="cerrar (Esc)"
            className="ml-auto shrink-0 rounded px-2 py-0.5 text-sm text-frost/70 hover:text-nord6 hover:bg-edge/60"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-4 overflow-y-auto">
          {/* leyenda */}
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="rounded-full bg-verde/10 border border-verde/40 text-verde px-2 py-0.5 font-semibold tracking-wide">
              SALIDA ESPERADA
            </span>
            <span className="rounded-full bg-panel2 border border-edge/60 text-frost/70 px-2 py-0.5">
              sin comando — solo el resultado
            </span>
            <span className="rounded-full bg-panel2 border border-edge/60 text-frost/50 px-2 py-0.5">
              tu sesión trae otra flag
            </span>
          </div>

          {/* ejemplos */}
          {examples.map((ex) => (
            <div key={ex.title}>
              <p className="text-[11px] uppercase tracking-widest text-verde/80 mb-1.5 flex items-center gap-2">
                <span aria-hidden>▸</span>
                {ex.title}
              </p>
              <pre className="rounded-lg bg-[#0d1117] border border-edge/50 px-3.5 py-3 text-[12.5px] leading-relaxed font-mono text-nord6 whitespace-pre-wrap break-words select-all max-h-72 overflow-y-auto">
                {ex.content}
              </pre>
            </div>
          ))}

          <p className="text-[11px] text-frost/50 leading-snug border-t border-edge/40 pt-3">
            estos ejemplos provienen de la solución de referencia con una flag de demo: el
            comando queda oculto a propósito, pero la FORMA de la salida es idéntica a la
            de tu sesión. Busca la posición exacta de la flag (empieza por{' '}
            <span className="font-mono text-morado">FLAG{'{…}'}</span>) y captúrala con{' '}
            <span className="font-mono text-morado">submit FLAG{'{…}'}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
