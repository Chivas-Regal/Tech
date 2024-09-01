---
title: 索引库的增删改查
---

## 创建

### DSL

DSL创建模板为

```json
PUT /${索引库名称}
{
    "mappings": {
        "${type名}": {
            "properties": {
                "${字段名}": {
                    "type": "${字段类型}",
                    "index": "${true/false表示是否为该字段创建倒排索引}",
                    "analyzer": "${使用的分词器}",
                    "properties": {
                        ... // 和第四行一个性质，里面又要嵌套一些字段
                    }
                }
            }
        }
    }
}
```

比如我想创建一个关于博客 bloggers 的索引库，映射要有

```yml
name: 作者名
age: 年龄
blog_info:  # 博客信息
    article_num: 博文数量
    tech_stack: 技术栈
```


blogger 根据编号、作者名和年龄分别创建倒排索引，blog_info 里面的技术栈也可以分词并创建倒排索引   

```json
PUT /bloggers
{
    "mappings": {
        "properties": {
            // 作者名是关键字，不可分词；不写 index 为创建索引
            "name": {
                "type": "keyword"
            },
            // 作者年龄，创建倒排索引
            "age": {
                "type": "integer"
            },
            // 博客信息，内含多个嵌套字段
            "blog_info": {
                "properties": {
                    // 博文数量，int 类型，不创建索引
                    "article_num": {
                        "type": "integer",
                        "index": "false"
                    },
                    // 博文技术栈，用 ik_smart 分词
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

发送这样的请求，然后得到所示响应即表示创建成功  
![20231231215151](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231231215151.png)  

### RestClient

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

## 查询

### DSL

按 RESTFUL 风格，这里用 GET 直接请求这个索引库即可  

![20231231215215](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231231215215.png)  

### RestClient

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

## 修改

### DSL

正常来说就算 MySQL 也最好不要在生产环境下修改表结构不然表重构特别耗时，es 的策略是对于索引修改是只能添加字段。  
操作是

```json
PUT /${索引库名}/_mapping
{
    "properties": {
        "${新字段名}": {
            ... // 和新建时一样的格式
        }
    }
}
```

比如我想给上面创建的加一个关键字性别 sex，添加倒排索引，就可以发送  

```json
PUT /bloggers/_mapping
{
    "properties": {
        "sex": {
            "type": "keyword"
        }
    }
}
```

![20231231215403](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231231215403.png)  

再看一眼索引结构就可以发现多了这个字段

![20231231215445](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231231215445.png)

::: danger
如果是要修改某个字段，就会得到报错，比如这里要把 sex 修改为 integer  

![20231231215716](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231231215716.png)  

会发现提示 `mapper [sex] cannot be changed ...`，是不可修改的
:::

### RestClient



## 删除

### DSL

删除就是把请求方式换为 DELETE 即可，不用带任何的请求体  

![20231231215517](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231231215517.png)  

ack=true 即可说明删除成功

### RestClient

由于我们之前 RestClient 发请求的时候也没有带参数，所以这里和上面的操作类似，同时我们可以检测一下是否删除成功

```java
DeleteIndexRequest request = new DeleteIndexRequest("bloggers");
client.indices().delete(request, RequestOptions.DEFAULT);
System.out.println(response.isAcknowledged());
```

这样即是成功了，不够不成功也是会报异常的  
![20240101214600](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101214600.png)