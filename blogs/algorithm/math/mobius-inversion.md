---
key: 2021-07-17-莫比乌斯反演
layout: article
title: 莫比乌斯反演
aside:
  toc: true
sidebar:
  nav: docs-en
---

# 前置芝士 —— 莫比乌斯函数
### 定义

$$μ(n) =
\begin{cases}
1      & n = 1 \\
(-1)^k   & n\text{无平方因数，}n = p_1p_2p_3...p_k \\
0          & n\text{有大于}1\text{的平方因数} \\
\end{cases}$$

可以简化为：  
在 $n$ 无平方因数时： $μ(n) = (-1)^{n的不同质因子的个数}$  
其他情况： $\qquad\;\;\;μ(n) = 0$
### 性质
正常情况下在 $n$ 有 $x$ 数个不同质因子，$m$ 有 $y$ 数个不同质因子时  
- $x$ 奇，$y$ 奇，$n \times m$ 的质因子个数 $= x + y =$ 偶， $μ(n) * μ(m) = (-1) * (-1) = 1$  
- $x$ 奇，$y$ 偶，$n \times m$ 的质因子个数 $= x + y =$ 奇， $μ(n) * μ(m) = (-1) * \quad1 \;\;= -1$  
- $x$ 偶，$y$ 奇，$n \times m$ 的质因子个数 $= x + y =$ 奇， $μ(n) * μ(m) = \quad1 \;\;* (-1) = -1$  
- $x$ 偶，$y$ 偶，$n \times m$ 的质因子个数 $= x + y =$ 偶， $μ(n) * μ(m) = \quad1 \;\;* \quad1 \;\;= 1$  
可以看出莫比乌斯函数是个积性函数

但是特殊情况例如 $n = m = 2$ 时  
$μ(n) = μ(m) = -1$  
$μ(n * m) = 0\;\;!= (-1) * (-1) = μ(n) * μ(m)$  
所以莫比乌斯函数不是完全积性函数  

