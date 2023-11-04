---
title: git 本地仓库操作
---

- `git status`：查看文件状态
- `git add <file名匹配>`：将文件的修改加入暂存区
- `git reset <commit编号>`：切换到指定版本
- `git reset <file名匹配>`：将暂存区的指定文件取消暂存或者
- `git commit <file名匹配>`：将暂存区的文件修改提交到版本库
- `git log`：查看日志

用过程演示一下：  

### git status
  
1.展示一下现在的文件信息  

```sh
(base) snopzyz@YiZedeMac-mini gitlearn % git status
On branch master

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   README.md

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        test.txt
```

### git add

2.将 test.txt 添加到暂存区后再看一下状态

```sh
(base) snopzyz@YiZedeMac-mini gitlearn % git add test.txt
(base) snopzyz@YiZedeMac-mini gitlearn % git status
On branch master

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   README.md
        new file:   test.txt
```

### git reset <文件名匹配>

3.将 README.md 从暂存区中清除后再看看状态

```sh
(base) snopzyz@YiZedeMac-mini gitlearn % git reset README.md
(base) snopzyz@YiZedeMac-mini gitlearn % git status
On branch master

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)
        new file:   test.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        # 被剔除出暂存区了
        README.md
```

### git commit

4.提交 test.txt 到版本库中（修改记录标注为 "init test.txt"），并显示一下文件状态

```sh
(base) snopzyz@YiZedeMac-mini gitlearn % git commit -m "init test.txt" test.txt
[master (root-commit) 85cc04c] init test.txt
 1 file changed, 0 insertions(+), 0 deletions(-)
 create mode 100644 test.txt
(base) snopzyz@YiZedeMac-mini gitlearn % git status
On branch master
Your branch is based on 'origin/master', but the upstream is gone.
  (use "git branch --unset-upstream" to fixup)

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md

nothing added to commit but untracked files present (use "git add" to track)

# 此时 test.txt 文件变成了未修改状态，不会出现在记录中
```

5.将已提交的 test.txt 做一下修改再看一下状态  

```sh
(base) snopzyz@YiZedeMac-mini gitlearn % echo "new data in test.txt" >> test.txt
(base) snopzyz@YiZedeMac-mini gitlearn % git status
On branch master
Your branch is based on 'origin/master', but the upstream is gone.
  (use "git branch --unset-upstream" to fixup)

Changes not staged for commit:
  (use "git add <file>..." to update what will be committed)
  (use "git restore <file>..." to discard changes in working directory)
        # 变成了已修改状态
        modified:   test.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md

no changes added to commit (use "git add" and/or "git commit -a")
```

6.将修改后的 test.txt 重新 `add` 到暂存区再看看状态

```sh
(base) snopzyz@YiZedeMac-mini gitlearn % git add test.txt
(base) snopzyz@YiZedeMac-mini gitlearn % git status
On branch master
Your branch is based on 'origin/master', but the upstream is gone.
  (use "git branch --unset-upstream" to fixup)

Changes to be committed:
  (use "git restore --staged <file>..." to unstage)
        # 变成了已暂存状态
        modified:   test.txt

Untracked files:
  (use "git add <file>..." to include in what will be committed)
        README.md

```

7.将它们全部 `add` 后全部 `commit` 到版本控制

```sh
(base) snopzyz@YiZedeMac-mini gitlearn % git add README.md
(base) snopzyz@YiZedeMac-mini gitlearn % git commit -m "commit all" *
[master 5c79930] commit all
 2 files changed, 2 insertions(+)
 create mode 100644 README.md
(base) snopzyz@YiZedeMac-mini gitlearn % git status
On branch master
Your branch is based on 'origin/master', but the upstream is gone.
  (use "git branch --unset-upstream" to fixup)
# 这下就没有修改了未提交的了
nothing to commit, working tree clean
```

### git log

8.用 `log` 看一下我们的日志信息

```sh
(base) snopzyz@YiZedeMac-mini gitlearn % git log
commit 5c79930df7df4947ef8734d50c37b10332222253 (HEAD -> master)
Author: snopzyz <1411390466@qq.com>
Date:   Sat Nov 4 14:34:43 2023 +0800

    commit all

commit 85cc04c771893ab6fa18c095d5ef72534b32de07
Author: snopzyz <1411390466@qq.com>
Date:   Sat Nov 4 12:16:28 2023 +0800

    init test.txt
```

可以看到这就是我们两次提交的记录

### git reset <commit号>

9.用 `reset` 在版本之间穿越一下看看

```sh
# 进入到最开始一次提交的版本
(base) snopzyz@YiZedeMac-mini gitlearn % git reset --hard 85cc04c771893ab6fa18c095d5ef72534b32de07
HEAD is now at 85cc04c init test.txt
(base) snopzyz@YiZedeMac-mini gitlearn % ls
test.txt
# 进入到第二次提交的版本
(base) snopzyz@YiZedeMac-mini gitlearn % git reset --hard 5c79930df7df4947ef8734d50c37b10332222253
HEAD is now at 5c79930 commit all
(base) snopzyz@YiZedeMac-mini gitlearn % ls
README.md       test.txt
(base) snopzyz@YiZedeMac-mini gitlearn % 
```