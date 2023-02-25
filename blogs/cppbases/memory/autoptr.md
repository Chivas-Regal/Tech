---
title: 智能指针
---

## 问题

众所周知，在 c++ 内存管理里面有一大严重问题是内存泄漏，为了避免这种我们在 `new` 出来一个指针时一定要在局部代码退出时 `delete` 掉  
代码出现 bug 是正常的情况，尽管很小心，也容易出现这种情况：  

```cpp
void func (int msg) {
    int *a = new int(0);

    if (msg == 0) return;
    if (msg == 1) throw;

    delete a; 
}
```

上面两种终止情况我们都没有释放掉 `a` ，就导致了内存泄漏，那么我们如果能创造一种自动释放的指针呢？

## auto_ptr

想要自动释放，那么就利用析构的调用时间，在析构的时候释放  

```cpp
template<typename T>
class Auto_ptr {
private:
    T *m_ptr;
public:
    Auto_ptr (T* ptr = nullptr): 
        m_ptr(ptr)
    {}
    
    virtual ~Auto_ptr () {
        delete m_ptr;
    }
    T& operator *() {
        return *m_ptr;
    }
    T* operator ->() {
        return m_ptr;
    }
};
```

看起来很好，但存在问题

```cpp
int main () {
    {
        Auto_ptr<int> ptr1(new int(10));
        Auto_ptr<int> ptr2(ptr1);
    }
}
```

这样程序会崩溃因为 `res2` 对 `res1` 进行浅拷贝，两者保存的是同一块内存，释放两次会导致错误，在下面的时候也同理

```cpp
void func (Auto_ptr<int> ptr) {
    ...
}
int main () {
    {
        Auto_ptr<int> ptr1(new int(10));
        func(ptr1);
    }
}
```

那么如何进行修改呢，我们让指针的所有权只在一个对象上即可，那么就只需要做到拷贝和赋值运算符作用时是转移了指针的所有权

```cpp
template<typename T>
class Auto_ptr {
private:
    T *m_ptr;
public:
    Auto_ptr (T* ptr = nullptr): 
        m_ptr(ptr)
    {}
    
    virtual ~Auto_ptr () {
        delete m_ptr;
    }

    // 拷贝构造
    Auto_ptr (Auto_ptr& rhs) {
        m_ptr = rhs.m_ptr;
        rhs.m_ptr = nullptr;
    }
    // 赋值函数
    Auto_ptr& operator = (Auto_ptr &rhs) {
        if (&rhs == this) return *this;
        delete m_ptr;
        m_ptr = rhs.m_ptr;
        rhs.m_ptr = nullptr;
        return *this;
    }
    T& operator *() {
        return *m_ptr;
    }
    T* operator ->() {
        return m_ptr;
    }

    bool isNull() const {
        return m_ptr == nullptr;
    }
};
```

检查一下所有权是否正确

```cpp
int main () {
    {
        Auto_ptr<Resource> res1(new Resource());
        Auto_ptr<Resource> res2;
        std::cout << res1.isNull() << " " << res2.isNull() << std::endl;
        res2 = res1;
        std::cout << res1.isNull() << " " << res2.isNull() << std::endl;
    }
}

/*
Output:
1 0
0 1
*/
```

这就是对应的 `auto_ptr` 的大致原理，但是和我们的需求有点不一样是：
- 我们这里根本还是复制指针，且 `auto_ptr` 和 `STL` 是不兼容的，这种类型的复制很花时间    
- 在析构时调用的不是数组的，如果要释放动态分配的数组，那么这里可能会导致内存泄漏    
- 参数列表里面存在 `auto_ptr` ，在函数体内转移资源所有权，结束的时候释放资源，此时再解引用这个变量会导致程序崩溃

在 c++11 之后尽量不用 `auto_ptr`

## unique_ptr

对于上面的有一个改进，就是对深拷贝的函数的传递设置为只能右值传递，在转移右值时已经知道这里是转移对象所有权了，那么被传递的那个是指针变量是失效了   
下面是 `unique_ptr` 的大致原理 

