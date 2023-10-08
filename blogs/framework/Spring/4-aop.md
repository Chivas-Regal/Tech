---
title: 面向 AOP 切片编程
---

## 面向切面编程介绍

**连接点：程序执行过程中的任意位置**，SpringAOP中可理解为方法的执行

**切入点：匹配连接的式子**，可以是一个具体方法，也可以是通过某种特性匹配的多个方法，比如所有`save()`方法、所有以get开头的方法、所有以Dao结尾的接口的方法、所有只有一个参数的方法

**通知：切入点执行的操作，也是共性功能**

**通知类：定义通知的类**

**切面：描述通知和切入点的对应关系**

## 第一个 AOP 程序

这里我们有一个 BookDao 类，我们预期在其执行方法 update() 之前先输出当前系统时间

项目结构如下

![20230928193500](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193500.png)

其中 BookDao 类里有一个 update() 函数自己会输出 `book update ...` ，然后 App 也是正常的对容器中 BookDao 这个bean的 update() 方法调用，就不展示了  
  
说明一下 SpringConfig，与之前不同的是我这里需要标注使用注解开发AOP，要加上`@EnableAspectJAutoProxy`

```java
// SpringConfig.java

@Configuration
@ComponentScan("com.snopzyz")
@EnableAspectJAutoProxy
public class SpringConfig {
}
```
然后AOP类MyAdvice

* 它是一个 bean ，那就要 `@Component`
* 它是一个 AOP ，那就要 `@Aspect`
* 其方法要有通知、切入点
+ 我们需要的通知是输出系统时间的方法
+ 我们需要的切入点需要注解 `@PointCut()` ，是匹配BookDao的update()，式子就是 `execution(void com.snopzyz.dao.BookDao.update()`
+ 然后将通知和切入点进行绑定，在通知方法上面加上`@Before(切入点方法)`

下面是整体的实现

```java
// MyAdvice.java

@Component
@Aspect
public class MyAdvice {

    @Pointcut("execution(void com.snopzyz.dao.BookDao.update())")
    public void pt () {}

    @Before("pt()")
    public void method () {
        System.out.println(System.currentTimeMillis());
    }

}
```

## Spring-AOP 原理-

利用代理，在初始化bean时判断是否能够匹配上任意切入点

* 匹配失败创建对象
* 匹配成功创建原始对象（目标对象）的代理对象

获取 bean 如果是代理对象的话，根据代理对象的运行模式运行原始方法与增强的内容完成操作

验证就接着我们上一节的程序来，我们在 App 中输出一下 bookDao 和 bookDao.getClass()

```java
// App.java

public class App {
    public static void main(String[] args) {
        ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
        BookDao bookDao = ctx.getBean(BookDao.class);
        System.out.println(bookDao);
        System.out.println(bookDao.getClass());
    }
}
/*
================== Output
com.snopzyz.dao.BookDao@29d80d2b
class com.snopzyz.dao.BookDao$$EnhancerBySpringCGLIB$$feb6a66a
*/
```
会发现 bookDao 的 toString 是被做 Spring 了一次重写，但 getClass 就是代理对象的
但是还有一点要注意的是，这个代理对象是继承或者组合了原始对象，其实例 boolDao 运算 `bookDao instanceof BookDao` 返回的是 `true`

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

**书写技巧**

* 所有代码按照标准规范开发，否则以下技巧全部失效
* 描述切入点**通常描述接口**，而不描述实现类
* 访问控制修饰符针对接口开发均采用public描述（**可省略访问控制修饰符描述**）
* 返回值类型对于增删改类使用精准类型加速匹配，对于查询类使用\*通配快速描述
* **包名书**写**尽量不使用..**匹配，效率过低，常用\*做单个包描述匹配，或精准匹配
* **接口名**/类名书写名称与模块相关的**采用\*匹配**，例如UserService书写成\*Service，绑定业务层接口名
* **方法名**书写以**动词**进行**精准匹配**，名词采用\*匹配，例如getByld书写成getBy\*，selectAIl书写成selectAIl
* 参数规则较为复杂，根据业务方法灵活调整
* 通常**不使用异常**作为**匹配**规则

