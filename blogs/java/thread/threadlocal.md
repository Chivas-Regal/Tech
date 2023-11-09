---
title: ThreadLocal 存储
---

## 多线程下的临界区问题

一个经典案例，多线程直接并发操作临界区导致的数据混乱

```java
/**
 * 测试多线程暴力修改公共变量
 */
public class Demo {

    /* 临界区 */
    private String value;
    public String getValue() {return value;}
    public void setValue(String value) {this.value = value;}

    public static void main(String[] args) {
        Demo demo = new Demo();

        /* 五个线程一起操作临界区 */
        for (int i = 0; i < 5; i ++) {
            Thread t = new Thread(new Runnable() {
                @Override
                public void run() {
                    /* 线程 name 赋给临界区 value，等一些语句之后再次测试两者是否相等 */
                    demo.setValue(Thread.currentThread().getName());
                    System.out.print("");
                    System.out.println(Thread.currentThread().getName() + " = " + demo.getValue());
                }
            });
            t.setName("thread" + i);
            t.start();
        }

    }
}
```

在理论上讲这份代码应该 `thread{i} = thread{i}` 都是一一对应的，毕竟在 `setValue(...)` 后立刻取出并进行比对  
但实际上这份代码运行之后的结果总会有出入  

![20231109195344](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231109195344.png)  

原因这里给出下面两个线程的可能执行逻辑：
1. 线程1：value="线程1"
2. 线程2：value="线程2"
3. 线程1：输出value得到"线程2"，发送了”不可重复读“问题

这是并发方面的确实会出现的问题，下面给出改进方案  

## ThreadLocal 基本操作

JDK 提供了一个 `ThreadLocal` 类，它可以用来**隔离不同的线程**，创建一个**当前线程下可传递的变量**。  
比如在一个线程开始时建了一个 `a=1`，那么在这个线程的生命周期里面都可以获取到 `a=1` 这件事。   

它提供了几个方法，常用的有  
- `ThreadLocal()`：创建 ThreadLocal 对象
- `public void set(T value)`：设置当前线程绑定的局部变量
- `public T get()`：获取当前线程绑定的局部变量
- `public void remove()`：移除当前线程绑定的局部变量

为此改一下上面的操作：  

```java
...
public class Demo {
    ...

    /* 改一下临界区由 ThreadLocal<String> 管理 */
    private ThreadLocal<String> value = new ThreadLocal<>();
    public String getValue() { return this.value.get(); }
    public void setValue(String value) { this.value.set(value); }

    ...
}
```

然后再执行 `main` ，此时 `thread{i} = thread{i}` 都是固定的了

::: tip

当然还有一种操作可以实现：`synchronized` 关键字  
在最原始的代码的 `public void run() {}` 内，加上一个同步锁  

```java
...
    public void run() {
        synchronized (Demo.class) {
            demo.setValue(Thread.currentThread().getName());
            System.out.print("");
            System.out.println(Thread.currentThread().getName() + " = " + demo.getValue());
        }
    }
...
```

这样出的结果也是正常的，但它和 `ThreadLocal` 的区别在于：  
- `synchronized` 用时间换空间，令多个线程同步访问临界资源来避免插队现象
- `ThreadLocal` 用空间换时间，为每个线程保存一份独立的副本使得共同访问互不干扰

:::

## 应用：事务管理

下面给出一个标准的 JDBC 事务管理 ”转账操作“ 的部分代码  

```java
public class AccountService {

    /**
     * outUser 给 inUser 转账 money 元
    */
    public void transfer (String outUser, String inUser, int money) {

        AccountDao accountDao = new AccountDao(); // dao层转账功能实现类
        Connection conn = null; // 数据库连接

        try {
            synchronized (AccountService.class) {
                /* 开启事务 */
                conn = JdbcUtils.getConnection(); // 直接从"连接池"中获取的数据库连接
                conn.setAutoCommit(false);

                /* outUser 转出 money 元 */
                accountDao.update(outUser, -money, conn);
                /* inUsre 收入 money 元 */
                accountDao.update(inUser, +money, conn);

                /* SUCCESS: 成功提交 */
                JdbcUtils.commitAndClose(conn);
            }
        } catch (Exception e) {
            e.printStackTrace();
            /* FAILED: 失败回滚 */
            JdbcUtils.rollbackAndClose(conn);
        }
    }
}
```

这段代码遵循了数据库事务控制的两个原则：
1. DML操作必须为同一个连接（第18与19行采用传参式传递连接）
2. 事务执行时连接对象要前后一致，需要线程隔离（第12行采用同步机制）

这两个原则用 `ThreadLocal` 操作会更为方便，具体改动为第14行调用的方法 `JdbcUtils.getConnection()`  

