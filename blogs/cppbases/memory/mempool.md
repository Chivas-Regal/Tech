---
title: 内存池
---

内存多次少量申请要用到非常多次 `malloc` ，十分占用性能，我们可以设计一种工具提高性能  
既然多次少量占用性能，我们少量多次分配内存，也就是在这个工具里面每次申请一大块内存，当别的封装好的类每次要 `new` 一个对象的时候，就从这个工具里面请求它申请好的内存中的一小块  
这样就减少了 `malloc` 的次数  
  
但是这只是申请的时候，那在析构的时候，这个对象的地址如果直接传回给工具内旧的内存块或者直接释放掉，前者是不好用到，后者在之后会重新使用一次 `malloc` ，什么意思呢
- 传回到旧的内存块，这样就使得这个工具内的每一个连续大内存块，都有部分是空闲的有部分是占用的，如果我们想用那些空闲部分则需要重新记录，就提高了这个工具内的空间复杂度
- 直接释放掉，明明这个地址还可以再拿来用，这里直接释放掉就有点浪费了

这里给出一种方法：在工具内定义一个链表，构造时在工具内申请空间的对象在析构时，把自己的地址用头插放在链表内  
这样在需要重新使用的时候可以用头取来获得一个空闲地址

## 成员变量

- 内存块（顺序）
  - 起始地址
  - 使用量
  - 最大可用量
- 释放进入的链表
  - 结构体（只有 `next`）
  - 首元素

```cpp
// 内存块
mem_units *blockStartPtr;
int blockCountUsed, blockSize;

// 释放进入的链表
struct freeListNode {
    freeListNode *next;
};
freeListNode *freeListHead;
```

## 构造函数（申请内存）  

这就是一个简单的初始化，可以根据我们传入参数也就是我们需要一次性内存块的大小，来让以后的连续内存块都这么大  
但是分配内存还有讲究，我们如果就是分配每个单元是 `int` 类型的内存块，一个单元就是 $4$ 字节，这样很容易造成分配不好导致的浪费，而为了让内存池的内存具有原子性，它可以每一个单元都是 $1$ 字节，这样的数据类型有 `bool`  

所以我们先 `using mem_units = bool;` ，然后

```cpp
MemPool::MemPool():
    blockSize(4),
    blockStartPtr(reinterpret_cast<mem_units*>(malloc(blockSize))),
    blockCountUsed(0),
    freeListHead(nullptr)
{}

MemPool::MemPool(int maxSize):
    blockSize(maxSize * 4),
    blockStartPtr(reinterpret_cast<mem_units*>(malloc(blockSize))),
    blockCountUsed(0),
    freeListHead(nullptr)
{}

MemPool::MemPool(const MemPool &memp):
    blockStartPtr(memp.blockStartPtr),
    blockCountUsed(memp.blockCountUsed),
    blockSize(memp.blockSize),
    freeListHead(memp.freeListHead)
{}
```

## 析构（将内存还给操作系统）

虽然我们有两套地址，一个是申请的内存块一个是被归还内存的链表，但是我们要释放的地址全部都在链表内  
因为使用内存池内存的变量，一定是在内存池创建之后创建，在内存池析构之前析构，不然如果内存池析构了这个指针还存在，它就会成为野指针
既然这样，我们把链表内的所有节点 `free` 掉即可 


```cpp
MemPool::~MemPool() {
    while (freeListHead) {
        freeListNode *nxt = freeListHead->next;
        free(freeListHead);
        freeListHead = nxt;
    }
}
```

## 分配内存（被申请内存时调用）

这里就是首先要看链表中是否为空，如果不为空那么我们可以从这里提