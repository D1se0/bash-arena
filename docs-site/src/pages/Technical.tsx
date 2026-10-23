const WS_MSGS = [
  ['→ hello', '{ playerId } — regístrate (id local de localStorage)'],
  ['← welcome', 'xp, rank, nextRankAt y catálogo de tracks con total de niveles'],
  ['→ start', '{ levelId? } — levantar la sesión para el nivel actual o dado'],
  ['← levelState', 'nivel público (brief, goal, cheatsheet, hintsCount…), startedAt'],
  ['→ input', '{ data } — keystrokes crudos hacia el shell (retención de prefijos reservados según el gateway)'],
  ['← data', '{ data } — salida cruda del shell (para xterm)'],
  ['→ resize', '{ cols, rows } — resolicita del TTY'],
  ['→ submitFlag / ← submitResult', '{ flag } → passed, xpGained, totalXp, rank, nextLevelId'],
  ['→ hintRequest / ← hint', 'pista progresiva (−10 XP) con índice y total'],
  ['→ solutionRequest / ← solution', 'solución de referencia (desbloqueada con 2 pistas o 5 fallos)'],
  ['→ next · reset · statusRequest · goalRequest', 'operaciones del dojo'],
  ['← exit', 'contenedor terminado (idle o fin de sesión)'],
];

const LEVEL_YAML = `id: fundamentos-l2
track: fundamentos
title: Rutas y navegación
xp: 30
difficulty: 1
brief: >
  Historia/misión en 2-3 frases…
goal: Objetivo en una frase.
hints:
  - "pista progresiva 1"
  - "pista progresiva 2"
cheatsheet:
  - {cmd: cd ruta, desc: cambia de directorio}
teach: >
  Explicación post-nivel (¿qué has aprendido?).
setup: |
  #!/bin/bash
  set -e
  arena-prompt "LVL 02" "Fundamentos"
  # genera el escenario… y esconde la flag:
  echo "$DOJO_FLAG" > /home/agent/.secreto
solution: |
  cat /home/agent/.secreto
keywords: [cd, pwd]`;

export default function Technical() {
  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold">Documentación técnica</h1>
        <p className="mt-2 text-frost/75 max-w-3xl">Estructura del repo, protocolo WebSocket, formato de niveles y cómo contribuir.</p>
      </header>

      <section>
        <h2 className="text-xl font-semibold mb-3">Estructura del monorepo</h2>
        <pre className="code-surface rounded-xl border border-edge/60 p-4 font-mono text-[13px] overflow-x-auto">
{`app/
  server/   backend: ws + dockerode + motor de niveles + SQLite (strict TS)
  client/   frontend: React + Vite + xterm.js (fit, web-links)
levels/     un YAML por nivel (15 tracks, 292 niveles) — sin código de motor
docker/     ubuntu-dojo.Dockerfile · server/client Dockerfiles · compose · nginx · arena-prompt
scripts/    deploy · stop · backup · restore · status · logs · update · test-levels · security-tests · e2e
tests/      unitarios (vitest) · informes generados
docs/       arquitectura, threat model, protocolo, contribución
docs-site/  esta web (React + Vite + Tailwind + Framer Motion) — GitHub Pages
.github/    ci.yml (lint/test/build) · pages.yml (deploy de la web)`}
        </pre>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Protocolo WebSocket (JSON por mensaje)</h2>
        <div className="rounded-xl border border-edge/50 overflow-hidden">
          {WS_MSGS.map(([k, d], i) => (
            <div key={k} className={`p-3 text-sm grid sm:grid-cols-[210px_1fr] gap-2 ${i % 2 ? 'bg-panel/60' : 'bg-panel/40'}`}>
              <span className="font-mono text-ice text-[13px]">{k}</span>
              <span className="text-frost/75">{d}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-frost/50 mt-2">
          Rate limiting por IP en mensajes y submiteos; payloads limitados; la intercepción de comandos reservados se hace por prefijo (con eco local) para no romper vim/tmux.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Crear un nivel nuevo</h2>
        <p className="text-sm text-frost/75 mb-3">
          Un nivel es UN fichero YAML — el motor lo carga, valida (id, track, setup, solution, hints…), lo prueba en contenedor
          real y lo publica en el catálogo. Ejemplo con su solución de referencia:
        </p>
        <pre className="code-surface rounded-xl border border-edge/60 p-4 font-mono text-[12.5px] overflow-x-auto">{LEVEL_YAML}</pre>
        <div className="mt-3 rounded-xl bg-panel/60 border border-edge/50 p-4 text-sm text-frost/80 space-y-1">
          <p>· <strong className="text-arena">Reglas de oro</strong>: la solución NUNCA depende del valor de $DOJO_FLAG (el arnés no lo pasa del SCOPE), corre como <code className="font-mono">agent</code> y termina imprimiendo la flag.</p>
          <p>· <strong className="text-arena">Verificación</strong>: <code className="font-mono">node scripts/test-levels.mjs fundamentos</code> — exige exit 0 y la flag exacta; si algo falla, el informe te muestra el stdout capturado.</p>
          <p>· <strong className="text-arena">Lint</strong>: <code className="font-mono">node scripts/lint-levels.mjs</code> valida campos requeridos y sintaxis YAML de los 13 tracks.</p>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">Contribución</h2>
        <div className="rounded-xl bg-panel/60 border border-edge/50 p-4 text-sm text-frost/80 space-y-1">
          <p>· Conventional Commits (<code className="font-mono">feat: …</code>, <code className="font-mono">fix:</code>, <code className="font-mono">docs:</code>…), CI de lint + typecheck + tests por PR.</p>
          <p>· TypeScript estricto; sin <code className="font-mono">any</code> injustificado; Prettier 2 espacios, comillas simples.</p>
          <p>· Cada nivel: brief de la misión, ≥2 pistas graduadas, cheatsheet, solución verificable y teach post-nivel.</p>
          <p>· Security: 0 secretos en el repo; cambios de hardening documentados en SECURITY.md + threat model.</p>
        </div>
      </section>
    </div>
  );
}