```java
public class JdbcUtils {
    ...

    static ThreadLocal<Connection> tl = new ThreadLocal<>();

    /**
     * 从整个线程的生命周期内获取连接
     *   - 有：直接获取
     *   - 没有：创建后再进行获取
    */
    public Connection getConnection() {
        Connection conn = tl.get();
        if (conn == null) {
            conn = ds.getConnection();
            tl.set(conn);
        }
        return conn;
    }

    ...
}
```

这样既不用 `synchronized` 进行同步，也不用多加参数来传递同一连接。  
删掉 AccountService 演示中第 12 行的 `synchronize`，以及第 18,20 行的方法的数据库连接参数，  
只需要在这个方法并且是 dao 层的每一个 DML 操作方法内，调用 `Jdbc.getConnection()` 获取连接，就既保证了属于同一连接，又保证了线程隔离。  

## 内部结构与源码剖析

每一个线程维护一个 `ThreadLocalMap`，它里面有多个键值对
- key：`ThreadLocal` 对象
- value: 保存的值

通过这种方式通过不同的线程分割出不同的 `ThreadLocalMap` 有如下好处
- 减小了每一个 map 中键值对的数量，极大避免了哈希冲突的产生
- 线程结束时可以直接删掉一个 `ThreadLocalMap`，对删除操作十分友好

下面大概聊一下源码

### set

```java
/**
 * 设置这个线程局部变量的当前线程的复制设置为指定的值
 *
 * @param value 要存储在此线程局部的当前线程副本中的值
 */
public void set(T value) {
    /* 获取当前线程 */
    Thread t = Thread.currentThread();
    /* 根据当前线程获取 ThreadLocalMap */
    ThreadLocalMap map = getMap(t);

    /** 
     * 当前线程是否存在 ThreadLocalMap
     * - 不存在：根据当前 ThreadLocal 和 value 初始化一个
     * - 存在：将当前 ThreadLocal 和 value 加入其中
     */
    if (map != null) {
        map.set(this, value);
    } else {
        createMap(t, value);
    }
}

/**
 * 获取当前线程维护的 ThreadLocalMap
 *
 * @param  t 当前线程
 * @return t 对应的 ThreadLocalMap
 */
ThreadLocalMap getMap(Thread t) {
    return t.threadLocals;
}

/**
 * 创建当前线程对应维护的 ThreadLocalMap
 *
 * @param t 当前线程
 * @param firstValue map 的第一个 entry{ThreadLocal, value}
 */
void createMap(Thread t, T firstValue) {
    t.threadLocals = new ThreadLocalMap(this, firstValue);
}
```

步骤总结：
1. 获取当前线程对应的 `ThreadLocalMap`
2. 若 map 存在，直接将键值对塞进去
3. 若 map 不存在，创建一个新的 map 并将已有键值对作为初始值

### get

```java
/**
* 返回本线程中当前 ThreadLocal 变量对应值的副本
* 如果变量没有值，则首先将其初始化为调用 initialValue() 方法返回的值
*
* @return 本线程中当前 ThreadLocal 对应的值
*/
public T get() {
    /* 获取当前线程 */
    Thread t = Thread.currentThread();
    /* 获取当前线程的 ThreadLocalMap */
    ThreadLocalMap map = getMap(t);

    /** 
     * 若存在 ThreadLocalMap 
     * 且 map 中能找到此 ThreadLocal 对应的值
     * 直接返回
     */
    if (map != null) {
        ThreadLocalMap.Entry e = map.getEntry(this);
        if (e != null) {
            @SuppressWarnings("unchecked")
            T result = (T)e.value;
            return result;
        }
    }
    /* 无 map 也无此 ThreadLocal 键值对，返回自定义的一个值 */
    return setInitialValue();
}

/**
 * set()的变体，用于建立initialValue。在用户覆盖set()方法的情况下代替set()使用。
 * 同时在 get() 无值的时候，返回此初始值
 *
 * @return 初始值
 */
private T setInitialValue() {
    /* 这些操作都和 set() 一样，但 value 是  initiaValue() 得到的初始值 */
    T value = initialValue();
    Thread t = Thread.currentThread();
    ThreadLocalMap map = getMap(t);
    if (map != null) {
        map.set(this, value);
    } else {
        createMap(t, value);
    }
    /* 如果此 ThreadLocal 是扩展了末尾清理操作的 ThreadLocal
       就在全局 TerminatingThreadLocal 中注册 */
    if (this instanceof TerminatingThreadLocal) {
        TerminatingThreadLocal.register((TerminatingThreadLocal<?>) this);
    }
    return value;
}

/**
 * 这是一个可以被用户重写的方法
 * 用于 get() 无值或者 set() 被重写后，为一个新的 ThreadLocal-Value 键值对做默认初始化的值
 */ 
protected T initialValue() {
    return null;
}
```

步骤总结：
1. 获取当前 ThreadLocalMap
2. 获取该 map 下此 ThreadLocal 的值
3. 检测值是否存在
    - 存在：返回值
    - 不存在：调用 `setInitialValue` 获取并 `set()` 进去一个初始化的值