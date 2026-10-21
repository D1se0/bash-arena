#!/usr/bin/env bash
# bash-arena — stop.sh: detiene el stack conservando el progreso por defecto
set -euo pipefail

G=$'\e[38;5;114m'; B=$'\e[38;5;110m'; P=$'\e[38;5;140m'; Y=$'\e[38;5;142m'; R=$'\e[38;5;203m'; N=$'\e[0m'
cd "$(dirname "$0")/.."

PURGE=0
KEEP=1
for arg in "$@"; do
  case "$arg" in
    --purge) PURGE=1 ;;
    --keep-progress) KEEP=1 ;;
    --wipe-progress) PURGE=1; KEEP=0 ;;
    -h|--help)
      cat <<EOF
${P}bash-arena stop${N}
  ./scripts/stop.sh                 # detiene y CONSERVA el progreso (volumen arena-data)
  ./scripts/stop.sh --purge         # detiene y BORRA imágenes+volúmenes (confirmación)
  ./scripts/stop.sh --wipe-progress # también borra la base de progreso
EOF
      exit 0 ;;
    *) echo "arg desconocido: $arg" >&2; exit 2 ;;
  esac
done

echo "${B}▸ deteniendo contenedores…${N}"
docker compose -f docker/compose.yml down --remove-orphans
echo "${G}✓ stack detenido${N}"

if [[ $KEEP -eq 1 ]]; then
  echo "${G}✓ progreso preservado (volumen arena-data intacto)${N}"
fi

if [[ $PURGE -eq 1 ]]; then
  echo "${Y}▸ modo purge: se borrarán volúmenes, imágenes del proyecto y datos de progreso${N}"
  if [[ -t 0 ]]; then
    read -r -p "  ¿continuar? escribe 'PURGE' para confirmar: " ans
    [[ "$ans" == "PURGE" ]] || { echo "${R}cancelado${N}"; exit 0; }
  fi
  docker compose -f docker/compose.yml down -v --remove-orphans
  docker rmi bash-arena/server bash-arena/web bash-arena/dojo-base 2>/dev/null || true
  echo "${G}✓ purga completa (paste progreso sustituido por volumes borrados)${N}"
  [[ $KEEP -eq 0 ]] && echo "${G}✓ con --wipe-progress también se eliminó el volumen de progreso${N}"
fi
