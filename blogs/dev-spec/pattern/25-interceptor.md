---
title: 行为型 - 拦截器(Interceptor)
---

## 理论

拦截器是一种**在核心业务逻辑前后增加切面操作**的设计模式，提高了扩展功能的**灵活性**，主要体现在可以便捷的添加、删除各种拦截器，来选择合适的功能。  
一般用于日志记录、性能统计、入参校验等...，SpringBoot 在 WebMvc 提供的拦截器就是较为常见的现有的拦截器。

<img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20250208205408.png" style="width: 250px"/>

简单讲可以理解为AOP思想的另一种实现，但是相较于AOP，拦截器在选择上按上面说的具备较高的灵活性。  
且在Java中不同于AOP是以反射机制实现的，拦截器是通过面向对象技术，以循环、递归方式完成的，不会破坏对象内的访问权限属性。  

## 实现

拦截器的设计一般有三种成员：
- 拦截器接口类 `Interceptor`
    - 前置操作方法 `preHandle()`
    - 后置操作方法 `postHandle()`
- 拦截器实现类 `XXInterceptor`
- 拦截器调用类 `InterceptorManager`
    - 注册的拦截器链 `interceptorChain`
    - 循环执行前置 `doPreHandle()`
    - 循环执行后置 `doPostHandle()`

它们的组织关系如下（一个比较抽象的关于校验拦截器的类图）

![拦截器模式.drawio](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/拦截器模式.drawio.svg)

下面做一个示例演示一下，如何做前置拦截与后置行为。  

### 核心业务逻辑模拟

先做个 `Request` 和 `Response`，模拟一下核心逻辑的请求响应。    

```java
// Request.java 空的，仅用作模拟
public class Request {
}

// Response.java 带两个成功失败方法
@AllArgsConstructor
public class Response {

    @Getter
    String msg;

    public static Response fail () {
        return new Response("失败咯~");
    }

    public static Response success () {
        return new Response("成功咧！");
    }

}
```

然后是核心逻辑 `Target#execute()` 的模拟，写个简单的就行  

```java
// Target.java
public class Target {

    public Response query (Request request) {
        return Response.success();
    }

}
```

### 拦截器接口类与管理器

再做下 `Interceptor` 接口类，声明一下两个方法（前置操作、后置操作）  

```java
// Interceptor.java
public interface Interceptor {

    /**
     * 核心逻辑调用前的拦截
     * @return 是否通过校验
     */
    public boolean preHandle (Request request);

    /**
     * 核心逻辑调用后的操作
     * 当且仅当对应本拦截器的 preHandle=true 时，才会触发调用
     */
    public void postHandle (Request request);

}
```

接着是拦截器的管理类，要包括在灵活添加拦截器时的“拦截器链”的存储结构 `InterceptorChain`，以及核心逻辑被的调用服务对象 `Target`。

```java
public class InterceptorManager {

    /**
     * 拦截器链
     */
    private List<Interceptor> interceptorChain = new ArrayList<>();
    /**
     * 成功通过 preHandle 前置校验的拦截器下标
     */
    private int interceptorIndex = -1;

    /**
     * 核心逻辑被调用对象
     */
    @Setter
    private Target target;


    /**
     * 顺序添加拦截器
     */
    public void addInterceptor (Interceptor interceptor) {
        interceptorChain.add(interceptor);
    }

    /**
     * 执行前置校验、核心逻辑方法、后置操作
     */
    public Response execute (Request request) {
        // 没有全部通过 preHandle，直接执行通过的 postHandle 并返回失败
        if (!doPreHandle(request)) {
            doPostHandle(request);
            return Response.fail();
        }
        // 执行具体核心逻辑
        Response response = target.query(request);
        // 执行后置操作
        doPostHandle(request);
        return  response;
    }

    /**
     * 执行所有拦截器的前置校验
     * @return 是否全部通过
     */
    private boolean doPreHandle (Request request) {
        for (int i = 0; i < interceptorChain.size(); i ++) {
            if (!interceptorChain.get(i).preHandle(request)) {
                return false;
            }
            // 动态保存最后一个通过的拦截器下标
            interceptorIndex = i;
        }
        return true;
    }

    /**
     * 从最后一个通过 preHandle 的拦截器开始，倒置向前执行 postHandle
     */
    private void doPostHandle (Request request) {
        for (int i = interceptorIndex; i >= 0; i --) {
            interceptorChain.get(i).postHandle(request);
        }
    }
}
```

