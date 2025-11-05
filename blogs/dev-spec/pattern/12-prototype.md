---
title: 创建型 - 原型(Prototype)
---

## 概述

原型模式解决了**在实例化后还要经过复杂的初始化过程的类的创建**、**需要频繁创建相似对象**等问题。  
方法是通过对某个已初始化对象(原型)属性的直接复制，来跳过后续对象初始化的过程。  

常见使用场景有查询数据库创建DO对象、游戏NPC创建等...  

## 实现

通过两个类即可简单描述该模式。  

![原型模式.drawio](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/原型模式.drawio.svg)

先做一个写了 `clone` 方法的原型类

```java
// Prototype.java

public class Prototype {

    private String msg;


    public Prototype (String msg) {
        this.msg = msg;
    }

    public Prototype myClone () {
        return new Prototype(msg);
    }
}
```

然后是调用，就实例化一个出来后一直 clone 就行。  

```java
/// Client.java

public class Client {
    
    public void operate () {
        Prototype prototype = new Prototype("666");
        Prototype prototype1 = prototype.myClone();
    }
    
}
```

## 延伸

### Spring Bean 的单例、原型

这里提一个最常见的 —— Spring-Bean。  
Bean有个配置

```java
@Component
@Scope("prototype")
public class Prototype {
    ...
}
```

它的作用是让每次获取到的 Bean 都是不一样的，但是它和我们这里说的对已成型的原型对象进行 `clone` 的思想不一样。  
它实际上就是在 `org.springframework.beans.factory.support.AbstractBeanFactory#doGetBean` 中走到这里    
![20250220190943](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20250220190943.png)  
每次反射调用构造函数实例化出来一个。  
![20250220191228](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20250220191228.png)  

而不加这个 `@Scope` 注解的 Bean 默认是单例饿汉的，想要验证这两个配置也很简单。  

### 验证

先写两个 Bean ，一个加配置一个不加  

```java
@Component
public class Singleton {

    public Singleton() {
        System.out.println("Singleton 创建");
    }

}

@Component
@Scope("prototype")
public class Prototype {

    public Prototype () {
        System.out.println("Prototype 创建");
    }

}
```

然后再写个 Bean 在 `@PostConstruct` 里面测试它们分别取两个 Bean 实例，互相比较一下引用。  

```java
@Component
public class TestBean {

    @Autowired
    private ApplicationContext applicationContext;
    
    @PostConstruct
    public void test () {
        System.out.println("------------------- TestBean.test -------------------");

        Prototype prototype1 = applicationContext.getBean(Prototype.class);
        Prototype prototype2 = applicationContext.getBean(Prototype.class);
        System.out.println("prototype1 == prototype2 : " + (prototype1 == prototype2));

        Singleton singleton1 = applicationContext.getBean(Singleton.class);
        Singleton singleton2 = applicationContext.getBean(Singleton.class);
        System.out.println("singleton1 == singleton2 : " + (singleton1 == singleton2));
    }
}
```

此时运行输出可以看到

![20250220191828](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20250220191828.png)

这里说明了 `Singleton` 类在 `test()` 执行之前就已经调用构造函数实例化完毕，后续每次 `getBean(..)` 都是拿到了同一个类。  
而 `Prototype` 类则是在执行 `getBean(...)` 的时候调用构造函数实例化，拿到的是不同的类。  