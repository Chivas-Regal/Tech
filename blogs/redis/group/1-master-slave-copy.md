---
title: 多机基本概念 与 主从复制
---

## 主从服务器

单机 Redis 在机器故障后存在较高的数据丢失风险，以及重启时数据恢复较慢，导致可用性过低。  
以及内存存在瓶颈，或者硬件跟不上。  
于是可以使用多台服务器互相连通保存互相的副本，做冗余备份，同时保证数据同步。  

- 提供数据方：主服务器 `master`，只写数据
- 接收数据方：从服务器 `slave`，只读数据  
  
这里 master 要和 slave 进行同步数据，所以核心工作是同步。  
它们之间的关系是：

```yml
master:
  - slave
  - slave
  - slave
  ...
```

一个 slave 只对应一个 master，但一个 master 可以对应多个 slave  

## 主从复制

### 作用

- 负载均衡：基于master写slave读的读写分离，与主从结构，分摊 master 的负载，提高服务的读写负载能力与服务器并发量和吞吐量。
- 故障恢复：若master出了问题就用slave提供临时服务，可实现快速的故障恢复。
- 数据冗余：多台主机多个数据热备份，是一种数据冗余方式。
- 高可用：基于主从复制添加哨兵和集群，实现服务器高可用。

### 流程1.建立连接

$slave\rightarrow master$

<table>
  <tr>
    <th>流程编号</th>
    <th>master</th>
    <th>slave</th>
  </tr>
  <tr>
    <td>1</td>
    <td></td>
    <td>发送指令：<code>slaveof ip port</code></td>
  </tr>
  <tr>
    <td>2</td>
    <td>接收到指令，进行响应</td>
    <td></td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>保存 <code>masterhost</code> 与 <code>masterport</code></td>
  </tr>
  <tr>
    <td>4</td>
    <td></td>
    <td>根据保存的连接信息创建 socket 与 master 进行通信</td>
  </tr>
  <tr>
    <td>5</td>
    <td></td>
    <td>周期性发送 <code>ping</code> 检测是否连通</td>
  </tr>
  <tr>
    <td>6</td>
    <td>接收到 <code>ping</code>，响应 <code>pong</code></td>
    <td></td>
  </tr>
  <tr>
    <td>7</td>
    <td></td>
    <td>将监听自己的端口发送给 master：<code>replconf listening-port &lt;port-number&gt;</code></td>
  </tr>
  <tr>
    <td>8</td>
    <td>保存 slave 的端口号</td>
    <td></td>
  </tr>
</table>

现在我们做一下建立连接的示范，我们令 `127.0.0.1:6379` 做为 master，`127.0.0.1:6380` 作为 slave。  
首先看一下 config/redis-6379.conf 文件：

```conf
bind 127.0.0.1 ::1
port 6379
daemonize no
# logfile "6379.log"
dir /etc/redis/data

dbfilename dump-6379.rdb
rdbcompression yes
rdbchecksum yes

appendonly yes
appendfsync everysec
appendfilename appendonly-6379.aof
```

至于 `redis-6380.conf` 文件只需要将这里的 6379 全部换成 6380 ，同时加上一行 `slaveof 127.0.0.1 6379`。    

下面演示由于要用四宫格，于是全部以贴图进行，我们这里介绍一下成员。    
![20231026191327](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231026191327.png)

然后两个 redis-server 都打开，会弹出这样的日志  
![20231026191639](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231026191639.png)    
其中红框内的就是 master-slave 连接信息的日志

然后是两个客户端，将它们分别启动后 master 调用 `set name snopzyz` 后观察 slave 调用 `get name` 的状态：  
![20231026192141](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231026192141.png)  
发现这里也是成功获取到 master 的 key。  

分别键入 `info` ，我们也可以看到各自已经生成了连接的信息。  
![20231026194301](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231026194301.png)

若需要断开，则在 slave.redis-cli 中敲入：`slaveof no one` 即可  

### 流程2.数据同步

$master\rightarrow slave$   

首先了解一下什么是全量复制和部分复制： 
- 全量复制产生于连接开始，slave 需要将 master 中的数据通过 rdb 的形式全部刷过来
- 部分复制产生于因为某种情况无法同步数据（全量复制、断网...）的一段时间后，slave 通过刷取 master 提供的复制积压缓冲区内的数据进行复制（有点类似 aof）