```cpp
template<typename T>
class Unique_ptr {
private:
    T *m_ptr;
public:
    explicit Unique_ptr (T* ptr = nullptr):
        m_ptr(ptr)
    {}
    Unique_ptr (const Unique_ptr &rhs) noexcept = delete;
    Unique_ptr (Unique_ptr &&rhs):
        m_ptr(rhs.m_ptr) {
        rhs.m_ptr = nullptr;
    }
    virtual ~Unique_ptr () {
        delete m_ptr;
    }

    Unique_ptr &operator = (const Unique_ptr &rhs) noexcept = delete;
    Unique_ptr &operator = (Unique_ptr &&rhs) {
        if (this == &rhs) return *this;
        std::swap(m_ptr, rhs.m_ptr);
        return *this;
    }

    T &operator * () { return *m_ptr; }
    T *operator -> () { return m_ptr; }
    explicit operator bool() const {
        return this->m_ptr;
    }

    bool isNull () const {
        return m_ptr == nullptr;
    }
};
```

在实际使用中，支持下面几种初始化方式

```cpp
class Data {
private:
    int val1, val2;
public:
    Data (int _v1 = 1, int _v2 = 2):
        val1(_v1),
        val2(_v2) 
    {}
    ~Data () {}

    friend std::ostream &operator << (std::ostream &out, const Data &data) {
        out << data.val1 << " -- " << data.val2;
        return out;
    }
};

int main () {
    {
        std::unique_ptr<Data> ptr1(new Data(2, 3));
        std::cout << *ptr1 << std::endl;
        std::unique_ptr<Data> ptr2 = std::move(ptr1);
        std::cout << *ptr2 << std::endl;
        std::unique_ptr<Data> ptr3 = std::make_unique<Data>(3, 4);
        std::cout << *ptr3 << std::endl;;
        std::unique_ptr<Data[]> ptr4 = std::make_unique<Data[]>(4);
        std::cout << ptr4[0] << std::endl;
    }
}
/*
Output:
2 -- 3
2 -- 3
3 -- 4
1 -- 2
*/
```

它还支持修改默认的 `new` 和 `delete` 内容

```cpp
auto deleter = [](int *p) { // 释放的函数
    std::cout << "Ptr destory" << std::endl;
    free(p); 
};

int *p = (int*)malloc(sizeof(int));
*p = 10;

// 用新建的指针 p ，和写好的释放函数来 new 一个智能指针
std::cout << "Ptr create" << std::endl;
std::unique_ptr<int, decltype(deleter)> mySmartPtr(p, deleter); 

std::cout << *mySmartPtr << std::endl;
```

## shared_ptr

`unique_ptr` 支持一个指针资源被一个智能指针管理，而 `shared_ptr` 则是支持一个指针资源被多个智能指针管理，且在一个指针资源没有智能指针管理的时候，释放它  
简单使用看一下  

```cpp
int main () {
{
        std::shared_ptr<int> ptr1(new int(10));
        std::cout << ptr1.use_count() << std::endl; // 1
        {
            std::shared_ptr<int> ptr2 = ptr1;
            std::shared_ptr<int> ptr3;
            ptr3 = ptr2;
            std::cout << ptr1.use_count() << std::endl; // 3
            std::cout << ptr2.use_count() << std::endl; // 3
            std::cout << ptr3.use_count() << std::endl; // 3
        } 
        std::cout << ptr1.use_count() << std::endl; // 1
    }
}
```

这里就是说明我们可以实时监控到某个智能指针指向的资源被几个智能指针控制，但同时这样写又会出现问题

```cpp
int main () {
    int *val = new int;
    std::shared_ptr<int> ptr1(val);
    std::cout << ptr1.use_count() << std::endl; // 1
    {
        std::shared_ptr<int> ptr2(val);
        std::cout << ptr1.use_count() << std::endl; // 1
        std::cout << ptr2.use_count() << std::endl; // 1
    }
    std::cout << ptr1.use_count() << std::endl; // 1
}
```

发现我们这里 val 实际上被两个智能指针控制，但是分别获取数量发现都是只显示了一个智能指针控制，原因是 `shared_ptr` 会额外指向一个控制块用来计数有多少个连通的智能指针，两个智能指针在独立初始化时，控制块不同，且无法实现通信，就互相统计不上对方的存在  
  
由此我们可以得到结论，控制块只有在智能指针进行拷贝初始化时才会互相累计上，由于填入一个智能指针，所有同控制块的智能指针都会改变，这样我们大致可以猜到**控制块其实就是一个指针**  
- 在拷贝构造的时候将指针资源和控制块一起拷贝，并将控制块指向的计数变量加一
- 析构的时候控制块指向计数便是减一，同时在减到 $0$ 时要释放指针资源和控制块

