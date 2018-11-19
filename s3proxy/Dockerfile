FROM janeczku/alpine-kubernetes:3.3

WORKDIR /app

ADD repositories /etc/apk/repositories
ADD .npmrc /root/.npmrc
ADD package.json /app/package.json
RUN apk add --no-cache nodejs build-base && npm install && npm install typescript@2.7.2 -g
ADD . /app
RUN tsc && apk del build-base

EXPOSE 3000

CMD ["node", "lib/index.js"]
