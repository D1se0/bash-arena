#!/usr/bin/env bash
# bash-arena — logs.sh: sigue logs del server (por defecto) o de la web
set -euo pipefail
P=$'\e[38;5;140m'; N=$'\e[0m'
TARGET="${1:-server}"
[[ "$TARGET" == "web" || "$TARGET" == "server" ]] || { echo "uso: ./scripts/logs.sh [server|web]" >&2; exit 2; }
echo "${P}▸ logs de bash-arena-$TARGET (Ctrl+C para salir)${N}"
exec docker logs -f --tail 100 "bash-arena-$TARGET"
