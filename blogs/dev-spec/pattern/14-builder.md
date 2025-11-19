---
title: 创建型 - 生成器/建造者(Builder)
---

**常见示例** 

```java
StringBuilder builder = new StringBuilder();
builder.append("Hello")
       .append(" ")
       .append("World")
       .append("!");
String result = builder.toString();
```

## 概述

::: danger 问题
有时候对于一个参数/属性十分复杂的类，在实例化时如果用构造方法，将会写入非常多的参数。    
并且若使用构造方法实例化的代码过多，在迭代时往里面加参数的话还需要考虑如何兼容（如保留原构造方法，新建一个全参构造方法；改掉所有原构造方法的使用处）。  
这样我们的代码往往不优雅，生成器模式正是在解决这类问题。  
:::

生成器类似于 setter 方法，做出多个给一到多个参数赋值的方法。  
能**指定产品的生产规范**，针对 “有很多参数/属性的复杂对象”，避免出现具备一堆参数的构造方法，提高**构造时的灵活性**（区分必填/选填参数）、**可读性**（填值时字段名透出）。    

但区别于 setter 的是，生成器通过链式调用，支持**创建不可变的完整对象**。      

## 实现

TODO 流程图
 
接下来将以电脑的生产举例。  

:::: code-group
::: code-group-item Computer
```java
public class Computer {
    // 必需参数
    private String CPU;
    private String RAM;
    
    // 可选参数
    private String GPU;
    private String storage;
    private String monitor;
    private boolean hasWifi;
    
    private Computer(Builder builder) {
        this.CPU = builder.CPU;
        this.RAM = builder.RAM;
        this.GPU = builder.GPU;
        this.storage = builder.storage;
        this.monitor = builder.monitor;
        this.hasWifi = builder.hasWifi;
    }
    
    public static ComputerBuilder builder(String CPU, String RAM) { return new ComputerBuilder(CPU, RAM); }
}
```
:::
::: code-group-item ComputerBuilder
```java
public class ComputerBuilder {
    // 必需参数
    private String CPU;
    private String RAM;
    
    // 可选参数 - 初始化默认值
    private String GPU = "集成显卡";
    private String storage = "256GB SSD";
    private String monitor = "无";
    private boolean hasWifi = false;
    
    public ComputerBuilder(String CPU, String RAM) {
        this.CPU = CPU;
        this.RAM = RAM;
    }
    
    public Builder setGPU(String GPU) { this.GPU = GPU; return this; }
    public Builder setStorage(String storage) { this.storage = storage; return this; }
    public Builder setMonitor(String monitor) { this.monitor = monitor; return this; }
    public Builder setWifi(boolean hasWifi) { this.hasWifi = hasWifi; return this; }
    
    // 完工，执行实际产品的实例化
    public Computer build() {
        // 可以在这里添加验证逻辑
        if (CPU == null || CPU.isEmpty()) {
            throw new IllegalStateException("CPU不能为空");
        }
        if (RAM == null || RAM.isEmpty()) {
            throw new IllegalStateException("RAM不能为空");
        }
        return new Computer(this);
    }
}
```
:::
::: code-group-item Client
```java
Computer gamingPC = Computer.builder("Intel i9", "32GB")
    .setGPU("RTX 4090")
    .setStorage("2TB NVMe SSD")
    .setMonitor("4K 144Hz")
    .setWifi(true)
    .build();

Computer officePC = Computer.builder("Intel i5", "16GB")
    .setWifi(true)
    .build();
```
:::
::::

这便是大部分时候的使用方案，已经具备了属性选择填入的功能，而且比较灵活。  
但若产品的生成内容较为固定，想要定义产品生成的顺序，以及封装产品生成的逻辑，就需要一个用作管理这些的**指导者**。  

## 指导者

规范产品生成的顺序、封装产品生成的逻辑。  

TODO 流程图

我们仍按上面所使用的电脑生产来举例
- 由抽象、具体的生成器对电脑的硬件横向扩展（CPU型号、GPU型号...）
- 由指导者封装的不同方法对电脑的生产纵向扩展（简易电脑、高性能电脑...）

