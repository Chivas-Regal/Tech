---
title: concept
---

`concept` 关键字可以定义一个 ”在传入模板参数后得到 `bool`“ 类型的判断

```cpp
template<template-parameter-list>
concept concept-name = constraint-expression;
```

即**每次**对于参数列表 `template-parameter-list` ，我们用表达式 `constraint-expression` 判断真假，并传入 `concept-name` 内  

它其实是一个在 [SFINAE设计模式下的](./6-SFINAE.html) 语法糖  
我们首先看一个需求：定义一个只支持整型 `a + b` 的函数   
结合前文所讲，我们只需要加一个 `std::enable_if` 判断  

```cpp
template<typename T>
T Add (T a, T b,
       typename std::enable_if<
           std::is_integral<T>::value, 
           void
       >::type* ptr = nullptr) {
    return a + b;
}
```

写起来东西还是很多的，如果用 `concept`  

首先定义一个 `concept`

```cpp
template<typename T>
concept Integral = std::is_integral<T>::value;
``` 

表示当 `T` 是整形时为 `true`  

替换 `Add` 函数有以下四种方式   


```cpp
// 1
Integral auto Add (Integral auto a, Integral auto b) {
    return a + b;
}
// 2
template<typename T>
requires Integral<T> 
T Add (T a, T b) {
    return a + b;
}
// 3
template<typename T>
T Add (T a, T b) requires Integral<T> {
    return a + b;
}
// 4
template<Integral T>
T Add (T a, T b) {
    return a + b;
}

int main () {
    std::cout << Add(1, 2) << std::endl; // OK: output -> "3"
    std::cout << Add(1.5, 2) << std::endl; // ERROR
}
```

这里 `Add(1.5, 2)` 第一个参数为 `double` 不满足类型要求  
  
同时由于 `concept` 表达式为 `bool` ，我们如果定义一个全 `true` 的 `concept` ，检测时都会通过，将不会对任何函数产生影响，即  

```cpp
template<typename T>
concept always_satisfied = true;

always_satisfied auto Add (always_satisfied auto a, always_satisfied auto b) {
    return a + b;
}

int main () {
    std::cout << Add(1, 2) << std::endl; // OK: output -> "3"
    std::cout << Add(1.5, 2) << std::endl; // OK: output -> "3.5"
}

```