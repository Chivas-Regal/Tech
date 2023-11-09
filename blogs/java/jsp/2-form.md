---
title: 数据传输
---

## 表单传输

发送端`<form>`标签

* `page`属性指定发送和跳转的目标页面
* `method`属性指定发送的方法（GET/POST）

比如有一份表单

```html
...
				<form action="get_main.jsp" method="GET">
            名字：<input type="text" name="name"/>
            <br>
            腿数：<input type="text" name="legs"/>
            <br>
            声音：<input type="text" name="voice"/>
            <br>
            物种：<input type="text" name="type"/>
            <br>
            <input type="submit" value="提交"/>
        </form>
...
```
就表示该表单在提交时向`get\_main.jsp`发送数据并完成跳转，方法为`GET`（如果`...method="POST"`说明方法为`POST`）
然后表单需要填写并发送四个数据 name、legs、voice、type

接收端主要是通过方法`request.getParameter(...)`来实现接收的
对于上面表单，`get\_main.jsp`内可以嵌入这样的`java`代码

```html
...
	<%
      String name = request.getParameter("name");
      String legs = request.getParameter("legs");
      String voice = request.getParameter("voice");
      String type = request.getParameter("type");
    %>
...
```
就可以完成了数据的接收

当然如果是`POST`发送为了防止中文乱码要写成如下形式

```java
String name = new String((request.getParameter("name")).getBytes("ISO-8859-1"), "UTF-8");
```