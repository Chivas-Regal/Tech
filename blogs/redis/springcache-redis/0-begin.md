---
title: 配置与入门案例
---

## 简介

数据都储存在磁盘数据库中，是具备很高的数据持久性，但访问速度就很慢了。  
如果我们有一个内存缓存工具，将库中最近或者最频繁访问的数据放到内存中，这样在后面取数据的时候直接在内存中取即可，而不需要进入到磁盘中了。  
  
根据上面学的，我们很容易想到 `RedisTemplate`，在取磁盘数据的**前面填充一层对缓存数据的查询**，**后面填充一层对缓存数据的写入**，学过 Spring 的都知道这不就是 AOP 实现吗？  
手写 AOP 还是太过麻烦了，`SpringCache` 提供了更方便的方式。  

看一个简单的小例子：  
```java
...
    @Cacheable(value = "website", key = "#name")
    public Website get (String name) {
        return new Website(name, 0);
    }
...
```

这是某 Service 类中的一个方法，`@Cacheable` 是 `SpringCache` 注解，它帮助我们对这个方法做 AOP 环绕，也就是和我们上面说的一样：在前后加了缓存相关的内容。  
意思就是：如果我缓存库中没有 `website::{这里填入参数中的name具体值}` 这个 key，那它就会执行方法，然后将返回值填到缓存里面，否则直接调用缓存。  
这样做如果我们这个方法业务逻辑部分十分耗时，将只有第一次耗时，而之后调用该方法都会直接取缓存直接给出返回值，非常快。  

说了这么多，下面讲一下如何配置。  

## 配置

### 导入依赖

SpringCache 的依赖是这个

```xml
<!-- pom.xml -->

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-cache</artifactId>
</dependency>
```

还有别的一些帮助我们集成 Redis 的依赖

```xml
<!-- pom.xml -->

<!-- Jedis -->
<dependency>
    <groupId>redis.clients</groupId>
    <artifactId>jedis</artifactId>
</dependency>
<!-- Spring Boot Data Redis -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-redis</artifactId>
    <exclusions>
        <!--排除lettuce客户端（默认使用lettuce客户端）-->
        <exclusion>
            <artifactId>lettuce-core</artifactId>
            <groupId>io.lettuce</groupId>
        </exclusion>
    </exclusions>
</dependency>

<!-- 提供 @Data 等注解的工具 -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>

<!-- 为了后面可自定义 json 序列化器 -->
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
</dependency>
```

### 自定义属性

需要的是我们之前一直用的那一套 Redis 的属性变量值，以及这里 `spring.cache` 新增的一些属性。  

```yml
# application.yml

spring:
  # redis 连接信息与连接池配置
  redis:
    host: 10.211.55.16
    port: 6379
    lettuce:
      pool:
        max-wait: 3000
        min-idle: 0
        max-idle: 8
        max-active: 8

  cache:
    # cache 使用 redis 作为缓存库
    type: redis
    redis:
      # 一个 key 的超时时间（设置为 60*60*1000ms = 1h）
      time-to-live: 3600000
      # 是否缓存 null 值（设置为 true，防止缓存穿透）
      cache-null-values: true
```

### RedisCacheConfiguration 统计配置信息

要做一个 Bean 来为我们的 SpringCache 集成 Redis 填入具体的使用配置。  
1. 做一个 `RedisCacheConfiguration` 当默认的 spring-cache 缓存器配置信息
2. 做一个 json 格式的序列化器赋给 `RedisCacheConfiguration` 做 value 序列化器
3. 根据我们的每一个属性变量（用 `CacheProperties.Redis` 截取），来为 `RedisCacheConfiguration` 添加信息

<p></p>

```java
// com.snopzyz.config. RedisConfig.java

@Configuration
public class RedisConfig {

    // 创建String序列化工具
    private static final StringRedisSerializer stringSerializer = new StringRedisSerializer();
    // 创建JSON序列化工具
    private static final GenericJackson2JsonRedisSerializer jsonSerializer = new GenericJackson2JsonRedisSerializer();

    /**
     * 做一个 SpringCache 与 redis 继承的缓存器配置
     * @param cacheProperties 属性信息中 spring.cache 的有关内容
     * @return 做好的收集了信息的配置类
     */
    @Bean
    public RedisCacheConfiguration redisCacheConfiguration (CacheProperties cacheProperties) {
        RedisCacheConfiguration config = RedisCacheConfiguration
                /* 使 config 对象成为 spring-cache 的默认缓存器 */
                .defaultCacheConfig()
                /* 设置 value 的序列化与反序列化方式为 json */
                .serializeValuesWith(RedisSerializationContext
                        .SerializationPair
                        .fromSerializer(jsonSerializer)
                );

        /* 获取在被 application.yml 修改后的 spring.cache.redis 的配置信息 */
        CacheProperties.Redis redisProperties = cacheProperties.getRedis();
        /* 如果配置中没有要缓存 null 值，config 就不缓存 */
        if (!redisProperties.isCacheNullValues()) {
            config = config.disableCachingNullValues();
        }
        /* 如果配置中没有要用 key + 前缀的方式， config 就不用 */
        if (!redisProperties.isUseKeyPrefix()) {
            config = config.disableKeyPrefix();
        }
        /* 如果配置中存在持续时间，缓存就加入持续时间 */
        if (redisProperties.getTimeToLive() != null) {
            config = config.entryTtl(redisProperties.getTimeToLive());
        }
        return config;
    }
}
```