## 通知类型

### 前置与后置

根据上面例子的我们很容易知道这里要怎么写

```java
@Before("pt()")
public void methodBefore () {
    System.out.println("before ... ");
}

@After("pt()")
public void methodAfter () {
    System.out.println("after ... ");
}
```
### 环绕（重点）

这个是最重要的，使用注解`@Around(切入点)`完成，有几个注意事项

#### 返回值

环绕因为可能增强有返回值的方法，所以我们要用 **Object 类型**捕捉返回值并在环绕通知方法中返回

#### 异常

由于被增强的方法可能会抛异常，所以这里也要**用**`**throws Throwable**`**进行捕获**

#### 参数

因为是环绕前后都有，我们需要设置切入时机，这里的工具类为 **ProceedingJoinPoint**

#### 调用时机

利用我们上面的 ProceedingJoinPoint ，**调用其 proceed() 方法**就相当于执行了原始方法，注意根据上面说的返回值这里也要用 Object 捕获，就算没有返回值

```java
@Around("pt()")
public Object Around (ProceedingJoinPoint pjp) throws Throwable {
    System.out.println("around before ...");
    Object ret = pjp.proceed();
    System.out.println("around after ...");
    return ret;
}
```
### 返回之后

`@AfterReturning(切入点)`

### 抛出异常之后

`@AfterThrowing(切入点)`

## 通知获取数据

我们现在将 BookDao 类内方法改成如下内容：

```java
// BookDao.java

@Repository
public class BookDao {
    public String save (String name, int id) {
        System.out.println("book save ... " + name + " " + id);
        return "good";
    }
}
```
只是一个简单的返回固定串，中间正常是有 book 信息 (name, id) 的解析，这里就不设计了

假设存在场景：**要将 name 转换成大写、id 往后平移 100**，这就可以利用 AOP 把这些 save() 有关方法全部添加参数转换，核心思想是**通知方法中先修改参数再进行调用**，步骤如下

1. 设置切入点、通知、切面 ...
2. 在 save 相关通知方法中用 ProceedingJoinPoint 取出参数，并做修改
3. 在 ProceedingJoinPoint 对象中使用连接点 proceed 方法时传入修改后的参数

<p></p>

```java
// BookAdvice.java

public class BookAdvice {
    @Pointcut("execution(String com.snopzyz.dao.BookDao.save(..))")
    public void pt () {}

    @Around("pt()")
    public Object Around (ProceedingJoinPoint pjp) throws Throwable {
        /* 获取参数 */
        Object[] args = pjp.getArgs();

        System.out.println("before ...");

        /* 修改参数 */
        String name = (String)args[0];
        int id = (Integer)args[1] + 100;

        /* 用已有参数调用连接点 */
        Object ret = pjp.proceed(new Object[]{name.toUpperCase(), id});

        System.out.println("after ...");
        return ret;
    }
}
```
此时我们在 App.java 中调用输出如下

```java
// App.java

ApplicationContext ctx = new AnnotationConfigApplicationContext(SpringConfig.class);
BookDao bookDao = ctx.getBean(BookDao.class);
System.out.println(bookDao.save("NowYouGood", 66));

/*
================== Output
before ...
book save ... NOWYOUGOOD 166
after ...
good
*/
```
如果需要在 AfterReturning 通知方法中获取返回值，只需要将其置为参数，并在注解中标注返回给这个参数

```java
/* 切入点是 pt()，返回值赋给参数 ret */
@AfterReturning(value = "pt()", returning = "ret")
public void AfterReturning (String ret) {
    System.out.println("afterReturning advice ... " + ret);
}
```
注意这里如果要加 JoinPoint 参数的话，必须要设置为第一个参数，也就是 `(JoinPoint jp, String ret)`