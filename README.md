# bash-arena

**Plataforma web para aprender Linux de verdad**: una terminal bash real (Ubuntu en Docker) en el navegador, 500 niveles gamificados en 18 tracks — de fundamentos a boss, con especialización profunda de grep (50) y awk (50) y tracks de experto (grep-pro, awk-pro, sysadmin, dns, sql) —, flags con HMAC, XP/nivel/rachas e informe PDF de progreso. Sin instalar nada: `./scripts/deploy.sh` y a jugar.

![status](https://img.shields.io/badge/niveles-500-green) ![tests](https://img.shields.io/badge/tests-22%2F22%20%2B%2011%2F11%20seguridad-green) ![docker](https://img.shields.io/badge/stack-compose%20%2B%20dockerode-blue)

## Cómo funciona

1. El navegador abre un **WebSocket** (`/ws`) contra el backend.
2. El backend (Node + `dockerode`) crea un contenedor efímero del nivel (Ubuntu + `arena-agent` sin sudo) vía `docker exec` con TTY.
3. El objetivo de cada nivel es un **flag** `FLAG{...}` oculto en el filesystem; se valida **en el servidor** (HMAC-SHA256) y solo ahí se otorga XP.
4. El progreso (niveles superados, XP, hints usados) se guarda en **SQLite** montado en un volumen (`/data` del server) y sobrevive a `stop`/`update`. Exportable además a **PDF** (informe de progreso del jugador, botón en la sidebar; las pistas/solución miradas DESPUÉS de capturar la flag no cuentan).
5. **Migración entre PCs**: en la sidebar, «🛫 migrar progreso» exporta un `.json` y genera un *código de transferencia* (`BA1-…`) copiable; en otro PC lo importas y sigues donde estabas.

```
navegador ──wss──▶ nginx ──▶ server (ws.ts ─ api.ts ─ dockerode) ──▶ contenedor del nivel (TTY)
                                   │
                                   └── SQLite (docker/arena-data) ◀─ progreso de todos los agentes
```

## Arranque en 1 comando

```bash
./scripts/deploy.sh
```

- Web: **http://localhost:8091** (configurable con `WEB_PORT`/`SERVER_PORT`)
- Los contenedores efímeros se crean por sesión y se destruyen al cerrar o al expirar (30 s sin input → sweeper).

## Scripts operativos

| script | qué hace |
|---|---|
| `deploy.sh` | build + `compose up -d` + espera health checks |
| `stop.sh` | apila el stack (conserva el volumen `arena-data`); `--purge` borra todo |
| `status.sh` | estado de contenedores + health URL |
| `logs.sh` | logs en viva del server/web |
| `backup.sh` / `restore.sh` | dump/restore del tarball de la SQLite |
| `update.sh` | rebuild de imágenes + recreate conservando progreso |
| `test-levels.mjs` | verifica cada solución dentro de su contenedor (Docker) |

## Estructura

```
app/server   # WebSocket ↔ dockerode, motor de niveles, flags HMAC, SQLite, api
app/client   # React + Vite + xterm.js (terminal en el navegador)
docs-site    # web de documentación (React + Vite + Tailwind) para GitHub Pages
levels/      # 500 niveles (YAML) en 18 tracks: fundamentos…boss · grep/awk (50 cada uno) · pros
docker/      # ubuntu-dojo, arena-prompt, nginx, compose
scripts/     # deploy/stop/status/logs/backup/restore/update + test-levels/e2e/seguridad/visual
```

### Desarrollo local (sin contenedores)

```bash
npm install
npm run dev          # server en tsx watch + vite del client
npm run test:unit    # 22 tests de server (vitest)
node scripts/e2e-smoke.mjs       # smoke E2E con backend real
node scripts/e2e-deployed.mjs    # smoke contra el stack desplegado (nginx :8091)
node scripts/security-tests.mjs  # 11 checks de hardening
node scripts/test-web-visual.mjs # visual/funcional del stack con Chromium real
```

### Formato de niveles (`levels/{track}/l{n}.yaml`)

```yaml
id: fundamentals-l1
track: fundamentos       # clave de la pestaña en la UI
title: / subtitle: / xp: / difficulty: / brief: / goal:
setup: |                  # bash que "planta" el reto en el contenedor
  #!/bin/bash
  set -e
  ...
hints:                    # 3 pistas progresivas (XP penalizado si se usan ANTES de resolver)
teach: >                  # lección que se muestra al superar el nivel
solution: cat ~/.flag     # de referencia (libre tras capturar la flag; si no: 2 pistas o 5 fallos)
cheatsheet: [ {cmd,desc} ]
keywords: [...]           # para el buscador de la UI
profile: default          # límites (memoria, pids, red, caps)
```

## Seguridad / hardening

- Contenedor efímero por nivel: user `agent` **sin sudo**, con los caps por defecto.
- **No-new-privileges**, red propia sin salida externa (excepto el registro para las imágenes), `pids-limit`, `mem-limit`, `cpu-period/quota`.
- Hardening verificado con 11 checks (aislamiento FS, red, fork bomb, límites OOM, caps): `scripts/security-tests.mjs`.
- Flags HMAC: nada sensible en el cliente; toda la validación y XP ocurren en el backend.
- Rate limiting por IP y por sesión en WS/API.
- **Repasar tras resolver no penaliza**: una vez capturada la flag, el nivel se puede revisar libremente (pistas sin coste y solución directa); el informe PDF solo refleja lo usado antes de resolver.

## Documentación

- Web de docs: `docs-site/` (Home · Aprende · Funciona · Desplegar · Técnica · Extras · Soluciones · Cheatsheet). Desplegada automáticamente a **GitHub Pages** con `.github/workflows/pages.yml`.
- CI en `.github/workflows/ci.yml`: lint, typecheck, tests unitarios + lint de 500 niveles, build de cliente/docs-site, verificación de las 500 soluciones **dentro de Docker** con dockerode, y smoke E2E (WS + dockerode + SQLite).

## Roadmap

- [x] Motor de niveles + flags HMAC + XP/rachas
- [x] Terminal real en el navegador (xterm.js ↔ WebSocket ↔ dockerode)
- [x] 500 niveles en 18 tracks (fundamentos → boss · grep/awk ×50 · pros)
- [x] Progreso en SQLite + backup/restore + migración entre PCs + informe PDF
- [x] Despliegue con un comando (`./scripts/deploy.sh`)
- [x] Web de documentación + GitHub Pages (+ Cheatsheet y Soluciones)
- [x] Solución libre tras capturar la flag (repasar no penaliza el PDF)
- [ ] Niveles interactivos (inputs dinámicos, valgrind/ltrace)
- [x] Login para multi-dispositivo
- [ ] Modo torneo / scores por tiempo

MIT — © 2026 bash-arena. Hecho con GLM/Claude en [Freebuff](https://freebuff.com).
