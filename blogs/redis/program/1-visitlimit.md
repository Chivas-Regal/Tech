---
title: String实现访问次数限制
---

主要是对 [string应用中api次数限制](../datatype/1-string.html#访问次数限制) 的 Jedis 化示例  
其中主体为这一段  

```java
/* 用户 */
private String name;
/* 每10秒限制的访问次数 */
private Long limit;

...

/* 获取 user:name 这个 key 的值 */
String times = jedis.get("user:"+name);

/* 如果没有的话代表还没有出现或者已过期，就初始化一下 */
if (times == null) {
    /* value 的意思是超过 limit 后接收 redis 自己抛的异常来简化业务 */
    jedis.setex("user:"+name, 10, Long.MAX_VALUE - limit + "");
} else {
    /* 否则自增1，同时接收到值经过处理后得出是第几次自增 */
    Long times1 = jedis.incr("user:"+name);
    System.out.println(name + " 运行 work() 第 " + (limit-Long.MAX_VALUE+times1) + " 次");
}
```

在用这个代码运行的时候，可以得到要接收的 Redis 的异常为 `JedisDataException`。  
于是在这段逻辑外加一层异常捕捉  

```java

try {

    /* 刚才的核心业务逻辑 */

} catch (JedisDataException e) {
    System.out.println("次数已用尽，请稍后再来 ...")
} finally {
    jedis.close();
}

```

有了这些就可以实现功能了。  
下面给出的代码描述为一个对 `work()` 方法的调用次数。  
具体在做的时候我们可以把 `work()` 用于对某个 api 方法的包装（可以使用 AOP），保证这个 api 函数存在调用次数限制。  

```java
// TimesLimitService.java

public class TimesLimitService {

    public String name;
    public Long limit;

    public TimesLimitService (String name, Long limit) {
        this.name = name;
        this.limit = limit;
    }

    public void work () {
        Jedis jedis = new Jedis("127.0.0.1", 6379);

        try {
            String times = jedis.get("user:"+name);
            if (times == null) {
                jedis.setex("user:"+name, 10, Long.MAX_VALUE - limit + "");
            } else {
                Long times1 = jedis.incr("user:"+name);
                System.out.println(name + " 运行 work() 第 " + (limit-Long.MAX_VALUE+times1) + " 次");
            }
        } catch (JedisDataException e) {
            System.out.println("次数已用尽，请稍等再来 ...");
            return;
        } finally {
            jedis.close();
        }
    }

}
```