---
title: 初始化列表
---

## 问题

:::: tip 

下面三种说法：


::: warning 说法一

<br>

```cpp
struct Obj {
    int x;
    int& xx;
    Obj () {
        x = 10;
        xx = x;
    }
}

Obj obj; obj.xx ++;
std::cout << obj.x;
```

会输出 `11`

:::

::: warning 说法二

<br>

```cpp
struct Obj {
    const int x;
    Obj () {
        x = 10;
    }
};
Obj obj;
std::cout << obj.x;
```

会输出 `10`

:::

::: warning 说法三

<br>

```cpp
struct Obj {
    int x, y, z;
    Obj (int i) : 
            z(i), 
            y(z + 1), 
            x(y + 1) 
    {}
};
...
Obj obj(100);
std::cout << obj.x << " " << obj.y << " " << obj.z << "\n";
```

会输出 `102 101 100`
:::

都有哪些是正确的

::: details 答案
全错了，不然我写它干啥  
*前两个编译错误，最后一个答案错误*
:::

::::

下面来说说问题在哪

## 生命周期

赋值构造的生命周期是先构建变量，再在赋值部分初始化  
比如说法二中的就是相当于  

```cpp
const int x;
x = 10;
```

这种肯定是有问题的，`const` 修饰的变量不可修改  
以及第一个同理，引用变量应在构建的时候就指明绑定对象，后期不可修改

而**初始化列表是在成员变量构造时完成初始化**

初始化列表就是在构造函数后面跟着变量+初始化，以逗号分割，如下：  

```cpp
struct Obj {
    const int x;
    int y;
    int &yy;

    Obj () :
            x(10),
            y(20),
            yy(y)
    {}
};

Obj obj;
obj.yy ++;
std::cout << obj.x << " " << obj.y << " " << obj.yy << std::endl;
```
会输出 `10 21 21` ，这里的 `const` 变量和引用变量都没有问题，输出也是正常的结果  

## 构造顺序

这是第三个说法错误的指正，当然不可以理所应当地认为第三种构造就是  

```cpp
int z = i;
int y = z + 1;
int x = y + 1;
```

实际上，它内部的构造顺序为  

```cpp
extern int x, y, z;
int x = y + 1;
int y = z + 1;
int z = i;
```

**成员变量的构造顺序与在类内的声明顺序相同**  
因此 `x` 和 `y` 输出的是垃圾值
而我们可以推得，因为初始化列表是在构造之初完成的事情，所以**初始化列表先于赋值部分**，自己验证一下也很易得，这里不做说明

## 派生类构造

**派生类可以直接调用父类的构造函数，来完成在父类内声明的成员变量的初始化**

```cpp
struct Base {
    int x, y;
    Base (int i):
            x(i * 2),
            y(i + 2)
    {}
};

struct Derived : public Base {
    int z;
    Derived (int j) :
            Base(j),
            z(j + 3)
    {}
};

Derived d(10);
std::cout << d.x << " " << d.y << " " << d.z << std::endl;
```

输出 `20 12 13`

而我们根据上面的，以及”父类成员排在子类新建成员之前“这条性质可以知道，如果我们这样写  

```cpp
Derived (int j) :
        z(j + 3),
        Base(z)
{}
```

依然是不对的