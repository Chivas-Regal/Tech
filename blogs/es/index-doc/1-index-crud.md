---
title: 索引库的增删改查
---

## 创建

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

## 查询

按 RESTFUL 风格，这里用 GET 直接请求这个索引库即可  

![20231231215215](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231231215215.png

## 修改

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

## 删除

删除就是把请求方式换为 DELETE 即可，不用带任何的请求体  

![20231231215517](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231231215517.png)  

ack=true 即可说明删除成功