---
title: lambda 表达式
---

$lambda$ 表达式是 $c++11$ 后引入的一个匿名函数，结构是这样的  

```cpp
auto Name = [Captures](Arguments) mutable(optional) -> retType(optional) {
    FunctionBody;
};
```
- `Name`：表达式名
- `Captures`：捕获内容（下面会说）
- `Arguments`：表达式参数
- `mutable`：一个关键词，可加可不加
- `retType`：返回类型，可加可不加，不加的话让 `auto` 自己推导
- `FunctionBody`：函数体

## 捕获内容

对于用户自定义的变量，函数体内只能用捕获到的内容和参数进行程序计算  

|捕获方式|捕获含义|
|-|-|
|`[]`|没有捕获|
|`[x]`|按值捕获变量 `x`|
|`[x,y]`|按值捕获变量 `x,y`|
|`[&x]`|按引用捕获变量 `x`|
|`[&x, y]`|按引用捕获变量 `x`，按值捕获变量 `y`|
|`[=]`|按值捕获所有变量|
|`[&]`|按引用捕获所有变量|
|`[=,&x]`|按值捕获所有变量，但按引用捕获变量 `x`|
|`[&,x]`|按引用捕获所有变量，但按值捕获变量 `x`|

这里按值捕获变量 `x` 是对 `x` 的修改只在表达式局部生效，按引用则是全局生效  
注意在按值捕获的时候，要想在局部修改这个值，应该加上关键词 `mutable` ，即  

```cpp
int main () {
    int x = 0;
    auto func1 = [x]() -> void { x ++; }; // COMPILE ERROR!
    auto func2 = [x]() mutable -> void {  // OK
        x ++; 
        // NOW x = 1
    };
    func2();
    std::cout << x << std::endl; // 0
}
```

<a id="question1"></a>  <br>  
::: warning Question1 
如果外部代码特别特别长，我们还要捕获所有变量，捕获得太多会不会很费内存，这个我们在 <a href="#answer1" id="nnn">下面</a> 会进行回答
:::

## 存储方式

我们可以使用 `std::function` 来存储，可以自己选择是否用 `std::bind` 连接参数  

```cpp
std::function<int(int, int)> func1 = [](int x, int y) -> int { return x + y; };
std::function<int(void)> func2 = std::bind([](int x, int y) -> int { return x + y; }, 1, 2);
std::cout << func1(1, 2) << " " << func2() << std::endl;
```

也可以使用函数指针来存储

```cpp
int(*func1)(int, int) = [](int x, int y) -> int { return x + y; }; // OK
int(*func2)(int, int) = [&](int x, int y) -> int { return x + y; }; // ERROR: 捕获了内容的不能转为函数指针
```

## 底层原理

它既然可以使用 `std::function` 或者 `std::bind` ，我们可以认为它被编译器展开后是一个具有 `operator()` 的仿函数  
不妨用 [C++Insights](https://cppinsights.io/) 一探究竟  
我们写一个正常的仿函数类，带有一个 `private` 成员变量（模拟按值捕获）  
接着写一个 `lambda` 表达式，按值捕获一个变量，与上面实现同样的功能

```cpp
class __lambda_xx_xx {
public:
    int operator ()(int n) const {
        return val + n;
    }
private:
    int val;
public:  	
    __lambda_xx_xx (int & _val): val(_val) 
    {}
};

int main () {
    int val = 2;
    __lambda_xx_xx a1(val);
    a1(4);

    auto a2 = [val](int n) -> int {return val + n;};
    a2(4);
}

```

这样看起来 `a1` 似乎和 `a2` 差不了什么，看一下 C++Insights 给我们反馈的展开代码  

```cpp
# include <iostream>
# include <vector>

class __lambda_xx_xx
{
  
  public: 
  inline int operator()(int n) const
  {
    return this->val + n;
  }
  
  
  private: 
  int val;
  
  public: 
  inline __lambda_xx_xx(int & _val)
  : val{_val}
  {
  }
  
};



int main()
{
  int val = 2;
  __lambda_xx_xx a1 = __lambda_xx_xx(val);
  a1.operator()(4);
    
  class __lambda_21_15
  {
    public: 
    inline /*constexpr */ int operator()(int n) const
    {
      return val + n;
    }
    
    private: 
    int val;
    
    public:
    __lambda_21_15(int & _val)
    : val{_val}
    {}
    
  };
  
  __lambda_21_15 a2 = __lambda_21_15{val};
  a2.operator()(4);
  return 0;
}
```
嗯这个外面我们自己写的 `__lambda_xx_xx` 类和里面被编译器展开的 `__lambda_21_15` 类几乎一模一样啊  
了解了，这 `lambda` 在编译阶段会被编译器生成一个实现相同功能的仿函数类

::: tip Answer1
让我们回答一下<a href="#question1" id="answer1">上面的问题</a>，像上面想的如果我们直接全部捕获，那相当于直接拷贝一份所有变量，而事实上则是  


```cpp
int main () {
  	int a, b, c, d;
    auto a2 = [&]() -> void {
      	a += b;
    };
    a2();
}
```

的 C++Insights 是 

```cpp
int main()
{
  int a;
  int b;
  int c;
  int d;
    
  class __lambda_6_15
  {
    public: 
    inline /*constexpr */ void operator()() const
    {
      a = a + b;
    }
    
    private: 
    int & a;
    int & b;
    
    public:
    __lambda_6_15(int & _a, int & _b)
    : a{_a}
    , b{_b}
    {}
    
  };
  
  __lambda_6_15 a2 = __lambda_6_15{a, b};
  return 0;
}
```

发现实际上只捕获了两个变量，这无疑是非常省内存和效率的👍🏻
:::
