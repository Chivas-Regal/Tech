---
title: 企业化 RESTFUL 风格开发
---

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

## 注解区分

* `@RequestParam` 用于接收 url 地址或 post 表单提交
* `@RequestBody` 用于接收 json 传参
* `@PathVariable` 用于接收地址变量

## 简化开发

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
## 实际案例

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