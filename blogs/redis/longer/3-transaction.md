---
title: 事务与锁
---

由于 redis 是一个独立于业务之外的，可以理解为存放全局变量的区域，因此并发状态下可能会出现以下场景  

<table>
  <tr>
    <th>执行编号</th><th>客户端1</th><th>客户端2</th>
  </tr>
  <tr>
    <td>1</td><td><code>set name snopzyz</code></td><td></td>
  </tr>
  <tr>
    <td>2</td><td></td><td><code>set name demo</code></td>
  </tr>
  <tr>
    <td>3</td><td><code>get name</code></td><td></td>
  </tr>
  <tr>
    <td>4</td><td></td><td><code>get name</code></td>
  </tr>
</table>

此时客户端1在 `get name` 的时候获取到的就是客户端2 `set` 进去的 `demo`，就不是它自己之前设置的值 `snopzyz` 了。  
这种在 MySQL 的事务控制里面叫做脏读。  
为了避免这种情况，我们要使得不允许被“插队”的语句们产生原子性，即等这些语句执行结束了才允许别的语句执行。  
因此产生事务。

## 事务操作

- 开启事务：`multi`
- 结束事务：`exec`

这两个命令之间的代码就具有了原子性，但是在事务结束之前这些代码是不会被执行的，只有执行了 `exec` 了才会一起将返回值告诉客户端。  
这段事务命令的操作时机是键入 `exec` 的那一刻开始一起传给 redis 依次执行。  
可以看一下测试。  

<table>
  <tr>
    <th>执行编号</th><th>客户端1</th><th>客户端2</th>
  </tr>
  <tr>
    <td>1</td><td><code>multi</code><br>-<br><code>OK</code></td><td></td>
  </tr>
  <tr>
    <td>2</td><td></td><td><code>incr a 1</code><br>-<br><code> (integer) 1</code></td>
  </tr>
  <tr>
    <td>3</td><td><code>incr a 1</code><br>-<br><code>QUEUED</code></td><td></td>
  </tr>
  <tr>
    <td>4</td><td></td><td><code>incr a 1</code><br>-<br><code> (integer) 2</code></td>
  </tr>
  <tr>
    <td>5</td><td><code>incr a 1</code><br>-<br><code>QUEUED</code></td><td></td>
  </tr>
  <tr>
    <td>6</td><td><code>exec</code><br>-<br><code>1) (integer) 3<br>&nbsp;2) (integer) 4</code></td><td></td>
  </tr>
</table>

可以发现最后执行的时候客户端2的操作都做完了。

- 事务取消：`discard`

这个操作相当于将所在事务前面的代码取消掉，这个事务不存在了。  
其实仔细思考一下，它并不像 MySQL 那样在事务中还存在复杂的快照隔离、版本、当前读等，它仅仅是**服务端将命令检查语法后塞入到一个队列里面**。  
当遇到 `exec` 后将队列里的命令一起拿出来运行并返回，  
当遇到 `discard` 或者语法错误将队列清空就没啥事了。

而逻辑错误是不影响事务执行的，比如。  

<table>
  <tr>
    <th>执行编号</th><th>客户端</th>
  </tr>
  <tr>
    <td>1</td><td><code>multi</code><br>-<br><code>OK</code></td>
  </tr>
  <tr>
    <td>2</td><td><code>set name snopzyz</code><br>-<br><code>QUEUED</code></td>
  </tr>
  <tr>
    <td>3</td><td><code>lpush name a b c</code><br>-<br><code>QUEUED</code></td>
  </tr>
  <tr>
    <td>4</td><td><code>get name</code><br>-<br><code>QUEUED</code></td>
  </tr>
  <tr>
    <td>5</td><td><code>exec</code><br>-<br><code>1) OK<br>&nbsp;2) (error) WRONGTYPE Operation against a key holding the wrong kind of value<br>&nbsp;3) "snopzyz"</code></td>
  </tr>
</table>

