---
title: 语法
---

## 程序分段

**代码段**  
代码段在内存中被映射为只读。它是由编译器在编译链接时自动计算的。通常是用来存放程序执行的指令。代码段输入静态内存分配。  

**数据段**  
通常用来存放程序中已初始化的（非 0）全局变量和静态局部变量。数据段的起始位置由链接定位文件确认，大小在编译链接时自动分配。数据段属于静态内存分配  

**BSS 段**  
bss 是英文 Block by Symbol 的简称。通常用来存放程序中未初始化和初始化为 0的全局变量的一块内存区域，在程序载入时由内核清零。数据段属于静态内存分配   

**堆**  
堆保存函数内部动态分配（malloc 或 new）的内存，是另外一种用来保存程序信息的数据结构。  
堆是先进先出（FIFO）数据结构。堆的地址空间是向上增加，即当堆上保存的数据越多，堆的地址越高。动态内存分配  
注意：堆内存需要程序员手动管理内存，通常适用于较大的内存分配，如频繁的分配较小的内存，容易导致内存碎片化。  
  
**栈**
栈保存函数的局部变量（不包括 static 修饰的变量），参数以及返回值。是一种后进先出（LIFO）的数据结构。  
在调用函数或过程后，系统会清除栈上保存的局部变量、函数调用信息及其他信息。  
栈的另外一个重要特征是，它的地址空间 向下减少，即当栈上保存的数据越多，栈的地址越低。静态内存分配  
注意，由于栈的空间通常比较小，一般 linux 程序只有几 M，故局部变量，函数入参应该避免出现超大栈内存使用，比如超大结构体，数组等，避免出现 stack overflow  

## 头文件

`#` 是编译预处理符号  

`#include <被调用文件>` 是将被调用文件整体移动到调用文件内

```cpp
// header.h
# ifndef _HEADER_H_
# define _HEADER_H_
...
# endif
```

目的在于：如果多次调用本文件，不会重复加入主 `.cpp`

`extern int x;` 告诉编译器本变量虽然前面没有定义，但是编译的这一套里面肯定存在，编译器就不管它，让 `linker` 去找

## 引用

在引用时，相当于给右值多了一个别名，相当于绑定的关系，左值在定义时必须要初始化为一个变量

```cpp
int X = 47;
int &Y = X;

std::cout << "Y = " << Y; // 47
Y = 18;
std::cout << "X = " << X; // 18
```

如果初始化不为变量，即 

```cpp
void func (int &x) {...}

func(i * 3); // Warning or Error
func(i); // OK
```

`i * 3` 的结果是一个匿名的临时变量，而不是一个有名的变量



当然还有一种操作：  

```cpp
int x;
int &h () {
 	return x; // 相当于 x 这个变量变成 refference 去返回
}

int main () {
  h() = 16; // x = 16
}
```

引用的实质是指针  
可以 `int *& p;` 表示 `p` 捆绑的变量是一个指针  
但是不可以 `int &* p;` 
且既然 `refference` 没有实体，它就不能是数组



对于函数，如果  

```cpp
void f (const int &i) {
  std::cout << i << std::endl;
}
int main () {
  int i = 3;
  f(i * 3); 
}
```

是可以的

## new 与 delete

```
int *a = new int;
int *b = new int[10];
​
class A {};
A *x = new A;
A *y = new A[10];
​
delete a;
delete[] b;
delete x;
delete[] y;
```

相当于 `malloc` 和 `free`  
`new` 的时候需要有构造，`delete` 的时候需要有析构  
以及 `new` 好的指针位置移动在 `delete` 时会报错，比如 

```cpp
int *a = new int[10];
a ++;
delete[] a; // 运行错误
```

不过 `delete` 也可以删除不是 `new` 出来的指针，比如  

```cpp
int *p = 10;
delete p;
```

也是可以的



`delete` 的意义：防止在持续运行的程序中出现**内存泄漏**

## const

`const` 不是常量，内容无法修改  
指针 `const` 只是说明所指的地址无法修改，但是内容可以修改  

```cpp
char * const q = "abc";
*q = 'c'; // OK
q ++;     // ERROR

const char * p = "abcd";
*p = 'b'; // ERROR!
```

