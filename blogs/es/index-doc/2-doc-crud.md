---
title: 文档基础操作
---

关于库内文档的操作，我们沿用 [上节：索引库操作](./1-index-crud.html) 创建的 bloggers 来  

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

## 删除

同理用 DELETE 即可  

```json
DELETE /bloggers/_doc/1
```

![20240101172352](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101172352.png)  

再查询一下验证验证  

![20240101172416](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101172416.png)  

这里已经查询不到了，说明删除成功

## 修改

### 全量修改

将创建DSL中的请求方式换为POST，会先去根据id查询到文档
- 能查询到：删除后再插入，响应体result=update
- 查询不到：直接插入，响应体result=create

看一下示例，分别 PUT 一下 id=1 和 id=2 的内容  

![20240101173426](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101173426.png)  

![20240101173559](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20240101173559.png)  

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

改动生效，成功了