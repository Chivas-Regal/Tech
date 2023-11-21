---
title: Watcher 机制
---

ZooKeeper 客户端可以在一个节点上注册一些监听事件，当这些监听事件成立触发时，会将此消息通知给所有注册了 watcher 的客户端，此机制保证了 Zookeeper 可以实现分布式协调服务。  
Watcher 有三种：
- `NodeCache`：只监控某一个特定的节点
- `PathChildrenCache`：监控一个分支节点的子节点
- `TreeCache`：监控一个子树

下面说一下使用方式，分为几个步骤：  
1. 创建 CuratorCache 缓存器
2. 创建 CuratorListener 监听器
3. 将监听器注册到缓存器中
4. 启动缓存器

这里给出代码实现      

```java
// ..client的创建和关闭略过

/* 1. 创建 CuratorCache 缓存器 */
CuratorCache cache = CuratorCache.build(client, "/snopzyz/data");
/* 2. 创建 CuratorListener 监听器 */
CuratorCacheListener listener = CuratorCacheListener.builder()
        .forNodeCache(new NodeCacheListener() {
            @Override
            public void nodeChanged() throws Exception {
                System.out.println("我变化啦！");
            }
        })
        .build();
/* 3. 将监听器注册到缓存器中 */
cache.listenable().addListener(listener);
/* 4. 启动缓存器 */
cache.start();
```

这样当在对 /snopzyz/data 节点进行写操作时，就会触发回调执行 nodeChanged   
当然要使用 PathChildrenCache 模式的话要将创建监听器替换为

```java
CuratorCacheListener listener = CuratorCacheListener.builder()
        .forPathChildrenCache("/snopzyz", client, new PathChildrenCacheListener() {
            @Override
            public void childEvent(CuratorFramework client, PathChildrenCacheEvent event) throws Exception {
                System.out.println("俺孩儿变了！");
            }
        })
        .build();
```

同理 TreeCache 模式：  

```java
CuratorCacheListener listener = CuratorCacheListener.builder()
        .forTreeCache(client, new TreeCacheListener() {
            @Override
            public void childEvent(CuratorFramework client, TreeCacheEvent event) throws Exception {
                System.out.println("俺后代有的变了！");
            }
        })
        .build();
```

`CuratorCache.build` 还可以指定第三个参数来指定缓存的模式    
- 当没有时：默认整棵树都会被缓存
- `CuratorCache.Options.SINGLE_NODE_CACHE`：只缓存一个节点
- `CuratorCache.Options.COMPRESSED_DATA`：节点的值进行压缩
- `CuratorCache.Options.DO_NOT_CLEAR_ON_CLOSE`：在连接关闭时不删除缓存

CuratorCacheListener 还提供了如下方法直接供我们指定触发时机    

```java
// ..client的创建和关闭略过

/* 1. 创建 CuratorCache 缓存器 */
CuratorCache cache = CuratorCache.build(client, "/snopzyz/data");
/* 2. 创建 CuratorListener 监听器 */
CuratorCacheListener listener = CuratorCacheListener.builder()
        // 在创建时
        .forCreates(childData -> System.out.print("[forCreates]"))
        // 在删除时
        .forDeletes(childData -> System.out.print("[forDeletes]"))
        // 在修改时
        .forChanges((oldNode, node) -> System.out.print("[forChanges]"))
        // 在创建与修改时
        .forCreatesAndChanges((oldNode, node) -> System.out.print("[forCreatesAndChanges]"))
        // 在创建、删除与修改时
        .forAll((type, oldData, data) -> System.out.println("[forAll]"))
        .build();
/* 3. 将监听器注册到缓存器中 */
cache.listenable().addListener(listener);
/* 4. 启动缓存器 */
cache.start();


/* 测试使用 */
client.create().creatingParentsIfNeeded().forPath("/snopzyz/data");
client.setData().forPath("/snopzyz/data", "hello,cache".getBytes());
client.delete().forPath("/snopzyz/data");

/**
 * 执行结果：
 * 
 * [forCreates][forCreatesAndChanges][forAll]
 * [forChanges][forCreatesAndChanges][forAll]
 * [forDeletes][forAll]
 */
```

## 实现机制

注册 watcher 时客户端在自己的 ZKWatchManager 中注册后会将注册事件通过 outgoingQueue 队列发送给服务端， 并开启一个线程等待服务端的回调。  
然后服务端也将其存储到自己的 WatchManager 中。  
当做了数据变更时，服务端扫描自己的 WatchManager 中是否存在 watcher，若存在则发送给客户端通知消息，客户端反序列化头信息处理为 event 对象，会有一个线程循环取出该 event 对象的 watcher 执行 process。   

简单来说就是双方都注册 watcher，数据变更时服务端通知客户端执行 process  

