#!/usr/bin/env bash
# bash-arena — restore.sh: restaura el progreso desde backups/
set -euo pipefail
G=$'\e[38;5;114m'; Y=$'\e[38;5;142m'; R=$'\e[38;5;203m'; N=$'\e[0m'
cd "$(dirname "$0")/.."

LATEST=$(ls -t backups/arena-progress-*.tar.gz 2>/dev/null | head -1 || true)
if [[ -z "$LATEST" ]]; then
  echo "${R}no hay backups en ./backups/${N}"; exit 1
fi
echo "${Y}▸ restaurando desde $LATEST (el servicio debe estar detenido)${N}"
[[ "${1:-}" == "--yes" ]] || { read -r -p "¿continuar? [y/N] " a; [[ "$a" == y* ]] || exit 0; }
docker run --rm -v arena-data:/data -v "$(pwd)/backups:/backup" alpine \
  sh -c "rm -rf /data/* && tar -xzf '/backup/$(basename "$LATEST")' -C /data"
echo "${G}✓ progreso restaurado desde $LATEST${N}"
