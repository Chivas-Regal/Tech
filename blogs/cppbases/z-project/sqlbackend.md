---
title: 数据库后台
---

## 需求分析

这里想构建一个可以展示在页面上的**数据库的管理器**，可通过前端文本框来实现**增删查**  
全部放在一个页面里面
- 侧边栏为查询部分
- 主体部分为表格展示的数据库，添加和删除都可以直接在表格内进行
  - 删除：每一行旁边都有一个删除键
  - 添加：最后一行填写完每一列信息后，对应一个添加键

## 思路设计

### 前端

整体被分为三个部分：标题栏、侧边查询栏、主体数据操作，可以使用三个 `<div>` 分隔开，标题栏置顶，然后下面两个水平布局  
查询栏是一组输入框结合一个查询按键，主体数据操作是一个表格，列为操作表列数加一（塞入一个操作按键），行为操作表行数加一（塞入一组添加信息）    

两组文本框都需要能将 `html` 中用户在查询栏中输入的信息传递给 `cgi` ，可以合并为一个大表单，对于每一个 `submit` 按键都能实现响应，但也会出现一个问题就是响应了话另外两个操作可能会受到影响，但是这里是一个文本框，另外两个操作在不写内容或者内容不全的情况下是不会响应的  

### 后端

首先 `cgi` 需要是一个连接了数据库的 `cpp` 实现的，用这个 `cpp` 可以对数据库进行增删查，这个之前的文章中有详解编码，就不赘述了，[传送门](../mysql/mysqlmanager.html) ，且这个对应的之前写好的一个 `SqlManager` 类，可以直接拿过来  
`cgi` 将从 `html` 那接收到信息来控制 `sql` 语句的 `WHERE` 定位，将提取出来的表传递给 `html` 进行展示，故需要将 `SqlManager::OutputMysql` 的返回值变成 `std::vector<std::vector<std::string> >` 类型，以便我们的传输  

### 前后交互

