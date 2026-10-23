# bash-arena

**Plataforma web para aprender Linux de verdad**: una terminal bash real (Ubuntu en Docker) en el navegador, 292 niveles gamificados en 15 tracks (incluidos los de experto grep-pro y awk-pro), flags con HMAC, XP/nivel/rachas y progreso persistente en SQLite. Sin instalar nada: `./scripts/deploy.sh` y a jugar.

![status](https://img.shields.io/badge/niveles-292-green) ![tests](https://img.shields.io/badge/tests-18%2F18%20%2B%2011%2F11%20seguridad-green) ![docker](https://img.shields.io/badge/stack-compose%20%2B%20dockerode-blue)

## Cómo funciona

1. El navegador abre un **WebSocket** (`/ws`) contra el backend.
2. El backend (Node + `dockerode`) crea un contenedor efímero del nivel (Ubuntu + `arena-agent` sin sudo) vía `docker exec` con TTY.
3. El objetivo de cada nivel es un **flag** `FLAG{...}` oculto en el filesystem; se valida **en el servidor** (HMAC-SHA256) y solo ahí se otorga XP.
4. El progreso (niveles superados, XP, hints usados) se guarda en **SQLite** montado en un volumen y sobrevive a `stop`/`update`.

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
| `stop.sh` | apila el stack (conserva el volumen `arena-data`) |
| `status.sh` | estado de contenedores + health URL |
| `logs.sh` | logs en viva del server/web |
| `backup.sh` / `restore.sh` | dump/restore de la SQLite |
| `update.sh` | pull + build + rolls sin perder progreso |

## Estructura

```
app/server   # WebSocket ↔ dockerode, motor de niveles, flags HMAC, SQLite, api
app/client   # React + Vite + xterm.js (terminal en el navegador)
docs-site    # web de documentación (React + Vite + Tailwind) para GitHub Pages
levels/      # 292 niveles (YAML) en 15 tracks: fundamentos…boss, grep-pro, awk-pro
docker/      # ubuntu-dojo, arena-prompt, nginx, compose
scripts/     # deploy/stop/status/logs/backup/restore/update + smoke/e2e/seguridad
```

### Desarrollo local (sin contenedores)

```bash
npm install
npm run dev          # server en tsx watch + vite del client
npm run test:unit    # 18 tests de server (vitest)
node scripts/e2e-smoke.mjs   # smoke E2E con backend real
node scripts/security-tests.mjs  # 11 checks de hardening
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
hints:                    # 3 pistas progresivas (XP penalizado si se usan)
teach: >                  # lección que se muestra al superar el nivel
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

## Documentación

- Web de docs: `docs-site/` (Home · Aprende · Cómo funciona · Despliegue · Técnica · Extras). Desplegada automáticamente a **GitHub Pages** con `.github/workflows/pages.yml`.
- CI en `.github/workflows/ci.yml`: lint, typecheck, tests unitarios + lint de 292 niveles, build de cliente/docs-site, verificación de las 292 soluciones **dentro de Docker** con dockerode, y smoke E2E (WS + dockerode + SQLite).

## Roadmap

- [x] Motor de niveles + flags HMAC + XP/rachas
- [x] Terminal real en el navegador (xterm.js ↔ WebSocket ↔ dockerode)
- [x] 292 niveles en 15 tracks (fundamentos → boss → grep-pro → awk-pro)
- [x] Progreso en SQLite + backup/restore
- [x] Despliegue con un comando (`./scripts/deploy.sh`)
- [x] Web de documentación + GitHub Pages
- [ ] Niveles interactivos (inputs dinámicos, valgrind/ltrace)
- [x] Login para multi-dispositivo
- [ ] Modo torneo / scores por tiempo

MIT — © 2026 bash-arena. Hecho con GLM/Claude en [Freebuff](https://freebuff.com).
