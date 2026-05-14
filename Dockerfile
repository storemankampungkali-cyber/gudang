# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy built assets and required files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/seed.ts ./
COPY --from=builder /app/server ./server

# Install only production dependencies
RUN npm ci --omit=dev

# Start the application
CMD npm run seed && npm start
