---
title: 线程基础
---

## 并发、并行

并发表示一个 CPU 轮换调度线程，每个线程执行一点然后切换到另一个线程执行，在原子层面上它切换与执行的速度很快，所以宏观上看到这些线程是一起执行的。  
并行表示多个 CPU 同时执行线程，处于不同 CPU 的线程并不存在切换执行，而是真正意义上的一起执行。  

并发与并行的好处在于不需要像队列一样一直等待前一个任务执行完再执行下一个任务，不然串行的话类似于qq消息，必须要等自己和一个好友完全结束聊天了，才能和另一个好友进行聊天，十分低效。

## 线程的创建

有两种创建方法
- 继承 `Thread`
- 实现 `Runnable`

### 继承 Thread

可以直接修改 `Thread` 的内部方法 `run()` 来完成对一个线程执行内容的设置。

```java
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("snopzyz");
    }
}

// 执行
new MyThread().start();
```

或者直接匿名创建对象并执行

```java
new Thread () {
    @Override
    public void run () {
        System.out.println("snopzyz");
    }
}.start();
```

### 实现 Runnable

```java
class MyRunnable implements Runnable {
    @Override
    public void run() {
        System.out.println("snopzyz");
    }
}

// 执行
new Thread(new MyRunnable()).start();
```

这表示我们将一个 Runnable 对象直接传给 Thread 实例后，Thread 实例会调用这个 Runnable 的 `run()` 方法  
阅读一下 Thread 源码中的 `run()` 方法  

```java
public class Thread implements Runnable {

    ...

    /* What will be run. */
    private Runnable target;

    ...

    @Override
    public void run() {
        if (target != null) {
            target.run();
        }
    }

    ...
}
```

它的 `run()` 的默认方法是先判断自己的成员对象 `target` 是否为空，不为空的话说明初始化时已经设置好了，直接调用它的 `run` 即可  
验证的话我们自己写一个在初始化 `target` 后，再重写 `run` 方法的 Thread  

```java
new Thread(new Runnable() {
    @Override
    public void run() {
        System.out.println("Runnable's run()");
    }
}) {
    @Override
    public void run() {
        System.out.println("Thread's run()");
    }
}.start();

/**
 * OUTPUT:
 * 
 * Thread's run()
 */
```

可以发现输出的是 Thread 的 run() 方法，就是因为我们在 run() 第一步不判断 target 了，直接执行内容

## 线程动作

- 守护：`thread.daemon()`，设置为守护线程，在别的线程都执行完后本线程退出
- 加入：`thread.join()`，在别的线程中插队，当 `thread` 线程执行完后，才运行被插队的线程继续执行（若带参数，表示插队时间为 `[参数]ms`
- 休眠：`thread.sleep()`，将线程睡眠一段时间，不参与调度 CPU 
- 礼让：`thread.yield()`，礼让线程，通知 CPU 将本次分给自己的时间片略过

## 线程同步

并发状态下对方法的执行是会在某个语句被打断切换走 CPU 的，比如  

```java
public class Main {
    public static void main(String[] args) {
        Print print = new Print();

        new Thread() {
            @Override
            public void run() {
                for (int i = 0; i < 1000; i ++) {
                    print.print1();
                }
            }
        }.start();

        new Thread() {
            @Override
            public void run() {
                for (int i = 0; i < 1000; i ++) {
                    print.print2();
                }
            }
        }.start();

    }
}

class Print {

    public void print1 () {
        System.out.print("A");
        System.out.print("B");
        System.out.print("C");
        System.out.print("\r\n");
    }

    public void print2 () {
        System.out.print("1");
        System.out.print("2");
        System.out.print("3");
        System.out.print("\r\n");
    }
}
```

在运行后得到的结果可能出现这样的内容  
![20231114213415](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231114213415.png) 
这就是在之前 `print1()` 执行输出了一个 A 后，线程被切换到输出 `print2()` ，导致语句错乱。  

为了解决这个情况，引出同步锁 `synchronized(...)` ，可以强制某段代码同步执行中间不会调度给别的线程插队  
参数可以为任何内容，表示上的“锁”  
当两个需要同步分隔开的代码段使用了不同的锁，那么它们实际上并不能完成隔离，因为隔离是需要独占某个锁后使别的需要相同锁的代码段无法进行的。  

这里我们令同一个对象为两个方法的锁，它们即可完成隔离而不会输出错乱内容。  

```java
class Print {
    private Mutex mutex = new Mutex();

    public void print1 () {
        synchronized (mutex) {
            System.out.print("A");
            System.out.print("B");
            System.out.print("C");
            System.out.print("\r\n");
        }
    }

    public void print2 () {
        synchronized (mutex) {
            System.out.print("1");
            System.out.print("2");
            System.out.print("3");
            System.out.print("\r\n");
        }
    }
}

class Mutex {}
```

对于静态方法，我们需要令锁为一个对象创建之前的内容，这里可以用 `Mutex.class` 来加锁。  
`synchronized` 关键字还可以加在方法上  

```java
class Print {
    ...
    public synchronized void print1 () { ... }
    ...
}
```

在普通方法中这里的锁为 `this`，在静态方法中这里的锁为 `Print.class`  
