---
title: 创建型 - 单例(Singleton)
---

## 概述

单例模式是一种创建型设计模式，解决了**频繁对某一个类实例化全局访问对象与销毁**的行为。  
这种模式通常不允许其他类对其实例化，将这一类的构造方法私有化，然后它内部将其实例化后对外提供该对象的 `getter`。  

![单例模式](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/单例模式.svg)


单例模式的具体实现分为**饿汉**和**懒汉**：
- 饿汉：从程序加载之初就创建好一个单例供外界使用。
- 懒汉：懒加载，当第一次 `getInstance()` 被调用后才执行单例的创建。

## 饿汉实现

直接在成员属性 `instance` 后面执行 new 实例化就行了。  


```java
public class Singleton {

    // 程序一加载直接实例化
    private static Singleton instance = new Singleton();

    private Singleton () {}

    public static Singleton getInstance () {
        return instance;
    }
}
```

## 懒汉实现

要实现懒加载，那很好想就是成员对象 `instance` 不直接实例化，反而放在 `getInstance` 里面做就行了。  

### 线程不安全

```java
...
    private static Singleton instance;

    public static Singleton getInstance () {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
...
```

注意这里我标上了“线程不安全”，因为如果并发状态下一开始多个线程同时通过 null 判断，那么会多次 new 将其实例化。  
想安全些也很简单，下面给 `getInstance` 加个同步锁。  

### 线程安全

**实现1**  

```java
...
    public static synchronized Singleton getInstance () {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
...
```

**实现2** 

```java
...
    public static Singleton getInstance () {
        // 线程安全
        synchronized(Singleton.class) {
            if (instance == null) {
                instance = new Singleton();
            }
        }
        return instance;
    }
...
```

实现2就是将方法维度的同步锁下拉到方法第一行了，也没什么难理解的，但为了更好理解下面的优化，作者将通过“实现2”起手进行讲解。  
上面这样做意味着所有调用 `getInstance` 的行为全变成串行了，实际上我们要防止并发 new 问题，只需要在 instance=null 的时候加个锁，因此为加锁前添加一个 null 判断。  
这种校验方式有个比较高大上的名字，**“双检锁”**

### 线程安全：双检锁优化

```java
...
    public static Singleton getInstance () {
        // 细化串行时机
        if (instance == null) {
            // 线程安全
            synchronized(Singleton.class) {
                if (instance == null) {
                    instance = new Singleton();
                }
            }
        }
        return instance;
    }
...
```

### 静态内部类

我们也可以利用静态内部类的加载时机（第一次被调用时），将与饿汉类似的写法放进静态内部类里面，让 instance 对于静态内部类饿汉，而静态内部类又是对于外界懒汉的。  
通过这样来更简单地实现 instance 对外界懒汉的模式。    

```java
public class Singleton {

    private Singleton () {}

    private static class Holder {
        // instance 由 Holder 加载时实例化
        // Holder 由 getInstance() 第一次调用它时实例化
        private static Singleton instance = new Singleton();
    }

    public static Singleton getInstance () {
        return Holder.instance;
    }
}
```

### 枚举类

但是上面的写法是很规范了，但是这些 private 是拦不住反射的。  
所以和静态内部类机制差不多，但能抵御反射、序列化操作的，就是枚举。  

<mark>当一个枚举类下，某个枚举值被调用时，该枚举类下所有枚举值会全部加载。</mark>

```java
public enum Singleton {
    INSTANCE;
}
```

## 扩展 - 多例模式

多例其实就是从单例的简单扩展，为了解决**如何根据参数，返回不同的实例**的问题。  
这里用饿汉模式做个例子吧

```java
public class Multiton {

    // 存放多例
    private static final ConcurrentMap<Integer, Multiton> instances = new ConcurrentHashMap<>();
    // 饿汉生成
    static {
        instances.put(1, new Multiton(10));
        instances.put(2, new Multiton(20));
    }

    @Getter
    private int val;
    private Multiton (int val) {
        this.val = val;
    }

    public static Multiton getInstance (int id) {
        return instances.get(id);
    }

}
```

如果用懒汉的话，需要注意资源上限的问题，也就是说如果可以填入无限种参数，肯定不能生成无限个实例，不然早晚内存爆炸。  

## 应用场景

1. 全局配置
2. 日志记录器
3. 计数器
4. 文件系统
5. Spring-Ioc容器的Bean管理
6. ...... 

个人认为池化技术是不属于单/多例的，毕竟池化涉及到被池化对象的释放，而单/多例模式下实例化的对象是在程序运行过程中保留的。  

*如果看到这里实在想去做一下什么连接池、资源池的，建议做之前好好思考下资源释放的时机。*

