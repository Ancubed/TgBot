FROM node:12

WORKDIR /usr/src/osulibservicetelegrambot

COPY package*.json ./

RUN npm install

ENV NODE_ENV=production

COPY . .

EXPOSE 3000

CMD [ "node", "index.js" ]