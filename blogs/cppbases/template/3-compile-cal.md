---
title: 编译期计算
---

## 原因

很多时候我们不希望代码的某些计算部分在运行阶段出现从而占用cpu，想让它们在编译时期就计算好，尤其是一些很繁琐无聊又要重复计算很多次的部分  

## 方法

我们都知道 c++ 的模板是在编译期会被编译器展开（展开后的代码在 [c++Insight](https://cppinsights.io/) 就可以看），即如果有一个函数模板被使用  

```cpp
template<typename T>
void print (T x) { std::cout << x << std::endl; }

int main () {
    print(10);
}
```
那么它被展开后为  

```cpp
template<typename T>
void print(T val)
{
  std::cout << val;
}


/* First instantiated from: insights.cpp:34 */
#ifdef INSIGHTS_USE_TEMPLATE
template<>
void print<int>(int val)
{
  std::cout.operator<<(val);
}
#endif


int main()
{
  print(10);
  return 0;
}
```

`template` 是在编译期展开的，全局常量也是如此，那么两者结合在一起使用了话类似于递归地进行轮流展开，有一个出口，那么它们就可以完成编译器的计算了  
下面用具体的例子来说明  

## 单变量函数

一个变量，计算 $2^n$ 的值  
既然我们需要递归地展开函数模板，所以正常的时候就是一个递归模板  

```cpp
template<int n>
class Pow2 {
public:
    static const int res = Pow2<n - 1>::res;
};
```

即 $2^n$ 的结果需要展开 $2^{n-1}$ 的结果进行计算  
然后递归还需要出口，就添加一个  

```cpp
template<>
class Pow2<0> {
public:
    static const int res = 1;
};
```

`std::cout << Pow2<3>::res;` 输出一下得到 `8` ，成功，在 insights 里面再看一下

```cpp
template<int n>
class Pow2
{
  
  public: 
  static const int res = (Pow2<n - 1>::res * 2) % 10;
};

/* First instantiated from: insights.cpp:20 */
#ifdef INSIGHTS_USE_TEMPLATE
template<>
class Pow2<2>
{
  
  public: 
  static const int res = (Pow2<1>::res * 2) % 10;
};

#endif
/* First instantiated from: insights.cpp:29 */
#ifdef INSIGHTS_USE_TEMPLATE
template<>
class Pow2<3>
{
  
  public: 
  static const int res = (Pow2<2>::res * 2) % 10;
};

#endif

template<>
class Pow2<1>
{
  
  public: 
  static const int res = 2;
};



int main()
{
  std::cout.operator<<(Pow2<3>::res);
  return 0;
}
```

好了都展开出来了

## 多变量函数

上面的既然有了，接下来搞一个两个变量的复杂一点的  
编译期计算 `gcd(a,b)`   

也是正常的递归部分 

```cpp
template<int a, int b>
class Gcd {
public:
    static const int res = Gcd<b, a % b>::res;
};
```

众所周知 `gcd` 辗转相除的出口在 `b = 0` 时返回 `a` ，那么说明 `a` 时可变的，所以让 `a` 自己作为模板参数引入  

```cpp
template<int a>
class Gcd<a, 0> {
public:
    static const int res = a;
};
```

好了测试一下 `td::cout << Gcd<12, 9>::res << std::endl;` 输出 $3$ 正确，看一下模板展开后  

```cpp
#include <iostream>
#include <time.h>
#include <random>
#include <bits/stdc++.h>

template<int a, int b>
class Gcd
{
  
  public: 
  static const int res = Gcd<b, a % b>::res;
};

/* First instantiated from: insights.cpp:9 */
#ifdef INSIGHTS_USE_TEMPLATE
template<>
class Gcd<9, 3>
{
  
  public: 
  static const int res = Gcd<3, 0>::res;
};

#endif
/* First instantiated from: insights.cpp:9 */
#ifdef INSIGHTS_USE_TEMPLATE
template<>
class Gcd<3, 0>
{
  
  public: 
  static const int res = 3;
};

#endif
/* First instantiated from: insights.cpp:18 */
#ifdef INSIGHTS_USE_TEMPLATE
template<>
class Gcd<12, 9>
{
  
  public: 
  static const int res = Gcd<9, 3>::res;
};

#endif

template<int a>
class Gcd<a, 0>
{
  
  public: 
  static const int res = a;
};



int main()
{
  std::cout.operator<<(Gcd<12, 9>::res);
  return 0;
}

```

嗯辗转相除的所有参数都已经暴露出来了，结束