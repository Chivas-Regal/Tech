---
title: SqlManager类（增删改查）
---
## 库函数

### mysql_init()

数据库对象初始化

`MYSQL *mysql`:接收方法分配和初始化的实例对象

### mysql_real_connect()

数据库对象连接，尝试与运行在主机上的MySQL数据库引擎建立连接
在你能够执行需要有效MySQL连接句柄结构的任何其他API函数之前，mysql_real_connect()必须成功完成

`MYSQL *mysql`:用来连接的数据库对象
`const char *host`:为 localhost 或者 null 时连接本地主机
`const char *user`:用户名
`const char *pwd`:密码
`const char *db`:数据库名，为空时连向默认数据库
`unsigned int port`:端口号
`const char *unix_socket`:连接方式，为 null 时，表明不使用 socket 或管道机制
`unsigned long client_flag`:经常设置为0

### mysql_query()

数据库对象查询

`MYSQL *mysql`:用作查询的数据库对象
`const char *q`:查询的sql语句

### mysql_store_result()

将查询的全部结果读取到客户端，分配1个MYSQL_RES结构，并将结果置于该结构中

返回 `MYSQL_RES* res` ，参数为 `MYSQL *mysql`

### mysql_affected_rows()

返回上次增、删、改、查后的行数，参数为 `MYSQL *mysql`

### mysql_num_fields()

返回数据库对象的列数，参数为 `MYSQL *mysql`

### mysql_fetch_field()

返回采用MYSQL_FIELD结构的结果集的列。重复调用该函数，以检索关于结果集中所有列的信息。未剩余字段时，mysql_fetch_field()返回NULL

参数为 `MYSQL_RES* res`
采用 $\to$name 可以获取到列名

### mysql_fetch_row()

获取一行数据库信息，参数为 `MYSQL_RES *res`
返回 `MYSQL_ROW` ，可以通过访问 $i\in[0,$ 列数$]$ 遍历这个对象

## SQL语句

### 增

`INSERT INTO [表名] ([field1], [field2], ...) VALUES ([value1], [value2], ...)`

### 删

`DELETE FROM [表名] WHERE [field_i]=[value_i] AND ...`

### 改

`UPDATE [表名] SET [field'_i]=[value'_i], ... WHERE [field_i]=[value_i] AND ...`

### 查

`WHERE` 定语在输出整表可以不带后面的东西
`SELECT *` 可以替换成查询特定属性

`SELECT * FROM [表名] WHERE ...`

## C++操作数据库

### CmakeLists.txt 配置

创建 Clion 项目，在 CmakeLists.txt 文件里导入 mysql 头文件路径

```cpp
include_directories("[mysql路径]/include")
link_directories("[mysql路径]/lib")
target_link_libraries([项目名称] libmysqlclient.dylib)
```

### 面向对象连接数据库

首先定义数据库对象 `MYSQL mysql;`

将其用本地信息连接数据库

```cpp
void ConnectMySql () {
  	// 本地数据库信息
    std::string user = "root"; // 用户名
    std::string pwd = "password"; // 密码
    std::string host = "localhost"; // 主机
    std::string db = "student"; // 数据库名
    unsigned int port = 3306; // 端口号
    mysql_init(&mysql);
    if (mysql_real_connect(&mysql,
                           host.c_str(),
                           user.c_str(),
                           pwd.c_str(),
                           db.c_str(),
                           port,
                           NULL,
                           0)) {
        std::cout << "connect successfully" << std::endl;
    } else {
        std::cout << "connect failed" << std::endl;
    }
}
```

### 操作函数

定义好 `MYSQL_RES *res;` 用于接收操作后的结果

```cpp
bool QueryDataBases (std::string sql) { // 数据库对象、操作语句
    mysql_query(&mysql, "set names utf8"); // 声明好编码，不然中文会乱码
    if (mysql_query(&mysql, sql.c_str())) {
        std::cout << "Query Failed ( " << (std::string)mysql_error(&mysql) << " )\n";
        return false;
    } else {
        std::cout << "Query Successfully\n";
    }
    if (!(res = mysql_store_result(&mysql))) { // res接收语句执行后的结果
        std::cout << "Couldn't Get Result From " + (std::string)mysql_error(&mysql) << ")\n";
        return false;
    }
    return true;
}
```

进行表的输出，执行上面的方法为 `QueryDataBases(mysql, "SELECT * FROM STUDENT");` ，将表的查询信息存入 `res` 中后，对 `res` 的信息进行处理和输出

```cpp
void OutputMysql() {
  	// 提取数据表行数、列数
    int numrow = mysql_affected_rows(&mysql);
    int numcol = mysql_num_fields(res);
    std::cout << "number of dataline returned: " << numrow << std::endl;
    for (int i = 0; i < numcol; i ++) {
      	// 输出列名
        std::string curCow = mysql_fetch_field(res)->name;
        std::cout.width(10);
        std::cout << curCow + "\t|\t";
    } std::cout << std::endl;

    MYSQL_ROW mysql_row;
  	// 对每一行，提取出这一行的 numcol 列的信息
    while (mysql_row = mysql_fetch_row(res)) {
        for (int i = 0; i < numcol; i ++) {
            std::string curCow = mysql_row[i];
            std::cout.width(10);
            std::cout << curCow + "\t|\t";
        }
        std::cout << std::endl;
    }
}
```

