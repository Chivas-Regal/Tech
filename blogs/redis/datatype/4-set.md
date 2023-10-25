---
title: set
---

## 数据存储与命令

list 不支持快速索引查询  
hash 的值部分耗费空间  
于是基于与 hash 的结构，将 value 部分全部设为 `(nil)`  
用 field 字段（这里叫 member）完成类似于 list 的集合 set，**不允许重复**

- 添加数据：`sadd key member1 [member2]`  
- 获取全部数据：`smembers key`
- 删除数据：`srem key member1 [member2]`
- 获取集合总数量：`scard key`
- 判断集合中是否包含某数据：`sismember key member`

<p></p>

```sql
-- 向 users 添加用户 snopzyz demo
127.0.0.1:6379> sadd users snopzyz demo
(integer) 2  -- [snopzyz, demo]

-- 向 users 添加用户 swm231
127.0.0.1:6379> sadd users swm231
(integer) 1  -- [snopzyz, swm231, demo]

-- 获取 users 内的数据
127.0.0.1:6379> smembers users
1) "snopzyz"
2) "swm231"
3) "demo"

-- 获取 users 内的数据个数
127.0.0.1:6379> scard users
(integer) 3

-- 判断用户 swm231 是否存在
127.0.0.1:6379> sismember users swm231
(integer) 1 -- 存在

-- 删除用户 swm231
127.0.0.1:6379> srem users swm231
(integer) 1 -- 删除成功

-- 获取 users 内的数据
127.0.0.1:6379> smembers users
1) "snopzyz"
2) "demo"

-- 获取 users 内的数据个数
127.0.0.1:6379> scard users
(integer) 2

-- 判断用户 swm231 是否存在
127.0.0.1:6379> sismember users swm231
(integer) 0 -- 不存在
```

- 求集合之间的关系
  - 交集：`sinter key1 [key2]`
  - 并集：`sunion key1 [key2]`
  - 差集：`sdiff key1 [key2]` （ `key1`-`key2` ）
- 求集合之间的关系并存储到指定集合中
  - 交集：`sinterstore destination key1 [key2]`
  - 并集：`sunionstore destination key1 [key2]`
  - 差集：`sdiffstore destination key1 [key2]`
- 将指定数据从原始集合中移动到目标集合：`smove source destination member`

<p></p>

```sql
-- set1 = {1, 2, 3, 4, 5}
127.0.0.1:6379> sadd set1 1 2 3 4 5
(integer) 5
-- set2 = {3, 4, 5, 6, 7}
127.0.0.1:6379> sadd set2 3 4 5 6 7
(integer) 5
-- set3 = {5, 6, 7, 8, 9}
127.0.0.1:6379> sadd set3 5 6 7 8 9
(integer) 5

-- set1 ∩ set2 ∩ set3
127.0.0.1:6379> sinter set1 set2 set3
1) "5"

-- set1 ∪ set2 ∪ set3
127.0.0.1:6379> sunion set1 set2 set3
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
6) "6"
7) "7"
8) "8"
9) "9"

-- set1 - (set2 ∪ set3)
127.0.0.1:6379> sdiff set1 set2 set3
1) "1"
2) "2"

-- set_inter = set1 ∩ set2 ∩ set3
127.0.0.1:6379> sinterstore set_inter set1 set2 set3
(integer) 1

-- set_union = set1 ∪ set2 ∪ set3
127.0.0.1:6379> sunionstore set_union set1 set2 set3
(integer) 9

-- set_diff_in_set1 = set1 - (set2 ∪ set3)
127.0.0.1:6379> sdiffstore set_diff_in_set1 set1 set2 set3
(integer) 2

-- set_diff_in_set2 = set2 - (set1 ∪ set3)
127.0.0.1:6379> sdiffstore set_diff_in_set2 set2 set1 set3
(integer) 0

-- set_inter = {5}
127.0.0.1:6379> smembers set_inter
1) "5"

-- set_union = {1, 2, 3, 4, 5, 6, 7, 8, 9}
127.0.0.1:6379> smembers set_union
1) "1"
2) "2"
3) "3"
4) "4"
5) "5"
6) "6"
7) "7"
8) "8"
9) "9"

-- set_diff_in_set1 = {1, 2}
127.0.0.1:6379> smembers set_diff_in_set1
1) "1"
2) "2"

-- set_diff_in_set2 = ∅
127.0.0.1:6379> smembers set_diff_in_set2
(empty array)

-- 将 set1 中的 1 移动到 set2 中
127.0.0.1:6379> smove set1 set2 1
(integer) 1
-- set1 = {2, 3, 4, 5}
127.0.0.1:6379> smembers set1
1) "2"
2) "3"
3) "4"
4) "5"
-- set2 = {1, 3, 4, 5, 6, 7}
127.0.0.1:6379> smembers set2
1) "1"
2) "3"
3) "4"
4) "5"
5) "6"
6) "7"
```

