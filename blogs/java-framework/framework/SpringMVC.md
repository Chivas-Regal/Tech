---
title: SpringMVC
---


起步，第一个项目
========

过程详解
----

1. 新建 maven 项目
2. 按上面创建 web 工程的方式加入 WEB-INF 以及 tomcat8（tomcat10不能用javax，所以先不使用）
3. 在 pom.xml 中导入如下配置  
  
<p></p>

```xml
<dependencies>
    <dependency>
        <groupId>javax.servlet</groupId>
        <artifactId>javax.servlet-api</artifactId>
        <version>3.1.0</version>
        <scope>provided</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-webmvc</artifactId>
        <version>5.2.10.RELEASE</version>
    </dependency>
</dependencies>

<build>
    <plugins>
        <plugin>
            <groupId>org.apache.tomcat.maven</groupId>
            <artifactId>tomcat7-maven-plugin</artifactId>
            <version>2.1</version>
            <configuration>
                <port>8081</port> <!--看tomcat监听的是什么内容-->
                <path>/</path>
            </configuration>
        </plugin>
    </plugins>
</build>
```
  
这是我们的项目结构

![20230928193613](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193613.png)

SpringMvcConfig 主要做的是和我们之前配置 Spring 配置类做的事情一样
  
```java
// SpringMvcConfig.java

@Configuration
@ComponentScan("com.snopzyz.controller")
public class SpringMvcConfig {
}
```

ServletContainersInitConfig 主要做的是和 Tomcat 进行连接，然后

* 将配置文件指向 SpringMvcConfig
* 给出工程在 web 上访问的根路径，拦截这个路径下的所有请求由 SpringMvc 的 Bean 来管理

<p></p>

```java
// ServletContainersInitConfig.java

/* 继承 AbstractDispatcherServletInitializer 来完成 Tomcat 的沟通
   如果还有别的类继承了则会报错无法启动 */
public class ServletContainersInitConfig extends AbstractDispatcherServletInitializer {
    /* 将配置文件指向 SpringMvcConfig */
    @Override
    public WebApplicationContext createServletApplicationContext() {
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.register(SpringMvcConfig.class);
        return ctx;
    }
	/* 根路径就是web总工程的根路径 */
    @Override
    public String[] getServletMappings() {
        return new String[]{"/"};
    }

    @Override
    public WebApplicationContext createRootApplicationContext() {
        return null;
    }
}
```

UserController 则是我们设计的表现层类，用作接受数据并返回数据

```java
// UserController.java

@Controller
public class UserController {
	/* 发送数据发送给 save，比如从浏览器打开 /localhost:<端口号>/<工程名>/save
 	   这里会返回字符串 */
    @RequestMapping("/save")
    @ResponseBody
    public String save () {
        System.out.println("user save ...");
        return "{'info' : 'chivas-regal'}";
    }
}
```

![20230928193622](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193622.png)

这样运行之后给路径下加个 /save 就会获取到这样的数据

![20230928193628](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193628.png)

并且在编辑器那边也会有输出

![20230928193633](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193633.png)

问题说明
----

### 问题1：tomcat10.X

tomcat10 对这套无法使用，因为 tomcat10 交给 eclipse 管理，不能使用 javax 而是换了套名字 jaka...

### 问题2：进入 .../save 后报404

大概率是因为没有将本工程后端内容加入输出导致的，进入 Project Structure

![20230928193649](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193649.png)

选中左侧的 Artifacts，然后选择对应的工程 Artifact，右击要加入输出的 Element（在右侧），然后选择 Pull Into Output Root ，再 Apply 即可

![20230928193654](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193654.png)

 Bean 的隔离控制
===========

在既有 SpringMvcConfig 也有 SpringConfig 时，如何将 Bean 的管理分离是一个问题
例如我的包 com.snopzyz 下，有 config、controller、service、dao，那么我如果两个都写 ComponentScan("com.snopzyz") 的话则会造成 Bean 的重叠，做法如下

