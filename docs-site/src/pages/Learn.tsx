const TRACKS = [
  { icon: '🎓', name: 'Fundamentos', color: '#88C0D0', n: 5, tools: 'ls · cd · pwd · cat · touch · mkdir · cp · mv · rm · rutas · globbing · man', boss: 'Laberinto de ficheros con avisos ocultos' },
  { icon: '🔍', name: 'Lectura y filtrado', color: '#81A1C1', n: 5, tools: 'head · tail (-f) · less · wc · cut · sort · uniq · tr', boss: 'Ofuscar y recuperar con tr' },
  { icon: '🔎', name: 'Búsqueda', color: '#5E81AC', n: 5, tools: 'grep (regex ERE) · find (-size, -name) · xargs (-print0)', boss: 'Pipeline forense sobre nombres con espacios' },
  { icon: '⚙️', name: 'Procesamiento de texto', color: '#A3BE8C', n: 5, tools: 'awk · sed · pipes · tee · redirecciones · diff · comm', boss: 'Banco de formatos mezclados clave:valor' },
  { icon: '🔐', name: 'Permisos y usuarios', color: '#EBCB8B', n: 5, tools: 'chmod · chown · umask · sudo · SUID · grupos', boss: 'Bóveda del admin sin permisos +x' },
  { icon: '📟', name: 'Procesos y sistema', color: '#D08770', n: 5, tools: 'ps · pgrep · kill · señales · du · df · lsof · systemctl simulado', boss: 'Unidades de sistema simuladas' },
  { icon: '🌐', name: 'Redes (local)', color: '#BF616A', n: 4, tools: 'nc · curl · ss · dig (dnsmasq en loopback)', boss: 'DNS interno con registros TXT' },
  { icon: '📦', name: 'Archivos y compresión', color: '#B48EAD', n: 5, tools: 'tar · gzip · zip · diff · patch · enlaces simbólicos', boss: 'Cadena de symlinks con trampas' },
  { icon: '📜', name: 'Scripting Bash', color: '#A3BE8C', n: 5, tools: 'for · case · funciones · $@ · getopts · base64', boss: 'Rearmar una flag fragmentada en base64' },
  { icon: '🕵️', name: 'Forense/CTF de logs', color: '#EBCB8B', n: 5, tools: 'grep -v · base64 · grep -a · xxd · rot13 · zcat', boss: 'Exfiltración en base64+gzip' },
  { icon: '⚔️', name: 'Boss / Cronometrado', color: '#BF616A', n: 4, tools: 'find+grep+base64 · mtime · pkill+decode · tar+zip+base64', boss: 'Muñeca rusa de empaqués' },
];

export default function Learn() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Qué se aprende</h1>
        <p className="mt-2 text-frost/75 max-w-3xl">
          11 tracks y 53 niveles declarativos. Cada nivel genera su propio escenario en el
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
