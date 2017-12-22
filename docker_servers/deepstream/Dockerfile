# Pull base image.
FROM centos:7
MAINTAINER LinYong

RUN yum install -y wget && wget https://bintray.com/deepstreamio/rpm/rpm -O /etc/yum.repos.d/bintray-deepstreamio-rpm.repo
RUN yum install -y deepstream.io
RUN deepstream install msg redis
RUN deepstream install cache redis

# Define default command.
COPY run.sh /run.sh
RUN chmod +x /run.sh && rm -rf /etc/deepstream/*
ADD config /etc/deepstream/config.d

CMD ["sh","/run.sh"]

# Expose ports
# HTTP Port
EXPOSE 6020
# TCP Port
EXPOSE 6021