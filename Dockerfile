FROM node:20 AS builder

ARG NODE_ENV="production"

WORKDIR /usr/src

COPY ./package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Smaller image for production
FROM node:20-alpine

ARG NODE_ENV="production"

WORKDIR /usr/src/app

COPY package*.json ./

COPY tsconfig* ./

RUN npm ci --only=production

COPY --from=builder /usr/src/app/dist/ ./dist

CMD ["npm" "run", "start:prod"]