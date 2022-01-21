---
key: 2021-10-13-Matrix-tree定理
layout: article
title: Matrix-tree定理
subtitle: 图上的总生成树问题还能用矩阵玩出花？🤔
categories: 图论
tags: [图论]
aside:
  toc: true
sidebar:
  nav: docs-en
---

>对于一个无向图，我们想知道它的生成树数量

# 前置知识——高斯消元解行列式  

[传送门](http://www.chivas-regal.top/%E6%95%B0%E5%AD%A6/2021/08/23/%E9%AB%98%E6%96%AF%E6%B6%88%E5%85%83.html)

# 矩阵树定理

<mark>这里只指无向图</mark>

## 生成树个数
对于一个图，我们可以按这样的规则<mark>建立一个行列式$A$</mark>    
$A_{ij}\quad i\ne j$ 表示$i$点和$j$点的连边数量的<span style="color: red;">相反数</span>  
$A_{ii}$ 表示$i$点的度数  

例：
<img src="https://img-blog.csdnimg.cn/17b66c7892004e2ea4b360c695258b7f.png">  
对于这样一个图，我们可以建出如下矩阵  
$$\left\{\begin{matrix}
    &2 &-1 &-1 &-1 &-1\\
    &-1 &2 &-1 &-1 &-1\\
    &-1 &-1 &2 &-1 &-1\\
    &-1 &-1 &-1 &2 &-1\\
    &-1 &-1 &-1 &-1 &2
\end{matrix}\right\}$$

那么这样的一个<mark>行列式的值就是生成树的个数</mark>  

## 生成树权值积的和

可以将$A_{ij}$换成<mark>连边的权值和</mark>

## 生成树权值和的和

我们求不了和，但是可以利用权值积利用有效的部分变成权值和  
首先看一个<mark>多项式</mark>乘积形式：  
$$(ax+b)(cx+d)=acx^2+(ad+bc)x+bd$$  
在$b=d=1$时，多项式的一次项系数就是$a+c$  
这里就转化成和的形式了  
所以每次将$A_{ij}$换成$(连边的权值和\times x+1)$即可  
  
在高斯消元中，我们还涉及到其他运算  
所以<mark>要定义一下它们的其他操作</mark>  
由于每次只看最后两项，所以在四种运算时多项式不用变得太长  
$$\begin{aligned}
&(ax+b)+(cx+d)=(a+c)x+(b+d)\\
&(ax+b)-(cx-d)=(a-c)x+(b-d)\\
&(ax+b)\times (cx-d) = ...+(ad + bc)x + bd\\
&(ax+b)\div (cx-d)=\frac {ad-bc}{d^2}x+\frac bd
\end{aligned}$$  

# 例题 
**1.洛谷P2144 轮状病毒**  
<a href="https://www.luogu.com.cn/problem/P2144">题目地址</a>  
<a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E5%9B%BE%E8%AE%BA/%E7%9F%A9%E9%98%B5%E6%A0%91/%E6%B4%9B%E8%B0%B7P2144_%E8%BD%AE%E7%8A%B6%E7%97%85%E6%AF%92.md">题解地址</a>  
  
**2.洛谷P4111 小Z的房间**  
<a href="https://www.luogu.com.cn/problem/P4111">题目地址</a>  
<a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E5%9B%BE%E8%AE%BA/%E7%9F%A9%E9%98%B5%E6%A0%91/%E6%B4%9B%E8%B0%B7P4111_%E5%B0%8FZ%E7%9A%84%E6%88%BF%E9%97%B4.md">题解地址</a>  
  
**3.洛谷P4336 黑暗前的幻想乡**  
<a href="https://www.luogu.com.cn/problem/P4336">题目地址</a>  
<a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E5%9B%BE%E8%AE%BA/%E7%9F%A9%E9%98%B5%E6%A0%91/%E6%B4%9B%E8%B0%B7P4336_%E9%BB%91%E6%9A%97%E5%89%8D%E7%9A%84%E5%B9%BB%E6%83%B3%E4%B9%A1.md">题解地址</a>  

