FROM node:16-alpine

WORKDIR /link-gather-nest

COPY package*.json .npmrc ./

RUN npm ci

ARG NODE_ENV
ARG PORT

ENV NODE_ENV=$NODE_ENV \
    PORT=$PORT

COPY . .

RUN npm run build

EXPOSE $PORT

CMD ["npm", "start"]