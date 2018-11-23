FROM haproxy:1.6.9

ENV HAPROXY_USER haproxy

COPY sources.list /etc/apt/sources.list
RUN apt-get update && apt-get install rsyslog -y && \
    sed -i 's/#$ModLoad imudp/$ModLoad imudp/g' /etc/rsyslog.conf && \
    sed -i 's/#$UDPServerRun 514/$UDPServerRun 514/g' /etc/rsyslog.conf

COPY haproxy-log.conf /etc/rsyslog.d

RUN addgroup ${HAPROXY_USER} && \
  useradd -g ${HAPROXY_USER} -M ${HAPROXY_USER} && \
  mkdir -p /var/lib/${HAPROXY_USER} && \
  chown -R ${HAPROXY_USER}:${HAPROXY_USER} /var/lib/${HAPROXY_USER} && \
  mkdir -p /etc/ssl/private

ADD config /usr/local/etc/haproxy/config.d
ADD ssl /etc/ssl

COPY docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh

CMD ["haproxy", "-db", "-f", "/usr/local/etc/haproxy/haproxy.cfg"]