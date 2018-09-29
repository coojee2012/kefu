# Docker快速安装部署

## pull 镜像
```
docker pull redis
```
## 运行镜像

```
$ docker run --name some-redis -d redis
```

到这里 一个能提高服务的redis已经部署成功。这里默认暴露了6379 端口。



## 配置持久化方式启动


```
$ docker run --name some-redis -d redis redis-server --appendonly yes
```

当然也可以把持久化的数据存到物理机 
-v <宿主机目录>:<容器目录> 

最后的命令为


```
$ docker run --name some-redis -v /docker/host/dir:/data -d redis redis-server --appendonly yes
```

## 自定义redis.cof
```
$ docker run -v /myredis/conf/redis.conf:/usr/local/etc/redis/redis.conf --name myredis redis redis-server /usr/local/etc/redis/redis.conf
```

## 最终的运行命令
```
docker run -d -v /home/hydratest/redis/redis.conf:/usr/local/etc/redis/redis.conf -p 6379:6379 --network=hydra_work --name h-redis redis redis-server /usr/local/etc/redis/redis.conf
```
–link关联容器

我们在使用Docker的时候，经常可能需要连接到其他的容器，比如：web服务需要连接数据库。按照往常的做法，需要先启动数据库的容器，映射出端口来，然后配置好客户端的容器，再去访问。其实针对这种场景，Docker提供了–link 参数来满足。 
–link=container_name or id:name

比如你的应用服务需要使用redis 可以这么启动。


```
$ docker run --name some-app --link some-redis:redis -d application-that-uses-redis
```

或者  or via redis-cli


```
$ docker run -it --link some-redis:redis --rm redis redis-cli -h redis -p 6379
```

不过我不喜欢用这样方式连接容器，应为如果容器多 了  能把你 link成 懵逼

我喜欢用创建一个 内网的方式



创建一个网段来连接容器

创建一个网络



docker network create -d bridge --subnet 172.25.0.0/16 hydra_work1

其他容器加入改网络




docker build -t hydra/eureka:1.0 .

docker run -d --network=hydra_work --name h-eureka  -p 7000:7000 hydra/eureka:1.0

---------------------

