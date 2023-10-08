---
title: SSM 整合
---

## 功能模块开发

这个就和上面的一样，通过 Web 工程类来分别绑定两个配置类 SpringConfig 和 SpringMvcConfig

* SpringConfig 管理 com.snopzyz.service
* SpringMvcConfig 管理 com.snopzyz.controller

别的就都是分离的功能，跟我们之前写的一样，然后在 controller 内进行归一：

将我们之前用的 bookList 直接换成写好的利用 Mybatis 进行数据层操作的业务层——BookService

```java
// BookController.java

@RestController
@RequestMapping("/books")
public class BookController {

    @Autowired
    BookService bookService;

    @PostMapping
    public boolean insert (@RequestBody Book book) {
        return bookService.insert(book);
    }

    ...
}
```
这样就整合了基本功能：**SpringMvc 用作表现层下的controller层，它直接调用 Spring { 业务层service通过 “Mybatis 代理的 Dao 数据层” 来完成对数据库的控制 }**

## 前后端数据封装

**下面说的并不是唯一的方法，封装格式是前后端讨论出来的结果，没有固定的方式**

基本上都需要三块内容：

* 知道是什么操作，是否成功 ![](https://cdn.nlark.com/yuque/__latex/33b44e34aa35b8c4ecd0606453ee68e9.svg) `code`
* 返回值是什么 ![](https://cdn.nlark.com/yuque/__latex/33b44e34aa35b8c4ecd0606453ee68e9.svg) `data`
* 如果没有成功，返回的消息是什么 ![](https://cdn.nlark.com/yuque/__latex/33b44e34aa35b8c4ecd0606453ee68e9.svg) `msg`

所以封装一个结果类

```java
// Result.java

public class Result {
    private Object data;
    private Integer code;
    private String msg;
}
```
并设定好状态码

```java
// Code.java

public class Code {
    public static final int SAVE_OK = 20011;
    public static final int DELETE_OK = 20021;
    public static final int UPDATE_OK = 20031;
    public static final int GET_OK = 20041;

    public static final int SAVE_ERR = 20010;
    public static final int DELETE_ERR = 20020;
    public static final int UPDATE_ERR = 20030;
    public static final int GET_ERR = 20040;
}
```
那么我们对于之前写法的状态

1. 将返回结果数据放在 data 内
2. 判断结果是否为空或者false，再根据本次操作决定是哪一个http动作，来订好 Code 状态码
3. 根据结果是否为空或者false，决定msg消息为什么

打个样：

```java
// BookController.java

public class BookController {
	@GetMapping("/{id}")
    public Result getById (@PathVariable Integer id) {
        Object data = bookService.getById(id);
        Integer code = data == null ? Code.GET_ERR : Code.GET_OK;
        String msg = data == null ? "数据查询失败，请重试！" : "";
        return new Result(data, code, msg);
    }
}
```
这里是 postman 演示结果

![20230928193915](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193915.png)

![20230928193920](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193920.png)
