FROM node:20-alpine3.20 AS builder

WORKDIR /build

COPY package.json ./

RUN npm i && npm ci

COPY . .
RUN npm run build

FROM node:20-alpine3.20 AS runner

RUN apk add dumb-init

USER node
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /build/next.config.ts ./
COPY --from=builder /build/public ./public
COPY --from=builder /build/package.json ./package.json

COPY --from=builder /build/.next/standalone ./
COPY --from=builder /build/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
