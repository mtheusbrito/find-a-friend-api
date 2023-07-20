FROM node:16.15-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .
COPY tsconfig.json .
COPY src/ src/
COPY ./prisma ./prisma

RUN npm ci
RUN npx prisma generate
RUN npm run build

COPY . .

EXPOSE 3333
CMD ["node", "build/server.js"]
