#!/bin/bash

if [[ $HAPROXY_ENV ]]
then
  rm -rf /usr/local/etc/haproxy/haproxy.cfg
  ln -s /usr/local/etc/haproxy/config.d/haproxy-$HAPROXY_ENV.cfg /usr/local/etc/haproxy/haproxy.cfg
fi

rsyslogd -n &
touch /var/log/haproxy.log
tail -f /var/log/haproxy.log &

# first arg is `-f` or `--some-option`
if [ "${1#-}" != "$1" ]; then
	set -- haproxy "$@"
fi

if [ "$1" = 'haproxy' ]; then
	# if the user wants "haproxy", let's use "haproxy-systemd-wrapper" instead so we can have proper reloadability implemented by upstream
	shift # "haproxy"
	set -- "$(which haproxy-systemd-wrapper)" -p /run/haproxy.pid "$@"
fi

exec "$@"