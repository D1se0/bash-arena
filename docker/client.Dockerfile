# bash-arena — imagen del frontend (React + Vite build estático servido por nginx)
# nginx también hace proxy de /ws y /api al backend.

FROM node:22-bookworm-slim AS build
WORKDIR /build/app/client
COPY tsconfig.json /build/tsconfig.json
COPY app/client/package.json app/client/package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY app/client ./
RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /build/app/client/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
