---
title: 文档高级 DSL 检索
---

企业里面常用高级的检索方式来更精确地应对复杂场景，这种检索概括一下往往是这样的模板：

```json
GET /${索引名}/_search
{
    "query": {
        "${查询类型}": {
            "${查询条件}": "${条件值}"
        }
    }
}
```

查询类型非常多，有如 `bool`、`match_query`、`match_all`、`term`...，（后面会讲解用法）  
这里先给出一个简单的 `match_all` 查询所有的小示例讲解一下用法和响应

```sql
{
    "query": {
        "match_all": {}
    },
    "from": 0,
    "size": 100
}
```

这个请求是查询所有然后做了一个分页，看一下响应  

![QQ_1725109471696](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/QQ_1725109471696.png)

其中拆解来看主要是如下一些信息

```json
{
    "took": "耗时(ms)",
    "timed_out": "是否超时",
    // 分片信息，后面会说
    "_shards": {
        "total": "总分片数",
        "successful": "成功的分片数",
        "skipped": "被跳过的分片数",
        "failed": "失败的分片数"
    },
    // 查询结果元数据
    "hits": {
        "total": {
            "value": "匹配的文档总数（分页前）",
            "relation": "表示实际匹配文档数与value的关系，通常是eq(等于)或者gte(大于等于)"
        },
        // 积分匹配制
        "max_score": "最高相关性积分",
        "hits": "分页后的数据内容（列表）"
    }
}
```

想了解积分匹配的小伙伴请前往 [检索下的相关性得分](./4-doc-score.html)。  

再抽出来 `hits.hits` 说说

```json
{
    "_index": "文档所在索引名称",
    "_type": "文档类型，v7.x以及更高版本弃用了，通常都是 _doc",
    "_id": "文档id",
    "_score": "相关性得分",
    "_source": "实际文档数据"
}
```

## 全文检索

全文检索是根据指定的字段和值，将值分词后去倒排索引库中检索。

### match

对一个建立了倒排索引的字段进行检索。  
内部结构模板为

```json
"match": {
    "${字段名}": "${匹配值}"
}
```

作者在 [索引库操作](./1-index-crud.html) 里面建的 bloggers，其中刚好有个 `blog_info.tech_stack` 具有倒排索引，那就拿这个做演示。  
可以看到 match 检索的方式是内部 kv 表示的是 “被检索字段”: “检索词条”  

![QQ_1725111070950](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/QQ_1725111070950.png)

可以看到查询出来了，相关性得分比较低因为匹配度较低。  
而且值得称赞的是这个匹配度是倒序排序的，很贴合正常的词条搜索机制。  

### multi_match

会影响性能不建议用，这里简单说明一下请求结构

```json
"multi_match": {
    "query": "${匹配值}",
    "fields": [
        "${匹配字段1}",
        "${匹配字段2}",
        ...
    ]
}
```

做个示例，这里 name 本来是 keyword，我们假装它不是，分词建倒排索引了

```json
{
    "multi_match": {
        "query": "snopzyz的算法知识",
        "fields": [
            "name",
            "blog_info.tech_stack"
        ]
    }
}
```

::: tip 优化使用
想使用多个字段检索其实可以在插入的时候把几个字段组织一下合并为一个字段，如这里可以新增字段 `"author_like": "${name}_${blog_info.tech_stack.join('_')}"`，那么该文档会变为。  

```json
{...
    "author_like": "snopzyz_算法与数据结构_后端_前端_cpp_java_数据库"
...}
```

然后 `match` 检索就行
:::

## 精确查询

不进行分词，一般是对 bool、keyword、数值等类型字段查询。

### term

根据值进行精准查询，要匹配上才行。  
具体使用查询类型为 `term`，内部为  

```json
"query": {
    "term": {
        "${字段名}": {
          "value": "${匹配值}"
        }
    }
}
```

[索引库操作](./1-index-crud.html) 里面建的 bloggers 有个 `name` 是 keyword，我们查询一下它等于 snopzyz 的文档。  

使用示例如下

![QQ_1725188834750](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/QQ_1725188834750.png)

区别于分词全文检索我们这样查一下，就应当查不出来了。

![QQ_1725188798795](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/QQ_1725188798795.png)

### terms

和上面的类似，但是支持一个字段查询多个值，只要有一个匹配就行，标准语法是。

```json
"query" {
    "terms": {
        "${字段名}": [
          "${查询值1}",
          "${查询值2}",
          ...
        ]
    }
}
```

示例  
![QQ_1725195554302](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/QQ_1725195554302.png)

### range

区间查询，通常是对数值字段确定一个区间，匹配所有该字段满足在这个区间里面的文档。  
标准查询模板为

```json
"query": {
    "range": {
      "${字段名}": {
        "${比较类型}": "${参照值}"
      }
    }
}
```

这个比较类型有四种：
- `gte`: $>=$
- `lte`: $<=$
- `gt`: $>$
- `lt`: $<$ 

如我们查询 `age` 在 $[10, 30)$ 之间的文档

![20240902163555](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240902163555.png)  

可以匹配到 `age: 21` 的这条记录，成功