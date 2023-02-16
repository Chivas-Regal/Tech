---
title: 线程定义与初使用
---

## 什么是线程

线程是一个同一程序片段的并发执行，多线程程序可以同时运行两个以上的部分。  

**优点：**  
- 更轻量，创建代价小，切换线程以及线程占用资源都较少
- 可以边等 I/O 操作边进行其他操作，也可以等待不同的 I/O 操作
- 能充分利用多处理器的可并行数量

**缺点：**  
- 计算密集型线程的数量大于处理器数量时会很耗费性能
- 线程之间缺乏保护，变量的共享可能会导致程序崩溃
- 缺乏访问控制，一个线程使用了某些 OS 函数可能会对整个进程产生影响

## pthread

### 创建线程

位于 `#include <pthread.h>` 中，在创建时使用函数  

```cpp
int pthread_create (
    pthread_t *thread,          // 指向线程标识符的指针 
    const pthread_attr_t *attr, // 不透明的线程属性对象，可以为 NULL
    void *start_routine,        // 线程运行的起始函数地址
    void *arg                   // 向函数中传入的参数
) // 返回 0 表示成功，否则失败
```

终止的时候使用 

```cpp
pthread_exit(status) // 显式退出一个线程
```  
 
下面看看如何使用 `pthread` 来编写一个多线程程序  

端详一下 `pthread_create` 函数，我们最后是传入了一个任意类型参数，所以我们先声明一个要往线程传入的参数的类  
  
```cpp
class Thread_data {
private:
    char *val; // 传入的信息
    int id;    // 线程的编号
public:
    // 下面就是构造和获取的方法
    Thread_data (): val(0), id(0) {}
    Thread_data (char *_val, int _id): val(_val), id(_id) {}
    ~Thread_data () {}
    char *getVal () { return val; }
    int getId () { return id; }
};
```
然后在 `main` 函数里面定义好线程和设置好这个类的信息

```cpp
int main () {
    pthread_t threads[NUM_THREADS];
    Thread_data td[NUM_THREADS];

    for (int i = 0; i < NUM_THREADS; i ++) {
        td[i] = Thread_data("this is a message", 10);
    }

    pthread_exit(NULL);
}
```

由于我们的线程创建里面还有一个是入口函数，所以我们要写好这个入口函数

```cpp
void *threadWork (void *threadArg) { // 参数为向这个线程内传入的信息
    Thread_data *myData = (Thread_data*)threadArg; // 更改一下格式
    // 输出传入的信息
    std::cout << "Thread id: " << myData->getId() << std::endl;
    std::cout << "Thread val: " << myData->getVal() << std::endl;
    pthread_exit(NULL);
}
```
都有了，就可以使用这个线程了  

```cpp
int main () {
    pthread_t threads[NUM_THREADS];
    Thread_data td[NUM_THREADS];

    for (int i = 0; i < NUM_THREADS; i ++) {
        // 准备创建了
        std::cout << "main(): creating thread, " << i << std::endl;
        // 设置好向此线程内传入的信息
        td[i] = Thread_data("this is a message", i);
        // 创建线程
        int rc = pthread_create(&threads[i], NULL, threadWork, (void*)&td[i]);
        if (rc) { // 不为 0 ，创建失败了
            std::cout << "Error: unable to create thread, " << rc << std::endl;
            exit(-1);
        }
    }

    pthread_exit(NULL);
}
```

编译运行一下看看  

```
$ g++ -Wno-write-strings main.cpp -lpthread -o main && ./main

main(): creating thread, 0
main(): creating thread, 1
Thread id: 0
Thread val: this is a message
main(): creating thread, 2
Thread id: 1
Thread val: this is a message
main(): creating thread, 3
Thread id: 2
Thread val: this is a message
main(): creating thread, 4
Thread id: 3
Thread val: this is a message
Thread id: 4
Thread val: this is a message
```

### 线程连接 
  
`pthread_join` 是一个子程序阻碍调用程序，可以试想如果主线程结束子线程的创建，并且需要用到之前所有子线程返回的数据，但是有的子线程还没有走完，那么会导致调用不到。  
此时我们使用这个函数来阻塞等待子线程结束，再进行下一步  
  
例如在没有加这个函数时，看一下输出是什么样的  

