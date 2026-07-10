# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig*.json ./
COPY prisma ./prisma
COPY src ./src
RUN npm ci --omit=dev
RUN npm run build || true

# Run stage
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./
EXPOSE 4000
ENV NODE_ENV=production
CMD ["node", "dist/main.js"]
