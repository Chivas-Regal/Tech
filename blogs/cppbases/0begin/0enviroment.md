---
title: 环境
---

::: warning
本篇默认已经配置好了 $mingw64$ 和系统环境变量
:::

虽然上面是最为起始的一步，过程繁杂但也和别的语言配置方式无异，这里就说明一些关于别的东西的导入

## 头文件

头文件可以是自己编写的本地文件，重要的是导入外部第三方库，而很多情况下我们就算安装了那个工具包，也无法正确连接到它里面 `include` 内的各种 `.h` 文件  
首先我们需要分析一下我们能用的都在哪  
终端输入命令 `echo | g++ -v -x c++ -E -`  
![20221215213015](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221215213015.png)  
红色线框内的都是我们可以用的头文件目录  
在安装了某个库后，定位到它的路径，这里假设为 `/a/b/include` ，然后在终端写入:  

```cpp
CPLUS_INCLUDE_PATH=CPLUS_INCLUDE_PATH:/a/b/include
export CPLUS_INCLUDE_PATH
```  

即可

## CMake

### 生成

这里想要创建一个名为 `cppproject` 的工程，编译文件为 `main.cpp`  
首先打开一个文件夹，然后在里面创建一个名为 `CMakeLists.txt` 的文件  
终端依次写入 `mkdir cppproject` ， `cd cppproject` ， `vim CMakeLists.txt`

在打开的这个文件内写入以下内容  

```cpp
// CMakeLists.txt
cmake_minimum_required(VERSION 2.8)
project(cppproject)

add_executable(main main.cpp)
```

然后 `:wq` 退出，并新建 `main.cpp` ，写入  

```cpp
// main.cpp
# include <iostream>

int main () {
    std::cout << "Hello Cmake";
}
```

同样 `:wq` 退出，开始使用 `cmake`  
终端写入 `cmake -S . -B build` ， `cmake .` ，`make`  
此时已经编译好了，查看一下目录结构  
![20221215215045](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221215215045.png)  
可以发现这里有个名为 `main` 的文件，尝试运行，成功  

### 连接

有时候需要令 `Cmake` 使用第三方库，假定这个库储存到了 `/a/b`   
要导入的东西这里加到 `CMakeLists.txt` 内  

```cpp
cmake_minimum_required(VERSION 3.20)
project(cppproject)

include_directories("/a/b/include")
link_directories("/a/b/lib")

set(CMAKE_CXX_STANDARD 11)

add_executable(main main.cpp)
target_link_libraries(main lib.dylib)
```

这里的 `lib.dylib` 为在本工程中想使用的动态库，存放在 `/a/b/lib` 内  