```cpp
#define NUM_THREADS 5

int count = 0;

void *threadWork (void *threadArg) {
    for (int i = 0; i < 5; i ++) {
        std::cout << "Count in thread is: " << i << std::endl;
        count ++;
        sleep(1);
    }
}

int main () {
    pthread_t thread;
    
    std::cout << "pthread creating ..." << std::endl;
    int rc = pthread_create(&thread, NULL, threadWork, NULL);
    if (rc) {
        std::cout << "pthread create error: " << rc << std::endl;
        exit(0);
    }

    std::cout << count << std::endl;
    
    pthread_exit(NULL);
}
/*
Output: 

pthread creating ...
0
Count in thread is: 0
Count in thread is: 1
Count in thread is: 2
Count in thread is: 3
Count in thread is: 4
*/
```

发现 `count` 还没有在子线程里面进行自加就已经被主线程输出出来了  
我们如果将主线程进行连接阻塞，也就是写成这样，再看一下输出  

```cpp
int main () {
    pthread_t thread;
    pthread_attr_t attr;
    int rc;
    // 初始化并设置线程为可连接
    pthread_attr_init(&attr);
    pthread_attr_setdetachstate(&attr, PTHREAD_CREATE_JOINABLE);
    std::cout << "pthread creating ..." << std::endl;
    rc = pthread_create(&thread, NULL, threadWork, NULL);
    if (rc) {
        std::cout << "pthread create error: " << rc << std::endl;
        exit(-1);
    }
    pthread_attr_destroy(&attr); // 删除属性并等待其他线程
    void *status;
    rc = pthread_join(thread, &status);
    if (rc) {
        std::cout << "join error: " << rc << std::endl;
        exit(-1);
    }
    std::cout << "Main: completed thread" << std::endl;
    std::cout << "exiting with status: " << status << std::endl;

    std::cout << count << std::endl;
    
    pthread_exit(NULL);
}

/*
Output:

pthread creating ...
Count in thread is: 0
Count in thread is: 1
Count in thread is: 2
Count in thread is: 3
Count in thread is: 4
Main: completed thread
exiting with status: 0x0
5
*/
```

发现在等待线程结束后主函数成功获取到了数据再进行输出

## std::thread

一个 C++11 后添加的新标准库，构造函数为  
`std::thread thread_object(callable)`
可调用有 函数指针、函数对象、lambda表达式

```cpp
void function1 (int x) {}

class function2 {
    void operator() (int x) {}
};

int main () {
    auto function3 = [&](int x) {};

    std::thread th1(function1, 1);
    std::thread th2(function2(), 2);
    std::thread th3(function3, 3);
}
```

当然前文提到的分离连接，这里也都可以使用  

`th1.join()` 来等待线程 `th1` 的结束

例如如下代码  
 
```cpp
void threadWork (int id, std::string msg) {
    std::cout << "message from thread " << id << std::endl << msg << std::endl;
}

int main () {
    std::thread threads[NUM_THREADS];
    for (int i = 0; i < NUM_THREADS; i ++) {
        threads[i] = std::thread(threadWork, i, "hello thread(" + std::to_string(i) + ")!");
    }
    for (int i = 0; i < NUM_THREADS; i ++) {
        threads[i].join();
    }
}

/*
$ g++ main.cpp -o main -std=c++11

Output:
message from thread 0
hello thread(0)!
message from thread 3
hello thread(3)!
message from thread 4
hello thread(4)!
message from thread 1
hello thread(1)!
message from thread 2
hello thread(2)!
*/
```

## 耗时

纯循环下的代码  

```cpp
#define NUM_THREAD 10000
for (long long i = 0; i < (long long)NUM_THREAD * 100000; i ++);
```

花费时间在 $2.1s$ 左右  

多线程代码  

```cpp
# define NUM_THREAD 10000

void roll () {
    for (int i = 0; i < 100000; i ++);
}

std::thread th[NUM_THREAD];
for (int i = 0; i < NUM_THREAD; i ++) {
    th[i] = std::thread(roll);
}   
for (int i = 0; i < NUM_THREAD; i ++) {
    th[i].join();
}
```

花费时间在 $1s$ 左右，效率提高了很多，放在更大的运算量下会提升更多

## 后话

其实我们都会发现其实输出有的时候是乱序的或者混行了，这是因为 `std::cout` 不是一个原子操作，会导致缓冲区刷新不及时从而输出混乱，这个我们 [下一篇--锁](./mutex.html) 再讲