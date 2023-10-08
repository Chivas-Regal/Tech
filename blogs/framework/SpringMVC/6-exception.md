---
title: SSM 异常截取并向前端发送
---

## 异常处理器

利用 AOP 思想，收集各个不同的异常，并将对应的异常捕捉后返回对应的数据

* 所有 IOException 异常给前端页面“输入有误，重新输入”
* 所有 SqlException 异常给前端页面“数据库错误，请联系管理员”
* ...

不过 SpringMVC 已经对这个 AOP 提供了正确的通知类格式

```java
// ProjectExceptionAdvice.java

/* 通知类 */
@RestControllerAdvice
public class ProjectExceptionAdvice {
    /* 捕捉所有的 Exception 类型异常 */
    @ExceptionHandler(Exception.class)
    public Result catchException () {
        /* 后台打印 */
        System.out.println("I catch an exception");
        /* 前台反馈 */
        return new Result(666, null, "I catch an exception");
    }
}
```
## 自定义异常类

为了区分不同异常我们经常需要用到**自定义**的手段，然后学会**怎么抛**和**向前端传递**

这里在 exception 包下建立了两个异常类，成员都是一样的

```java
/* RuntimeException 可以自动将异常向上抛，会更省事 */
public class SubmissionException extends RuntimeException {
    /* 状态码 */
    private Integer code;
    ...
}
public class SystemException extends RuntimeException {
    private Integer code;
    ...
}
```
以及新建了三个状态码

```java
// Code.java

public class Code {
	public static final int SYSTEM_ERR = 50001;
    public static final int SYSTEM_TIMEOUT_ERR = 50002;
    public static final int UNKNOWN_ERR = 59999;
    ...
}
```
那么在使用的时候，最好将异常在业务层向上抛，然后在controller层（我们之前写好的用作aop效果的ProjectExceptionAdvice）进行接收

业务层抛异常实例：

```java
// BookServiceImpl.java

@Override
public Book getById(Integer id) {
    if (id == 1) {
        throw new SubmissionException(Code.SYSTEM_ERR, "你这参数不保熟啊");
    }
    try {
        int i = 1 / 0;
    } catch (Exception e) {
        throw new SystemException(Code.SYSTEM_TIMEOUT_ERR, "服务器繁忙中，请稍后再拨~");
    }
    return bookDao.getById(id);
}
```
在这个参数里面会出两种异常：第4行和第9行，在整个系统中会出现三种：

* 查询参数接收了1：SubmissionException
* 查询参数正常：SystemException
* 查询参数接收了字符串：Exception

然后我们在 ProjectExceptionAdvice 中给这些异常添加对应的 Result 返回内容

```java
// ProjectExceptionAdvice.java

@RestControllerAdvice
public class ProjectExceptionAdvice {

    @ExceptionHandler(SubmissionException.class)
    public Result catchSubmissionException (SubmissionException e) {
        System.out.println(e.toString());
        return new Result(null, e.getCode(), e.getMessage());
    }

    @ExceptionHandler(SystemException.class)
    public Result catchSystemException (SystemException e) {
        System.out.println(e);
        return new Result(null, e.getCode(), e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public Result catchElseException (Exception e) {
        System.out.println(e.toString());
        return new Result(null, Code.UNKNOWN_ERR, "啥情况，我自己也不造啊");
    }

}
```
这就分别给这三个异常设置了通知方法了，我们发送一下请求看看

![20230928193931](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193931.png)

![20230928193936](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193936.png)

![20230928193942](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193942.png)