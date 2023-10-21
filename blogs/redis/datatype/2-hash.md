---
title: hash
---

## 对象数据存储

[string-对象数据存储](./1-string.html#对象数据存储) 中我们能看到多种不便，主要原因是我们一直在以命名方式设置了公共前缀，但是本质上还是并没有真正**以树的形式完成属性的分组**   
而 hash 数据类型内部具有多个也是类似于键值对的 `field - value` 集合  
其作为 `value` 存放的时候，它可以真正指明一个 `field` 是属于哪一个 `key` 的（类似于 `map` 套 `map`）  
具体结构如下  

```yml
key:
  - field1: value1
  - field2: value2
  - field3: value3
  ...
```

命令行操作如下：  
- 添加/修改数据：`hset key field value`
- 获取单条数据：`hget key field`
- 获取一个key下的所有数据：`hgetall key`
- 删除数据：`hdel key field1 [field2]`

<p></p>

```sql
-- key.field1="value1"
127.0.0.1:6379> hset key field1 "value1"
(integer) 1

-- key.field2="value2"
127.0.0.1:6379> hset key field2 "value2"
(integer) 1

-- key.field3="value3"
127.0.0.1:6379> hset key field3 "value3"
(integer) 1

-- 打印 key.field1
127.0.0.1:6379> hget key field1
"value1"

-- 打印 key.field2
127.0.0.1:6379> hget key field2
"value2"

-- 打印 key 的所有 field-value
127.0.0.1:6379> hgetall key
1) "field1"
2) "value1"
3) "field2"
4) "value2"
5) "field3"
6) "value3"

-- 删除 key 的 field1和field2
127.0.0.1:6379> hdel key field1 field2
(integer) 2

-- 打印所有的 field-value ，只剩了 field3-value3
127.0.0.1:6379> hgetall key
1) "field3"
2) "value3"
```

- 添加/修改多个数据：`hmset key field1 value1 field value2 ...`
- 获取多个数据：`hmget key field1 field2`
- 获取哈希表中字段数量：`hlen key`
- 获取哈希表中是否存在指定字段：`hexists key field`

<p></p>

```sql
-- 设置 user 的三个属性 {id="001", name="snopzyz", password="123456"}
127.0.0.1:6379> hmset user id 001 name snopzyz password 123456
OK

-- 获取 user.id, user.name, user.password
127.0.0.1:6379> hmget user id name password
1) "001"
2) "snopzyz"
3) "123456"

-- 获取 user 的字段数，有三对
127.0.0.1:6379> hlen user
(integer) 3

-- user.id 是否存在
127.0.0.1:6379> hexists user id
(integer) 1

-- user.age 是否存在
127.0.0.1:6379> hexists user age
(integer) 0
```

- 获取哈希表中所有字段名和属性值：<br>`hkeys key`<br>`hvals key`
- 设置字段数据增减 `hincrby key field increment`

<p></p>

```sql
-- 获取所有的 field
127.0.0.1:6379> hkeys user
1) "id"
2) "name"
3) "password"

-- 获取所有的 value
127.0.0.1:6379> hvals user
1) "001"
2) "snopzyz"
3) "123456"

-- 给 user.age 加一
127.0.0.1:6379> hincrby user age 1
(integer) 1

-- 给 user.age 加一
127.0.0.1:6379> hincrby user age 1
(integer) 2

-- 再次查看 user 的所有 field-value
127.0.0.1:6379> hgetall user
1) "id"
2) "001"
3) "name"
4) "snopzyz"
5) "password"
6) "123456"
7) "age"
8) "2"
```