::: tip

```cpp
Person p1("Fred", 200);
const Person* p = &p1; // 对象是 const
Person const* p = &p1; // 对象是 const
Person *const p = &p1; // 指针是 const
```

:::

一个常见的字符串问题  

```cpp
char *s = "hello world"; // = const char *s
char s[] = "hello world"; // '=' 一个数组拷贝
```

第一种是代码段里面给了 `s` 一个空间，第二种是堆栈里面给了 `s` 一个空间  
第一种是不可修改的，之所以说它在代码段里面是因为 `*s` 是个指针，它指向了 `"hello world"` 这个常数字符串，所以 `*s` 就是一个常量，常量被放置在代码段内，代码段不可写  

---

函数的 `const` 可以

```cpp
int Date::get_day() const {
	day ++; // EROR: modifies data
  set_day(12); // ERROR: calls non-const
  return day; // OK
}
```

这是表示 `const` 下的某个对象可以使用 `const` 函数，这样编译器就可以检查出来  

```cpp
class A {
  int i;
public:
  A(): i(0) {}
  void f () { std::cout << "f()" << std::endl; }
  void f () const { std::cout << "f() const" << std::endl; }
};

int main () {
  const A a;
  a.f();
}
// 输出：f() const
```

这里其实函数原型是 `void f(const *A) {}` 参数表还是不一样的  
同时对象如果有一个 `const` 成员变量，那么只能用列表初始化这个变量  
且对象的 `const` 成员变量不可以给数组初始化大小，如果要用需要在前面再加一个 `static` 或者使用 `enum` 枚举

## static

`static` 只能在本编译文件内使用  
且 `static` 下的变量值会被保存，它其实就是一种全局变量  

```cpp
void f () {
    static int i = 0;
    i ++;
    std::cout << i << "\n";
}

int main () {
    f(); f(); f();
}
```

会输出 `1 2 3`  
需要一个可以伴随的表示这个东西是否被初始化过的标记   
静态成员变量：在类的所有对象内保持一致，但类内是声明不是定义，故想用的话需在外面加一个 `<类型> <类>::<变量名>` 即为定义  

可以直接通过对象访问，也可以通过 `<类名>::<变量名>` 访问，但需要 `public`  
调用静态函数也是如此，但是静态函数内不可以使用非静态成员变量

## 访问限制

### private

私有是对类而言，而不是对对象而言  
对于同一个类的不同对象，互相可以访问私有成员  

```cpp
class A {
private:
  	int x;
public:
  	int getOtherAX (A *q) {
     		return q->x; // 是可以的
     }
};
```

只在编译时刻检查，在运行时刻是不检查的  
还有一种破坏的方式是 `friend` ，声明哪个类是此类的朋友，就可以访问 `private` 信息了  

```cpp
class B {
private:
    int x;
public:
    B (int x) {
        this->x = x;
    }
friend class A;
};

class A {
public:
    int getBX (B *b) {
        return b->x;
    }
};

int main () {
    B b(100);
    A a; 
    std::cout << a.getBX(&b) << std::endl;
}
```

`friend` 也可以用作友元函数  

```cpp
class A {
private:
    int x;
public:
    A (int x) { this->x = x; }
    friend int getA (A*);
    friend void setA (A*, int);
};

int getA (A* a) {
    return a->x;
}
void setA (A* a, int x) {
    a->x = x;
}

int main () {
    A a(1);
    std::cout << getA(&a) << std::endl;
    setA(&a, 2);
    std::cout << getA(&a) << std::endl;
}
```

可以发现一点就是，`friend` 是做在类的声明里面的，当一个类声明好了，就没法再声明 `friend` 了

### public

所有位置都可以访问

### protected

只有当前类及其子类可以访问，限制方式和 `private` 类似  
意义在于对 `private` 的分层，一部分是谁都不能碰，而 `protected` 的部分是留给子类可以操作的

### struct 和 class

区别只有，在无访问限制授权时，`class` 默认 `private` ，`struct` 默认 `public` 

## 初始化列表

类除了在函数 `body` 内初始化，还可以用列表的方式初始化，比如

