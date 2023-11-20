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

`CuratorCache.build` 其实还可以指定第三个参数    
- 当没有时：整棵树都会被缓存
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

