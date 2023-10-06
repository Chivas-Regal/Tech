---
title: Mybatis Plus
---

## 入门案例

先说最基础的 mp 工程的四个元素：
- pom.xml 导入坐标
- application.yml 文件配置
- 可以匹配数据表的 domain 实体类
- 利用上面实体类+sql操作表的被代理实现的 dao 接口（不同：继承已有方法完成简化）

下面是完成这个工程的具体操作  

多导入一个这个坐标  

```xml
<!-- pom.xml -->

<dependency>
    <groupId>com.baomidou</groupId>
    <artifactId>mybatis-plus-boot-starter</artifactId>
    <version>3.5.2</version>
</dependency>
```

配置好 yml 的 datasource 信息  

```yml
# application.yml

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://localhost:3306/learn_info
    username: 'root'
    password: 'xxxxxxxxxxx'
    type: com.alibaba.druid.pool.DruidDataSource
```

做一个能植入 datasource 中 url 对应数据库 learn_info 下的数据表的类  
比如 learn_info 下有一张表 tbl_book

```sql
mysql> desc tbl_book;
+-------------+--------------+------+-----+---------+----------------+
| Field       | Type         | Null | Key | Default | Extra          |
+-------------+--------------+------+-----+---------+----------------+
| id          | int          | NO   | PRI | NULL    | auto_increment |
| type        | varchar(20)  | YES  |     | NULL    |                |
| name        | varchar(50)  | YES  |     | NULL    |                |
| description | varchar(255) | YES  |     | NULL    |                |
+-------------+--------------+------+-----+---------+----------------+
4 rows in set (0.02 sec)
```

我们假设对应的类为 `Obj` ，先说我们在 Mybatis 中做了自动代理实现的接口 BookDao  

```java
@Mapper
public interface BookDao extends BaseMapper<tbl_book> {
}
```

我们用的是 SpringBoot ，就直接在上面加一个 `@Mapper`  
Mybatis Plus 可以省去写内部的接口方法，改为 `extends BaseMapper<Obj>` 来完成方法继承一些已经写好的实用的方法，诸如 `insert(Obj obj)`、`selectById(int id)` 这样的  
我们这个 dao 就可以对 `Obj` 与其**对应的表**进行 sql 操作  
  
<mark><b>实体类名对应表名</b></mark>有两种识别方案（表名：`tbl_book`）  
- 数据类名与表名相同，可以自动识别
  - TblBook.java
  - tbl_book.java
- 数据类名与表名不同，需要在上面加上 `@TableName("tbl_book")` 这句话
  
<p></p>  
  
```java
// 用 TblBook 可以自动匹配表名
public class TblBook {
    ...
```

```java
// 用 Book 需要注解手动匹配表名
@TableName("tbl_book")
public class Book {
    ...
```

表名有了匹配方式，字段名自然也有  
<mark><b>实体类的属性对应表的字段</b></mark>也有两种匹配方式（字段名：`a_b int`）
- 属性名与字段名相同，可以自动识别  
  - `private int aB`
  - `private int a_b`
- 属性名与字段名不同，需要在上面添加 `@TableField("a_b")` 这句话

比如 `Book` 类匹配 `tbl_book` 表，用 `mid, name, mtype, description` 四个属性匹配 `id, name, type, description` 四个字段  

```java
@TableName("tbl_book")
public class Book {

    @TableField("id")
    private Integer mid;

    private String name;

    @TableField("type")
    private String mtype;

    private String description;

    ...
```

即可完成  

## 标准数据层开发

|功能|MP接口|
|-|-|
|新增|`int insert(T t)`|
|删除|`int deleteById(Serializable id)`|
|修改|`int updateById(T t)`|
|根据id查询|`T selectById(Serializable id)`|
|查询全部|`List<T> selectList()`|
|分页查询|`IPage<T> selectPage(IPage<T> page)`|
|按条件查询|`IPage<T> selectPage(Wrapper<T> queryWrapper)`|

### CRUD 使用

其中修改操作的参数 T ，我们 set 入 id 后，仅需要再 set 需要修改的字段（属性），别的不修改的 MP 会为其进行保留  
比如有行 `id=1, name='abc', type='char', description='lowerchar'`  
我们进行  
```java
@AutoWired
private BookDao bookDao;

...

    Book book = new Book();
    book.setId(1);
    book.setName("aaa");
    bookDao.updateById(book);
...
```

即可修改为 `id=1, name='aaa', type='char', description='lowerchar'`  
而不是像我们之前手动写会直接传入 null  

### ✅ 简化开发：lombok 简化 POJO 实体类开发  

我们 POJO 实体类里面不想自己写或者自己快捷键生成 `getter、setter、constructor` 等方法，均可以利用注解来完成

