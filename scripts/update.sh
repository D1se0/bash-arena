#!/usr/bin/env bash
# bash-arena — update.sh: reconstruye imágenes y reinicia (conserva progreso)
set -euo pipefail
B=$'\e[38;5;110m'; G=$'\e[38;5;114m'; N=$'\e[0m'
cd "$(dirname "$0")/.."
echo "${B}▸ reconstruyendo imágenes…${N}"
docker build -t bash-arena/dojo-base:latest -f docker/ubuntu-dojo.Dockerfile .
docker compose -f docker/compose.yml build
echo "${B}▸ reiniciando (sin borrar el volumen de progreso)…${N}"
docker compose -f docker/compose.yml up -d --force-recreate
echo "${G}✓ update completo — el progreso permanece${N}"
