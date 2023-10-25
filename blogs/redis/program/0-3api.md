---
title: 三个 redis 连接工具
---

Java 连接 Redis 的有三个
- Jedis
- SpringData Redis
- Lettuce

## Jedis

首先要在 pom.xml 中加入 Jedis 的坐标  

```xml
<!-- pom.xml -->

<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
    <version>2.7.0</version>
</dependency>
```

### 初步程序演示

Jedis 的初始化参数仅需要一个 $ip$ 地址和一个端口号   
在使用完了进行关闭就行  

```java
Jedis jedis = new Jedis("127.0.0.1", 6379);
...
jedis.close();
```

使用时 Redis 内的所有命令在 Jedis 都可以对应到同名的方法  
比如就是 `set key password`  

```java
/* set name snopzyz */
String set = jedis.set("name", "snopzyz");
/* OK */
System.out.println(set);
```

这里在测试中调用一下 `set` 和 `get`

```java
public class ...Test {

    ...

    /* 第一个运行，打印出 OK  */
    @Test
    void testSetName() {
        Jedis jedis = new Jedis("127.0.0.1", 6379);

        String set = jedis.set("name", "snopzyz");
        System.out.println(set);

        jedis.close();
    }

    /* 第二个运行，打印出 snopzyz */
    @Test
    void testGetName () {
        Jedis jedis = new Jedis("127.0.0.1", 6379);

        String name = jedis.get("name");
        System.out.println(name);

        jedis.close();
    }

    ...

}
```

### 对象存储

这里可以用我们之前说的，将 value 设为 string 类型的 json 字符串存储对象  

先做一个简单的对象 `User`  

```java
// com.snopzyz.entity.User.java

@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {

    private Integer id;

    private String username;

    private String password;
}
```

然后测试流程就是：
1. 初始化一个 `User` 对象
2. 存放一个 key=`user`，value=(fastjson转义过的json字符串)user
3. 提取并用 fastjson 转义 json 字符串为 User 对象
4. 输出内部内容

<p></p>

```java
    @Test
    void testUser () {
        /* 初始化一个 User 对象 */
        User user = new User(1, "snopzyz", "123456");

        /* 建立 jedis 连接并存放 user-json kv字符串 */
        Jedis jedis = new Jedis("127.0.0.1", 6379);
        jedis.set("user", JSON.toJSONString(user));

        /* 获取 json 字符串，并解析到 user 内 */
        String userJsonFromJedis = jedis.get("user");
        user = JSON.parseObject(userJsonFromJedis, User.class);

        /* 打印结果，并关闭连接 */
        System.out.println(user);
        jedis.close();
    }
```

### 其他数据类型操作

下面是对 list 和 hash 的操作演示，并且给出了 get 后的输出结果  

```java
    @Test
    void testList () {
        Jedis jedis = new Jedis("127.0.0.1", 6379);

        jedis.lpush("list", "1", "2", "3");
        jedis.rpush("list", "a");

        /* [3, 2, 1, a] */
        System.out.println(jedis.lrange("list", 0, -1));

        jedis.close();
    }

    @Test
    void testHash () {
        Jedis jedis = new Jedis("127.0.0.1", 6379);

        jedis.hset("user", "id", "001");
        jedis.hset("user", "name", "snopzyz");
        jedis.hset("user", "password", "123456");
        Map<String, String> user = jedis.hgetAll("user");

        /* {password=123456, name=snopzyz, id=001} */
        System.out.println(user);

        jedis.close();
    }
```

### 连接池工具类

这里说明一下我们如何做一个静态工具类，用来从一个已经初始化好的连接池中获取 Jedis 连接。  

`Jedis` 的连接池是 `JedisPool`，使用它的构造非常简单。

```java
public JedisPool(
    /* 连接池配置类 */
    GenericObjectPoolConfig poolConfig,
    /* 主机号 */
    String host,
    /* 端口号 */
    int port 
)
```

上面那个不清不楚的连接池配置类最基本的配置是配置一下“最大连接数”和“最大活跃连接数”，定义和装配用如下方式。  


```java
/* 定义一个连接池配置类 */
JedisPoolConfig jpc = new JedisPoolConfig();
/* 设置最大总连接数 */
jpc.setMaxTotal(maxTotal);
/* 设置最大活跃连接数 */
jpc.setMaxIdle(maxIdle);
```

其中有四个环境信息我们应当注意：
- 主机号
- 端口号
- 最大总连接数
- 最大活跃连接数

于是我们配好四个 properties 信息  

```properties
<!-- jedis.properties -->

redis.host = 127.0.0.1
redis.port = 6379
redis.max-total = 30
redis.max-idle = 10
```

然后环境数据装为工具类 `JedisUtil` 的静态成员，同时做一个静态代码段来初始化我们的连接池。   
最后我们用一个静态方法来获取到一个 Jedis 连接即可。  

```java
// JedisUtil.java

public class JedisUtil {

    /* Jedis 连接池 */
    private static JedisPool jp = null;

    /* 主机号 */
    private static String host = null;
    /* 端口号 */
    private static int port;
    /* 最大总连接数 */
    private static int maxTotal;
    /* 最大活跃连接数 */
    private static int maxIdle;

    /* 初始化连接池的静态代码 */
    static {
        /* 读取配置文件并装入四个成员变量中 */
        ResourceBundle rb = ResourceBundle.getBundle("jedis");
        host = rb.getString("redis.host");
        port = Integer.parseInt(rb.getString("redis.port"));
        maxTotal = Integer.parseInt(rb.getString("redis.max-total"));
        maxIdle = Integer.parseInt(rb.getString("redis.max-idle"));

        /* 初始化一个连接池配置类 */
        JedisPoolConfig jpc = new JedisPoolConfig();
        jpc.setMaxTotal(maxTotal);
        jpc.setMaxIdle(maxIdle);

        /* 初始化连接池 */
        jp = new JedisPool(jpc, host, port);
    }

    /* 获取 Jedis 连接 */
    public static Jedis getJedis () {
        return jp.getResource();
    }
}
```