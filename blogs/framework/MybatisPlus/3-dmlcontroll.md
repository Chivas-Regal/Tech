---
title: DML 编程控制
---

## id生成策略控制

- `AUTO(0)` 使用数据库 id 自增策略控制 id 生成  
- `NONE(1)` 不设置 id 生成策略
- `INPUT(2)` 用户手工输入 id
- `ASSIGN_ID(3)` 雪花算法生成 id  
- `ASSIGN_UUID(4)` 以 UUID 生成算法作为 id 生成策略

使用方式为在实体类属性上添加  
`@TableId(type = IdType.<策略名>)`  

这里重新修改 POJO 类中的主键 id   

```java
public class Book {
    @TableId(type = IdType.AUTO)
    private Integer id;
    ...
}
```

也可以做全局设置  
```yml
# application.yml

mybatis-plus:
  global-config:
    db-config:
      id-type: <策略名>
      table-prefix: <表名前缀>
```

这里提了一句表名前缀，如果我们将其设置为 `tbl_` ，那么我们的 Book 类就可以匹配上 tbl_book 表了

## 多记录操作

> 场景：购物车系统一次选中多个，批量删除

`deleteBatchIds()` 方法内要求传入参数为一个集合，表示删除所有 id 存在于集合内的记录  

```java
List<Integer> list = new ArrayList<>();
list.add(1);
list.add(3);
list.add(4);
bookDao.deleteBatchIds(list);
```

即可完成批量删除  
也有类似功能的批量查询：`selectBatchIds(...)`

## 逻辑删除

对业务记录数据库的删除操作对数据库本身的伤害很大  
我们可以改为用一个字段来标注每行数据是否被删除  
MP 提供了这种删除方式，它会利用删除标记在程序识别时将已经逻辑删除的内容不显示，同时不真正删除原式数据库  
  
1. 先添加数据库字段 deleted 

<p></p>

```sql
alter table tbl_book
    add deleted int not null default 0;
```

2. 在实体类 Book 中添加属性，并注解上 `@TableLogic`

<p></p>

```java
@TableName("tbl_book")
@Data
public class Book {

    @TableId(type = IdType.AUTO)
    private Integer id;

    @TableField("name")
    private String mname;
    
    @TableField("type")
    private String mtype;
    
    @TableField("description")
    private String mdescription;
    
    /* 未删除为0，已删除为1 */
    @TableLogic(value = "0", delval = "1")
    private Integer deleted;

}
```

3. 测试删除

<p></p>

这是现在的表以及当前查询全部  

![20231007184032](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231007184032.png)

```sql
==>  Preparing: SELECT id,name AS mname,type AS mtype,description AS mdescription,deleted FROM tbl_book WHERE deleted=0
==> Parameters: 
<==    Columns: id, mname, mtype, mdescription, deleted
<==        Row: 1, 计算机网络, 计算机丛书, 经典黑书，带你领略计算机网络的奥秘, 0
<==        Row: 2, 算法导论, 计算机丛书, 经典黑书，带你领略算法的奥秘, 0
<==        Row: 11, 数据库系统概念, 计算机丛书, 经典黑书，带你领略数据库的奥秘, 0
<==        Row: 12, 计算机组成原理, 计算机丛书, 经典黑书，带你领略计算机组成的奥秘, 0
<==        Row: 35, 22, 11, 33, 0
<==      Total: 5
```

可以看到这个 sql 语句被增强为了 `WHERE deleted=0`  
做一下删除操作再查询

```java
LambdaQueryWrapper<Book> qw = new LambdaQueryWrapper<>();
bookDao.deleteById(1);
System.out.println(bookDao.selectList(null));
```

看看日志输出  