其中全量复制就很暴力简单，而部分复制就需要谈谈了，它的核心属性有以下几种：  
- 两台服务器的运行 id：存放在 `info`.#Server.run_id 下，是一个 $40$ 位的数字
- 复制积压缓冲区：用于避免某个 slave 断网后重连不知道自己漏掉了哪些命令
  - 结构：一个队列，每个元素为 {偏移量，字节值} 对
  - 字节值-命令：分解保存指令的最原始状态 `.. $3\r\nset\r\n$4\r ..`
  - 偏移量-进度：
    - slave 的 offset 变量记录自己复制到哪一个偏移量了
    - master 的 offset 变量记录自己上传到哪一个偏移量了

介绍完这两个下面就是数据同步的流程了  


<table>
  <tr>
    <th>总览</th>
    <th>流程编号</th>
    <th>master</th>
    <th>slave</th>
  </tr>
  <tr>
    <td rowspan="5">全量复制</td>
    <td>1</td>
    <td></td>
    <td>发送指令 <code>psync2 ? -1</code></td>
  </tr>
  <tr>
    <td>2</td>
    <td>记录当前复制偏移量，执行 <code>bgsave</code></td>
    <td></td>
  </tr>
  <tr>
    <td>3</td>
    <td>第一个 slave 连接时创建复制积压缓冲区</td>
    <td></td>
  </tr>
  <tr>
    <td>4</td>
    <td>生成 rdb <br>发送 <b>+FULLRESYNC</b> <code>runid offset</code><br>再通过 socket 将 rdb 发送给 slave</td>
    <td></td>
  </tr>
  <tr>
    <td>5</td>
    <td></td>
    <td>收到 <b>+FULLRESYNC</b><br>保存 master 的 <code>runid</code> 和 <code>offset</code><br>接收 rdb，清空本机数据后通过 rdb 进行数据恢复</td>
  </tr>
  <tr>
    <td rowspan="3">部分复制</td>
    <td>6</td>
    <td></td>
    <td>向 master 发送 rdb 恢复完成的消息<br>发送之前保存的属性 <code>psync2 runid offset</code>，进行复制机制判断</td>
  </tr>
  <tr>
    <td>7</td>
    <td>
      接受命令，判断 <code>runid</code> 和 <code>offset</code><br>
      <ul>
        <li><code>runid</code> 不匹配：返回到流程1重新全量复制</li>
        <li>
          <code>runid</code> 匹配：
          <ul>
            <li><code>slave.offset=master.offset</code>：<br>slave 的数据走完了复制积压缓冲区，忽略部分复制流程</li>
            <li><code>slave.offset!=master.offset</code>：<br>发送 <b>+CONTINUE</b> <code>offset</code>，<br>通过 socket 发送 <code>[slave.offset,master.offset]</code> 之间的数据</li>
          </ul>
        </li>
      </ul>
    </td>
    <td></td>
  </tr>
  <tr>
    <td>8</td>
    <td></td>
    <td>收到 <b>+CONTINUE</b><br>保存 master 的 <code>offset</code><br>接收信息后执行 <code>bgrewriteaof</code> 恢复数据</td>
  </tr>
</table>

这还是在两个 server 启动时可以看到，我们关注下面的日志信息。  
![20231026200344](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231026200344.png)  
这里仔细阅读一下英文，可以发现这段就是全量复制和部分复制的过程。  

**注意事项**  
- 如果 master 数据量非常大那么应避开流量高峰期，不然容易导致 master 阻塞  
- 全量同步过程中该缓冲区被塞满使得反复进行全量复制的问题
  - 定义复制缓冲区的空间：`repl-backlog-size 1mb`
  - 在全量/部分复制时关闭对外服务：`slave-serve-stale-data yes|no`
- 多个 slave 向 master 请求同步的时机应当错开
- 多层 slave-master 由于数据同步延迟可能会导致数据一致性变差

### 流程3.命令传播（反复同步）

$master \Rightarrow slave$ 实时保持数据同步。  

异常：若此阶段发生断网：
- 闪断闪连：忽略
- 短时间中断：部分复制
- 长时间中断：全量复制

<br>

