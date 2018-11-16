# Reverse-Proxy 

这个项目提供反向代理服务。具体实现是用nginx来实现。 


## how to run? 

```
   docker run -d --name reverse-proxy --net host -e CFG_ENV=prod -v <path to static content>:/data/http --log-opt max-size=10m --log-opt max-file=10 registry.yunkefu.cc/unicall/reverse-proxy:$VER_TAG 
   
```