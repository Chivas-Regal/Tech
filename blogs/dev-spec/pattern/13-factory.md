---
title: 创建型 - 工厂(Factory)
---

## 反面教材

先看一个针对“支付”逻辑的方法的丑陋设计。

<CodeTabs :titles="['服务端', '客户端']">
<template v-slot:tab-0>

```java
public interface Payment { public void pay(double amount); }
public class AlipayPayment implements Payment { ... }
public class WechatPayment implements Payment { ... }
...
```
</template>
<template v-slot:tab-1>

```java
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
</template>
</CodeTabs>

这段逻辑存在的问题：
- **耦合性太高**，客户端必须清晰知道服务端的具体产品类名；
- **内聚性太差**，服务端的类松散地散布在客户端的各处，一旦服务端需要改造模型，会对客户端带来大量的迭代成本；  

客户端需要将服务端的类名硬编码进程序中，随着逻辑扩张，一旦需要新增具体“支付类”实现，都有可能同时令客户端产生较大改动。  
一句直白且抽象的话就是：<mark><b>同一类事物的构造与选择，被写成了一块儿屎山。</b></mark>

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

<CodeTabs :titles="['服务端', '客户端']">
<template v-slot:tab-0>

```java
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
```
</template>
<template v-slot:tab-1>

```java
public class OrderService {

    public void pay(String payType, double amount) {
        Payment payment = PaymentFactory.create(payType);
        payment.pay(amount);
    }
}
```
</template>
</CodeTabs>

可以看到这样做后，客户端的抽象性大大提高（洁癖人士狂喜）。  
虽然仍需编写具体的 `payType` 字符串，但是这种字符串就可以通过“配置”或“从数据库中取”，做到运行时动态选择产品类。  
并且在需要针对指定的 `payType`，替换具体的 Payment 时，仅需改动服务端即可。  

![简单工厂.drawio](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/简单工厂.drawio.svg)

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

![工厂方法.drawio](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/工厂方法.drawio.svg)

<CodeTabs :titles="['服务端', '客户端']">
<template v-slot:tab-0>

```java
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
```
</template>
<template v-slot:tab-1>

```java
public class OrderService {

    public void pay(PaymentFactory factory, double amount) {
        Payment payment = factory.create();
        payment.pay(amount);
    }
}
```
</template>
</CodeTabs>


当然客户端对工厂的使用方式可以很多样，如
- 通过配置文件配置具体类，用 `@Resources` 在 `OrderService` 自动装配 `PaymentFactory`
- 参数仍使用 `String payType`，自动装配 `List<PaymentFactory>` 后通过注册表动态选择
- ...

工厂方法针对同一类产品的生产完成了解耦，而事实上如果出现了多个功能并不统一的产品，一个工厂可能要负责很多种产品的生产。  
仍沿用上面的案例，支付工具不仅可用做支付，还可以收款、退款...。这时就可以将一个支付工具视作一个工厂，而它生产的是一套产品族，所以就不能单单使用一个生产方法完成需求了。  
于是就引入我们下面的**抽象工厂**。  

## 抽象工厂

::: tip
目标：提高工厂功能的多样化，使其适应多种产品的生产。  
:::

根据上面说的，需要在一个工厂内设计更多的生产方法。  

![抽象工厂.drawio](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/抽象工厂.drawio.svg)

<CodeTabs :titles="['服务端', '客户端']">
<template v-slot:tab-0>

```java
// 支付的抽象与实现类
public interface Payment { public void pay(double amount); }
public class WechatPayment implements Payment { ... }
public class AlipayPayment implements Payment { ... }

// 收款的抽象与实现类
public interface Receipt { public void receive(double amount); }
public class WechatReceipt implements Receipt { ... }
public class AlipayReceipt implements Receipt { ... }

// 抽象工厂，生产支付与收款类
public interface Factory {
    public Payment createPayment ();
    public Receipt createReceipt ();
}
public class WechatFactory implements Factory { ... }
public class AlipayFactory implements Factory { ... }
```
</template>
<template v-slot:tab-1>

```java
public class OrderService {
    // 模拟交易逻辑，付款再收款
    public void order(Factory factory, double amount) {
        Payment payment = factory.createPayment();
        Receipt receipt = factory.createReceipt();
        payment.pay(amount);
        receipt.receive(amount);
    }
}
```
</template>
</CodeTabs>

在使用上可以看出和工厂方法差不太多，只是使用前需要对大量的产品进行合理拆分为一套套产品族，使用之前一定要构思清楚。  

## 问题&理解

**搞成工厂方法/抽象工厂之后，不又回到将具体类硬编码进客户端的情况了？** 

工厂方法并不是完全解决硬编码的存在性，而是将其收束进统一的位置。  
从改造结果来看，唯一硬编码的就是具体工厂类名，这一点完全可以通过反射、注册表等方式来解决。通过这若有若无的一处硬编码，解决了“具体产品的实例化被分散进工程的各个位置造成污染”的问题。  
如果是之前的产品类的方式，使用什么反射注册表的方法是不行的，因为产品对象的生命周期很短，且实例化的过程中可能还有其他逻辑。


## 取舍

在设计的选择上  

**简单工厂** 适用于少量简单的产品生产
- 产品的生产过程统一管理。
- 代码简单，认知成本低。

**工厂方法** 适用于大量产品生产与复杂的项目逻辑
- 易于修改、管理大量具体产品。
- 符合工程的开闭原则、单一职责。  
- 易于结合Spring-Ioc自动装配、注册表灵活设计。

**抽象工厂** 适用于在工厂方法的基础上，延伸出产品族概念的二维产品体系
- 具备工厂方法的所有优点。
- 内聚性更强。