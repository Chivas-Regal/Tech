---
title: List
---

## 数据存储与命令

用来存储多个数据，通过数据进入存储空间的顺序来区分  
底层是双向链表  

- 添加/修改数据：<br>`lpush key value1 [value2] ...`<br>`rpush key value1 [value2] ...`  
- 获取数据：
  - 遍历从第 `start` 到第 `stop` 个数据：`lrange key start stop`
  - 获取左数第 `index` 个数据：`lindex key index`
  - 获取 `key` 的元素个数：`llen key`  
- 获取并移除数据：<br>`lpop key`<br>`rpop key`  

<p></p>

```sql
-- 从右侧依次推入 a, b, c
127.0.0.1:6379> rpush list a b c
(integer) 3

-- 遍历第 0 个元素到第 2 个元素
127.0.0.1:6379> lrange list 0 2
1) "a"
2) "b"
3) "c"

-- 获取从左数第 0 个元素
127.0.0.1:6379> lindex list 0
"a"

-- 获取 list 的长度
127.0.0.1:6379> llen list
(integer) 3

-- 弹出最右侧的元素并返回其值
127.0.0.1:6379> rpop list
"c"

-- 获取从左数第 0 个到倒数第一个元素
127.0.0.1:6379> lrange list 0 -1
1) "a"
2) "b"
```

- 阻塞获取并弹出：`blpop list timeout`、`brpop list timeout`  

这意味着如果 `list` 为空无法获取并弹出    
它会阻塞着，在 `timeout` 时间内如果能拿到数据的话就拿，如果过期都长度不够拿不到的话就放弃了返回 `(nil)`  
也就意味着如果一个客户端 $A$ 对空链表 `list` 执行了 `blpop list 5`  
说明 5 秒内如果有另一个客户端 $B$ 对这个链表 `push` 了数据，那么 $A$ 就会返回这个数据且 $B$ 客户端的数据消失  
如果没有别的客户端 `push` ，则 $A$ 会阻塞到输出 `(nil)`    
常用于**任务队列**  

- 删除中间指定内容：`lrem key count value`  
  
从左侧开始删除 `key` 的指定 `count` 个值为 `value` 的元素  
当然也可以从右侧开始删，都要指定值

```sql
-- [a, b, c]
127.0.0.1:6379> rpush list a b c
(integer) 3

-- 删除左数第一个 b 
127.0.0.1:6379> lrem list 1 b
(integer) 1

-- 打印得 [a, c]
127.0.0.1:6379> lrange list 0 -1
1) "a"
2) "c"
```

## 时间复杂度分析

命令	|时间复杂度
-|-
`rpush`	|$O(k)$，k 是一次性插入的 field 的个数
`lpush`	|$O(k)$，k 是一次性插入 field 的个数
`linsert`	|$O(k)$，k 是插入位置距离表头或表尾的距离
`lrange`	|$O(s+k)$，s 是 start 的偏移量，k 是 start 到 end 的范围
`lindex`	|$O(k)$，k 是索引的偏移量
`llen`	|$O(1)$
`lpop`	|$O(1)$
`rpop`	|$O(1)$
`lrem`	|$O(n)$，n 是列表的长度
`ltrim`	|$O(k)$，k 是要裁剪的元素总数
`lset`	|$O(k)$，n 是索引的偏移量
`blpop`	|$O(1)$

## 使用技巧

- 容量有限，最多为 $2^{32}-1$ 个元素
- `lindex` 辅助查询，但用的时候效率低，主要还是模拟队列或者栈
- 结束操作索引为 -1  
- 分页查询时，第一页是热点，通常来源于 redis 的 list

## 简单场景

**关注列表**  
与  
**操作系统日志**  

核心：
- 根据可排序特征（时间）进行信息管理   
- 使用队列模型完成多路汇总合并
- 使用栈模型完成最新消息展示  

存在三个线程往一个系统日志里面添加信息  
最后获取的时候出现的就是按时间顺序添加的内容了  
  
（联想到是否可以模拟 lru ，是可以的因为有删除操作，但是比 `map` 获取元素位置慢很多就是了）  