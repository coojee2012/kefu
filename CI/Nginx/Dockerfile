FROM dweomer/nginx-auth-ldap
RUN  apk update \
    && apk add bash python ca-certificates \
    && rm -rf /var/cache/apk

ADD  letsencrypt/ /usr/local/letsencrypt

RUN  mkdir -p /var/www/challenges/

COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.https.conf /etc/nginx/nginx.https.conf.bak
