---
title: git 标签操作
---

标签是记录某个分支在某个特定时间点的状态，通过对分支的时间点打标签可以帮助我们快速切换到有意义的状态。  
相当于对我们本地当前分支当前状态的一个快照，是一个静态的概念，多用于项目成型后做标签发布。

- `git tag`：列出已有标签
- `git tag [name]`：创建标签
- `git push [shortName] [name]`：将标签推送至远程仓库
- `git checkout -b [branch] [name]`：检测标签  

### 标签新建与提交

我们在 master 执行  

```sh
git tag v0.1
git push origin v0.1
```

来提交标签，并新建文件 temp.txt 并提交到本地仓库后提交出 v0.2 标签  
然后我们来检测一下两个标签的代码状态  

<table>
  <tr>
    <th>v0.1</th><th>v0.2</th>
  </tr>
  <tr>
    <td><img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104175401.png"/></td><td><img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104175422.png"/></td>
  </tr>
</table>  

可以判断出两者确实是不一样的  
同时也可以发现，我们提交了一个标签，但是并没有将修改的文件提交到分支中，所以<mark>标签的提交和分支并无关系，只是提交了本地当前分支当前时间点的文件信息</mark>。

### 标签的检出

`git checkout -b [branch] [name]` 意味着我们创建一个新分支（名为 [branch]），它检出的时名为 [name] 的标签。  

我们检出 v0.1 标签进入新的 b0.1 分支下  
![20231104180000](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104180000.png)  
再检出 v0.2 标签进入新的 b0.2 分支下  
![20231104180030](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231104180030.png)  
文件也是不一样  