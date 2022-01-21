---
key: 2021-07-16-2_SAT问题
layout: article
title: 2-SAT问题
subtitle: 给了一张关系网，其中的某两个人有怎么样的关系呢？🤔
categories: 图论
tags: [建图、Kosaraju]
aside:
  toc: true
sidebar:
  nav: docs-en
---

>导引：
>$A$, $B$, $C$ 三人中有两个女生  
>如果 $A$ 是男生，那么 $B$ 一定是女生：  
>$A$ 和 $C$ 性别相同  
>求 $A$ $B$ $C$ 三人的性别  

# 2 - SAT问题

## 定义  

要确定N个bool类型的值，使得其满足所有的限制关系（每个限制关系最多只对两个bool变量进行限制）  

2-SAT问题是有多项式解法的，而3-SAT问题就是npc问题  

## 判断是否有解

建立2N个点的有向图，不妨设  
$i$ 点表示 $x[i] = \times$  
$i'$ 点表示 $x[i] = \checkmark$  
一条 $u \rightarrow v$ 的有向边表示如果选择了 $u$ ，那么一定要选择 $v$  
不能出现 $i \leftrightarrow i'$  
判断i和i'是否位于同一强连通分量即可  

## 输出可行方案

如果从 $i$ 点出发可以到达 $i'$ 点，则旋律i会导致选 $i'$ ，矛盾，因此只能选 $i'$  
Kosaraju算法在求强连通分量时顺带求出了一个遍历顺序 $q[1], q[2], ..., q[cnt]$  
只需要比较i和i'所属强连通分量在q中位置的前后关系即可构造出可行方案  

## 一元限制的构图方案

限制： $x[i] = \checkmark$    
连边： $i \rightarrow i'$  
表示如果 $i$ 选了 $\times$ 那么 $i$ 必须要是 $\checkmark$ 

## 二元限制的构图方案

一条边 $u \rightarrow v$ 的含义：若 $u$ 则 $v$  
命题”若 $u$ 则 $v$ “的逆否命题为”若非 $v$ 则非 $u$ “  
命题于逆否命题等价  
所以在建 $u \rightarrow v$ , 也要建 $v \rightarrow u'$  
所以对于每条二元限制，将其对应的命题与逆否命题的边连上，缺一不可  

>建图例：  
>限制： $u | v = \checkmark$  
>（有一个满足 $\checkmark$ 就行） $u\rightarrow v', v\rightarrow u'$  
  
>建图例：  
>限制： $u | v = \times$   
>（两者都要 $\times$ 回到一元限制关系） $u'\rightarrow u, v\rightarrow v'$  
  
>建图例：  
>限制： $u \And v = \times$  
>（两个没有同时满足） $u'\rightarrow v, v'\rightarrow u$  
  
>建图例：  
>限制： $u \And v = \checkmark$  
>（两个都要满足） $u'\rightarrow u, v'\rightarrow v$  
  
>建图例：  
>限制： $u \neq v$  
>（两个情况不同） $u'\rightarrow v, u\rightarrow v', v'\rightarrow u, v\rightarrow u'$   
  
>建图例：  
>限制： $u = v$   
>（两个情况相同） $u'\rightarrow v', u\rightarrow v, v'\rightarrow u', v\rightarrow u$  
  
## 例题

>有 $n$ 对夫妻被邀请参加一个聚会，因为场地的问题，每对夫妻中只有 $1$ 人可以列席  
>在 $2n$ 个人中，某些人之间有着很大矛盾（夫妻之间没有），主办方希望有矛盾的两个人不能同时出现在聚会上  
>问有没有可能回有 $n$ 个人同时列席？  
>思路：  
>建立 $2n$ 个点的图，i点表示第i对夫妻是丈夫到场， $i'$ 点表示妻子到场  
>如果 $A$ 和 $B$ 矛盾，则可以表示”若 $A$ 则非 $B$ “、”若 $B$ 则非 $A$ “。  
  
# 强连通分量求出后的处理

```cpp
bool res = 1;
for(int i = 0; i < N; i ++){
    if(nod[i] == nod[trans(i)]){
        res = 0;
        break;
    }
}
if(res) cout << "YES" << endl;
else    cout << "NO"  << endl;

//i'可以使用便宜量，表示为i + n(与带权并查集类似)
```
  
## 例题

> $T$ 个 $3$ 人队伍，每个队伍有一个队长  
>每个队伍要么队长回家，剩下两个留校，要么队长留校，剩下两人回家  
>给定 $M$ 条限制，每条限制指定两个人 $A$ 和 $B$ ，要求 $A$ 和 $B$ 不能同时留校  
>判断是否有合法方案  
>思路：  
>建立 $6T$ 个点的有向图， $i$ 点表示第 $i$ 个人留校， $i'$ 点表示第 $i$ 个人回家  
>对于每个队伍 $x$ , $y$ , $z$ ，其中 $x$ 为队长  
> $x$ 和 $y$ 的选择不同，按照 $x\neq y$ 连边  
> $x$ 和 $z$ 的选择不同，按照 $x\neq z$ 连边  
> $y$ 和 $z$ 的选择不同，按照 $y=z$ 连边  
>对于每条限制 $A$ ，$B$ ，两人不能同时留校  
>若 $A$ 留校，则 $B$ 回家： $A\rightarrow B'$  
>若 $B$ 留校，则 $A$ 回家： $B\rightarrow A'$  
