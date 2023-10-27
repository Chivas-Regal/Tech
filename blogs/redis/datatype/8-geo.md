---
title: GEO
---

**用作地理坐标位置（经纬度）计算**

- `geoadd key longitude latitude member [longitude latitude member ...]`：添加坐标点
- `geopos key member [member ...]`：获取坐标点
- `geodist key member1 member2 [unit=m|km|ft|mi]`：计算坐标点的距离，`unit` 为单位

<p></p>

```sql
-- point1经纬度为(1,1)，point2经纬度在(2,2)
127.0.0.1:6379> geoadd geos 1 1 point1
(integer) 1
127.0.0.1:6379> geoadd geos 2 2 point2
(integer) 1

-- 获取 point1 的地址信息，（经纬度被度分秒转换后了）
127.0.0.1:6379> geopos geos point1
1) 1) "0.99999994039535522"
   2) "0.99999945914297683"

-- 获取 point1 到 point2 的距离
127.0.0.1:6379> geodist geos point1 point2
"157270.0561"
```

- `georadius key longitude latitude radius m|km|ft|mi [withcoord] [withdist] [withhash] [count count]`：根据坐标求范围内的数据
- `georadiusbymember key member radius m|km|ft|mi [withcoord] [withdist] [withhash] [count count]`：根据点求范围内数据
  - `withcoord`：给出 member 的同时给出坐标
  - `withdist`：给出 member 的同时给出距离
  - `withhash`：给出 member 的同时给出哈希值
  - `count count` 根据距离排序后给出取值范围
- `geohash key member [member ...]`：获取指定点对应的坐标 hash 值

<p></p>

```sql
-- 田字格 范围为 [x=[1,3], y=[1,3]]
127.0.0.1:6379> geoadd geos 1 1 mem0
(integer) 1
127.0.0.1:6379> geoadd geos 1 2 mem1
(integer) 1
127.0.0.1:6379> geoadd geos 1 3 mem1
(integer) 0
127.0.0.1:6379> geoadd geos 1 3 mem2
(integer) 1
127.0.0.1:6379> geoadd geos 2 1 mem3
(integer) 1
127.0.0.1:6379> geoadd geos 2 2 mem4
(integer) 1
127.0.0.1:6379> geoadd geos 2 3 mem5
(integer) 1
127.0.0.1:6379> geoadd geos 3 1 mem6
(integer) 1
127.0.0.1:6379> geoadd geos 3 2 mem7
(integer) 1
127.0.0.1:6379> geoadd geos 3 3 mem8
(integer) 1
-- 一个特殊的远距离点
127.0.0.1:6379> geoadd geos 5 5 mem24
(integer) 1

-- 距离 (2,2) 有 180km 的点
127.0.0.1:6379> georadiusbymember geos mem4 180 km
1) "mem0"
2) "mem3"
3) "mem4"
4) "mem6"
5) "mem7"
6) "mem1"
7) "mem2"
8) "mem5"
9) "mem8"
-- 距离 (2,2) 有 120km 的点
127.0.0.1:6379> georadiusbymember geos mem4 120 km
1) "mem4"
2) "mem5"
3) "mem3"
4) "mem7"
-- 距离 (2,2) 有 1800km 的点
127.0.0.1:6379> georadiusbymember geos mem4 1800 km
 1) "mem0"
 2) "mem3"
 3) "mem4"
 4) "mem6"
 5) "mem7"
 6) "mem1"
 7) "mem2"
 8) "mem5"
 9) "mem8"
10) "mem24"

-- 距离 (1.5,1.5) 有 90km 的点
127.0.0.1:6379> georadius geos 1.5 1.5 90 km
1) "mem4"
2) "mem0"
3) "mem3"
```