```cpp
class A {
private:
  int a, b, c;
public:
  A (int x, int y, int z): a(x), b(y), c(z) {}
};
```

和

```cpp 
class A {
private:
  int a, b, c;
public:
  A (int x, int y, int z) {
    this->a = x;
    this->b = y;
    this->c = z;
  }
};
```

结果是一样的，当然也可以混着用，不过列表初始化，是早于构造函数的 `body` 执行的  
但是注意一点，构造函数是赋值，`initialize` 才是初始化

## 拷贝构造

```cpp
class A {
public:
  A () {}
  A (const A &a) { ... }
};
int main () {
  A a;
  A aa = a; // 会使用上面的 A(const A &a) 的拷贝构造函数
}
```

甚至这样做的时候，如果有一个函数  

```cpp
void f (A a) {
  ...
}
```

在 `main` 内使用 `f(a)` 时，也依然会进行一次参数的拷贝构造

拷贝构造函数如果没有的话， `c++` 会自动提供拷贝每一个成员变量，但是一旦有了话，就按自己写的来  

当然，拷贝构造函数如果是直接 `A (A a) {}`   



> 那么在传参的时候会发生一次拷贝构造，然后参数的拷贝构造依然会需要参数 .... 就无限递归了，这样是不行的

## 对象的继承

继承的时候，会进行扩充，也就是说继承者是被继承者的超集  
继承方式：  

```cpp
class <子类> : public <父类> {
  
};
```

这样子类可以使用父类中所有的 **`public` 和 `protected`**，注意，父类私有的东西虽然存在但是不能访问  
也可以添加一些东西：

```cpp
class <子类> : public <父类> {
public:
  	void funct () {}
};
```

这样子类中就多出来了一个父类中不存在的 `funct()` 函数  

在列表初始化时，父类是先被构造的，析构时父类是后被析构的 

如果父类中有很多同名函数，若子类又声明了一个同名函数，则父类中的那些所有同名函数均被隐藏

## 对象的组合

现有 `class_A` 和 `class_B` ，用 `class_PairAB` 来组合管理它们两个的方法叫做对象的组合  

```cpp
class A {
private:
  int x, y;
public:
  A (int _x = 0, int _y = 0): x(_x), y(_y) {};
  void print () {
    std::cout << x << " " << y << std::endl;
  }
};

class B {
private:
  int a, b;
public:
  B (int _a = 0, int _b = 0): a(_a), b(_b) {};
  void print () {
    std::cout << a << " " << b << std::endl;
  }
};
```

组合为  

```cpp
class PairAB {
private:
  A a;
  B b;
public:
  PairAB (int _x = 0, int _y = 0, int _a = 0, int _b = 0): a(_x, _y), b(_a, _b) {};
  void print () {
    // 分开用自己的 print ，边界依然是清晰的
    a.print();
    b.print();
  }
}
```

## 向上造型

由前文我们已知，如果有一个 `class A` ，那么其对象地址也是其对象的首个成员变量的地址，且对象的成员变量的地址都是连续的  
而指针操作下，可以直接修改这个地址的变量  
故可以操作  

```cpp
class A {
public:
    int i;
private:
    const int j;
public:
    A (): i(10), j(20) {}
    int getJ () { return j; }
};

int main () {
    A a;
    int *p = (int *)&a;
    p ++;
    *p = 50;
    std::cout << a.getJ() << std::endl; // 50
}
```

这样在 `*p = (int*)&a;` 下，`p` 也就是 `a.i` 的地址，而我们将其移动一个位置后，对其操作，其实也就是操作了 `a.j` ，就访问到了 `private` 的东西，甚至它还是一个 `const`，离离原上谱

而说明 **子类父类对象的结构是一致的** 这个信息的，可以使用这个方式来验证 

```cpp
class A {
public:
    int i;
    A (): i(0) {}
};
class B: public A {
private:
    const int j;
public:
    B (): j(10) {}
    int getJ () {return j;}
};

int main () {
    B b;
    int *p = (int *)&b;
    p ++;
    *p = 50;
    std::cout << b.getJ() << std::endl; // 50
}
```

这里依旧被修改为了 `50`

---

如果 `Manager` 是一种特殊的 `Employee` 也就是说 `class Manager: public Employee {}`  