好了难点来了，我们通过 `html` 接受信息传递给 `cgi` ，然后 `cgi` 根据信息处理数据后再传递回给 `html` ，`cgi` 传递给 `html` 这件事似乎有点难做，故想到让 `cgi` 传递给 `cgi` 就省了很多事情 [参考之前的讲述](../web/file-post.html##cgi传递给cgi)  
且我们可以直接使用 `cgi` 来循环打印表格，就很方便了

## 程序设计

### 固定内容

首先是在正常的 `html` 上编写固定的样式，以便预览，这里样式完全按照自己的喜好来的，读者们也可以编写自己喜欢的页面，这里就不讲细致了，把骨架放出来  

```html
<body>
<form>
    <div><h1>学生信息收集</h1></div>
    <!--搜索栏-->
    <div>
        <div>
            姓名：<input type='text'/></br>
            学号：<input type='text'/></br>
            性别：<input type='text'/></br>
            年龄：<input type='text'/></br>
            系别：<input type='text'/></br>
        </div>
        <div>
            <input type='submit' value='搜索'/>
        </div>
    </div>
    <!--主体-->
    <div>
        <h2>学生信息表：</h2>
        <table>
            <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>性别</th>
                <th>年龄</th>
                <th>系别</th>
                <th>操作</th>
            </tr>
            <tr>
                <td>123456</td>
                <td>Chivas_Regal</td>
                <td>男</td>
                <td>20</td>
                <td>计算机系</td>
                <!-- 删除按钮 -->
                <td><button type="submit">-</button></td> 
            </tr>
            <!-- 添加信息 -->
            <tr>
                <td><input type="text"/></td>
                <td><input type="text"/></td>
                <td><input type="text"/></td>
                <td><input type="text"/></td>
                <td><input type="text"/></td>
                <td><button type="submit">+</button></td>
            </tr>
        </table>
    </div>
</form>
</body></html>
```

加上我喜欢的样式和微调布局后长这样：   
  
![20221216003939](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221216003939.png)

分析一下知道在 `<table>` 往上都是固定的，直接构建 `main.cpp` 的函数 `Header()` 用作输出这些，同时 `</table>` 下面的用作 `Ender()`  

```cpp
// main.cpp

void Header () {
    std::string header = "<body>\n"
                  "<form>\n"
                  "    <div><h1>学生信息收集</h1></div>\n"
                  "    <!--搜索栏-->\n"
                  "    <div>\n"
                  "        <div>\n"
                  "            姓名：<input type='text'/></br>\n"
                  "            学号：<input type='text'/></br>\n"
                  "            性别：<input type='text'/></br>\n"
                  "            年龄：<input type='text'/></br>\n"
                  "            系别：<input type='text'/></br>\n"
                  "        </div>\n"
                  "        <div>\n"
                  "            <input type='submit' value='搜索'/>\n"
                  "        </div>\n"
                  "    </div>\n"
                  "    <!--主体-->\n"
                  "    <div>\n"
                  "        <h2>学生信息表：</h2>\n"; // CLion 复制粘贴一下就好了，真方便 ...
    std::cout << header;
}
int Ender () {
    std::cout << "</form></body></html>";
    return 0;
}
```

### 查询与展示

我们展示的表和我们的查询是有关的，当查询为空的时候对应的 `sql` 不应该带上 `WHERE` 定位，故写好几个文本框的 `name` 为 `sno,sname,ssex,sage,sdept` 后，我们在代码最前面先收集好看看上一层有没有传递过来的数据，然后构建两个函数用作查询总表和查询定位表  
查询中我们在修改 `SqlManager::OutputMysql` 返回 `std::vector<std::vector<std::string> > ` 后，直接拿着这个二维数组去输出对应的表格内容  
同时每一行末尾要加一个删除按钮，我们对这些按钮也设置一个 `value` 和 `name` ，就按它所在第几行来设置，方便我们在后面删除操作中接取信息直接定位要删第几行的信息  
且在最后一行加入几个输入框和一个添加的按钮

```cpp
int main () {
    cgicc::Cgicc formData;
    cgicc::form_iterator fit_name = formData.getElement("sname");
    cgicc::form_iterator fit_no = formData.getElement("sno");
    cgicc::form_iterator fit_sex = formData.getElement("ssex");
    cgicc::form_iterator fit_age = formData.getElement("sage");
    cgicc::form_iterator fit_dept = formData.getElement("sdept");

    ...

    std::cout << "        <table>\n";
    // 看看有无内容
    if (fit_name->isEmpty() && fit_no->isEmpty() && fit_sex->isEmpty() && fit_age->isEmpty() && fit_dept->isEmpty()) {
        showAll(sqm);
    } else {
        showQuery(sqm, fit_name, fit_no, fit_sex, fit_age, fit_dept);
    }
    std::cout << "<tr>\n";
    // 添加的信息和按钮
    std::cout << "    <td><input type='text' name='add_no'/></td>\n";
    std::cout << "    <td><input type='text' name='add_name'/></td>\n";
    std::cout << "    <td><input type='text' name='add_sex'/></td>\n";
    std::cout << "    <td><input type='text' name='add_age'/></td>\n";
    std::cout << "    <td><input type='text' name='add_dept'/></td>\n";
    std::cout << "    <td><input type='submit' value='+'/></td>\n";
    std::cout << "</tr>\n";
    std::cout << "        </table>\n";
}

// 定位查询
void showQuery (SqlManager &sqm, cgicc::form_iterator fit_name, cgicc::form_iterator fit_no, cgicc::form_iterator fit_sex, cgicc::form_iterator fit_age, cgicc::form_iterator fit_dept) {
    // 搭建带 WHERE 定位的 sql 语句
    std::string sql = "SELECT * FROM STUDENT WHERE";
    if (!fit_no->isEmpty()) sql += " Sno=\"" + **fit_no + "\" AND";
    if (!fit_name->isEmpty()) sql += " Sname=\"" + **fit_name + "\" AND";
    if (!fit_sex->isEmpty()) sql += " Ssex=\"" + **fit_sex + "\" AND";
    if (!fit_age->isEmpty()) sql += " Sage=" + **fit_age + " AND";
    if (!fit_dept->isEmpty()) sql += " Sdept=\"" + **fit_dept + "\" AND";
    sql.pop_back(); sql.pop_back(); sql.pop_back(); // 删掉最后的 "AND"
    sqm.QueryMysql(sql);

    std::vector<std::vector<std::string> > output = sqm.OutputMysql(); // 返回表
    int lineidx = 1; // 行号
    // 打印整张表
    for (const std::vector<std::string> &line : output) {
        std::cout << "          <tr>\n";
        if (line[0] == "Sno") { // 列名信息
            std::cout << "              <th>学号</th>\n";
            std::cout << "              <th>姓名</th>\n";
            std::cout << "              <th>性别</th>\n";
            std::cout << "              <th>年龄</th>\n";
            std::cout << "              <th>系别</th>\n";
            std::cout << "              <th>操作</th>\n";
        } else {
            for (const std::string &curcol : line) {
                std::cout << "            <td>" << curcol << "</td>\n";
            }
            // name=delbtn(1/2/3/...), value=(1/2/3/...)
            std::cout << "              <td><button type=\"submit\" name=\"delbtn" << std::to_string(lineidx) << "\" value=\"" << std::to_string(lineidx) << "\">-</button></td>\n";
            lineidx ++;
        }
        std::cout << "          </tr>\n";
    }
}

// 本函数为打印全表，和上面的定位查询思路基本一致
void showAll (SqlManager &sqm) {
    sqm.QueryMysql("SELECT * FROM STUDENT");
    std::vector<std::vector<std::string> > output = sqm.OutputMysql();
    int lineidx = 1;
    for (const std::vector<std::string> &line : output) {
        std::cout << "          <tr>\n";
        if (line[0] == "Sno") {
            std::cout << "              <th>学号</th>\n";
            std::cout << "              <th>姓名</th>\n";
            std::cout << "              <th>性别</th>\n";
            std::cout << "              <th>年龄</th>\n";
            std::cout << "              <th>系别</th>\n";
            std::cout << "              <th>操作</th>\n";
        } else {
            for (const std::string &curcol : line) {
                std::cout << "              <td>" << curcol << "</td>\n";
            }
            std::cout << "              <td><button type=\"submit\" name=\"delbtn" << std::to_string(lineidx) << "\" value=\"" << std::to_string(lineidx) << "\">-</button></td>\n";
            lineidx ++;
        }
        std::cout << "          </tr>\n";
    }
}
```

### 添加与删除

对于添加，获取完在末尾输入好的整行数据后，直接将其填进 `STUDENT` 即可  

```cpp
void addRow (SqlManager &sqm, cgicc::form_iterator fit_sno, cgicc::form_iterator fit_sname, cgicc::form_iterator fit_sex, cgicc::form_iterator fit_age, cgicc::form_iterator fit_dept) {
    // 缺一不可
    if (fit_sno->isEmpty()) return;
    if (fit_sname->isEmpty()) return;
    if (fit_sex->isEmpty()) return;
    if (fit_age->isEmpty()) return;
    if (fit_dept->isEmpty()) return;
    // 装入之前写好的 StudentInfo 类中
    StudentInfo stu(**fit_sno, **fit_sname, **fit_sex, std::stoi(**fit_age), **fit_dept);
    // 插入
    sqm.InsertMysql(stu);
}
```  

对于删除，我们应当定位一下是哪一个删除按钮响应了，去获取对应行的信息然后精确删除  

```cpp
sqm.QueryMysql("SELECT * FROM STUDENT");
for (int i = 1; i <= sqm.numRow(); i ++) { // 遍历所有的行
    if (!formData.getElement("delbtn" + std::to_string(i))->isEmpty()) { // 找到了删除按钮响应了的行
        delRow(sqm, i);
        break;
    }
}
void delRow (SqlManager &sqm, int lineidx) {
    std::vector<std::vector<std::string> > table = sqm.OutputMysql();
    // 获取这一行的学生信息
    StudentInfo stu(table[lineidx][0], table[lineidx][1], table[lineidx][2], std::stoi(table[lineidx][3]), table[lineidx][4]); 
    // 精确删除
    sqm.DeleteMysql(stu);
}
```

注意这个之后就应该输出整张表，所以我们要放在打印表之前进行，同时要和上面的 `name{sno,sname,...}` 用同一个 `formData`  
这一部分的整体代码为：  

```cpp
int main () {
    // header 的制作
    ...
    cgicc::form_iterator fit_addsno = formData.getElement("add_no");
    cgicc::form_iterator fit_addsname = formData.getElement("add_name");
    cgicc::form_iterator fit_addsex = formData.getElement("add_sex");
    cgicc::form_iterator fit_addage = formData.getElement("add_age");
    cgicc::form_iterator fit_adddept = formData.getElement("add_dept");

    SqlManager sqm;
    sqm.ConnectMysql();
    sqm.QueryMysql("SELECT * FROM STUDENT");

    for (int i = 1; i <= sqm.numRow(); i ++) {
        if (!formData.getElement("delbtn" + std::to_string(i))->isEmpty()) {
            delRow(sqm, i);
            break;
        }
    }
    addRow(sqm, fit_addsno, fit_addsname, fit_addsex, fit_addage, fit_adddept);
    ... 
    // table 的制作和 ender
}
```

## 整体结构

- 表单(将所有数据传递给下一个自己) {
  - 接收上一个自己传递过来的数据
  - 用接收的数据 增添/删除
  - 用接收的数据 查询并制作表格
- }

## 成品演示

<div style="width: 100%; text-align: center;"> 
    <video width="999" height="312" controls autoplay>
        <source src="https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/demo.mp4" type="video/mp4">
    </video>
</div>

## 源代码

[传送门](https://github.com/Chivas-Regal/CppLearn/tree/main/cpp-html-mysql)