---
title: 结构型 - 桥接(Bridge)
---

::: danger 问题
当一个抽象系统具备多个抽象属性时，往往会出现非常多的子类。  
例如作几何画，一个几何图形具备“颜色”和“图案”两个抽象属性（如红色圆圈、黑色方块...），如果有 $n$ 个颜色、 $m$ 个图案，就会有 $n\times m$ 种具象体（或实现），若抽象属性多了话，实现的数量也是指数级增长，甚至仅仅想要在一个属性上加一个值（如“颜色”属性加一个绿色，就要增加 $m$ 个实现）  

```java
class RedCircle extends Shape { draw(){ return "红○"; }}
class RedSquare extends Shape { draw(){ return "红□"; }}
class BlackCircle extends Shape { ... }
class BlackSquare extends Shape { ... }
...
```
:::

通过桥接模式，可以将 $n\times m$ 个实现降至 $n+m$ 个。

## 概述

> 桥接模式将将抽象部分与实现部分分离，使它们可以独立变化。

上面这句话太绕了，而且涉及术语概念不相通的问题，不讲不讲。  
我的理解就是**将多属性的单一抽象系统，拆为单属性的多个抽象系统，再将多个抽象系统组合在一起**，完成桥接。  

针对本文开头的问题，可以将“颜色”抽离出去变成独立的抽象系统，然后将其作为属性注入到“图案”中，先简单看一下是怎么做的。  

```java
class Red extends Color {}
class Black extends Color {}

abstract class Shape {
    private Color color;
}
class Circle extends Shape {}
class Square extends Shape {}
```

::: details 想了解概述第一句术语的看这里

主要就是下面这两个关键词的解释。

- 抽象部分：对应上面的 Shape 类，持有实现方的接口引用。
- 实现部分：从抽象中剥离出来成另一个维度，与抽象部分互不干扰。

:::


## 实现

![桥接模式.drawio](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/桥接模式.drawio.svg)

仍是基于上面的红/黑/圆/方的问题，但为了后续灵活使用，这里加上一点扩展，新增“笔”的抽象体系，有两种值：铅笔、蜡笔。  
可以按下面这样写

:::: code-group
::: code-group-item Shape系统
```java
public abstract class Shape {
    private Color color;
    private Pen pen;

    public Shape (Color color, Pen pen) {
        this.color = color;
        this.pen = pen;
    }
    public abstract void draw ();
}

public class Square {
    public Square (Color color, Pen pen) {
        super(color, pen);
    }
    public void draw () {
        pen.pen();
        color.color();
        System.our.println("□");
    }
}
public class Circle {
    public Circle (Color color, Pen pen) {
        super(color, pen);
    }
    public void draw () {
        pen.pen();
        color.color();
        System.our.println("○");
    }
}
```
:::
::: code-group-item Color系统
```java
public abstract Color {
    public void color();
}

public class Red {
    public void color() {
        System.our.print("红");
    }
}

public class Black {
    public void color() {
        System.out.print("黑");
    }
}
```
:::
::: code-group-item Pen
```java
public abstract Pen {
    public void pen();
}

public class Crayon {
    public void pen() {
        System.our.print("蜡笔：");
    }
}

public class Pencil {
    public void pen() {
        System.out.print("铅笔：");
    }
}
```
:::
::: code-group-item Client
```java
public class Client {

    public static void main(String[] args) {
        new Square(new Red(), new Pencil()).draw(); // 铅笔：红□
        new Square(new Black(), new Crayon()).draw(); // 蜡笔：黑□
        new Circle(new Red(), new Crayon()).draw(); // 蜡笔：红○
        new Circle(new Black(), new Pencil()).draw(); // 铅笔：黑○
        ...
    }
}
```
:::
::::