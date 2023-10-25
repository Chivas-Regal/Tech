---
title: RDB 持久化
---

通过**快照**将表/库压缩后存放到某个磁盘文件里面，在宕机后启动时将其从这个磁盘文件中恢复。

## 启动与配置

### 保存与浏览

- 手动执行一次快照保存：`save`  

先注意一下我们的 /etc/redis/config/redis-6380.conf 文件内的信息  

```vb
bind 127.0.0.1 ::1
port 6380
daemonize yes
logfile "6380.log"
dir /etc/redis/data
```

这里表示了我的生成文件都会存在 /etc/redis/data ，日志文件叫做 server6380.log  
先连接上 redis 然后设个 key 并保存  

```vb
127.0.0.1:6380> set name snopzyz
OK
127.0.0.1:6380> save
OK
```

看一下另一边生成的文件  

```vb
root@chivas-regal:/etc/redis/data# ll
total 12
drwxr-sr-x 2 root  redis 4096 Oct 24 12:12 ./
drwxrws--- 5 redis redis 4096 Oct 24 12:10 ../
-rw-r--r-- 1 root  redis  112 Oct 24 12:12 dump.rdb

root@chivas-regal:/etc/redis/data# cat dump.rdb
REDIS0009�      redis-ver6.0.16�
�edis-bits�@�ctime �7eused-mem���
```

看到已经保存上去了并且其中具备数据信息了  

### save指令相关配置

定制化还需要下面的几个在 .conf 中的配置信息  

- `dbfilename dump.rdb`：设置本地数据库文件名，通常为 `dump-端口号.rdb`  
- `dir`：设置 .rdb 文件的存储路径，通常存在 `data` 中
- `rdbcompression yes`：设置存储时是否要压缩数据
- `rdbchecksum yes`：设置读写文件时是否进行 rdb 文件格式校验

然后我们再来测试一下，先清掉之前的进程和生成文件  
开启 `redis-server ./config/redis-6380.conf`    
然后另一边 `redis-cli` 连接后做保存  

```vb
root@chivas-regal:/etc/redis/config# redis-cli -p 6380
127.0.0.1:6380> keys *
(empty array)
127.0.0.1:6380> set name snopzyz
OK
127.0.0.1:6380> set age 21
OK
127.0.0.1:6380> save
OK
```

再回头看看 /etc/redis/data 下的文件  

```vb
root@chivas-regal:/etc/redis/data# ls
6380.log  dump-6380.rdb

root@chivas-regal:/etc/redis/data# cat dump-6380.rdb
REDIS0009�      redis-ver6.0.16�
�edis-bits�@�ctime�S�8eused-mem�
```

这样就生成了

**`save` 指令会阻塞当前 Redis 服务器直到保存完成，线上环境不建议使用**  

### 非阻塞保存

**调用命令 `bgsave` 后台保存 redis 数据。**  

server 调用 `fork()` 生成一个子进程用于创建 rdb 文件，子进程在做完之后返回给 redis 消息告诉它保存结束。    

::: tip 消息传递验证  
在 `redis-cli` 中调用 `bgsave` 命令后，查看 data/6380.log 文件内容。  

```log

...

86027:M 25 Oct 2023 04:05:05.143 * Background saving terminated with success
```

有这样一行，就是子进程保存成功的通知。  
:::

`bgsave` 比 `save` 还多了一个配置信息  
- `stop-writes-on-bgsave-error yes` ：后台存储过程中若出现错误是否停止操作

### 后台自动非阻塞保存（bgsave）

配置文件内容：  
  
- `save second changes`：在 `second` 的监控时间范围内，若 key 变化量超过了 `changes` 个，则自动执行 `bgsave`  

范例：

```vb
save 900 1
save 300 10
save 60 10000
```

注意：  

1. 后台保存是针对命令判断的，如果是增删改中的任意一种命令都会算作一次 key 变化。  
2. `second` 和 `changes` 的配置要根据实际情况来  
  2.1. 过频繁会导致性能下降，过稀疏会导致数据不安全。  
  2.2. 两者要呈现互补关系
3. 后台执行的操作是 `bgsave`  


## 数据恢复

先关闭之前启动的 `redis-cli` 和 `redis-server`  

```vb
root@chivas-regal:/etc/redis/data# ps -ef | grep redis-
root       80453       1  0 Oct22 ?        00:15:33 redis-server 127.0.0.1:6379
root       85968       1  0 03:45 ?        00:00:00 redis-server 127.0.0.1:6380
root       85974   85281  0 03:45 pts/0    00:00:00 redis-cli -p 6380
root       85979   85386  0 03:50 pts/1    00:00:00 grep --color=auto redis-

root@chivas-regal:/etc/redis/data# kill -s 8 85968
root@chivas-regal:/etc/redis/data# kill -s 8 85974

root@chivas-regal:/etc/redis/data# ps -ef | grep redis-
root       80453       1  0 Oct22 ?        00:15:33 redis-server 127.0.0.1:6379
root       85985   85386  0 03:51 pts/1    00:00:00 grep --color=auto redis-
```

重新启动发现数据还在

```vb
root@chivas-regal:/etc/redis# redis-server ./config/redis-6380.conf
root@chivas-regal:/etc/redis# redis-cli -p 6380
127.0.0.1:6380> keys *
1) "name"
2) "age"
```


## 优缺点

优点：
- 内部格式为紧凑压缩的二进制，存储效率高，恢复效率高
- 是某个时间点的数据快照，适用于数据备份与全量复制等

缺点：
- 由于存在时间间隔，无法实时持久化，安全系数较低
- `bgsave` 的创建子进程会耗费性能
- Redis的多个版本中RDB文件格式没有完全统一，部分版本恢复时存在无法兼容
