const ROADMAP = [
  { tag: 'v0.1 — publicado', items: ['11 tracks verificados (tanda inicial)', 'terminal real xterm.js ↔ dockerode', 'flags HMAC por sesión', 'progreso SQLite + export/import', 'web de documentación en Pages'] },
  { tag: 'v0.2 — publicado', items: ['expansión a 194 niveles verificados (l13..l18 por track + boss l11..l14)', 'arreglos de robustez de niveles y gateway (eco local del terminal)', 'corrección de textos de la web de documentación'] },
  { tag: 'v0.2.1 — publicado', items: ['292 niveles: ejemplos visuales de salida por nivel (popup «ejemplos» sin comando)', 'migración de progreso entre PCs: export/import con fichero .json y código de transferencia BA1', 'fix: la SQLite de progreso ahora vive en el volumen arena-data (antes un down borraba el progreso)'] },
  { tag: 'v0.2.x — próximo', items: ['modo Sandbox libre con escenarios aleatorios', 'reto diario (seed por fecha)', 'tabla de clasificación local', 'insignias visibles y racha diaria'] },      { tag: 'v0.3 — explorando', items: ['export de progreso → tarjeta compartible', 'modo pantalla completa a doble panel (man-page lateral)', 'tema Matrix/Dracula seleccionable en runtime', 'grabación de sesiones (replay)'] },
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

      <section className="rounded-xl bg-panel/70 border border-edge/50 p-4">
        <h2 className="text-xl font-semibold mb-2 text-nord6">Migra tu progreso entre PCs</h2>
        <p className="text-sm text-frost/80 mb-3">
          En la sidebar: <span className="font-mono text-ice">🛫 migrar progreso</span>. Todo tu
          estado (XP, rango, niveles resueltos, intentos, pistas usadas, logros y stats) viaja en un
          único artefacto portable.
        </p>
        <ol className="list-decimal list-inside space-y-1.5 text-sm text-frost/85">
          <li><strong className="text-nord6">exportar</strong> — descarga un <span className="font-mono">.json</span> (con versión y fecha de export) y genera un <strong className="text-ice">código de transferencia</strong> <span className="font-mono">BA1-&lt;checksum&gt;-&lt;base64&gt;</span> copiable.</li>
          <li><strong className="text-nord6">instalar en otro PC</strong> — <code className="font-mono">./scripts/deploy.sh</code>, abre la web y pulsa «migrar progreso».</li>
          <li><strong className="text-nord6">importar</strong> — por fichero o pegando el código (tolera saltos de línea). Marca «continuar como el jugador del fichero» para continuidad total, o desmárcalo para hacer merge en el jugador local (el servidor favorece lo mejor: XP mayor, nivel solved).</li>
        </ol>
        <p className="text-xs text-frost/60 mt-2">
          Al importar puedes adoptar la identidad del jugador del fichero, y el código lleva
          checksum: si se pega un trozo roto, se rechaza con mensaje claro. API cruda: <span className="font-mono">GET/POST /api/progress/&lt;id&gt;/export|import</span>.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Créditos</h2>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-frost/80">
          {[
            ['xterm.js', 'la terminal de verdad en el navegador'],
            ['dockerode', 'la API Docker desde Node'],
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
