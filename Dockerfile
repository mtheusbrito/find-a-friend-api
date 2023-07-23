FROM node:18.15-slim as build

WORKDIR /usr/app

COPY package*.json .
COPY tsconfig.json .
COPY prisma ./prisma/


RUN apt-get -qy update && apt-get -qy install openssl

RUN npm install
RUN npm install @prisma/client
RUN npm i -g prisma
RUN npx prisma generate --schema ./prisma/schema.prisma

COPY . .

RUN npm run build


FROM node:18.15-slim as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/app

COPY package*.json .
COPY prisma ./prisma/
# RUN apt-get -qy update && apt-get -qy install openssl

RUN npm ci --only=production


RUN npm install @prisma/client
RUN npm i -g prisma
RUN npx prisma generate --schema ./prisma/schema.prisma


COPY --from=build /usr/app/dist ./dist

EXPOSE 4000

CMD ["node", "dist/server.js"]

