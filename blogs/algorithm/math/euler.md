---
key: 2021-07-16-欧拉函数和欧拉定理
layout: article
title: 欧拉函数与欧拉定理
subtitle: 一堆奇奇怪怪的积性函数性质，能碰出怎样的火花呢？🤔
categories: 数学
tags: [数论]
aside:
  toc: true
sidebar:
  nav: docs-en
---

# 欧拉筛
## 模板

```cpp
vector<int> prime;
bool isprime[N];
inline void GetPrime(){
	isprime[0] = isprime[1] = 1;
	for(int i = 2; i < N; i ++){
		if(!isprime[i]) prime.push_back(i); //若未被标记，则i为质数
		for(int j = 0; j < prime.size() && prime[j] * i < N; j ++){
			isprime[i * prime[j]] = 1; //打上合数标记
			if(i % prime[j] == 0) break; //p[j]为i的约数时退出
		}
	}
}
```
## 算术基本定理
<span style="color: red;">算术基本定理</span>，又称<span style="color: red;">唯一分解定理</span><br>
定理内容是：<br>
任何一个大于$1$的自然数$N$，如果$N$不为质数，都可以唯一分解成有限个质数的乘积 $N=P_1^{a_1}P_2^{a_2}...P_n^{a_n}$ 。这里 $P_1\lt P_2\lt...\lt P_n$ 均为质数，指数 $a_i$ 均为正整数  
这样的分解称为<span style="color: red;">$N$的标准分解式</span><br><br>
<mark>在线性筛中的应用：每个数因它最小的质数而被标记</mark><br>
<span style="color: yellow;">规则体现在</span>：如果某个数$num$包含了某个$div$，那么这个最小$div$可以和别的数凑成一个更大的数去标记，那么此时后面就不需要继续用$num$去凑数标记了。<br>
>例：$(i,j)=(4,2),\quad $i%j=0$，那么说明$4$中有$2$，走到后面有个$12$，$12$可以因为$(6,2)$被标记，那么此时就不需要用$(4,3)$去进行标记了

# 欧拉函数

## 概念

$\sum\limits_{i=1}^n[gcd(i,n)=1]$ ,记为 $\phi(n)$  
欧拉函数的通式： $\phi(x)=x*\prod\limits_{i=1}^n(1-\frac1{p_i})$  
欧拉函数的性质： $n$的因子的欧拉函数加起来等于$n$

## 证明

<span style="color: orange;">情况1.如果 $n$ 是一个素数:</span>  
$n=p\quad\phi(n)=n(1-\frac1p)=p(1-\frac1p)=p-1$  
  
<span style="color: orange;">情况2.如果 $n$ 是一个素数 $p$ 的 $\alpha$ 次幂:</span>  
那么从$1\rightarrow n$中，只有$p$的倍数不与$n$互质，从$1$到$n$， $p、2p、3p、.....、p^{\alpha-1}p$ 一共有 $p^{\alpha-1}$ 个  
所以 $\phi(n)=n-p^{\alpha-1}=p^{\alpha}-p^{\alpha-1}=p^{\alpha}(1-\frac1p)=n(1-\frac1p)$  
  
<span style="color:orange;">情况3.如果 $n$ 是两个素数 $p$ $q$ 的乘积:</span>   
显然此时与$n$互质的数既不是 $p$ 的倍数也不是 $q$ 的倍数。类似的情况$2$中的分析，$p$的倍数应有$q$个，$q$ 的倍数有$p$个，但是还多算了一个既是$p$也是$q$的倍数$n$，于是 $\phi(n)=n-(p+q-1)=p* q-p-q+1=(p-1)(q-1)=n(1-\frac1p)(1-\frac1q)$  
还可以发: $\phi(n)=\phi(p\times q)(1-\frac 1p)(1-\frac 1q) = \phi(p)\times\phi(q)$  
  
<span style="color:red;">概念：积性函数和完全积性函数</span> (欧拉函数是积性函数)  
完全积性函数：$\phi(n)=\phi(p\times q)=\phi(p)\times\phi(q)$ 中不要求 $p$ $q$ 互质    
积性函数：$\phi(n)=\phi(p\times q)=\phi(p)\times \phi(q)$ 中要求 $p$ $q$ 互质  
  
