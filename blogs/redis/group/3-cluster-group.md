---
title: Redis 集群模式
---

## 集群简介

普通的主从集群下，主节点承担了所有的写操作与传播修改操作  
这样在从节点的读效率非常快的时候时间就被这些地方影响了  
如果建立多个主从结构，并将主节点们连接起来，每个主节点负责不同的 `key` 管理，写和传播修改效果会大大改善  
- 分散单台服务器的访问压力，实现负载均衡
- 分散单台服务器的存储压力，实现可扩展性
- 降低单台服务器宕机带来的业务灾难

这也是一种 **分布式开发理念，在 Redis 中担任 Cluster 集群的身份**  
  
## 数据存储设计

### key 的分散访问

Cluster 集群具备多主多从，每个主节点管理不同的 `key`  
一个切片集群具备 $16384$ 个哈希槽，默认平均分配到几个主节点上，当然也可以手动分配  
对于一个字符串 `key` 通过 [CRC16算法](https://en.wikipedia.org/wiki/Cyclic_redundancy_check) 得到的结果模 $16384$ 后，存放到对应的主节点    
  
### 节点的增删

若添加机器，增节点和删节点会修改槽的分配方案，[优化：一致性哈希](https://xiaolincoding.com/os/8_network_system/hash.html)

### 内部通讯设计

每个库相互通信，且保存各个库中的槽的编号数据。  
若来了一个 key ，它经过计算得到一个值，会先去访问第一个库：
- 值在第一个库中，直接返回结果
- 值不在第一个库中，根据保存的编号数据去查对应哪一个库，然后前往那个库去查找并返回结果

这样就使得读数据最多两次完成。

## 搭建与启动

选一个自己要搭建集群的目录，进入后写这样六个文件（对应六个节点的端口，这里采用三从三主）  

![20230608222854](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230608222854.png)

对于文件 `redis7001.conf` ，内容为  

<img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230608223122.png" style="max-height: 300px"/>

至于别的文件就把端口换一下就行了  

然后由于我们刚刚下了 Redis ，这里可以直接调用 redis-server 运行这六个文件，代表打开这六个端口  

![20230608223337](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230608223337.png)

显示一下它们的状态，输入 `ps -ef | grep redis`  

![20230608223653](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230608223653.png)

这样就说明打开了这六个端口，我们对前三个端口设置为三个主节点    

```
redis-cli 
  --cluster create 
  --cluster-replicas 1 
  127.0.0.1:7001 127.0.0.1:7002 127.0.0.1:7003 127.0.0.1:7004 127.0.0.1:7005 127.0.0.1:7006
```

`--cluster-replicas 1` 表示采用主从1对1的形式，下面写的进程就是一个主对一个从，写了三对。

![20231031170933](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231031170933.png)


设置成功后我们从 `7001` 进入 Redis 命令窗，输入 `redis-cli -c -p 7001`   
并在另一个窗口从 `7002` 进入 Redis 命令窗，输入 `redis-cli -c -p 7002`   

在 `7001` 处写入 `SET k1 v1`   

![20230608224305](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230608224305.png)

可以看到写入成功并计算后处于哈希槽 $12706$ ，位于节点端口 $7003$ 处，并带着我们在后面直接跳转了  
然后看一下另一个端口如果 `GET k1` 会发生什么  

![20230608224437](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230608224437.png)

可以看到几乎是一样的事情，计算并帮我们跳转到 `7003` 后获取  

这样我们就可以确定，Redis 是先对键字符串求完在哪个节点上后，帮我们跳转过去再求得在该节点上的操作后的结果  
至此 Cluster 集群搭建与使用完毕

## 主从下线

和正常主从一样
- 当 slave 下线，对应的 master 会检测到然后只是简单的停止该端口的连接，重新恢复后 master 恢复该端口连接
- 当 master 下线，对应的 slave 会成为 master 替代工作，而旧的 master 恢复后会成为 slave