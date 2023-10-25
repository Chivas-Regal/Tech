---
title: sorted_set
---

## 数据存储与命令

在 set 的存储基础上，添加了可排序字段，使得集合可以顺序存储并展示    
结构为  

```yml
key:
  - value, (nil), score
  - value, (nil), score
  - ...
...
```

- 添加数据：`zadd key score1 member1 [score2 member2]`
- 获取全部数据：<br>`zrange key start stop [WITHSCORES]`<br>`zrevrange key start stop [WITHSCORES]`
- 删除数据：`zrem key member [member ...]`

<p></p>

```sql
-- 有序集合：{c:1, b:2, a:3}
127.0.0.1:6379> zadd sset 3 a 2 b 1 c
(integer) 3

-- 按 score 从小到大顺序输出 member
127.0.0.1:6379> zrange sset 0 -1
1) "c"
2) "b"
3) "a"

-- 按 score 从小到大顺序输出 member 和其对应的 score
127.0.0.1:6379> zrange sset 0 -1 WITHSCORES
1) "c"
2) "1"
3) "b"
4) "2"
5) "a"
6) "3"

-- 按 score 从大到小顺序输出 member 和其对应的 score
127.0.0.1:6379> zrevrange sset 0 -1 WITHSCORES
1) "a"
2) "3"
3) "b"
4) "2"
5) "c"
6) "1"

-- 移除 b 这个 member
127.0.0.1:6379> zrem sset b
(integer) 1

-- 再看一下从小到大的 member
127.0.0.1:6379> zrange sset 0 -1
1) "c"
2) "a"
```

- 条件获取数据
  - 正序有上下界的查询，可以带上 mysql 中的 limit 分页：`zrangebyscore key min max [WITHSCORES] [LIMIT]`
  - 倒序有上下界查询，`zrevrangebyscore key max min [WITHSCORES]`
- 条件删除数据
  - 按排名删除：`zremrangebyrank key start stop`
  - 按score删除：`zremrange key min max`

<p></p>

```sql
-- sset = {a:1, b:2, c:3, e:4, f:5, g:6}
127.0.0.1:6379> zadd sset 1 a 2 b 3 c 4 e 5 f 6 g
(integer) 4

-- 查询值在 3 到 5 之间的 -> {c:3,e:4,f:5} ，从第二名开始的一个 -> {e:4}
127.0.0.1:6379> zrangebyscore sset 3 5 WITHSCORES LIMIT 1 1
1) "e"
2) "4"

-- 倒着查询值在 3 到 5 之间的 -> {f:5, e:4, c:3}
127.0.0.1:6379> zrevrangebyscore sset 5 3 WITHSCORES
1) "f"
2) "5"
3) "e"
4) "4"
5) "c"
6) "3"

-- 删除排名在第二到第三的 -> -{b:2,c:3}
127.0.0.1:6379> zremrangebyrank sset 1 2
(integer) 2
127.0.0.1:6379> zrange sset 0 -1
1) "a"
2) "e"
3) "f"
4) "g"

-- 删除值在4到5之间的 -> -{e:4,f:5}
127.0.0.1:6379> zremrangebyscore sset 4 5
(integer) 2
127.0.0.1:6379> zrange sset 0 -1
1) "a"
2) "g"
```

- 集合内数据数量：`zcard key`，`zcount key min max`  
- 集合交并操作：`zinterstore/zunionstore destination numkeys key [key ...] [WEIGHTS weight] [AGGREGATE SUM|MIN|MAX]`

其中交并操作中的 `AGGREGATE` 操作可以将相同的 value 的 scores 们合起来，策略分别是 求sum | 求max | 求min   
比如两个集合中一个有 `v1:2` 一个有 `v1:3` ，那么后缀
带上 `AGGREGATE SUM` 得到 `v1:5`   
带上 `AGGREGATE MAX` 得到 `v1:3`    
带上 `AGGREGATE MIN` 得到 `v1:2`

- 获取数据对应的索引（排名）：
  - 正排：`zrank key member`
  - 倒排：`zrevrank key member`
