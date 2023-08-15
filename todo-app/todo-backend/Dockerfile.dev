FROM node:16

WORKDIR /usr/src/app

COPY . .

RUN npm install

ENV DEBUG=todo-backend:*

CMD npm run dev