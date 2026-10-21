# Contribuir a bash-arena

¡Gracias por tu interés! Este documento describe cómo contribuir.
Preguntas no cubiertas aquí: abre una issue primero.

## Cómo empezar

```bash
git clone git@github.com:D1se0/bash-arena.git
cd bash-arena
npm install            # workspaces + herramientas
make dev               # backend + frontend en modo desarrollo
```

## Estándares de código

- **TypeScript estricto** (`strict: true`), sin `any` sin justificar.
- **Conventional Commits**: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:` ….
- Prettier + ESLint deben pasar: `npm run lint && npm run format:check`.
- Cada nivel nuevo debe tener solución verificada:
  `./scripts/test-levels.sh <track>/<id>` debe pasar.

## Añadir un nivel

Consulta `docs/creating-levels.md`: un nivel es un YAML declarativo en
`/levels/<track>/<id>.yaml` con su setup, hints, solución de referencia y
verificación automática. No hace falta tocar código del motor.

## Proceso

1. Crea una rama desde `main`: `feat/xxx` o `fix/xxx`.
2. Commits pequeños y semánticos.
3. Abre PR; la CI ejecuta lint, typecheck, tests y build.

## Código de conducta

Ver `CODE_OF_CONDUCT.md`.
