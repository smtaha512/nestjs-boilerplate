FROM node:20 AS builder
ARG NODE_ENV="production"
WORKDIR /usr/src/app
COPY --chown=node:node package*.json .
RUN npm ci --only=production && npm cache clean --force
COPY . .
RUN npm run build
USER node

# Smaller image for production
FROM node:20-alpine

ARG NODE_ENV="production"

WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/package*.json ./

COPY --chown=node:node --from=builder /usr/src/node_modules ./node_modules

COPY --chown=node:node --from=builder /usr/src/dist ./dist

COPY --chown=node:node --from=builder /usr/src/tsconfig* ./

RUN npm run migration:run
CMD ["npm", "run", "start:prod"]


