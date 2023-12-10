---
title: 入门、配置与启动
---

## Kafka 基本概念

Kafka是一个分布式、支持分区多副本的消息系统，常用语日志收集、消息收发、用户活动跟踪、运营指标等场景。  
在早期 Kafka 依赖于 zookeeper 存储有关分区和代理的元数据，而在 2021/04/19 的 2.8.0 版本中用自管理的 Quorum 代替了 ZooKeeper 的功能。  

### 角色与术语

在 Kafka 中有这样一些信息
- broker：消息处理节点，代表一个 Kafka 节点
- topic：Kafka 收到消息后会根据 topic 进行归类，来发送给订阅对应 topic 的消费者
- producer：消息生产者，代表向 broker 发送消息的客户端
- consumer：消息消费者，代表从 broker 读取消息的客户端
- consumer-group：消息消费者组，由多个 consumer 组成，一个消息可以发送给多个 consumer-group ，但一个 consumer-group 只有一个 consumer 可以消费信息
- partition：分区，一个 topic 可以分为多个 partition，每个 partition 的内部消息是有序的

## 第一个 Kafka 服务

::: tip
首先需要保证你的机器中有 jdk 并且存在一台运行 zookeeper 的机器  
:::

首先在 [官网](https://kafka.apache.org/downloads) 下载 Kafka，这里版本使用 2.4.1 ，将其解压到我们的机器中（这里选择路径为 /usr/local/kafka ）  

### 配置文件

进入 config 目录下的 server.properties ，修改其中的几个地方  

- 设置集群中唯一的 `broker.id=0`
- 添加 Kafka 向外开放的地址， `listeners=PLAINTEXT://<你的机器的ip地址>:9092`
- 设置日志文件保存位置，修改为 `log.dirs=/usr/local/kafka/data/kafka-logs`
- 设置保存数据的 zookeeper 地址，`zookeeper.connect=<你的zookeeper机器的ip地址>:2181`

这里写好的这四个信息是这样的，其他的属性都不用改

```properties
broker.id=0
listeners=PLAINTEXT://192.168.1.120:9092
log.dir=/usr/local/kafka/data/kafka-logs
zookeeper.connect=192.168.1.111:2181
```

### 启动 Kafka

命令格式为 `<你的kafka安装包地址>/bin/kafka-server -start.sh <server.properties配置文件地址>`   
这里再开一个守护进程运行模式

```sh
cd /usr/local/kafka/kafka_2.11-2.4.1/bin
./kafka-serve-start.sh -daemon ../config/server.properties
```

此时进入 zookeeper 的机器中通过 zkCli.sh 进入客户端后查看 `/` 下的节点会发现  
![20231210033201](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231210033201.png)   
产生了非常多的节点  
此时查看 `/brokers/ids` 后会看到里面多出来了一个 `0`，就是我们运行的 Kafka 在 config/server.properties 中的 `broker.id`   

### 创建 topic

通过如下命令

```sh
./kafka-topics.sh --create --zookeeper 192.168.1.111:2181 --replication-factor 1 --partitions 1 --topic test
```

其中 192.168.1.111 是我在局域网中的 zookeeper 主机地址，这段命令表示 “在192.168.1.111:2181(zookeeper进程地址)创建(create)名为test(topic)的topic，有1(replication-factor)个备份，有1(partitions)个分区”。  

并且可以看一下是否创建成功（有哪些 topic）

```sh
./kafka-topics.sh --list --zookeeper 192.168.1.111:2181
```

![20231210200814](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231210200814.png)  

### 生产消息

根据上面说的生产者 producer，Kafka 内置生产者客户端 `kafka-console-producer.sh` 可以调用  
生产消息要指定 broker 的地址与 topic 信息  

```sh
./kafka-console-producer.sh --broker-list 192.168.1.120:9092 --topic test
```

因为我的 kafka 进程地址为 192.168.1.120:9092，于是在 broker-list 中写的是这个地址，并且指定 topic 为 test。  
执行后会产生一个带有前缀 `>` 的客户终端，在里面写的一行行消息就是要传递给 broker 的字符串。  

![20231210214240](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231210214240.png)

### 消费消息

根据上面说的消费者 consumer，Kafka 内置有 consumer 客户端 `kafka-console.consumer.sh` 供我们调用  
消费消息的时候要指定从哪台 kafka 服务器，哪个 topic 接收消息  

```sh
./kafka-console-consumer.sh --bootstrap-server 192.168.1.120:9092 --topic test
```

这种是不接收历史消息，而是从当前消息开始，比如下面这样的流程
- 生产者发送 `hello`
- 消费者开启
- 生产者发送 `kafka`，消费者接收到 `kafka`

生产者：  
![20231210214325](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231210214325.png)    
消费者：    
![20231210214359](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231210214359.png)  

可以看到消费者只消费了一个信息，如果要消费到历史的数据，要加上一个 `--from-beginning`  
也就是  

```sh
./kafka-console-consumer.sh --bootstrap-server 192.168.1.120:9092 --from-beginning --topic test
```

![20231210214623](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231210214623.png)  
这里就传入了所有的历史数据

::: tip
**是否显示历史数据的原理：**  

Kafka 维护了个偏移量信息  
- 当一个消费者连接不展开历史数据时，Kafka 会令该消费者从偏移量为当前消息数+1的位置开始读，也就是不读之前的历史数据
- 当一个消费者连接读取历史数据时，Kafka 会令偏移量为 0，也就是从头开始读取数据  

这样通过偏移量就实现控制了消费者的消息读取起点。
:::