import { useMemo, useState } from 'react';
import { CHEATSHEET_META, COMMANDS, SECTIONS, type CsCmd } from '../cheatsheet-data';

export default function Cheatsheet() {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return COMMANDS;
    return COMMANDS.filter((c) => {
      const hay = [
        c.name,
        c.tag,
        c.what,
        c.syntax,
        ...c.flags.map((f) => `${f.flag} ${f.detail}`),
        ...c.examples.map((e) => `${e.cmd} ${e.explain} ${e.out ?? ''}`),
        ...(c.tips ?? []),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(query);
    });
  }, [q]);

  const grouped = useMemo(
    () =>
      SECTIONS.map((s) => ({
        ...s,
        cmds: filtered.filter((c) => c.cat === s.cat),
      })).filter((s) => s.cmds.length > 0),
    [filtered],
  );

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-nord6">CheatSheet del dojo</h1>
        <p className="text-sm text-frost/85 max-w-3xl leading-relaxed">
          Cada comando que toca el proyecto (<strong className="text-ice">{CHEATSHEET_META.total}</strong> fichas,{' '}
          <strong className="text-ice">{CHEATSHEET_META.sections}</strong> secciones,{' '}
          <strong className="text-ice">{CHEATSHEET_META.flags}</strong> opciones y{' '}
          <strong className="text-ice">{CHEATSHEET_META.examples}</strong> ejemplos), con todas sus banderas
          explicadas y ejemplos reales de los niveles. Busca, copia y ve a la terminal.
        </p>
      </header>

      <div className="sticky top-14 z-30 flex gap-2 items-center bg-base/90 backdrop-blur px-1 py-2 -mx-1 rounded-xl">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="filtra por comando, bandera o texto… (p. ej. «-o», «uniq -c», «sqlite»)"
          aria-label="filtrar el cheatsheet"
          className="flex-1 min-w-[240px] max-w-xl rounded-lg bg-panel border border-edge/60 px-3 py-2 text-sm text-nord6 placeholder:text-frost/50 focus:border-ice outline-none"
        />
        {q && (
          <button
            onClick={() => setQ('')}
            className="rounded-lg bg-panel2 border border-edge px-3 py-2 text-xs text-frost/80 hover:border-ice/50"
          >
            limpiar ({filtered.length})
          </button>
        )}
      </div>

      <nav className="flex flex-wrap gap-1.5">
        {SECTIONS.map((s) => (
          <a
            key={s.cat}
            href={`#cs-${s.cat}`}
            className="rounded-full px-3 py-1.5 text-xs bg-panel2 border border-edge text-frost/80 hover:border-ice/60 hover:text-ice"
          >
            {s.icon} {s.title}
          </a>
        ))}
      </nav>

      {grouped.map((sec) => (
        <section key={sec.cat} id={`cs-${sec.cat}`} className="scroll-mt-28 space-y-3">
          <div className="flex items-baseline gap-2 border-b border-edge/40 pb-1">
            <span aria-hidden className="text-lg">{sec.icon}</span>
            <h2 className="text-lg font-semibold text-nord6">{sec.title}</h2>
            <span className="text-xs text-frost/60">· {sec.blurb}</span>
          </div>
          {sec.cmds.map((c) => (
            <CmdCard key={c.name} c={c} />
          ))}
        </section>
      ))}

      {grouped.length === 0 && (
        <p className="text-sm text-frost/70">nada coincide con «{q}» en el cheatsheet.</p>
      )}
    </div>
  );
}

function CmdCard({ c }: { c: CsCmd }) {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      setTimeout(() => setCopied(null), 1200);
    } catch {
      /* clipboard bloqueado: sin drama, el texto queda seleccionable */
    }
  };

  return (
    <article className="rounded-xl bg-panel/80 border border-edge/50 p-4 space-y-3">
      <div className="flex flex-wrap items-baseline gap-2">
        <h3 className="font-mono text-lg text-arena">{c.name}</h3>
        <span className="text-sm text-frost/80">— {c.tag}</span>
      </div>
      <p className="text-sm text-text/90 leading-relaxed">{c.what}</p>
      <pre className="font-mono text-[13px] text-text bg-nord0/70 border border-edge/40 rounded-lg px-3 py-2 overflow-x-auto whitespace-pre-wrap">{c.syntax}</pre>

      {c.flags.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-widest text-frost/60 mb-1.5">opciones y parámetros</p>
          <ul className="space-y-1">
            {c.flags.map((f, i) => (
              <li key={i} className="flex gap-2 items-baseline text-sm">
                <code className="font-mono text-ice whitespace-nowrap shrink-0">{f.flag}</code>
                <span className="text-text/85">{f.detail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {c.examples.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-widest text-frost/60 mb-1.5">ejemplos</p>
          <ul className="space-y-2">
            {c.examples.map((ex, i) => (
              <li key={i} className="rounded-lg bg-nord0/50 border border-edge/40 p-2.5">
                <div className="group flex items-start gap-2">
                  <pre className="flex-1 font-mono text-[13px] text-ice overflow-x-auto whitespace-pre-wrap break-all">{`$ ${ex.cmd}`}</pre>
                  <button
                    onClick={() => void copy(ex.cmd)}
                    title="copiar comando"
                    className="shrink-0 rounded bg-panel2 border border-edge px-1.5 py-0.5 text-[10px] text-frost/70 hover:text-ice hover:border-ice/50"
                  >
                    {copied === ex.cmd ? '✓' : '⧉'}
                  </button>
                </div>
                <p className="text-xs text-text/85 mt-1">{ex.explain}</p>
                {ex.out && (
                  <pre className="mt-1.5 ml-4 font-mono text-[12px] text-verde whitespace-pre-wrap">{ex.out}</pre>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {c.tips && c.tips.length > 0 && (
        <div className="rounded-lg bg-arena/10 border border-arena/30 px-3 py-2">
          <p className="text-[11px] uppercase tracking-widest text-arena mb-1">apuntes del dojo</p>
          <ul className="list-disc list-inside space-y-0.5 text-xs text-text/85">
            {c.tips.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </ul>
        </div>
      )}
    </article>
  );
}