* 第一种做法：将组件扫描更精准，也就是调用 com.snopzyz.dao, com.snopzyz.service 这样的管理
* 第二种做法：采用 exclude 排除过滤器，方式如下
 
<p></p>
 
```java
// SpringConfig.java

@ComponentScan(
        value = "com.snopzyz",                  // 扫描 com.snopzyz 下的包，
        excludeFilters = @ComponentScan.Filter( // 除了
            type = FilterType.ANNOTATION,       // 以注解为
            classes = Controller.class          // Controller 的 Bean
        )                                       // 不扫描。
)                                               // 别的都扫描
public class SpringConfig {
}
```
 然后我们有了 SpringConfig ，我们 ServletContainersInitConfig 里面的另一个方法就用一样的方式将其加入管理器中

```java
// ServletContainersInitConfig.java

public class ServletContainersInitConfig extends AbstractDispatcherServletInitializer {
    ...
    @Override
    public WebApplicationContext createRootApplicationContext() {
        AnnotationConfigWebApplicationContext ctx = new AnnotationConfigWebApplicationContext();
        ctx.register(SpringConfig.class);
        return ctx;
    }
    ...
}
```

这里有一个简化开发的语法糖，只需要继承 AbstractAnnotationConfigDispatcherServletInitializer ，便可直接提供类即可完成创建，不用创建别的实例对象再注册返回（但是作为学习还是推荐用第一种，可以帮助我们学习加载过程，这个只作为了解和后期开发）

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
}
```
请求
==

请求映射路径
------

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

参数接收
----

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

## 响应

我们之前演示的时候就已经演示了字符串的响应了，我们演示下面两个

### 响应页面

转发至别的页面，并将其响应给客户端

```java
@RequestMapping("respPage")
public String respPage () {
    System.out.println("页面转发至 --> /index.jsp");
    return "/index.jsp";
}
```
这个表示我们对于访问 /user/respPage 的请求，将 /index.jsp 响应给客户端

![20230928193819](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193819.png)

### 响应Json数据

jackson坐标支持将类转换为json形式的字符串，因此我们返回已经填好数据的类即可

```java
@RequestMapping("respClassJson")
@ResponseBody
public List<User> respClassJson () {
    Book book1 = new Book();
    book1.setName("夏摩山谷");
    book1.setId(5420);
    User user1 = new User();
    user1.setName("张一泽");
    user1.setAge(21);
    user1.setBook(book1);

    Book book2 = new Book();
    book2.setName("撒哈拉");
    book2.setId(5421);
    User user2 = new User();
    user2.setName("张一泽");
    user2.setAge(21);
    user2.setBook(book1);

    List<User> retList = new ArrayList<>();
    retList.add(user1);
    retList.add(user2);
    System.out.println("返回数据：" + retList);
    return retList;
}
```

postman接收数据如下

![20230928193826](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193826.png)

## REST风格

* <http://localhost/users> 查询全部用户信息  GET（查询）
* <http://localhost/users/1> 查询指定用户信息  GET（查询）
* <http://localhost/users> 添加用户信息 POST（新/保存）
* <http://localhost/users> 修改用户信息 PUT（修改/更新）
* <http://localhost/users/1> 删除用户信息 DELETE（删除）

**请求动作**：对请求方法的控制主要是通过 `@RequestMapping()` 中的 `method` 参数进行的
**请求参数（路径变量）**：对路径提取参数的方法主要是利用 `{}` 框选并在参数中添加 `@PathVariable` 注解完成的

示例：删除操作

```java
@RequestMapping(value = "/user/{name}", method = RequestMethod.DELETE)
@ResponseBody
public String deleteByName (@PathVariable String name) {
    System.out.println("deleteByName(" + name + ")");
    return "{'info' : 'delete by name'}";
}
```
这边 postman 只有发送 DELETE 的 /user/[name] 格式才能访问

![20230928193834](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193834.png)

### 注解区分

* `@RequestParam` 用于接收 url 地址或 post 表单提交
* `@RequestBody` 用于接收 json 传参
* `@PathVariable` 用于接收地址变量

### 简化开发

* controller 方法中都有 ResponseBody ，提出来放到类的注解中

<p></p>

```java
@Controller
@ResponseBody
```
这个可以合成一个注解 `@RestController`

* 路径都有前缀 /user ，直接在类上面注解 @RequestMapping("/user")
* 方法中剩下的诸如 `@RequestMapping(method = RequestMethod.DELETE)` 可以替换为 `@DeleteMapping` 这样
如果还有自己的路径 value = "/{name}" 这样，直接加入 `@DeleteMapping("/{name}")`

示例：

```java
// UserController.java

