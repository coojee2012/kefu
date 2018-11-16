FROM registry.yunkefu.cc/unicall/freeswitch-base:0.0.1
MAINTAINER Harold Sun && Yong Lin

RUN mkdir -p /srv/app && mkdir -p /srv/app/config && mkdir -p /srv/app/log \
    && mkdir -p /usr/local/freeswitch/files && cd /srv/app
WORKDIR /srv/app
ADD sources.list /etc/apt/sources.list
RUN apt-get update && apt-get install -y freeswitch-mod-shout && rm -rf /var/lib/apt/lists/*
ADD odbc /usr/local/freeswitch/odbc
ADD images /usr/local/freeswitch/images
ADD sounds /usr/local/freeswitch/sounds
ADD config /usr/local/freeswitch/config.d
ADD scripts /usr/local/freeswitch/scripts
COPY extmods/mod_bcg729.so /usr/lib/freeswitch/mod/
ADD ./run.sh /srv/app
RUN chmod +x ./run.sh


# Start the container.
CMD ./run.sh


