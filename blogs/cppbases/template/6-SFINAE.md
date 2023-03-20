---
title: 模板SFINAE
---

## 含义

**SFINAE**: **S**ubstitution **F**ailure **I**s **N**ot **A**n **E**rror 替换失败不是错误  
Failure Is Not An Error 失败不是错误，结合函数重载  

```cpp
void foo (const std::vector<int>& v) {
    std::cout << "foo(vector<int>)\n";
}
void foo (const std::vector<double>& v) {
    std::cout << "foo(vector<double>)\n";
}
void foo (...) { // sink-hole function
    std::cout << "can't into any foo\n";
}
```

如果我们传入一个 `std::vector<double> v` 或者 `std::vector<long long> v` ，我们只看前面无法传入的函数是肯定会失败，但应当先别急着报错，仔细看看发现其实他们都能作为参数传入后面的函数    
而带上 Substitution 后就将这种设计模式扩展到模板参数的匹配上了，参数也可以扩展为 “可以接纳含有某种特性的数据类型作为参数”  
比如我们的参数可以接纳有 `x` 的数据类型  

```cpp
template<typename T>
void foo (const T& t, decltype(T::x)* ptr = nullptr) {
    std::cout << "has member: x\n";
}
```

这里面就是说当 `T` 存在成员变量 `x` 时，后一个参数、整个函数才算有效  
再来一个接纳变量 `y` 的  

```cpp
template<typename T>
void foo (const T& t, decltype(T::x)* ptr = nullptr) {
    std::cout << "has member variable: x\n";
}
template<typename T>
void foo (const T& t, decltype(T::y)* ptr = nullptr) {
    std::cout << "has member variable: y\n";
}

struct A { int x; };
struct B { int y; };
struct C { int x, y; };
struct D {};

int main () {
    foo(A()); // OK: output -> "has member variable: x"
    foo(B()); // OK: output -> "has member variable: y"
    foo(C()); // ERROR
    foo(D()); // ERROR
}
```

这就和函数重载一样理解，`A()` 只有 `x` 直接匹配第一个，`B()` 只有 `y` 匹配第二个，`C()` 两个都有不知道匹配哪个就报错了，`D()` 两个都没有匹配不上也会报错

## 接纳一个 “含有 `int` 型名字为 `variable1` 的成员变量的类型”  

名字就和上面一样有 `T::variable1` 即可  
类型我们可以使用 `std::enable_if` 条件判断是否可以展开，即如果 `decltype(T::variable1`) 和 `int` 一样，我们就可以展开  

```cpp
struct A { int variable1; };
struct B { double variable1; };
struct C { int variable2; };
struct D { double variable2; };

template<typename T>
void foo (T t,
          typename std::enable_if<
              std::is_same<int, decltype(T::variable1)>::value, // 存在 T::variable1 且类型相同了才有下文
              void
          >::type* ptr = nullptr) {
    std::cout << "has variable: [int variable1]" << std::endl;
}

int main () {
    foo(A()); // OK: output -> "has variable: [int variable1]"
    foo(B()); // ERROR
    foo(C()); // ERROR
    foo(D()); // ERROR
}
```

## 将整型返回值变成 `long long`

要检测到整型，同时遇见了别的类型了还不能乱变，所以模板里面有判断 `bool flag`  
就先泛化一个不管 `flag` 下 `type` 全是传入类型的模板，再特化一个 `flag=true` 下 `type` 为 `long long` 的用来判断  

```cpp
template<typename T, bool flag>
struct Int2LongLong {
    using type = T;
};
template<typename T>
struct Int2LongLong<T, true> {
    using type = long long;
};
```

这样就说明
- `flag = true: type = long long`
- `flag = false, type = T`

判断整型可以用 `std::is_integral<T>::value`  
于是可以做一个 ”整型变成 `long long`“ 的宏定义  

```cpp
#define upInt(T) Int2LongLong<T, std::is_integral<T>::value>::type
```

就可以设计一个返回值为这个宏定义的函数  

```cpp
template<typename T>
typename upInt(T) getSum (const std::vector<T>& v) {
    typename upInt(T) ret = 0;
    for (const T& it : v) 
        ret += it;
    return ret;    
}

int main () {
    std::cout << getSum(std::vector<int>{1}) << std::endl;      // 1 返回类型为 long long
    std::cout << getSum(std::vector<double>{0.5}) << std::endl; // 0.5 返回类型为 double
}
```