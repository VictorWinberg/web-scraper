FROM node:14-slim as install
WORKDIR /app

# install all dependencies
COPY package*.json ./
RUN npm ci

FROM install as build

# build the server app
COPY ./ ./
RUN npm run build

FROM node:14-slim as production

# install production dependencies
COPY package*.json ./
RUN npm ci --production

COPY --from=build /app/build/ build