<span style="color:orange;">情况4.$n$ 是某个 $m$ 和一个于 $m$ 互质的素数 $p$ 的乘积，即: $n = m * p$：</span>（完整的证明需要各种定理，这里不详解）假设 $m$ 是之前讨论的情况，即 $m$ 满足欧拉函数公式： $$\phi(m)=m*\prod^k_{i=1}(1-\frac1{p_i})$$ 同时因为 $n = m * p$， $m$ 与 $p$ 互质， 则有： $$\phi(n)=\phi(m*p)=\phi(m)*\phi(p)$$ 另外，由情况$1$可知： $\phi(p)=p-1=p(1-\frac1p)$   
显然， $\phi(m) * \phi(p)$ 得到的公式，依然满足欧拉函数    
  
<span style="color: orange;">情况5. $n = m * p$， $p$ 是素数，但是 $p$ 不与 $m$ 互质</span>   
$p$ 是素数，但不与 $m$ 互质，显然 $p$ 是 $m$ 的因子，可以转化为 $n=q\times p^{\alpha}=\phi(q)\times\phi(p^{\alpha})$ ,其中 $q$ 不含 $p$ 的因子 故： $$\phi(n)=\phi(q*p^{\alpha})=\phi(q)*\phi(p^{\alpha})=q*p\alpha*\prod^k_{i=1}(1-\frac1{p_i})=n*\prod^k_{i=1}(1-\frac1{p_i})$$ 公式显然依然成立  

## 线性求法

```cpp
for(int i = 2; i <= N; i ++){
	if(!vis[i]) prime.push_back(i), phi[i] = i - 1;
	for(int j = 0; j < prime.size() && i * p[j] <= N; j ++){
		vis[i * prime[j]] = 1;
		if(i % prime[j] == 0) { phi[i * prime[j]] = phi[i] * prime[j]; break; }
		phi[i * prime[j]] = phi[i] * (prime[j] - 1);
	}
}
```
# 欧拉定理
## 概念
若 $n$, $a$ 为正整数，且它们互质，则 $$a^{\phi(n)}\equiv1(mod\quad n)$$  
>显然：当 $n$ 为质数时 $a^{n-1}\equiv1(mod\quad n)$ 就是费马小定理

## 应用 —— 逆元
如果在<span style="color: red;">模运算</span>中有<span style="color: red;">除法</span>，同时<span style="color: red;">模数不是质数</span>，则此时不可以用费马小定理，可以用欧拉定理  
逆元就相当于把费马小定理中的质数一般化一下： $a$ 的逆元 = $a^{\phi(n)-1}$
# 扩展欧拉定理
## 概念
用来降幂，又称为<span style="color: red;">欧拉降幂</span>  
$$a^b \equiv\left\{\begin{array}{ll}
a^{b\%\phi(n)}&gcd(a,n)=1\\
a&gcd(a,n)\neq1,b\lt\phi(n)\quad(mod\quad n)\\
a^{b\%\phi(n)+\phi(n)}&gcd(a,n)\neq1,b\ge\phi(n)
\end{array}\right.$$

## 程序实现

```cpp
int main(){
	while(scanf("%lld%s%lld", &a, b, &n) == 3){
		ll len = strlen(b), p = phi(c), up = 0;
		for(ll i = 0; i < len; i ++) up = (up * 10 + b[i] - '0') % p;
		up += p; // 加还是不加取决于 [gcd(a, n) = 1]
		outLL(ksm(a, up, n));
	}
}
```
## 例题

>给定一个长度为n的数组以及若干次询问 $l, r$.  
求： $a_l^{a_{l+1}^{a_{l+2}^{...^{a_r}}}}mod\;m$  
解：使用欧拉降幂递归求指数：

```cpp
inline ll get(ll l, ll r, ll m){
	if(l == r || m == 1) return mo(a[l], m);
	return ksm(a[l], get(l + 1, r, phi(m)), m);
}
```
  
>
T组询问，每次询问给出一正整数 p(p <= 1e7), 求 $2^{2^{2^{...^{2}}}} mod \;p$
递归层数会不会很大？<br>
欧拉函数两个性质：<br>
(1)p>2时， $\phi(p)$ 为偶数  
(2)p如果为偶数， $\phi(p)\le\frac p2$  
可以证明：递归层数为 $O(log\;p)$
