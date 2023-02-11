---
title: auto 与 decltype
comment: true
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

### 形参推断 

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

既然上面可以，那么参数包也是可以的，至于参数们是否要求类型相同有不同的写法

不要求相同，`auto` 单独推导

```cpp
template<auto ...vs>
struct myType {};

// int,int,int
myType<1, 2, 3> a;
// int,char,nullptr
myType<1, 'a', nullptr> b;
```

要求相同的话，可以第一个是随意的，之后的所有数据都要和第一个相同，即

```cpp
template<auto v, decltype(v) ...resets>
struct myType {};
```

这里在上面的 `myType<1, 'a', nullptr>` 的声明就是错误的 

当然也可以用 `decltype(auto)` 来推导，比如  

```cpp
template<decltype(auto) v>
struct myType {};

int x = 100;
myType<(x)> mt; // int&
```

### 类型擦除

既然用到模板参数里面了，且 `auto` 本身就是提高可扩展性的，所以当然可以用作类型擦除，做到隐式传入类型，比如看下面这个  

```cpp
struct OneTestStruct {
    int val;
};

template<typename T> 
struct PMClassHelper;

template<typename ClassType, typename MemberType>
struct PMClassHelper<MemberType ClassType::*> {
    using Type = ClassType;
};


template<typename PM> // PM = decltype(&OneTestStruct::val)
using PMClassType = typename PMClassHelper<PM>::Type;

template<auto PMD> // PMD = &OneTestStruct::val
struct CounterHandle {
    PMClassType<decltype(PMD)> &c; 
    // => typename PMClassHelper<int OneTestStruct::*>::Type &c;
    // => OneTestStruct &c;
    CounterHandle (PMClassType<decltype(PMD)> &_c) :c(_c) {}
    void increase () {
        ++(c.*PMD); // ++one.val
    }
};


int main () {
    OneTestStruct one{100};
    CounterHandle<&OneTestStruct::val> h(one);
    h.increase();    
}
```

在定义结构体 `h` 时，用模板种植了一个结构体类型 `CounterHandle<&OneTestStruct::val>` ，这个结构体 `h` 里面有一个隐式类型变量为 `PMClassType<decltype(PMD)> &c`   
用第 $15$ 行的 `using` 以及 `decltype` 获取到原型为 `typename PMClassHelper<int OneTestStruct::*>::Type &c`   
而 `Type` 前的这个结构体也是一个模板结构体，它在种植的时候得到其成员 `Type = OneTestStruct` ，所以变量 $c$ 的类型为 `OneTestStruct` 的引用  
那么 `h(one)` 其实就是让结构体 `h` 的成员变量 `c` 成为了 `one` 的引用，且其 `PMD` 是 `OneTestStruct::val`   
故在 `increase` 函数中，让 `one` 的 `val` 加 $1$   
  
这样说可能还是有点不清晰，但将这套类型擦除抽象为一个功能就是，对于代码 `CounterHandle<&A::B> x(C);` ，保证变量 `C` 的类型是 `A` ，`x` 在调用 `increase` 函数时，会让 `C.B` 加一  

## 泛型 lambda 表达式

`auto` 书写 lambda 表达式已经习以为常了，用  

```cpp
auto cmp = [](int x) ->int { return x; };
```

将形参设置为 `auto` 类型的，即可成为泛型 lambda 表达式  

```cpp
auto cmp1 = [](auto a, auto b) { return a < b; };
bool res = cmp1(1, 1.2);
```

也可以用我们上面着重讲的模板函数来写

```cpp
auto cmp2 = []<typename t1, typename t2>(t1 a, t2 b) { return a < b; };
bool res = cmp2(1, 1.2);
```

或者将两者结合，将函数 `func` 和函数的参数列表 `args` 都设置为模板参数，放入一个模板函数内，这样 `func` 调用可以直接使用 lambda 表达式来定义

```cpp
template<typename F, typename ...Args>
void doFunc (F func, Args ...args) {
    func(args...);
}

int main () {
    doFunc([](auto x, auto y){std::cout << x + y;}, 1, 2);
}
```

看一下第一个参数就是一个输出两数和的函数，参数按顺序为后面两个数字，`doFunc` 作用是里面的函数用后面的参数执行  

## 结构化绑定

```cpp
struct Type {
    int x;
    double y;
    Type (int _x = 0, double _y = 0): x(_x), y(_y) {}
    Type (const Type &t): x(t.x), y(t.y) {
        std::cout << "copy Type!\n";
    };
};
Type tp(1, 1.2);
```

第一种方式：  

```cpp
auto [x, y] = tp;
```

上面的是通过拷贝 `tp` 构造一个新 `Type` ，然后让 `x` 和 `y` 分别指向这个新 `Type` 的两个成员变量  
故操作这两个变量不会对 `tp` 内的成员变量造成影响  
  
第二种方式：

```cpp
auto &[x, y] = tp;
```

这种是直接让 `mx` 和 `my` 分别指向 `tp` 的两个成员变量  
故操作这两个变量会直接对 `tp` 内的成员变量造成影响  