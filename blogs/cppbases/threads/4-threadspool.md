---
title: 线程池
---
## 简介

线程池是由多个线程组成的一个处理高并发事务的工具，所有线程均不会结束，直到这个线程池关闭（此状态为了防止高并发修改混乱，采用原子 `atomic` 操作）。  
高并发指的是任务，当出现一个任务要去做的时候，用线程池中的一个空闲线程去处理此任务。  
  
任务的完成要讲公平，比如你先提交了一个那就必然是你先得到了一个结果，这里也一样，而这种数据结构就是队列。    
STL 操作步骤很多，在高并发下容易混乱，所以这里在操作队列的时候上个锁    
线程池并不是都会一直忙碌，所以当等到有任务时再提队首，这个等和结束等待可以使用信号量，计数为任务数即可，`sem_wait()` 等到信号量不为 $0$ 时减一并结束阻塞  

故成员变量有下面几种    

- 线程池 `std::vector<std::thread> tpool;`
- 线程池状态 `std::atomic<bool> running;`
- 任务队列 `std::queue<std::function<void()>> tasks;`
  - 访问锁 `std::mutex mutexTask;`
  - 任务量 `sem_t semTask;`

## 任务提交

任务提交对应的就是入队操作，由于任务的多样性我们不知道它的参数是什么，返回值是什么，故这里使用推导模板表示任务，即  


```cpp
template<class F, class Args>
auto commit (F &&f, Args &&...args) -> std::future<decltype(func(args...))> {
    ...
}
```

这里 `F` 是函数类型，`Args` 是参数类型    
`commit(F &&func, Args &&...args)` 代表传入一个函数以及其参数列表    
返回值使用 `decltype(func(args...))` 意味着直接从具体的函数内推导    

为了返回值的获取，这里使用 `future` 来等待任务结束   
任务的开始时间和任务的定义时间不同，所以我们用 `package_task` 来先做任务的定义并先拿到 `future`    

相当于用一个 `package_task` 内置类型为 `decltype(func(args...))()` ，外面套一层智能指针以便传 lambda  

```cpp
... commit () ... {
    using retType = decltype(func(args...)); // 为了好写，定义一下返回值的类型
    if (!running) { 
        return std::future<retType>();
    }
    // 直接和参数绑定起来，使得所有任务都是无参数可直接运行的 function<void()>
    auto task = std::make_shared<std::packaged_task<retType()>>(std::bind(std::forward<F>(func), std::forward<Args>(args)...));
    std::future<retType> ret = task->get_future();
    {
        std::lock_guard<std::mutex> lock(mutexTask);
        tasks.emplace([task]{ (*task)(); }); // 此任务就是运行函数 (*task)
        sem_post(&semTask); // 任务数++
    }
    return ret;
}
```

## 线程池生成（构造函数）

主要就是尽量多跑点线程，获取一下 cpu 数量 `cpuNumber`    
开 `cpuNumber` 个线程，让每一个线程直接进入到线程池的工作函数 `threadWork` 中（下面就是工作函数   

```cpp
ThreadsPool (): running(true) {
    sem_init(&semTask, false, 0);
    int cpuNumber = sysconf(_SC_NPROCESSORS_CONF);
    for (int i = 0; i < cpuNumber; i ++) {
        tpool.push_back(std::thread(&ThreadsPool::threadWork, this));
    }
}
```

## 线程工作函数

首先这个线程不能自主停止，故外面有一层无限循环   
在循环内就是每一次执行任务的过程，先要等待一个任务的出现并将其抢走，也就是对信号量 `sem_wait(&semTask)`   
等待结束后在锁之下提出来一个任务，然后关锁并执行任务（这里一定要关锁，不然在锁之下执行任务就会让任务串行   

```cpp
void threadWork() {
    while (true) {
        sem_wait(&semTask); // 等待任务出现
        if (!running) break;

        std::function<void()> task; // 待执行任务
        {
            std::lock_guard<std::mutex> lock(mutexTask);
            task = tasks.front();
            tasks.pop();
        }
        task();
    }
}
```

而这种信号量等待也说明了我们在构造函数中应该先 `sem_init` ，否则可能未初始化导致存在信号，会直接进入循环提不存在的队首   

## 线程池销毁（析构函数）

首先让所有的线程走完，即先设置 `running = false` ，然后给线程个数个信号量使得不存在阻塞中的线程   
让他们都不阻塞地退出无限循环，并且在主线程中都 `join()` 一遍   
结束后给信号量销毁   

