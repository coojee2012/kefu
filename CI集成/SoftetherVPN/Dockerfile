# SoftEther VPN server

FROM ubuntu:14.04
MAINTAINER Harold Sun <bnusunny@gmail.com>

ENV VERSION v4.18-9570-rtm-2015.07.26
WORKDIR /usr/local/vpnserver

RUN sed 's/archive.ubuntu.com/mirrors.aliyun.com/' -i /etc/apt/sources.list

RUN apt-get update &&\
        apt-get -y -q install gcc make wget && \
        apt-get -y install dnsmasq && \
        apt-get -y install iptables && \
        apt-get clean && \
        rm -rf /var/cache/apt/* /var/lib/apt/lists/* && \
        wget http://www.softether-download.com/files/softether/${VERSION}-tree/Linux/SoftEther_VPN_Server/64bit_-_Intel_x64_or_AMD64/softether-vpnserver-${VERSION}-linux-x64-64bit.tar.gz -O /tmp/softether-vpnserver.tar.gz &&\
        tar -xzvf /tmp/softether-vpnserver.tar.gz -C /usr/local/ &&\
        rm /tmp/softether-vpnserver.tar.gz &&\
        make i_read_and_agree_the_license_agreement &&\
        apt-get purge -y -q --auto-remove gcc make wget

RUN sed 's/#net.ipv4.ip_forward=1/net.ipv4.ip_forward=1/' -i /etc/sysctl.conf

ADD dnsmasq.conf /etc/dnsmasq.conf


ADD runner.sh /usr/local/vpnserver/runner.sh
RUN chmod 755 /usr/local/vpnserver/runner.sh

EXPOSE 443/tcp 992/tcp 1194/tcp 1194/udp 5555/tcp 500/udp 4500/udp

ENTRYPOINT ["/usr/local/vpnserver/runner.sh"]