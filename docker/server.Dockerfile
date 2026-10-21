# bash-arena — imagen del backend (Node + TypeScript + better-sqlite3 + dockerode)
# Necesita montar /var/run/docker.sock (SOLO este contenedor; nunca los de usuario)
# y el volumen /data para la base de datos de progreso (SQLite).

FROM node:22-bookworm-slim AS build
WORKDIR /build
RUN apt-get update && apt-get install -y --no-install-recommends \
      python3 make g++ ca-certificates \
    && rm -rf /var/lib/apt/lists/*
# copiamos la jerarquía del monorepo mínima para respetar el extend del tsconfig
COPY tsconfig.json /build/tsconfig.json
WORKDIR /build/app/server
COPY app/server/package.json app/server/package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY app/server /build/app/server
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends \
      curl ca-certificates wget \
    && rm -rf /var/lib/apt/lists/*
COPY --from=build /build/app/server/node_modules ./node_modules
COPY --from=build /build/app/server/dist ./dist
COPY app/server/package.json ./
EXPOSE 8080
CMD ["node", "dist/index.js"]
