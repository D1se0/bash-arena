import { useState } from 'react';
import { useArena } from '../store';

export default function LevelPanel() {
  const level = useArena((s) => s.level);
  const send = useArena((s) => s.send);
  const submit = async () => {
    // mini prompt nativo (evita que la terminal capture la flag larga)
    const flag = window.prompt('pega tu flag (FLAG{...})');
    if (flag) send?.({ type: 'submitFlag', payload: { flag } });
  };
  const [showSheet, setShowSheet] = useState(false);
  const lastSubmit = useArena((s) => s.lastSubmit);
  if (!level) return null;

  return (
    <section className="rounded-xl bg-panel/80 border border-edge/60 p-4 flex flex-col gap-3">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-lg font-semibold text-nord6">
          <span className="text-morado">{level.track}</span> · {level.title}
        </h2>
        <span className="text-xs text-frost/60">
          dificultad {'★'.repeat(level.difficulty)} · {level.xp} XP
        </span>
      </div>

      <p className="text-sm text-frost/85 leading-relaxed">{level.brief}</p>

      {level.solved && level.teach && (
        <div className="rounded-lg border border-verde/40 bg-verde/5 p-3 text-sm">
          <p className="font-semibold text-verde mb-1">¿qué has aprendido?</p>
          <p className="text-frost/85 leading-relaxed whitespace-pre-line">{level.teach}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-xs">
        <button
          onClick={submit}
          className="rounded-lg bg-deep/80 hover:bg-deep px-3 py-1.5 text-nord6 font-medium"
        >
          submit flag…
        </button>
        <button
          onClick={() => send?.({ type: 'hintRequest', payload: {} })}
          className="rounded-lg bg-panel2 hover:bg-edge px-3 py-1.5"
          title="cada pista cuesta XP"
        >
          pista (−10 XP) {level.hintsCount ? `1..${level.hintsCount}` : ''}
        </button>
        <button
          onClick={() => send?.({ type: 'solutionRequest', payload: {} })}
          className="rounded-lg bg-panel2 hover:bg-edge px-3 py-1.5"
          title="disponible tras 2 pistas o 5 intentos fallidos"
        >
          solution
        </button>
        <button
          onClick={() => send?.({ type: 'next', payload: {} })}
          className="rounded-lg bg-panel2 hover:bg-edge px-3 py-1.5"
        >
          siguiente nivel
        </button>
        <button
          onClick={() => setShowSheet((v) => !v)}
          className="rounded-lg bg-panel2 hover:bg-edge px-3 py-1.5"
        >
          cheat sheet
        </button>
      </div>

      {lastSubmit && (
        <div
          className={`arena-pop text-sm rounded-lg p-3 ${
            lastSubmit.passed
              ? 'bg-verde/10 border border-verde/40 text-verde'
              : 'bg-ruby/5 border border-ruby/30 text-coral'
          }`}
        >
          {lastSubmit.passed
            ? `✓ flag correcta · +${lastSubmit.xpGained} XP`
            : 'flag incorrecta — sigue investigando'}
        </div>
      )}

      {showSheet && (
        <div className="rounded-lg bg-[#161a20] border border-edge/60 p-3 text-xs font-mono">
          <p className="text-[11px] uppercase tracking-widest text-frost/60 mb-2">comandos del nivel</p>
          <ul className="space-y-1">
            {level.cheatsheet.map((c) => (
              <li key={c.cmd}>
                <span className="text-ice">{c.cmd}</span>{' '}
                <span className="text-frost/70">— {c.desc}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
