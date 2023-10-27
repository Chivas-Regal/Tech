---
title: String
---

## key与字符串value

这个数据类型是最基本的，创建与删除方式也是最简单的 `get/set`     
一个 key 和 value 可以理解为做了一个 String 类型的变量  
然后 `set` 就是 `String key = value`  
`get` 就是 `return key`  

## 数据存储与命令

- 添加 key-value 对：`set key value`
- 根据 key 查询 value（如果 key 不存在，这里会返回 `(nil)`）：`get key`

<p></p>

```sql
-- 设置一对 key-value
127.0.0.1:6379> set testkey snopzyz
OK

-- 查询之前设置的结果
127.0.0.1:6379> get testkey
"snopzyz"
```

- 删除一个 key 的数据，当成功会返回 `(integer) 1` 否则返回 `(integer) 0`：`del key`
- 添加/修改多个数据: `mset key1 value1 key2 value2 ...`
- 获取多个数据: `mget key1 key2 ...`
- 获取字符串长度：`strlen key`
- 向一个key的value中追加/新建字符串：`append key value`

<p></p>

```sql
-- 批量设置 a = 1, b = 2, c = 3
127.0.0.1:6379> mset a 1 b 2 c 3
OK

-- 查询 a
127.0.0.1:6379> get a
"1"

-- 查询 b
127.0.0.1:6379> get b
"2"

-- 批量查询 a, b, c
127.0.0.1:6379> mget a b c
1) "1"
2) "2"
3) "3"

-- 获取 a 的长度
127.0.0.1:6379> strlen a
(integer) 1

-- 字符串 a 的末尾追加 "xx" 会变成 "1xx"
127.0.0.1:6379> append a xx
(integer) 3

-- 获取 a 现在的值
127.0.0.1:6379> get a
"1xx"

-- 获取 a 现在的长度
127.0.0.1:6379> strlen a
(integer) 3
```

## 数据发送数量选择

多数据合成一条命令发送会省很多数据在网络上传输的时间  
但是可能会导致一条信息过长  
所以我们在选择的时候应当做合理的切分    
  
比如发送 10000 个 kv 的 `set` 操作  
发 10000 次 `set` 明显不合理，发一次 10000 个的又信息过长  
可以切为发送 100 次，每次发送 100 个 kv 的 `set`，最后选择一下如何进行分配效率最高即可

## 时间复杂度分析

命令|时间复杂度
-|-
`set`           |$O(1)$
`get`           |$O(1)$
`del`           |$O(k)$ ，k 为一次删除的元素个数
`mset`          |$O(k)$ ，k 为一次设置的元素个数
`mget`          |$O(k)$ ，k 为一次查询的元素个数
`incr`	        |$O(1)$
`decr`	        |$O(1)$
`incryby`	    |$O(1)$
`decryby`	    |$O(1)$
`incrybyfloat`	|$O(1)$
`append`	    |$O(1)$
`strlen`	    |$O(1)$
`setrange`	    |$O(n)$，n为更改的字符串长度
`getrange`	    |$O(n)$，n为获取的字符串长度


## 简单场景

### 数值增减发号器

**业务需要**  

分表时主键 $id$ 的自增不能使用 mysql 自己的自增，否则当一张表的 $id$ 增到另一张表的最小 $id$ 的时候两张表会发生主键相同的情况  
解决办法是采用**全局控制**的 Redis 的数值增减完成发号器  

**具体命令** 

```sql
incr key
decr key
```

上面是简单的加减 $1$ 的操作

实际案例：  
  
```sql
-- num=1
127.0.0.1:6379> set num 1
OK

-- 打印 num 的值
127.0.0.1:6379> get num
"1"

-- num+=1，打印值
127.0.0.1:6379> incr num
(integer) 2

-- num+=1，打印值
127.0.0.1:6379> incr num
(integer) 3

-- num-=1，打印值
127.0.0.1:6379> decr num
(integer) 2

-- num-=1，打印值
127.0.0.1:6379> decr num
(integer) 1
```

```sql
incrby key increment
decrby key increment
incrbyfload key increment
```

这些是加减 $increment$ 的操作，`incrbyfloat` 可以加小数

每次操作完都会返回一个修改后的值  
由于 Redis 操作的原子性保证我们能很好支持并发的场景  
故可以用它控制数据库主键 $id$ 提供生成策略，保证唯一性

### 时效性设置

**业务需要**  

投票的业务需要有一个最小投票间隔，在此期间限制无法进行第二次投票。  
或者订单业务在一个订单用户一直不付款导致超时时，清除该订单的内容。

**具体命令**  

```sql
setex key seconds value
psetex key milliseconds value
```

设置 key 在时间范围内为 value，超时后自动销毁  
`seconds` 是秒，`milliseconds` 是毫秒

但是注意如果此时再调用 `set key value` 那么之前设置的时效性将会作废

### 对象数据存储

在 Java 中将对象化为 String 都是按 json 进行格式化的  
这里 Redis 中的 string 自然也可以存 json 数据    
  
一般存储格式是对每一个属性都做一个 key  

```sql
set user:id:001:name snopzyz
set user:id:001:password 123456
set user:id:001:age 21
```

另一种就是上面说的直接存 json 来保证后面我们拿取时格式化方便  
  
```sql
set user:id:001 {id:001,name:snopzyz,password:123456,age:21}
```  

key 的规范一般为 `<表名>:<主键名>:<主键值>:<字段名>`

### 访问次数限制

一个 api 接口什么的，每分钟最多可以调用 k 次。    
  
完成此控制可以通过计数器来实现。  
为了方便我们可以使用到它自己的数值上限异常。  
也就是在初始的时候我们设置一个计数器的值为 $9223372036854775807-k$。  
然后不断 `incr` 直到上限后再执行就会报 `(error)`  

这里拿最多10次为例  

```sql
-- 设置定时计数器
127.0.0.1:6379> setex count 60 9223372036854775797 
OK

-- count+=1
127.0.0.1:6379> incr count
(integer) 9223372036854775798

-- count+=1
127.0.0.1:6379> incr count
(integer) 9223372036854775799

...

-- count+=1
127.0.0.1:6379> incr count
(integer) 9223372036854775807

-- count+=1
127.0.0.1:6379> incr count
(error) ERR increment or decrement would overflow -- 超范围异常 
```