---
title: c++调用python -- 基础
---

## 环境

嗯...首先电脑得有 $Cpp$ 和 $Python$ 环境（废话  
其次是这里使用 $cmake$ 编程，需要加入以下东西 

```txt
find_package(PythonLibs REQUIRED)
include_directories(${PYTHON_INCLUDE_DIRS})
target_link_libraries(<工程名> ${PYTHON_LIBRARIES})
```

这个工程名就是比如我是 $CppUsePython$ ，那么这里就填 `(CppUsePython ${PYTHON_LIBRARIES})`  
  
$cpp$ 调用 $python$ 的文件内要加入 `#include <Python.h>` 头文件

## 库函数

这只是一部分基础的本文内会使用到的函数  
  
### Py_Initialize

原型：`void Py_Initialize(void)`   
功能：创建 $py$ 虚拟环境并初始化

### Py_Finalize

原型：`void Py_Finalize(void)`  
功能：关闭之前创建的 $py$ 虚拟环境

### PyRun_SimpleString

原型：`void PyRun_SimpleString(const char *)`  
功能：用 $python$ 执行 $char*$ 表示的语句  
  
### PyImport_ImportModule

原型：`_object *PyImport_ImportModule(const char *)`  
功能：导入名字和 $char*$ 一样的 $py$ 脚本名（无后缀）  

### PyObject_GetAttrString

原型：`_object *PyObject_GetAttrString(_object *, const char *)`  
功能：返回 $\_object$ 模块内和 $char*$ 一样函数  

### Py[List]/[Tuple]_New

原型：`_object *Py[List]/[Tuple]_New(Py_ssize_t size)`  
功能：返回一个被初始化大小为 $size$ 的 $python$ [列表]/[元组]对象  

### Py[List]/[Tuple]_SetItem

原型：`int Py[List]/[Tuple]_SetItem(_object *, Py_ssize_t, _object *)`  
功能：将[列表]/[元组]对象 $\_object_1[t]$ 赋值为 $\_object_2$  

### Py[List]/[Tuple]_SetItem

原型：`_object Py[List]/[Tuple]_GetItem(_object *, Py_ssize_t)`  
功能：返回[列表]/[元组]对象 $\_object[t]$ 的值

### Py[List]/[Tuple]_Size

原型：`Py_ssize_t Py[List]/[Tuple]_Size(_object *)`  
功能：返回[列表]/[元组]对象 $\_object$ 的大小

### PyObject_CallObject

原型：`_object *PyObject_CallObject(_object *callable, _object *args)`  
功能：令函数对象 $callable$ 根据参数 $args$ 响应并将返回值返回  

### PyLong_FromLong

原型：`_object *PyLong_FromLong(long)`  
功能：返回 $cpp$ 的 $long$ 类型下的 $py$ $long$ 对象  

### PyLong_AsLong

原型：`long PyLong_AsLong(_object *)`  
功能：返回 $py$ $long$ 对象下的 $cpp$ 的 $long$ 类型  

## 实例

### 纯语句执行

现在给一个 $cpp$ 实例  

```cpp
# include <Python.h>

int main () {
    Py_Initialize();
    PyRun_SimpleString("print('hello python!')");
    Py_Finalize();
}
```

语句会输出  
  
```
hello python!
```

根据上面说的不难想到过程就是：  
- 初始化 $py$ 虚拟环境
- 在环境内执行 `print('hello python!')` 语句
- 关闭

### 整数相加

这里要考虑的就是：  
如何定位到要调用的 $python$ 程序及其函数、如何给函数传参并获取其返回值  
且如何将 $python$ 的变量类型和 $cpp$ 的变量类型之间来回转换  
  
当然在此之前先写好一个整数相加的 $py$ 程序  
  
```py
# add_module.py

def add_function(a, b):
    return a + b
```

在 $cpp$ 内也先写一个这样的函数  
  
```cpp
// main.cpp

int add_function_from_python (int a, int b) {
    // ...
}
```

按上面说的定位，需要在函数内加这些东西表示引入一个相对路径为 $../add\_module.py$ 的 $python$ 程序，并将程序内的函数 $add\_funcion$ 放入对象中  
  
```cpp
// python程序 引入到 pModule
PyRun_SimpleString("import sys");
PyRun_SimpleString("sys.path.append('../')"); // 路径
PyObject *pModule = PyImport_ImportModule("add_module"); // 程序名
// 将程序内的函数放进 pFunc
PyObject *pFunc = PyObject_GetAttrString(pModule, "add_function");
```

由于参数是两个，就设置一个大小为 $2$ 的元组并用 $PyTuple_SetItem()$ 传值  

```cpp
PyObject *pArgs = PyTuple_New(2);
PyTuple_SetItem(pArgs, 0, PyLong_FromLong(a)); // pArgs[0]=a
PyTuple_SetItem(pArgs, 1, PyLong_FromLong(b)); // pArgs[1]=b
```

然后就是将这个参数传进 $pFunc$ 内然后获取到其返回值，并将返回值解析成为 $add\_function\_from\_python$ 的返回值    

```cpp
PyObject *pValue = PyObject_CallObject(pFunc, pArgs);
int res = PyLong_AsLong(pValue);
return res;
```

然后就可以发现 $cpp$ 内调用它 `add_function_from_python(a, b) = a + b` 了  

**完整代码**