众所周知 c++ 在多线程应用广泛，所以我们在给控制块做加减时必须要上锁，以免计数错误    
在自己实现一个简单的 `shared_ptr` 时，就有了三个成员变量：指针资源、控制块、互斥量，根据上面的说明，简单实现在这里

```cpp
template<typename T>
class Shared_ptr {
private:
    T *_pPtr; // 指针资源
    int *_pRefCount; // 控制块
    std::mutex *_pMutex; // 互斥量
private:
    void addRefCount () { // 加计数
        _pMutex->lock();
        ++(*_pRefCount);
        _pMutex->unlock();
    }
    void Release () { // 减计数
        bool isDelete = false;
        _pMutex->lock();
        if (--(*_pRefCount) == 0) { // 减到 0 了
            delete _pRefCount;
            delete _pPtr;
            isDelete = true;
        }
        _pMutex->unlock();
        if (isDelete) {
            delete _pMutex;
        }
    }

public:
    Shared_ptr (T* ptr = nullptr):
        _pPtr(ptr),
        _pRefCount(new int(1)),
        _pMutex(new std::mutex) 
    {}
    Shared_ptr (const Shared_ptr<T> &sp):
        _pPtr(sp._pPtr),
        _pRefCount(sp._pRefCount),
        _pMutex(sp._pMutex) {
        addRefCount();        
    }
    ~Shared_ptr () {
        Release();
    }

    int use_count () {
        return *_pRefCount;
    }
    T *Get () {
        return _pPtr;
    }

    T &operator * () {
        return *_pPtr;
    }
    T *operator -> () {
        return _pPtr;
    }
    Shared_ptr<T> &operator = (const Shared_ptr<T> &sp) {
        if (_pPtr != sp._pPtr) {
            Release(); // 原先的指针计数减一
            _pPtr = sp._pPtr;
            _pRefCount = sp._pRefCount;
            _pMutex = sp._pMutex;
            addRefCount(); // 现在的指针计数加一
        }
        return *this;
    }
};
```

看起来 `shared_ptr` 是不是已经很好用了，很万能了，别急，看看下面这种情况

```cpp
class Person {
private:
    std::string m_name;
    std::shared_ptr<Person> m_paterner;
public:
    Person (const std::string& name):
        m_name(name) {
            std::cout << m_name << " create" << std::endl;
    }
    virtual ~Person () {
        std::cout << m_name << " destoryed" << std::endl;
    }

    friend bool partnerUp (std::shared_ptr<Person> &p1, std::shared_ptr<Person> &p2) {
        if (!p1 || !p2) {
            return false;
        }
        p1->m_paterner = p2;
        p2->m_paterner = p1;
        std::cout << p1->m_name << " is now partenered with " << p2->m_name << std::endl;
        return true;
    }
};

int main () {
    {
        std::shared_ptr<Person> p1 = std::make_shared<Person>("chivas-regal");
        std::shared_ptr<Person> p2 = std::make_shared<Person>("demo");
        partnerUp(p1, p2);
    }
}
/*
Output:
chivas-regal create
demo create
chivas-regal is now partenered with demo
*/
```

会发现，删除不见了...？  
其实就是在 $p1$ 里面调用了 $p2$ 作为伙伴， $p2$ 里面调用了 $p1$ 作为伙伴，要释放的时候两个指针资源由于都有被调用的存在故控制块不会变成 $0$ 。  
换句话说，要析构的话计数变量要为 $0$ ，要析构 $p1$ 时 $p2$ 内部有 $p1$ ，析构不了，反之也一样析构不了  
那么我们有没有什么方法来解决这种情况，即可以使用一个不会对控制块的值有影响的东西，那么就是下面的这种智能指针

## weak_ptr

和 `shared_ptr` 基本使用一致，唯一不同的就是不会影响控制块的值，故上面的代码修改成这样就可以了 

```cpp
class Person {
private:
    std::string m_name;
    std::weak_ptr<Person> m_paterner;
...

/*
Output:
chivas-regal create
demo create
chivas-regal is now partenered with demo
demo destoryed
chivas-regal destoryed
*/
```

这样的输出就是正常的了