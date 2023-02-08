---
title: auto 与 decltype
---

## 初始化推导

### auto

`auto` 可以用于推导右值表达式结果的数据类型，去掉引用      
（可以结合 `const`、`*`、`&` 等类型修饰符得到新类型）      

```cpp
int a = 1;
const int b = 1;
int& c = a;

auto x = 1; // int
auto x = a; // int
auto x = c; // int

auto& x = a;  // int&
auto&& x = a; // int&
auto&& x = 1; // int&&
auto&& x = b; // const int&

const auto& x = b;  // const int&
const auto&& x = 1; // const int&&

auto* x = &a; // int*
const auto* x = &a; // const int*
```

`auto` 也有一些不能做的推导  

```cpp
int arr[10] = {0};
auto aa = arr; // OK
auto rr[10] = arr; // ERROR：无法定义数组

template <typename T>
struct Bar {};
Bar<int> bar;
Bar<auto> bb = bar; // ERROR: 无法推导出模板参数
```

### decltype

`decltype` 可以推导出后面括号内表达式结果值的数据类型（可以携带引用），别的和 `auto` 的规则是一样的

```cpp
int a = 0;
decltype(a) x;       // int
decltype(a)& x1 = a; // int&
decltype(a)* x;      // int*
decltype(&a) x;      // int*
decltype(&a)* x;     // int**
decltype(x1) x = x1; // int&

decltype(std::move(a)) // int&&
decltype(0)            // int
decltype((a))          // int&

std::vector<int> v = {0, 1};
decltype(v[0]) // int&
```

### decltype(auto)

在声明变量时先将右侧内容替换到这里的 `auto` 内，然后再用 `decltype` 进行推导  

```cpp
int a = 1;
const int b = a;

decltype(auto) x = b;  // const int&
decltype(auto) x = a;  // int
decltype(auto) x = (a);// int&
```

## 函数返回值推导

### 前置 auto 作返回

这里可以获取到 `return` 后的内容，对其进行推导后定为函数的返回类型

```cpp
// float
auto func (float f) { 
    return f; 
}

// const float&
const auto &func (flag a) {
    return a;
}

// lambda 表达式
auto func() {
    return [](int a) -> int {
        return a;
    };
}
```

### 尾置返回类型

可以在函数的后面添加 `-> 数据类型` 来控制返回值的数据类型，可以用 `auto` 、`decltype` 推导  
下面是几个简单的  

```cpp
// float
auto func (float a) -> float {
    return a;
}

// float
auto func (float a) -> auto {
    return a;
}

// 由 a+b 推导出类型
auto func (int a, double b) -> decltype(a + b) {
    return a + b;
}
```

当然这个返回类型也可以通过传入参数返回指针

返回数组指针:

```cpp
// 原始的写法
int (*func(int arr[][10], int i))[10] {
    return &arr[i];
}
// 尾置返回的写法
auto func (int arr[][10], int i) -> int(*)[10] {
    return &arr[i];
}

// 调用：
int arr[100][10];
int *p = *func(arr, 5);
for (int i = 0; i < 10; i ++) 
    std::cout << p[i];
```

表示对函数 `func` 传入一个二维数组指针和一个 `int` ，可以得到一个长度为 $10$ 的数组指针  

返回函数指针:

```cpp
int add (int a, int b) { return a + b; }
int sub (int a, int b) { return a - b; }

// 原始的写法
int (*func(int op))(int, int) {
    if (op == 0) return add;
    else return sub;
}

// 尾置返回的写法
auto func(int op) -> int(*)(int, int) {
    if (op == 0) return add;
    else return sub;
} 

// 调用：
auto fp1 = calc(0);
std::cout << fp1(1, 2); // 3
int (*fp2)(int, int) = calc(1);
std::cout << fp2(1, 2); // -1
```

这表示对于函数 `func` 传入一个 `int` 类型数据，返回一个 “传入两个 `int` 型数据返回一个 `int` 型数据” 的函数指针

### 前置 decltype(auto) 作返回

和 [上文中的 decltype(auto)](#decltypeauto) 一样，这里是将返回的内容放入 `auto` 后再用外层的 `decltype` 推导

```cpp
float value;

// float
decltype(auto) func () {
    return value;
}

// float&
decltype(auto) func () {
    return (value);
}
```

## 模板参数

```cpp
template<typename T, T v>
struct myType {};

myType<int, 1> mt;
```

通过下面这种写法，我们可以尝试替换里面的 `T` 为 `auto`  

```cpp
template<auto v>
struct myType {};

// auto = int
myType<100> mt1;
// auto = float
myType<100.f> mt2;
```

既然上面可以，那么参数包也是可以的，至于参数们是否要求类型相同