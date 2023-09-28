---
title: 语法基础
---

## 访问修饰符

### 访问控制符

| 符号 | 作用 |
| --- | --- |
| $public$ | 共同的，支持跨类或跨包访问 |
| $protect$ | 保护的，支持同一包的类和任何子类访问 |
| $private$ | 私有的，仅可被同一类访问 |
| $default$ | 默认的，只允许同一包中进行访问 |

方法控制继承规则

* 父 ![](https://cdn.nlark.com/yuque/__latex/c0bd9424f7588878c84aa942a378c31c.svg)，子 ![](https://cdn.nlark.com/yuque/__latex/c0bd9424f7588878c84aa942a378c31c.svg)
* 父 ![](https://cdn.nlark.com/yuque/__latex/4ac723cf3eab5d87e5599f47e17f7cdc.svg)，子 ![](https://cdn.nlark.com/yuque/__latex/5235a50f127c0455340f8b87ed4b5eb4.svg)
* 父 ![](https://cdn.nlark.com/yuque/__latex/8d567fd1de30a271cee0e3eef35f16aa.svg)，子不能继承

### 非访问控制符

| 符号 | 作用 |
|-|-|
| $static$ | 静态内容均在程序开始的时候初始化或构建<ul><li>静态变量：一个类（包括子类）的所有实例共享一个变量</li><li>静态方法：不能使用类的非静态变量</li></ul>|
| $final$ | <ul><li>$final$ 变量：显式指定初始值，不可重新赋值</li><li>$final$方法：可以被子类继承但不能重写</li><li>$final$类：不可被继承</li></ul>|
| $abstract$ | <ul><li>抽象类：不能实例化</li><li>抽象方法：不能有，实现由子类完成</li></ul> |
| $synchronized$ | $synchronized$方法同一时间只可被一个线程访问 |
| $transient$ | 被$transient$修饰的成员属性变量可以不被序列化，反序列化时该变量值为$null$ |
| $volatile$ | 修饰的成员变量被访问时强制从共享内存中读取，修改也是写回到共享内存（任何时刻两个不同线程看到的总是变量同一个值） |

抽象方法：

```java
abstract class Base {
    protected int x;
    public abstract void ope ();
    public void print () {
        System.out.println("this.x = " + this.x);
    }
}
class Son extends Base {
    public void ope () {
        this.x = 10;
    }
}

public class Main {
    public static void main(String[] args) throws InterruptedException {
        Son son = new Son();
        son.ope();
        son.print();
    }
}
```
使用案例，输出 `this.x = 10`

## 面向对象

### 继承


一个例子理解四种关键字 `interface`、`extends`、`implements`、`super`

```java
interface If1 {
    public void printInIf1 ();
}
interface If2 {
    public void print ();
}
class Super {
    public void printInIf1 () {
        System.out.println("Same name in If1::printInIf1()");
    }
    public void print () {
        System.out.println("This is Super's' print");
    }
}
class Sub extends Super implements If1, If2 {
    public void print () {
        super.print();
        System.out.println("This is Sub's print");
    }
}

/**
 * --------------- Console Output:
 * Same name in If1::printInIf1()
 * This is Super's' print
 * This is Sub's print
 */
public class Main {
    public static void main(String[] args) throws InsufficientFundsException {
        Sub sub = new Sub();
        sub.printInIf1();
        sub.print();
    }
}
```

这里就是一个子类`Sub`用`extends`继承了`Super`，用`implements`继承了两个`interface`接口类
`Sub`

* print()函数既是对父类`Super`的print()的重写，也是对接口类`If2`的print()的实现
* printInIf1()继承自父类`Super`并已有实现，所以也是变相对接口类`If1`的printInIf1()实现了

### 接口

接口是为了向上转型，防止子类中出现父类没有的方法，多态下父类没法调用
有了接口可以存在一个有很多声明方法的接口父类，子类分别实现所需的方法

## ... 和 ... 的不同

### StringBuilder 和 StringBuffer 的不同

两个都是做字符串修改，但有不同，应结合场景使用

StringBuilder 更快，但线程不安全
StringBuffer 慢，但是线程安全

### 重定向和转发的不同

* 重定向：`response.sendRediret(....html)`
* 转发：`request.getRequestDispatcher("....html").forward(request, response)`

**重定向**

1. 客户端向服务端发送请求，服务端响应让客户端重定向
2. 客户端向目标服务发送请求，得到服务端响应

地址栏改变，request 存储的数据会丢失

**转发**

1. 客户端向服务端请求转发（一次请求）
2. 服务端收到后转发给目标服务（页面），得到目标服务响应
3. 服务端再将得到的响应回送给客户端。

地址栏显示请求页面的地址，request 存储的数据可以保存

