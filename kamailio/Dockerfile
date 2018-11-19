FROM registry.yunkefu.cc/unicall/kamailio-base:4.4.3.16
MAINTAINER Harold Sun

RUN apt-get update \
    && apt-get install -y lua5.1 \
    && rm -rf /var/lib/apt/lists/*

ADD config /etc/kamailio/config.d

COPY run.sh /run.sh

RUN chmod +x /run.sh