那么可以：  

```cpp
Manager pete();
Employee* ep = &pete;
Employee& er = pete;
```

这都是**向上造型**  
如果此时 `Employee` 和 `Manager` 都有一个 `print()` 函数，且 `Manager` 的是覆盖掉 `Employee` 的，那么如果 `ep->print()` 此时使用的是 `Employee` 的 `print()`  

## 多态性

### 原理

```cpp
class XXPOs {...} // x,y point
class Shape {
public:
  Shape();
  virtual ~Shape();
  virtual void render();
}
```

这里有一个关键字 **`virtual`** 表示如果 `Shape` 有一个子类，那么它的同名函数一定和父类的有联系 

```cpp
class Ellipse: public Shape {
public:
  Ellipse (float maj, float minr);
  virtual void render();
}
class Circle: public Ellipse {
public:
  Circel(float radius): Ellipse(radius, radius) {}
  virtual void render ();
}
```

这有什么用呢？想到我们前面说的向上造型，如果有一个函数  

```cpp
void doRender (Shape *p) {
  p->render();
}
```

如果不是 `virtual` 的话，那么当传进 `Ellipse ell(10, 20)` 然后做 `render(&ell);` 时，这里会让 `ell` 做 `Shape` 的 `render`  

而一旦加了 `virtual` ，这里 `ell` 做的就是 `Ellipse` 的 `render`  

这里相当于是在编译的时候告诉编译器：“我们不能因为这个指针是什么类型就相信它是什么类型，而应当在运行的时候查看它**实际是什么类型**，就调用它实际类型的函数“   

这就是**多态性**，这里的多态指的是那个函数参数内的 `p` ，`p` 指的是谁，它就成为谁的形态

### 实现

有虚函数的类对象地址首位置不是第一个成员变量  
而是一张表 `vtable` ，这张表指向自己的 所有 `virtual` 的地址，地址第二个位置才是第一个成员变量  
如果使用 `int *r = (int *)&a;` ，那么修改 `r` 可以修改 `a` 这个对象的虚函数表指向的地址  
例如如果 `b` 继承于 `a`   

```cpp
A a;
B b;
A* p = &a;
int *r = (int *)&a;
int *t = (int *)&b;
*r = *t;
p->f(); 
```

此时执行的是 `b` 的虚函数 `f()`  

如果一个类里有一个 `virtual` 函数，那么其析构函数就要是 `virtual` 的   

```cpp
Shape *p = new Ellipse(...,...);
...
delete p; // 需要 virtual
```

## 运算符重载

### 基本规则

`,` 是个运算符，用于连接表达式，运算结果为右边的表达式  
可以作为成员函数，一个典型的例子  

```cpp
class Integer {
private:
    int i;
public:
    Integer (int i): i(i) {}
    const Integer operator+ (const Integer &that) const {
        return Integer(i + that.i);
    }
    int getI () {
        return i;
    }
};

int main () {
    Integer a(1);
    Integer b(2);
    a = a + b;
 		// 也可以写为 a = a.operator+(b);
    std::cout << a.getI() << std::endl; // 输出3
}
```

当然我们也可以把 `a = a + b` 替换为 `a = a + 2`  
因为我们这里是有一个只用一个整型就可以实现构造 `Integer` 的构造函数，所以这里对于 `receiver` 也就是 `a` ，`2` 将会默认使用这个构造函数将自己变成 `Integer` 然后加给 `a`  
但是 `a = 2 + a` 是不行的，因为 `2` 这个 `receiver` 是整数，而 `Integer` 此时没能力将自己变成 `int`   
要想实现这个，可以使用  

```cpp
friend const Integer operator+ (const Integer &a, const Integer &b) {
    return Integer(a.i + b.i);
};
```

这个全局函数，在遇到 `a = 2 + a` 时，编译器会识别到可以用两个 `Integer` 来做加法，就可以了

> 单目运算符应当是成员  
> `= () [] -> ->*` 必须是成员  
> 赋值运算应当是成员  
> 别的双目应当是非成员的

### 原型

