FROM alpine

WORKDIR /app

RUN apk update && apk add nodejs npm

COPY package*.json ./

RUN npm install

EXPOSE 3001

CMD ["npm", "run", "dev"]