---
title: MVC 请求接收方式
---

## 请求映射路径

如果有多个 Control 模块，如果都用 /save 则会报错，于是可以使用 /<模块名>/save

* 方法一：在对应的方法上面修改路径
 
<p></p>
 
```java
// UserController.java

...
	@RequestMapping("/user/save")
    @ResponseBody
    public String save () {
        System.out.println("user save ...");
        return "{'info' : 'chivas-regal'}";
    }
...
```
* 方法二：在这个模块类的上面添加 RequestMapping 作为前缀

<p></p>

```java
// UserController.java

@Controller
@RequestMapping("/user")
public class UserController {

    @RequestMapping("/save")
    @ResponseBody
    public String save () {
        System.out.println("user save ...");
        return "{'info' : 'chivas-regal'}";
    }
    ...
}
```
这两种做法都会将 UserController.save 方法的请求路径修改为 /user/save

## 参数接收

比如我们想在 save 里面添加参数 username,age 以便于我们存储用户信息
直接作为方法参数放入

```java
// UserController.java

@Controller
@RequestMapping("/user")
public class UserController {

    @RequestMapping("/save")
    @ResponseBody
    public String save (String username, int age) {
        System.out.println("user save with (" + username + ", " + age + ")");
        return "{" +
                "'username' : '" + username + "'," +
                "'password' : '" + age + "'" +
                "}";
    }
}
```
当然也可以不强制参数名是 post 的 key，可以用 `@Request("username")String name` 一样可以完成对 username 的接收

前端在发送的时候，无论是 get 还是 post 请求这里都可以接收

**get**

![20230928193716](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193716.png)

输出

![20230928193723](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193723.png)

**post**

![20230928193727](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193727.png)

发现中文出现乱码，我们在 ServletContainersInitConfig 内设置字符过滤器（换为继承 AbstractAnnotationConfigDispatcherServletInitializer)

```java
// ServletContainersInitConfig.java

public class ServletContainersInitConfig extends AbstractAnnotationConfigDispatcherServletInitializer {
    @Override
    protected Class<?>[] getRootConfigClasses() {
        return new Class[]{SpringConfig.class};
    }

    @Override
    protected Class<?>[] getServletConfigClasses() {
        return new Class[]{SpringMvcConfig.class};
    }

    @Override
    protected String[] getServletMappings() {
        return new String[]{"/"};
    }

    /* 过滤器组，包含一个 utf-8 字符过滤器 */
    @Override
    protected Filter[] getServletFilters() {
        CharacterEncodingFilter filter = new CharacterEncodingFilter();
        filter.setEncoding("utf-8");
        return new Filter[]{filter};
    }
}
```
这样接收到的数据就不会乱码了（但是发送出去的在页面展示还是会...）

下面给出几种应用方式

### 嵌套类传参

比如我有一个 Book ，一个 User

```java
public class Book {

    private String name;
    private String id;

    ...
}

public class User {

    private String name;
    private String age;

    private Book book;

    ...
}
```
在 controller 中以 User 为参数开一个页面方法

```java
// UserController.java

...
	@RequestMapping("/savebyuser")
    @ResponseBody
    public String saveByUser (User user) {
        System.out.println(user);
        return "{'info' : 'save by user'}";
    }
...
```
我们在传递时通过这样即可传递完成

![20230928193738](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193738.png)

#### ❗️ 类传参注意问题

**注意，这里必须要有无参构造方法或者不写任何构造方法使用默认的，因为传递方式是 SpringMVC 先空参构造一个实例对象，然后再通过 setter 将参数注入到实例中，因此必须要保证可以调用到无参构造方法**

### 数组传参

页面方法如下

```java
// UserController.java

...
	@RequestMapping("/savebyarrays")
    @ResponseBody
    public String saveByArrays (String[] arrays) {
        System.out.println(Arrays.toString(arrays));
        return "{'info' : 'save by arrays'}";
    }
...
```
然后这样传递参数

![20230928193746](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193746.png)

### 集合传参

这里使用了 List 链表

```java
...
	@RequestMapping("/savebylist")
    @ResponseBody
    public String saveByList (@RequestParam List<String> list) {
        System.out.println(list);
        return "{'info' : 'save by list'}";
    }
...
```
传递也是用 key 名都为 list 的方式往里加
注意必须要加 @RequestParam ，因为 List 是接口，不存在空参构造方法，我们要直接将参数作为 list 传入

### 日期传参

需要将传递的参数加上 @DateTimeFormat 来设置日期传递格式，比如

```java
@RequestMapping("dateParamForPost")
@ResponseBody
public String saveByData (@DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") Date date) {
    System.out.println(date);
    return "{'info' : 'save by date'}";
}
```
然后可以用 post 按指定格式传递

![20230928193802](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193802.png)

### Json 传递数据

先加入json支持坐标

```xml
<!-- pom.xml -->

<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-core</artifactId>
    <version>2.9.0</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-databind</artifactId>
    <version>2.9.0</version>
</dependency>
<dependency>
    <groupId>com.fasterxml.jackson.core</groupId>
    <artifactId>jackson-annotations</artifactId>
    <version>2.9.0</version>
</dependency>
```
这里先演示一下 postman 发送 json 请求体

![20230928193810](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193810.png)

1. 点击 Body
2. 点击 raw
3. 选中 JSON

#### 集合数据

```java
@RequestMapping("/listParamForJson")
@ResponseBody
public String saveByList (@RequestBody List<String> list) {
    System.out.println(list);
    return "{'module' : 'listParamForJson'}";
}
```
对应的 json 为

```json
[
    "zyz",
    "zxh",
    "szg",
    "wjq"
]
```
#### 嵌套对象

```java
@RequestMapping("/doublePojoParamForJson")
@ResponseBody
public String saveByDoublePojo (@RequestBody User user) {
    System.out.println(user);
    return "{'module' : 'doublePojoParamForJson'}";
}
```
对应

```json
{
    "name": "张一泽",
    "age": 21,
    "book": {
        "name": "夏摩山谷",
        "id": 542007
    }
}
```
#### 对象列表

```java
@RequestMapping("/listPojoParamForJson")
@ResponseBody
public String saveByListPojo (@RequestBody List<User> users) {
    System.out.println(users);
    return "{'module' : 'listPojoParamForJson'}";
}
```
对应为

```json
[
    {
        "name": "张一泽",
        "age": 21,
        "book": {
            "name": "夏摩山谷",
            "id": 542007
        }
    },
    {
        "name": "曾显慧",
        "age": 19,
        "book": {
            "name": "撒哈拉",
            "id": 542107
        }
    }
]
```

#### ❗️ 新加 json 功能报 415 可能的问题

可能是坐标导入后没有将文件加入输出目录，可在IDEA配置的SpringMVC章节的问题2见到解决办法