关于 `const` ，如果传进去不修改算子就加上，要修改 `++,--,+=,-=,=` 就不加  
而 `[]` 时刻做左值，比如 `a[i] = 6` 也不能加而且要引用  



`+,-,*,/,%,^,&,|,~`:   

```cpp
-const T operator X (const T& l, const T& r) const
```



`!,&&,||,<,<=,==,>=,>`:

```cpp
-bool operator X (const T& l, const T& r) const
```



`[]`:

```cpp
-T& T::operator [] (int index)
```



`++,--`:

```cpp
class Integer {
public:
  const Integer& operator ++ (); // ++Integer
  const Integer operator ++ (int); // Integer++, 这里的int只是为了让编译器区分和上面的这两个函数，且不引用是要返回加以前的结果，这个reference是没有用的
  const Integer& operator -- (); // --Integer
  const Integer operator -- (int); // Integer--
};

const Integer& Integer::operator ++ () {
  *this += 1;
  return *this;
}
const Integer Integer::operator++ (int) {
  Integer old(*this);
  ++(*this);
  return old;
}
```



`==,!=,<,>,<=,>=`:

```cpp
// 手写细节
bool Integer::operator == (const Integer& that) const {
  return i == that.i;
}
bool Integer::operator < (const Integer &that) cosnt {
  return i < that.i;
}
// 剩下的直接用前面这两个来搞，好处在于要修改时只需要改两个即可
bool Integer::operator != (const Integer &that) const {
  return !(that == *this);
}
```



`[]`:

```cpp
class Vector {
private:
  int *m_array;
  int m_size;
public:
  Vector(int size): m_size(size) {
    my_array = new int[size];
  }
	~Vector() { delete m_array; }
  int& operator[] (int index) {
  	return m_array[index];
	}
}
```

### 赋值

```cpp
// MyType b;
Mytype a = b;
...
Mytype a; a = b;
```

这两种是不一样的，第一种是拷贝构造，第二种是赋值  
调用的函数不一样，第一个是拷贝构造函数，第二个是赋值运算符  



如果没有写异类赋值，在异类 `a = b` 时，`B` 拷贝构造为 `A`，再用同类赋值  
如果写好了异类赋值，那么 `a = b` 时会直接调用赋值运算  



写赋值函数时：  

```cpp
class A {
private:
  char *p;
public:
  A& operator= (const A& that) {
    /*
    delete p;
    p = new [strlen(that.p) + 1];
    strcpy(p, that.p);
    如果此时 that = this 了话，那么 delete 到后两者的 p 都不存在了
    所以需要判断 this 是否为 that
    */
    if (this != &that) {
      delete p;
      p = new [strlen(that.p) + 1];
      strcpy(p, that.p);
    }
    return *this;
  }
}
```

### 类型转换

一个正常的会默认进行的是：  

```cpp
class PathName {
  std::string name;
public:
  PathName (const std::string&);
  ~PathName();
};
...
string abc("abc");
PathName xyz(abc); // OK
xyz = abc; // OK，这里就是将 abc 利用构造函数变成 PathName 然后再赋值
```

如果是不小心写错类型了，不希望编译器自动进行这样的构造转换，可以这样  

```cpp
...
  explicit PathName(const std::string&);
...
xyz = abc; // Error
```

当然也有特殊的类型转换方式，比如将 `Class Integer` 转换为 `double`  

```cpp
class Integer {
  int i;
public:
  operator double() const {
    return this.i;
  }
};
Integer a;
double b = 1.0 * a; // Integer -> double
```

一般建议别用，在遇到两个类差的很少的话很容易出现打错字然后编译器自动类型转换导致的非预期错误 `debug` 半天，可以使用这样的函数更安全  

```cpp
double toDouble() const;
```



## 流的重载

```cpp
class A {
private:
    int it;
public:
    A () {}
    friend std::istream& operator>> (std::istream& is, A &a) {
        is >> a.it;
        return is;
    }
    friend std::ostream& operator<< (std::ostream& os, A &a) {
        os << a.it;
        return os;
    }
};

std::ostream& tab(std::ostream& out) {
    return out << '\t';
}

int main () {	
    std::cout << "Hello" << tab << "World!" << std::endl;
    A a;
    std::cin >> a;
    std::cout << a;
}
```



