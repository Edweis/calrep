# Build stage
FROM node:18-alpine AS build
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Serve stage
FROM nginx:alpine
COPY --from=build /app/public /usr/share/nginx/html
