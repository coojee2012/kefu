#!/bin/sh

if [ ! -d "/var/log/vpnserver/security_log" ]; then
  mkdir -p /var/log/vpnserver/security_log
fi

if [ ! -d "/var/log/vpnserver/packet_log" ]; then
  mkdir -p /var/log/vpnserver/packet_log
fi

if [ ! -d "/var/log/vpnserver/server_log" ]; then
  mkdir -p /var/log/vpnserver/server_log
fi

ln -s /var/log/vpnserver/*_log /usr/local/vpnserver/

# setup TAP
[ -d /dev/net ] ||
    mkdir -p /dev/net
[ -c /dev/net/tun ] ||
    mknod /dev/net/tun c 10 200

ip tuntap add tap_soft mode tap

/sbin/ifconfig tap_soft 192.168.10.1
iptables -t nat -A POSTROUTING -s 192.168.10.0/24 -o eth0 -j MASQUERADE
/etc/init.d/dnsmasq restart

exec /usr/local/vpnserver/vpnserver execsvc

exit $?
