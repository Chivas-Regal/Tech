---
title: 哨兵
---

哨兵是一个分布式系统（数量通常为单数），它们不负责提供数据的 redis 服务器，存在的意义在于对主从结构的 redis 集群发生故障时进行恢复  
- 监控<br/>不断检查 master 和 slave 是否正常运行。<br/>master 存活检测、master 和 slave 的运行状况检测。
- 通知<br/>被监控的服务器出现问题时，向其他哨兵或者客户端发送通知。
- 自动故障转移<br/>断开 master 和 slave 的连接，通过投票选取一个 slave 作为 master 并与其他 slave 进行互连，通知客户端新的服务器地址。

## 配置信息

我们在 /etc/redis/config 下放一个 `sentinel-26379.conf`  

```sh
# 提供给客户端的端口号
port 26379

# 日志文件什么的存放的位置
dir /etc/redis/data

# 本哨兵监控 127.0.0.1:6379 命名为 mymaster , 该服务器被 2 个哨兵认定出错那就是出错了
sentinel monitor mymaster 127.0.0.1 6379 2

# mymaster 超时 30s 就被本哨兵认定出故障了
sentinel down-after-milliseconds mymaster 30000

# 故障转移时, 每次向新的 master 发起复制的 slave 个数
sentinel parallel-syncs mymaster 1

# 故障转移的超时时间
sentinel failover-timeout mymaster 180000
```

这里我做了三个，分别为 `sentinel-26379.conf`、`sentinel-26380.conf`、`sentinel-26381.conf`  
同时开启三个服务器，`redis-6379.conf` 为 master ，`redis-6380.conf` 和 `redis-6381.conf` 为 slave  
然后将三个哨兵文件挨个用 `redis-sentinel` 启动后会报出这样的内容（以 master 哨兵 redis-sentinel-26379 为例）  

![20231030221307](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231030221307.png)

它是 master 的哨兵，它检测到两个 slave 都连接上了各自的哨兵  
同时我们客户端连接一下这个哨兵看一下 `info` 信息  

![20231030221429](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231030221429.png)

发现这里多了这些内容，标志着该节点的从节点数、集群的哨兵数的信息  

**如果我们模拟异常环境，将 master 服务器宕掉**，等待30秒后发现主哨兵多了这么些信息      
![20231030221659](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231030221659.png)  
最后几行的信息表示将 master 转移给了 `:6380`  
且别的服务器也报出了 master 转移的信息  
![20231030221904](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231030221904.png)  
为了更直观地从客户端的角度出发，我们看一下 `redis-cli -p 6381` 的 `info` 信息，发现这一行已经转换了状态将跟随的主服务器变成了 `6380`  
![20231030222130](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231030222130.png)  