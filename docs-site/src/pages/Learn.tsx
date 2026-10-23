const TRACKS = [
  { icon: '🎓', name: 'Fundamentos', color: '#88C0D0', n: 18, tools: 'ls · cd · pwd · cat · touch · mkdir · cp · mv · rm · rutas · globbing · man', boss: 'Laberinto de ficheros con avisos ocultos' },
  { icon: '🔍', name: 'Lectura y filtrado', color: '#81A1C1', n: 18, tools: 'head · tail (-f) · less · wc · cut · sort · uniq · tr', boss: 'Ofuscar y recuperar con tr' },
  { icon: '🔎', name: 'Búsqueda', color: '#5E81AC', n: 18, tools: 'grep (regex ERE) · find (-size, -name) · xargs (-print0)', boss: 'Pipeline forense sobre nombres con espacios' },
  { icon: '⚙️', name: 'Procesamiento de texto', color: '#A3BE8C', n: 18, tools: 'awk · sed · pipes · tee · redirecciones · diff · comm', boss: 'Banco de formatos mezclados clave:valor' },
  { icon: '🔐', name: 'Permisos y usuarios', color: '#EBCB8B', n: 18, tools: 'chmod · chown · umask · sudo · SUID · grupos', boss: 'Bóveda del admin sin permisos +x' },
  { icon: '📟', name: 'Procesos y sistema', color: '#D08770', n: 18, tools: 'ps · pgrep · kill · señales · du · df · lsof · systemctl simulado', boss: 'Unidades de sistema simuladas' },
  { icon: '🌐', name: 'Redes (local)', color: '#BF616A', n: 18, tools: 'nc · curl · ss · dig (dnsmasq en loopback)', boss: 'DNS interno con registros TXT' },
  { icon: '📦', name: 'Archivos y compresión', color: '#B48EAD', n: 18, tools: 'tar · gzip · zip · diff · patch · enlaces simbólicos', boss: 'Cadena de symlinks con trampas' },
  { icon: '📜', name: 'Scripting Bash', color: '#A3BE8C', n: 18, tools: 'for · case · funciones · $@ · getopts · base64', boss: 'Rearmar una flag fragmentada en base64' },
  { icon: '🕵️', name: 'Forense/CTF de logs', color: '#EBCB8B', n: 18, tools: 'grep -v · base64 · grep -a · xxd · rot13 · zcat', boss: 'Exfiltración en base64+gzip' },
  { icon: '⚔️', name: 'Boss / Cronometrado', color: '#BF616A', n: 14, tools: 'find+grep+base64 · mtime · pkill+decode · tar+zip+base64', boss: 'Muñeca rusa de empaquetados' },
  { icon: '🧲', name: 'Grep (especialización)', color: '#8FBCBB', n: 14, tools: 'grep -i · -v · -n · -o · -E · -F · -r · -w · -A/-B · anclas y clases · --include · -x', boss: 'Cadena forense -rh + -oE sobre un árbol de intrusión' },
  { icon: '📐', name: 'Awk (especialización)', color: '#88C0D0', n: 14, tools: 'awk $N · $NF · NF · NR · -F: · comparaciones · regex ~ · máximo+END · asociativos · join FNR==NR · match()', boss: 'Firma del operador: doble filtro + acumulador + END' },
  { icon: '🥇', name: 'Grep Maestro', color: '#5EBA97', n: 24, tools: 'grep -oE (correo/IP/fechas) · -c · -ic · -v en cadena · -rl/-L · -m 1 · -f · -A/-B/-C asimétrico · -E anclado · --include/--exclude · -xF exacto', boss: 'Boss triple filtro: trig sin noise anclado por fecha' },
  { icon: '🏅', name: 'Awk Maestro', color: '#EBCB8B', n: 24, tools: 'awk -F · $2>N umbrales · suma/máximo/promedio · NR y rangos · regex ~ por campo · length · substr/index/split · sub/gsub · printf/sprintf · BEGIN/FS · OFS · arrays dedup/histograma · FNR==NR · match()+RSTART', boss: 'Boss: join con exclusión de lista negra + total con END' },
];

export default function Learn() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Qué se aprende</h1>
        <p className="mt-2 text-frost/75 max-w-3xl">
        15 tracks y 292 niveles declarativos. Cada nivel genera su propio escenario en el
        contenedor: nada de lecturas estáticas ni listas de comandos para memorizar —
        tú investigas, encuentras la flag y subes de rango.
        </p>
      </header>
      <section className="grid md:grid-cols-2 gap-4">
        {TRACKS.map((t) => (
          <article key={t.name} className="rounded-xl bg-panel/70 border border-edge/50 p-4"
            style={{ borderLeft: `3px solid ${t.color}` }}>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-semibold text-nord6">
                <span aria-hidden>{t.icon}</span> {t.name}
              </h2>
              <span className="text-xs text-frost/50">{t.n} niveles</span>
            </div>
            <p className="mt-1 font-mono text-[13px] text-ice/90">{t.tools}</p>
            <p className="mt-2 text-xs text-frost/60">
              <span className="text-arena">reto final:</span> {t.boss}
            </p>
          </article>
        ))}
      </section>
      <section className="rounded-xl bg-panel/60 border border-edge/50 p-5 text-sm text-frost/80 leading-relaxed">
        <h2 className="font-semibold text-nord6 mb-2">¿Y los rangos?</h2>
        <p>
          Cada nivel da XP (menos si usas pistas: −10 XP por pista, suelo del 30 % del valor).
          Los rangos van de <strong className="text-ice">Novato</strong> a
          <strong className="text-morado"> Maestro del Shell</strong> a los 2200 XP; tu prompt
          cambia con cada nivel y la moneda del dojo son las flags.
        </p>
      </section>
    </div>
  );
}
