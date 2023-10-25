---
title: 通用操作与配置文件修改
---

## 配置文件与启动

### 自带配置调改

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

### 命令行设参启动

`redis-server --<配置key> <配置value>`  

可以按不同的配置启动多台 redis，比如  



```sh
redis-server --port 6379 --daemonize yes
redis-server --port 6380 --daemonize yes
```



这样就启动了两台 redis，同时在连接的时候采用  
`redis-cli [-p <port值>] [-h <ip地址>]`  
来连接不同的端口 redis  

这里根据上面的两个进行连接  



```sql
# cmd1
(base) snopzyz@snopzyzdeMacBook-Pro ~ % redis-cli -p 6379
127.0.0.1:6379> 
```

```sql
# cmd2
(base) snopzyz@snopzyzdeMacBook-Pro ~ % redis-cli -p 6380
127.0.0.1:6380> 
```

来尝试一下再连一个我们没有启动 redis 的端口  

```sql
# cmd3
(base) snopzyz@snopzyzdeMacBook-Pro ~ % redis-cli -p 6381
Could not connect to Redis at 127.0.0.1:6381: Connection refused
not connected> exit
```

发现会连接失败

### 配置文件启动

先阅读一下他们给咱们的配置文件，把不用的信息删掉并另存为另一个文件  

```sh
cat redis.conf | grep -v "#" | grep -v "^$" > redis-6379.conf
```

这里最基础版配置仅需关注五个信息  

```cmd
# 绑定本机 ip，且仅能通过 ipv6 回环地址访问
bind 127.0.0.1 -::1
# 绑定本机 ip 的端口号
port 6379
# 以守护进程模式启动
daemonize yes
# 日志文件名
logfile "6379.log"
# “日志文件、持久化文件 ...” 生成的地址
dir ./redis-log
```

这里启动的方式直接 `redis-server <配置文件的路径>` 即可  

## redis-cli 系统命令

### 清屏

```sql
clear
```

### 帮助文档

如果什么都不知道想看一下最宽泛的帮助文档，直接  

```sql
help
```

![20231021164142](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231021164142.png)

如果知道某个首关键字但是不知道怎么用，采用如下形式  

```sql
help <查询的关键字>
```

![20231021163956](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231021163956.png)

根据上面的 help 我们也可以查询群组命令内容  

```sql
help @<查询的群组名>
```

![20231021164411](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231021164411.png)

这里就是 string 下的命令

### 退出

`exit` 和 `quit` 都可以

## 通用命令

### 数据操作

#### 基础相关

- 删除指定 key：`del key`
- 获取 key 是否存在：`exists key`
- 获取 key 的类型：`type key`
- 匹配查询 key：`keys pattern`<br>规则：
  - `*` 匹配任意数量的任意符号
  - `?` 匹配一个任意符号
  - `[]` 匹配一个指定符号
- 改名：可以理解为先 `del` 然后再 `?set`
  - 硬性改名（已经有了话则覆盖）：`rename key newkey`
  - 软性改名（已经有了话则失败）：`renamenx key newkey`
- 对 key 的内容排序且不动原数据：`sort` （仅支持list、set、sorted_set）
- 其他通用操作：`help @generic`

<p></p>

```sql
-- 设置每个类型都一个 key ，格式为 _<类型>
127.0.0.1:6379> set _string "hello world"
OK
127.0.0.1:6379> hset _hash field value
(integer) 1
127.0.0.1:6379> lpush _list snopzyz
(integer) 1
127.0.0.1:6379> sadd _set snopzyz
(integer) 1
127.0.0.1:6379> zadd _sset 1 snopzyz
(integer) 1

-- 看看存在性
127.0.0.1:6379> exists _set
(integer) 1
127.0.0.1:6379> exists _good_
(integer) 0

-- 看看它们都属于什么类型
127.0.0.1:6379> type _string
string
127.0.0.1:6379> type _sset
zset
127.0.0.1:6379> type _list
list

-- 强制改名
127.0.0.1:6379> rename _string _hash
OK

-- 不管什么类型 rename 都可以覆盖
127.0.0.1:6379> get _hash
"hello world"

-- 已有 _list ，改名失败
127.0.0.1:6379> renamenx _hash _list
(integer) 0
```

匹配：  
- `keys *` 匹配所有
- `keys *sn*` 匹配中间有 `sn` 的 key
- `keys ?s` 匹配一个任意符号一个 `s` 组成的 key
- `keys s[abc]nopzyz` 可以匹配 `sanopzyz`、`sbnopzyz`、`scnopzyz`

#### 时效性相关  

- 设置有效期：
  - 按持续时间（秒）：`expire key seconds`
  - 按持续时间（毫秒）：`pexpire key milliseconds`
  - 按时间戳（秒）：`expireat key timestamp`
  - 按时间戳（毫秒）`pexpireat key milliseconds-timestamp`
- 获取有效时间：不存在返回 -2，永久返回 -1，否则返回有效时长
  - `ttl key`
  - `pttl key`
- 切换为永久性：
  - `persist key`

<p></p>

```sql
-- name = "snopzyz"
127.0.0.1:6379> set name snopzyz
OK

-- name 持续时间 30 秒
127.0.0.1:6379> expire name 30
(integer) 1

-- 第 12 秒查询剩 18 秒
127.0.0.1:6379> ttl name
(integer) 18

-- 中间查询一下
127.0.0.1:6379> get name
"snopzyz"


-- 第 23 秒查询剩 7 秒
127.0.0.1:6379> ttl name
(integer) 7

-- 第 33 秒查询，不存在，返回 -2
127.0.0.1:6379> ttl name
(integer) -2
```

### 数据库操作

redis 初始给出 16 个数据库编号为 $[0,15]$，在同一片空间下，没有大小之分，起始使用 $0$ 号数据库  

- 切换数据库：`select index`
- 测试连通：`ping` （连通了话返回 `PONG`）
- 将数据移动到另一个数据库：`move key db` <br>$A$ 数据库的 `msg` 移动到 $B$ 数据库，必须保证 $A$ 中有 `msg` 且 $B$ 中没有 `msg` ，否则失败
- 数据清除：
  - 获取当前数据库下 key 的数量：`dbsize`
  - 清除当前数据库：`flushdb`
  - 清除所有数据库：`flushall`

<p></p>

```sql
-- 0号db有 name,user,pass
127.0.0.1:6379> set name snopzyz
OK
127.0.0.1:6379> set user 001
OK
127.0.0.1:6379> set pass 123456
OK
127.0.0.1:6379> keys *
1) "pass"
2) "name"
3) "user"

-- 移动 db0.user 到 db1.user
127.0.0.1:6379> move user 1
(integer) 1
-- db0 有 pass,name
127.0.0.1:6379> keys *
1) "pass"
2) "name"
127.0.0.1:6379> select 1
OK
-- db1 有 user
127.0.0.1:6379[1]> keys *
1) "user"

-- 清空 db1
127.0.0.1:6379[1]> flushdb
OK
-- 什么都没了
127.0.0.1:6379[1]> keys *
(empty array)
127.0.0.1:6379[1]> select 0
OK
-- db0 还有之前的
127.0.0.1:6379> keys *
1) "pass"
2) "name"
```