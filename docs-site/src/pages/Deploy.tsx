const STEPS = [
  { t: 'Requisitos', c: 'Docker 24+ y Compose v2 · Node 22 (para tests y desarrollo) · ~1.5 GB libres para imágenes · Linux/macOS/WSL2 (el agente docker funcionando)' },
  { t: 'Clonar y desplegar', c: 'git clone git@github.com:D1se0/bash-arena.git\ncd bash-arena\n./scripts/deploy.sh' },
  { t: 'Esperar healthchecks', c: 'el script construye dojo-base, server y web; espera a que /api/health responda y muestra las URLs finales' },
  { t: 'Entrar y practicar', c: 'abre http://localhost:8091 — escribe help en la terminal para ver los comandos del dojo y goal para el objetivo del nivel' },
];

const ENV = [
  { k: 'ARENA_FLAG_SECRET', d: 'secreto del HMAC de Flags — deploy.sh genera uno aleatorio si no existe .env' },
  { k: 'ARENA_MAX_SESSIONS / ARENA_MAX_SESSIONS_PER_IP', d: 'límite global (8) y por IP (2) de sesiones simultáneas' },
  { k: 'ARENA_IDLE_TIMEOUT_MIN / ARENA_SESSION_MAX_MIN', d: '15 min de inactividad y 90 min de vida máxima por sesión' },
  { k: 'ARENA_CONTAINER_MEM_MB / CPU / PIDS', d: '256 MB · 0.5 cpu · 128 pids por contenedor de sesión' },
  { k: 'ARENA_HOST_API_PORT / ARENA_HOST_WEB_PORT', d: 'puertos publicados: API en 127.0.0.1:18080 y web en 8091 por defecto' },
];

const FAQ = [
  { q: 'El puerto 8080/8091 está ocupado', a: 'exporta ARENA_HOST_WEB_PORT (y ARENA_HOST_API_PORT) antes de ./scripts/deploy.sh — compose los usa' },
  { q: 'Mi progreso desapareció', a: 'el progreso vive en el volumen docker_arena-data; ./scripts/stop.sh NUNCA lo borra — solo stop.sh --purge/wipe lo hace' },
  { q: '¿Puedo salir y volver más tarde?', a: 'sí: la sesión aguanta reconexiones; tras 15 min de inactividad el contenedor se reclama y un start lo recrea' },
  { q: '¿Hay internet dentro del contenedor?', a: 'no: --network none es deliberado (temario + seguridad). curl/nc/dig apuntan a servicios simulados en loopback' },
  { q: '¿Cómo añado mis propios niveles?', a: 'copia un YAML de levels/ y ajusta setup, pistas y solución; test-levels.mjs lo verificará — guía en Documentación técnica' },
];

export default function Deploy() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Instalación y despliegue</h1>
        <p className="mt-2 text-frost/75 max-w-3xl">
          Del repo clonado al dojo funcionando en cuatro pasos, con un solo comando.
        </p>
      </header>

      <section className="space-y-5">
        {STEPS.map((s, i) => (
          <div key={s.t} className="rounded-xl bg-panel/70 border border-edge/50 p-4">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-morado text-sm">{i + 1}.</span>
              <h2 className="font-semibold text-nord6">{s.t}</h2>
            </div>
            {s.c.includes('\n') ? (
              <pre className="code-surface mt-2 rounded-lg border border-edge/50 p-3 font-mono text-[13px] overflow-x-auto">{s.c}</pre>
            ) : (
              <p className="mt-1 text-sm text-frost/75">{s.c}</p>
            )}
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Comandos útiles</h2>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          {[
            ['./scripts/deploy.sh', 'build + up + healthchecks'],
            ['./scripts/stop.sh', 'detiene; conserva progreso'],
            ['./scripts/stop.sh --purge', 'borra contenedores/imágenes/volúmenes (pide confirmación)'],
            ['./scripts/backup.sh / restore.sh', 'respalda y restaura el volumen de progreso'],
            ['./scripts/status.sh · logs.sh', 'estado del stack · logs en vivo'],
            ['make up / down / purge / test', 'atajos del Makefile'],
          ].map(([c, d]) => (
            <div key={c} className="code-surface rounded-lg border border-edge/50 p-3">
              <p className="font-mono text-ice text-[13px]">{c}</p>
              <p className="text-frost/70 text-xs mt-1">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Variables de entorno (.env)</h2>
        <div className="rounded-xl overflow-hidden border border-edge/50">
          {ENV.map((e, i) => (
            <div key={e.k} className={`p-3 text-sm ${i % 2 ? 'bg-panel/60' : 'bg-panel/40'}`}>
              <p className="font-mono text-ice text-[13px]">{e.k}</p>
              <p className="text-frost/70 text-xs mt-0.5">{e.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">FAQ / problemas frecuentes</h2>
        <div className="space-y-2">
          {FAQ.map((f) => (
            <details key={f.q} className="rounded-lg bg-panel/60 border border-edge/50 p-3 text-sm">
              <summary className="cursor-pointer text-nord6 font-medium">{f.q}</summary>
              <p className="mt-2 text-frost/75 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
