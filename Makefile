# bash-arena Makefile
.DEFAULT_GOAL := help
SHELL := /bin/bash

help: ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[38;5;140m%-18s\033[0m %s\n", $$1, $$2}'

up: ## Levanta todo (deploy.sh)
	@./scripts/deploy.sh

down: ## Detiene manteniendo progreso
	@./scripts/stop.sh --keep-progress

purge: ## Detiene y borra todo (confirmación interactiva)
	@./scripts/stop.sh --purge

backup: ## Backup del progreso
	@./scripts/backup.sh

restore: ## Restaura el último backup
	@./scripts/restore.sh

status: ## Estado de servicios
	@./scripts/status.sh

logs: ## Sigue logs del backend
	@./scripts/logs.sh

update: ## Update imágenes + restart
	@./scripts/update.sh

test: ## Tests unitarios + integración (requiere Docker)
	@npm run test:unit

test:levels ## Verifica solución de cada nivel
	@node scripts/test-levels.mjs

clean: ## Limpia build de node/vite
	@rm -rf app/*/dist docs-site/dist coverage node_modules/.cache

dev: ## Modo desarrollo (sin Docker)
	@npm run dev --workspace app/server & npm run dev --workspace app/client

.PHONY: help up down purge backup restore status logs update test test:levels clean dev