@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping
    public String findAll () {
        System.out.println("findAll()");
        return "{'info' : 'find all'}";
    }

    @GetMapping("/{name}")
    public String findByName (@PathVariable String name) {
        System.out.println("findByName(" + name + ")");
        return "{'info' : 'find by name'}";
    }

    @DeleteMapping("/{name}")
    public String deleteByName (@PathVariable String name) {
        System.out.println("deleteByName(" + name + ")");
        return "{'info' : 'delete by name'}";
    }

    @PostMapping
    @RequestMapping(method = RequestMethod.DELETE)
    public String insert (@RequestBody User user) {
        System.out.println("insert(" + user + ")");
        return "{'info' : 'insert'}";
    }

    @PutMapping
    public String update (@RequestBody User user) {
        System.out.println("update(" + user + ")");
        return "{'info' : 'update'}";
    }
}

```
实际案例
----

**在 Mac mini 上的 restful-mvc** 工程内

其中前端部分添加了如下内容

![20230928193847](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193847.png)

但是我们如果不做任何修改那么访问 books.html 是会被 SpringMVC 进行拦截，然后报404
SpringMVC 会认为这是要传递数据，应当在后端代码中存在 RequestMapping 但是没有找到
所以我们需要让 SpringMVC 放行该页面出去
在配置目录下添加 SpringMVC 的服务支持类，并将其资源控制进行修改，把要访问的页面目录指向它所对应的url目录进行管理

```java
// SpringMvcSupport.java

@Configuration
public class SpringMvcSupport extends WebMvcConfigurationSupport {

    @Override
    protected void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/css/**").addResourceLocations("/css/");
        registry.addResourceHandler("/js/**").addResourceLocations("/js/");
        registry.addResourceHandler("/pages/**").addResourceLocations("/pages/");
        registry.addResourceHandler("/plugins/**").addResourceLocations("/plugins/");
    }
}
```

这样就不会出问题了，然后我们分析一下前端内容

![20230928193854](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193854.png)

这些是表单内容，其中 index 是自增的不用我们管，所以提供一个 domain 类 Book

```java
// Book.java

public class Book {
    private String type;
    private String name;
    private String description;
    ...
}
```

然后做一个具备假数据层的 controller ，并利用我们之前的知识完成 findAll(line 10) 和 save(line 16)

```java
// BookController.java

@RestController
@RequestMapping("/book")
public class BookController {

    /* 假的数据层 */
    private List<Book> bookList;

    /* 返回数据集的 json */
    @GetMapping
    public List<Book> findAll () {
        return bookList;
    }

    /* 接收一个 post 传递的 json 形式 book，并存入 */
    @PostMapping
    public String save (@RequestBody Book book) {
        bookList.add(book);
        System.out.println(book);
        return "{'info' : 'save succeeded'}";
    }