增删改类似于查询方法，但是没有输出的环节
核心在于几个sql语句和动态对象的插入，因为如果只是单纯的死命令而非可以直接操纵的对象信息，那就太过局限了，故可以创建一个 `student` 类，然后在增删改操作时可以直接访问设置的相关属性来保证插入的数据条属性是可活动的
而对于sql语句的编写，使用字符串将插入的数据信息连接到sql字符串内，保证该字符串符合sql语句的语法即可

```cpp
// 每个sql语句直接通过传入的对象套用sql模板实现
bool InsertMysql(StudentInfo student) {
  	// 将 StudentInfo 类的数据填入 sql 语句 
    std::string sql = "INSERT INTO STUDENT (Sno,Sname,Ssex,Sage,Sdept) VALUES (";
    sql += "\'" + student.getSno() + "\',";
    sql += "\'" + student.getSname() + "\',";
    sql += "\'" + student.getSsex() + "\',";
    sql += "\'" + std::to_string(student.getSage()) + "\',";
    sql += "\'" + student.getSdept() + "\')";
    mysql_query(&mysql, "set names utf8");
  	// 执行 sql 语句并将结果填入 mysql 中
    if (mysql_query(&mysql, sql.c_str())) {
        std::cout << "Fail insert with " << (std::string)mysql_error(&mysql) << std::endl;
        return false;
    }
    std::cout << "Successfully insert " << student.getInfo() << "!" << std::endl;
    return true;
}
bool DeleteMysql(StudentInfo student) {
  	// 同理 Insert
    std::string sql = "DELETE FROM STUDENT WHERE ";
    sql += "Sno=\'" + student.getSno() + "\' AND ";
    sql += "Sname=\'" + student.getSname() + "\' AND ";
    sql += "Ssex=\'" + student.getSsex() + "\' AND ";
    sql += "Sage=\'" + std::to_string(student.getSage()) + "\' AND ";
    sql += "Sdept=\'" + student.getSdept() + "\'";
    mysql_query(&mysql, "set names utf8");
    if (mysql_query(&mysql, sql.c_str())) {
        std::cout << "Fail delete with " << (std::string)mysql_error(&mysql) << std::endl;
        return false;
    }
    if (!mysql_affected_rows(&mysql)) {
        std::cout << "Fail delete with didn't find student " + student.getInfo() << std::endl;
        return false;
    }
    std::cout << "Successfully delete " << student.getInfo() << "!" << std::endl;
    return true;
}
bool UpdateMysql(StudentInfo student1, StudentInfo student2) {
  	// 同理 Insert
    std::string sql = "UPDATE STUDENT SET ";
    sql += "Sno=\'" + student2.getSno() + "\',";
    sql += "Sname=\'" + student2.getSname() + "\',";
    sql += "Ssex=\'" + student2.getSsex() + "\',";
    sql += "Sage=\'" + std::to_string(student2.getSage()) + "\',";
    sql += "Sdept=\'" + student2.getSdept() + "\'  WHERE ";
    sql += "Sno=\'" + student1.getSno() + "\' AND ";
    sql += "Sname=\'" + student1.getSname() + "\' AND ";
    sql += "Ssex=\'" + student1.getSsex() + "\' AND ";
    sql += "Sage=\'" + std::to_string(student1.getSage()) + "\' AND ";
    sql += "Sdept=\'" + student1.getSdept() + "\'";
    mysql_query(&mysql, "set names utf8");
    if (mysql_query(&mysql, sql.c_str())) {
        std::cout << "Fail update with " << (std::string)mysql_error(&mysql) << std::endl;
        return false;
    }
    if (!mysql_affected_rows(&mysql)) {
        std::cout << "Fail update with didn't find student " + student1.getInfo() << std::endl;
        return false;
    }
    std::cout << "Successfully update!" << std::endl;
    return true;
}
```

### 将操作封装入 SqlManager 类中

```cpp
class SqlManager {
private:
    std::string user = "root";
    std::string pwd = "password";
    std::string host = "localhost";
    std::string db = "student";
    unsigned int port = 3306;
    MYSQL mysql;
    MYSQL_RES *res;

public:
    // 连接数据库
    void ConnectMysql ();

    // 按照 sql 语句查询 mysql
    bool QueryMysql (std::string sql);

    // 插入一行数据为 student
    bool InsertMysql (StudentInfo student);

    // 删除含student的行
    bool DeleteMysql (StudentInfo student);

    // 将含student1的行修改为student2，找不到或者修改失败返回0，否则返回1
    bool UpdateMysql (StudentInfo student1, StudentInfo student2);

    // 按照上次查询语句输出数据库
    void OutputMysql ();
};
```

## 源文件

点击图片进入
<a href="https://github.com/Chivas-Regal/CppLearn/tree/main/CppWithMysql">![20221114003602](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221114003602.png)</a>
