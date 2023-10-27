---
title: HyperLogLog
---

**用作基数统计。**

- `pfadd key element [element ...]`：添加数据
- `pfcount key [key ...]`：统计数据
- `pfmerge destkey sourcekey [sourcekey ...]`：合并数据

<p></p>

```sql
-- hll = {1}
127.0.0.1:6379> pfadd hll 1
(integer) 1

-- hll = {1, 2}
127.0.0.1:6379> pfadd hll 2
(integer) 1

-- hll = {1, 2}
127.0.0.1:6379> pfadd hll 1
(integer) 0

-- hll = {1, 2}
127.0.0.1:6379> pfadd hll 1
(integer) 0

-- hll.size = 2
127.0.0.1:6379> pfcount hll
(integer) 2
```

其实和 set 功能上算是子集，不是集合不保存数据只进行基数统计，但是 hyperloglog 采用**精度换空间**的方法。  
它可以存储 $2^{64}$ 个数据，每个 key 占用最多 12K 的内存用于标记基数，在大数量级的情况下以很小的空间进行元素的去重统计。  
- `pfadd` 时占用内存是递增的，不是一次就为 12K
- `pfmerge` 牵扯到分桶，会一次性派发 12K 内存保证合并空间
标准误差为 $0.81%$。  

核心是一种估算算法，后面如果有需要会在下面讲解一下用的算法...
