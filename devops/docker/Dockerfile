
# ----------- Build Stage -----------
FROM node:20.20.1-alpine3.22 AS builder

WORKDIR /app

# Install dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build the app
RUN npm run build

# ----------- Production Stage -----------
FROM node:20.20.1-alpine3.22 AS production

WORKDIR /app

# Only copy package.json and package-lock.json for production install
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built app and necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.env ./

EXPOSE 3000

CMD ["npm", "run", "start:prod"]