# bash-arena — manual de despliegue (release compilada)

Esta guía explica cómo desplegar **bash-arena** en cualquier máquina Linux a
partir de la release compilada (`bash-arena-v0.1.0.tar.gz`), que ya incluye los
dists generados (server, cliente web y sitio de docs) y todo el catálogo de
niveles.

## 0. Requisitos

| requisito | versión |
| --- | --- |
| Linux con Docker Engine | 24+ (con soporte de compose v2) |
| Docker socket accesible | `/var/run/docker.sock` (o `ARENA_DOCKER_SOCKET`) |
| Node.js | ≥ 22 (solo para scripts auxiliares/tests; el server ya va compilado) |
| puertos | 8091 (web) y 18080 (API/WS) libres, o los que pongas en `.env` |

## 1. Desempaquetar

```bash
tar -xzf bash-arena-v0.1.0.tar.gz
cd bash-arena-v0.1.0
```

## 2. Imagen base del dojo

Las sesiones de terminal corren en contenedores efímeros construidos sobre
`bash-arena/dojo-base:latest`. Constrúyela una vez desde el código de la
release:

```bash
docker build -t bash-arena/dojo-base:latest -f docker/ubuntu-dojo.Dockerfile .
```

## 3. Despliegue con un comando (recomendado)

```bash
./scripts/deploy.sh
```

El script: genera `.env` desde `.env.example` (con secreto HMAC aleatorio para
las flags), construye las imágenes del server y de la web si no existen,
arranca el stack con `docker compose -f docker/compose.yml up -d` y espera el
healthcheck. Al final imprime:

- plataforma: `http://localhost:8091` (terminal + navegador de niveles)
- API local: `http://localhost:18080` (`/api/health`, catálogo, progreso)

Variantes:

```bash
./scripts/deploy.sh --no-build   # no reconstruir imágenes si ya las tienes
```

## 4. Despliegue manual (sin compose)

Si prefieres controlar cada pieza:

```bash
cp .env.example .env   # ajusta ARENA_FLAG_SECRET (openssl rand -hex 24)
docker compose -f docker/compose.yml up -d   # o docker run del server:
# docker run -d --name bash-arena-server -p 18080:8080 \
#   -v /var/run/docker.sock:/var/run/docker.sock -v "$(pwd)":/app \
#   -e ARENA_DATA_DIR=/app/data node:22 node app/server/dist/index.js
```

El server sirve el cliente web compilado (`app/client/dist`) en el mismo
origen de `/ws` y `/api`, así que no hace falta nginx si publicas solo el
puerto del server (`:8080` dentro del contenedor).

## 5. Configuración (.env)

| variable | defecto | función |
| --- | --- | --- |
| `ARENA_HOST_API_PORT` | `18080` | puerto API/WS publicado |
| `ARENA_HOST_WEB_PORT` | `8091` | puerto de la web publicada |
| `ARENA_MAX_SESSIONS` | `8` | límite global de contenedores de sesión |
| `ARENA_MAX_SESSIONS_PER_IP` | `2` | límite por IP (desaloja huérfanas) |
| `ARENA_IDLE_TIMEOUT_MIN` | `15` | minutos de inactividad antes de soltar sesión |
| `ARENA_SESSION_MAX_MIN` | `90` | vida máxima de una sesión |
| `ARENA_FLAG_SECRET` | — | secreto HMAC para firmar las flags (¡cámbialo!) |
| `ARENA_DATA_DIR` | `./data` | progreso persistente (SQLite) |

## 6. Operación

```bash
./scripts/status.sh        # estado del stack
./scripts/logs.sh          # logs Live
./scripts/stop.sh          # para contenedores (conserva progreso)
./scripts/backup.sh        # copia la base de progreso
./scripts/restore.sh COPIA # restaura progreso
./scripts/update.sh        # actualiza a una nueva release
./scripts/stop.sh --purge  # borra TODO (contenedores + datos)
```

## 7. Sitio de documentación (GitHub Pages)

`docs-site/dist/` contiene el sitio estático (incluye la sección
**«Soluciones paso a paso»** con las guías de los 194 niveles). Sirvelo con
cualquier servidor estático o súblo a una rama `gh-pages`.

## 8. Seguridad

- Cada sesión = un contenedor efímero `agent@dojo` sin red externa, con
  `cap-drop ALL`, `pids-limit 128`, 256 MB de RAM y 0,5 CPU.
- Las flags se generan por sesión con HMAC-SHA256 y **nunca** viajan al
  cliente: la validación ocurre en el server.
- El socket de Docker es el único privilegio del server; sobre él no se
  ejecutan comandos arbitrarios del jugador.
