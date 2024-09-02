---
title: 索引库操作
---

对于操作索引库的工具类，通过 `RestHighLevelClient` 的 `indices()` 方法获取到 `IndicesClient` 类。  
此类包含很多的操作方法供我们使用  

![20240101193048](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101193048.png)

## 创建

使用 `IndicesClient` 的 `create()` 方法，它需要两个参数：CreateIndexRequest 和 RequestOptions。   
第二个是枚举类可以直接使用 `RequestOptions.DEFAULT`，第一个类需要创建一下请求对象并设置请求体  
`CreateIndexRequest` 的构造方法中自带索引库名，这里用 `bloggers`，然后设置请求体用 `source()` 方法，存储一个 json 体。  

```java
// 创建请求对象
CreateIndexRequest request = new CreateIndexRequest("bloggers");
// 设置请求体
request.source(BLOGGER_INDEX_JSON, XContentType.JSON);
// 发送创建索引库的请求
client.indices().create(request, RequestOptions.DEFAULT);
```

这里 BLOGGER_INDEX_JSON 就是先前我们创建索引时请求体内的那一堆 json 字符串    

```json
{
    "mappings": {
        "properties": {
            "name": {
                "type": "keyword"
            },
            "age": {
                "type": "integer"
            },
            "blog_info": {
                "properties": {
                    "article_num": {
                        "type": "integer",
                        "index": "false"
                    },
                    "tech_stack": {
                        "type": "text",
                        "analyzer": "ik_smart"
                    }
                }
            }
        }
    }
}
```

然后运行程序后在控制台看到下面输出

```
[main] DEBUG org.elasticsearch.client.RestClient - request [PUT http://192.168.1.130:9200/bloggers?master_timeout=30s&timeout=30s] returned [HTTP/1.1 200 OK]
```

即说明创建成功，失败的话是会报异常的。

## 存在性与内容查询

RestClient 不仅可以做查询，也可以做存在性检测。  
根据我们上面的创建操作，这里方法替换为了 `exists()` 和 `get()`，请求类都是 `GetIndexRequest`  
并且在之前学的时候知道它们都不需要带什么 json 请求体，于是存在性检测可以直接这样写。  

```java
// 查询 bloggers 是否存在
GetIndexRequest request = new GetIndexRequest("bloggers");
boolean exists = client.indices().exists(request, RequestOptions.DEFAULT);
```

而索引库的映射内容则是一样用这个请求对象  
`get()` 方法会返回一个 `GetIndexResponse` 参数保存响应的内容，用它的 `getMappings()` 获取到映射  
然后遍历这个 Map 并将 value 调用 `source()` 方法就可以获得到具体的内容了  

```java
// 获取 bloggers 的 mapping 内容
GetIndexResponse response = client.indices().get(request, RequestOptions.DEFAULT);
// 获取 index:mapping 的对应表
Map<String, MappingMetadata> mappings = response.getMappings();
mappings.forEach((k, v) -> {
    // 将 mapping 展开为 source 显示出来
    System.out.println(k + ": " + v.source());
});
```


存在性检测和内容查询通常要一起使用，以防查询了一个不存在的索引库抛出异常，所以完整的写法应该如下  

```java
GetIndexRequest request = new GetIndexRequest("bloggers");
boolean exists = client.indices().exists(request, RequestOptions.DEFAULT);
// 若索引库存在，对它进行查询
if (exists) {
    GetIndexResponse response = client.indices().get(request, RequestOptions.DEFAULT);
    Map<String, MappingMetadata> mappings = response.getMappings();
    mappings.forEach((k, v) -> {
        System.out.println(k + ": " + v.source());
    });
}
```

![20240101214323](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101214323.png)

## 删除

由于我们之前发请求的时候也没有带参数，所以这里和上面的操作类似，同时我们可以检测一下是否删除成功

```java
DeleteIndexRequest request = new DeleteIndexRequest("bloggers");
client.indices().delete(request, RequestOptions.DEFAULT);
System.out.println(response.isAcknowledged());
```

这样即是成功了，不够不成功也是会报异常的  
![20240101214600](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101214600.png)