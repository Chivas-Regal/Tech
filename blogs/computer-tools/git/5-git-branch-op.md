---
title: git 分支操作
---

分支是将操作源代码从主线分离出来，与主线同级但不影响主线，可以有多个分支。  
在 `git init` 以及从远程仓库 `clone` 的时候会创建一个 master 分支。

- `git branch`：查看本地分支
  - `-r`：查看远程分支
  - `-a`：查看所有分支
- `git branch <name>`：创建分支
- `git checkout <name>`：切换分支
- `git push <shortName> <name>`：推送至远程仓库的分支
- `git merge <name>`：合并分支

下面实际操作一下   
首先新建一个远程仓库 repo1，然后初始化一下 README.md 产生 master 分支，将其 clone 进本地，这样本地就有了一个 master 分支。  

### git branch/checkout

我们在本地仓库创建两个分支 b1,b2

```sh
(base) snopzyz@YiZedeMac-mini repo1 % git branch
* master
(base) snopzyz@YiZedeMac-mini repo1 % git branch b1
(base) snopzyz@YiZedeMac-mini repo1 % git branch b2
(base) snopzyz@YiZedeMac-mini repo1 % git branch
  b1
  b2
* master
```

切换到 b1 分支后将 b2 分支 `push` 到远程仓库  

```sh
(base) snopzyz@YiZedeMac-mini repo1 % git checkout b1
Switched to branch 'b1'
(base) snopzyz@YiZedeMac-mini repo1 % git branch
* b1
  b2
  master
(base) snopzyz@YiZedeMac-mini repo1 % git push origin b2
Total 0 (delta 0), reused 0 (delta 0), pack-reused 0
remote: Powered by GITEE.COM [GNK-6.4]
remote: Create a pull request for 'b2' on Gitee by visiting:
remote:     https://gitee.com/chivasregal/repo1/pull/new/chivasregal:b2...chivasregal:master
To https://gitee.com/chivasregal/repo1.git
 * [new branch]      b2 -> b2
```

看一下远程仓库的分支状态  
![20231104162135](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104162135.png)  
产生了 b2 分支，同理推送一下 b1 分支   

然后我们在 master 下创建 master.txt 文件并将其推送到远程仓库  

```sh
(base) snopzyz@YiZedeMac-mini repo1 % git checkout master
Switched to branch 'master'
Your branch is up to date with 'origin/master'.

(base) snopzyz@YiZedeMac-mini repo1 % echo "master branch" >> master.txt

(base) snopzyz@YiZedeMac-mini repo1 % git add master.txt

(base) snopzyz@YiZedeMac-mini repo1 % git commit -m "add master.txt" master.txt
[master 806a030] add master.txt
 1 file changed, 1 insertion(+)
 create mode 100644 master.txt

(base) snopzyz@YiZedeMac-mini repo1 % git push origin master
Enumerating objects: 4, done.
Counting objects: 100% (4/4), done.
Delta compression using up to 8 threads
Compressing objects: 100% (2/2), done.
Writing objects: 100% (3/3), 318 bytes | 318.00 KiB/s, done.
Total 3 (delta 0), reused 0 (delta 0), pack-reused 0
remote: Powered by GITEE.COM [GNK-6.4]
To https://gitee.com/chivasregal/repo1.git
   26a280f..806a030  master -> master
```

然后在 gitee 上看就可以发现除了 master 分支之外别的分支都没有 master.txt 这个文件  
且本地仓库切换到 b1 分支是不存在 master.txt 的  

```sh
(base) snopzyz@YiZedeMac-mini repo1 % ls -al
total 24
drwxr-xr-x   6 snopzyz  staff   192 Nov  4 16:22 .
drwxr-xr-x   5 snopzyz  staff   160 Nov  4 16:10 ..
drwxr-xr-x  13 snopzyz  staff   416 Nov  4 16:23 .git
-rw-r--r--   1 snopzyz  staff   949 Nov  4 16:16 README.en.md
-rw-r--r--   1 snopzyz  staff  1310 Nov  4 16:16 README.md
-rw-r--r--   1 snopzyz  staff    14 Nov  4 16:22 master.txt

(base) snopzyz@YiZedeMac-mini repo1 % git checkout b1
Switched to branch 'b1'

(base) snopzyz@YiZedeMac-mini repo1 % ls -al
total 16
drwxr-xr-x   5 snopzyz  staff   160 Nov  4 16:26 .
drwxr-xr-x   5 snopzyz  staff   160 Nov  4 16:10 ..
drwxr-xr-x  13 snopzyz  staff   416 Nov  4 16:26 .git
-rw-r--r--   1 snopzyz  staff   949 Nov  4 16:16 README.en.md
-rw-r--r--   1 snopzyz  staff  1310 Nov  4 16:16 README.md
# master.txt 消失了
```

### git merge [name]

我们先在 b1 分支下创建 b1.txt 文件，在 b2 分支下创建 b2.txt，并且把它们都推送到远程仓库中（操作方式和上面一样，这里略过）。  

然后令 master 合并 b1 和 b2  

```sh
# 切换回 master
(base) snopzyz@YiZedeMac-mini repo1 % git checkout master
Switched to branch 'master'
Your branch is up to date with 'origin/master'.

# master 合并 b1
(base) snopzyz@YiZedeMac-mini repo1 % git merge b1
Merge made by the 'ort' strategy.
 b1.txt | 0
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 b1.txt

# master 合并 b2
(base) snopzyz@YiZedeMac-mini repo1 % git merge b2
Merge made by the 'ort' strategy.
 b2.txt | 1 +
 1 file changed, 1 insertion(+)
 create mode 100644 b2.txt
```

然后 master 里面就多了 b1.txt 和 b2.txt  

::: tip
若此时 master 修改 b1.txt，b1 也修改 b1.txt ，修改得不一样了将它们推送到远程仓库上。  
然后再在本地进行合并。   
![20231104173613](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104173613.png)  
发现报错了，问题是 b1.txt 产生冲突。  
我们可以手动处理 b1.txt 文件然后进行保存  
![20231104173744](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104173744.png)  
然后就可以通过 `git add b1.txt` 将文件加入暂存区中，再通过 commit 进行提交    
![20231104173948](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104173948.png)  
提交后报错 `merge` 不能只提交一部分，只需要在 `commit` 操作后面加一个 `-i` 即可  
![20231104174108](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104174108.png)


:::