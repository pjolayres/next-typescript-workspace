FROM node:10.14.2-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY ["server.js", "next.config.js", "package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install -g pm2@latest
RUN mkdir -p /var/log/pm2

RUN npm install --production --silent && mv node_modules ../

COPY dist/ ./dist/
COPY src/static/ ./src/static/

EXPOSE 3000

ENTRYPOINT ["pm2", "start", "server.js","--name","node","--log","/var/log/pm2/pm2.log","--no-daemon"]