:::: code-group
::: code-group-item 产品类
```java
public class Computer {
    private String CPU;
    private String RAM;
    private String GPU;
    private String storage;
    private String monitor;
    private boolean hasWifi;

    public void setCPU(String CPU) { this.CPU = CPU; }
    public void setRAM(String RAM) { this.RAM = RAM; }
    public void setGPU(String GPU) { this.GPU = GPU; }
    public void setStorage(String storage) { this.storage = storage; }
    public void setMonitor(String monitor) { this.monitor = monitor; }
    public void setWifi(boolean hasWifi) { this.hasWifi = hasWifi; }

    @Override
    public String toString() {
        return "Computer{" +
                "CPU='" + CPU + '\'' +
                ", RAM='" + RAM + '\'' +
                ", GPU='" + GPU + '\'' +
                ", storage='" + storage + '\'' +
                ", monitor='" + monitor + '\'' +
                ", hasWifi=" + hasWifi +
                '}';
    }
}
```
:::
::: code-group-item 抽象生成器接口
```java
public interface ComputerBuilder {
    void reset();
    void buildCPU();
    void buildRAM();
    void buildGPU();
    void buildStorage();
    void buildMonitor();
    void buildWifi();
}
```
:::
::: code-group-item 具体生成器A
```java
// 游戏电脑
public class GamingComputerBuilder implements ComputerBuilder {
    private Computer computer;

    @Override
    public void reset() {
        this.computer = new Computer();
    }

    @Override
    public void buildCPU() { computer.setCPU("Intel i9-13900K"); }
    @Override
    public void buildRAM() { computer.setRAM("32GB DDR5"); }
    @Override
    public void buildGPU() { computer.setGPU("RTX 4090"); }
    @Override
    public void buildStorage() { computer.setStorage("2TB NVMe SSD"); }
    @Override
    public void buildMonitor() { computer.setMonitor("4K 144Hz"); }
    @Override
    public void buildWifi() { computer.setWifi(true); }

    public Computer getResult() {
        return this.computer;
    }
}
```
:::
::: code-group-item 具体生成器B
```java
// 办公电脑
public class OfficeComputerBuilder implements ComputerBuilder {
    private Computer computer;

    @Override
    public void reset() {
        this.computer = new Computer();
    }

    @Override
    public void buildCPU() { computer.setCPU("Intel i5-13400"); }
    @Override
    public void buildRAM() { computer.setRAM("16GB DDR4"); }
    @Override
    public void buildGPU() { computer.setGPU("集成显卡"); }
    @Override
    public void buildStorage() { computer.setStorage("512GB SSD"); }
    @Override
    public void buildMonitor() { computer.setMonitor("1080P 24寸"); }
    @Override
    public void buildWifi() { computer.setWifi(true); }

    public Computer getResult() {
        return this.computer;
    }
}
```
:::
::: code-group-item 主管类
```java
public class ComputerDirector {
    
    // 标准完整流程
    public void constructStandardComputer(ComputerBuilder builder) {
        builder.reset();
        builder.buildCPU();      // 步骤1
        builder.buildRAM();      // 步骤2
        builder.buildGPU();      // 步骤3
        builder.buildStorage();  // 步骤4
        builder.buildMonitor();  // 步骤5
        builder.buildWifi();     // 步骤6
    }
    
    // 快速流程（跳过显示器和WiFi）
    public void constructMinimalComputer(ComputerBuilder builder) {
        builder.reset();
        builder.buildCPU();
        builder.buildRAM();
        builder.buildGPU();
        builder.buildStorage();
    }
    
    // 性能优先流程（先装核心部件）
    public void constructPerformanceFirst(ComputerBuilder builder) {
        builder.reset();
        builder.buildCPU();      // 最重要
        builder.buildGPU();      // 第二重要
        builder.buildRAM();
        builder.buildStorage();
        builder.buildMonitor();
        builder.buildWifi();
    }
}
```
:::
::: code-group-item Client
```java
public class Client {
    public static void main(String[] args) {
        ComputerDirector director = new ComputerDirector();
        
        // 场景1：标准流程生产游戏电脑
        GamingComputerBuilder gamingBuilder = new GamingComputerBuilder();
        director.constructStandardComputer(gamingBuilder);
        Computer gamingPC = gamingBuilder.getResult();
        System.out.println("游戏电脑: " + gamingPC);
        
        // 场景2：标准流程生产办公电脑
        OfficeComputerBuilder officeBuilder = new OfficeComputerBuilder();
        director.constructStandardComputer(officeBuilder);
        Computer officePC = officeBuilder.getResult();
        System.out.println("办公电脑: " + officePC);
        
        // 场景3：快速流程生产游戏电脑
        GamingComputerBuilder quickBuilder = new GamingComputerBuilder();
        director.constructMinimalComputer(quickBuilder);
        Computer quickPC = quickBuilder.getResult();
        System.out.println("快速版: " + quickPC);
        
        // 场景4：性能优先流程
        GamingComputerBuilder perfBuilder = new GamingComputerBuilder();
        director.constructPerformanceFirst(perfBuilder);
        Computer perfPC = perfBuilder.getResult();
        System.out.println("性能优先: " + perfPC);
    }
}
```
:::
::::
