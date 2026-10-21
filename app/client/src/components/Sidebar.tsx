import { useArena } from '../store';

function xpBar(xp: number, nextAt: number | null) {
  if (!nextAt) return 100;
  const prev = [0, 150, 400, 800, 1400, 2200].slice(0, 6).reverse().find((v) => v <= xp) ?? 0;
  const span = Math.max(nextAt - prev, 1);
  return Math.min(100, Math.round(((xp - prev) / span) * 100));
}

export default function Sidebar() {
  const welcome = useArena((s) => s.welcome);
  const xp = useArena((s) => s.xp);
  const rank = useArena((s) => s.rank);
  const nextAt = useArena((s) => s.nextRankAt);
  const level = useArena((s) => s.level);
  const connected = useArena((s) => s.connected);
  const theme = useArena((s) => s.theme);
  const setTheme = useArena((s) => s.setTheme);
  const send = useArena((s) => s.send);
  const sessionDead = useArena((s) => s.sessionDead);

  return (
    <aside className="w-full lg:w-[320px] shrink-0 flex flex-col gap-4">
      <section className="rounded-xl bg-panel/80 border border-edge/60 p-4 shadow-glowP">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-frost/70">Rango</p>
            <p className="text-lg font-semibold text-morado">{rank}</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] uppercase tracking-widest text-frost/70">XP</p>
            <p className="text-lg font-semibold text-ice">{xp}</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 rounded-full bg-nord1 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-deep via-ice to-morado transition-all duration-500"
            style={{ width: `${xpBar(xp, nextAt)}%` }}
          />
        </div>
        {nextAt && (
          <p className="mt-1 text-[11px] text-frost/60">siguiente rango en {Math.max(0, nextAt - xp)} XP</p>
        )}
      </section>

      {level ? (
        <section className="rounded-xl bg-panel/80 border border-edge/60 p-4">
          <p className="text-[11px] uppercase tracking-widest text-frost/70">Nivel actual</p>
          <p className="font-semibold text-nord6">
            {level.title}{' '}
            <span className="text-frost/70 text-xs">· {level.id}</span>
          </p>
          <p className="mt-1 text-sm text-frost/80">{level.goal}</p>
          <p className="mt-2 text-xs text-verde/90">+{level.xp} XP al resolverlo</p>
        </section>
      ) : (
        <section className="rounded-xl bg-panel/80 border border-edge/60 p-4 text-sm text-frost/70">
          elige un track en el menú para empezar
        </section>
      )}

      {welcome && (
        <section className="rounded-xl bg-panel/80 border border-edge/60 p-4">
          <p className="text-[11px] uppercase tracking-widest text-frost/70 mb-2">Progreso por track</p>
          <ul className="space-y-1.5 max-h-64 overflow-auto pr-1">
            {welcome.tracks.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm">
                <span aria-hidden>{t.icon}</span>
                <span className="flex-1 truncate" title={t.name}>{t.name}</span>
                <span className="text-xs text-frost/60">{t.solved}/{t.levels}</span>
                <span className="w-16 h-1 rounded bg-nord1 overflow-hidden">
                  <span
                    className="block h-full"
                    style={{ width: `${(t.solved / Math.max(t.levels, 1)) * 100}%`, background: t.color }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-xl bg-panel/80 border border-edge/60 p-4 flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs">
          <span className={`inline-flex items-center gap-1.5 ${connected ? 'text-verde' : 'text-coral'}`}>
            <span className={`w-2 h-2 rounded-full ${connected ? 'bg-verde' : 'bg-coral'} animate-pulse-slow`} />
            {connected ? 'sesión activa' : 'desconectado'}
          </span>
          <button
            onClick={() => setTheme(theme === 'crt' ? 'dark' : 'crt')}
            className="text-frost/70 hover:text-ice underline underline-offset-2"
          >
            {theme === 'crt' ? 'CRT on' : 'CRT off'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => send?.({ type: 'statusRequest', payload: {} })}
            className="rounded-lg bg-panel2 hover:bg-edge px-2 py-1.5 text-left"
          >
            status
          </button>
          <button
            onClick={() => send?.({ type: 'goalRequest', payload: {} })}
            className="rounded-lg bg-panel2 hover:bg-edge px-2 py-1.5 text-left"
          >
            goal
          </button>
          <button
            onClick={() => send?.({ type: 'reset', payload: {} })}
            className="rounded-lg bg-panel2 hover:bg-edge px-2 py-1.5 text-left"
          >
            reset nivel
          </button>
          <button
            onClick={() => send?.({ type: 'start', payload: {} })}
            className="rounded-lg bg-panel2 hover:bg-edge px-2 py-1.5 text-left"
          >
            {sessionDead ? 'reanudar' : 'reiniciar sesión'}
          </button>
        </div>
      </section>
    </aside>
  );
}
