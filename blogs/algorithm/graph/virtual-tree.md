---
key: 2021-10-17-虚树
layout: article
title: 虚树
subtitle: 只有几个点，跑整个图是不是太奢侈了？🤔
categories: 图论
tags: [图论]
aside:
  toc: true
sidebar:
  nav: docs-en
---

# 前言
**有时我们会遇到很多点转移但同时又需要通过树遍历才能获取答案的问题。**比如说每次操作给你几个关键点，让你通过这些关键点维护的信息来回溯出整棵树的总信息，但是每组数据会有很多次操作，此时我们如果还是每次操作遍历一遍整棵树，时间复杂度过高  
由于给定的关键点<span style="color: red;">数量有限</span>，且<span style="color: red;">只有关键点会产生我们需要的信息</span>，那么我们duck不必跑很多没有用的点  
比如说给你一棵二叉树，询问的操作给的关键点全在最左边的一条树枝上，那么我们要是跑右边的树就会<span style="color: red;">浪费很多时间</span>  
所以我们可以根据给定的<mark>关键点的位置和数量</mark>进行优化，即只考虑这些有必要去遍历来维护信息的点，对此有一个概念————<b>虚树</b>  

# 虚树

## 概念  

对一整棵树中我们需要去遍历的点建立出来一棵**小树**，在这棵小树上，我们<span style="color: red;">每一次的转移操作都是有它一定的作用</span>，而不是白白浪费时间，从而大大优化时间复杂度    

**需要遍历的点：** $1.$ 关键点， $2.$ 关键点或者 $LCA$ 之间的 $LCA$ 

## 思想要点

我们要获取到所有关键点两两点之间的 $LCA$ 以及它们 $LCA$ 的 $LCA$ ...，这个可以通过<span style="color: red;">预处理</span>实现，倍增、树连剖分..均可  
我们如果每两个都要枚举一遍 $LCA$ ，就算每次求 $LCA$ 是 $O(logn)$ 也很花费时间  

可以发现对于一条<mark>链</mark>，我们知道深度关系，同时一条链上一个点又是别的点的祖先（除了叶子节点  
所以一条链可以很显然地通过深度来确定两两之间的关系    
那么就可以使用一个栈，来维护整棵虚树的<mark>最右链</mark>来进行处理  

## 建树流程

既然我们要维护右链，那么就需要一种绝对的<mark>从左到右的线性顺序</mark> $\rightarrow$  $DFS$ 序  
我们对所有关键点进行一次 $DFS$ 序升序排序  
然后<span style="color: red;">按 $DFS$ 序从小到大</span>的顺序枚举关键点  
由于关键点会按顺序入栈，所以栈从底到顶是一个<span style="color: red;">从上到下</span>的链  

每次遍历到一个节点 $now$ 会产生**四种情况**：  
1. $LCA(now, stk[top]) = stk[top]$  
<img src="https://i.loli.net/2021/10/17/4rFXQf1ujNxRzP8.png">  
此时 $stk[top]$ 是 $now$ 的祖先的话，代表 $now$ 在 $stk[top]$ 的子树中，与栈中元素<span style="color: red;">同在一条链</span>上  
那么就相当于扩了一个链，并不需要大量变动这条链  
$now$ 入栈  
2. $LCA(now, stk[top])$ 在 $stk[top]$ 与 $stk[top - 1]$ 中间  
<img src="https://i.loli.net/2021/10/17/rg9xmKP1l7j4esQ.png">  
此时我们的 $stk[top]$ 并<span style="color: red;">不在最右链</span>上了，就需要弹栈并将 $lca$ 和 $now$ 依次加入  
  但是弹之前我们的这个栈的目的是为了建树，所以将 $lca$ 和 $stk[top]$ 连边  
3. $LCA(now, stk[top]) = stk[top - 1]$  
  <img src="https://i.loli.net/2021/10/17/sZxwE8W2lJABnLi.png">  
  同样的， $stk[top]$ 并不能再作为右链结尾  
  所以弹出，同时让它和 $stk[top-1]$ 建边  
  然后将 $now$ 入栈  
4. $dep[LCA(now, stk[top])]\lt dep[stk[top-1]]$  
 <img src="https://i.loli.net/2021/10/17/qRp4fObEzBGgZij.png">  
  这种情况栈上面有<span style="color: red;">多个元素都不可以作为右链</span>  
  所以要一个个弹出，<span style="color: red;">直到弹到上面三种情况为止</span>  
  同时每弹出一次，都要让栈顶和栈倒数第二个建立虚树边  

<mark>最后将整个右链加入虚树即可结束</mark>  
这就是建树的规则流程了，下面给一个例子模拟  

