FROM node:16

WORKDIR /usr/app

COPY package.json ./

RUN npm install
RUN npm install -g npx
RUN npx prisma migrate deploy
RUN npm run build
COPY . .
EXPOSE 3333

CMD ["npm", "run", "start"]