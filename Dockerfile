# backend/Dockerfile
FROM node:25-alpine

# Instalar compatibilidad necesaria
RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Copiar dependencias primero (aprovechar cache de Docker)
COPY pnpm-lock.yaml package.json ./

RUN pnpm install

# Copiar el resto del código fuente
COPY . .

# Comando por defecto (puede ser sobreescrito por docker-compose)
CMD ["pnpm", "start:dev"]
