---
title: git 仓库基本组成
---

## 仓库创建

- 本地初始化一个
  1. 任意非仓库目录下创建一个空目录作为本地 git 仓库
  2. 进入该目录执行 `git init`
- 远程 clone
  1. 找到远程仓库的 git 地址 (`xxxx.git`)
  2. 在任意非仓库目录下执行 `git clone xxxx.git`
  3. 找到名为远程仓库名的文件夹，进去就可以操作文件了

![20231104114115](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104114115.png)  
两个红框标出了两种创建仓库的方式。

## 仓库结构

git 一个本地仓库项目结构为以下几个部分：

- 版本库：在经过 git 创建出一个本地仓库后，会生成一个 .git 文件夹叫做版本库，里面的具备一些配置、日志、文件版本等信息
- 工作区：包含 .git 文件夹的目录，主要用作存放代码
- 暂存区：.git/index 文件，临时保存修改文件  
$$工作区 \xrightarrow[添加选择的改变]{git\;add} 暂存区 \xrightarrow[提交改变]{git\;commit} 版本库$$  

一个初始的空仓库是不存在 index 文件的，我们创建一个文件并 `git add *` 改变一下再进 .git 看看就会发现多了个 index  
  
![20231104115344](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104115344.png)

## 工作区文件状态

分为两种：
- untracked 未跟踪（未被纳入版本控制）
- tracked 已跟踪（被纳入版本控制）
  1. Unmodified 未修改状态
  2. Modified 已修改状态
  3. Staged 已暂存状态

我们再创建一个 `test.txt` 且不将其做 `add` 操作，可以用 `git status` 查看状态，下面是命令行窗口给出的信息（做了标注    

```sh
# 在主分支上
On branch master
# 还没有提交
No commits yet
# 在暂存区中的内容
Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        # 我们之前做过 git add * 的文件
        new file:   README.md
# 不在暂存区中的内容
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        # 我们新创建的还没有 git add 的文件
        test.txt
```