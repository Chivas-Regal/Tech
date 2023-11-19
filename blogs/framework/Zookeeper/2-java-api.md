---
title: JavaAPI-Curator 操作
---

Curator 是 Netfix 研发的后来捐献给了 Apache ，是操作 Zookeeper 的 API，不同于原生的 Java-API ，它极大简化了客户端的使用。  
先导入依赖  

```xml
<!-- pom.xml -->
<dependency>
    <groupId>org.apache.curator</groupId>
    <artifactId>curator-recipes</artifactId>
    <version>5.5.0</version>
</dependency>
```

## 连接

主要是通过调用 CuratorFrameworkFactory 这个类的静态方法完成连接的  
有两种方式，其中一个方法全描述为   

```java
newClient(
    String connectString, 
    int sessionTimeoutMs, 
    int connectionTimeoutMs, 
    RetryPolicy retryPolicy, 
    ZKClientConfig zkClientConfig
)
``` 

这里存在几个参数  

- `connectString`：可以通过 `,` 分隔的几个 `<ip>:<port>`，表示要连接的 zkserver 的地址信息
- `sessionTimeoutMs`：会话超时时间 ms
- `connectionTimeoutMs`：连接超时时间 ms
- `RetryPolicy`：重试策略，通过几个类来选择
  - `RetryForever`：一直重试
  - `RetryNTimes`：多次重试
  - `RetryOneTime`：重试一次
  - `ExponentialBackoffRetry`：指定间隔时间重试
- `zkClientConfig`：可以通过 `setProperties(key,value)` 设置配置信息的配置类

我们不使用最后一个可以设置无配置的，下面是代码示例  

```java
RetryPolicy retryPolicy = new ExponentialBackoffRetry(3000, 10);
CuratorFramework client = CuratorFrameworkFactory.newClient("127.0.0.1:2181", 60 * 1000, 15 * 1000, retryPolicy);
client.start();
```

还有一种方法 `builder` 是通过链式编程来实现配参的，内容和上面的都类似，下面是示例  

```java
RetryPolicy retryPolicy = new ExponentialBackoffRetry(3000, 10);
CuratorFramework client = CuratorFrameworkFactory.builder()
        .connectString("127.0.0.1:2181")
        .sessionTimeoutMs(60*1000)
        .connectionTimeoutMs(15*1000)
        .retryPolicy(retryPolicy)
        .build();
client.start();
```

当然这里配置链中还可以加上一个 `.namespace("/snopzyz")`，这个意思就是以 `/snopzyz` 作为后续所有命令中的前缀，当然这里就不加了先

## 节点操作

### 创建

- 创建无值节点：`.create().forPath("<路径名>")`
- 创建带值节点：`.create().forPath("<路径名>", <值的bytes体>)`
- 带模式（临时、顺序等）创建：`.create().withMode(CreateMode.<模式>).forPath(...)`
- 创建多级节点：`.create().creatingParentsIfNeeded().forPath("...")` 会当路径内父节点不存在时自动创建

