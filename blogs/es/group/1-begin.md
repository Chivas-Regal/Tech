---
title: 搭建集群
---

::: tip 启动方式

下面都是在讲非 Docker 的搭建方式，与 [之前讲安装方式](../0-begin.html) 的时候不同，这里作者没有讲 Docker 的哈。  

:::

翻出之前装 ES 的压缩包，整出来三个干净的 ES。  

![20241031114017](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20241031114017.png)

我是直接在装 es 的原目录下给 bin 同级创建了个 group，里面重新解压了三份 es。  
然后在 config/elasticsearch.yml 这样配置（先拿 node-9210 的举例）

```yml
# node-9210/config/elasticsearch.yml

# 所属集群名
cluster.name: zhangyize-es-group
# 本节点名
node.name: node-9210

# 本节点的HTTP端口
http.port: 9210
# 本节点的TCP端口
transport.tcp.port: 9310
# 集群内可发现的其他节点的 TCP 地址
discovery.zen.ping.unicast.hosts: ["127.0.0.1:9310","127.0.0.1:9311","127.0.0.1:9312"]
# 集群启动时的 Master 候选
cluster.initial_master_nodes: ["node-9210", "node-9211", "node-9212"]

# 主节点竞选票数下限，一般是总节点数除2向下取整+1
discovery.zen.minimum_master_nodes: 2
# 是否为主节点
node.master: true

# 本节点数据的存放路径
path.data: /Users/zhangyize/DEVELOP_MENT/elasticsearch-7.14.0/group/node-9210/data
# 本节点日志的存放路径
path.logs: /Users/zhangyize/DEVELOP_MENT/elasticsearch-7.14.0/group/node-9210/logs


# 允许跨域
http.cors.enabled: true
# 可跨域域名
http.cors.allow-origin: "*"
# 允许所有节点访问
network.host: 0.0.0.0
```

比葫芦画瓢配一下其他两个节点的信息。  
这个是 node-9211 的。  

```yml
# node-9211/config/elasticsearch.yml

cluster.name: zhangyize-es-group
node.name: node-9211

http.port: 9211
transport.tcp.port: 9311
discovery.zen.ping.unicast.hosts: ["127.0.0.1:9310","127.0.0.1:9311","127.0.0.1:9312"]
cluster.initial_master_nodes: ["node-9210", "node-9211", "node-9212"]

discovery.zen.minimum_master_nodes: 2
node.master: true

path.data: /Users/zhangyize/DEVELOP_MENT/elasticsearch-7.14.0/group/node-9211/data
path.logs: /Users/zhangyize/DEVELOP_MENT/elasticsearch-7.14.0/group/node-9211/logs

http.cors.enabled: true
http.cors.allow-origin: "*"
network.host: 0.0.0.0
```

和 node-9212 的。  

```yml
# node-9211/config/elasticsearch.yml

cluster.name: zhangyize-es-group
node.name: node-9212

http.port: 9212
transport.tcp.port: 9312
discovery.zen.ping.unicast.hosts: ["127.0.0.1:9310","127.0.0.1:9311","127.0.0.1:9312"]
cluster.initial_master_nodes: ["node-9210", "node-9211", "node-9212"]

discovery.zen.minimum_master_nodes: 2
node.master: true

path.data: /Users/zhangyize/DEVELOP_MENT/elasticsearch-7.14.0/group/node-9212/data
path.logs: /Users/zhangyize/DEVELOP_MENT/elasticsearch-7.14.0/group/node-9212/logs

http.cors.enabled: true
http.cors.allow-origin: "*"
network.host: 0.0.0.0
```

然后把要用的插件在每个节点的 plugins 目录下各放一份。  
最后通过这三个节点的 bin/elasticsearch 分别启动即可，如果启动时一直看着 node-9210 的日志的话，可以看到  

![20241031120255](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20241031120255.png)

在机器刚启动时没有找到 Master，因为只有它自己一个节点，等到 9211 上线后，Master 就投给 9211 了。  
此时访问一下集群（连接任意一个节点就可以），作者这边是通过浏览器扩展 ElasticSearch Head 访问的。  

![20241031141951](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20241031141951.png)  

刚连上的集群，有一个系统索引，此时它这两个 [0] 就是两个分片，一主分片一副本分片。  
下一步给这个集群创建个索引 test_index，就只设置个分片规则，三个主分片，每个主分片有两个副本分片。  

![20241031142349](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20241031142349.png)  

此时刷新一下就可以观测到这个索引了，以及它内部存放的分片

![20241031142455](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20241031142455.png)