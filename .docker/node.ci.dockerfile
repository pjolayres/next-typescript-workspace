FROM node:10.14.2-alpine

ENV NODE_ENV production

WORKDIR /usr/src/app

# Install Chromium
RUN \
  echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/main" >> /etc/apk/repositories \
  && echo "http://dl-cdn.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories \
  && apk --no-cache  update \
  && apk --no-cache  upgrade \
  && apk add --no-cache --virtual .build-deps \
    gifsicle pngquant optipng libjpeg-turbo-utils \
    udev ttf-opensans chromium \
  && rm -rf /var/cache/apk/* /tmp/*

ENV CHROME_BIN /usr/bin/chromium-browser
ENV LIGHTHOUSE_CHROMIUM_PATH /usr/bin/chromium-browser

COPY ["server.js", "package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]

RUN npm install --silent

COPY . .

EXPOSE 3000 9229

RUN npm run build

CMD npm run lint && npm run build && npm run test && npm run test:api-ci && npm run test:ui-chromium-ci