## 时间复杂度分析

命令	|时间复杂度
-|-
`sadd`	|$O(k)$，k 为一次添加的元素个数
`srem`	|$O(k)$，k 为一次删除的元素个数
`scard`	|$O(1)$
`sismember`	|$O(1)$
`srandmember`	|$O(count)$
`spop`	|$O(1)$
`smembers`	|$O(n)$，n 为集合内元素总数
`sinter`	|$O(\min(n)m)$，n 是最小的集合的元素个数，m 是集合的个数
`suinon`	|$O(\sum n)$，n 为每个集合元素个数
`sdiff`	|$O(\sum n)$，n 为每个集合元素个数

## 简单场景

### 随机推送

抖音为用户观看不同视频类别的次数来设置用户兴趣，加大用户的留存度  

**业务分析**  
从最新热点消息 set 中随机取出几条，配合用户感兴趣类别的热点消息 set ，合并推送给用户视频  

- 随机获取指定数量的数据：`srandmember key [count]`
- 随机获取一条数据并弹出（防止随机化重复）：`spop key` 

### 根据别人关注的信息推送

用上面的交并差集的关系  
获得一个人与另一个人的：
- 共同关注
- 别人关注了自己没关注
- 自己和别人一共关注的

### 权限校验

一个公司有多个员工，多个职位，每个职位有不同的操作权限，同时每个员工可以对应多个职位  
此时要给一个员工设置几个职位，然后查询它能否进行某个操作  

职位 $id$ ：`rid`，value 中存放可以进行的操作  
员工 $id$ ：`uid`，value 中存放可以进行的操作    

```sql
-- 职位001 可以进行 {getall, getById} 操作
127.0.0.1:6379> sadd rid:001 getall getById
(integer) 2
-- 职位002 可以进行 {getCount, getall, insert} 操作
127.0.0.1:6379> sadd rid:002 getCount getall insert
(integer) 3

-- 员工001 获得了 职位001 和 职位002，应当取它们操作的并集
127.0.0.1:6379> sunionstore uid:001 rid:001 rid:002
(integer) 4

/*
    现在检查 员工001 可否进行 insert 操作
    有下面两种方式：
*/
-- 方式1：提供基础数据，直接将集合存入 Java 内，然后查的时候从这里找有没有
127.0.0.1:6379> smembers uid:001
1) "insert"
2) "getById"
3) "getCount"
4) "getall"
-- 方式2：直接在这里判断（注意，这样做会将数据层和业务层混在一起，不建议使用这种方式）
127.0.0.1:6379> sismember uid:001 insert
(integer) 1
```

当然如果此时再来了一个 职位003 可以支持 `setName`、`setById` 操作，想添加进 员工001 中  

```sql
-- 新职位003
127.0.0.1:6379> sadd rid:003 setName setById
(integer) 2

-- 将职位003和自己取并集赋给自己
127.0.0.1:6379> sunionstore uid:001 uid:001 rid:003
(integer) 6
```

### 网站访问量统计

获取：
- PV: 网站被访问次数：用 string 类型做 `incr` 加法
- UV: 网站被不同用户的访问次数：用 set 记录不同 cookie 数量
- IP: 网站被不同IP地址的访问次数：用 set 记录不同 IP 数量