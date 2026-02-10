---
title: 结构型 - 组合(Composite)
---

## 概述

组合模式是针对模型的整体性、局部性，设计出的一种树形结构。  

::: details 为什么叫组合？
Composite 在英文中具有“复合物、组合体”的意思，强调将多个对象组合成树形结构。
:::

> “树”这个东西大家都不陌生了，这里也不多做赘述，不清楚的去了解一下“多叉树的实现”就可以了。

## 实现

![组合模式.drawio](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/组合模式.drawio.svg)

最常见的实际场景就是文件资源管理器了，有文件、文件夹两种模型，  
这两者通用属性就是“名称”，非通用的就是文件夹下可以放文件、文件夹。  


:::: code-group
::: code-group-item 抽象类
```java
public abstract class Node {
    protected String name;

    public Node (String name) {
        this.name = name;
    }

    // 展示名称后，列出目录下所有元素
    public void print () {
        print(0);
    }
    protected void print (int level) {
        for (int i = 0; i < level; i ++) {
            System.out.print("  ");
        }
        System.out.println(name);
    }

    public void add (Node node) {
        throw new UnsupportedOperationException();
    }
    public void remove (Node node) {
        throw new UnsupportedOperationException();
    }
}
```
:::
::: code-group-item 文件
```java
public class File extends Node {
    
    public File (String name) {
        super(name);
    }

    @Override
    protected void print (int level) {
        super.print(level);
    }
}
```
:::
::: code-group-item 文件夹
```java
public class Folder extends Node {

    private List<Node> children;

    public Folder (String name) {
        super(name);
        this.children = new ArrayList<Node>();
    }

    @Override
    protected void print (int level) {
        super.print(level);
        for (Node child : children) {
            child.print(level + 1);
        }
    }

    @Override
    public void add (Node node) {
        this.children.add(node);
    }
    @Override
    public void remove (Node node) {
        this.children.remove(node);
    }
}
```
:::
::: code-group-item Client
```java
public class Client {

    public static void main(String[] args) {
        Node rootDir = new Folder("根目录");
        
        Node musicDir = new Folder("音乐");
        Node bookDir = new Folder("小说");
        Node readme = new File("简介.md");
        rootDir.add(musicDir);
        rootDir.add(bookDir);
        rootDir.add(readme);

        Node music1 = new File("爱错.mp3");
        Node music2 = new File("菩萨鱼.mp3");
        musicDir.add(music1);
        musicDir.add(music2);

        Node book1 = new File("我与地坛.txt");
        Node book2 = new File("云边有个小卖部.txt");
        Node book3 = new File("活着.txt");
        bookDir.add(book1);
        bookDir.add(book2);
        bookDir.add(book3);

        rootDir.print();
        /*
            根目录
                音乐
                    爱错.mp3
                    菩萨鱼.mp3
                小说
                    我与地坛.txt
                    云边有个小卖部.txt
                    活着.txt
                简介.md
        */
    }
}
```
:::
::::