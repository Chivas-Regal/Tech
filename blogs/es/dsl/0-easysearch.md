---
title: 简单查询
---

::: tip
数据用之前 [MySQL数据迁移](../restclient/3-show-datamove.md) 中生成的数据
:::

## 全文检索查询

### 单字段匹配

全文检索查询时根据用户输入内容进行分词，将短词对某个 text 字段的分词结果进行匹配。

DSL 模板：

```json
GET /${索引库名}/_search
{
    "query": {
        "match": {
            "${字段名}": "${字段值}"
        }
    }
}
```

比如我要查询之前将店名、品牌名、商圈合并到的字段 `all` 中，有关 “如家” 的酒店信息

```json
GET /hotels/_search
{
    "query": {
        "match": {
            "all": "如家"
        }
    }
}
```

发送请求找到了下面这些内容

![20240107191511](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240107191511.png)

### 多字段匹配

而当然也可以不用 `copy_to` 合并进的字段，可以使用多个字段查询，**但是这样做的效率较低，不建议使用**，模板为  

```json
GET /${索引库名}/_search
{
    "query": {
        "multi_match": {
            "query": "${字段值}",
            "fields": ["${字段名1}", "${字段名2}", ...]
        }
    }
}
```

比如实现上面一样的功能  

```json
GET /${索引库名}/_search
{
    "query": {
        "multi_match": {
            "query": "如家",
            "fields": ["name", "brand", "business"]
        }
    }
}
```

![20240107191918](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240107191918.png)

## 精确查询