导入 lombok 坐标

```xml
<!-- pom.xml -->

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

在想自动生成方法的类上面加上下面这样的注解  

```java
// Book.java

/* 无参构造 */
@NoArgsConstructor
/* 全参构造 */
@AllArgsConstructor
/* getter */
@Getter
/* setter */
@Setter
/* toString */
@ToString
/* equals、hashCode */
@EqualsAndHashCode

... // 还有很多别的自动生成的方法

public class Book {
    ...
```

但是似乎也很长，加一个 `@Data` 可以替代这里除了构造方法之外的另外几个注解  

```java
@Data
public class Book {
    ...
```

### 分页查询

`selectPage` 这个方法参数要有一个 IPage，我们先构造一个然后导入其中获取查询数据  

```java
// 查询第二页，每页两条数据
IPage iPage = new Page(2, 2);
bookDao.selectPage(iPage, null);
System.out.println(iPage.getRecords());
```

但是不做别的配置这样查询结果是所有的数据，分页失效  
原因：  
分页查询 sql 语句是后面要做 `... limit ?, ?` ，这是一种类似 aop 的行为，这里叫做拦截并增强  
拦截了我们的 sql 语句并做了 limit 增强  
所以我们需要有 MybatisPlus 的拦截器，并在其中加入内置拦截器分页拦截器  

```java
// config/MpConfig.java

@Configuration
public class MpConfig {

    @Bean
    public MybatisPlusInterceptor mpInterceptor () {
        /* 注册 MybatisPlus 拦截器*/
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        /* 加入内置拦截器——分页拦截器 */
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor());
        return interceptor;
    }

}
```

这样再使用上面的分页查询代码就生效了，配置中加入日志打印到控制台看看Sql语句  

```yml
# application.yml

...
mybatis-plus:
  configuration:
    log-impl: org.apache.ibatis.logging.stdout.StdOutImpl
```

运行内容：  

```sh
... # 一些 sqlsession 和 jdbc 的内容
==>  Preparing: SELECT COUNT(*) AS total FROM tbl_book
==> Parameters: 
<==    Columns: total
<==        Row: 5
<==      Total: 1
# 可以看到这里是将 2,2 植入到 LIMIT ?,? 内
==>  Preparing: SELECT id,name,type,description FROM tbl_book LIMIT ?,?
==> Parameters: 2(Long), 2(Long)
<==    Columns: id, name, type, description
<==        Row: 11, 数据库系统概念, 计算机丛书, 经典黑书，带你领略数据库的奥秘
<==        Row: 12, 计算机组成原理, 计算机丛书, 经典黑书，带你领略计算机组成的奥秘
<==      Total: 2
... # 关闭 sqlsession 和输出的结果
```

## DQL 编程控制

### 条件查询

在参数中频繁出现的 `Wrapper<>` 就是条件控制器，我们这里利用它完成简单的演示  
例如：查询 id 小于 10 的记录    

#### 查询格式

- 常规格式

直接使用条件方法+字段名+值来完成设置  

```java
QueryWrapper qw = new QueryWrapper();
qw.lt("id", 10);
System.out.println(bookDao.selectList(qw));
```

存在危险：当字段名写成一个不存在的字段出错难以排查，诞生下面格式    

- Lambda 格式

在上一步的基础上将 `.lt()` 之前用 `.lambda()` 转换为 LambdaQueryWrapper   
后面可以使用对应 POJO 实体类完成属性（字段）控制  
当然泛型必须特化为这个类  

```java
QueryWrapper<Book> qw = new QueryWrapper<Book>();
/* 之前我们设置的 Book 类匹配 tbl_book 表 id 字段的属性是 mid */
qw.lambda().lt(Book::getMid, 10);
System.out.println(bookDao.selectList(qw));
```

- Lambda 格式（简化）

上面也说了我们是转换成 LambdaQueryWrapper 了，可以直接使用这个类完成条件控制  

```java
LambdaQueryWrapper<Book> qw = new LambdaQueryWrapper<Book>();
qw.lt(Book::getMid, 10);
System.out.println(bookDao.selectList(qw));
```

#### 条件组合

当出现多个查询条件时，有两种方式进行拼接   
例如：查询 $id\in(5,10)$ 之间的记录  

- 一条条往下写

<p></p>

```java
qw.lt(Book::getMid, 10);
qw.gt(Book::getMid, 5);
```

- 链式编程

<p></p>

```java
qw.lt(Book::getMid, 10).gt(Book::getMid, 5);
```

<br>

还有一种组合操作是查询 $id\in(-\infin,5)\cup(10,\infin)$ ，这个需要用到 `or()` 了  
只需要  

```java
qw.gt(Book::getMid, 10).or().lt(Book::getMid, 5);
```

#### null 判定

如果前台有支持用户用上下界过滤数据的功能，那么我们后端要接收的上下界有可能是null（用户不设定）  
这里我们用一个类进行模拟用户查询提交的POJO类  

```java
// com.snopzyz.domain.query.BookQuery

@EqualsAndHashCode(callSuper = true)
@Data
public class BookQuery extends Book {

