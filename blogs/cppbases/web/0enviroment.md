---
title: 环境
---

首先对于网络连接的解析配置涉及一些计网的知识，这里不再赘述了，网上的教程挺多的（雾    

这里说明一下需要的东西  
进入 [这个网页](https://www.gnu.org/software/cgicc/) 下载 `cgicc`  
下载后就可以将一个 `.cpp` 文件用动态库 `-lcgicc` 编译了  
  
终端 `g++ main.cpp -o main -lcgicc` 编译成功即可  
  
导入 `CMakeLists.txt` 的话如下  
 
```t
cmake_minimum_required(VERSION 3.20)
project(工程名)

include_directories("/usr/local/include") # cgicc 所在目录
link_directories("/usr/local/lib") # cgicc 所在目录的同级 lib 目录

set(CMAKE_CXX_STANDARD 11)

add_executable(目标文件.cgi {编译文件集合})
target_link_libraries(目标文件.cgi libcgicc.dylib) # 连接动态库编译
```