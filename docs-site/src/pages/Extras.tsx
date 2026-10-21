const ROADMAP = [
  { tag: 'v0.1 — publicado', items: ['11 tracks / 53 niveles verificados', 'terminal real xterm.js ↔ dockerode', 'flags HMAC por sesión', 'progreso SQLite + export/import', 'web de documentación en Pages'] },
  { tag: 'v0.2 — próximo', items: ['modo Sandbox libre con escenarios aleatorios', 'reto diario (seed por fecha)', 'tabla de clasificación local', 'insignias visibles y racha diaria'] },
  { tag: 'v0.3 — explorando', items: ['export de progreso → tarjeta compartible', 'modo pantalla completa a doble panel (man-page lateral)', 'tema Matrix/Dracula seleccionable en runtime', 'grabación de sesiones (replay)'] },
  { tag: 'v1.0 — ideas', items: ['multi-jugador local (ligas)', 'plugin de niveles externos (zip)', 'audit log de comandos con gráficas', 'docker rootless opcional'] },
];

export default function Extras() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Roadmap, changelog y créditos</h1>
      </header>

      <section className="space-y-4">
        {ROADMAP.map((r) => (
          <div key={r.tag} className="rounded-xl bg-panel/70 border border-edge/50 p-4">
            <h2 className="font-semibold text-ice">{r.tag}</h2>
            <ul className="mt-2 space-y-1 text-sm text-frost/80">
              {r.items.map((i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden className="text-morado">▸</span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Créditos</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-frost/80">
          {[
            ['xterm.js', 'la terminal de verdad en el navegador'],
            ['dockerode', 'la存 API Docker desde Node'],
            ['React + Vite + Tailwind + Framer Motion', 'front y esta web'],
            ['better-sqlite3', 'progreso local fiable'],
            ['Ubuntu 24.04', 'la base del dojo'],
            ['D1se0', 'diseño, niveles y arquitectura'],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg bg-panel/60 border border-edge/50 p-3">
              <p className="font-mono text-ice text-[13px]">{k}</p>
              <p className="text-xs mt-0.5">{v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-panel/60 border border-edge/50 p-4 text-sm text-frost/80">
        <h2 className="text-xl font-semibold mb-2 text-nord6">Licencia</h2>
        <p>
          MIT — puedes usar, copiar y modificar el proyecto manteniendo el aviso de
          licencia. Los niveles son contenido original escrito para bash-arena.
        </p>
      </section>
    </div>
  );
}