## 多线程

```cpp
class ThreadData { // 线程数据类
private:
    int a, b;
    int thread_id;
public:
    ThreadData (int a, int b, int id): a(a), b(b), thread_id(id) {}
    ThreadData () {}
    ~ThreadData() {}
    int getA () { return a; }
    int getB () { return b; }
    int getSum () { return getA() + getB(); }
    int getTreadId () { return thread_id; }
};

void *printHello (void *threaddata) {
    ThreadData td = *((ThreadData*)threaddata);
    std::cout << "线程: " << td.getA() << "+" << td.getB() << "=" << td.getSum() << "  ID: " << td.getTreadId() << std::endl;
    pthread_exit(NULL);
}

int main () {
    pthread_t threads[5]; // 定义线程变量
    ThreadData td[5];     // 定义线程参数
    for (int i = 0; i < 5; i ++) {
        std::cout << "main(): 创建线程" << i << std::endl; 
        td[i] = ThreadData(i, i + 1, i);
        int rc = pthread_create(&threads[i], NULL, printHello, (void*)&(td[i])); // 创建线程并传入数据
        if (rc) {
            std::cout << "Error: 无法创建线程 " << rc << std::endl;
            exit(-1);
        }
    }
    pthread_exit(NULL);
}
```

## 模板

想造一个 `list` ，可以放 `X` 类也可以放 `Y` 类  

1.克隆代码，码量复杂  
2.存放 `void*`，但类型不安全  
3.`template`  

```cpp
template<class T>
void swap (T& x, T& y) {
  T temp = x;
  x = y;
  y = temp;
}
```

且上面的代码是一个声明而不是一个定义，编译器看到后什么也不干就记下来，然后遇到使用此函数模板后种植出一个函数来使用，在最终的代码是存在这个新增函数的

> 这叫做**函数模板**，而不叫模板函数，两者有很大区别，模板函数类似于重载函数，每个函数体内可以执行不同动作，但同一个函数模板实例化后的模板函数都必须执行相同动作   
> 类模板和模板类也同理，模板类是类模板实例化后的产物    

但有问题就是如果调用 `swap(int, double)` 是不行的，甚至自动转换也被忽略了   

然后补充一下上面的也可以这么做  

```cpp
template<class T>
void foo (void) { /* ... */ }

foo<int>(); // OK
foo<float>(); // OK
```

类模板写法相仿，都是在最上面写一个 `template<class T>` ，这里就不放例子了   
但是要注意一点是，在类模板.cpp内定义其中的函数时，每一个函数都是一个函数模板，也要各自加上 `template<class T>` ，且该类也要变成 `类<T>::`，比如  

```cpp
// Integer.h
template<class T>
class Integer {
public:
  Integer(T);
};
// Integer.cpp
template<class T>
Integer<T>::Integer (T t) { ... }
```

## 异常捕捉

在 `throw` 时，如果说本函数内这个 `throw` 身处一个 `try {} catch () {}` 内，那么它会执行 `catch` 内的语句，否则它会将调用本函数的语句变成一个 `throw` 进入上一层继续执行本判断，例如  

```cpp
int a (int i) {
  if (i == 0) {
   	throw i; 
  }
  return i;
}
void b (int i) {
  int x = a(i); // 如果 a 中 throw 了，那么这句话会变成 throw
}
void c () {
  try {
    b(); // 此时如果变成 throw ，那么会被 catch
  } catch (int e) {
    ...
    // 当然，这里还可以继续 throw ，目的是当前处理权限不合适，希望让更高的层级看到然后进行调整
  }
}
```

有一种万能捕捉器 `catch(...)`  

```cpp
try {
  /*调用的函数*/
} catch (...) { // ... 是 c++ 语法，而不是省略
  
}
```

也可以有多种 `catch`  

```cpp
try {
  throw B();
} catch (A& e) {
  
} catch (B& e) { // catch
  
} catch (...) {
  
}
```

还有操作，可以写一个  

```cpp
void abc (int a) : throw(MathError, NumError) {
  /*...*/
}
```

意义是告诉别的程序，这个函数最多只会抛出 `MathError` 和 `NumError` 这两种异常