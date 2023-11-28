---
title: 应用 - 实现分布式锁
---

我们之前客户端启动的时候要连接服务端 ip:port ，以一个外部的机器/进程来完成公共“变量”  
而分布式锁就需要这样的条件：一个保存在外部大家都可以获取的数据  
如果了解的话当然还有别的机制来实现：  
- 数据库：效率较低
- Redis：效率高但是多机条件下不可靠（Master宕机时主从切换中间的数据访问可能有延时，会导致大家都获取到锁）

而 ZooKeeper 是一种性能较高并且数据可靠的机制。  

## 实现方式

<mark>客户端要获取锁时创建节点，释放锁时删除节点。</mark>  
客户端获取锁时创建**临时顺序**节点  
**临时**就和 Redis 分布式锁设置超时时间一样要保证客户端就算宕机的话锁也可以被释放。  
**顺序**是为了充分使用 watcher 机制节省读时间，下面是过程：  

客户端创建完临时顺序节点后，查询 lock 下所有子节点看看自己是否为最小的，如果是的话立刻执行并在结束后删除节点，如果不是的话就**在上一个比自己小的节点**注册删除的 watcher  
当接收到 watcher 响应后，再次查询判断自己是否为最小的，然后就是和上面一样的流程了，不断循环直到自己拿到锁执行事务后删除。  

这样做完美利用了 watcher 的机制，极大节省了请求发送次数与zk树节点的遍历次数（不然轮询的话十分耗费性能）。  
上面的逻辑不需要自己写，Curator已经做完并封装好了。  

## Curator分布式锁api的使用

Curator有五种锁模式：
- InterProcessSemaphoreMutex：分布式非可重入排他锁，获取到锁的client不释放锁的话也无法再次获得该锁
- InterProcessMutex：分布式可重入排他锁，获取到锁的client可以反复获取该锁（但最后获取几次就要释放几次）
- InterProcessReadWriteLock：分布式读写锁，读写不同时
- InterProcessMultiLock：将多个锁作为单个实体管理的容器，向外提供一致的服务
- InterProcessSemqphoreV：共享信号量，可以设置信号量大小表示最多同时允许几个client获取锁

## 实例操作

使用起来就很简单，用 Curator 包装好的类即可（类名为上面锁模式其中之一）   
类的初始化需要带上 `CuratorFramework` 与锁的节点路径  
- 占有锁：`mutex.acquire(a, b)` ，其中 `a` 为时间数值，`b` 为时间单位，表占有锁最长多久
- 释放锁：`mutex.release()` 即可 

下面这个类就是实现了在线程并发时对变量减法的控制，重点就是三个注释所在位置  

```java
class AtomicVar implements Runnable {

    private int var = 10;

    private InterProcessMutex mutex;

    AtomicVar () {
        /* 初始化 */
        RetryPolicy retryPolicy = new ExponentialBackoffRetry(3000, 10);
        CuratorFramework client = CuratorFrameworkFactory.builder()
                .connectString("127.0.0.1:2181")
                .sessionTimeoutMs(60*1000)
                .connectionTimeoutMs(15*1000)
                .retryPolicy(retryPolicy)
                .build();
        client.start();
        mutex = new InterProcessMutex(client, "/lock");
    }

    @Override
    public void run() {
        while (true) {
            try {
                /* 占有锁最多 3s */
                mutex.acquire(3, TimeUnit.SECONDS);

                /* 业务部分 */
                if (var > 0) {
                    var--;
                    System.out.println(Thread.currentThread().getName() + " 将 var 减一后变为 " + var);
                }

            } catch (Exception e) {
                e.printStackTrace();
            } finally {
                try {
                    /* 释放锁 */
                    mutex.release();
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
```

可以看到最主要的就是锁初始化、占有、释放这三行  
然后再在一个 main 方法上开启两个线程（客户端）来进行测试  

```java
public class MutexTest {

    public static void main(String[] args) {
        AtomicVar atomicVar = new AtomicVar();

        Thread t1 = new Thread(atomicVar, "snopzyz");
        Thread t2 = new Thread(atomicVar, "demo");

        t1.start();
        t2.start();
    }

}
```

运行后的效果为

```
snopzyz 将 var 减一后变为 9
demo 将 var 减一后变为 8
snopzyz 将 var 减一后变为 7
demo 将 var 减一后变为 6
snopzyz 将 var 减一后变为 5
demo 将 var 减一后变为 4
snopzyz 将 var 减一后变为 3
demo 将 var 减一后变为 2
snopzyz 将 var 减一后变为 1
demo 将 var 减一后变为 0
```

这样