## 完整模拟

 <img src="https://i.loli.net/2021/10/17/8n7W1agUx5wMuPy.png">  
 给定如上树，红色节点为所有的关键点，建立一个以关键点为核心的虚树（编号已按dfs序给出）  
 (下面橙色是栈，黑色是虚树）  
   
 1.首先将节点 $1$ 入栈，这样的话以1为哨兵可以防止空栈访问运行错误，更好处理  
 <img src="https://i.loli.net/2021/10/17/OvbgfcnU6ZWtJ7z.png">  
 2.然后是 $3$ ，发现 $LCA(1,3)=1$ 是栈顶元素，所以 $3$ 入栈   
 <img src="https://i.loli.net/2021/10/17/AKHmwIT9SuR4blQ.png">  
 3.然后是 $4$ ，$LCA(4,3)=3$ 是栈顶元素，所以 $4$ 入栈  
 <img src="https://i.loli.net/2021/10/17/9pOasJbr8ue6E42.png">  
 3.然后是 $5$ ，发现 $LCA(4,5)=2$ ，所以 $4$ 、 $3$ 弹出，并且 $4$ 与 $3$ 、 $3$ 与 $1$ 连接虚树边，同时 $2$ , $5$ 入栈      
 <img src="https://i.loli.net/2021/10/17/VCUPhOqsEFceJ6X.png">  
 4.接着是 $6$ ， $LCA(6,5)=1$ ，所以 $2$ , $5$ 弹出，并且 $5$ 与 $2$  、 $2$ 与 $1$ 连边，同时 $6$ 入栈  
 <img src="https://i.loli.net/2021/10/17/QLalDv3FudOVSKm.png">  
 5.接着是 $8$ ， $LCA(6, 8)=6$ ，所以 $8$ 入栈  
 <img src="https://i.loli.net/2021/10/17/cDNs4agf86b9Biw.png">  
 6.然后是 $9$ ， $LCA(8, 9)=7$ ， $8$ 弹出且与 $7$ 连边， $7$ 和 $9$ 依次入栈  
 <img src="https://i.loli.net/2021/10/17/xyC2NeLQ1DTO6VZ.png">  
 7.最后整条右链也就是栈中元素依次连边  
 <img src="https://i.loli.net/2021/10/17/L6VbKqnlI7NXdD9.png">  
 这样一棵虚树就建好了（是不是感觉没有少点，我想把所有情况都用上所以关键点有点多，但实际上在能用虚树解的题目中关键点不会非常多，不然它还不如告诉你所有点都关键了...（逃  
   
## 算法框架  

|--预处理树上倍增结构或者树链  
|--遍历点  
|----考虑四种情况  
|----弹栈连边  
|----该入栈道入栈  
|--连接右链  

## 程序演示  

```cpp
namespace VirtualTree {
        int dfscnt = 1, dfn[N]; // dfs序
        int dep[N];             // 深度
        int fa[N][25];          // 父亲st表
        int mxFa[N];            // 优化 -> i最多有mxFa[i]层祖先
        ll  minv[N];             // 1到i的最小边权是minv[i]
        
        // 预处理fa[][]，dfn[]，minv[]
        inline void dfs ( int pos ) {
                int k;
                for ( k = 0; fa[pos][k]; k ++ ) fa[pos][k + 1] = fa[fa[pos][k]][k];
                mxFa[pos] = k;
                dfn[pos] = dfscnt ++;
                for ( int i = head[pos]; i; i = edge[i].nxt ) {
                        int to = edge[i].to;
                        if ( !dfn[to] ) 
                                dep[to] = dep[pos] + 1,
                                minv[to] = min ( minv[pos], edge[i].val ),
                                fa[to][0] = pos,
                                dfs ( to );
                }
        }
        // st求LCA
        inline int LCA ( int x, int y ) {
                if ( dep[x] < dep[y] ) swap ( x, y );
                for ( int i = mxFa[x]; i >= 0; i -- ) if ( dep[fa[x][i]] >= dep[y] ) x = fa[x][i];
                if ( x == y ) return x;
                for ( int i = mxFa[x]; i >= 0; i -- ) if ( fa[x][i] != fa[y][i] ) x = fa[x][i],
                                                                                  y = fa[y][i];
                return fa[x][0];
        }
        int stk[N], top; // 单调栈
        int lst[N];      // 查询的一套关键点
        inline void build () {
                sort ( lst + 1, lst + num + 1, [&]( int x, int y ) { return dfn[x] < dfn[y]; } ); // 按dfs序排序
                stk[top = 1] = lst[1]; // 此时stk[0] = 0，dep[0] = 0，深度最小的哨兵
                for ( int i = 2; i <= num; i ++ ) {
                        int now = lst[i];
                        int lca = LCA ( now, stk[top] );
                        while ( 1 ) {
                                if ( dep[lca] >= dep[stk[top - 1]] ) { // lca已在下面，应作为右链元素了
                                        if ( lca != stk[top] ) {       // top要删掉了
                                                add_vEdge ( lca, stk[top] );
                                                if ( lca != stk[top - 1] ) stk[top] = lca; // lca加入
                                                else                       top --;         // lca已有
                                        }
                                        break;
                                } else { // 一直弹直到lca在下面
                                        add_vEdge ( stk[top - 1], stk[top] );
                                        top --;
                                }
                        }
                        stk[ ++ top ] = now;
                }
                while ( --top ) add_vEdge ( stk[top], stk[top + 1] );
        }
}
```

# 例题  
**1.洛谷P2495 消耗战**  
<a href="https://www.luogu.com.cn/problem/P2495">题目地址</a>   
<a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E5%9B%BE%E8%AE%BA/%E6%A0%91%E4%B8%8A%E9%97%AE%E9%A2%98/%E8%99%9A%E6%A0%91/%E6%B4%9B%E8%B0%B7P2495_%E6%B6%88%E8%80%97%E6%88%98.md">题解地址</a>   
    
**2.洛谷P3320 寻宝游戏**  
<a href="https://www.luogu.com.cn/problem/P3320">题目地址</a>  
<a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E5%9B%BE%E8%AE%BA/%E6%A0%91%E4%B8%8A%E9%97%AE%E9%A2%98/%E8%99%9A%E6%A0%91/%E6%B4%9B%E8%B0%B7P3320_%E5%AF%BB%E5%AE%9D%E6%B8%B8%E6%88%8F.md">题解地址</a>
 
 
 
 
