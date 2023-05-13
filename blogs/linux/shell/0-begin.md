---
title: 起步
---

开这篇文章的起因其实是想尝试一下 QT 的 `qmake` ，然后发现指令好多 ... ，包含  

```
编译：
$ qmake -project QT+=widgets
$ qmake ./$project_name.pro
$ make
运行：
$ ./$project_name.app/Contents/MacOS/$project_name
```

懒人噩梦罢了，然后看到网上说可以把命令用 shell 封装成一个 `.sh` 文件，需要执行的时候直接 `bash 文件名.sh` 即可  
看起来很好玩，开整

## 脚本创建

选择一个稳定的位置创建脚本目录（我选择的是 `~/bin`，并且下面讲解是围绕这种创建位置展开的，要换位置的话自行替换下面的介绍）  
然后在里面创建一个 `hello.sh` 用来写一个脚本，这里就先用简单的 `echo` 命令来写

```sh
#!/bin/bash

a=1
abc=123

echo $a
echo $abc
```

保存后执行代码，也就是 `bash hello.sh` 后，会输出  

![20230512235105](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230512235105.png)

::: tip 可能会有如下问题
**问题1**：`a command not found`  
这是因为会有人在编辑别的代码时有好的习惯“运算符两侧加空格”，而 `.sh` 的语法让我们在等号这里不能有空格，所以一定写成 `a=1` 这种形式  
  
**问题2**：`bash: hello.sh: No such file or directory`  
(如果没保存的保存一下)这里介绍另一种，也就是不在父级目录下运行，这个等下会说
:::

## 全局化

这也是上面问题2的解决方案  
我们要将我们这个父级目录加入系统路径  
打开 `~/.zshrc` （我用的是 `zsh` ，用 `bash` 的打开 `~/.bashrc`）  
加入一句话

```r
export PATH="~/bin:$PATH"
```

然后 `source` 一下，此时我们在任何地方执行 `bash hello.sh` 都会有上面的输出了  

## 应用：替代编译

学了上面这些，我们应该投入我们实际的需求，也就是组装编译命令
这里就来一个简单的一键 `cmake` 编译运行吧  
在此之前创建一个简单的 cmake 工程  

```
/hello
    main.cpp
    CMakeLists.txt
```

`main.cpp` 里面就是一个输出 `hello world`  
我们在 `~/bin` 创建一个 `cmake.sh` ，编写如下内容  

```sh
#!/bin/bash

project_path=`pwd` # 工程路径，pwd 命令获取
project_name="${project_path##*/}" # 工程名

cmake -B build  # 在 build 文件夹内生成 Makefile 
cd build        # 进入 build 文件夹
make            # 生成可执行文件
./$project_name # 运行可执行文件
cd ..           # 退回来
```

基本就是把我们要执行的命令放在了一起，这里的两个变量 `project_path` 和 `project_name` 就是工程路径和工程名  
了解一点命令的很容易看出来我们要求工程名与文件夹名同名（`pwd` 是获取当前路径的命令）

保存后在我们的工程目录 `hello` 内，执行 `bash cmake.sh` 后即可看到输出  

![20230512234902](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20230512234902.png)