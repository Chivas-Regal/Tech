---
title: 鸭子类型
---

::: tip
" When I see a bird that walks like a duck and swims like a duck and quacks like a duck, I call that bird a duck. - James Whitcomb Riley, 1849-1916"
:::

鸭子类型的说法本来是从 `python` 这种支持动态编译的语言中来的  

```py
class Duck:
    def shout(self):
        print("Duck shout")
    def fly(self):
        print("Duck fly")

class Goose:
    def shout(self):
        print("Goose shout")
    def fly(self):
        print("Goose fly")

class Dog: 
    def walk(self):
        print("Dog walk")
    def wolf(self):
        print("Dog wolf")

def test (bird):
    bird.shout()
    bird.fly()

test(Duck())  # OK: output -> "Duck shout\nDuck fly\n"
test(Goose()) # OK: output -> "Goose shout\nGoose fly\n"
test(Dog())   # ERROR
```

这里传进去的鸟可以叫和飞，如果我们说它是鸭子那它就是鸭子的行为，如果说是鹅那这就是鹅的行为，但狗不会这两个动作，所以说它是狗这是不对的    
这也体现了一种**多态性**

而我们可以利用前面 [模板SFINAE](./6-SFINAE.html) 来模拟出这种功能  

对 `test` 函数添加两个判断检测参数 `bird` 是否含有 `fly()` 和 `shout()`  两种动作  

```cpp
template<typename T>
void test (T&& bird,
           decltype(bird.fly())* func1 = nullptr,
           decltype(bird.shout())* func2 = nullptr) {
    bird.fly();
    bird.shout();
}
```

都有的话满足要求可以执行函数体内容  

```cpp
class Duck {
public:
    void fly () {
        std::cout << "Duck fly\n";
    }
    void shout () {
        std::cout << "Duck shout\n";
    }
};
class Goose {
public:
    void fly () {
        std::cout << "Goose fly\n";
    }
    void shout () {
        std::cout << "Goose shout\n";
    }
};
class Dog {
public:
    void walk () {
        std::cout << "Dog walk\n";
    }
    void wolf () {
        std::cout << "Dog wolf\n";
    }
};
int main () {
    test(Duck()); // OK: 输出和上面一样
    test(Goose()); // OK: 输出和上面一样
    test(Dog()); // ERROR
}
```

解释在上面对 `.py` 代码的解释中也可体现