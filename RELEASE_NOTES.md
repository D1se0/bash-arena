# bash-arena v0.1.1 — terminal estable y 216 niveles

Parche de robustez de la terminal y ampliación del dojo a **216 niveles**.

## Qué arregla esta release

- **Tecleado anticipado fiable**: las teclas escritas mientras el shell aún
  imprime el banner/prompt ya no se ejecutan corruptas al Enter
  (antes: «cat.profile: command not found»). El gateway las retiene hasta el
  marcador OSC 133;A del prompt y las inyecta al editor; si nunca llega
  (subshell/paginador) se sueltan como passthrough a los ~300 ms.
- **Flechas, historial y edición interior correctos** (↑↓←→, ←+Backspace a
  mitad de línea) también en pantalla completa, con resincronización del
  readline en cada nuevo prompt y Tab con autocompletado vía exec
  (comandos del PATH + ficheros del cwd real del shell).
- **Sin solapes de UI**: abrir «Capturar flag» o «cheat sheet» ya no hace
  que la terminal pinte sobre el panel del nivel; en desktop el panel cede
  espacio con su propio scroll y en móvil el scroll lo lleva el main.
  Verificado con mediciones de rects reales en 1440/1024/390 px.
- **22 niveles nuevos** (l19 de consolidación + l20 de reto por track)
  y documentación de soluciones regenerada con las 216 guías.

## Despliegue rápido (igual que v0.1.0)

```bash
tar -xzf bash-arena-v0.1.1.tar.gz && cd bash-arena-v0.1.1
docker build -t bash-arena/dojo-base:latest -f docker/ubuntu-dojo.Dockerfile .
./scripts/deploy.sh
# → plataforma en http://localhost:8091 · API en http://localhost:18080
```

sha256: (ver releases/bash-arena-v0.1.1.tar.gz.sha256)

---

# bash-arena v0.1.0 — primera release pública

Plataforma de práctica de Linux con **terminal real** (Ubuntu en Docker),
194 niveles gamificados en 11 secciones, progreso persistente por jugador,
pistas y soluciones desbloqueables, navegador de niveles y sitio de
documentación con guías paso a paso.

## Qué incluye esta release

- **Terminal interactiva real**: xterm.js ⇄ WebSocket ⇄ contenedor Docker
  efímero por sesión con Ubuntu, sin red externa, `cap-drop ALL`,
  `pids-limit 128`, 256 MB RAM.
- **194 niveles en 11 secciones**: fundamentos, lectura y filtrado, búsqueda,
  procesado (sed/awk), permisos, procesos, redes, archivos, bash scripting,
  forense y boss cronometrado; escenarios dinámicos por sesión con flag HMAC
  única (nunca viaja al cliente, validación en servidor).
- **Página local (web)** con pantalla completa de terminal (⛶ + Esc), tweaks
  anti-desborde en móvil/desktop, panel de nivel con cheat sheet, pistas,
  solución paso a paso al desbloquearla, banners alineados y copia de texto
  con Ctrl+C.
- **Navegador de niveles**: catálogo completo por secciones con bloqueo
  progresivo visible, búsqueda por comando («quiero practicar awk») y salto
  directo al nivel.
- **Documentación (GitHub Pages)** nueva sección **«Soluciones paso a paso»**:
  guía detallada de TODOS los niveles — pasos numerados, cada comando
  explicado, cada flag destripada, más pistas y lecciones. (Generada desde
  `levels/*.yaml` por `scripts/gen-walkthroughs.mjs`).
- Estabilidad de sesiones: desalojo inmediato de sesiones huérfanas (pestaña
  cerrada) para no agotar el límite per-IP, gracia de reconexión de 120 s,
  filtros anti-scroll y ecos del shell consistentes.

## Qué hay en el tarball

```
app/server/dist        server compilado (npm node dist/index.js)
app/client/dist        web compilada servida por el mismo server
docs-site/dist         sitio de docs compilado (con soluciones)
levels/                194 niveles YAML (fuente de verdad)
docker/                Dockerfile del dojo + compose del stack
scripts/               deploy.sh, stop.sh, backup.sh, restore.sh, update.sh…
docs/DEPLOY-MANUAL.md  manual de despliegue paso a paso en cualquier Linux
```

## Despliegue rápido en Linux (3 comandos)

```bash
tar -xzf bash-arena-v0.1.0.tar.gz && cd bash-arena-v0.1.0
docker build -t bash-arena/dojo-base:latest -f docker/ubuntu-dojo.Dockerfile .
./scripts/deploy.sh
# → plataforma en http://localhost:8091 · API en http://localhost:18080
```

Requisitos: Docker Engine 24+ y Node ≥ 22 (solo para scripts).
Manual completo: [docs/DEPLOY-MANUAL.md](docs/DEPLOY-MANUAL.md).

## Verificación de integridad

```
sha256: 99e475fcf1ad871cb9a1a332ebc11d2423a672d17ba42df831604b520c83340e
```

## Créditos y licencia

MIT © D1se0 — construye con xterm.js, dockerode, React, Tailwind CSS,
Framer Motion y Node.
