FROM node:16-alpine

WORKDIR /link-gather-nest

COPY package*.json .npmrc ./

RUN npm ci

ARG NODE_ENV
ARG PORT

ENV NODE_ENV=$NODE_ENV \
    PORT=$PORT \
    DB_HOST=$DB_HOST \
    DB_NAME=$DB_NAME \
    DB_USER=$DB_USER \
    DB_PASSWORD=$DB_PASSWORD \
    DB_PORT=$DB_PORT

COPY . .

RUN npm run build

EXPOSE $PORT

CMD ["npm", "start"]