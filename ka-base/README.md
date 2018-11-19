* Kamailio base image 

使用Debian Jessie，安装Kamailio 最新的4.4稳定版本（目前是4.4.3），包括所有module，保留默认配置。

---

For example if you'd usually run kamailio like so:

```bash
kamailio -M 12 -m 128 ...
```

With `-M` we set `pkg` memory, and with `-m` we set `shr` memory.

We provide a couple of these

* `KAMAILIO_SHR` will set the `shr` memory in megs (here defaults to 64 meg)
* `KAMAILIO_PKG` will set the `pkg` memory in megs (here defaults to 24 meg)

So for example, you can set these when you use `docker run` a la:

```bash
[user@host kamailio]# docker run --name kamailio -p 5060:5060/udp -p 5060:5060 -p 5061:5061 -dt -e "KAMAILIO_SHR=512" -e "KAMAILIO_PKG=96" registry.yunkefu.cc/unicall/kamailio-base:<tag>
```

And you can check these out at run time with:

```bash
[user@host kamailio]# docker exec -it kamailio /bin/bash
[root@3ec34189db39 /]# kamctl stats shmem
shmem:fragments = 9
shmem:free_size = 534203992
shmem:max_used_size = 2673312
shmem:real_used_size = 2666920
shmem:total_size = 536870912
shmem:used_size = 2442528
[root@3ec34189db39 /]# ps ax
   28 ?        S+     0:00 kamailio -M 96 -m 512 -DD -E -e
   29 ?        S+     0:00 kamailio -M 96 -m 512 -DD -E -e
   30 ?        S+     0:00 kamailio -M 96 -m 512 -DD -E -e
   [...]
[root@3ec34189db39 /]# kamcmd pkg.stats
{
	entry: 0
	pid: 26
	rank: 0
	used: 182960
	free: 100182600
	real_used: 480696
}
[...]
```
