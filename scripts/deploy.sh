#!/usr/bin/env bash
# bash-arena — deploy.sh: despliega todo el stack con un único comando
set -euo pipefail

# ── colores ────────────────────────────────────────────────────────────────
G=$'\e[38;5;114m'; B=$'\e[38;5;110m'; P=$'\e[38;5;140m'; Y=$'\e[38;5;142m'; R=$'\e[38;5;203m'; N=$'\e[0m'
step()  { printf '%s▸ %s%s\n' "$B" "$1" "$N"; }
ok()    { printf '%s✓ %s%s\n' "$G" "$1" "$N"; }
warn()  { printf '%s⚠ %s%s\n' "$Y" "$1" "$N"; }
fail()  { printf '%s✗ %s%s\n' "$R" "$1" "$N"; exit 1; }

usage() {
  cat <<EOF
${P}bash-arena deploy${N} — levanta contenedores, imágenes y healthchecks

uso:
  ./scripts/deploy.sh            # despliegue completo (build + up + healthcheck)
  ./scripts/deploy.sh --no-build # evita reconstruir imágenes si ya existen

Composición: docker compose -f docker/compose.yml (server :8080 · web :8081)
EOF
}

[[ "${1:-}" == "-h" || "${1:-}" == "--help" ]] && { usage; exit 0; }
NO_BUILD=0
[[ "${1:-}" == "--no-build" ]] && NO_BUILD=1

cd "$(dirname "$0")/.."

step "Comprobando dependencias…"
command -v docker >/dev/null 2>&1 || fail "docker no está instalado"
command -v node  >/dev/null 2>&1 || warn "node ausente (solo necesario para tests/dev)"
docker info >/dev/null 2>&1 || fail "el daemon de Docker no responde"
ok "docker $(docker --version | cut -d, -f1)"

step "Preparando .env…
"
if [[ ! -f .env ]]; then
  cp .env.example .env
  # secreto aleatorio para las flags HMAC
  sed -i "s/^ARENA_FLAG_SECRET=.*/ARENA_FLAG_SECRET=$(openssl rand -hex 24 2>/dev/null || head -c48 /dev/urandom | od -An -tx1 | tr -d ' \\n')/" .env
  ok ".env generado desde .env.example (secreto HMAC aleatorio)"
else
  ok ".env ya existe (se respeta)"
fi

if [[ $NO_BUILD -eq 0 ]]; then
  step "Construyendo imágenes (dojo-base, server, web)…"
  docker build -t bash-arena/dojo-base:latest -f docker/ubuntu-dojo.Dockerfile .
  docker compose -f docker/compose.yml build
  ok "imágenes listas"
else
  docker image inspect bash-arena/dojo-base:latest >/dev/null 2>&1 || fail "sin imagen dojo-base: quita --no-build"
  ok "build omitido (--no-build)"
fi

step "Levantando stack…"
docker compose -f docker/compose.yml up -d
ok "contenedores arrancados"

step "Esperando healthcheck del servidor…"
for i in $(seq 1 30); do
  if docker inspect --format '{{.State.Health.Status}}' bash-arena-server 2>/dev/null | grep -q healthy; then
    ok "server healthy"
    break
  fi
  [[ $i -eq 30 ]] && { docker logs bash-arena-server | tail -30; fail "timeout esperando healthcheck"; }
  sleep 2
done

API_PORT=$(grep -E '^ARENA_HOST_API_PORT=' .env 2>/dev/null | cut -d= -f2 | grep -oE '[0-9]+$' || true)
API_PORT=${API_PORT:-18080}
step "Verificando catálogo de niveles vía API…"
LEVELS=$(curl -sf "http://127.0.0.1:${API_PORT}/api/health" | node -e 'let d="";process.stdin.on("data",c=>d+=c).on("end",()=>console.log(JSON.parse(d).levels))' 2>/dev/null || echo '?')
ok "niveles cargados: $LEVELS"

cat <<EOF

${P}━━━━━ bash-arena desplegado ━━━━━${N}
  plataforma:  ${G}http://localhost:8091${N}               (terminal + menú)
  api local:   ${G}http://localhost:18080${N}            (health, catálogo, progreso)
  stop:        ./scripts/stop.sh           (conserva progreso)
  purge:       ./scripts/stop.sh --purge   (borra TODO)

${G}¡A por el track de Fundamentos!${N} Escribe ${P}help${N} en la terminal para ver los comandos del dojo.
EOF
