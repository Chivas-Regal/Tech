---
title: string
---

## key与字符串value

这个数据类型是最基本的，创建与删除方式也是最简单的 `get/set`     
一个 key 和 value 可以理解为做了一个 String 类型的变量  
然后 `set` 就是 `String key = value`  
`get` 就是 `return key`  

## 基本操作

### 信息添加

设置 key 和 value 的数据  

```sql
set key value
```

### 信息查询

根据 key 查询 value（如果 key 不存在，这里会返回 `(nil)`）

```sql
get key

-- 返回
value
```

实际案例：  

```sql
-- 设置一对 key-value
127.0.0.1:6379> set testkey snopzyz
OK

-- 查询之前设置的结果
127.0.0.1:6379> get testkey
"snopzyz"
```


### 信息删除

删除一个 key 的数据

```sql
del key

# 返回
(integer) <删除的成功与否>
```

当成功会返回 `(integer) 1` 否则返回 `(integer) 0`

### 清屏

```sql
clear
```

### 帮助文档

如果什么都不知道想看一下最宽泛的帮助文档，直接  

```sql
help
```

![20231021164142](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231021164142.png)

如果知道某个首关键字但是不知道怎么用，采用如下形式  

```sql
help <查询的关键字>
```

![20231021163956](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231021163956.png)

根据上面的 help 我们也可以查询群组命令内容  

```sql
help @<查询的群组名>
```

![20231021164411](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231021164411.png)

这里就是 string 下的命令

### 退出

`exit` 和 `quit` 都可以

### 多数据操作

- 添加/修改多个数据: `mset key1 value1 key2 value2 ...`
- 获取多个数据: `mget key1 key2 ...`

### 字符串长度

```sql
strlen key
```

### 追加/新建

```sql
append key value
```

将 value 追加到 key 值的后面

**实际案例**  

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

## 数值增减发号器

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

## 时效性设置

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

## 对象数据存储

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