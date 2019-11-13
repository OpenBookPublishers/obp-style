FROM node:latest

WORKDIR /src

COPY package.json ./
RUN npm install --silent --no-cache

COPY ./ ./

CMD npm run build
