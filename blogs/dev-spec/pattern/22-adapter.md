---
title: 结构型 - 适配器(Adapter)
---

## 概述

适配器可以将一个类的接口转化为客户端所期望的另一种接口，使得原本因接口不兼容导致不能一起工作的类可以协同工作。

## 实现

![适配器.drawio](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/适配器.drawio.svg)

有两种实现方式
- 类适配器（通过继承实现）
- 对象适配器（通过组合实现）

凭借组合优于继承的条件，对象适配器往往更加灵活。

### 对象适配器（组合）

**场景：电压转换器**  
假如我们有个 220V 电压的电源，但是给手机充电只需要 5V 的电压。  

:::: code-group
::: code-group-item 5V接口
```java
public interface VoltageV5 {
    int getV5();
}
```
:::
::: code-group-item 220V电源
```java
public class VoltageV220 {
    public int getV220() {
        return 220;
    }
}
```
:::
::: code-group-item 220V转5V适配器
```java
public class VoltageV220ToV5Adapter implements VoltageV5 {
    private VoltageV220 v220;
    
    public VoltageV220ToV5Adapter(VoltageV220 v220) {
        this.v220 = v220;
    }
    @Override
    public int getV5() {
        return v220.getV220() / 44;
    }
}
```
:::
::::

客户端则是可以统一使用 5V 接口完成多态调用。

:::: code-group
::: code-group-item 客户端：手机充电器
```java
public class Phone {
    public void charging (VoltageV5 v5) {
        if (v5.getV5() == 5) {
            log.info("电压正常，开始充电...");
            ...
        } else {
            log.info("电压异常，即将爆炸!!!");
        }
    }
}
```
:::
::: code-group-item 测试代码
```java
public class Test {
    public static void main (String[] args) {
        VoltageV5 v5 = new VoltageV220ToV5Adapter();
        Phone phone = new Phone();
        phone.charging(v5);
    }
}
```
:::
::::

### 类适配器（继承）

此处直接展示 VoltageV220ToV5Adapter 的写法

```java
public class VoltageV220ToV5Adapter extends VoltageV220 implements VoltageV5 {
    @Override
    public int getV5() {
        return getV220() / 44;
    }
}
```

## 实际应用-日志框架兼容

这是一个老生常谈的问题了，项目中存在多个第三方日志工具，需要把它们统一起来，但是各个日志工具打印日志方法名又不同。

:::: code-group
::: code-group-item 日志接口
```java
public interface Logger {
    void log(String msg);
}
```
:::
::: code-group-item 适配器与第三方日志A
```java
// 第三方日志
public class LoggerA {
    public void logMessage (String msg) {
        System.out.println("[LoggerA]" + msg);
    }
}
// 适配器
public class Adapter4LoggerA implements Logger {
    private LoggerA loggerA;
    
    public Adapter4LoggerA(LoggerA loggerA) {
        this.loggerA = loggerA;
    }
    @Override
    public void log(String msg) {
        loggerA.logMessage(msg);
    }
}
```
:::
::: code-group-item 适配器与第三方日志B
```java
// 第三方日志
public class LoggerB {
    public void showIt (String msg) {
        System.out.println("[LoggerB]" + msg);
    }
}
// 适配器
public class Adapter4LoggerB implements Logger {
    private LoggerB loggerB;
    
    public Adapter4LoggerB(LoggerB loggerB) {
        this.loggerB = loggerB;
    }
    @Override
    public void log(String msg) {
        loggerB.showIt(msg);
    }
}
```
:::
::::