#!/bin/bash
# Step 1: Create a Let's Encrypt account private key
openssl genrsa 4096 > account.key

# Step 2: Create a certificate signing request (CSR) for your domains.
#generate a domain private key (if you haven't already)
openssl genrsa 4096 > yunkefu.cc.key

#create a CSR for multiple domains (use this one if you want both www.yoursite.com and yoursite.com)
openssl req -new -sha256 -key yunkefu.cc.key -subj "/" -reqexts SAN -config <(cat /etc/ssl/openssl.cnf <(printf "[SAN]\nsubjectAltName=DNS:jira.yunkefu.cc,DNS:gerrit.yunkefu.cc,DNS:gitlab.yunkefu.cc,DNS:jenkins.yunkefu.cc,DNS:nexus.yunkefu.cc,DNS:registry.yunkefu.cc,DNS:npm.yunkefu.cc,DNS:testlink.yunkefu.cc,DNS:svn.yunkefu.cc")) > yunkefu.cc.csr

# Step 3: Make your website host challenge files
#make some challenge folder (modify to suit your needs)
mkdir -p /var/www/challenges/
# config nginx to accept /.well-known/acme-challenge/. This is done outside of this script.

# Step 4: Get a signed certificate!
python acme_tiny.py --account-key ./account.key --csr ./yunkefu.cc.csr --acme-dir /var/www/challenges/ > ./yunkefu.cc.crt

# Step 5: Install the certificate
#NOTE: For nginx, you need to append the Let's Encrypt intermediate cert to your cert
wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > intermediate.pem
cat yunkefu.cc.crt intermediate.pem > yunkefu.cc.pem

cp yunkefu.cc.pem /etc/ssl/private/yunkefu.cc.pem
cp yunkefu.cc.key /etc/ssl/private/yunkefu.cc.key

# generate a strong DHE parameter
cd /etc/ssl/certs
openssl dhparam -out dhparam.pem 4096

cp /etc/nginx/nginx.https.conf.bak /etc/nginx/nginx.conf
nginx -s reload
