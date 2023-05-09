---
title: 指针强制类型转换时地址的变化？
---

在编写内存池时由于涉及到几个问题
- 申请好的连续 $4$ 个 `int` 数组如果用来存放 `long long` 只能放 $2$ 个
- 一个以 $4$ 字节类型指针当 `void*` 传给一个 $8$ 字节类型指针，后者修改，前者可能不等于它

这样两个问题，引发了对类型转换下地址的思考  

其实也有一些眉目，因为两者在输出时首地址相同：  

```cpp
int16_t *ptr1 = new int16_t;
int32_t *ptr2 = (int32_t*)ptr1;
std::cout << "ptr1 的首地址为：" << ptr1 << std::endl;
std::cout << "ptr2 的首地址为：" << ptr2 << std::endl;
/*
Output:
ptr1 的首地址为：0xaaaae7568ed0
ptr2 的首地址为：0xaaaae7568ed0
*/
```

而占用内存不同，只能说明它们所代表的内存块的结束位置不同  

```cpp
std::cout << "ptr1 的尾地址后面是：" << (ptr1 + 1) << std::endl;
std::cout << "ptr2 的尾地址后面是：" << (ptr2 + 1) << std::endl;
/*
Output:
ptr1 的尾地址后面是：0xaaaae9bcced2
ptr2 的尾地址后面是：0xaaaae9bcced4
*/
```

这样的话，我们大概知道了两个不同类型但是同首地址的指针各自框出来的是哪一块内存   
这又会想到，一个指针框出来的是连续的一部分地址，而如果将其扩充为数组的话，是更长连续的地址  
也就是说，对于一个 `int8_t *ptr1 = new int8_t[2];` ，那么它会有连续 $16$ 位  
此时如果出现一个 `int16_t *ptr2;` 和 `ptr1[0]` 的首地址相同，我们修改了 `ptr1[1]` 是否也可以对 `ptr2` 的值产生影响   

```cpp
int8_t *ptr1 = new int8_t[2];
ptr1[0] = ptr1[1] = 1;
int16_t *ptr2 = reinterpret_cast<int16_t*>(ptr1);
std::cout << "*ptr = " << *ptr2 << std::endl;

/*
Output:
*ptr = 257
*/
```

$257_{10}=0000000100000001_2$

那么我们就可以发现，其实这个 $16$ 位的二进制就对应了 `*ptr2` 的内容，它是由两个 $8$ 位二进制组成，也就是两个 `*ptr1`  
表示出来就是：
$$\underset{ptr2}{\underline{\underset{ptr1[0]}{\underline{10000000}}\;\underset{ptr1[1]}{\underline{10000000}}}}$$  
(小端字节序)

懂了，结束。
