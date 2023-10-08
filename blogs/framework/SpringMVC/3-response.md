---
title: MVC 响应发送方式
---

我们之前演示的时候就已经演示了字符串的响应了，我们演示下面两个

## 响应页面

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

## 响应Json数据

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