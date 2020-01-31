FROM node:10.15.3-alpine

RUN apk update && apk add python g++ make && rm -rf /var/cache/apk/*

RUN mkdir -p /var/source
WORKDIR /var/source

COPY package.json package-lock.json /var/source/
RUN npm install

COPY . .

RUN npm run build

EXPOSE 80
ENTRYPOINT ["node", "./build/index.js"]