### 推论
有两个[狄利克雷卷积](http://www.chivas-regal.top/%E6%95%B0%E5%AD%A6/2021/11/16/%E7%8B%84%E5%88%A9%E5%85%8B%E9%9B%B7%E5%8D%B7%E7%A7%AF.html)出来的推论  
$$1.\;(\mu * Id)(n)=\phi(n)$$  
$$2.\;(\mu * 1)(n)=\varepsilon(n)$$  
(具体证明请看上面的狄利克雷卷积传送门

### 程序
线性筛打表：

```cpp
const int maxn = 2005;

bool isprime[maxn];
ll mu[maxn];//Mobius函数表
vector<ll> prime;

inline void Mobius(){//线性筛
        isprime[0] = isprime[1] = 1;
        mu[1] = 1;//特判mu[i] = 1
        for(ll i = 2; i <= maxn; i ++){
                if( !isprime[i] ) mu[i] = -1, prime.push_back(i);//质数的质因子只有自己，所以为-1
                for(ll j = 0; j < prime.size() && i * prime[j] <= maxn; j ++){
                        isprime[i * prime[j]] = 1;
                        if(i % prime[j] == 0) break;
                        mu[i * prime[j]] = -mu[i];//积性函数性质： (i * prime[j])多出来一个质数因数(prime[j])，修正为 (-1) * mu[i]
                }
        }
        //剩余的没筛到的是其他情况，为0
}
```

# 概述
### 概念
莫反是一种利用莫比乌斯函数的积性性质，对方程进行计算用时简化的一种方法
### 思想
（上文中性质的利用）
### 反演定理
设有两个方程 $f(x)$ 和 $F(x)$ ，有以下两种反演方式

- $F(n) = \sum_{d|n}f(d)$ $\Rightarrow$ $f(n) = \sum_{d|n}{}μ(d)F(\frac nd)$
::: details 证明
$$\sum_{d|n}\mu(d)F(\frac nd) = \sum_{d|n}\mu(d)\sum_{i|\frac nd}f(i) = \sum_{i|n}f(i)\sum_{d|\frac ni}\mu(d) = f(n)$$
:::

- $F(n) = \sum_{n|d}f(d)$ $\Rightarrow$ $f(n) = \sum_{n|d}{}μ(\frac dn)F(d)$
::: details 证明
$$\sum_{n|d}\mu(\frac dn)F(d) = \sum_{n|d}\mu(\frac dn)\sum_{d|i}f(n)=(d' = \frac dn)\sum_{n|i}f(i)\sum_{d'|\frac in}\mu(d') = f(n)$$
:::

# 实例
### 题目
[UVA10214 《Trees in a Wood.》传送门](https://vjudge.net/problem/UVA-10214)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210606161231327.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1Nub3B6WXo=,size_16,color_FFFFFF,t_70)
### 思路
与[[SDOI2008]仪仗队](https://www.luogu.com.cn/problem/P2158)很像  
在一个象限内   
都是让求  
$$\sum_{i = 1}^{N}\sum_{j=1}^{M}[gcd(i,j)=1]$$  
所以我们设置  
$$f(n) = \sum_{i = 1}^{N}\sum_{j=1}^{M}[gcd(i,j)=n],\quad f(1) = \;?$$  
但是因为 $f(1)$ 比较难求，所以我们同时要设置一个满足 $F(n) = \sum_{n|d}f(d)$ 的 $F(n)$  
$$F(n) = \sum_{i = 1}^{N}\sum_{j=1}^{M}[n | gcd(i,j)],\quad F(1) =  \sum_{i = 1}^{N}\sum_{j=1}^{M}1$$  
$$\therefore F(n) = \sum_{n|d}f(d),\quad F(1) = \sum_{d = 1}^{min(N,M)}f(d)$$  
$$\therefore f(n) = \sum_{n|d}\mu(\frac dn)F(d),\quad f(1) = \sum_{d=1}^{min(N,M)}\mu(d)F(d)$$  
$$\because 1 \le d \le min(N, M)$$  
$$\therefore F(d) = \left \lfloor \frac Nd \right \rfloor * \left \lfloor \frac Md \right \rfloor$$  
$$\therefore f(1) = \sum_{d=1}^{min(N,M)}\mu(d) * \left \lfloor \frac Nd \right \rfloor * \left \lfloor \frac Md \right \rfloor$$  
由于四个象限 + 四个坐标轴，所以分子为 $4 * \sum_{d = 1}^{min(N, M)}μ(d)*\left \lfloor \frac nd \right \rfloor *\left \lfloor \frac md \right \rfloor + 4$  
分母则是所有的树 $(N * 2 + 1) * (M * 2 + 1) - 1$  

答案则是 $\frac {4 * \sum_{d = 1}^{min(N, M)}μ(d)*\left \lfloor \frac nd \right \rfloor *\left \lfloor \frac md \right \rfloor + 4}{(N * 2 + 1) * (M * 2 + 1) - 1}$ 保留 $7$ 位小数
### 程序
```cpp
const int maxn = 2005;

bool isprime[maxn];
ll mu[maxn];//Mobius函数表
ll n, m;
vector<ll> prime;

inline void Mobius(){//线性筛
        isprime[0] = isprime[1] = 1;
        mu[1] = 1;//特判mu[i] = 1
        for(ll i = 2; i <= maxn; i ++){
                if( !isprime[i] ) mu[i] = -1, prime.push_back(i);//质数的质因子只有自己，所以为-1
                for(ll j = 0; j < prime.size() && i * prime[j] <= maxn; j ++){
                        isprime[i * prime[j]] = 1;
                        if(i % prime[j] == 0) break;
                        mu[i * prime[j]] = -mu[i];//积性函数性质： (i * prime[j])多出来一个质数因数(prime[j])，修正为 (-1) * mu[i]
                }
        }
        //剩余的没筛到的是其他情况，为0
}

inline void solve(){
        ll res = 0;
        for(ll d = 1; d <= MIN(n, m); d ++){
                res += mu[d] * (n / d) * (m / d);
        }
        res = res * 4 + 4;//四个象限 + 坐标轴的四个贡献
        ll down = (n * 2 + 1) * (m * 2 + 1) - 1;//分母，矩阵所有树 - 原点
        printf("%.7f\n", res * 1.0 / down);
}

int main () {
        Mobius();
        while(scanf("%lld%lld", &n, &m) == 2, n || m){
                solve();
        }
        return 0;
}
```
