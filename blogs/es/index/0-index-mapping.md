---
title: 索引库mapping映射、RestClient依赖
---

## 映射规范

之前说过，索引相当于MySQL库，es 对文档的约束也是映射相当于MySQL对记录中字段的约束。  
mapping映射常用的有下面几种：
- type: 字段数据类型（类似json）
    - 字符串
        - text：可分词
        - keyword：不可分词
    - 数值
        - byte
        - short
        - integer
        - long
        - float
        - double
    - 布尔 
        - boolean
    - 日期 
        - date
    - 对象
        - object
- index：对于字段是否要创建索引，默认为 true
- analyzer：使用的分词器类别
- properties：子字段

es 中用了另一种方式来表示列表，虽然和 json 中格式一样，但是它不再是一个独立的类型了，对于一个类型，可以设置多个值，比如一个 int 类型的字段 num 可以写为 `num: [1,2,3]`。  

## RestClient

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