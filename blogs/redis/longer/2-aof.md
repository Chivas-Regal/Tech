---
title: AOF 持久化
---

以独立日志的方式**记录每次写命令**，重启后再次执行 AOF 文件中的命令来恢复数据。  

## 写数据策略

AOF接收到写命令后第一步是将命令存放到AOF日志记录缓冲区中。  
当缓冲区中的数据满足某种条件之后，将其刷到 .aof 文件中去。  
这个满足的条件分为三种策略：
- always：每次（数据绝对安全，但性能低）
- everysec：每秒（最多丢失一秒数据，性能高）
- no：系统控制（过程不可控）

## 配置与启动

- `appendonly yes|no`：是否开始AOF功能
- `appendfsync always|everysec|no`：写数据策略
- `appendfilename filename`：生成的 .aof 文件名

我们把这几行加到我们 `redis-6380.conf` 中  

```vb
appendonly yes
appendfsync everysec
appendfilename appendonly-6380.aof
```

然后用配置文件重启 redis 并打入几个写操作  

```vb
root@chivas-regal:/etc/redis/data# redis-server ../config/redis-6380.conf
root@chivas-regal:/etc/redis/data# redis-cli -p 6380
127.0.0.1:6380> set name snopzyz
OK
127.0.0.1:6380> set age 21
OK
```

观察一下 /etc/redis/data 下的文件  

```vb
root@chivas-regal:/etc/redis/data# ll
total 28
drwxr-sr-x 2 root  redis  4096 Oct 25 07:48 ./
drwxrws--- 4 redis redis  4096 Oct 25 04:02 ../
-rw-r--r-- 1 root  redis 11572 Oct 25 07:48 6380.log
-rw-r--r-- 1 root  redis    89 Oct 25 07:48 appendonly-6380.aof
-rw-r--r-- 1 root  redis   119 Oct 25 04:05 dump-6380.rdb

root@chivas-regal:/etc/redis/data# cat appendonly-6380.aof
*2
$6
SELECT
$1
0
*3
$3
set
$4
name
$7
snopzyz
*3
$3
set
$3
age
$2
21
```

可以看到生成了一份 appendonly-6380.aof ，且里面的内容其实就是客户端与服务端的通信内容。  
这里可以简单讲解一下
- `*n`：代表下面 $n$ 个单词都属于一条通信
- `$m`：代码接下来 $m$ 个字符属于一个单词

所以上面的内容我们可以手动恢复一下  
1. `SELECT 0`
2. `set name snopzyz`
3. `set age 21`

这就是我们之前操作的命令（第一条是自定义端口自动执行的）

## AOF 重写

如果很直白地记录所有的操作，那么 .aof 文件会无限制增大，且过多的指令记录也会使得恢复变得很慢。  
为了：
1. 降低磁盘占用
2. 提高持久化效率，降低写时间
3. 提高数据效率

**将对同一个数据的若干条指令的执行结果转化为最终结果数据对应的指令进行记录**，叫做 AOF 重写。  

### 重写规则

- 超时数据不再写入
- 忽略无效指令，重写时用进程内的数据直接生成，故仅保留最终的数据写入命令
- 多条写命令合并为一条

### 重写指令

- 手动非阻塞重写：`bgrewriteaof`
- 自动重写：
  - `auto-aof-rewrite-min-size size`：文件达到这个大小后重写<br>`aof_current_size` > `auto-aof-rewrite-min-size`）
  - `auto-aof-rewrite-percentage percentage`：当前尺寸与基础尺寸的增量百分比达到这个大小后重写<br>（(`aof_current_size`-`aof_base_size`)/`aof_base_size` >= `auto-aof-rewrite-percentage`）

这里用手动重写展示一下，首先客户端做三次 `set name xxx`  

```vb
127.0.0.1:6380> set name abc
OK
127.0.0.1:6380> set name xyz
OK
127.0.0.1:6380> set name snopzyz
OK
```

然后看一下 data/appendonly-6380.aof，你会看到非常多的 `set name xxx` 指令，这里不再放出来了。  
然后客户端那边再执行一下 `bgrewriteaof` 后再看看这个文件  

```vb
*2
$6
SELECT
$1
0
*3
$3
set
$4
name
$7
snopzyz
*3
$3
set
$3
age
$2
21
```

又变为了一个 `set name snopzyz` 指令，小了很多。  

### 重写流程

1. Redis 调用 fork() 分裂出子进程，与旧 AOF 文件向新 AOF 文件重写时的 aof重写缓存区
2. 子进程向临时文件写新的 AOF
3. 父进程在缓冲区中累积新的变更并会写入旧的 AOF 文件
4. 子进程写完后通知父进程，父进程将缓冲区追加到新 AOF 文件末尾
5. 将新 AOF 文件合并替换为当前用的 AOF 文件

## 优缺点

优点：
- 存储速度快于 AOF
- 数据更为安全
- 资源消耗较轻量
- 启动优先级高于 RDB

缺点：
- 恢复速度慢于 RDB
- 占用空间较大