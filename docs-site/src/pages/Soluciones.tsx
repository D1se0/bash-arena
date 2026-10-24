import { useMemo, useState } from 'react';
import { WALKTHROUGHS, TRACK_ORDER, type WalkthroughData, type Step } from '../walkthroughs.generated';

/** Rotulado bonito por track (id interno → nombre público). */
const TRACK_LABELS: Record<string, string> = {
  fundamentos: 'Fundamentos',
  filtrado: 'Lectura y filtrado',
  busqueda: 'Búsqueda',
  procesado: 'Procesado',
  permisos: 'Permisos',
  procesos: 'Procesos',
  redes: 'Redes',
  archivos: 'Archivos',
  scripting: 'Bash scripting',
  forense: 'Forense',
  boss: 'Boss cronometrado',
  grep: 'Grep (especialización)',
  awk: 'Awk (especialización)',
  'grep-pro': 'Grep Maestro',
  'awk-pro': 'Awk Maestro',
};

const TRACK_ICONS: Record<string, string> = {
  fundamentos: '🧭', filtrado: '🗝️', busqueda: '🔎', procesado: '✂️',
  permisos: 'chmod', procesos: '⚙️', redes: '🌐', archivos: '📁',
  scripting: '📜', forense: '🧪', boss: '👑',
  grep: '🧲', awk: '📐',
  'grep-pro': '🥇', 'awk-pro': '🏅',
};

function Stars({ n }: { n: number }) {
  return <span className="text-arena" aria-label={`dificultad ${n} de 5`}>{'★'.repeat(n)}</span>;
}

