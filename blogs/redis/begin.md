---
title: 基本操作与配置文件修改
---

## 配置文件与启动

`redis` 存在一份配置文件可以修改运行时的状态  
如果你是 ubuntu 系统那么它位于 `/etc/redis/redis.conf`  
然后有两份常用的服务端软件包 `redis-server` 和客户端软件包 `redis-cli`  

先看一下服务端软件包的执行方式  

```sh
redis-server /etc/redis/redis.conf
```

这里意味着通过加载 redis.conf 的方式启动 redis-server  
但是默认的配置文件运行起来后是这样  

![20231021161139](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231021161139.png)

也就是以前台进程的方式执行，会随着 `^C` 的信号结束进程  
**想要让服务端通过守护进程的方式执行**，打开 `redis.conf`  
找到这样一行  

```conf
# By default Redis does not run as a daemon. Use 'yes' if you need it.
# Note that Redis will write a pid file in /var/run/redis.pid when daemonized.
daemonize yes
```

原本是 `no` ，把它切换为 `yes` 即可完成  
再次执行可以看到这样的效果了  

![20231021161519](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231021161519.png)

然后可以通过以下命令**关闭server**  

```sh
sudo /etc/init.d/redis-server stop
```
