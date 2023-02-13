---
title: 锁
---

## 并行的问题

[前文--创建](create.html) 中提到这样一个问题，就是我们的输出是混乱的，其主要原因是线程之间的并行，导致了线程之间的输出互相干扰  
这个问题也同样会出现在数据的操作上，比如我们熟知的自加操作，它并非一个原子操作，在机器语言下会有多个步骤来完成一个加法，那么在下面的代码中  

```cpp
# define NUM_THREAD 100

int count = 0;
void selfIncrease () {
    for (int i = 0; i < 100; i ++)
        count ++;
}

int main () {
    std::thread th[NUM_THREAD];
    for (int i = 0; i < NUM_THREAD; i ++) {
        th[i] = std::thread(selfIncrease);
    }   
    for (int i = 0; i < NUM_THREAD; i ++) {
        th[i].join();
    }
    std::cout << count << std::endl;
}
```
我们期望得到 $10000$ ，但实际则是 $9900$ 左右，这就是并行下线程的干扰

## 串行化

一个线程想需要另一个线程操作完的结果那么我们前面熟知的分离连接，可以使用 `join` 来解决这个需求  
  
比如我们想让线程 $1$ 在线程 $2$ 后执行  

```cpp
std::thread th1, th2;

void threadWork (int id, std::string msg) {
    if (id == 2) {
        th1.join(); // 先阻塞 th1
    }
    std::cout << "message from thread " << id << std::endl << msg << std::endl;
}

int main () {
    th1 = std::thread(threadWork, 1, "hello thread(1)!");
    th2 = std::thread(threadWork, 2, "hello thread(2)!");
    th2.join(); // 再阻塞 th2
}
```

可以发现，其实就是线程二等线程一，主线程等线程一。在上面数据自加中也可以有同样类型的操作。  
这其实和只使用一个线程解决的问题差不多，也就是将多线程串行化，但是这样写会有一点问题，那就是不够灵活与高效，因为我们每次都是等一个线程用完后再恢复下一个线程，为此引入一个东西叫做锁

### 锁

对于上面的自加操作，我们可以使用一个锁来保证一个线程自加的时候别的线程加操作时阻塞  

```cpp
std::mutex mtx;

int count = 0;
void selfIncrease () {
    for (int i = 0; i < 100; i ++) {
        mtx.lock();
        count ++;
        mtx.unlock();
    }
}
...
```
这样就可以防止加操作时线程间的冲突，保证了最后输出是 $10000$  

### 条件变量

如果想控制几个线程交替进行一些事情，锁似乎就不太好用了，但是有一个东西 `std::condition_variable` 可以帮我们完成这件事情，主要使用就是结合 `std::mutex` 和 `std::unique_lock` 来对某个条件上锁，等待该条件满足后结束阻塞  
这里使用三个线程交替输出 `1,2,3` 来简单演示一下用法  

```cpp
std::mutex mtx; // 锁
std::condition_variable cv; // 条件变量

int lastout = 3; // 上一次输出内容

void out1 () {
    for (int i = 0; i < 2; i ++) {
        std::unique_lock<std::mutex> lock(mtx); // 上锁
        cv.wait(lock, [&](){return lastout == 3;}); // 等待条件满足
        std::cout << 1 << std::endl;
        lastout = 1;
        cv.notify_all(); // 通知全局的阻塞等待
    }
}
void out2 () {
    for (int i = 0; i < 2; i ++) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [&](){return lastout == 1;});
        std::cout << 2 << std::endl;
        lastout = 2;
        cv.notify_all();
    }
}
void out3 () {
    for (int i = 0; i < 2; i ++) {
        std::unique_lock<std::mutex> lock(mtx);
        cv.wait(lock, [&](){return lastout == 2;});
        std::cout << 3 << std::endl;
        lastout = 3;
        cv.notify_all();
    }
}


int main () {
    std::thread th1(out1);
    std::thread th2(out2);
    std::thread th3(out3);

    th1.join();
    th2.join();
    th3.join();
}

/*
Output: 
1
2
3
1
2
3
*/
```

### 信号量

c++20 提供了另外一种更轻量高效的同步元件 `std::counting_semaphore` ，可以用 `acquire` 和 `release` 来完成阻塞和释放，有了阻塞和释放我们就能控制线程的交替
`std::counting_semaphore` 内部有一个计数器，当为 $0$ 的时候 `acquire` 进行阻塞，不为 $0$ 就将其减一，`release` 则是将计数器加一  
利用这个我们可以操作在执行第一个线程之前，将第一个计数器减一或者阻塞，当执行完后，令第二个线程计数器加一，来保证下一步第二个线程可以正常执行，第二三线程操作前后同理。  

```cpp
std::counting_semaphore sem1(1), sem2(0), sem3(0);

void out1 () {
    for (int i = 0; i < 2; i ++) {
        sem1.acquire(); 
        std::cout << 1 << std::endl;
        sem2.release();
    }
}
void out2 () {
    for (int i = 0; i < 2; i ++) {
        sem2.acquire();
        std::cout << 2 << std::endl;
        sem3.release();
    }
}
void out3 () {
    for (int i = 0; i < 2; i ++) {
        sem3.acquire();
        std::cout << 3 << std::endl;
        sem1.release();
    }
}


int main () {
    std::thread th1(out1);
    std::thread th2(out2);
    std::thread th3(out3);

    th1.join();
    th2.join();
    th3.join();
}
```