function CmdDetail({ c }: { c: Step['cmds'][number] }) {
  return (
    <div className="rounded-lg bg-nord0/60 border border-edge/40 p-2.5">
      <p className="font-mono text-[13px] leading-relaxed text-ice break-all">
        <span className="text-coral select-none">$ </span>{c.cmd}{c.args ? ` ${c.args}` : ''}
      </p>
      <p className="text-sm text-text/90 mt-1">{c.why}</p>
      {c.flags.length > 0 && (
        <ul className="mt-1.5 space-y-0.5">
          {c.flags.map((f, i) => (
            <li key={`${f.flag}-${i}`} className="text-xs text-text/80 flex gap-2 items-baseline">
              <code className="text-arena font-mono shrink-0">{f.flag}</code>
              <span>{f.meaning}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function StepBlock({ step, num }: { step: Step; num: number }) {
  const isPipe = step.cmds.length > 1;
  return (
    <li className="space-y-1.5">
      <p className="text-sm text-frost/85">
        {isPipe
          ? `paso ${num} — tubería (el resultado de cada comando entra al siguiente)`
          : `paso ${num}`}
      </p>
      <pre className="font-mono text-[13px] text-text bg-nord0/80 border border-edge/40 rounded-lg px-3 py-2 overflow-x-auto whitespace-pre-wrap break-words">{step.raw}</pre>
      {step.cmds.map((c, i) => <CmdDetail key={i} c={c} />)}
    </li>
  );
}

function LevelCard({ level }: { level: WalkthroughData }) {
  return (
    <details className="group rounded-xl bg-panel border border-edge/50 open:border-ice/40 open:bg-panel2/40">
      <summary className="flex items-center gap-2 flex-wrap cursor-pointer list-none px-4 py-3 select-none">
        <span aria-hidden className="text-base">{TRACK_ICONS[level.track] ?? '•'}</span>
        <span className="font-mono text-[11px] text-frost/60">{level.id}</span>
        <span className="font-semibold text-nord6">{level.title}</span>
        {level.subtitle && <span className="text-xs text-frost/60">· {level.subtitle}</span>}
        <span className="ml-auto flex items-center gap-2 text-xs text-frost/70">
          <Stars n={level.difficulty} />
          <span className="text-ice">{level.xp} XP</span>
          <span className="text-frost/50 group-open:hidden">▶ solución</span>
          <span className="hidden group-open:inline text-ice/80">▲</span>
        </span>
      </summary>
      <div className="px-4 pb-4 space-y-4 border-t border-edge/30 pt-3">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-frost/60 mb-1">objetivo</p>
          <p className="text-sm text-text/95">{level.goal}</p>
        </div>
        {level.brief !== level.goal && (
          <div>
            <p className="text-[11px] uppercase tracking-widest text-frost/60 mb-1">contexto</p>
            <p className="text-sm text-text/85">{level.brief}</p>
          </div>
        )}

        <div>
          <p className="text-[11px] uppercase tracking-widest text-frost/60 mb-2">solución paso a paso</p>
          <ol className="space-y-3 list-none">
            {level.steps.map((s, i) => <StepBlock key={i} step={s} num={i + 1} />)}
          </ol>
        </div>

        <div className="rounded-lg bg-nord0/50 border border-verde/30 p-3">
          <p className="text-[11px] uppercase tracking-widest text-verde mb-1">qué aprenderás</p>
          <p className="text-sm text-text/90">{level.teach}</p>
        </div>

        {level.hints.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-widest text-frost/60 mb-1">pistas que da el dojo (en orden)</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-text/85">
              {level.hints.map((h, i) => <li key={i}>{h}</li>)}
            </ol>
          </div>
        )}

        {level.examples.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-widest text-verde/90 mb-1">salida esperada (flag demo · comando oculto)</p>
            {level.examples.map((ex) => (
              <div key={ex.title} className="rounded-lg border border-verde/30 overflow-hidden">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-verde/10 border-b border-verde/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-verde" aria-hidden />
                  <span className="text-xs text-verde/90">{ex.title}</span>
                </div>
                <pre className="px-3 py-2.5 text-xs leading-relaxed text-text bg-nord0/80 whitespace-pre-wrap break-words overflow-x-auto">{ex.content}</pre>
              </div>
            ))}
          </div>
        )}

        <div>
          <p className="text-[11px] uppercase tracking-widest text-frost/60 mb-1">comandos de referencia (cheat sheet)</p>
          <ul className="space-y-1 text-xs font-mono">
            {level.cheatsheet.map((c, i) => (
              <li key={i} className="flex flex-wrap gap-2 items-baseline">
                <code className="text-ice">{c.cmd}</code>
                <span className="text-frost/70 font-sans">— {c.desc}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-[11px] text-frost/50 leading-snug">
          La FLAG{'{'}…{'}'} concreta cambia en cada sesión de juego ($DOJO_FLAG del contenedor):
          reproduce los pasos, mira la salida y valida con <code className="font-mono">submit FLAG{'{...}'}</code>.
        </p>
      </div>
    </details>
  );
}

export default function Soluciones() {
  const [query, setQuery] = useState('');
  const [track, setTrack] = useState<string | null>(null);

  const filtered: WalkthroughData[] = useMemo(() => {
    const q = query.trim().toLowerCase();
    return WALKTHROUGHS.filter((l) => {
      if (track && l.track !== track) return false;
      if (!q) return true;
      return (
        l.id.includes(q) ||
        l.title.toLowerCase().includes(q) ||
        l.goal.toLowerCase().includes(q) ||
        l.keywords.some((k) => k.toLowerCase().includes(q)) ||
        l.raw.toLowerCase().includes(q)
      );
    });
  }, [query, track]);

  const grouped = useMemo(() => TRACK_ORDER
    .map((t) => ({ track: t, levels: filtered.filter((l) => l.track === t) }))
    .filter((g) => g.levels.length > 0), [filtered]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-nord6">Soluciones paso a paso</h1>
        <p className="text-sm text-frost/85 max-w-3xl leading-relaxed">
          Guías completas para los <strong className="text-ice">{WALKTHROUGHS.length}</strong> niveles del dojo:
          cada solución está troceada en pasos numerados, cada comando explicado (qué hace y por qué está
          ahí) y cada flag destripada. Úsalo para aprender, no para copiar: en la terminal real la flag
          concreta cambia en cada sesión y el nivel se resuelve con tu propio trabajo.
        </p>
      </header>

      <div className="rounded-xl bg-panel/60 border border-arena/30 p-3 text-sm text-text/90">
        <strong className="text-arena">⚠ spoiles:</strong> esto son las soluciones completas. Si prefieres
        intentarlo por tu cuenta, empieza por el nivel, luego <code className="font-mono">hint</code>
        (pista parcial) y solo acude aquí atascado.
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="buscar: awk, chmod, find, nivel…"
          aria-label="buscar soluciones"
          className="flex-1 min-w-[220px] max-w-md rounded-lg bg-panel border border-edge/60 px-3 py-2 text-sm text-nord6 placeholder:text-frost/50 focus:border-ice outline-none"
        />
        <button
          onClick={() => setTrack(null)}
          className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${track === null ? 'bg-ice/20 border-ice text-ice' : 'bg-panel2 border-edge text-frost/80 hover:border-ice/50'}`}
        >
          todos ({WALKTHROUGHS.length})
        </button>
        {TRACK_ORDER.map((t) => (
          <button
            key={t}
            onClick={() => setTrack((v) => (v === t ? null : t))}
            className={`rounded-full px-3 py-1.5 text-xs border transition-colors ${track === t ? 'bg-ice/20 border-ice text-ice' : 'bg-panel2 border-edge text-frost/80 hover:border-ice/50'}`}
          >
            {TRACK_ICONS[t]} {TRACK_LABELS[t]}
          </button>
        ))}
      </div>

      {grouped.map((g) => (
        <section key={g.track} className="space-y-2">
          <h2 className="text-lg font-semibold text-nord6 flex items-baseline gap-2">
            <span aria-hidden>{TRACK_ICONS[g.track]}</span>
            {TRACK_LABELS[g.track]}
            <span className="text-xs font-normal text-frost/60">
              {g.levels.length} nivel(es) · pasos detallados y flags explicadas
            </span>
          </h2>
          <div className="space-y-2">
            {g.levels.map((l) => <LevelCard key={l.id} level={l} />)}
          </div>
        </section>
      ))}

      {grouped.length === 0 && (
        <p className="text-sm text-frost/70">sin resultados para «{query}»</p>
      )}
    </div>
  );
}
