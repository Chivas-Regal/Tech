---
title: 创建型 - 工厂方法(Factory)
---

## 反面教材

先看一个针对“支付”逻辑的方法的丑陋设计。

```java
// 服务端 ---
public interface Payment { public void pay(double amount); }
public class AlipayPayment implements Payment { ... }
public class WechatPayment implements Payment { ... }
...

// 客户端 ---
public class OrderService {

    public void pay(String payType, double amount) {
        // 支付宝
        if (payType.equals("alipay")) {
            AlipayPayment payment = new AlipayPayment() {{
                setXXX(...);
            }};
            payment.pay(amount);
        // 微信
        } else if (payType.equals("wechat")) {
            WechatPayment payment = new WechatPayment() {{
                setXXX(...);
            }};
            payment.pay(amount);
        // 银联
        } else if (payType.equals("union")) {
            UnionPayment payment = new UnionPayment() {{
                setXXX(...);
            }};
            payment.pay(amount);
        }
    }
}
```

这段逻辑存在的问题：**耦合性太高**。
客户端需要将服务端的类名硬编码进程序中，随着逻辑扩张，一旦需要新增具体“支付类”实现，都有可能同时令客户端产生较大改动。

为了解决这个问题，就可以引入我们下面的工厂模式。

## 概述

工厂模式
- 通过**将具体产品实例化的过程提取到服务端**，解决客户端直接依赖具体产品的行为。
- **把"创建什么对象"的决策权从客户端代码中剥离出来**，实现创建逻辑与使用逻辑的分离。

工厂体系较为复杂，有简单工厂、工厂方法、抽象工厂，其中简单工厂并不算真正意义上的 “设计模式”，但又是工厂模式迭代时的前置思维。
因此本文会将简单工厂也一起带过。

## 简单工厂

::: tip
目标：将产品类的生产（构造、赋值过程）与选择提到服务端的编码实现中。  
:::

简单分析一下开头的反面教材，整体逻辑只有两部分
- 根据 payType 选择支付类并实例化
- 支付类.pay()

第一条客户端关注的仅有“选择”，服务端可以承包实例化的过程。

```java
// 服务端 ---
public class PaymentFactory {

    public static Payment create (String payType) {
        switch (payType) {
            // 支付宝
            case "alipay":
                return new AlipayPayment() {{
                    setXXX(...);
                }};
            // 微信
            case "wechat":
                return new WechatPayment() {{
                    setXXX(...);
                }};
            // 银联
            case "union":
                return new UnionPayment() {{
                    setXXX(...);
                }};
            // ...
        }
        return null;
    }
}

// 客户端 ---
public class OrderService {

    public void pay(String payType, double amount) {
        Payment payment = PaymentFactory.create(payType);
        payment.pay(amount);
    }
}
```

可以看到这样做后，客户端的抽象性大大提高（洁癖人士狂喜）。  
虽然仍需编写具体的 `payType` 字符串，但是这种字符串就可以通过“配置”或“从数据库中取”，做到运行时动态选择产品类。  
并且在需要针对指定的 `payType`，替换具体的 Payment 时，仅需改动服务端即可。  

但这种简单工厂也存在问题：
- 随着具体产品类变多，以及实例化过程变得复杂，单一一个工厂类下的一个方法会变得冗杂。
- 每一次添加产品，都需要变更简单工厂的生产方法。  

于是从**工厂方法**这一设计模式，就可以了解到如何对其进行拆解。  

## 工厂方法

::: tip
目标：提高工厂的抽象性，支持工厂对扩展开放，对修改关闭（开闭原则）。
:::

根据上面说的，在服务端需要拆分工厂，做到一个具体产品对应一个具体工厂。   
这样在添加具体产品类时，只需要同时新增一个具体工厂即可，无需修改已有代码。  

```java
// 服务端 --
public interface PaymentFactory {
    public Payment create ();
}
public class AlipayPaymentFactory implements PaymentFactory {
    @Override
    public Payment create () {
        return new AlipayPayment() {{
            setXXX(...);
        }};
    }
}
public class WechatPaymentFactory implements PaymentFactory {
    ...
}
...

// 客户端 --
public class OrderService {

    public void pay(PaymentFactory factory, double amount) {
        Payment payment = factory.create(payType);
        payment.pay(amount);
    }
}
```

当然客户端对工厂的使用方式可以很多样，如
- 通过配置文件配置具体类，用 `@Resources` 在 `OrderService` 自动装配 `PaymentFactory`
- 参数仍使用 `String payType`，自动装配 `List<PaymentFactory>` 后通过注册表动态选择
- ...


## 问题&理解

**搞成工厂方法之后，不又回到将具体类硬编码进客户端的情况了？** 

工厂方法并不是完全解决硬编码的存在性，而是将其收束进统一的位置。  
从改造结果来看，唯一硬编码的就是具体工厂类名，这一点完全可以通过反射、注册表等方式来做。通过这仅有的一处硬编码，解决了“具体产品的实例化被分散进工程的各个位置造成污染”的问题。  
如果是之前的产品类的方式，使用什么反射注册表是不行的，因为产品对象的生命周期很短，且实例化的过程中可能还有其他逻辑。


## 取舍

在设计的选择上  

**简单工厂** 适用于少量简单的产品生产
- 产品的生产过程统一管理。
- 代码简单，认知成本低。

**工厂方法** 适用于大量产品生产与复杂的项目逻辑
- 易于修改、管理大量具体产品。
- 符合工程的开闭原则、单一职责。  
- 易于结合Spring-Ioc自动装配、注册表灵活设计。