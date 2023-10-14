---
key: 2021-07-17-欧拉反演
layout: article
title: 欧拉反演
aside:
  toc: true
sidebar:
  nav: docs-en
---

# 核心公式

$$n=\sum\limits_{d|n}\phi(d)$$  
  
其在狄利克雷卷积中表示为 $\phi*1=Id$    
[证明在这里](http://www.chivas-regal.top/%E6%95%B0%E5%AD%A6/2021/11/16/%E7%8B%84%E5%88%A9%E5%85%8B%E9%9B%B7%E5%8D%B7%E7%A7%AF.html#phi--1id)  

# 反演思想

主要是替换上面这个公式中的 $n$   
将一个数学柿子进行转化,从而降低复杂度  
 
# 利用

**化简 $\sum\limits_{i=1}^n\sum\limits_{j=1}^m(i,j)$**  
$$\begin{aligned}
&\sum\limits_{i=1}^n\sum\limits_{j=1}^m(i,j)\\
=&\sum\limits_{i=1}^n\sum\limits_{j=1}^m\sum\limits_{d|(i,j)}\phi(d)\\
=&\sum\limits_{d=1}^{min(n,m)}\phi(d)\sum\limits_{i=1}^n\sum\limits_{j=1}^m[d|i\wedge d|j]\\
=&\sum\limits_{d=1}^{min(n,m)}\phi(d)\left\lfloor\frac nd\right\rfloor\left\lfloor\frac md\right\rfloor
\end{aligned}$$  

# 例题

**洛谷P1447_能量采集**  
[题目地址](https://www.luogu.com.cn/problem/P1447)  
[题解地址](https://github.com/Chivas-Regal/ACM/blob/main/Code/%E6%95%B0%E5%AD%A6/%E6%AC%A7%E6%8B%89%E5%8F%8D%E6%BC%94/%E6%B4%9B%E8%B0%B7P1447_%E8%83%BD%E9%87%8F%E9%87%87%E9%9B%86.md)