使用它这里给出一个案例：  
沿用 [命令行操作中的书籍信息](./1-cmd.html#内置命令行操作) 来表示，也就是从  

```yml
/book:
  name: 《夏摩山谷》
  author: 
    name: 庆山
    birth: 19740711
  createTime: 201901
```

我们添加一个 `/book/reader` 完成登记的操作，内部存在一个Java类转换的字符串 `Reader(user=xx,fav=xx)` 表示读者名字和喜爱程度  
令创建的每一个 reader 节点为顺序临时节点，但根据临时节点的定义我们在一条客户端连接断开后会将节点清除  
所以我们添加数据后令其睡眠一段时间够我们查看数据，然后再关闭连接看看数据是否存在  

下面来进行设计（通过测试部分运行程序）  
1. 在 `@Before` 部分和 `@After` 部分做好连接的打开和关闭

<p></p>

```java
private CuratorFramework client;

@Before
public void testConnect () {
    RetryPolicy retryPolicy = new ExponentialBackoffRetry(3000, 10);
    client = CuratorFrameworkFactory.builder()
            .connectString("127.0.0.1:2181")
            .sessionTimeoutMs(60*1000)
            .connectionTimeoutMs(15*1000)
            .retryPolicy(retryPolicy)
            .build();
    client.start();
}

...

@After
public void testClose () {
    if (client != null) {
        client.close();
    }
}
```

2. 在 `...` 部分做测试逻辑  

首先要将书籍固定的信息登记上去  
然后登入两份读者信息（新开一个类 Reader 用来 `.toString()`）  
等待一段时间让我们观测数据

```java
public class CuratorTest {

    private CuratorFramework client;

    @Before
    ...

    @Test
    public void testCreate () throws Exception {

        /* 按上面的 yml 填入固定数据 */
        client.create().forPath("/book");
        client.create().forPath("/book/name", "《夏摩山谷》".getBytes());
        client.create().creatingParentsIfNeeded().forPath("/book/author/name", "庆山".getBytes());
        client.create().creatingParentsIfNeeded().forPath("/book/author/birth", "19740711".getBytes());
        client.create().creatingParentsIfNeeded().forPath("/book/createTime", "201901".getBytes());

        /* 做两个顺序且临时的 reader ，将具体 Reader 对象的 string 结果作为值保存 */

        Reader reader = new Reader("snopzyz", 10);
        String readerNodeName1 = client.create()
                .withMode(CreateMode.EPHEMERAL_SEQUENTIAL)
                .forPath("/book/reader", reader.toString().getBytes());
        System.out.println("成功创建读者：" + readerNodeName1);

        reader = new Reader("demo", 9);
        String readerNodeName2 = client.create()
                .withMode(CreateMode.EPHEMERAL_SEQUENTIAL)
                .forPath("/book/reader", reader.toString().getBytes());
        System.out.println("成功创建读者：" + readerNodeName2);

        /* 睡眠一会儿让我们在另一个客户端下看看数据 */
        Thread.currentThread().sleep(60000L);
    }

    @After
    ...
}

/**
 * 读者类
 */
@AllArgsConstructor
@ToString
class Reader {
    private String user;
    private Integer fav;
}
```

运行后控制台打印两句话  

```
成功创建读者：/book/reader0000000001
成功创建读者：/book/reader0000000002
```

说明运行成功了，然后进行等待时我们在新开终端内运行 `./zkCli.sh` 进入新的客户端，然后用 `get` 查看数据  

```sh
[zk: localhost:2181(CONNECTED) 1] ls /book
[author, createTime, name, reader0000000001, reader0000000002]
[zk: localhost:2181(CONNECTED) 2] get /book/reader0000000001
Reader(user=snopzyz, fav=10)
```

这样的回答就说明创建成功了，等待到测试部分运行结束后再在这里查看一下结构  

```sh
[zk: localhost:2181(CONNECTED) 3] ls /book
[author, createTime, name]
```

发现那两个临时节点确实因为 Curator 客户端的关闭而消失了，这样测试就算成功了

### 查询

- 查询数据：`.getData().forPath(...)`
- 查询子节点：`.getChildren().forPath(...)`
- 查询节点状态：`.getData().storingStatIn(<一个你想要置入数据的Stat类对象>).forPath(...)`

我们根据上一步创建的 /book ，在创建 /Book/reader 时对数据进行检查  

```java
...

    @Test
    public void testCreate () throws Exception {
        ...

        /* 查看 /book 下的子节点 */
        List<String> rootChildren = client.getChildren().forPath("/book");
        System.out.println("\n/book -> " + rootChildren);

        /* 查看 /book 节点的配置信息 */
        Stat stat = new Stat();
        client.getData().storingStatIn(stat).forPath("/book");
        System.out.println("/book 信息为：" + stat);

        /* 查看之前创建的两个读者（通过 new String(...)  转换 bytes[]） */
        System.out.println("读者 " + readerNodeName1 + " ：" + new String(client.getData().forPath(readerNodeName1)));
        System.out.println("读者 " + readerNodeName2 + " ：" + new String(client.getData().forPath(readerNodeName2)));
    }
...        
```

当然在运行之前要将我们创建的 /book 给 `deleteall` 一下  
运行后会打印如下内容  

```
成功创建读者：/book/reader0000000003
成功创建读者：/book/reader0000000004

/book -> [name, reader0000000003, reader0000000004, createTime, author]
/book 信息为：98,98,1700404658418,1700404658418,0,5,0,0,9,5,106

读者 /book/reader0000000003 ：Reader(user=snopzyz, fav=10)
读者 /book/reader0000000004 ：Reader(user=demo, fav=9)
```

获取到的信息和上面填入的都对应上了

### 修改

用 `.setData().forPath("<路径名>", <值的bytes体>)` 来完成，但是平时由于并发多客户端，防止修改了别的客户端刚改还没用上的数据，需要在 `.setData()` 后添加一个 `.withVersion(...)` 表示判断版本修改   
具体使用如下  

```java
Stat status = new Stat();
client.getData().storingStatIn(status).forPath("/book/name");
int version = status.getVersion();
client.setData().withVersion(100).forPath("/book/name", "《活着》".getBytes());
```

这里就是根据版本修改 /book/name 节点保存的数据

### 删除

- 删除单个节点：`.delete().forPath(...)`
- 删除带有子节点的节点：`.delete().deletingChildrenIfNeeded().forPath(...)`
- 必须成功的删除（在失败后不断重试）：`.delete().guaranteed().forPath(...)`

下面删除一下之前创建的 /book 并检查一下看看  

```java
client.delete().deletingChildrenIfNeeded().forPath("/book");
System.out.println("`/` 剩余子节点：" + client.getChildren().forPath("/"));
```

运行后打印  

```
`/` 剩余子节点：[zookeeper]
```

测试结束