    /* 初始便具备两本图书，并添加到数据层内 */
    BookController () {

        Book book1 = new Book();
        book1.setType("旅行记录");
        book1.setName("夏摩山谷");
        book1.setDescription("安妮宝贝出品禅心游记");

        Book book2 = new Book();
        book2.setType("计算机丛书");
        book2.setName("算法导论");
        book2.setDescription("计算机权威，经典黑书");

        bookList = new ArrayList<>();
        bookList.add(book1);
        bookList.add(book2);
    }
}
```

在前端通过给定的 vue 方法利用 ajax 进行调用

```js
  //添加
  saveBook () {
      /* 向 /book 提交本表单内的数据 */
      axios.post("/book", this.formData).then((res) => {
      });
  },

  //主页列表查询
  getAll() {
      /* 向 book 发起 get 请求，然后将返回的 json 数据生成类并放在 dataList 中用作展示 */
      axios.get("/book").then((res) => {
         this.dataList = res.data;
      });
  },
```
完成

![20230928193904](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230928193904.png)

SSM 整合
======

功能模块开发
------

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

前后端数据封装
-------

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

异常
==

异常处理器
-----

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
自定义异常类
------

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

SSM-前端加入
========

这里给出 vue 下的动作函数

```js
// books.html

<script>
    var vue = new Vue({

        el: '#app',
        data:{
            pagination: {},
            dataList: [],//当前页要展示的列表数据
            formData: {},//表单数据
            dialogFormVisible: false,//控制表单是否可见
            dialogFormVisible4Edit:false,//编辑表单是否可见
            rules: {//校验规则
                type: [{ required: true, message: '图书类别为必填项', trigger: 'blur' }],
                name: [{ required: true, message: '图书名称为必填项', trigger: 'blur' }]
            }
        },

        //钩子函数，VUE对象初始化完成后自动执行
        created() {
            this.getAll();
        },

        methods: {
            //列表
            getAll() {
            },

            //弹出添加窗口
            handleCreate() {
            },

            //重置表单
            resetForm() {
            },

            //添加
            handleAdd () {
            },

            //弹出编辑窗口
            handleUpdate(row) {
            },

            //编辑
            handleEdit() {
            },

            // 删除
            handleDelete(row) {
            }
        }
    })

</script>
```
后面的所有向后端发送数据的操作主要都是以 **axois异步提交，按对应的格式（路径变量、请求体内塞json）发送到我们后台指定的接收地址**

getAll()
--------

这个函数主要负责将后台查询数据填到前台显示的列表内，可以利用axois向我们的/books发送get无参请求

```js
getAll () {
  axois.get("/books").then((res) => {
  })
},
```
在提交后也就是里面的 =>{} 内，执行前台dataList列表用我们后端返回的 json 形式的 res 赋值
res 对应格式为：`res.data: {"data": [...], "code": ..., "msg": "..."}`

```js
	...
	this.dataList = res.data.data;
	...
```
那么这个函数的完整内容就是

```js
// books.html : vue.getAll()

  //列表
  getAll() {
      axios.get("/books").then((res) => {
          this.dataList = res.data.data
      })
  },
```
handleCreate() & resetForm()
----------------------------

* handleCreate() 负责的就是把添加窗口弹出，对应我们变量的 `dialogFormVisible`，将其设置为 true
我们的添加窗口内不能有之前在这个窗口内填写的数据，就调用一下 resetForm() 进行清空即可
* resetForm() 就是清空填写的表单数据，将其设置为空对象

<p></p>

```js
// books.html : vue.handleCreate() & resetForm()

  //弹出添加窗口
  handleCreate() {
      this.dialogFormVisible = true;
      this.resetForm();
  },
  //重置表单
  resetForm() {
      this.formData = {};
  },
