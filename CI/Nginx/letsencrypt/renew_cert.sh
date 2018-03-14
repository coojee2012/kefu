#!/bin/bash
python acme_tiny.py --account-key account.key --csr yunkefu.cc.csr --acme-dir /var/www/challenges/ > yunkefu.cc.crt || exit
wget -O - https://letsencrypt.org/certs/lets-encrypt-x1-cross-signed.pem > intermediate.pem
cat yunkefu.cc.crt intermediate.pem yunkefu.cc.key > yunkefu.cc.pem
cp yunkefu.cc.pem /etc/ssl/private/yunkefu.cc.pem
service haproxy reload

