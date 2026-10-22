import { useEffect, useState } from 'react';
import { useArena } from '../store';

export default function LevelPanel() {
  const level = useArena((s) => s.level);
  const send = useArena((s) => s.send);
  const [showSheet, setShowSheet] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [flag, setFlag] = useState('');
  const [shake, setShake] = useState(false);
  const lastSubmit = useArena((s) => s.lastSubmit);
  const hintFlash = useArena((s) => s.hintFlash);
  const resetLevelFx = useArena((s) => s.resetLevelFx);

  // al acertar la flag el formulario se cierra (el banner '=' es el feedback) y
  // los botones vuelven a quedar disponibles
  useEffect(() => {
    if (lastSubmit?.passed) setOpenForm(false);
  }, [lastSubmit?.passed]);

  if (!level) return null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = flag.trim();
    if (!clean) {
      setShake(true);
      setTimeout(() => setShake(false), 400);
      return;
    }
    send?.({ type: 'submitFlag', payload: { flag: clean } });
    setFlag('');
    setShake(false);
  };

  return (
    <section className="rounded-xl bg-panel/80 border border-edge focus:ring-0 p-4 flex flex-col gap-3 min-h-0 overflow-hidden">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-nord6 truncate">
          <span className="text-morado">{level.track}</span> · {level.title}
        </h2>
        <span className="text-xs text-frost/60 shrink-0">
          dificultad {'★'.repeat(level.difficulty)} · {level.xp} XP
        </span>
      </div>

      <p className="text-sm text-frost/85 leading-relaxed">{level.brief}</p>

      {level.teach && (
        <div className="rounded-lg border border-verde/40 bg-verde/5 p-3 text-sm">
          <p className="font-semibold text-verde mb-1">¿qué has aprendido?</p>
          <p className="text-frost/85 leading-relaxed whitespace-pre-line">{level.teach}</p>
        </div>
      )}

      {/* ── enviar flag ────────────────────────────────────────────── */}
      {!openForm && (
        <button
          onClick={() => setOpenForm(true)}
          className="group self-start rounded-lg border border-morado/50 bg-morado/10 hover:bg-morado/20 hover:border-morado/80
                     px-4 py-2 font-semibold text-morado transition-colors outline-none focus-visible:ring-2 ring-morado/60"
          title="captura la flag del nivel"
        >
          <span className="font-mono">★</span> Capturar flag
          <span className="ml-2 font-mono text-[10px] text-frost/50 opacity-70 group-hover:opacity-100">
            FLAG {'{'}…
          </span>
        </button>
      )}

      {openForm && !lastSubmit?.passed && (
        <form
          onSubmit={onSubmit}
          className="rounded-lg border border-morado/40 bg-morado/5 p-3 flex flex-col gap-2"
          aria-label="envío de flag"
        >
          <label htmlFor="flag-input" className="text-[11px] uppercase tracking-widest text-frost/70">
            pega tu flag
          </label>
          <div className="flex gap-2">
            <input
              id="flag-input"
              autoFocus
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') { setOpenForm(false); setFlag(''); }
              }}
              placeholder="FLAG{…}"
              autoComplete="off"
              spellCheck={false}
              className={`${shake ? 'arena-shake ' : ''}flex-1 min-w-0 rounded-lg bg-[#161a20] border border-edge focus:border-morado
                          px-3 py-2 text-sm font-mono text-nord6 outline-none transition-colors`}
            />
            <button
              type="submit"
              className="rounded-lg bg-morado/80 hover:bg-morado px-4 py-2 text-sm font-semibold text-[#FCFCFF] whitespace-nowrap"
            >
              enviar
            </button>
            <button
              type="button"
              onClick={() => { setOpenForm(false); setFlag(''); }}
              title="cerrar (Esc)"
              aria-label="cancelar envío de flag"
              className="rounded-lg bg-panel2 hover:bg-edge px-3 py-2 text-sm"
            >
              ✕
            </button>
          </div>
          <p className="text-[11px] text-frost/50 leading-snug">
            Enter para enviar · la validación ocurre en el servidor · no hagas trampa: cada sesión genera la suya
          </p>
        </form>
      )}

      {lastSubmit && (
        <div
          className={`arena-pop text-sm rounded-lg p-3 flex items-start gap-3 ${
            lastSubmit.passed
              ? 'bg-verde/10 border border-verde/40 text-verde'
              : 'bg-coral/10 border border-coral/40 text-coral'
          }`}
          role="status"
        >
          <span className="flex-1">
            {lastSubmit.passed
              ? `flag correcta · +${lastSubmit.xpGained} XP${lastSubmit.rank ? ` · ${lastSubmit.rank}` : ''}`
              : 'flag incorrecta — sigue investigando'}
          </span>
          {lastSubmit.passed && (
            <button
              type="button"
              onClick={() => resetLevelFx()}
              title="cerrar feedback"
              aria-label="cerrar feedback del flag"
              className="shrink-0 rounded px-2 py-0.5 text-xs hover:bg-verde/20"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {hintFlash?.text && (
        <div className="arena-pop rounded-lg bg-ice/10 border border-ice/30 p-3 text-sm text-ice">
          <span className="text-[11px] uppercase tracking-widest text-frost/70 mr-2">
            pista {hintFlash.index}/{hintFlash.total}
          </span>
          {hintFlash.text}
        </div>
      )}

      {/* ── acciones ─────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={() => setOpenForm(true)}
          disabled={openForm}
          className="rounded-lg bg-deep/80 hover:bg-deep disabled:opacity-40 px-3 py-1.5 text-nord6 font-medium disabled:cursor-not-allowed"
        >
          submit flag…
        </button>
        <button
          onClick={() => send?.({ type: 'hintRequest', payload: {} })}
          className="rounded-lg bg-panel2 hover:bg-edge px-3 py-1.5"
          title="cada pista cuesta XP"
        >
          pista (−10 XP){level.hintsCount ? (level.hintsCount > 1 ? ` · hay ${level.hintsCount}` : '') : ''}
        </button>
        <button
          onClick={() => send?.({ type: 'solutionRequest', payload: {} })}
          className="rounded-lg bg-panel2 hover:bg-edge px-3 py-1.5"
          title="disponible tras 2 pistas o 5 intentos fallidos"
        >
          solution
        </button>
        <button
          onClick={() => {
            resetLevelFx(); // el feedback «flag correcta» pertenece al nivel resuelto
            send?.({ type: 'next', payload: {} });
          }}
          className="rounded-lg bg-panel2 hover:bg-edge px-3 py-1.5"
        >
          siguiente nivel
        </button>
        <button
          onClick={() => setShowSheet((v) => !v)}
          aria-expanded={showSheet}
          className="rounded-lg bg-panel2 hover:bg-edge px-3 py-1.5"
        >
          {showSheet ? 'cerrar cheat sheet' : 'cheat sheet'}
        </button>
      </div>

      {showSheet && (
        <div className="arena-pop rounded-lg bg-[#161a20] border border-edge focus:border-ice max-h-64 overflow-y-auto p-3 text-xs font-mono">
          <p className="text-[11px] uppercase tracking-widest text-frost/60 mb-2">comandos del nivel</p>
          <ul className="divide-y divide-edge/30">
            {level.cheatsheet.map((c) => (
              <li key={c.cmd} className="py-1.5 flex gap-3 items-start">
                <span className="shrink-0 text-ice">{c.cmd}</span>
                <span className="text-frost/70">— {c.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
