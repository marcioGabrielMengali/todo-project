
# ----------- Build Stage -----------
FROM node:20.20.1-alpine3.22 AS builder

RUN npm install -g npm@11.12.1

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

RUN npm install -g npm@11.12.1

RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

# Only copy package.json and package-lock.json for production install
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built app and env from builder (node_modules already installed above via npm ci --only=production)
COPY --from=builder /app/dist ./dist

RUN chown -R app:app /app

USER app

EXPOSE 3000

CMD ["npm", "run", "start:prod"]