FROM nginx:1.10.2-alpine

COPY repositories /etc/apk/repositories

RUN mkdir -p /data/http/static.yunkefu.com \
    && mkdir -p /data/http/app_yunkefu_com \
    && mkdir -p /data/http/challenges \
    && rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/nginx.conf
COPY config.d /usr/local/nginx/config.d

COPY run.sh /run.sh
RUN chmod +x /run.sh

CMD /run.sh

