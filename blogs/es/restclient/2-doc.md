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

## 高级检索

::: tip
对应高级 Restful-Api 的 DSL 查询请看 [这里](../index-doc/3-doc-dsl-pro.html)
:::    

使用 `SearchRequest` 和 `SearchResponse` 作为入参请求（初始化时放入索引名）和出参响应，而调用时采用 `client.search(...)`  
`SearchRequest.source().query(...)` 方法内填充我们具体的查询内容 `QueryBuilder`。

### 模糊查询

对应之前使用的一种是查询全文 `match_all`，对应就是 `QueryBuilders.matchAllQuery()`  
而解析也跟 DSL 查询一样有 hits，使用 `response.getHits()`，对应就是  

```java
// 构建请求体
SearchRequest request = new SearchRequest("bloggers");
QueryBuilder queryBuilder = QueryBuilders.matchAllQuery();
request.source().query(queryBuilder);
// 调用获取响应
SearchResponse response = client.search(request, RequestOptions.DEFAULT);
// 解析响应结果
response.getHits().forEach(hit -> {
    System.out.println(hit.getSourceAsString());
});
```

::: tip

`response.getHits()` 对应的是 `SearchHits` 类型的变量，而它给出的得到的结果在通过 http 查询中得到的响应体也都是能 `get` 到的。  

![QQ_1726328329082](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/QQ_1726328329082.png)  

代码运行结果如此  

![QQ_1726328506902](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/QQ_1726328506902.png)

:::

而针对字段的 `match` 使用 `QueryBuilders.matchQuery("${字段名}", "${查询值}")`  

```java
// 构建请求体
...
QueryBuilder queryBuilder = QueryBuilders.matchQuery("name", "snopzyz");
// 调用...
...
```

### 精确查询

和前面类似采用 `SearchRequest` 的类做请求体，这里只说下 `QueryBuilder`   

**term**查询：  

```java
// .termQuery("${字段名}", "${查询的值}")
QueryBuilders.termQuery("name", "snopzyz");
```

**range**查询：

```java
// .rangeQuery("${字段名}").gte(${>=的数字}).lt(${<的数字})
QueryBuilders.rangeQuery("age").gte(20).lt(30);
```

### 复合查询

这里将之前使用的 `QueryBuilder` 替换为 `BoolQueryBuilder`。  
类似于 DSL 的 `{ "must":{}, "filter":{} }`，通过直属于其下的方法 `.must(...)` 和 `.filter(...)` 来包裹具体的 `QueryBuilder`，来完成复合查询。  
别的都是一样，甚至 `request.source().query(...)` 的参数也是支持 `BoolQueryBuilder`  

实际演示如  

```java
SearchRequest request = new SearchRequest("bloggers");

// 写个 "bool"
BoolQueryBuilder boolQueryBuilder = QueryBuilders.boolQuery();
// 内部写个 "must": { "term": { "name": "snopzyz" }}
boolQueryBuilder.must(QueryBuilders.termQuery("name", "snopzyz"));
// 内部写个 "filter": { "range": { "age": { "gt": 20 }}}
boolQueryBuilder.filter(QueryBuilders.rangeQuery("age").gt(20));
// 将整个 "bool":{...} 放入请求体内
request.source().query(boolQueryBuilder);

SearchResponse response = client.search(request, RequestOptions.DEFAULT);
```

### 排序和分页

排序分页对应的外部 json-key， `from`、`size`、`sort`，都和 `query` 是同级的。  
所以替换掉的应该是 `request.source()` 后面的链式方法 `.query`，改为 `request.source().from(${起始点}).size(${页面大小}).sort("${排序字段}", ${排序规则})`    
如  

```java
request.source().from(0).size(10).sort("age", SortOrder.ASC);
```

### 高亮

在 DSL 里面是 `highlight`，内部有字段名和对应规则，这里也是 

```java
request.source().highlighter(new HighlightBuilder()
        .field("name")
        .requireFieldMatch(false)
        .preTags("<a>")
        .postTags("</b>")
);
```

`HighlightBuilder` 可以构造的方法和对应 DSL 的字段都是一样的，但是注意一下在响应体内带标签的高亮内容不存在于 `_source` 字段内，而是 `hightlight` 字段内。  
也就是  

![QQ_1726478898538](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/QQ_1726478898538.png)  

所以在代码解析结果时也应当调用 `getHighlightFields()`，即

```java
...
// 解析响应结果
SearchHits searchHits = response.getHits();
searchHits.forEach(hit -> {
    Map<String, HighlightField> highlightFields = hit.getHighlightFields();
    ...
});
```

## 关于使用发现的小 TIPS

用了这么多，也能看到一些规律了，其实这个 API 和 RestFul 风格是对应的。
- `Request` 类的前缀大多数和 方法:url 有关，如 `GET` 方法获取文档和 `GetRequest`，`/_search` 的 url 和 `SearchRequest` 有关。
- `request.source()` 值得是 json 请求体
- `request.source().方法名` 指的是 json 请求体内的方法，如 `{ "query":{} }` 的内容用 `request.source().query(...)` 构造，`{ "sort":{} }` 的内容用 `request.source().sort(...)` 构造  

而响应的内容也有规律，`Response` 类的前缀总是和 `Request` 类相对应，`response.XXX()` 方法所指响应体内的字段，如我们最熟悉的几个 `hits`、`tooks`、`...shares`、`scrollId` 等，都在其中可以找到。

![QQ_1726482103550](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/QQ_1726482103550.png)  

通过这些经验，我们可以很容易地模仿着 DSL 找到我们需要的内容。  



