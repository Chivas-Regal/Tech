---
title: 介绍与起步
---

RestClient是一个调测RestFulAPI的工具，可以向9200端口发送http请求并得到响应，es项目有自己的RestClient工具。  
对于 es 的客户端包有 high-level 的也有 low-level 的，high-level 支持的 API 比较多

::: tip
当然也有9300端口发送tcp的 `spring-data-elasticsearch` 包，但是官方不建议在9300端口操作，所以我们用 high-level 的客户端包
:::

导入依赖

```xml
<!-- pom.xml -->


<dependency>
    <groupId>org.elasticsearch.client</groupId>
    <artifactId>elasticsearch-rest-high-level-client</artifactId>
</dependency>
```

同时要指明我们 ES 使用的版本，这里包的版本要和它保持一致，我用的是 7.14.0 于是  

```xml
<!-- pom.xml -->

<properties>
    <elasticsearch.version>7.14.0</elasticsearch.version>
</properties>
```

然后我们要调用的工具类是 `RestHighLevelClient`，它的初始化和关闭方式为  

```java
// 初始化
RestHighLevelClient client = new RestHighLevelClient(RestClient.builder(
    // 指定 es 的 hostname 和 http 端口
    HttpHost.create("http://192.168.1.130:9200");
));
// 销毁
client.close()
```

为了后面更方便的测试学习功能，将 client 放到配置类中设置为 Bean  

```java
public class ESIndexTest {
    private RestHighLevelClient client;

    @BeforeEach
    void setUp () {
        this.client = new RestHighLevelClient(RestClient.builder(
                HttpHost.create("http://192.168.1.130:9200")
        ));
    }

    @AfterEach
    void close () throws IOException {
        this.client.close();
    }
}
```