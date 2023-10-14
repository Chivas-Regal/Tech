---
key: 2021-11-16-狄利克雷卷积
layout: article
title: 狄利克雷卷积
aside:
  toc: true
sidebar:
  nav: docs-en
---

## 定义

设 $f$ 和 $g$ 都是数论函数  
定义 $f$ 和 $g$ 的狄利克雷卷积为 $H$ ，使得 $H=f*g$  

## 公式表示

$H(n)=\sum\limits_{i * j=n}f(i)\times g(j)$  
$H(n)=\sum\limits_{i|n}f(i)\times g(\frac ni)$ 
 
## 定理
  
### 总览

若 $f$ 和 $g$ 都是积性函数，则 $f * g$ 也是积性函数  
$f * g=g * f$  
$(f * g) * h=f * (g * h)$  
$f * (g+h)=f * g+f * h$

### 证明

#### 若 $f$ 和 $g$ 都是积性函数，则 $f * g$ 也是积性函数  

$$\begin{aligned}
&(f * g)(n)\times (f * g)(m)\\
=&\sum\limits_{i|n}^nf(i)\times g(\frac ni)\times \sum\limits_{j|m}^mf(j)\times g(\frac mj)\\
=&\sum\limits_{i|n}^n\sum\limits_{j|m}^mf(i)\times f(j)\times g(\frac ni)\times g(\frac mj)\\
=&\sum\limits_{ij|nm}^{nm} f(ij)\times g(\frac{nm}{ij})\qquad\qquad &(nm=d,\;ij=k)\\
=&\sum\limits_{k|d}^df(k)\times g(\frac dk)\\
=&(f * g)(d)
\end{aligned}$$    
得证   

#### $f * g=g * f$  

$$\begin{aligned}
&(f * g)(n)\\
=&\sum\limits_{i|n}f(i)\times g(\frac ni)\qquad\qquad&(j=\frac ni)\\
=&\sum\limits_{j|n}g(j)\times f(\frac ni)\\
=&(g * f)(n)
\end{aligned}$$  
得证 

#### $(f * g) * h=f * (g * h)$

$$\begin{aligned}
 &((f * g) * h)(n)\\
	 =&\sum\limits_{xy=n}(f * g)(x)\times h(y)\\
	 =&\sum\limits_{xy=n}(\sum\limits_{zw=x}f(z)\times g(w))\times h(y)\\
	 =&\sum\limits_{zwy=n}(g(w)\times h(y))\times f(z)\\
	 =&\sum\limits_{xz=n}(\sum\limits_{wy=x}g(w)\times h(y))\times f(z)\\
	 =&\sum\limits_{xz=n}(g * h)(x)\times f(z)\\
	 =&(f * (g * h))(n) 
 \end{aligned}$$  
得证
 
#### $f * (g+h)=f * g+f * h$

$$\begin{aligned}
&(f * (g+h))(n)\\
=&\sum\limits_{xy=n}f(x)\times (g+h)(y)\\
=&\sum\limits_{xy=n}f(x)\times(g(y)+h(y))\\
=&\sum\limits_{xy=n}f(x)\times g(y)+f(x)\times h(y)\\
=&\sum\limits_{xy=n}f(x)\times g(y)+\sum\limits_{xy=n}f(x)\times h(y)\\
=&(fg+f * h)(n)
\end{aligned}$$  
得证

## 推论

### 总览

$\;1 * 1=d$  
$\;1 * Id=\sigma$  
$\;\mu * 1=\varepsilon$  
$\;\phi * 1=Id$  
$\;\mu * Id=\phi$

### 证明

#### $1 * 1=d$

$$\begin{aligned}
&(1 * 1)(n)\\
=&\sum\limits_{i|n}1\\
=&d(n)
\end{aligned}$$

#### $1 * Id=\sigma$

$$\begin{aligned}
&(1 * Id)(n)\\
=&(Id * 1)(n)\\
=&\sum\limits_{i|n}Id(i)\\
=&\sigma(n)
\end{aligned}$$

#### $\mu * 1=\varepsilon$

设 $k$ 是 $n$ 的质因子个数  
$$\begin{aligned}
&(\mu * 1)(n)\quad\quad&(n=\prod\limits_{p|n}p^a,\;n'=\prod\limits_{p|n}p)\\
=&(\mu * 1)(n')\\
=&\sum\limits_{d|n'}\mu(d)\\
=&\sum\limits_{i=0}^k\binom ki(-1)^i1^{k-i}\\
=&(-1+1)^k\\
=&\left\{\begin{aligned}k=0\quad&1\\k\neq0\quad&0\end{aligned}\right.\\
=&\varepsilon(n)
\end{aligned}$$

#### $\phi * 1=Id$

$\forall d|m,\;1\le a\le n,\;(a,n)=d\rightarrow(\frac ad,\frac nd)=1$    
这样的 $a$ 可以选 $\phi(\frac md)$ 个  
$\therefore n=\sum\limits_{d|n}\phi(\frac nd)$  
$\therefore (\phi * 1)(n)=Id(n)$  

#### $\mu * Id=\phi$

我们可以根据已有的推论  
$\because\phi * 1=Id$  
$\therefore\phi * 1 * \mu=Id * \mu$  
$\because\mu * 1=\varepsilon$  
$\therefore\phi * \varepsilon=Id * \mu$  
观察左边的 $=\sum\limits_{d|n}\phi(d)\varepsilon(\frac nd)$  
在 $d\neq n$ 无贡献，因为 $\varepsilon(\frac nd)=0$  
在 $d=n$ 有贡献 $=\phi(n)\times 1=\phi(n)$  
$\therefore Id * \mu=\phi$

## 例题

**洛谷P1447**  
[题目地址](https://www.luogu.com.cn/problem/P1447)  
[题解地址](https://tech.chivas-regal.top/blogs/solution/math/euler-inversion.html#%E6%B4%9B%E8%B0%B7p1447-%E8%83%BD%E9%87%8F%E9%87%87%E9%9B%86)
