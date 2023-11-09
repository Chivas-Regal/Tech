---
title: JavaBean
---


## 创建 Bean

在`/src`下创建包`com.chivasregal.main`，然后编写`Bean`

![20230928194101](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928194101.png)

```java
// Animal.java

package com.chivasregal.main;

public class Animal {
    private int legs;
    private String sound;

    public Animal() {
    }

    public void setLegs(int var1) {
        this.legs = var1;
    }

    public void setSound(String var1) {
        this.sound = var1;
    }

    public int getLegs() {
        return this.legs;
    }

    public String getSound() {
        return this.sound;
    }
}

```

## 使用 Bean

### 变量定义

**模板：**`<jsp:useBean id="<变量名>" class="<绝对类位置>"/>`

**示例：**`<jsp:useBean id="animal" class="com.chivasregal.main.Animal"/>`

**解释：**`Animal animal = new Animal();`

### 变量 set 属性

**模板：**`<jsp:setProperty name="<变量名>" property="<待set属性>" value="<set后的值>"/>`

**示例：**`<jsp:setProperty name="animal" property="legs" value="2"/>`

**解释：**`animal.setLegs(2)`

### 变量 get 属性

**模板：**`<jsp:getProperty name="<变量名>" property="<待get属性>"/>`

**示例：**`<jsp:getProperty name="animal" property="legs"/>`

**解释：**`animal.getLegs()`

## 示例

根据上面的 Bean ，写出下面`.jsp`代码

```html
<!-- bean-use.jsp -->

<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title>JavaBean使用实例</title>
</head>
<body>
    <h1>JavaBean使用实例</h1>
    <jsp:useBean id="animal" class="com.chivasregal.main.Animal"/>
    <jsp:setProperty name="animal" property="legs" value="2"/>
    <jsp:setProperty name="animal" property="sound" value="哼哼哼哼"/>
    <p>输出信息...</p>
    <p>我是zxh！我有 <jsp:getProperty name="animal" property="legs"/> 条腿，我叫起来“<jsp:getProperty name="animal" property="sound"/>”的，我是小猪！</p>
</body>
</html>
```
打开网页结果如下

![](https://cdn.nlark.com/yuque/0/2023/png/22196056/1693902448541-500d46ca-a178-48c9-9c26-ae76ff90c50c.png)
