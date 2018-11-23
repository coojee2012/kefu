# Load Balancer
### frontend load balancer for http/https/smtp/websocket based on haproxy

### Introduction 

由于ELB只能使用CNAME指向，导致租户域名下不能设置MX记录，影响邮件系统，所以我们自己配置了haproxy和keepalived，做了一个简单的active、passive高可用load balancer。

通过这个load balancer，支持HTTP、HTTPS、SMTP、WS和WSS的接入和负载均衡。

对于SIP消息的代理，是通过kamailio来处理的。Frontend Load Balancer不处理SIP。

### how to build? 

* git push to gitlab to trigger jenkin build
* or build it manually 
```
docker build -t registry.yunkefu.cc/unicall/loadbalancer:<version.buildnumber> .
```
  

### how to run? 

set HAPROXY_ENV to match the deployed environment: dev, nightly, stage, prod

```
docker run -d --name loadbalancer --restart always -e HAPROXY_ENV=dev --net host --log-opt max-size=10m --log-opt max-file=10 registry.yunkefu.cc/unicall/loadbalancer:<version.buildnumber> 
```

docker run -d --name loadbalancer --restart always -e HAPROXY_ENV=stage --net host registry.yunkefu.cc/unicall/loadbalancer:1.6.9.145

### 证书过期怎么办?
* 进入stage跳板机
* cd /usr/local/letsencrypt

* 遇到的坑:
1 写入授权证书内容的目录权限问题导致没有写入 
2 lodvalancer 应该关闭掉48.5上的指向 否者那边会是404

sudo docker cp loadbalancer:/usr/local/etc/haproxy/config.d/haproxy-stage.cfg ./
关闭掉48.5的配置
sudo docker cp ./haproxy-stage.cfg loadbalancer:/usr/local/etc/haproxy/config.d/haproxy-stage.cfg
sudo docker stop loadbalancer
sudo docker start loadbalancer
* sudo ./renew_cert.sh
* 复制  yunkefu.cc.pem 里面的内容到  项目 /etc/ssl/private/yunkefu.cc.pem
恢复关闭掉的48.5的配置

sudo docker cp yunkefu.cc.pem loadbalancer:/etc/ssl/private/yunkefu.cc.pem
sudo docker cp ./haproxy-stage.cfg loadbalancer:/usr/local/etc/haproxy/config.d/haproxy-stage.cfg
sudo docker stop loadbalancer
sudo docker start loadbalancer

* 重新部署本项目


### jira 等证书过期看这里



进入 centos@10.0.0.10
进入 letsencrypt
* ./renew_cert.sh  #如果有问题处理问题
sudo docker cp ./yunkefu.cc.pem reverse-proxy-internal:/etc/ssl/private/yunkefu.cc.pem
sudo docker restart  reverse-proxy-internal

备注：生成该key的letsencrypt 打包在10.0.0.10机器上，建议下载到本地或其他服务器保存










* 进入centos@10.0.0.10 -i ~/.ssh/....
* sudo docker exec -it ngnix-https bash
* cd /usr/local/letsencrypt
* ./renew_cert.sh  #如果有问题处理问题
```
#!/bin/bash
cd /usr/local/letsencrypt
python acme_tiny.py --account-key account.key --csr yunkefu.cc.csr --acme-dir /var/www/challenges/ > yunkefu.cc.crt || exit
wget -O - https://letsencrypt.org/certs/lets-encrypt-x3-cross-signed.pem > intermediate.pem
cat yunkefu.cc.crt intermediate.pem yunkefu.cc.key > yunkefu.cc.pem
cp yunkefu.cc.pem /etc/ssl/private/yunkefu.cc.pem
nginx -s reload
```

registry.yunkefu.cc/unicall/nginx:0.0.13