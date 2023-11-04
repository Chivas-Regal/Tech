---
title: IDEA 中使用 git
---

## 创建 git 仓库

先在 Settings/Version Control/Git 下配置好 git 相关  

### 本地初始化仓库

1. 进入 Search 找到 Import into Version Control
![20231104183802](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104183802.png)
2. 选择 Create Git Repository
![20231104183832](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104183832.png)
3. 确认一下想要执行 git init 的路径，点击 Yes
![20231104183934](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104183934.png)
4. 终端确认一下目录里面是否存在 .git   
![20231104184040](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104184040.png)    
并且在执行完之后这里也多出了一些 git 操作功能  
![20231104184438](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104184438.png)

### 远程 clone 仓库

1. 在启动页面右上角点击 Get from VCS  
![20231104185005](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104185005.png)
2. 复制我们刚建好的 gitee 上的 repo2 仓库的 .git 路径，粘贴到 URL 框中，点击右下角的 clone  
![20231104185121](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104185121.png)
3. 检查是否 clone 成功  
![20231104185250](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104185250.png)  
这里多出来了几个 git 操作，成功了

我们在之前本地初始化的时候创建的 maven 工程 hellogit 用命令拉到了 repo2 工程下  
打开 repo2 本地工程，在 Search 中搜索点击 Add as Maven projects 即可将项目转成 maven 的  

## 本地仓库

### 文件 Add

当我们新建文件的时候会弹出这个，选择 Add 可以选择将新文件自动 `add` 到暂存区
![20231104191520](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104191520.png)  
当然若按了 Cancel 后面要 Add 的时候可以右击文件在下拉框中选 Git/Add  
![20231104191625](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104191625.png)  
然后它就由红色变绿色了  
![20231104191655](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104191655.png)

### 文件 Commit

我们假定现在 Add 了这两个文件  
![20231104191849](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104191849.png)  
想把它们加到本地仓库，一样可以通过右击文件按如下选中  
![20231104191950](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104191950.png)  
然后左边会弹出一系列可以勾选的暂存区中的文件，勾选之后填好 commit 信息后提交  
![20231104192049](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104192049.png)  
当然也可以点击这里提交  
![20231104192144](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104192144.png)  

接着再次修改 TestController.java 中的部分内容，根据上面的方法点击提交发现修改的文件不需要加到暂存区就可以提交了  

下面也可以看到整个版本库的修改历史  
![20231104192714](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104192714.png)

## 远程仓库

### 查看连接的远程仓库

右击项目名，按如下选择即可查看  
![20231104193015](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104193015.png)  
![20231104193034](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104193034.png)

### 推送至远程

在这个工具窗口栏选择推送  
![20231104193825](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104193825.png)  
这里是有两个 commit ，一起推过去  
![20231104193917](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104193917.png)    
成功后右下角会弹出  
![20231104193954](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104193954.png)

而这个操作可以在提交的时候一起执行，算是一个简化方式  
![20231104194226](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104194226.png)

### 从远程拉取

这个位置意味着从远程 `pull` 代码进来  

![20231104194538](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104194538.png)

## 分支操作

### 查看分支

还是这个小窗口下面就是本地和远程的分支  

![20231104194713](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104194713.png)

### 新建分支

git 小框点击这里  
![20231104194746](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104194746.png)  
会弹出这个窗口，可以命名分支并 `checkout` 过去  
![20231104194833](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104194833.png)  

### 切换分支

在小窗找到我们要切换的分支，点击它选择 checkout 即可  
![20231104194912](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104194912.png)

### 推送分支

在 git 小窗点击要推送的分支，选择 push    
![20231104195040](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104195040.png)  
进到这里后点击 Push 按钮  
![20231104195112](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104195112.png)

### 合并分支

我们在 b1 分支下的 com.snopzyz.controller 新建一个 Test2Controller.java 文件，并将其推送到远程  
然后切换回 master，在 git 小窗选择 b1，选择合并到 master 即可将其合并    
![20231104195523](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104195523.png)