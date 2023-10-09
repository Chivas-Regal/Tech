---
title: 通配符匹配问题
---

## Servlet 匹配规则

Servlet 匹配规则**不是简单的通配，也不是正则表达式**，所以要注意 url-pattern 的区分  

### 精确匹配

直接拿要匹配到的完整路径比如  
`http://localhost:8080/a/b/c/d.html`  
优先级最高

### 路径匹配

用 `*` 来指代后面的所有内容  
`/a/*`  会匹配到 `/a` 下的**所有**路径，包括 `/a/b/c/d.html`   
优先级第二高

### 扩展名匹配

用 `*.<后缀名>` 完成匹配  
`*.jsp` 会匹配到所有后缀为 `.jsp` 的路径，包括 `/a/b/c/e.jsp`  

### 缺省匹配

`/` ，包含所有路径，但是优先级非常非常低，不会覆盖已经写好的匹配内容  

### 优先顺序

精确路径 > 最长路径 > 较短路径 > 扩展名 >> 缺省匹配 `/`

## 通配符匹配

- `?`：匹配到一个字符
- `*`：匹配 0 到多个字符<br>但比如 `/a/*` 只能匹配到下一级目录的文件，并不能跨域 `/` 
- `**`：匹配某个路径下的任意文件<br>比如 `/a/**` 可以匹配到 `/a/b/c/d.html`

## AOP 切入点表达式

由几部分组成：动作关键字、访问修饰符（可以省略）、返回值、包名、类/接口名、方法名、参数、异常名（可以省略）
比如例子就是

```java
@execution(public User com.snopzyz.service.UserService.findByNo(String))
```
切入点表达式

* `\*`：匹配单个独立的任意符号（必须要有）

<p></p>

```java
execution(public * com.snopzyz.*.UserService.find*(*))
```
匹配 com.snopzyz 包下任意包中的 UserService 类或接口中所有 find 开头的带有一个参数的方法

* `..`：匹配多个连续的任意符号（可以没有）

<p></p>

```java
execution(public User com..UserService.findById(..))
```
匹配 com 包下的任意包中的 UserService 类或接口中所有名称为 findById 的方法

* `+`：专用于匹配子类类型

<p></p>

```java
execution(* *..*Service+.*(..))
```
匹配任意包下的以 Service 结尾的子类或中任意名称任意参数任意返回值的方法

再来看个疯狂的

```java
execution(* *..*(..))
```
表示匹配任意包下任意类的任意参数任意返回值的方法，也就是所有方法（一般不这么写

有个常用的

```java
execution(* com.snopzyz.*.*Service.find*(..))
```
给所有 com.snopzyz 下的业务层类的 find 开头方法加 AOP