---
title: 公共元数据对象自动填充
---

有些属性是大部分开发中POJO类里面都会具备的  
比如常见的管理系统里面更新的时候要备注“更新时间”、“更新人”这些东西  
如果每一次都要手动去 `set` 的话存在很多的代码冗余  
例：  

有很多类都有如下属性  

```java
@Data
public class ... {
    private int updateId;
    private LocalDateTime updateTime;

    ...
}
```

然后你在每个 controller 中的 `update()`、`create()` 里都要加上这么一段  

```java

...
    <对象实例>.set(session().getAttribute("id"));
    <对象实例>.set(LocalDateTime.now());
...

```

太冗杂了可能还要比这更多  
MybatisPlus 提供了一种自动填充机制，下面来说一下  

## 属性填充时机

通过注解来完成，在属性上面添加  
`@TableField(fill = FieldFill.<填充时机>)`    
来设置，填充时机有以下几类  

- `DEFAULT`：默认不处理
- `INSERT`：插入时填充
- `UPDATE`：更新时填充
- `INSERT_UPDATE`：插入与更新时都填充

仅有这个 MP 要知道填充的内容了话还需要下面的东西  

## 填充内容配置 - 元数据处理器

要自定义一个元数据处理器，并实现 MP 给定的处理器的两个方法  

```java
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) {
    }

    @Override
    public void updateFill(MetaObject metaObject) {
    }
}
```

这两个方法一个是插入时填充内容，一个是更新时填充内容，刚好对应了我们注解中的参数。内容都大差不差，下面说的写法是对应上面两个方法的。  
`metaObject` 这个实例通过设置键值对来完成填充，是对元数据类进行反射其属性实现的，要调用内部方法  
`metaObject.setValue("key", "value")` 可以给存在属性`key`的类设置其值为`value`   
上面的更新时间我们就可以写为  

```java
...
    @Override
    public void insertFill(MetaObject metaObject) {
        metaObject.setValue("updateTime", LocalDateTime.now())
    }
...
```  

这样在运行的时候就可以自动填充 `updateTime` 属性了，别的都是一样的  

## ❗️常见错误：被迫更新

元数据处理器中的一个 `xxxFill` 方法是一起执行的  
如果你同时存在 `createTime` 属性和 `updateTime` 属性且都在元数据处理器中设置了，比如  

```java
...
    @Override
    public void insertFill (MetaObject metaObject) {
        metaObject.setValue("createTime", LocalDateTime.now());
        metaObject.setValue("updateTime", LocalDateTime.now());
    }
...
```

然后你有一个 POJO 类中只有一个 `createTime` 而不存在属性 `updateTime` ，它都会一起被迫更新然后就异常了     
下面是解决办法

### 解决办法一

第一种是干脆对不寻常的类（不含你设置的公共字段）不采用自动填充  
只要类中没有任意一个 `...FieldFill.INSERT)` 注解，它就不会走 `MetaObject` 的逻辑  

### 解决办法二

设置之前检查一下是否存在对应的属性  
即

```java
...
    @Override
    public void insertFill(MetaObject metaObject) {
        if (metaObject.hasSetter("createTime")) {
            metaObject.setValue("createTime", LocalDateTime.now());
        }
        if (metaObject.hasSetter("updateTime")) {
            metaObject.setValue("updateTime", LocalDateTime.now());
        }
    }
...
```

就可以避免不存在的属性被更新了


## 另：介绍 session 中的数据填充

**这里介绍一下当前登录人（修改人）也就是网页 session 内容 `updateId` 的填充姿势，不想了解的可以划走了~**  
session 我们不能在 `BetaObjectHandler` 这里直接获取，我们需要一个在这个元数据控制器**外层**的东西来获取，要了解一个前置知识：  
  
JDK 为每个 HTTP 请求分配一个独立的线程直到这条 HTTP 结束  
会经过 过滤器 $\rightarrow$ `controller` $\rightarrow$ `MetaObjectHandler` ...    
每个线程可以使用 `ThreadLocal<类型>` 来存放本线程内公用的变量（与别的线程保持隔离）  
  
我们将其封装为一个工具类并做好 `set` 和 `get` 方法用于读写我们的当前登录的修改人 `id`    

```java
public class BaseContext {

    /* 用于存放公共信息（当前登录人id） */
    private static final ThreadLocal<Long> id = new ThreadLocal<>();

    public static void setId (Long id) {
        employeeId.set(id);
    }

    public static Long getId () {
        return employeeId.get();
    }

}
```

我们在本条 HTTP 处理线程经过的第一个我们自己写的类（过滤器）就将当前登录人（修改人）的 `id` 存起来  

```java
// 某某某filter

...
@Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
    ...
    Long employeeId = (Long) request.getSession().getAttribute("employee_id");
    if (employeeId != null) {

        /* 存为线程全局变量 id */
        BaseContext.setId(employeeId);

        filterChain.doFilter(request, response);
        return;
    }
    ...
}
...
```

然后也是同一个线程后面的步骤——负责填充内容的元数据处理器  
我们在直接拿这个 id 就行了  

```java
@Component
public class MyMetaObjectHandler implements MetaObjectHandler {
    @Override
    public void insertFill(MetaObject metaObject) {
        /* 直接获取 */
        metaObject.setValue("updateId", BaseContext.getId());
    }

    ...
}
```
