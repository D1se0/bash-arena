#!/usr/bin/env bash
# bash-arena — status.sh: muestra el estado del stack en una línea por servicio
set -euo pipefail
P=$'\e[38;5;140m'; N=$'\e[0m'
cd "$(dirname "$0")/.."
echo "${P}bash-arena estado${N}"
for c in bash-arena-server bash-arena-web; do
  if docker inspect "$c" >/dev/null 2>&1; then
    st=$(docker inspect --format '{{.State.Status}}' "$c")
    health=$(docker inspect --format '{{.State.Health.Status}}' "$c" 2>/dev/null || echo 'n/a')
    printf '  %s: %s (health: %s)\n' "$c" "$st" "$health"
  else
    printf '  %s: no existe\n' "$c"
  fi
done
docker ps --filter 'label=bash-arena' --format '  sesión: {{.Names}} ({{.Status}})' 2>/dev/null | head -10 || true
curl -sf http://127.0.0.1:18080/api/health | head -c 200 && echo || echo "  api: no disponible"
