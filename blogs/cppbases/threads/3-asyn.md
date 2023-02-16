---
title: 异步
---

## 异步接口

- `std::future` 异步指向某个任务，然后用 `future` 特性来获取该函数返回值
- `std::async` 异步运行某个任务函数
- `std::promise` 一个线程设置了某个值然后通知别的线程
- `std::package_task` 和 `future` 和任务绑定在一起的模板，是一种对任务的封装

## std::future

`future` 指向一个任务，当任务结束它获取到值了可以进行提取，在需要得到返回值的时候使用 `future.get()` 
  - 如果任务已经运行结束，那么会直接获取到其返回值
  - 如果任务还在运行中，会进行阻塞直到函数运行结束  

下面的几种创建方法可以看到其正常用法，我们这里自己实现一种功能，别的都很像比如什么 `get` 阻塞，但是任务我们替换成可以手动给予的值，当手动给予值了 `get` 非阻塞   
思考到阻塞可以用锁来实现，于是我们定义一个类在初始化的时候是锁的， `get` 也是锁的，这样只要这个类不解锁那么 `get` 一直阻塞，解锁的时候也就是赋予值的时候  

```cpp
template<typename T>
class Future {
private:
    std::mutex mtx;
    T value;
public:
    Future () {
        mtx.lock(); // 初始化，上锁
    }
    void set (int x) { // 给值，解锁
        mtx.unlock();
        value = x;
    }
    T get () { // 获取值
        std::cout << "in get(lock)\n";
        mtx.lock(); // 在获取之前阻塞锁
        std::cout << "in get(unlock)\n";
        return value;
    }
};
void func (Future<int> &fu) {
    std::cout << fu.get() << std::endl;
}
int main () {
    Future<int> fu;
    std::thread th(std::move(func), std::ref(fu));

    std::this_thread::sleep_for(std::chrono::seconds(2));
    std::cout << "end sleep\n";
    fu.set(20);

    th.join();
}

/*
Output:
in get(lock)
end sleep
in get(unlock)
20
*/
```
 
## std::async

- 在不需要立即得到结果的时候创建一个 `future` ，其指向的函数**立刻**开始运行（开启一个线程）
- `std::future` 是一次性的，也就是说不能对一个 `future` 对象使用两次 `get`  
- 这个新创建的线程在运行结束时就算还没有被调用结果，但它已经结束了，返回值会单独存起来
    
通常用在异步调用需要同步，或者后一个异步要用到前一个异步时  
效果：  

```cpp
int add (int a, int b) {
    std::cout << "in add function" << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(2));
    return a + b;
}

int main () {
    std::future<int> fu = std::async(add, 1, 2);
    
    std::cout << "in main\n";
    std::cout << fu.get() << std::endl;
}
```

这里在输出 `in main` 后等了一会儿才输出 $3$ ，因为子线程有两秒，主线程的 `get` 被阻塞直到这两秒结束获取到了值，才会得到 $3$  

```cpp
int add (int a, int b) {
    std::cout << "in add function" << std::endl;
    std::this_thread::sleep_for(std::chrono::seconds(2));
    return a + b;
}

int main () {
    std::future<int> fu = std::async(add, 1, 2);
    
    std::cout << "in main sleep\n";
    std::this_thread::sleep_for(std::chrono::seconds(3));
    std::cout << "end main sleep\n";
    std::cout << fu.get() << std::endl;
}
```

这样会在输出 `end main sleep` 后迅速输出 $3$ ，是因为在主线程沉睡的三秒内，子线程已经获取到结果了，主线程醒了之后直接调用 `get` 即可获得  
  
这里当然有更简便的写法，在之前新特性中我们介绍了 `auto` 和 `decltype` ，这里就可以使用它们来定义 `future` 对象    

```cpp
int addAB (int a, int b) { return a + b; }
int main () {
    std::future<int> fu1 = std::async(addAB, 1, 2);
    std::future<decltype(addAB(1, 2))> fu2 = std::async(addAB, 1, 2);
    auto fu3 = std::async(addAB, 1, 2);
    std::cout << fu1.get() << " " << fu2.get() << " " << fu3.get() << std::endl;
}
/*
Output:
3 3 3
*/
```

## std::packaged_task

`packaged_task` 是一种包装，它内有两个基本元素：
- 被包装的任务：一个可调用对象
- 共享状态：保存任务的返回值，可以通过 `furture` 异步获取

一般是一个线程进行这个任务，另一个线程获取任务的返回值，至于阻不阻塞就看获取的时候任务是否结束了  

```cpp
int countdown (int from, int to) {
    for (int i = from; i >= to; i --) {
        std::cout << i << std::endl;
        std::this_thread::sleep_for(std::chrono::seconds(1));
    }
    std::cout << "Finished!" << std::endl;
    return from - to;
}

int main () {
    std::packaged_task<int(int, int)> task(countdown); // 设置 package_task
    std::future<int> ret = task.get_future(); // 获取共享状态关联的 future 对象

    std::thread th(std::move(task), 3, 0); // 注：这里才开始进行 task 任务：计数

    int value = ret.get(); // 阻塞等待结果

    std::cout << "The countdown lasted for " << value << " seconds\n";
    th.join();
}
/*
Output:
3
2
1
0
Finished!
The countdown lasted for 10 seconds
*/
```

由于我们调用执行任务的时候，`task(3, 0)` 和 `countdown(3, 0)` 一样，且任务的开始执行时间是分离出来的，所以会更灵活一些  
这就是和 `async` 创建 `future` 的区别，`async` 创建的时候就直接执行了，而这里我们可以控制开始执行的时间  

## std::promise

`promise` 可以直接给它所包含的 `future` 传值，而不需要什么函数返回  
然后再 `future.get` 的时候是否阻塞就可以取决于这个 `future` 是否 "ready" 

这个 "ready" 的设置时间有两个函数  

- `promise<T>::set_value(T x)` 直接传值，同时立即设置为 "ready"
- `promise<T>::set_value_at_thread_exit(T x)` 直接传值，但在其所在线程结束后再设置为 "ready"  

试验一下：      
  
```cpp
void funcGet (std::future<int> fu) {
    std::cout << fu.get() << std::endl;
}
void funcWork (std::promise<int> &p) {
    p.set_value(10);
    std::this_thread::sleep_for(std::chrono::seconds(3));
}

int main () {
    std::promise<int> p;
    std::thread thGet(std::move(funcGet), p.get_future());
    std::thread thWork(std::move(funcWork), std::ref(p));

    thGet.join(); thWork.join();
}
```

这份代码就是两个线程一个立即传值一个立即发现 `fu` 已经 "ready" 了，然后输出 $10$ ，然后是其中一个线程进行睡眠，主线程等待  

然后将第五行的 `set_value` 换成 `set_value_at_thread_exit` 看看，即  

```cpp
...
void funcWork (std::promise<int> &p) {
    p.set_value_at_thread_exit(10);
    std::this_thread::sleep_for(std::chrono::seconds(3));
}
...
```
这里就等了 $3s$ 才输出 $10$ ，这就是 `thWork` 线程睡了三秒结束之后 `fu` 才 "ready"，所以会晚一点    

这么做可以阻塞别的线程，做到控制线程执行顺序和控制资源共享