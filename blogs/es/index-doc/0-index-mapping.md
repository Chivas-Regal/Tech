---
title: 索引库mapping映射
---

之前说过，索引相当于MySQL库，es 对文档的约束也是映射相当于MySQL对记录中字段的约束。  
mapping映射常用的有下面几种：
- type: 字段数据类型（类似json）
    - 字符串
        - text：可分词
        - keyword：不可分词
    - 数值
        - byte
        - short
        - integer
        - long
        - float
        - double
    - 布尔 
        - boolean
    - 日期 
        - date
    - 对象
        - object
- index：对于字段是否要创建索引，默认为 true
- analyzer：使用的分词器类别
- properties：子字段

es 中用了另一种方式来表示列表，虽然和 json 中格式一样，但是它不再是一个独立的类型了，对于一个类型，可以设置多个值，比如一个 int 类型的字段 num 可以写为 `num: [1,2,3]`。  