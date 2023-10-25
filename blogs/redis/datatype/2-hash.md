---
title: hash
---

## 数据存储与命令

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

当然还有它自己本身的优化：  

- field 数量较少，结构为类数组形式
- field 数量较多，结构使用 HashMap

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

-- 给不存在的 user.age 加一
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

## 时间复杂度分析

命令	|时间复杂度
-|-
`hset`	|$O(1)$
`hget`	|$O(1)$
`hdel`	|$O(k)$，k 是删除的 field 的个数
`hlen`	|$O(1)$
`hgetall`	|$O(n)$，n 是总 field 的个数
`hmget`	|$O(k)$，k 是查询的 field 的个数
`hmset`	|$O(k)$，k 是设置的 field 的个数
`hexists` |$O(1)$
`hkeys`	|$O(n)$，n 是总 field 的个数
`hvals`	|$O(k)$，n 是总 field 的个数
`hsetnx`	|$O(1)$
`hincrby`	|$O(1)$
`hincrbyfloat`	|$O(1)$
`hstrlen`	|$O(1)$

## 注意事项

- hash 下的 value 只能存储字符串  
- hash 下最多有 $2^{32}-1$ 个键值对  
- hash 初衷不是为了存储大量对象而设计，不能滥用，对象中的内容一多效率会变低
- `hgetall` 获得全部属性，内部field过多效率会变低

## 简单场景

### 购物车

**需求**  

需要区分不同用户购买的商品：用户 $id$   
需要区分同一用户购买的同步商品：商品 $id$  
每个商品要有自己的数量：商品 $num$    
每个商品要有自己的信息：商品 $info$  
  
**模型**  

用户只保存购物车的商品 $id$ 和 $num$  
另外再开一个 $hash$ 存放商品 $id$ 和 $info$ 的对应关系  
其中为了信息存放得能比较多，$info$ 采用 json 格式来存就行  

```yml
userid:
  - objid: objnum
  - objid: objnum
  - ...

obj:
  - objid: objinfo
  - objid: objinfo
  - ...
```

**功能**  

（先不讨论持久化、未登录用户...的别的信息）  

用户层面：    
- 添加商品：
  - 单个：`hset userid objid objnum`
  - 多个：`hmset userid objid1 objnum1 objid2 objnum2`
- 浏览商品：
  - 单个：`hget userid objid`  
  - 全部：`hgetall userid`
- 更改数量：`hincrby userid objid 1`  
- 删除商品：`hdel userid objid`
- 购物车数量：`hlen userid`
- 清空购物车：`hdel userid`

商品层面：  
在用户向购物车添加商品时，若商品不存在于 `obj` 这个 hash 表中，从 mysql 中查询出信息存放进去  
若商品存在的话就不存放（节省时间）  
- 若手上已经有 $info$ 信息了，只涉及是否存放数据的<br>`hsetnx key field value`：若不存在 key.field，则 `key.field = value` ，否则不变  
- 若手上没有 $info$ 信息要做 mysql 查询，我们判断 redis 中有没有，有的话就不查了，没有的话查一下并存放<br>若已知 `objid` ，然后要从 mysql 表 `tbl_obj` 中查询后放到 redis.hash 表 `obj` 中<br>伪代码：`if( (hget obj objid) == nil ) -> hset obj objid (select _objinfo from mysql.tbl_obj where _objid=objid)`