- score值获取与修改
  - 获取：`zscore key member`
  - 修改：`zincrby key increment member`

<p></p>

```sql
-- {a:1,b:2,c:3,d:4,e:5}
127.0.0.1:6379> zadd set 1 a 2 b 3 c 4 d 5 e
(integer) 5

-- a 正排第1
127.0.0.1:6379> zrank set a
(integer) 0
-- a 排倒数第5
127.0.0.1:6379> zrevrank set a
(integer) 4

-- a 的 score 为 1
127.0.0.1:6379> zscore set a
"1"
-- a 的 score 加 10 为 11
127.0.0.1:6379> zincrby set 10 a
"11"
```

## 注意事项

- score 保存数据存储空间 $64$ 位，整数范围 $[-9007199254740992,9007199254740992]$
- score 可以保存 double 数据但是会丢失精度
- 本质是集合，value 不能重复，若重复设置会覆盖 score


## 时间复杂度分析


命令	|时间复杂度
-|-
`zadd`	|$O(k*log(n))$，k为要插入的value个数，n是原本的value个数
`zcard`	|$O(1)$
`zscore`	|$O(1)$
`zrank`	|$O(log(n))$，n为set内value个数
`zrem`	|$O(k*log(n))$，k为删除成员个数，n为set内value个数
`zincrby`	|$O(log(n))$，n为set内value个数
`zrange`	|$O(log(n)+k)$，n为set内value个数，k为要获取到的value个数
`zrevrange`	|$O(log(n)+k)$，n为set内value个数，k为要获取到的value个数
`zrangebyscore`	|$O(log(n)+k)$，n为set内value个数，k为要获取到的value个数
`zrevrangebyscore`	|$O(log(n)+k)$，n为set内value个数，k为要获取到的value个数
`zcount`	|$O(log(n)+k)$，n为set内value个数，k为要获取到的value个数
`zremrangebyrank`	|$O(log(n)+k)$，n为set内value个数，k为要删除的value个数
`zremrangebyscore`	|$O(log(n)+k)$，n为set内value个数，k为要删除的value个数
`zinterstore`	|$O(k*\min(n)) + O(m*log(m))$，k是集合的个数，min(n)是所有集合中最小的个数，m是汇总后的元素个数
`zunionstore`	|$O(\sum n) + O(m*log(m))$，$\sum n$是所有集合的元素个数和，m是汇总后的元素个数

## 简单场景

因为排序，我们可以产生已排序队列“队头”的概念。  
如果是一个大顶的优先队列，可以通过 `zrevrange key 0 0` 获取到队头，并通过 `zrem tasks <队头value>` 移除队头。  
但是这样操作要保证两个命令之间的原子性，因此在后续用 Java 操作的时候可以为其添加事务管理。  

### 多关键字排序

假设有字段 A,B,C 他们要进行多关键字排序，A最高B其次C最低  
有下面三个成员要进行排序  

```yml
id001:
  - A: 19
  - B: 107
  - C: 1
id002:
  - A: 5
  - B: 99
  - C: 1
id003:
  - A: 5
  - B: 9
  - C: 3
```

他们要进排序，我们可以将每个字段定好长度然后补前导零，按排序优先级组合好后设为 score    
这里我们可以将 `A` 扩展为两位数，将 `B` 扩展为三位数，`C` 保留一位数  
生成 `"%02d%03d%d", A, B, C`  
也就是  

```yml
<idnumber>: <"%02d%03d%d",A,B,C>

id001: 191071
id002: 050991
id003: 050993
```

这样排序下来就可以排成 `id001` > `id003` > `id002`

### 定时任务管理

将所有任务按设定的时间为 score 进行排序，每次判断是否应执行任务时拿定的最早时间的任务进行判断。    
  
为了提升性能，可以设立多个 sorted_set ，分别表示【一小时内该完成的任务、一天内该进行的任务、一周内该完成的任务...】，形成类似于多级队列的形式。  
每次操作完一个任务后，检查另外几个队列有无需要移动的任务，根据这个就可以减少轮询最早时间任务的次数。  