发现指令3是存在逻辑错误的，但是就仅仅作为返回值给出了一下错误原因，不影响别的操作。   
所以如果出了这样的错我们 Redis 是无法支持我们回滚的，有两种方案：
1. 在 [Spring[boot] 事务控制](../../framework/Spring/5-transactional.md) 中用 `@Transaction` 控制事务完成回滚
2. 在测试的时候做好 RDB 快照以便于出错了可恢复

都很简单这里就不细究了。

## 锁

上面的似乎不能满足我们在 `multi` 开始时到 `exec` 结束时的数据一致性，Redis 提供了一种 “锁” 机制。  
锁住的 key 在事务执行期间如果被写了，那么事务 `exec` 会返回一个 `(nil)` 且这之间的内容都不执行。  

- `watch key1 [key2 ...]`：对选中的 key 添加监视锁
- `unwatch`：对所有 key 取消监视

例：

<table>
  <tr>
    <th>执行编号</th>
    <th>客户端1</th>
    <th>客户端2</th>
  </tr>
  <tr>
    <td>1</td>
    <td><code>set name snopzyz</code><br>-<br><code>OK</code></td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td><code>watch name</code><br>-<br><code>OK</code></td>
    <td></td>
  </tr>
  <tr>
    <td>3</td>
    <td><code>multi</code><br>-<br><code>OK</code></td>
    <td></td>
  </tr>
  <tr>
    <td>4</td>
    <td><code>set id 1</code><br>-<br><code>QUEUED</code></td>
    <td></td>
  </tr>
  <tr>
    <td>5</td>
    <td><code>get id</code><br>-<br><code>QUEUED</code></td>
    <td></td>
  </tr>
  <tr>
    <td>6</td>
    <td></td>
    <td><code>set name demo</code><br>-<br><code>OK</code></td>
  </tr>
  <tr>
    <td>7</td>
    <td><code>exec</code><br>-<br><code>(nil)</code></td>
    <td></td>
  </tr>
</table>

就是因为第6条执行，导致客户端1监控的 key 发生变化，事务取消。  

## 分布式锁

### 业务解决：超卖问题

- `setnx lock-key value`：
  - 无值返回设置成功：拥有控制权，执行业务，操作完毕用 `del key` 删除锁
  - 有值返回设置失败：没有控制权，排队或等待

<table>
  <tr>
    <th>执行编号</th>
    <th>客户端1</th>
    <th>客户端2</th>
  </tr>
  <tr>
    <td>1</td>
    <td><code>set shopnum 10</code><br>-<br><code>OK</code></td>
    <td></td>
  </tr>
  <tr>
    <td>2</td>
    <td><code>setnx lock-shop 1</code><br>-<br><code>(integer) 1</code></td>
    <td></td>
  </tr>
  <tr>
    <td>3</td>
    <td></td>
    <td><code>setnx lock-shop 1</code><br>-<br><code>(integer) 0</code></td>
  </tr>
  <tr>
    <td>4</td>
    <td><code>incrby shopnum -1</code><br>-<br><code>(integer) 9</code></td>
    <td></td>
  </tr>
  <tr>
    <td>5</td>
    <td><code>del lock-shop</code><br>-<br><code>(integer) 1</code></td>
    <td></td>
  </tr>
  <tr>
    <td>6</td>
    <td></td>
    <td><code>setnx lock-shop 1</code><br>-<br><code>(integer) 1</code></td>
  </tr>
  <tr>
    <td>7</td>
    <td></td>
    <td>客户端2执行业务 ...</td>
  </tr>
</table>

但是有一个问题，占用锁的进程宕机则将会导致锁永远被占用，下面是改良。

### ❗问题解决：分布式锁的宕机占用

在设置锁后，第一步就执行 `expire lock-key second` 时限。  
这样就可以保证若进程宕机，或者卡死无法执行后面的解锁一句，锁超时后依然会被自动取消占用。    
  
锁一般设置时间为：最大业务耗时 $\times 120\%\;+$ 平均网络延迟 $\times 110%$
