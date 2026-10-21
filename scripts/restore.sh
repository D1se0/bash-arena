#!/usr/bin/env bash
# bash-arena — restore.sh: restaura el progreso desde backups/
set -euo pipefail
G=$'\e[38;5;114m'; Y=$'\e[38;5;142m'; R=$'\e[38;5;203m'; N=$'\e[0m'
cd "$(dirname "$0")/.."

# fichero destino: 1º argumento, o el backup más reciente
REQUESTED="${1:-}"
if [[ -n "$REQUESTED" && "$REQUESTED" != "--yes" ]]; then
  [[ -f "$REQUESTED" ]] || { echo "${R}no existe: $REQUESTED${N}"; exit 1; }
  LATEST="$REQUESTED"
else
  LATEST=$(ls -t backups/arena-progress-*.tar.gz 2>/dev/null | head -1 || true)
  [[ -n "$LATEST" ]] || { echo "${R}no hay backups en ./backups/${N}"; exit 1; }
fi

# confirmación: en un TTY pregunta; sin TTY exige --yes (evita colgar en CI)
CONFIRMED=false
for a in "$@"; do [[ "$a" == "--yes" ]] && CONFIRMED=true; done
if ! $CONFIRMED && [[ -t 0 ]]; then
  read -r -p "¿restaurar desde $LATEST? [y/N] " a
  [[ "$a" == y* ]] || exit 0
elif ! $CONFIRMED; then
  echo "${R}sin TTY: pasa --yes para confirmar${N}"; exit 1
fi

echo "${Y}▸ restaurando desde $LATEST (el servicio debe estar detenido)${N}"
docker run --rm -v arena-data:/data -v "$(pwd)/backups:/backup" alpine \
  sh -c "rm -rf /data/* && tar -xzf '/backup/$(basename "$LATEST")' -C /data"
echo "${G}✓ progreso restaurado desde $LATEST${N}"
