# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# First copy only package files for better caching
COPY package*.json ./

# Set npm configuration and install dependencies
RUN npm config set legacy-peer-deps true && \
    npm ci

# Install development dependencies separately for better caching
RUN npm install -D vite@latest && \
    npm install -D tailwindcss@latest postcss@latest autoprefixer@latest && \
    npm install framer-motion@latest lucide-react@latest

# Copy source files after installing dependencies
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM nginx:alpine

# Create non-root user
RUN addgroup -g 1001 -S app && \
    adduser -u 1001 -S app -G app

# Set up nginx permissions
RUN chown -R app:app /var/cache/nginx && \
    chown -R app:app /var/log/nginx && \
    chown -R app:app /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R app:app /var/run/nginx.pid

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder --chown=app:app /app/dist /usr/share/nginx/html

# Switch to non-root user
USER app

# Set production environment variables
ENV NODE_ENV=production
ENV VITE_SOLANA_NETWORK=mainnet

# 