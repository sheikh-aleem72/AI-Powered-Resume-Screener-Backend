FROM node:20-alpine

WORKDIR /app

# Install only prod dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build TS → JS
RUN npm run build

EXPOSE 5000

CMD ["node", "dist/index.js"]