```cpp
// main.cpp

# include <bits/stdc++.h>
# include <Python.h>

int add_function_from_python (int a, int b) {
    // python程序引入到 pModule
    PyRun_SimpleString("import sys");
    PyRun_SimpleString("sys.path.append('../')"); // 路径
    PyObject *pModule = PyImport_ImportModule("add_module"); // 程序名

    // 将程序内的函数放进 pFunc
    PyObject *pFunc = PyObject_GetAttrString(pModule, "add_function");

    // 设置一个大小为 2 的元组
    PyObject *pArgs = PyTuple_New(2);
    // pArgs[0] = a, pArgs[1] = b
    PyTuple_SetItem(pArgs, 0, PyLong_FromLong(a));
    PyTuple_SetItem(pArgs, 1, PyLong_FromLong(b));

    // 用元组 pArgs 执行函数 pFunc
    PyObject *pValue = PyObject_CallObject(pFunc, pArgs);

    int res = PyLong_AsLong(pValue);
    return res;
}

int main(int argc, char *argv[]) {
    // 创建 py 虚拟环境初始化
    Py_Initialize();
    // 进入函数
    std::cout << add_function_from_python(1, 2) << std::endl;
    // 结束虚拟环境
    Py_Finalize();
    return 0;
}
```

输出  

```
3
```

### vector 合并

如果学会了上面的整数相加，可以思考原理并尝试自己写，不过下面还是会给出解析  
  
首先还是 $python$ 的被调用函数和 $cpp$ 的调用函数  

```py
# merge_vector_module.py

# 这里是传入的列表且返回的也是列表
def merge_vector_function (list1, list2):
    list = []
    for i in list1:
        list.append(i)
    for i in list2:
        list.append(i)
    return list
```

```cpp
// main.cpp

// 按顺序合并 a 和 b 并返回合并后的结果
std::vector<int> merge_vector_function_from_python (std::vector<int> a, std::vector<int> b) {
    // ...
}
```

整体都差不太多，这里的重心在于如何传参和如何解析返回值  
瞅一下咱们的 $py$ 参数：$([],[])$  
说明我们要构建两个列表对象，并将 `vector<int> a, b` 填入  
  
```cpp
PyObject *tuple_a = PyList_New(a.size()); // 定好大小
for (int i = 0; i < a.size(); i ++)
    PyList_SetItem(tuple_a, i, PyLong_FromLong(a[i])); // tuple_a[i] = a[i]
PyObject *tuple_b = PyList_New(b.size()); // 定好大小
for (int i = 0; i < b.size(); i ++) 
    PyList_SetItem(tuple_b, i, PyLong_FromLong(b[i])); // tuple_b[i] = b[i]
```

然后将这两个列表参数传入一个元组中  

```cpp
PyObject *pArgs = PyTuple_New(2);
PyTuple_SetItem(pArgs, 0, tuple_a);
PyTuple_SetItem(pArgs, 1, tuple_b);
```

然后和上面一样的调用 $pFunc$ ，参数为 $pArgs$ （这里就不赘述了  
获取到的 $pValue$ 是一个列表，获取它的大小并遍历它，将内容 `push_back` 进 `vector<int> res` 中  
  
```cpp
PyObject *pValue = PyObject_CallObject(pFunc, pArgs);
int pValueSize = PyList_Size(pValue);
for (int i = 0; i < pValueSize; i ++) {
    res.push_back(PyLong_AsLong(PyList_GetItem(pValue, i)));
}
return res;
```

**完整代码**

```cpp
// main.cpp

# include <bits/stdc++.h>
# include <Python.h>

std::vector<int> merge_vector_function_from_python (std::vector<int> a, std::vector<int> b) {
    std::vector<int> res;
    PyObject *pModule, *pFunc;

    PyRun_SimpleString("import sys");
    PyRun_SimpleString("sys.path.append('../')");
    pModule = PyImport_ImportModule("merge_vector_module");
    pFunc = PyObject_GetAttrString(pModule, "merge_vector_function");

    // 两个列表参数
    PyObject *tuple_a = PyList_New(a.size());
    for (int i = 0; i < a.size(); i ++)
        PyList_SetItem(tuple_a, i, PyLong_FromLong(a[i]));
    PyObject *tuple_b = PyList_New(b.size());
    for (int i = 0; i < b.size(); i ++)
        PyList_SetItem(tuple_b, i, PyLong_FromLong(b[i]));
    // 参数归入元组中
    PyObject *pArgs = PyTuple_New(2);
    PyTuple_SetItem(pArgs, 0, tuple_a);
    PyTuple_SetItem(pArgs, 1, tuple_b);

    // 获取返回值(列表)
    PyObject *pValue = PyObject_CallObject(pFunc, pArgs);
    int pValueSize = PyList_Size(pValue);
    // 遍历中逐个解析列表中的元素，并 push 进 res 中
    for (int i = 0; i < pValueSize; i ++) {
        res.push_back(PyLong_AsLong(PyList_GetItem(pValue, i)));
    }
    return res;
}

int main(int argc, char *argv[]) {
    // 创建 py 虚拟环境初始化
    Py_Initialize();
    // 进入函数
    std::vector<int> merge_res = merge_vector_function_from_python({1, 2}, {3, 2, 1});
    for (auto it : merge_res) std::cout << it << ' ';
    // 结束虚拟环境
    Py_Finalize();
    return 0;
}
```

输出  
  
```
1 2 3 2 1
```