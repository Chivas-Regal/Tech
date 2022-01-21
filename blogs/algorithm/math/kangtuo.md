---
key: 2021-05-20-康托展开
layout: article
title: 康托展开
subtitle: 全排列按字典序是第几个呢？🤔
categories: 数学
tags: [数学]
aside:
  toc: true
sidebar:
  nav: docs-en
---

# 😄康托展开

## 📕定义 & 用处

康托展开是一个全排列到一个自然数的双射，其实质是计算当前排列在所有由小到大全排列中的顺序，是可逆的  
一般可用来求解n的升序全排列中，某个排列是第几个排列  
  
## 📕思想

是一种类似于字典序思想的组合问题应用  
求法是逐位统计每一位后面有多少个比当前位小的数*这一位减一的阶乘  
因为在n排列的升序字典序  
如果有一堆数可以选择来放在第一位  
我们放x时，有x - 1个比x小的数  
这些数如果放在第1位所构成的任意数的字典序都会比放x小  
而第一位放每一个数时，后面都可以有(n - 1)!种放法  
公式：$X = a_n * (n - 1)! + a_{n - 1} * (n - 2)! + ... + a_1 * 0!$  
$a_i$表示在还没确定的数中，有多少个比当前数更小的  
  
## 📕过程

我们要求的也就是一个阶乘表，和一个逆序对统计  
设立一个res  
每次累加$a_i * (n - i - 1)!$  
其中$a_i$可以求逆序对记录中，x - 1 - SUM(x - 1)即比x小的数有多少个还没有出现  

## 📕程序
[LUOGU《【模板】康托展开》传送门](https://www.luogu.com.cn/problem/P5367)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210604164135332.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1Nub3B6WXo=,size_16,color_FFFFFF,t_70)

```cpp
const int mod = 998244353;
const int maxn = 1e6 + 10;

vector<ll> f;//阶乘表
inline void get_F(){
        f.push_back(1);
        for(int i = 1; i <= maxn; i ++) f.push_back(f.back() * i % mod);
}

ll C[maxn];//树状数组
ll n;//n排列
ll a[maxn];//排列的每一位

inline ll SUM(ll i){//统计1 ~ i的区间和
        ll res = 0;
        while(i) res = (res + C[i]) % mod, i -= LOWBIT(i);
        return res;
}

inline void UPDATE(ll i, ll val){//对下标为i的点单点更新+val
        while(i <= maxn) C[i] += val, i += LOWBIT(i);
}

//x前面有m个比x小的，后面就有x - 1 - m个小的

inline void solve(){
        cin >> n;
        for(int i = 0; i < n; i ++) cin >> a[i];
        ll res = 1;//因为康托展开从12345....开始展，所以初始值为1
        for(int i = 0; i < n; i ++){
                UPDATE(a[i], 1);
                res = (res + (a[i] - 1 - SUM(a[i] - 1)) * f[n - i - 1] % mod) % mod;//累加比a[i]小且未出现的个数*(n - i - 1)的全排列
        }cout << res << endl;
}

CHIVAS{get_F();
        solve();
        _REGAL;
}
```

# 😄康托逆展开
## 📕定义 & 用处

上面说到可逆，这里就是在康托展开的基础上进行的逆操作  
用来求n升序全排列的第m个排列是什么  

## 📕思想

同样是一种字典序组合排列的思想，在于对m的均匀分配  
  
在康托展开的公式下逆推导  
这一位确定要放剩余未放的数中第$\frac {m}{f[n - 第id位 - 1]}$大的数  
m剩余$m\;mod\; f[n - 第id位 - 1]$  
  
## 📕过程

设置一个放置“未利用的数”的动态数组vec  
每一位vec[ m / f[n - i] ]就是我们要放在这一位的数，并在vec中移去  
同时m %= f[n - i]  

## 📕程序

```cpp
ll n, m;

vector<ll> f;
inline void get_F(){
        f.push_back(1);
        for(int i = 1; i <= n; i ++) f.push_back(f.back() * i);
}

vector<ll> NotUse;

inline void solve(){
        vector<ll> res;
        m --;//同理从1234...开始，所以减一项
        for(int i = 1; i <= n; i ++){
                res.push_back(NotUse[m / f[n - i]]);//放置未出现的第[m / f[n - i]] + 1个
                NotUse.erase(NotUse.begin() + m / f[n - i]);//删除这一个
                m %= f[n - i];//剩余m
        }
        cout << res << endl;
}

CHIVAS{ cin >> n >> m; get_F();
        for(int i = 1; i <= n; i ++) NotUse.push_back(i);

        solve();
        _REGAL;
}
```
