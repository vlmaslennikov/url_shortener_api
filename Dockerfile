FROM node:22.7

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .