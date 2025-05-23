FROM node:20

WORKDIR /usr/src/app


COPY package*.json ./

RUN npm install -force
RUN apt-get update && apt-get install -y xdg-utils

COPY . .


CMD [ "npm", "run", "start" ]
