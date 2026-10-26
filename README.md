# bash-arena

Terminal Docker en tu navegador: **536 niveles** de bash reales con
flags escondidas, verificación automática, XP/rangos y pistas.

## Qué hay aquí

- `app/client` — frontend React/Vite (terminal xterm.js + WebSocket)
- `app/server` — servidor Node (engine + gateway WS + Docker sessions)
- `docs-site` — documentación estática desplegada en GitHub Pages
- `levels/` — 18 tracks, 536 niveles declarativos (un YAML por nivel)
- `tests/` — nombre de prueba esperado del reporte (maneja manual de la
  última corrida de `test-levels.mjs`)
- `docker/` — imagen base hardenizada y compose
- `scripts/` — test de niveles, generadores, despliegue

## Arranque rápido

```bash
./scripts/deploy.sh      # build + up
./scripts/status.sh      # ver estado
```

Más detalles en `docs-site` (HowItWorks) y `RELEASE_NOTES.md`.

## Probar los niveles

```bash
node scripts/test-levels.mjs            # todos los tracks
node scripts/test-levels.mjs awk/l5     # subconjunto por substring
```

## Formato del nivel

```yaml
id: awk-l52
track: awk
index: 52
title: / goal / brief
xp / difficulty
setup: |         # correr root; aquí viaja $DOJO_FLAG literal
solution: ...    # la referencia: sale exit 0 e imprime la flag
hints / teach / cheatsheet / keywords
```