### 全局打开缓存

在启动类（这里用的是 SpringBoot 做的示例，就在 `SpringCacheApplication`）上加入注解  

```java
@EnableCaching
```

## 起步案例

如果上面的都配好了，这里就可以开始做一个示例程序了。  
我们还是用 entity-service-controller 的格式去创建，这里做一个**网站 Website 的信息获取功能**。  

### entity

首先要有网站类做了一些信息，并且自定义一下全参构造，加入一个输入方便我们测试都初始化了几次类（创建了几次网站）。  

```java
// com.snopzyz.entity. Website.java

@Data
@NoArgsConstructor
public class Website {

    /* 用户名 */
    private String name;

    /* 点赞次数：在本案例中全为创建网站，都为 0 */
    private Integer star;

    public Website (String name, Integer star) {
        /* 打印一句网站创建信息 */
        System.out.println("Create one website : name=" + name);
        this.name = name;
        this.star = star;
    }
}
```

### service

一般 aop 都是封在业务层的，于是我们在这里加入 Cache 的方法注解。  
先说一个简单的 `@Cacheable(value = "website", key = "#name")` ，这个注解的意思是我们缓存 key 以 `website::` 为前缀，而该方法的参数中必须要有一个名为 `name` 的变量，会把它的值也填入缓存 key 中，比如 `name=snopzyz` 时，那么创建或者查询的缓存 key 为 `website::snopzyz`  
而功能是如果缓存中存在 `website::snopzyz` 这个 key ，方法将直接返回这个 key 的 value，否则会执行这个方法并将返回值填入 `website::snopzyz` 的 value 中。  

```java
// com.snospzyz.service. WebsiteService.java

@Service
public class WebsiteService {

    /**
     * 根据网站 name 查询网站信息，封装为 Website 类的 json 返回
     * @param name 网站名
     * @return 网站信息的 Website json 格式
     */
    @Cacheable(value = "website", key = "#name")
    public Website get (String name) {
        return new Website(name, 0);
    }

}
```

### controller

就简单的调用一下 `WebsiteService` 即可，在调用之前输出一下流程信息。  

```java
// com.snopzyz.controller. WebsiteService.java

@RestController
@RequestMapping("/website")
public class WebsiteController {

    @Autowired
    private WebsiteService websiteService;

    @GetMapping
    public Website get (@RequestParam String name) {
        System.out.println("WebsiteController 执行 get(" + name + ") 方法");
        return websiteService.get(name);
    }

}
```

### 程序运行与测试  

#### 预期的逻辑

如果我们没有调用过 `get`，那么缓存中什么都没有。  
1. 第一次访问 `localhost:8080/website?name=snopzyz` ： <br>调用 `WebsiteController.get(snopzyz)` 【输出：`WebsiteController 执行 get(name)`】<br>进入到业务层的同名函数，会执行 `Website(snopzyz,0)` 【输出：`Create one website : name=snopzyz`】后返回 <br> 并在缓存库中加入 key 为 `website::snopzyz` 且 value 为 `name=snopzyz,age=0` 的 `Website` 类的 json 格式，并设置时限为 1h。  
2. 第二次访问 `localhost:8080/website?name=snopzyz` ：<br>调用 `WebsiteController.get(snopzyz)` 【输出：`WebsiteController 执行 get(name)`】<br>进入到业务层的同名函数，检测到缓存中存在 `website::snopzyz` 这个 key，直接返回它的 value

总结一句就是，访问多次 `localhost:8080/website?name=snopzyz`，每次都会输出  `WebsiteController 执行 get(name)` ，但只有第一次会输出 `Create one website : name=snopzyz`  

#### 实际的行为  

现在库中什么都没有  
![20231102152703](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231102152703.png)  

访问 `localhost:8080/website?name=snopzyz`  
<img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231102153134.png" height="600px"/>  
看到两个输出都在，redis 中也多了一条 key-value  
![20231102153213](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231102153213.png)  

再次访问 `localhost:8080/website?name=snopzyz`  
<img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231102153308.png" height="600px"/>   
这次有返回值，但是并没有调用 `Website()` 方法，说明是采用了缓存  
redis 中也还是这条数据  
![20231102153403](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231102153403.png)  

然后我们变更一下，访问 `localhost:8080/website?name=demo`  
<img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231102153447.png" height="600px"/>   
两句话都输出了，返回的也是，再看一眼 redis  
![20231102153533](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231102153533.png)  
多了个 `website::demo` ，测试成功。