---
title: git 远程仓库操作
---

- `git remote`：查看远程仓库
- `git remote add`：添加远程仓库
- `git clone`：从远程仓库克隆
- `git pull <远程仓库别名> <分支名>`：从远程仓库拉取
- `git push <远程仓库别名> <分支名>`：推送到远程仓库

用过程演示一下

### 远程仓库的添加

我的 gitlearn 仓库是从 gitee 上 `clone` 下来的，用 `remote` 相关的查看一下信息。  

```sh
(base) snopzyz@YiZedeMac-mini gitlearn % git remote
origin
(base) snopzyz@YiZedeMac-mini gitlearn % git remote -v
origin  https://gitee.com/chivasregal/gitlearn.git (fetch)
origin  https://gitee.com/chivasregal/gitlearn.git (push)
```

看到关联了 gitee 上的远程仓库。  

之前用 `init` 创建了一个 localgit ，要把它关联到远程仓库上。  
先在 gitee 创建一个 localgit 仓库，获取到它的 .git 地址，调用 `git remote add origin <.git地址>` 进行关联。  

```sh
(base) snopzyz@YiZedeMac-mini localgit % git remote add origin https://gitee.com/chivasregal/localgit.git
(base) snopzyz@YiZedeMac-mini localgit % git remote -v
# 成功关联上了
origin  https://gitee.com/chivasregal/localgit.git (fetch)
origin  https://gitee.com/chivasregal/localgit.git (push)
```

### git clone

这个操作的方式和指北在上面的[仓库创建](#仓库创建)就可以看到。  

### git push

回到之前的 gitlearn 仓库下，已经将两个文件全部放到了暂存区内，直接调用 `git push origin master` 完成推送  

```sh
(base) snopzyz@YiZedeMac-mini gitlearn % git push origin master
Enumerating objects: 7, done.
Counting objects: 100% (7/7), done.
Delta compression using up to 8 threads
Compressing objects: 100% (3/3), done.
Writing objects: 100% (7/7), 484 bytes | 484.00 KiB/s, done.
Total 7 (delta 0), reused 0 (delta 0), pack-reused 0
remote: Powered by GITEE.COM [GNK-6.4]
To https://gitee.com/chivasregal/gitlearn.git
 * [new branch]      master -> master
```

去看一下 gitee 内该仓库的内容   

![20231104150128](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104150128.png)  

发现已经推送上了

### git pull

一般是出在多人协作的时候，这里就直接在官网平台上修改模拟另一个人的操作与提交。  
![20231104151210](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104151210.png)  
将 README.md 修改成了这样，然后在本地进行 `pull`  

```sh
(base) snopzyz@YiZedeMac-mini gitlearn % git pull origin master
remote: Enumerating objects: 5, done.
remote: Counting objects: 100% (5/5), done.
remote: Compressing objects: 100% (2/2), done.
remote: Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
Unpacking objects: 100% (3/3), 993 bytes | 331.00 KiB/s, done.
From https://gitee.com/chivasregal/gitlearn
 * branch            master     -> FETCH_HEAD
   5c79930..372ef06  master     -> origin/master
Updating 5c79930..372ef06
Fast-forward
 README.md | 1 +
 # 修改成功
 1 file changed, 1 insertion(+)

# 测试一下，发现里面有新增的内容了，成功
(base) snopzyz@YiZedeMac-mini gitlearn % cat README.md
hello git
edit it in gitee.com%                   
```

::: tip
若本地仓库是通过 `init` 创建的，本地仓库也控制的有自己的版本。  
然后 `remote add` 关联了一个远程仓库，进行 `pull` 的时候会报错（fatal: refusing to merge unrelated histories）  
要解决这个要在 `git pull` 命令后面添加 `--allow-unrelated-histories` 来完成  
使得无关的历史也允许存在。  

同时这个无关历史也已经关联上了，我们可以通过 `git push ...` 来将本地仓库历史版本合并后的内容一起推给远程仓库。
:::