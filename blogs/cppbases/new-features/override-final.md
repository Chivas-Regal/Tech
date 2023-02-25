---
title: override 与 final
---

## override

`override` 意为重写，这种事情会发生在子类父类继承的虚函数中，但是为什么有 `virtual` 了还要加上这个关键字呢？  
看一下在下面这种情况发生：  

```cpp
class Base {
public:
    virtual void func () const {
        std::cout << "This is from Base" << std::endl;
    }
};

class Derived : public Base {
public:
    virtual void func () {
        std::cout << "This is from Dervied" << std::endl;
    }
};

int main () {
    ((Base*)(new Derived()))->func();
}
```

我们这里就是一个简单的多态性的体现，`Work()` 的参数 `base` 也可以实现 `Derived` 类的函数，可是事实却并非如此  

```cpp
/*
Output:
This is from Base
*/
```

这个问题可能容易看出来是由于少加了个 `const` 导致这其实并没有成功构成重写，只是在原有基础上多加了个函数而已  
而由此可见在派生虚函数时会有一些错误很难发现，导致我们多态失败了  
而此时如果加上一个 `override` 即

```cpp
...
class Derived : public Base {
public:
    virtual void func () override {
        std::cout << "This is from Dervied" << std::endl;
    }
};
...

/*
ERROR log:

main.cpp:45:18: error: 'func' marked 'override' but does not override any member functions
    virtual void func () override { 
                 ^
1 error generated.
*/
```

这样就检查到了问题所在  
而事实上我们在学虚函数、派生类、多态性的时候，会了解到其实子类完全不需要加 `virtual` ，加了只是为了让程序易读，凸显出来这是一个重写的虚函数  
但是它会出现我们上面说的情况，而 `override` 不仅可以说明这是重写虚函数，也可以帮助查错，所以我们派生类在重写虚函数时，都加上这个可以更加方便按去哪  
即：  

```cpp
class Base {
public:
    virtual void func () const {
        std::cout << "This is from Base" << std::endl;
    }
};

class Derived : public Base {
public:
    void func () const override { 
        std::cout << "This is from Dervied" << std::endl;
    }
};

int main () {
    ((Base*)(new Derived()))->func();
}

/*
Output:
This is from Dervied
*/
```

## final
  
### 禁止继承

这里有一套基类，派生类，派生派生类

```cpp
class Base {
public:
    virtual void func () const {
        std::cout << "This is from Base" << std::endl;
    }
};

class Derived : public Base {
public:
    void func () const override { 
        std::cout << "This is from Dervied" << std::endl;
    }
};

class DerivedAgain : public Derived {
public:
    void func () const override {
        std::cout << "This is from DerivedAgain" << std::endl;
    }
};
```

它们在 `((Base*)(new DerivedAgain()))->func();` 都能实现正常的多态  
此时如果我们写好了 `Base` 后不希望它被继承，可以给其加一个 `final` 标记  

```cpp
class Base final {
...
```

这样后面的两个派生类都会报错  
如果要对 `Derived` 添加 `final` ，加在这里  

```cpp
...
class Derived final : public Base {
...
```

这样后面的 `DerivedAgain` 会报错  


### 禁止重写

和上面类似，我们设计了一个 `Base` 内的接口函数，并在它的派生类 `Derived` 中重写了这个接口  
如果此时 `Derived` 的派生类可以再次重写这个接口，实现接口多态  

```cpp
class Base {
public:
    void func () const {
        std::cout << "This is from " << dontChangeMe() << std::endl;
    }
private:
    virtual std::string dontChangeMe() const = 0;
};

class Derived : public Base {
private:
    std::string dontChangeMe() const override {
        return "Derived";
    }
};

class DerivedAgain : public Derived {
private:
    std::string dontChangeMe() const override {
        return "DerivedAgain";
    }
};

int main () {
    ((Base*)(new DerivedAgain()))->func();
    ((Base*)(new Derived()))->func();
}

/*
Output:
This is from DerivedAgain
This is from Derived
*/
```

但如果我们**不希望**这个接口函数被多次重载，也就是我们这里设置的函数名”不要改变我“  
可以将 `final` 标记在最后一个重载函数上  

```cpp
...
class Derived : public Base {
private:
    std::string dontChangeMe() const override final {
        return "Derived";
    }
};
...
```

这样 `DerivedAgain` 的这个函数就会报错了