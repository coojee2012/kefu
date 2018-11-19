FROM debian:jessie
MAINTAINER Harold Sun
ENV DEBIAN_FRONTEND noninteractive

RUN apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 0xfb40d3e6508ea4c8
ADD sources.list.jessie /etc/apt/sources.list
RUN apt-get update \
    && apt-get install --no-install-recommends --no-install-suggests -y kamailio* \
    && rm -rf /var/lib/apt/lists/*

WORKDIR  /

COPY run.sh /run.sh

CMD /run.sh
