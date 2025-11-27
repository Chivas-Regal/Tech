---
title: 结构型 - 外观(Facade)
---

## 概述

当系统存在多个子系统或复杂的类层次结构时，客户端需要与多个复杂的接口交互，学习成本较高。  
外观模式就是**为了完成某个目的，将复杂且微观的子系统/类交互过程，封装到一个方法内。** 这样隐藏了系统的复杂性，并且降低了客户端与系统的耦合性。  

简单来说，就是系统给用户提供了一个 “一键XX” 的能力。  

## 实现

![外观模式.drawio](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/外观模式.drawio.svg)

这里以电脑开机举例，即使有再多的硬件变化，整个开电脑的触发被整理成了一个 “开机键”。

:::: code-group
::: code-group-item 子系统
```java
class CPU {
    public void start() {
        System.out.println("CPU启动");
    }
}

class Memory {
    public void load() {
        System.out.println("内存加载数据");
    }
}

class Disk {
    public void read() {
        System.out.println("硬盘读取系统");
    }
}
```
:::
::: code-group-item 外观类
```java
class Computer {
    private CPU cpu;
    private Memory memory;
    private Disk disk;
    
    public Computer() {
        this.cpu = new CPU();
        this.memory = new Memory();
        this.disk = new Disk();
    }
    
    // 一键开机
    public void start() {
        cpu.start();
        memory.load();
        disk.read();
        System.out.println("电脑启动完成！");
    }
}
```
:::
::: code-group-item Client
```java
public class Client {
    public static void main(String[] args) {
        Computer computer = new Computer();
        computer.start();
    }
}
```
:::
::::

看起来好像外观模式就是简单的封装，其实思想差不多，只不过**外观模式组织的是多个独立子系统的调用**，普通封装组织的是自己的业务逻辑。  