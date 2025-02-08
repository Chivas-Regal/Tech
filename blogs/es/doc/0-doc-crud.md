---
title: 文档基础操作
---

关于库内文档的操作，我们用 [索引库操作](../index/1-index-crud.html) 创建的 bloggers 来  

## 新增

文档新增的 DSL 模板为  

```json
POST /${索引库名}/_doc/${文档id}
{
    "${字段}": "${值}"
}
```

比如我要创建一个描述我的文档，id为1  

```json
POST /bloggers/_doc/1
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

![20240101171906](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101171906.png)

具体的 Restful-API 在下面和全量修改一起说。  

## 修改

### 全量修改

将创建DSL中的请求方式换为POST，会先去根据id查询到文档
- 能查询到：删除后再插入，响应体result=update
- 查询不到：直接插入，响应体result=create

看一下示例，分别 PUT 一下 id=1 和 id=2 的内容  

![20240101173426](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101173426.png)  

![20240101173559](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101173559.png)  

在 Restful-API 中使用 `client.index()`
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

### 增量修改

DSL 模板为

```json
POST /${索引库名}/_update/文档id
{
    "doc": {
        "${字段名}": "${新值}"
    }
}
```

这里修改我的博文数量为 281，

```json
POST /bloggers/_update/1
{
    "doc": {
        "blog_info": {
            "article_num": 281
        }
    }
}
```

![20240101173905](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101173905.png)

再查询一下看看是否成功  

![20240101174045](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101174045.png)  

改动生效，成功了，然后说明一下 Restful-API 的做法，使用 `UpdateRequest`，初始化请求不仅需要索引名，还需要文档 id 指定更新的文档。  
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

这里的 DSL 就先按最简单的按文档编号查询，`must、filter..` 什么的过滤语句到后面再说  
按照 RESTFUL 格式，查询应是

```json
GET /${索引库名}/_doc/${文档id}
```

这里查刚刚创建的

```json
GET /bloggers/_doc/1
```

![20240101172247](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101172247.png)  

代码则是通过 `GetRequest` 做请求然后用 `client.get()` 发送的。  
将查询后得到的响应结果通过 `getSourceAsString()` 获取到内容

```java
GetRequest request = new GetRequest("bloggers").id("1");
GetResponse response = client.get(request, RequestOptions.DEFAULT);
System.out.println(response.getSourceAsString());
```

## 删除

同理用 DELETE 即可

```json
DELETE /bloggers/_doc/1
```

![20240101172352](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101172352.png)

再查询一下验证验证

![20240101172416](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101172416.png)

这里已经查询不到了，说明删除成功，程序也与上面同理，更简单的是只需要索引名和 id，给出示例不再叙述了。

```java
DeleteRequest request = new DeleteRequest("bloggers", "1");
client.delete(request, RequestOptions.DEFAULT);
```

## 批量操作

在很多时候为了节省网络请求次数而提升性能，需要批量操作，不说对应 DSL，一般都是从代码的角度实现的。  
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