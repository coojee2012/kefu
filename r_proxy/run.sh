#!/bin/sh


if [ -f /etc/nginx/conf.d/yunkefu.conf ]; then
    rm /etc/nginx/conf.d/yunkefu.conf
fi

ln -s /usr/local/nginx/config.d/yunkefu-${CFG_ENV:-dev}.conf /etc/nginx/conf.d/yunkefu.conf

exec nginx -g "daemon off;"