**心跳**  
主要功能是判断对方是否在线，次要功能是获取一些连接信息。  
**master 心跳**：发送一次 `PING`， 以 `repl-ping-slave-period` 确定时间间隔，默认 $10$ 秒，主要用于判断 slave 是否在线  
**slave 心跳**：一秒发送一次 `REPLCONF ACK {offset}` 汇报自己的复制偏移量以获取最新数据，同时检测 master 是否在线  
通过心跳我们可以获取到实时的 slave 连接数量和网络延时，若掉线过多或者延时过高，master 将拒绝所有信息同步，标准由我们自己配置。  
- `min-slaves-to-write 2`：最少连接的 slave 数
- `min-slaves-max-lag`：所有 slave 都达到的最长的延时（和我们主机调取 `info` 获取的 ”每个 slave 的 `lag` 也就是 slave 最后一次连接的时间间隔“ 配对）

<table>
  <tr>
    <th>流程编号</th>
    <th>master</th>
    <th>slave</th>
  </tr>
  <tr>
    <td>1</td>
    <td>发送命令 <code>ping</code></td>
    <td>发送命令 <code>replconf ack offset</code>，进行复制机制判断</td>
  </tr>
  <tr>
    <td>2</td>
    <td>
      接收 slave 命令，判断 <code>offset</code> 是否在缓冲区中<br>
      <ul>
        <li><code>offset</code> 不在缓冲区：进入数据同步阶段的全量复制</li>
        <li>
          <code>offset</code> 在缓冲区：
          <ul>
            <li><code>slave.offset=master.offset</code>：<br>slave 的数据走完了复制积压缓冲区，忽略部分复制流程</li>
            <li><code>slave.offset!=master.offset</code>：<br>发送 <b>+CONTINUE</b> <code>offset</code>，<br>通过 socket 发送 <code>[slave.offset,master.offset]</code> 之间的数据</li>
          </ul>
        </li>
      </ul>
    </td>
    <td>接收 master 命令，返回 <code>pong</code></td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td>收到 <b>+CONTINUE</b><br>保存 master 的 <code>offset</code><br>接收信息后执行 <code>bgrewriteaof</code> 恢复数据<br><br><b>重新进入流程1</b></td>
  </tr>
</table>

## 问题与优化

### 发生频繁全量复制

#### **情况1：master 重启变更 runid**  

master 数据量后面会特别大，此时如果 master 重启了 runid 将会变化，导致所有的 slave 都得再次执行一次全量复制。
    
优化方案：

在 master 内创建 `master-replid` 变量，用同等于 runid 的策略生成但是长度为 $41$ 位，发送给所有的 slave。  
master 关闭时进行 RDB 持久化，把 runid 作为 `repl-id` 保存，offset 作为 `repl-offset` 保存，这样在重启之后会续用上次的 runid 和 offset，让所有的 slave 认为还是之前的 master。

#### **情况2：复制缓冲区过小**  

网络环境不佳，使得 slave 不提供服务，主要原因是复制缓冲区过小，slave 每次的 offset 都越界从而反复全量复制。  

优化方案：  

修改复制积压缓冲区缓冲区大小：`repl-backlog-size`  
值建议为：  
`second` = master 到 slave 的重连平均时长  
`write_size_per_second` = master 平均每秒写命令数据总量   
**`repl-backlog-size` = $2\;\times$ `second` $\times$ `write_size_per_second`**

### 发生频繁网络中断

#### **情况1：slave 接收慢查询影响心跳**

因为 slave 每秒都会发送 `REPLCONF ACK` ，但如果 slave 正在接受像 `keys *` 这样的慢查询的话，master 的复制定时函数 `replicationCron()` 会发现 slave 长时间没有响应。然后就会将 slave 断开再重连再断开...    

优化方案：  

调整合理的超时时间 `repl-timeout`，默认是 60 秒，可以调整一下。  

#### **情况2：slave ping密度低影响心跳**

若 slave 发送 ping 的频度低，且网络中存在丢包，则会导致 master 将该 slave 认为是超时将其断开。  

优化方案：

提高 ping 的发送频度 `repl-ping-slave-period` （建议让上面的超时时间 `repl-timeout` 是该发送频度的 $[5,10]$ 倍）

### 数据不一致

#### 多个 slave 获取相同数据不同步

网络信息不同步导致的数据发送延迟，使得多个 slave 的数据有短暂的不一致。  

优化方案：  
  
1. 尽量在一个机房部署集群。  
2. 若某个 slave 延迟过大就屏蔽它 `slave-server-stale-data yes|no`（慎用，除非是数据一致性要求很高）。  

