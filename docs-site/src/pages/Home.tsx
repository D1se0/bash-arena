import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import TermDemo from '../components/TermDemo';

const FEATURES = [
  { icon: '🖥️', title: 'Terminal real de Ubuntu', desc: 'no es un emulador: un contenedor Docker efímero por sesión con coreutils, grep, awk, sed, tar… vía WebSocket con xterm.js' },
  { icon: '🏁', title: '11 tracks progresivos', desc: 'de ls hasta awk, forense y niveles boss cronometrados: 194 niveles con curva de dificultad real' },
  { icon: '🔐', title: 'Flags por sesión', desc: 'HMAC-SHA256 con tu sessionId: la flag de tu vecino no te sirve; validación siempre en servidor' },
  { icon: '🛡️', title: 'Aislamiento real', desc: 'sin red externa, cap-drop ALL, no-new-privileges, límites de CPU/mem/pids, sin socket Docker montado' },
  { icon: '💾', title: 'Progreso persistente', desc: 'SQLite en volumen Docker: niveles, XP, rachas y pistas sobreviven a los reinicios; export/import JSON' },
  { icon: '🎨', title: 'Terminal con estilo', desc: 'prompt PS1 por nivel y rango, temas (Nord·Dracula, CRT opcional), atajos de teclado y accesos rápidos' },
];

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="grid lg:grid-cols-2 gap-8 items-center">
        <div>
          <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-4xl sm:text-5xl font-bold leading-tight">
            Practica Linux <span className="text-ice">de verdad</span>,
            <br />con una terminal <span className="text-morado">real</span> en tu navegador
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-frost/80 leading-relaxed">
            <strong className="text-ice">bash-arena</strong> lanza un contenedor Ubuntu efímero por sesión
            y te pide atrapar flags con las herramientas del track. Cada nivel es una misión
            declarativa (YAML) con escenas generadas al vuelo: logs, permisos, demonios y ficheros sospechosos…
          </motion.p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="https://github.com/D1se0/bash-arena"
              className="rounded-lg bg-deep hover:bg-ice/60 px-4 py-2 font-medium text-nord6">
              ⭐ Ver el repo
            </a>
            <Link to="/desplegar" className="rounded-lg border border-edge px-4 py-2 hover:bg-edge/40">
              Desplegarlo en tu máquina
            </Link>
          </div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.15 }}>
          <TermDemo />
          <p className="text-xs text-frost/50 mt-2 text-center">demo animada — en la plataforma es una terminal real</p>
        </motion.div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Quickstart</h2>
        <pre className="rounded-xl bg-[#161a20] border border-edge/60 p-4 font-mono text-sm overflow-x-auto">
{`git clone git@github.com:D1se0/bash-arena.git
cd bash-arena
./scripts/deploy.sh      # construye, levanta el stack y espera healthchecks
# → abre http://localhost:8091 y escribe \`help\` en la terminal`}
        </pre>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Características</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.35, delay: i * 0.05 }}
              className="rounded-xl bg-panel/70 border border-edge/50 p-4 hover:border-ice/40 transition-colors">
              <p className="text-2xl mb-2" aria-hidden>{f.icon}</p>
              <h3 className="font-semibold text-nord6">{f.title}</h3>
              <p className="mt-1 text-sm text-frost/75 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-edge/50 bg-panel/50 p-6">
        <h2 className="text-xl font-semibold mb-2">¿Para quién es?</h2>
        <p className="text-frost/80 text-sm leading-relaxed">
          Estudiantes que arrancan en Linux, administradores que quieren repasar tuberías y permisos,
          aspirantes a SOC/forense que aprenden a leer logs sin miedo — y curiosos que prefieren
          practicar con retos de verdad antes que leer otro tutorial.
        </p>
      </section>
    </div>
  );
}