```
handleAdd()
-----------

这个就是我们其中一个大头-**数据添加**了

我们利用 post 将 json 数据放入请求体内进行发送

```js
// books.html : vue.handleAdd()

  //添加
  handleAdd () {
      axios.post("/books", this.formData).then((res) => {
  },
```
这里 res 内容依旧是 `res.data: {"data": [...], "code": ..., "msg": "..."}`，这是我们后端返回的，不会变化
我们需要根据 code 来判断是否成功（20011）

* 成功的话弹出成功窗口，并关闭添加窗口（设置为 false）
* 失败的话弹失败窗口

最后再将数据回显到列表中，调用 getAll()

```js
// books.html : vue.handleAdd()

  //添加
  handleAdd () {
      axios.post("/books", this.formData).then((res) => {
          if (res.data.code === 20011) { // 成功
              /* 弹出成功窗口，并给出后端返回的信息 */
              this.$message.success(res.data.msg);
              /* 关闭添加窗口 */
              this.dialogFormVisible = false;
          } else { // 失败
              /* 弹出失败窗口，并给出后端返回的信息 */
              this.$message.error(res.data.msg);
          }
      }).finally(() => {
          /* 数据回显 */
          this.getAll();
      });
  },
```
handleUpdate(row)
-----------------

这里有一个 row 参数，在 html 表单中具备的内容有 `row{id, type, name, description)`

这里弹出的窗口内的信息输入框中需要已经有我们对应行的信息
所以要按 id 先进行查询（路径变量），然后将数据填到输入表单中并将其打开

```js
// books.html : vue.handleUpdate(row)

  //弹出编辑窗口
  handleUpdate(row) {
      /* 向 /books/<id> 发送 get 请求按 id 查询 */
      axios.get("/books/" + row.id).then((res) => {
          /* 数据填写到 formData 上 */
          this.formData = res.data.data;
          /* 打开输入表单 */
          this.dialogFormVisible4Edit = true;
      })
  },
```
在这之后我们就可以进行我们下面的编辑操作了

handleEdit()
------------

编辑用的是 put 操作将 formData 中的数据作为 json 放入请求体内传给后端
然后就和我们的添加操作是一样的道理了

```js
// books.html : vue.handleEdit()

  //编辑
  handleEdit() {
      /* 向 /books 发送 put 请求，请求体内的 json 为 formData */
      axios.put("/books", this.formData).then((res) => {
          if (res.data.code === 20031) { // 成功
              this.$message.success(res.data.msg) // 给出成功提示框
              this.dialogFormVisible4Edit = false;	// 关闭输入表单
          } else {	// 失败
              this.$message.error(res.data.msg) // 给出失败提示框
          }
      }).finally (() => {
          this.getAll(); // 数据回显
      });
  },
```
handleDelete(row)
-----------------

这个大差不差，主要是外面要包一层删除确认框

利用 $confirm 来实现，如果取消删除被 catch 到了要报一个 message.info 来提示取消操作

```js
// books.html : vue.handleDelete(row)

  // 删除
  handleDelete(row) {
      this.$confirm("永久删除，操作不可逆，是否确定删除《" + row.name  + "》？", "提示", {
          type: 'info'
      }).then(() => {
          /* !! 这里是删除业务 !! */
      }).catch(() => {
          this.$message.info("取消删除操作")
      })
  }
```
那么删除业务就和我们的更新业务很像，只是用 delete 请求完成的

```js
// books.html : vue.handleDelete(row) : 删除业务

 axios.delete("/books/" + row.id).then((res) => {
    if (res.data.code === 20021) {
        this.$message.success(res.data.msg);
    } else {
        this.$message.error(res.data.msg);
    }
}).finally(() => {
    this.getAll();
});
```
合并起来的代码就是

```java
  // 删除
  handleDelete(row) {
      this.$confirm("永久删除，操作不可逆，是否确定删除《" + row.name  + "》？", "提示", {
          type: 'info'
      }).then(() => {
          axios.delete("/books/" + row.id).then((res) => {
              if (res.data.code === 20021) {
                  this.$message.success(res.data.msg);
              } else {
                  this.$message.error(res.data.msg);
              }
          }).finally(() => {
              this.getAll();
          });
      }).catch(() => {
          this.$message.info("取消删除操作")
      })
  }
```
