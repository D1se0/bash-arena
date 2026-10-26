import { motion } from 'framer-motion';

function DiagramBox({ title, subtitle, chips, accentClass }: { title: string; subtitle: string; chips: string[]; accentClass: string }) {
  return (
    <div className={`code-surface rounded-xl border ${accentClass} p-4`}>
      <h3 className={`font-bold text-base ${accentClass.split(' ')[0]}`}>{title}</h3>
      <p className="text-[11px] text-frost/60 font-mono mt-0.5">{subtitle}</p>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {chips.map((c) => (
          <span key={c} className="rounded-full bg-panel2/80 border border-edge/50 px-2.5 py-1 text-[11px] text-frost/85">
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

function DiagramArrow({ label, up, down }: { label: string; up: string; down: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-1">
      <span className="text-lg text-edge" aria-hidden>▲</span>
      <div className="flex-1 max-w-xs text-center">
        <p className="text-[11px] font-mono text-frost/70 leading-tight">{up} ▲</p>
        <p className="text-xs font-semibold text-nord4">{label}</p>
        <p className="text-[11px] font-mono text-frost/70 leading-tight">▼ {down}</p>
      </div>
      <span className="text-lg text-edge" aria-hidden>▼</span>
    </div>
  );
}

const FLOW = [
  { step: '1', title: 'hello + start', desc: 'El navegador abre un WebSocket a /ws y se presenta con un playerId local (localStorage). El servidor contesta con XP, rango y catálogo; el front pide el nivel actual o uno concreto.' },
  { step: '2', title: 'Contenedor efímero', desc: 'El backend crea vía dockerode un contenedor Ubuntu hardened: --network none, cap-drop ALL (+caps mínimos), no-new-privileges, pids/mem/cpu limitados. Un script de setup (inyectado como tar y ejecutado como root) genera el escenario del nivel con la flag HMAC del jugador.' },
  { step: '3', title: 'shell interactivo', desc: 'docker exec bash --login (TTY + hijack, demux 8 bytes) queda conectado al WebSocket: tu teclado entra al shell y su salida (con OSC 133 para detectar el prompt) vuelve a xterm.js en tiempo real.' },
  { step: '4', title: 'Intercepción de comandos del dojo', desc: 'Mientras lo que tecleas es prefijo de submit/hint/goal/status/next/reset/solution/help, el gateway lo retiene (con eco local); al pulsar Enter, si es un comando del dojo lo ejecuta el motor (XP, pistas, validación) sin tocar el shell; si no, se entrega tal cual.' },
  { step: '5', title: 'submit + persistencia', desc: 'La flag se valida SIEMPRE en el servidor contra el HMAC de esa sesión. Al acertar: XP (menos pistas), logros, explicación post-nivel y el siguiente nivel disponible; todo queda en SQLite del volumen arena-data.' },
];

const SECURITY = [
  { t: 'Sin red externa', d: 'NetworkingConfig none: ni salida a internet ni redes internas. curl/ss/nc/dig solo contra loopback simulado.' },
  { t: 'cap-drop ALL + subconjunto', d: 'Los contenedores pierden todas las capabilities salvo CHOWN/DAC_OVERRIDE/FOWNER/SETUID/SETGID (necesarias para root corregir permisos del setup). Sin SYS_PTRACE, sin NET_RAW.' },
  { t: 'no-new-privileges', d: 'El agente no obtiene más privilegios por setuid (excepto niveles de permisos, donde el nivel lo exige explícitamente).' },
  { t: 'Límites duros', d: '256MB RAM, 0.5 CPU, pids-limit 128: fork bombs y mineros mueren solos (verificado en scripts/security-tests.mjs).' },
  { t: 'Sin socket Docker', d: 'Solo el backend monta /var/run/docker.sock; los contenedores de usuario nunca lo ven.' },
  { t: 'Timeouts de sesión', d: '15 min de inactividad o 90 min totales — y el sweeper mata contenedores huérfanos en cada arranque.' },
]

export default function HowItWorks() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Cómo funciona</h1>
        <p className="mt-2 text-frost/75 max-w-3xl">
          One contenedor por sesión, un motor de niveles declarativo y un gateway WebSocket
          que intercepa los comandos del dojo sin ensuciar tu terminal. Así se une todo:
        </p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-4">Diagrama de arquitectura</h2>
        <div className="rounded-xl bg-panel/40 border border-edge/50 p-4 sm:p-6">
          <div className="max-w-2xl mx-auto flex flex-col items-stretch gap-2">
            {/* frontal */}
            <DiagramBox
              title="Navegador"
              subtitle="React · xterm.js · WebSocket client"
              chips={['menú de tracks', 'XP y rangos', 'pistas/cheatsheet', 'terminal interactiva']}
              accentClass="text-ice border-ice/40"
            />
            <DiagramArrow up="input · resize · submitFlag · hintRequest" down="data · levelState · hint · submitResult" label="WebSocket /ws (JSON bidireccional)" />
            {/* server */}
            <DiagramBox
              title="Backend Node.js + TypeScript"
              subtitle="gateway WS · motor de niveles · persistencia"
              chips={['flags HMAC por sesión', 'SQLite con progreso', 'rate limiting por IP', 'sesiones y reanudación']}
              accentClass="text-morado border-morado/40"
            />
            <DiagramArrow up="create · exec (tty)" down="stream stdout / stderr" label="Docker API — socket /var/run/docker.sock" />
            {/* container */}
            <DiagramBox
              title="Contenedor Ubuntu efímero"
              subtitle="1 por sesión · hardening completo"
              chips={['--network none', 'cap-drop ALL (+5 mínimas)', 'no-new-privileges', 'pids 128 · mem 256MB · cpu 0.5', 'setup del nivel como root', 'shell como agent']}
              accentClass="text-verde border-verde/40"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Flujo de una sesión</h2>
        <ol className="space-y-4">
          {FLOW.map((f, i) => (
            <motion.li key={f.step} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.06 }}
              className="flex gap-4">
              <span className="rounded-full bg-ice/15 text-ice font-mono text-sm w-8 h-8 grid place-items-center shrink-0">{f.step}</span>
              <div>
                <h3 className="font-semibold text-nord6">{f.title}</h3>
                <p className="text-sm text-frost/75 mt-1 leading-relaxed">{f.desc}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Modelo de seguridad</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {SECURITY.map((s) => (
            <div key={s.t} className="rounded-xl bg-panel/70 border border-edge/50 p-4">
              <h3 className="font-semibold text-verde">{s.t}</h3>
              <p className="mt-1 text-sm text-frost/75 leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-frost/50 mt-3">El modelo completo de amenazas está en <code className="font-mono">SECURITY.md</code> y <code className="font-mono">docs/threat-model.md</code> del repo.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">El sistema de niveles</h2>
        <div className="rounded-xl bg-panel/60 border border-edge/50 p-5 text-sm text-frost/80 leading-relaxed space-y-2">
          <p><strong className="text-nord6">Declarativo</strong>: cada nivel es un YAML en <code className="font-mono">{'levels/<track>/lN.yaml'}</code> con briefing, setup (bash), pistas progresivas, cheatsheet, solución de referencia y explicación post-nivel.</p>
          <p><strong className="text-nord6">Flag por sesión</strong>: el setup recibe <code className="font-mono">$DOJO_FLAG</code> (HMAC de sessionId+nivel) y la esconde donde haga falta; dos jugadores JAMÁS tienen la misma flag.</p>
          <p><strong className="text-nord6">Verificación automática</strong>: <code className="font-mono">scripts/test-levels.mjs</code> ejecuta cada nivel en un contenedor real: setup → solución → exige exit 0 y la flag en la salida. 536/536 verificados (incluye grep-pro y awk-pro, sysadmin, dns y sql).</p>
        </div>
      </section>
    </div>
  );
}
