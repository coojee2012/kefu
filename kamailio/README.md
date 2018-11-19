## Kamailio Proxy Sever

### 项目介绍
kamailio proxy server作为核心的SIP Proxy服务器，提供下面的服务： 


* SIP proxy 
* Authentication 
* registrat service 
* location service
* SIP routing 
* NAT Traversal - control RTPEngine 

使用的模块有：

* MYSQL
* AUTH
* USRLOCDB
* MULTIDOMAIN
* ACCDB
* XMLRPC

### 如何build

直接docker build，或者git push到gitlab，jenkins会自动build新版本。

```
docker build -t registry.yunkefu.cc/unicall/kamailio-proxy:version.build-number .
```

### 初始化数据
* 新建kamailio的mysql用户和schema mysql://kamailio:kamailiorw@192.168.2.220/kamailio
* 建表 
```
     docker run -it -e KAMAILIO_ENV=dev registry.yunkefu.cc/unicall/kamailio-proxy:version.build-number /bin/bash
```
(重点:凡是需要终端修改数据库 请记得修改这里)编辑/etc/kamailio/kamctlrc文件, 去掉下面行的注释，并修改mysql的ip地址。

     DBENGINE=MYSQL
     DBHOST=192.168.2.220

然后执行执行kamdbctl create建表。输入mysql root密码，然后所以问题都回答yes

```
    kamdbctl create
```
    
* 连接到mysql server, 执行scripts下对于环境的sql脚本初始化配置。

### 如何运行

* kamailio proxy依赖于MYSQL Server。在运行前，先要保证Mysql Server可用，并且在配置中正确设置mysql的url。 
* 运行docker image时，需要通过环境变量指定运行的环境KAMAILIO_ENV=<dev|nigthly|stage|prod>, 未指定时，默认为dev。
 
```
docker run -d --name kamailio-proxy -e KAMAILIO_ENV=prod --net host --restart always --log-opt max-size=10m --log-opt max-file=10 registry.yunkefu.cc/unicall/kamailio-proxy:version.build-number
```
### 创建freeswitch用户

kamctl add freeswitch@kamailor_server_host freeswitch@kamailor_server_host

kamctl add 1001@doamin 1001


###在数据库表中添加domain数据
在domain 表中添加
添加完毕后需要kamctl doamin reload
## stg证书更新问题,修改server.crt的第一部分 为新的PEM的第一部分