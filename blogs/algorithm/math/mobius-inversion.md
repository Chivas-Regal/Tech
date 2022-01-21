---
key: 2021-07-17-莫比乌斯反演MöbiusInversionFormula
layout: article
title: 莫比乌斯反演MöbiusInversionFormula
subtitle: 复杂的式子经过反演竟然可以变得这么简单？🤔
categories: 数学
tags: [数论]
aside:
  toc: true
sidebar:
  nav: docs-en
---

# 📕前置芝士 —— 莫比乌斯函数
### 🎈定义

$$μ(n) =
\begin{cases}
1      & n = 1 \\
(-1)^k   & n\text{无平方因数，}n = p_1p_2p_3...p_k \\
0          & n\text{有大于}1\text{的平方因数} \\
\end{cases}$$

可以简化为：<br />
在n无平方因数时： $μ(n) = (-1)^{n的不同质因子的个数}$<br />
其他情况： $\qquad\;\;\;μ(n) = 0$
### 🎈性质
正常情况下在n有x数个不同质因子，m有y数个不同质因子时  
1.x奇，y奇，n * m的质因子个数 = x + y = 偶， $μ(n) * μ(m) = (-1) * (-1) = 1$  
2.x奇，y偶，n * m的质因子个数 = x + y = 奇， $μ(n) * μ(m) = (-1) * \quad1 \;\;= -1$  
3.x偶，y奇，n * m的质因子个数 = x + y = 奇， $μ(n) * μ(m) = \quad1 \;\;* (-1) = -1$  
4.x偶，y偶，n * m的质因子个数 = x + y = 偶， $μ(n) * μ(m) = \quad1 \;\;* \quad1 \;\;= 1$  
可以看出莫比乌斯函数是个积性函数

但是特殊情况例如 $n = m = 2$ 时<br />
$μ(n) = μ(m) = -1$<br />
$μ(n * m) = 0\;\;!= (-1) * (-1) = μ(n) * μ(m)$<br />
所以莫比乌斯函数不是完全积性函数<br />