    /* 原 mid 为下界，此 mid2 为上界 */
    private Integer mid2;
}
```

然后我们在应用程序内做这个接收并且设置条件后返回  

```java
/* 假定前端传入用户过滤数据 */
BookQuery bookQuery = new BookQuery();
bookQuery.setMid(5);
bookQuery.setMid2(20);

LambdaQueryWrapper<Book> qw = new LambdaQueryWrapper<Book>();
qw.gt(Book::getMid, bookQuery.getMid());
qw.lt(Book::getMid, bookQuery.getMid2());
System.out.println(bookDao.selectList(qw));
```

这都是正常的，但倘若缺了一个界限为 null，那么查询到的就是空集了  
我们很容易想到可以自行判断是否做这个条件，有下面两种方式：

- 方式一：`if` 语句判空

<p></p>

```java
LambdaQueryWrapper<Book> qw = new LambdaQueryWrapper<Book>();
if (bookQuery.getMid() != null) {
    qw.gt(Book::getMid, bookQuery.getMid());
}
if (bookQuery.getMid2() != null) {
    qw.lt(Book::getMid, bookQuery.getMid2());
}
System.out.println(bookDao.selectList(qw));
```

- 方式二：使用方法内置的 `boolean condition` 条件分支参数

<p></p>

```java
LambdaQueryWrapper<Book> qw = new LambdaQueryWrapper<Book>();
qw.gt(bookQuery.getMid() != null, Book::getMid, bookQuery.getMid());
qw.lt(bookQuery.getMid2() != null, Book::getMid, bookQuery.getMid2());
System.out.println(bookDao.selectList(qw));
```

#### 其他条件

下面用 `LambdaQueryWrapper<Book> qw = new LambdaQueryWrapper<>();` 来进行演示  

<b>精准匹配: `eq()` </b>  

```java
qw.eq(Book::getMtype, "计算机丛书").eq(Book::getMname, "算法导论");
```

**范围查询**   
- `gt()`: `>`
- `lt()`: `<`
- `ge()`: `>=`
- `le()`: `<=`
- `between()`: `[?,?]`  

<p></p>

```java
qw.between(Book::getMid, 5, 20);
```

**模糊匹配**  
- `like()`：`%?%`
- `likeLeft()`：`%?`
- `likeRight()`：`?%`

<p></p>

```java
qw.like(Book::getMname, "导"); // 算法导论
```

### 查询投影

控制我们看到的结果  

#### 查询结果包含模型类中的部分属性    

- lambda 包装

<p></p>

```java
LambdaQueryWrapper<Book> qw = new LambdaQueryWrapper<Book>();
qw.select(Book::getMid, Book::getMdescription);
System.out.println(bookDao.selectList(qw));
```

- 常规包装

<p></p>

```java
QueryWrapper<Book> qw = new QueryWrapper<Book>();
qw.select("id", "description");
System.out.println(bookDao.selectList(qw));
```

#### 查询结果包含模型类未定义属性

比如按 `type` 做个分组  
我们现在的表内容长这样（11,22,33 那个是之前 [springboot 前端结合](./SpringBoot.html#前端结合) 测试页面的时候加的    

![20231006213302](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231006213302.png)

我们用 `qw.select("count(*) as count, type")` 来做查询返回内容  
容纳结果的就不能用 Book 类了，要用 `selectMaps` 返回的 `List<Map<String, Object>>` 承载  

```java
QueryWrapper<Book> qw = new QueryWrapper<Book>();
qw.select("count(*) as count, type");
qw.groupBy("type");
List<Map<String, Object>> maps = bookDao.selectMaps(qw);
System.out.println(maps);
```

这是输出的内容（带上日志）  

```sh
...
==>  Preparing: SELECT count(*) as count, type FROM tbl_book GROUP BY type
==> Parameters: 
<==    Columns: count, type
<==        Row: 4, 计算机丛书
<==        Row: 1, 11
<==      Total: 2
... # SqlSession 关闭
[{count=4, type=计算机丛书}, {count=1, type=11}]
```

::: tip

如果有用到 MybatisPlus 不支持的函数  
我们恢复到 Mybatis 方式在 Dao 接口内手动添加方法与代理增强方式

:::