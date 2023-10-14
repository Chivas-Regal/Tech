---
key: 2021-11-19-拉格朗日插值法
layout: article
title: 拉格朗日插值法
aside:
  toc: true
sidebar:
  nav: docs-en
---

## 历史
在数值分析中，拉格朗日插值法是以法国十八世纪数学家约瑟夫·拉格朗日命名的一种多项式插值方法。  
许多实际问题中都用函数来表示某种内在联系或规律，而不少函数都只能通过实验和观测来了解。  
如对实践中的某个物理量进行观测，在若干个不同的地方得到相应的观测值，拉格朗日插值法可以找到一个多项式，其恰好在各个观测的点取到观测到的值。  
这样的多项式称为拉格朗日（插值）多项式。

## 插值
在离散数据的基础上补插连续函数，使得这条连续曲线通过全部给定的离散数据点  
插值是离散函数逼近的重要方法，利用它可通过函数在有限个点处的取值状况，估算出函数在其他点处的近似值

## 意义
给定 $n$ 个点 $(x_i,y_i)$ ，通过这 $n$ 个点最多可以确定唯一的 $n-1$ 次多项式 $f(x)$  
形如：  
$$\left\{\begin{aligned}
y_1&=a_1+a_2x_1+a_3x_1^2+\cdots+a_nx_1^{n-1}\\
y_2&=a_1+a_2x_2+a_3x_2^2+\cdots+a_nx_2^{n-1}\\
\vdots&\ddots\vdots\\
y_n&=a_1+a_2x_n+x_3x_n^2+\cdots+a_nx_n^{n-1}
\end{aligned}\right.$$  
计算 $f(k)$ 的值  
   
第一想法可以是使用高斯消元算出系数 $\{a\}$ 后  
直接计算 $f(k)=a_1+a_2k+a_3k^2+\cdots+a_nk^{n-1}$  
但明显这样 $O(n^3)$ 的复杂度很多时候承受不了  
  
而拉格朗日插值法的作用是**快速根据点值逼近函数**   

## 拉格朗日插值法
考虑两个多项式相减  
$f(k)-f(x)=(a_0-a_0)+a_1(k^1-x^1)+a_2(k^2-x^2)+\cdots+a_n(k^n-x^n)$  
其中对每一项 $(k^i-x^i)$ 分解均能得到 $(k-x)$ 这个因数  
因此 $f(k)\equiv f(x)(mod\;(k-x))$  
那么对于求解 $f(k)$ ，我们可以设计出这样一个线性同余方程组  

$$\left\{\begin{aligned}
f(k)&\equiv y_1(mod\;(k-x_1))\\
f(k)&\equiv y_2(mod\;(k-x_2))\\
&\vdots\\
f(k)&\equiv y_n(mod\;(k-x_n))
\end{aligned}\right.$$  
求解线性同余方程组我们应该想到 $Crt$  
这里  
$M=\prod\limits_{i=1}^n(k-x_i)$  
$m_i=\frac M{k-x_i}=\prod\limits_{j\neq i}(k-x_j)$  
$f(x)=\sum\limits_{i=1}^ny_im_iX_i$  
其中 $X_i$ 是同余方程 $m_iX_i\equiv 1(mod\;m_i)$ 的一个解，也就是模 $(k-x_i)$ 意义下的逆元  
那么这个逆元怎么求呢  
$\prod\limits_{j\neq i}(k-x_j)\equiv \prod\limits_{j\neq i}(k-x_j-(k-x_i))\equiv \prod\limits_{j\neq i}(x_i-x_j)\quad(mod\; (k-x_i))$  
即 $m_i^{-1}=\prod\limits_{j\neq i}\frac1{x_i-x_j}$  
从而得到  

$$f(k)\equiv\sum\limits_{i=1}^ny_im_im_i^{-1}\equiv\sum\limits_{i=1}^ny_i\prod_{j\neq i}\frac{k-x_j}{x_i-x_j}\quad(mod\;M)$$  
由于模意义下 $f(k)$ 唯一，所以  

$$f(k)=\sum\limits_{i=1}^ny_i\prod_{j\neq i}\frac{k-x_j}{x_i-x_j}$$  
时间复杂度： $O(n^2)$  

## 重心拉格朗日插值法  

>对于动态点插值问题，即 $m$ 次操作，每次删去一个插值或者加入一个插值，我们计算 $f(k)$ 的话时间复杂度不就变成 $O(n^2m)$ 了？  
这个复杂度挺高的，那么如何做呢？  

我们观察一下这个式子  
$f(k)=\sum\limits_{i=1}^ny_i\prod\limits_{j\neq i}\frac{k-x_j}{x_i-x_j}=\sum\limits_{i=1}^ny_i\times \frac{\prod\limits_{j=1}^n(k-x_j)}{k-x_i}\times\frac1{\prod\limits_{j\neq i}(x_i-x_j)}$   
其中 $\prod\limits_{j=1}^n(k-x_j)$ 属于重复计算，令其表示为 $\ell(k)$  
而将 $\frac1{\prod\limits_{j\neq i}(x_i-x_j)}$ 定义为**重心权 $w_i$**  
那么原式就变成了 $f(k)=\ell(k)\sum\limits_{i=1}^n\frac{y_iw_i}{k-x_i}$  
  
**这样做的优势在于**  
我们每次加入点或者删去点，只需要改变 $n$ 个 $w_i$ 的值，每个修改 $O(1)$ 就可以解决，修改 $n$ 个只需要 $O(n)$  
还有 $O(1)$ 地修改 $\ell(k)$  
加上计算 $f(k)$ 整体也就是 $O(n)$ 的时间复杂度，整体缩减了一个量级  

# 连续自然数的拉格朗日插值法  
对于 $f(k)=\sum\limits_{i=1}^ny_i\prod\limits_{j\neq i}\frac{k-x_j}{x_i-x_j}$ ,我们将 $x_i$ 换成 $i$  
则 $f(k)=\sum\limits_{i=1}^n\prod\limits_{j\neq i}\frac{k-j}{i-j}$  
可以注意到整个 $\prod\limits_{j\neq i}\frac{k-j}{i-j}$ 都是可以预处理出来快速计算的  
令  
$$\left\{\begin{aligned}  
&pre_i=\prod\limits_{j=0}^i(k-j)\\
&suf_i=\prod\limits_{j=i}^n(k-j)\\
&fac_i=\prod\limits_{j=1}^ij
\end{aligned}\right.$$  
  
那么 $f(k)=\sum\limits_{i=1}^ny_i\frac{pre_{i-1}\times suf_{i+1}}{fac_{i-1}\times fac_{n-i}}$  
这样做可以将时间复杂度降到 $O(n)$   

## 应用——自然数的幂和  
  
<b>求解 $S_k(n)=\sum\limits_{i=1}^ni^k\quad(1\le n\le10^9,\;1\le k\le10^6)$</b>  
  
首先要知道这是一个 $k+1$ 次多项式，证明如下  
::: tip
这里采用二项式定理证明  
在 $k=d$ 时提出一项做差  
$$\begin{aligned}
&(i+1)^d-i^d\\
=&\sum\limits_{j=0}\binom dji^j-i^d\\
=&\sum\limits_{j=0}^{d-1}\binom dji^j
\end{aligned}$$  
对 $(i+1)^d-i^d$ 求和 $=\sum\limits_{i=1}^{n-1}\sum\limits_{j=0}^{d-1}\binom dji^j=\sum\limits_{j=0}^{d-1}\binom dj\sum\limits_{i=1}^{n-1}i^j=\sum\limits_{j=0}^{d-1}\binom djS_j(n-1)$  
同时等式左侧经过两两相消也可以得到 $n^d-1$  
所以 $n^d-1=\sum\limits_{j=0}^{d-1}\binom djS_j(n-1)$ ,提出右侧 $j=d-1$ 时对 $S_{d-1}(n-1)$  
$$\begin{aligned}
\binom d{d-1}S_d(n-1)&=n^d-\sum\limits_{j=0}^{d-2}(\binom djS_j(n-1))-1\\
S_{d-1}(n-1)&=\frac1d(n^d-\sum\limits_{j=0}^{d-2}(\binom djS_j(n-1))-1)
\end{aligned}$$  
此时是 $S_{d-1}(n-1)$ ，我们将其提到 $S_d(n)$  
$$\begin{aligned}
S_d(n)=&\frac1{d+1}((n+1)^{d+1}-\sum\limits_{j=0}^{d-1}(\binom{d+1}jS_j(n))-1)\\
=&\frac1{d+1}(\sum\limits_{j=0}^{d+1}\binom{d+1}jn^j-\sum\limits_{j=0}^{d-1}(\binom{d+1}jS_j(n))-1)
\end{aligned}$$  
其中 $\sum\limits_{j=0}^{d+1}\binom{d+1}jn_i$ 是一个 $d+1$ 次多项式且就这里次数最高，所以 $S_d(n)$ 是一个 $d+1$ 次多项式  
得证  
:::
  
那么在求解 $S_k(n)=\sum\limits_{i=1}^ni^k$ 时  
我们任取 $k+2$ 个点以确定这个 $k+1$ 次多项式  
即 $\{[i:1\rightarrow k+2]:(i,\sum\limits_{j=1}^ij^k)\}$  
由于 $x_i$ 连续所以我们直接使用连续自然数的拉格朗日插值法求解即可  