### 🎈推论
有两个[狄利克雷卷积](http://www.chivas-regal.top/%E6%95%B0%E5%AD%A6/2021/11/16/%E7%8B%84%E5%88%A9%E5%85%8B%E9%9B%B7%E5%8D%B7%E7%A7%AF.html)出来的推论  
$$1.\;(\mu * Id)(n)=\phi(n)$$  
$$2.\;(\mu * 1)(n)=\varepsilon(n)$$  
(具体证明请看上面的狄利克雷卷积传送门

### 🎈程序
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

# 📕概述
### 🎈概念
莫反是一种利用莫比乌斯函数的积性性质，对方程进行计算用时简化的一种方法
### 🎈思想
（上文中性质的利用）
### 🎈反演定理
设有两个方程 $f(x)$ 和 $F(x)$ ，有以下两种反演方式

1. $$F(n) = \sum_{d|n}f(d)$$ $$\Downarrow$$ $$f(n) = \sum_{d|n}{}μ(d)F(\frac nd)$$
>证明：
> $$\sum_{d|n}\mu(d)F(\frac nd) = \sum_{d|n}\mu(d)\sum_{i|\frac nd}f(i) = \sum_{i|n}f(i)\sum_{d|\frac ni}\mu(d) = f(n)$$

2. $$F(n) = \sum_{n|d}f(d)$$ $$\Downarrow$$ $$f(n) = \sum_{n|d}{}μ(\frac dn)F(d)$$
>证明
> $$\sum_{n|d}\mu(\frac dn)F(d) = \sum_{n|d}\mu(\frac dn)\sum_{d|i}f(n)=(d' = \frac dn)\sum_{n|i}f(i)\sum_{d'|\frac in}\mu(d') = f(n)$$

# 📕实例
### 🎈题目
[UVA10214 《Trees in a Wood.》传送门](https://vjudge.net/problem/UVA-10214)
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210606161231327.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1Nub3B6WXo=,size_16,color_FFFFFF,t_70)
### 🎈思路
与[[SDOI2008]仪仗队](https://www.luogu.com.cn/problem/P2158)很像
在一个象限内<br />
都是让求<br />
$$\sum_{i = 1}^{N}\sum_{j=1}^{M}[gcd(i,j)=1]$$<br />
所以我们设置 $$f(n) = \sum_{i = 1}^{N}\sum_{j=1}^{M}[gcd(i,j)=n],\quad f(1) = \;?$$<br />
但是因为 $f(1)$ 比较难求，所以我们同时要设置一个满足 $F(n) = \sum_{n|d}f(d)$ 的 $F(n)$<br />
$$F(n) = \sum_{i = 1}^{N}\sum_{j=1}^{M}[n | gcd(i,j)],\quad F(1) =  \sum_{i = 1}^{N}\sum_{j=1}^{M}1$$<br />
$$\therefore F(n) = \sum_{n|d}f(d),\quad F(1) = \sum_{d = 1}^{min(N,M)}f(d)$$<br />
$$\therefore f(n) = \sum_{n|d}\mu(\frac dn)F(d),\quad f(1) = \sum_{d=1}^{min(N,M)}\mu(d)F(d)$$<br />
$$\because 1 \le d \le min(N, M)$$<br />
$$\therefore F(d) = \left \lfloor \frac Nd \right \rfloor * \left \lfloor \frac Md \right \rfloor$$<br />
$$\therefore f(1) = \sum_{d=1}^{min(N,M)}\mu(d) * \left \lfloor \frac Nd \right \rfloor * \left \lfloor \frac Md \right \rfloor$$<br />
由于四个象限 + 四个坐标轴，所以分子为 $4 * \sum_{d = 1}^{min(N, M)}μ(d)*\left \lfloor \frac nd \right \rfloor *\left \lfloor \frac md \right \rfloor + 4$<br />
分母则是所有的树 $(N * 2 + 1) * (M * 2 + 1) - 1$<br />

答案则是 $\frac {4 * \sum_{d = 1}^{min(N, M)}μ(d)*\left \lfloor \frac nd \right \rfloor *\left \lfloor \frac md \right \rfloor + 4}{(N * 2 + 1) * (M * 2 + 1) - 1}$ 保留7位小数
### 🎈程序
```cpp
/*
           ________   _                                              ________                              _
          /  ______| | |                                            |   __   |                            | |
         /  /        | |                                            |  |__|  |                            | |
         |  |        | |___    _   _   _   ___  _   _____           |     ___|   ______   _____   ___  _  | |
         |  |        |  __ \  |_| | | | | |  _\| | | ____|          |  |\  \    |  __  | |  _  | |  _\| | | |
         |  |        | |  \ |  _  | | | | | | \  | | \___           |  | \  \   | |_/ _| | |_| | | | \  | | |
         \  \______  | |  | | | | \ |_| / | |_/  |  ___/ |          |  |  \  \  |    /_   \__  | | |_/  | | |
Author :  \________| |_|  |_| |_|  \___/  |___/|_| |_____| _________|__|   \__\ |______|     | | |___/|_| |_|
                                                                                         ____| |
                                                                                         \_____/
*/
#include <unordered_map>
#include <algorithm>
#include <iostream>
#include <cstring>
#include <utility>
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <map>
#include <set>

#define G 10.0
#define LNF 1e18
#define EPS 1e-6
#define PI acos(-1.0)
#define INF 0x7FFFFFFF

#define ll long long
#define ull unsigned long long

#define LOWBIT(x) ((x) & (-x))
#define LOWBD(a, x) lower_bound(a.begin(), a.end(), x) - a.begin()
#define UPPBD(a, x) upper_bound(a.begin(), a.end(), x) - a.begin()
#define TEST(a) cout << "---------" << a << "---------" << '\n'

#define CHIVAS_ int main()
#define _REGAL exit(0)

#define SP system("pause")
#define IOS ios::sync_with_stdio(false)
//#define map unordered_map

#define _int(a) int a; cin >> a
#define  _ll(a) ll a; cin >> a
#define _char(a) char a; cin >> a
#define _string(a) string a; cin >> a
#define _vectorInt(a, n) vector<int>a(n); cin >> a
#define _vectorLL(a, b) vector<ll>a(n); cin >> a

#define PB(x) push_back(x)
#define ALL(a) a.begin(),a.end()
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for (cin >> cass; cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;

template<typename T> inline void Read(T &x){T f = 1; x = 0;char s = getchar();while(s < '0' || s > '9'){if(s == '-') f = -1; s = getchar();}while('0'<=s&&s<='9'){x=(x<<3)+(x<<1)+(s^48);s=getchar();}x*=f;}
template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? GCD(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}
template<typename T>             vector<T>& operator--            (vector<T> &v){for (auto& i : v) --i;            return  v;}
template<typename T>             vector<T>& operator++            (vector<T> &v){for (auto& i : v) ++i;            return  v;}
template<typename T>             istream& operator>>(istream& is,  vector<T> &v){for (auto& i : v) is >> i;        return is;}
template<typename T>             ostream& operator<<(ostream& os,  vector<T>  v){for (auto& i : v) os << i << ' '; return os;}

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

CHIVAS_{Mobius();
        while(scanf("%lld%lld", &n, &m) == 2, n || m){
                solve();
        }
        _REGAL;
}
```