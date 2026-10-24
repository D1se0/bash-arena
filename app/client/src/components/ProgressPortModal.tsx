import { useEffect, useRef, useState } from 'react';
import { useArena, ensurePlayerId } from '../store';
import {
  checksum8,
  decodeTransferCode,
  downloadJson,
  embeddedPlayerId,
  encodeTransferCode,
  fetchProgress,
  parseProgressFile,
  postImport,
  readAsText,
  adoptPlayerId,
  type ProgressPortFile,
} from '../lib/port';

/**
 * Modal «migrar progreso»: llevarte el progreso del dojo a otro PC.
 *  · Exportar: descarga .json y genera un código de transferencia copiable.
 *  · Importar: desde fichero .json o pegando el código; puedes adoptar la
 *    identidad del jugador del fichero (continuidad total) o hacer merge en
 *    tu jugador local (el servidor favorece lo mejor).
 */
export function ProgressPortModal({ onClose }: { onClose: () => void }) {
  const playerId = useArena((s) => s.playerId) ?? ensurePlayerId();
  const xp = useArena((s) => s.xp);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [code, setCode] = useState('');
  const [pasteVal, setPasteVal] = useState('');
  const [adopt, setAdopt] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const doExport = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const text = await fetchProgress(playerId);
      const state = JSON.parse(text) as ProgressPortFile;
      const stamp = new Date().toISOString().slice(0, 10);
      downloadJson(`bash-arena-progreso-${stamp}.json`, text);
      setCode(encodeTransferCode(state));
      setMsg({
        kind: 'ok',
        text: ` ahora importa: fichero tendría descargado + código generado (${(text.length / 1024).toFixed(1)} KB, check ${checksum8(text).slice(0, 6)})`,
      });
    } catch (e) {
      setMsg({ kind: 'err', text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const finishImport = async (state: ProgressPortFile) => {
    const embedded = embeddedPlayerId(state);
    const target = adopt && embedded ? embedded : playerId;
    const imported = await postImport(target, state);
    if (target !== playerId) {
      adoptPlayerId(target);
      void imported; // tras adoptar otra identidad siempre recargamos
      setTimeout(() => window.location.reload(), 1200);
      setMsg({ kind: 'ok', text: `importado ✓ — continizando como ${target.slice(0, 12)}… (recargando)` });
      return;
    }
    setTimeout(() => window.location.reload(), 1200);
    setMsg({ kind: 'ok', text: `merge completo ✓ — ${imported} nivel(es) (recargando)` });
  };

  const doImportFile = async (f: File | undefined) => {
    if (!f) return;
    setBusy(true);
    setMsg(null);
    try {
      const state = parseProgressFile(await readAsText(f));
      await finishImport(state);
    } catch (e) {
      setMsg({ kind: 'err', text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  const doImportCode = async () => {
    setBusy(true);
    setMsg(null);
    try {
      const state = decodeTransferCode(pasteVal);
      await finishImport(state);
    } catch (e) {
      setMsg({ kind: 'err', text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="migrar progreso"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
      tabIndex={-1}
    >
      <div
        className="arena-pop w-full max-w-xl rounded-xl border border-edge bg-[#161a20] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-edge/70 bg-[#1b2028]">
          <span aria-hidden>🛫</span>
          <span className="font-mono text-xs text-frost/80">migrar progreso del dojo</span>
          <button
            onClick={onClose}
            aria-label="cerrar (Esc)"
            className="ml-auto shrink-0 rounded px-2 py-0.5 text-sm text-frost/70 hover:text-nord6 hover:bg-edge/60"
          >
            ✕
          </button>
        </div>

        <div className="p-4 space-y-5 overflow-y-auto text-sm">
          {/* EXPORTAR */}
          <div className="rounded-lg border border-verde/30 bg-verde/5 p-3 space-y-2">
            <p className="text-[11px] uppercase tracking-widest text-verde/90 flex items-center gap-2">
              <span aria-hidden>▸</span> exportar (jugador {playerId.slice(0, 12)}… · {xp} XP)
            </p>
            <p className="text-frost/75 leading-snug">
              graba un fichero <span className="font-mono text-verde/90">.json</span> con TODO tu progreso
              (niveles, XP, logros y stats) y genera un código de transferencia para copiar.
            </p>
            <button
              onClick={() => void doExport()}
              disabled={busy}
              className="rounded-lg bg-verde/20 hover:bg-verde/30 border border-verde/40 text-verde px-3 py-1.5 text-xs font-medium disabled:opacity-40"
            >
              ⬇ exportar progreso
            </button>
          </div>

          {code && (
            <div className="rounded-lg border border-edge/60 bg-nord0/40 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <p className="text-[11px] uppercase tracking-widest text-frost/70">código de transferencia</p>
                <button
                  onClick={() => void navigator.clipboard.writeText(code).catch(() => undefined)}
                  className="ml-auto rounded bg-panel2 hover:bg-edge px-2 py-0.5 text-[11px]"
                >
                  copiar
                </button>
              </div>
              <textarea
                readOnly
                value={code}
                onFocus={(e) => e.currentTarget.select()}
                rows={4}
                className="w-full text-[10px] font-mono text-frost/80 bg-[#0d1117] border border-edge/40 rounded p-2 resize-y"
                aria-label="código de transferencia"
              />
            </div>
          )}

          {/* IMPORTAR */}
          <div className="rounded-lg border border-ice/30 bg-ice/5 p-3 space-y-2">
            <p className="text-[11px] uppercase tracking-widest text-ice/90 flex items-center gap-2">
              <span aria-hidden>▸</span> importar
            </p>
            <label className="flex items-center gap-2 text-xs text-frost/80 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={adopt}
                onChange={(e) => setAdopt(e.target.checked)}
                className="accent-[#88C0D0]"
              />
              continuar como el jugador del fichero (recomendado al instalar en otro PC)
            </label>

            <div className="flex flex-wrap gap-2 items-center">
              <input
                ref={fileRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  void doImportFile(f);
                  if (fileRef.current) fileRef.current.value = '';
                }}
              />
              <button
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="rounded-lg bg-ice/15 hover:bg-ice/25 border border-ice/40 text-ice px-3 py-1.5 text-xs font-medium disabled:opacity-40"
              >
                📂 desde fichero .json
              </button>
              <button
                onClick={() => void doImportCode()}
                disabled={busy || !pasteVal.trim()}
                className="rounded-lg bg-ice/15 hover:bg-ice/25 border border-ice/40 text-ice px-3 py-1.5 text-xs font-medium disabled:opacity-40"
              >
                📋 desde código pegado
              </button>
            </div>

            <textarea
              value={pasteVal}
              onChange={(e) => setPasteVal(e.target.value)}
              placeholder="BA1-xxxxxxxx-… pega aquí un código de transferencia (tolera saltos de línea)"
              rows={3}
              spellCheck={false}
              className="w-full text-[10px] font-mono text-frost/85 bg-[#0d1117] border border-edge/40 rounded p-2 resize-y placeholder:text-frost/40 focus:border-ice outline-none"
              aria-label="código de transferencia a importar"
            />
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

          <p className="text-[11px] text-frost/50 leading-snug border-t border-edge/40 pt-3">
            importa en otro PC: instala bash-arena, abre la web, «migrar progreso» → el fichero o el
            código → tu XP, rango, niveles y pistas usadas quedan intactos. El import es
            <span className="font-mono"> merge-friendly</span>: nunca pierdes nada de la otra máquina.
          </p>
        </div>
      </div>
    </div>
  );
}
