#!/bin/bash
# Step 1: Create a Let's Encrypt account private key
cd /usr/local/letsencrypt
openssl genrsa 2048 > account.key

# Step 2: Create a certificate signing request (CSR) for your domains.
#generate a domain private key (if you haven't already)
openssl genrsa 2048 > yunkefu.cc.key

#create a CSR for multiple domains (use this one if you want both www.yoursite.com and yoursite.com)
openssl req -new -sha256 -key yunkefu.cc.key -subj "/" -reqexts SAN -config <(cat /etc/pki/tls/openssl.cnf <(printf "[SAN]\nsubjectAltName=DNS:lens.yunkefu.cc,DNS:math.yunkefu.cc,DNS:static.yunkefu.cc,DNS:t-unicall.yunkefu.cc,DNS:t-y7tech.yunkefu.cc,DNS:webrtc.yunkefu.cc,DNS:api.yunkefu.cc,DNS:youchuang01.yunkefu.cc,DNS:youchuang02.yunkefu.cc,DNS:youchuang03.yunkefu.cc,DNS:youchuang04.yunkefu.cc,DNS:youchuang05.yunkefu.cc,DNS:youchuang06.yunkefu.cc,DNS:youchuang07.yunkefu.cc,DNS:youchuang08.yunkefu.cc,DNS:youchuang09.yunkefu.cc,DNS:youchuang10.yunkefu.cc,DNS:youchuang11.yunkefu.cc,DNS:youchuang12.yunkefu.cc,DNS:youchuang13.yunkefu.cc,DNS:youchuang14.yunkefu.cc,DNS:youchuang15.yunkefu.cc,DNS:youchuang16.yunkefu.cc,DNS:youchuang17.yunkefu.cc,DNS:youchuang18.yunkefu.cc,DNS:youchuang19.yunkefu.cc,DNS:youchuang20.yunkefu.cc,DNS:youchuang21.yunkefu.cc,DNS:youchuang22.yunkefu.cc,DNS:youchuang23.yunkefu.cc,DNS:youchuang24.yunkefu.cc,DNS:youchuang25.yunkefu.cc,DNS:youchuang26.yunkefu.cc,DNS:youchuang27.yunkefu.cc,DNS:youchuang28.yunkefu.cc,DNS:youchuang29.yunkefu.cc,DNS:youchuang30.yunkefu.cc,DNS:youchuang31.yunkefu.cc,DNS:youchuang32.yunkefu.cc,DNS:youchuang33.yunkefu.cc,DNS:youchuang34.yunkefu.cc,DNS:youchuang35.yunkefu.cc,DNS:youchuang36.yunkefu.cc,DNS:youchuang37.yunkefu.cc,DNS:youchuang38.yunkefu.cc,DNS:youchuang39.yunkefu.cc,DNS:youchuang40.yunkefu.cc,DNS:youchuang41.yunkefu.cc,DNS:youchuang42.yunkefu.cc,DNS:youchuang43.yunkefu.cc,DNS:youchuang44.yunkefu.cc,DNS:youchuang45.yunkefu.cc,DNS:youchuang46.yunkefu.cc,DNS:youchuang47.yunkefu.cc,DNS:youchuang48.yunkefu.cc,DNS:youchuang49.yunkefu.cc,DNS:youchuang50.yunkefu.cc,DNS:youchuang51.yunkefu.cc,DNS:youchuang52.yunkefu.cc,DNS:youchuang53.yunkefu.cc,DNS:youchuang54.yunkefu.cc,DNS:youchuang55.yunkefu.cc,DNS:youchuang56.yunkefu.cc,DNS:youchuang57.yunkefu.cc,DNS:youchuang58.yunkefu.cc,DNS:youchuang59.yunkefu.cc,DNS:youchuang60.yunkefu.cc,DNS:youchuang61.yunkefu.cc,DNS:youchuang62.yunkefu.cc,DNS:youchuang63.yunkefu.cc,DNS:youchuang64.yunkefu.cc,DNS:youchuang65.yunkefu.cc,DNS:youchuang66.yunkefu.cc,DNS:youchuang67.yunkefu.cc,DNS:youchuang68.yunkefu.cc,DNS:youchuang69.yunkefu.cc,DNS:youchuang70.yunkefu.cc,DNS:youchuang71.yunkefu.cc,DNS:youchuang72.yunkefu.cc,DNS:youchuang73.yunkefu.cc,DNS:youchuang74.yunkefu.cc,DNS:youchuang75.yunkefu.cc,DNS:youchuang76.yunkefu.cc,DNS:youchuang77.yunkefu.cc,DNS:youchuang78.yunkefu.cc,DNS:youchuang79.yunkefu.cc,DNS:youchuang80.yunkefu.cc")) > yunkefu.cc.csr

# Step 3: Make your website host challenge files
#make some challenge folder (modify to suit your needs)
mkdir -p /data/http/challenges/
# config nginx to accept /.well-known/acme-challenge/. This is done outside of this script.

# Step 4: Get a signed certificate!
python acme_tiny.py --account-key ./account.key --csr ./yunkefu.cc.csr --acme-dir /data/http/challenges/ > ./yunkefu.cc.crt

# Step 5: Install the certificate
#NOTE: For nginx, you need to append the Let's Encrypt intermediate cert to your cert
wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > intermediate.pem
cat yunkefu.cc.crt intermediate.pem yunkefu.cc.key> yunkefu.cc.pem

cp yunkefu.cc.pem /etc/ssl/yunkefu.cc.pem

# generate a strong DHE parameter
#cd /etc/ssl/certs
#openssl dhparam -out dhparam.pem 1024



#备注,这是放在跳板机的