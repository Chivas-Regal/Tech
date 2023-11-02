---
title: 工具 —— 指标监控
---

## 性能指标

- `latency`：Redis 响应一个请求的事件
- `instantaneous_ops_per_sec`：平均每秒处理请求总数
- `hit rate (calculated)`：缓存命中率（计算得知）

## 内存指标

- `userd_memory`：已经使用内存
- `mem_fragmentation_ratio`：内存碎片率
- `evicted_keys`：OOM 移除的 key 数量
- `blocked_clients`：被阻塞的客户端

## 基本活动指标

- `connected_clients`：客户端连接数
- `connected_slaves`：slave 数量
- `master_last_io_seconds_age`：距离上次主从交互的时间
- `keyspace`：数据库中 key 的总数

## 持久化指标

- `rdb_last_save_time`：最后一次 rdb 到磁盘的时间
- `rdb_changes_since_last_save`：最后一次 rdb 后的数据库修改数

## 错误指标

- `rejected_connections`：达到 maxclient 而被拒绝的连接数
- `keyspace_misses`：key 未命中次数
- `master_link_down_since_seconds`：主从断开的持续时间