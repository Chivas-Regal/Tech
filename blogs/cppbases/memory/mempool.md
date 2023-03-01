---
title: 内存池
---


## 结构

### 内存块

内存多次少量申请要用到非常多次 `malloc` ，十分占用性能，我们可以设计一种工具提高性能  
既然多次少量占用性能，我们少量多次分配内存，也就是在这个工具里面每次申请一大块内存，当别的封装好的类每次要 `new` 一个对象的时候，就从这个工具里面请求它申请好的内存中的一小块  
这样就减少了 `malloc` 的次数    
这个工具是内存池，里面有多个内存块，每一个内存块都是一次 `malloc/new` 申请的一组连续地址，内存块内是几个连续的内存单元（内存单元的大小需要我们在构造时提前声明好）  
我们要保证内存块存在连接性，对内存块进行链表式连接  

### 空闲链表

但是这只是申请的时候，那在析构的时候，这个对象的地址如果直接传回给工具内旧的内存块或者直接释放掉，前者是不好用到，后者在之后会重新使用一次 `malloc` ，什么意思呢
- 传回到旧的内存块，这样就使得这个工具内的每一个连续大内存块，都有部分是空闲的有部分是占用的，如果我们想用那些空闲部分则需要重新记录，就提高了这个工具内的空间复杂度
- 直接释放掉，明明这个地址还可以再拿来用，这里直接释放掉就有点浪费了

这里给出一种方法：在池内定义一个**空闲链表，将内存池中所有的空闲内存单元串起来**  
构造时在工具内申请空间的对象在析构时，把自己的地址用头插放在链表内  
这样在需要重新使用的时候可以用头取来获得一个空闲地址

## 组成

### 成员变量

- 内存块
  - 结构体
  - 首元素
- 空闲链表
  - 结构体
  - 首元素

```cpp
// 内存单元大小、一个内存块中内存单元的个数
template<int ObjectSize, int NumofObjects = 20>
class MemPool {
public:
    using mem_units = bool; // 单位内存1

    MemPool ();
    MemPool (const MemPool<ObjectSize, NumofObjects>&);
    ~MemPool ();

    void* allocate(); // 分配内存
    void deallocate(void *); // 收回内存
private:
    // 空闲链表
    struct FreeNode {
        FreeNode *pNext;
        mem_units mem[ObjectSize];
    };
    FreeNode* FreeNodeHeader;
    // 内存块
    struct MemBlock {
        MemBlock *pNext;
        FreeNode mem[NumofObjects];
    };
    MemBlock* MemBlockHeader;
};
```

### 构造函数（申请内存）  

这就是一个简单的初始化，将两个首元素设置为空就行

```cpp
template<int ObjectSize, int NumofObjects>
MemPool<ObjectSize, NumofObjects>::MemPool():
    FreeNodeHeader(nullptr),
    MemBlockHeader(nullptr)
{}

template<int ObjectSize, int NumofObjects>
MemPool<ObjectSize, NumofObjects>::MemPool(const MemPool<ObjectSize, NumofObjects> &memp):
    FreeNodeHeader(nullptr),
    MemBlockHeader(nullptr)
{}
```

### 析构（将内存还给操作系统）

将所有的内存块都 `delete` 掉，释放内存  

```cpp
template<int ObjectSize, int NumofObjects>
MemPool<ObjectSize, NumofObjects>::~MemPool() {
    while (MemBlockHeader) {
        MemBlock *nxt = MemBlockHeader->pNext;
        delete MemBlockHeader;
        MemBlockHeader = nxt;
    }
}
```

### 分配内存（被申请内存时调用）

这里就是首先要看空闲链表中是否为空，如果不为空那么我们可以从这里提出来一个元素就行了  
否则说明内存都满了，我们重新申请一个内存块  
然后就是正常的连接，新内存块的所有内存单元都是空闲，就将它们自己连接后，接到空闲链表首元素中

```cpp
template<int ObjectSize, int NumofObjects>
void* MemPool<ObjectSize, NumofObjects>::allocate() {
    if (FreeNodeHeader == nullptr) { // 满了
        MemBlock *newBlock = new MemBlock; // 重新申请内存块
        // 连接空闲链表
        FreeNodeHeader = &newBlock->mem[0];
        for (int i = 1; i < NumofObjects; i ++) {
            newBlock->mem[i - 1].pNext = &newBlock->mem[i];
        }
        newBlock->mem[NumofObjects - 1].pNext = nullptr;
        // 内存块链表首元素前置
        newBlock->pNext = MemBlockHeader;
        MemBlockHeader = newBlock;
    }
    // 提出空闲链表第一个元素
    void* ret = FreeNodeHeader;
    FreeNodeHeader = FreeNodeHeader->pNext;
    return ret;
}
```

### 收回内存（对象释放内存时内存池收回）

这一步不需要对内存块做什么修改，就是多了一个空闲内存单元，将其头插入空闲链表

```cpp
template<int ObjectSize, int NumofObjects>
void MemPool<ObjectSize, NumofObjects>::deallocate(void *ptr) {
    reinterpret_cast<FreeNode*>(ptr)->pNext = FreeNodeHeader;
    FreeNodeHeader = reinterpret_cast<FreeNode*>(ptr);
}
```

## 测试 & 使用

好了这个类已经简单完成了，我们测试一下是否可以

```cpp
class MyObject {
private:
    int val;
public:
    MyObject (int _v = 0) : val(_v) {}
    void* operator new (size_t size);
    void operator delete (void *ptr);
};

MemPool<sizeof(MyObject)> mem_pool; 
void* MyObject::operator new(size_t size) {
    return mem_pool.allocate();
}
void MyObject::operator delete(void *ptr) {
    mem_pool.deallocate(ptr);
}

int main () {
    std::vector<MyObject*> v;
    for (int i = 0; i < 4; i ++) {
        v.push_back(new MyObject(2));
    }
    for (int i = 0; i < 4; i ++) {
        MyObject *ob = new MyObject(1);
        delete ob;   
    }
    for (int i = 0; i < 4; i ++) {
        delete v[i];
    }
}
```

可以看出来这就是一个申请四次、申请释放四次、释放四次，检查一下是否有内存泄漏

```cpp
$ g++ MemPool.cpp main.cpp -o main
$ valgrind --tool=memcheck ./main --leak-check=full

/*
Output:
==2478433== Memcheck, a memory error detector
==2478433== Copyright (C) 2002-2017, and GNU GPL'd, by Julian Seward et al.
==2478433== Using Valgrind-3.18.1 and LibVEX; rerun with -h for copyright info
==2478433== Command: ./main --leak-check=fuul
==2478433== 
==2478433== 
==2478433== HEAP SUMMARY:
==2478433==     in use at exit: 0 bytes in 0 blocks
==2478433==   total heap usage: 5 allocs, 5 frees, 73,088 bytes allocated
==2478433== 
==2478433== All heap blocks were freed -- no leaks are possible
==2478433== 
==2478433== For lists of detected and suppressed errors, rerun with: -s
==2478433== ERROR SUMMARY: 0 errors from 0 contexts (suppressed: 0 from 0)
*/
```

好的没有问题，结束