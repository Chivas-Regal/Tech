---
title: 概念、安装与配置启动
---

## 模型与介绍

ZooKeeper是一个分布式的协调服务，管理分布式系统中的数据、配置，或者是搭建分布式集群，构建分布式锁等，通过Watcher机制来实现分布式系统中的协调同步问题。    
结构上来看它一种带有层级关系的树形C/S目录服务，其是为由多个节点进行组织的
- 分支节点：主要用来保存自己和子节点的信息，同时可以存储少量(1MB)数据（参考“文件夹”）
- 叶子节点：主要用来存储自己的信息和数据（参考“文件”）

同时节点也可以附加功能属性
- 持久节点：只要不手动删除节点，客户端与服务端的连接断开后该节点依然存在
- 临时节点：连接断开后节点也随之删除
- 顺序节点：按照节点名称通过添加后缀的形式进行顺序编号
- 容器节点：
    - 如果没有创建子节点，功能和持久节点一样
    - 如果创建了子节点而后续又删完了，会被 $60s$ 一次的定时任务删掉
- TTL节点：在 TTL 内没有被修改并且没有子节点就会被删除（默认不开启，开启的话要 `extendedTypesEnabled=true`）

由功能属性分化出五中节点类型
- PERSISTENT 持久化节点
- EPHEMERAL 临时节点
- PERSISTENT_SEQUENTIAL 持久化顺序节点
- EPHEMERAL_SEQUENTIAL  临时顺序节点
- CONTAINER 容器节点
- PERSISTENT_TTL 持久TTL节点
- SEQUENTIAL_TTL 顺序TTL节点


## 安装

直接从 [这里](https://zookeeper.apache.org/releases.html) 找到最新版本的进入下载页面进行下载，或者用 `wget` 在命令行做，一定要下载 ...-bin.tar.gz 的那一份    
将其解压到自己电脑中一个自己能记得请的位置（这里解压到了 /home/DEVELOP_MENT  位置

## 启动

(下面路径说明时均以“解压后文件夹位置为相对路径”进行说明)  

进入到安装时的文件夹目录下的 conf 文件夹中，简单做一份名为 zoo.cfg 的配置文件  

```sh
# 心跳间隔
tickTime=2000
# follower连接并同步leader的超时时间
initLimit=10
# follower没有动作的超时时间
syncLimit=5
# 数据目录
dataDir=/home/DEVELOP_MENT/apache-zookeeper-3.9.1/data # 按自己想要将数据放在哪为定
# 监听端口号
clientPort=2181
```
 
然后进入 bin 文件夹中，执行    

```sh
./zkServer.sh start
```

当出现如下指示时说明成功  

```
ZooKeeper JMX enabled by default
Using config: /home/DEVELOP_MENT/apache-zookeeper-3.9.1-bin/bin/../conf/zoo.cfg
Starting zookeeper ... STARTED
```

想要查看状态的话执行  

```sh
./zkServer.sh status
```