### 补充拦截器实现类

这里做两个名字不同但是功能一致的拦截器，各自的 `preHandle` 就按想返回的 `true/false` 来，目的是做个输出能看一下就行。  

:::: code-group
::: code-group-item AuditInterceptor.java
```java
public class AuditInterceptor implements Interceptor {

    @Override
    public boolean preHandle(Request request) {
        boolean ret = true;
        System.out.println("AuditInterceptor 开始校验, preHandle:" + ret);
        return ret;
    }
    @Override
    public void postHandle(Request request) {
        System.out.println("AuditInterceptor 后置操作，postHandle()");
    }
}
```
:::
::: code-group-item LogInterceptor.java
```java
public class LogInterceptor implements Interceptor {

    @Override
    public boolean preHandle(Request request) {
        boolean ret = true;
        System.out.println("LogInterceptor 开始校验, preHandle:" + ret);
        return ret;
    }
    @Override
    public void postHandle(Request request) {
        System.out.println("LogInterceptor 后置操作，postHandle()");
    }
}
```
:::
::::

### 使用方式

这些拦截器相关的都写好了，写个 `main()` 函数运行一下。  


```java
// InterceptorDemo.java
public class InterceptorDemo {

    public static void main(String[] args) {
        // 核心业务逻辑被调用的 Service
        Target target = new Target();
        // 拦截器管理，填入该Service
        InterceptorManager manager = new InterceptorManager();
        manager.setTarget(target);

        // 添加两个拦截器
        manager.addInterceptor(new LogInterceptor());
        manager.addInterceptor(new AuditInterceptor());

        // 核心业务逻辑执行
        Request request = new Request();
        Response response = manager.execute(request);
        System.out.println(response.getMsg());
    }

}
```

因为两个拦截器的 `preHandle` 设置的都是 true-通过校验，所以运行后两个前置后置都应该有输出，并且最后调用核心业务逻辑返回 “成功”

![20250208224301](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20250208224301.png)

此时将第二层拦截器 `AuditInterceptor` 的 `preHandle` 返回设置为 false

```java
// AuditInterceptor.java
public class AuditInterceptor implements Interceptor {

    @Override
    public boolean preHandle(Request request) {
        boolean ret = false;
        System.out.println("AuditInterceptor 开始校验, preHandle:" + ret);
        return ret;
    }

    // ... 省略无改动部分
```

此时再执行启动函数应该只能看到 `LogInterceptor` 的前置后置操作和 `AuditInterceptor` 的前置操作执行，且最后响应为 “失败”  

![20250208224642](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20250208224642.png)

符合预期，实现成功

## 优缺点

优点
- 灵活性：可以动态添加、移除或修改拦截器，增强了系统的灵活性。
- 可复用性：拦截器可以独立于具体的业务逻辑，具有较高的复用性。
- 增强功能：可以在不修改核心业务逻辑的情况下，添加额外的功能（如日志记录、权限校验、性能监控等）。
- 链式处理：支持拦截器链，多个拦截器可以按顺序执行，形成一个处理流程。
- 解耦性：请求处理逻辑与拦截逻辑分离，降低了代码耦合度，便于维护和扩展。

缺点
- 调试困难：由于拦截器链的存在，调试时可能难以追踪请求的具体处理流程。
- 性能开销：如果拦截器链过长，可能会增加系统的性能开销。
- 复杂性增加：过多的拦截器可能导致系统设计复杂，难以管理。
- 依赖顺序：拦截器的执行顺序可能会影响最终结果，顺序管理需要特别注意。