---
title: 数据聚合
---

::: tip 数据来源
依旧按照前面建的 [bloggers](./1-index-crud.html#创建) 来
:::

ES 提供了多种聚合方式，因为处理时要对整个字段进行归类处理，所以被聚合的字段是不可分词的，必须是（关键字、数值、日期、布尔）类型的。
- Bucket桶聚合：文档分组
    - TermAggregation: 按照字段值分组
    - DateHistogram: 按照日期阶梯分组（一天一组、一周一组等）
- Metric度量聚合：计算最值、平均值等
    - AVG: 平均值
    - MAX: 最大值
    - MIN: 最小值
    - ...
    - STATS：同时求 MAX、MIN、SUM...
- PIPELINE管道聚合: 对其他聚合的结果做二次聚合（使用较少，这里不做说明）


## Bucket桶聚合

### term

首先看一下聚合的语法模板

```json
GET /${索引名}/_search
{
    "aggs": {
        "${(String) 自定义聚合名}": {
            "terms": {
                "field": "${(String) 聚合字段}",
                "size": "${(Integer) 显示出的条数}",
                "order": {
                    "_count": "${(String) 按照数量的排序规则 asc/desc(默认)}"
                }
            }/*,
            "aggs": "${(Object) 子聚合}"
            */  
        }
    }
}
```

如我给 `age` 做了个聚合，希望按其分组展示条数，事实上我的数据很少仅用作演示，这个结果就是有两条 21 的有一条 22 的（外层的 `size=0` 没有作用，仅是不展示 `hits` 里面的数据内容而已）  

![QQ_1726487916037](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/QQ_1726487916037.png)

当然也可以通过外部添加 `query` 来组装聚合与查询

## Metrics度量聚合

根据上面添加子聚合的方式，我们可以在外层依然使用 `age` 聚合，内层对博文数量统计（用 stats 更全面地展示）  

![QQ_1726488726121](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/QQ_1726488726121.png)  

这里每个年龄的博文数量就都在 `aggregations.ageAgg.buckets` 内被列出来了，并且还通过自定义的博文数量聚合名称，按每条聚合结果的 `count` 对所有做了一次升序排序。  