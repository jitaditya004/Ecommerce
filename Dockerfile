# ---------- 1. Base ----------
FROM node:20-alpine AS base
WORKDIR /app

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# ---------- 2. Dependencies ----------
FROM base AS deps
COPY package.json package-lock.json ./
COPY prisma ./prisma
RUN npm ci

# ---------- 3. Builder ----------
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate
RUN npm run build

# ---------- 4. Production ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "start"]