```cpp
~ThreadsPool() {
    running = false;
    for (int i = 0; i < tpool.size(); i ++) {
        sem_post(&semTask); // 信号量 ++
    }
    for (std::thread &th : tpool) {
        th.join(); // 等待结束
    }
    sem_destroy(&semTask); // 销毁信号量
}
```

## 整体代码

```cpp
/* ThreadsPool.h */
#pragma once

#include <mutex>
#include <thread>
#include <queue>
#include <semaphore.h>
#include <future>
#include <atomic>
#include <functional>


class ThreadsPool {
private:
    std::vector<std::thread> tpool;
  
    std::queue<std::function<void()>> tasks;
    std::mutex mutexTask;
    sem_t semTask;
  
    std::atomic<bool> running;

public:
    ThreadsPool ();
    ~ThreadsPool ();

    template<class F, class ...Args>
    auto commit (F &&func, Args &&...args) -> std::future<decltype(func(args...))> {
        using retType = decltype(func(args...));
        if (!running) {
            return std::future<retType>();
        }
      
        auto task = std::make_shared<std::packaged_task<retType()>>(std::bind(std::forward<F>(func), std::forward<Args>(args)...));
        std::future<retType> ret = task->get_future();
        {
            std::lock_guard<std::mutex> lock(mutexTask);
            tasks.emplace([task]{ (*task)(); });
            sem_post(&semTask);
        }
      
        return ret;
    }

    void threadWork ();
};
```

```cpp
/* ThreadPool.cpp */
#include "ThreadsPool.h"
#include <unistd.h>
#include <iostream>

ThreadsPool::ThreadsPool (): running(true) {
    sem_init(&semTask, false, 0);
    int cpuNumber = sysconf(_SC_NPROCESSORS_CONF);
    for (int i = 0; i < cpuNumber; i ++) {
        tpool.push_back(std::thread(&ThreadsPool::threadWork, this));
    }
}

ThreadsPool::~ThreadsPool() {
    running = false;
    for (int i = 0; i < tpool.size(); i ++) {
        sem_post(&semTask);
    }
    for (std::thread &th : tpool) {
        th.join();
    }
    sem_destroy(&semTask);
}

void ThreadsPool::threadWork() {
    while (true) {
        sem_wait(&semTask);
        if (!running) break;

        std::function<void()> task;
        {
            std::lock_guard<std::mutex> lock(mutexTask);
            task = tasks.front();
            tasks.pop();

        }
        task();
    }
}
```

## 使用

```cpp
/* main.cpp */
#include "ThreadsPool.h"
#include <iostream>

std::mutex mtx; // 为了让输出原子化更好看的锁

int func (int a, int b) { // 一个任务函数
    mtx.lock();
        std::cout << "func " << a << " started\n";
    mtx.unlock();

    int sum = 0;
    std::this_thread::sleep_for(std::chrono::seconds(3));
    for (int i = a; i < b; i ++) {
        sum += i;
    }
    mtx.lock();
        std::cout << "func " << a << " end\n";
    mtx.unlock();
  
    return sum;
}

int main () {
    std::vector<std::future<decltype(func(1,1))> > ret;

    ThreadsPool threads_pool;
    for (int i = 0; i <= 10; i ++) {
        ret.push_back(threads_pool.commit(std::move(func), i, i + 10)); // 提交任务
    }

    for (int i = 0; i < ret.size(); i ++) {
        std::cout << ret[i].get() << std::endl;
    }

    return 0;
}
```

这里 `ret[i].get()` 的值是都能获得，为了易读我们只看一些 `func` 的输出   

由于我这里虚拟机开了 $4$ 个 cpu，线程也就是 $4$ 个   
第一波输出为：   

```
func 0 started
func 1 started
func 2 started
func 3 started
```

也就是四个线程调用了 $4$ 个任务，同时他们除了睡眠 $3s$ 外没什么误差时间，故它们几乎一起结束任务并几乎一起提出来接下来四个任务   

```
func 0 end
func 4 started
func 1 end
func 5 started
func 3 end
func 6 started
func 2 end
func 7 started
```

然后同样的又是 $4$ 个任务结束，但是只剩 $2$ 个任务了，它们两个被两个线程开启   

```
func 7 end
func 5 end
func 9 started
func 8 started
func 6 end
func 10 started
func 4 end
func 9 end
```

最后是把最后开启的两个任务结束之后，程序结束   

```
func 8 end
func 10 end
```

这么写是一种比较万能的写法，可以获取或不获取返回值，可以使用任意类型参数（但是这里由于 `bind` 的传值特性不能传引用，不过可以使用指针   
