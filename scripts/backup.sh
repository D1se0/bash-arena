#!/usr/bin/env bash
# bash-arena — backup.sh: copia el volumen del progreso a ./backups/
set -euo pipefail
G=$'\e[38;5;114m'; B=$'\e[38;5;110m'; P=$'\e[38;5;140m'; R=$'\e[38;5;203m'; N=$'\e[0m'
cd "$(dirname "$0")/.."
mkdir -p backups
STAMP=$(date +%Y%m%d-%H%M%S)
OUT="backups/arena-progress-${STAMP}.tar.gz"

command -v docker >/dev/null 2>&1 || { echo "${R}docker no disponible${N}"; exit 1; }
docker run --rm -v arena-data:/data -v "$(pwd)/backups:/backup" alpine \
  tar -czf "/backup/$(basename "$OUT")" -C /data . 2>/dev/null \
  || { echo "${R}backup falló (¿existe el volumen arena-data? comprobar deploy)${N}"; exit 1; }

echo "${G}✓ backup creado:${N} ${OUT}"
ls -lh "$OUT"
