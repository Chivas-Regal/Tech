---
title: 球盒模型
---

## 介绍

::: tip
我们先设置 $dp(n,m)=dp(n-m,m)+dp(n,m-1)$
:::

<b>$n$ 个球，$m$ 个盒子</b>
|球同|盒同|可空|公式|证明|
|---|----|---|----|---|
|$\checkmark$|$\checkmark$|$\checkmark$|$dp(n,m)$|[证明一](#证明一)|
|$\checkmark$|$\checkmark$|$\times$|$dp(n-m,m)$|[证明二](#证明二)|
|$\checkmark$|$\times$|$\checkmark$|$\begin{pmatrix}n+m-1\\m-1\end{pmatrix}$|[证明三](#证明三)|
|$\checkmark$|$\times$|$\times$|$\begin{pmatrix}n-1\\m-1\end{pmatrix}$|[证明四](#证明四)|
|$\times$|$\checkmark$|$\checkmark$|$\sum\limits_{i=1}^{m}\begin{Bmatrix}n\\i\end{Bmatrix}$|[证明五](#证明五)|
|$\times$|$\checkmark$|$\times$|$\begin{Bmatrix}n\\m\end{Bmatrix}$|[证明六](#证明六)|
|$\times$|$\times$|$\checkmark$|$m^n$|[证明七](#证明七)|
|$\times$|$\times$|$\times$|$\begin{Bmatrix}n\\m\end{Bmatrix}\times m!$|[证明八](#证明八)|

## 公式证明

### 证明一

我们对于 $dp(n,m)$ 有两种做法  
- <b>保证每个盒子都有球：</b>先给每个盒子放置一个球，剩下 $n-m$ 个球， $dp(n-m,m)$
- <b>保证至少有一个空盒子：</b>丢掉一个盒子，剩下 $m-1$ 个盒子， $dp(n,m-1)$  
  
所以 $dp(n,m)=dp(n-m,m)+dp(n,m-1)$ 满足上述公式


### 证明二

在 [上面的证明](#证明一) 中，我们这里第一步就是要保证每个盒子至少有一个球  
而后面的可以自然推导，毕竟我们已经保证了  

所以是第一种做法的结果 $dp(n-m,m)$

### 证明三

前置知识看 [证明四](#证明四)  
在这种情况一个缝隙可以插多个板，且两边也算作缝隙    
那么本来有 $n+1$ 个缝隙  
插入第 $1$ 块板，有 $\binom{n+1}{1}$ 种方法，板算作盒子列，就会形成 $n+2$ 个缝隙  
插入第 $2$ 块板，有 $\binom{n+2}{1}$ 种方法，板算作盒子列，就会形成 $n+3$ 个缝隙  
$\dots$  
插入第 $m-1$ 块板，有 $\binom{n+m}{1}$ 种方法  
同时会有因顺序不同而位置相同导致的重复情况，一共有 $(m-1)!$ 个  
所以答案为 $\frac{(n+1)(n+2)\dots(n+m-1)}{(m-1)!}=\begin{pmatrix}n+m-1\\m-1\end{pmatrix}$


### 证明四

使用插板法，将 $m-1$ 块板插入 $n$ 个球形成的 $n-1$ 个中间缝隙中  
每个缝隙最多插入一个板  
也就是从 $n-1$ 个缝隙中选择 $m-1$ 个作为有板缝隙  
答案为 $\begin{pmatrix}n-1\\m-1\end{pmatrix}$

### 证明五

前置知识看 [证明六](#证明六)   
  
我们让 $1$ 个盒子非空、 $2$ 个盒子非空、...、$m$ 个盒子非空  
那么方案数分别为  $\begin{Bmatrix}n\\1\end{Bmatrix}$ 、$\begin{Bmatrix}n\\2\end{Bmatrix}$ 、...、$\begin{Bmatrix}n\\m\end{Bmatrix}$   
累加便是 $\sum\limits_{i=1}^{m}\begin{Bmatrix}n\\i\end{Bmatrix}$


### 证明六

两种证明方法：   
  
<b>方法一</b>  
看作将 $n$ 个球分成 $m$ 个非空子集  
和第二类斯特林数的定义相同  
所以答案为 $\begin{Bmatrix}n\\m\end{Bmatrix}$  
  
<b>方法二</b>  
定义 $S(n,m)$ 为所求答案  
- <b>前 $n-1$ 个球保证 $m$ 个盒子都非空：</b>那么第 $n$ 个球可以放在 $m$ 个盒子的任意一个，有 $m\times S(n-1,m)$
- <b>前 $n-1$ 个球只保证了 $m-1$ 个盒子非空：</b>那么第 $n$ 个球只有一种放法便是放在那个空盒子内，$S(n-1,m-1)$  
  
所以 $S(n,m)=m\times S(n-1,m)+S(n-1,m-1)$  
和第二类斯特林数的推导式相同，故答案为 $\begin{Bmatrix}n\\m\end{Bmatrix}$  


### 证明七

此时我们任意一个球都可以在 $m$ 个盒子内任意选一个位置去放置，且都是不同的情况  
那么 $n$ 个球就有 $\prod\limits_{i=1}^nm=m^n$ 种方案

### 证明八

我们与 [证明六](#证明六) 联系起来  
发现这个的区别只在于我们的盒子是不同的  
那么意味着盒子的顺序可以随意替换  
$m$ 个盒子有 $m!$ 个顺序  
所以让第六种情况的公式乘上 $m!$ 即可  
答案为 $\begin{Bmatrix}n\\m\end{Bmatrix}\times m!$