```sql
==>  Preparing: UPDATE tbl_book SET deleted=1 WHERE id=? AND deleted=0
==> Parameters: 1(Integer)
<==    Updates: 1

...

==>  Preparing: SELECT id,name AS mname,type AS mtype,description AS mdescription,deleted FROM tbl_book WHERE deleted=0
==> Parameters: 
<==    Columns: id, mname, mtype, mdescription, deleted
<==        Row: 2, 算法导论, 计算机丛书, 经典黑书，带你领略算法的奥秘, 0
<==        Row: 11, 数据库系统概念, 计算机丛书, 经典黑书，带你领略数据库的奥秘, 0
<==        Row: 12, 计算机组成原理, 计算机丛书, 经典黑书，带你领略计算机组成的奥秘, 0
<==        Row: 35, 22, 11, 33, 0
<==      Total: 4
```

发现已经查询不到了，并且在删除时使用的是 update 操作改的 deleted   
再看一下表的内容  

![20231007184517](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231007184517.png)

也确实是给 id=1 的记录添加了 deleted=1  
这样我们在 mp 中就查不到它了  

::: tip 全局统一删除标记值

日常开发中如果 `@TableLogic` 里面删除标记要自己写，那有可能 01 或者别的数都写得很乱  
可以使用 yml 配置文件全局定义一下  

```yml
# application.yml

mybatis-plus:
  global-config:
    db-config:
      logic-delete-value: 1
      logic-not-delete-value: 0
```

这样就默认了所有的已删除标记都是1，未删除标记都是0  
我们在写的删除属性的时候写个这个就可以了  

```java
public class Book {
    ...
    @TableLogic
    private Integer deleted;
    ...
}
```

:::

## 乐观锁

一般出现于高并发的情况，乐观锁使用了记录版本机制来保证并发安全性  
正常是再开一个字段 `version`  

```sql
alter table tbl_book
    add version int null default 1;
```

并在 POJO 类添加属性 `version` 以及注解 `@Version`  

```java
public class Book {
    ...
    @Version
    public Integer version;
    ...
}
```

有了版本我们在修改时应执行sql  

```sql
UPDATE <table_name> SET ..., version=version+1 WHERE id=? AND version=<当前值>
```

其中 version 相关的都是 MP 自动为我们加上的，这也是一种拦截并增强的机制  
因此我们要加装乐观锁拦截器  

```java
@Configuration
public class MpConfig {

    @Bean
    public MybatisPlusInterceptor mpInterceptor () {
        /* 注册 mp 拦截器 */
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        /* 加装分页拦截器 */
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor());
        /* 加装乐观锁拦截器 */
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        return interceptor;
    }

}
```

注意到我们在乐观锁 sql 中存在一条 `<当前值>` ，这个是需要我们先收取信息然后再做修改的  
因此业务逻辑代码应为（修改id为1的书名name）    

```java
Book book = bookDao.selectById(1);
book.setMname("算法导论（副本）");
bookDao.updateById(book);

System.out.println(bookDao.selectList(null));
```

观察一下 sql 语句  

```sql
==>  Preparing: UPDATE tbl_book SET name=?, type=?, description=?, version=? WHERE id=? AND version=? AND deleted=0
==> Parameters: 算法导论（副本）(String), 计算机丛书(String), 经典黑书，带你领略计算机网络的奥秘(String), 2(Integer), 1(Integer), 1(Integer)
<==    Updates: 1

...

==>  Preparing: SELECT id,name AS mname,type AS mtype,description AS mdescription,deleted,version FROM tbl_book WHERE deleted=0
==> Parameters: 
<==    Columns: id, mname, mtype, mdescription, deleted, version
<==        Row: 1, 算法导论（副本）, 计算机丛书, 经典黑书，带你领略计算机网络的奥秘, 0, 2
<==        Row: 2, 算法导论, 计算机丛书, 经典黑书，带你领略算法的奥秘, 0, 1
<==        Row: 11, 数据库系统概念, 计算机丛书, 经典黑书，带你领略数据库的奥秘, 0, 1
<==        Row: 12, 计算机组成原理, 计算机丛书, 经典黑书，带你领略计算机组成的奥秘, 0, 1
<==        Row: 35, 22, 11, 33, 0, 1
<==      Total: 5
```

可以看到修改成功且 sql 语句代入值也是我们需要的格式  