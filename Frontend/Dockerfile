# Build on Debian (glibc) — rolldown native bindings are unreliable when
# node_modules is copied between Alpine stages or from a Windows lockfile.
FROM node:20-bookworm-slim AS build-env
ARG VITE_API_BASE_URL
ARG VITE_API_WITH_CREDENTIALS=false
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_WITH_CREDENTIALS=$VITE_API_WITH_CREDENTIALS
WORKDIR /app
COPY package.json package-lock.json ./
# Windows-generated lockfile pins win32 optional packages only (npm/cli#4828).
RUN rm -f package-lock.json \
    && npm install --include=optional --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY package.json package-lock.json ./
# Runtime deps only; omit dev tooling (Vite/rolldown). Lockfile from Windows is OK here.
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=build-env /app/build ./build
CMD ["npm", "run", "start"]
