import { useEffect, useMemo, useState } from 'react';
import { useArena, type PublicLevel, type TrackInfo } from '../store';

/**
 * Navegador de niveles: catálogo completo del dojo por tracks con progreso,
 * bloqueo progresivo visible (🔒 hasta resolver el anterior) y búsqueda por
 * comando/keyword («quiero practicar awk» → los niveles que lo cubren).
 * Los niveles bloqueados se ven siempre; solo no se pueden jugar todavía.
 */

interface Row {
  level: PublicLevel;
  track: TrackInfo | undefined;
  locked: boolean;
  isNext: boolean;
}

export default function LevelBrowser() {
  const open = useArena((s) => s.browserOpen);
  const setOpen = useArena((s) => s.setBrowserOpen);
  const welcome = useArena((s) => s.welcome);
  const send = useArena((s) => s.send);
  const level = useArena((s) => s.level);
  const playerId = useArena((s) => s.playerId);
  const passedAt = useArena((s) => s.lastSubmit?.passed);

  const initialTrack = useArena((s) => s.browserTrack);
  const [levels, setLevels] = useState<PublicLevel[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [activeTrack, setActiveTrack] = useState<string | null>(initialTrack);

  // (re)carga al abrir y al resolver un nivel (progreso cambia)
  useEffect(() => {
    if (!open || !playerId) return;
    let dead = false;
    setError(null);
    fetch(`/api/levels?playerId=${encodeURIComponent(playerId)}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((j: { levels: PublicLevel[] }) => { if (!dead) setLevels(j.levels); })
      .catch((e) => { if (!dead) setError(String(e.message ?? e)); });
    return () => { dead = true; };
  }, [open, playerId, passedAt]);

  // al abrir con track preseleccionado (desde el sidebar) se aplica
  useEffect(() => {
    if (open) { setActiveTrack(initialTrack); setQuery(''); }
  }, [open, initialTrack]);

  // Esc cierra el navegador
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); setOpen(false); }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [open, setOpen]);

  const tracks = welcome?.tracks ?? [];

  const { rows, solvedCount } = useMemo(() => {
    if (!levels) return { rows: [] as Row[], solvedCount: 0 };
    const solvedByTrack = new Map<string, number>();
    for (const l of levels) {
      if (l.solved) solvedByTrack.set(l.track, (solvedByTrack.get(l.track) ?? 0) + 1);
    }
    const sameTrack = levels
      .filter((l) => activeTrack === null || l.track === activeTrack)
      .filter((l) => l.track !== 'boss' || activeTrack === 'boss');
    const isSearching = query.trim().length > 0;
    const q = query.trim().toLowerCase();
    const filtered = isSearching
      ? levels.filter((l) =>
          l.id.toLowerCase().includes(q) ||
          l.title.toLowerCase().includes(q) ||
          (l.subtitle ?? '').toLowerCase().includes(q) ||
          l.keywords.some((k) => k.toLowerCase().includes(q)))
      : sameTrack;
    const rowsOut: Row[] = filtered.map((l) => {
      const idx = levels.filter((x) => x.track === l.track).findIndex((x) => x.id === l.id);
      const prevSame = levels.filter((x) => x.track === l.track)[idx - 1];
      const locked = !l.solved && !(l.track === 'boss'
        ? idx === 0 || levels.filter((x) => x.track === 'boss')[idx - 1]?.solved
        : l.index === 0 || (prevSame?.solved ?? true));
      return {
        level: l,
        track: tracks.find((t) => t.id === l.track),
        locked,
        isNext: !l.solved && !locked,
      };
    });
    const solvedTotal = levels.filter((l) => l.solved).length;
    return { rows: rowsOut, solvedCount: solvedTotal };
  }, [levels, tracks, query, activeTrack]);

  const play = (row: Row) => {
    if (row.locked) return;
    setOpen(false);
    useArena.getState().resetLevelFx();
    send?.({ type: 'start', payload: { levelId: row.level.id } });
  };

  if (!open) return null;

  const total = levels?.length ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="navegador de niveles"
      onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
    >
      <div className="arena-pop w-full max-w-3xl max-h-full flex flex-col rounded-xl bg-panel border border-edge shadow-glowP overflow-hidden">
        {/* cabecera */}
        <div className="shrink-0 p-4 border-b border-edge/60 flex items-center gap-3 flex-wrap">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-nord6 leading-tight">Niveles del dojo</h2>
            <p className="text-xs text-frost/60">
              {levels === null ? 'cargando catálogo…' : `${solvedCount}/${total} resueltos · busca por comando o nivel`}
            </p>
          </div>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { const first = rows.find((r) => !r.locked); if (first) play(first); } }}
            placeholder="practicar… (awk, grep, find, chmod…)"
            aria-label="buscar niveles por comando o tema"
            spellCheck={false}
            className="min-w-[220px] flex-1 rounded-lg bg-[#161a20] border border-edge focus:border-ice px-3 py-2 text-sm font-mono text-nord6 outline-none transition-colors"
          />            <button
              onClick={() => setOpen(false)}
              aria-label="cerrar navegador de niveles"
              className="rounded-lg bg-panel2 hover:bg-edge px-3 py-2 text-sm shrink-0"
            >
              ✕
            </button>
        </div>

        {/* tracks (solo fuera de búsqueda) */}
        {!query.trim() && (
          <div className="shrink-0 px-4 pt-3 pb-2 flex gap-1.5 flex-wrap border-b border-edge/30">
            <button
              onClick={() => setActiveTrack(null)}
              className={`rounded-full px-3 py-1 text-xs border transition-colors ${
                activeTrack === null ? 'bg-ice/20 border-ice text-ice' : 'bg-panel2 border-edge text-frost/80 hover:border-ice/50'
              }`}
            >
              todos ({total})
            </button>
            {tracks.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTrack((v) => (v === t.id ? null : t.id))}
                className={`rounded-full px-3 py-1 text-xs border transition-colors flex items-center gap-1.5 ${
                  activeTrack === t.id ? 'bg-ice/20 border-ice text-ice' : 'bg-panel2 border-edge text-frost/80 hover:border-ice/50'
                }`}
                title={t.description}
              >
                <span aria-hidden>{t.icon}</span>
                {t.name}
                <span className="text-frost/50 tabular-nums">
                  {typeof t.solved === 'number' && typeof t.levels === 'number' ? `${t.solved}/${t.levels}` : ''}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* listado */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-2" data-testid="level-browser-list">
          {error && (
            <p className="text-sm text-coral p-3">no se pudo cargar el catálogo: {error}</p>
          )}
          {levels !== null && rows.length === 0 && !error && (
            <p className="text-sm text-frost/60 p-3">
              {query ? 'sin resultados para esa búsqueda' : 'sin niveles en esta sección'}
            </p>
          )}
          {rows.map((row) => {
            const active = level?.id === row.level.id;
            return (
              <div
                key={row.level.id}
                className={`rounded-lg p-3 flex items-start gap-3 border transition-colors ${
                  row.locked
                    ? 'bg-panel2/40 border-edge/40 opacity-70'
                    : active
                      ? 'bg-morado/10 border-morado/60'
                      : 'bg-panel2/60 border-edge/50 hover:border-ice/40'
                }`}
              >
                <span aria-hidden className="shrink-0 mt-0.5 text-base" title={row.locked ? 'nivel bloqueado: resuelve el anterior' : row.level.solved ? 'nivel resuelto' : 'nivel disponible'}>
                  {row.locked ? '🔒' : row.level.solved ? '✅' : !active ? '🎯' : '▶️'}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-semibold text-nord6 text-sm">{row.level.title}</span>
                    <span className="font-mono text-[10px] text-frost/40">{row.level.id}</span>
                    {active && <span className="text-[10px] uppercase tracking-widest text-morado">en curso</span>}
                  </div>
                  {row.level.subtitle && (
                    <p className="text-xs text-frost/70 mt-0.5">{row.level.subtitle}</p>
                  )}
                  <p className="text-xs text-frost/60 mt-1 line-clamp-2">{row.level.goal}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5 text-[10px] font-mono">
                    <span className="rounded bg-nord1/60 px-1.5 py-0.5 text-frost/70">
                      {row.track?.icon} {row.track?.name ?? row.level.track}
                    </span>
                    <span className="rounded bg-nord1/60 px-1.5 py-0.5 text-ice">{row.level.xp} XP</span>
                    <span className="rounded bg-nord1/60 px-1.5 py-0.5 text-coral">{'★'.repeat(row.level.difficulty)}</span>
                    <span className="rounded bg-nord1/60 px-1.5 py-0.5 text-frost/60">{row.level.hintsCount} pistas</span>
                    {row.level.keywords.slice(0, 4).map((k) => (
                      <span key={k} className="rounded bg-deep/50 px-1.5 py-0.5 text-frost/60">{k}</span>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => play(row)}
                  disabled={row.locked}
                  title={row.locked ? 'resuelve el nivel anterior de esa sección para desbloquearlo' : 'iniciar este nivel'}
                  className={`shrink-0 self-center rounded-lg px-3 py-1.5 text-xs font-semibold whitespace-nowrap ${
                    row.locked
                      ? 'bg-panel2 text-frost/40 cursor-not-allowed'
                      : active
                        ? 'bg-morado/80 text-[#FCFCFF] hover:bg-morado'
                        : 'bg-deep text-nord6 hover:bg-ice hover:text-[#0d1117]'
                  }`}
                >
                  {row.locked ? '🔒 bloqueado' : active ? '▶ volver' : '▶ jugar'}
                </button>
              </div>
            );
          })}
        </div>

        {/* pie: cómo se desbloquea */}
        <div className="shrink-0 px-4 py-2 border-t border-edge/40 text-[11px] text-frost/50 flex items-center justify-between gap-2 flex-wrap">
          <span>
            🔒 se desbloquea resolviendo el nivel anterior de su sección · ✅ resuelto · 🎯 disponible
          </span>
          <span className="hidden sm:block">Enter juega el primer nivel disponible</span>
        </div>
      </div>
    </div>
  );
}
