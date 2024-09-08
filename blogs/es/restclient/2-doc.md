---
title: 文档操作
---

::: tip
沿用之前创建的 `RestHighLevelClient client`
:::

文档操作直接依赖于 `client` 的各种方法而不用再通过 client 的方法获得工具类。

## 插入或全量更新

[文档全量修改](../index-doc/2-doc-crud.html#全量修改) 中学过全量修改可做插入的方式。  
这里 `client.index()` 在没有对应id时实现插入，有对应id时实现全量更新。  
和索引库操作类似，需要一个设置好参数的请求体，然后放进方法中发送，格式和内容都基本一致。  
我们实验的时候具体是插入还是更新可以从响应体内的 `result` 进行查看，那么就可以通过这个方法的响应体来获取 result 得知本次操作时更新还是插入。  

```java
// 请求对象
IndexRequest request = new IndexRequest("bloggers");
// 操作的 id
request.id("1");
// 填充请求体
request.source(SNOPZYZ_DOC, XContentType.JSON);
// 获取响应并打印响应体中的 result
IndexResponse response = client.index(request, RequestOptions.DEFAULT);
System.out.println(response.getResult());
```

这个 `SNOPZYZ_DOC` 也和文档全量修改中的案例一致  

```json
{
    "name": "snopzyz",
    "age": 21,
    "blog_info": {
        "article_num": 280,
        "tech_stack": [
            "算法与数据结构",
            "后端",
            "前端",
            "cpp",
            "java",
            "数据库"
        ]
    }
}
```

由于是第一次对这个 id 写入数据，所以结果是创建（CREATE）  
![20240101211814](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101211814.png)  
再执行一次后它就会变成更新（UPDATE）  
![20240101211940](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101211940.png)

## 局部更新

与上面类似，但是使用 `UpdateRequest`，初始化请求不仅需要索引名，还需要文档 id 指定更新的文档。  
而后使用 `request.doc` 方法传入偶数个参数，包含多对 `key, value` 来表示更新的字段和对应值。  
最后使用 `client.update` 方法进行更新。  

```java
UpdateRequest request = new UpdateRequest("bloggers", "1");
// 更新作者名和年龄
request.doc(
        "name", "chivas-regal",
        "age", "0"
);
client.update(request, RequestOptions.DEFAULT);
```

验证一下看看  
![20240831201727](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240831201727.png)



## 查询

先不看精确查询的DSL，做一个按id查询。  
这里是通过 `GetRequest` 做请求然后用 `client.get()` 发送的。  
将查询后得到的响应结果通过 `getSourceAsString()` 获取到内容  

```java
GetRequest request = new GetRequest("bloggers").id("1");
GetResponse response = client.get(request, RequestOptions.DEFAULT);
System.out.println(response.getSourceAsString());
```

## 删除

与上面同理，更简单的是只需要索引名和 id，给出示例不再叙述了。

```java
DeleteRequest request = new DeleteRequest("bloggers", "1");
client.delete(request, RequestOptions.DEFAULT);
```

## 批量操作

在很多时候为了节省网络请求次数而提升性能，需要批量操作。  
使用到 Es 的 bulk 操作，对应请求是 `BulkRequest`，其中可以添加多个处理操作，比如把刚刚的更新和删除合到一起（好像在废话）。

```java
// 批处理请求
BulkRequest bulkRequest = new BulkRequest();
// 添加请求1：更新请求
bulkRequest.add(new UpdateRequest("bloggers", "1").doc("name", "snopzyz", "age", "22"));
// 添加请求2：删除请求
bulkRequest.add(new DeleteRequest("bloggers", "1"));
// 执行批处理
client.bulk(bulkRequest, RequestOptions.DEFAULT);
```

验证一下也发现确实是删除掉了

![20240831203307](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240831203307.png)

## 高级 DSL 检索

::: tip
对应高级 Restful-Api 的查询请看 [这里](../index-doc/3-doc-dsl-pro.html)
:::

### 模糊查询



### 精确查询

### 复合查询