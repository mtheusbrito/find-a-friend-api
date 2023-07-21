FROM node:lts

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src ./src
COPY prisma ./prisma/

RUN npm install
RUN npm install @prisma/client


COPY . .
RUN npx prisma generate --schema ./prisma/schema.prisma

RUN npm run build
EXPOSE 3333
CMD ["npm","run","start:migrate:prod"]
