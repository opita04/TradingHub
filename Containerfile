# ============================================
# TradingHub - Multi-Stage Production Build
# ============================================

# ---- Stage 1: Build ----
FROM oven/bun:alpine AS builder

# Install Node.js for Vite build compatibility
RUN apk add --no-cache nodejs

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json bun.lock ./

# Install dependencies with Bun
RUN bun install --frozen-lockfile

# Copy source files
COPY . .

# Build the production bundle
RUN bun run build

# ---- Stage 2: Production ----
FROM nginx:alpine AS production

# Copy custom nginx config for SPA routing
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
