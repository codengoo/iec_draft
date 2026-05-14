# ============================================================
# Stage 1: base — Node 22 Alpine with pnpm enabled
# ============================================================
FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable && corepack prepare pnpm@9 --activate

# ============================================================
# Stage 2: deps — install all dependencies
# ============================================================
FROM base AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Build native modules (sharp, esbuild, etc.) for linux/alpine
RUN pnpm install --frozen-lockfile

# ============================================================
# Stage 3: builder — compile the Next.js + Payload app
# ============================================================
FROM base AS builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* vars are inlined into the client bundle at build time.
# Pass the production URL via --build-arg when running docker build.
ARG NEXT_PUBLIC_SERVER_URL=http://localhost:3000
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--no-deprecation

# DATABASE_URL is required by generateStaticParams (Payload queries DB during next build).
# PAYLOAD_SECRET is required by withPayload at build time.
ARG DATABASE_URL
ARG PAYLOAD_SECRET=placeholder-build-secret
ENV DATABASE_URL=$DATABASE_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET

RUN pnpm run build

# ============================================================
# Stage 4: runner — minimal production image
# ============================================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS=--no-deprecation

# Run as non-root for security
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# Next.js standalone bundles everything needed into .next/standalone
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static  ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public        ./public

# Ensure the media directory exists before the volume is mounted
RUN mkdir -p /app/public/media \
    && chown nextjs:nodejs /app/public/media

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
