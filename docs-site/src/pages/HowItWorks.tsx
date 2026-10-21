import { motion } from 'framer-motion';

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
  { t: 'Timeouts de sesión', d: '15 min de inactividad o 90 min totales — y el(dto sweeper mata contenedores huérfanos en cada arranque.' },
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
        <div className="rounded-xl bg-[#161a20] border border-edge/60 p-5 font-mono text-[13px] leading-relaxed overflow-x-auto">
{`┌──────────────────────────┐       WebSocket (/ws)      ┌────────────────────────────┐
│  Navegador                │ ◄────────────────────────► │  Backend Node.js + TS      │
│  React + xterm.js         │  data · levelState · hint  │  ws + motor de niveles      │
│  menu · XP · pistas       │  submitResult · exit       │  flags HMAC · SQLite        │
└──────────────────────────┘                            │  dockerode                  │
                                                        └─────────────┬───────────────┘
                                                                      │ docker API (socket)
                                                                      ▼
                        ┌─────────────────────────────────── Contenedor Ubuntu efímero ─────────────┐
                        │ 1 por sesión · --network none · cap-drop ALL (+5 caps) · no-new-privileges │
                        │ pids 128 · mem 256MB · cpu 0.5 · setup del nivel como root · shell como agent │
                        └──────────────────────────────────────────────────────────────────────────┘`}
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
          <p><strong className="text-nord6">Verificación automática</strong>: <code className="font-mono">scripts/test-levels.mjs</code> ejecuta cada nivel en un contenedor real: setup → solución → exige exit 0 y la flag en la salida. 53/53 verificados.</p>
        </div>
      </section>
    </div>
  );
}
