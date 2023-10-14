---
key: 2021-08-11-Baby-Step-Giant-Step
layout: article
title: Baby-Step Giant-Step
subtitle: 高次同余方程又该怎么解那个指数呢？🤔
categories: 数学
tags: [数论]
aside:
  toc: true
sidebar:
  nav: docs-en
---

## BSGS

> 求解 $a^t\equiv b(mod\;p)\quad gcd(a,p)=1$   

由于欧拉定理 $a^{\phi(p)}\equiv1(mod\;p)$  
也就是 $a^t\equiv a^{x\;mod\;\phi(p)}(mod\;p)$ 从而得到 $t\in[0,\phi(p)-1]$  
而我们在 $[0,p]$ 里面求解，使 $k=⌈p⌉$  
此时 $t=kx−y,\{1≤x≤k,0≤y≤k−1\}$  
问题转化问求 $a^{kx−y}≡b(mod\;p)$  
即 $a^{kx}≡b⋅ay(mod\;p)$  
使用hash表存入 $b⋅ay(mod\;p)$ ,然后枚举 a^{kx} 看看hash表内有没有这个值  

```cpp
int bsgs(int a, int b, int p) {
    if (1 % p == b % p)
        return 0;
    int k = sqrt(p) + 1;
    unordered_map<int, int> hash;
    for (int i = 0, j = b % p; i < k; i++) {
        hash[j] = i;
        j = (ll)j * a % p;
    }
    int ak = 1;
    for (int i = 0; i < k; i++)
        ak = (ll)ak * a % p;
    for (int i = 1, j = ak; i <= k; i++) {
        if (hash.count(j))
            return (ll)i * k - hash[j];
        j = (ll)j * ak % p;
    }
    return -1;
}
int main() {
    int a, p, b;
    while (cin >> a >> p >> b, a || p || b) {
        int res = bsgs(a, b, p);
        if (res == -1)
            puts("No Solution");
        else
            cout << res << endl;
    }
}
```

## 扩展BSGS

> 求解 $a^t≡b(mod\;p)\quad gcd(a,p)\neq1$  

$$\left\{\begin{aligned} 
   &a^0\equiv b(mod\;p),t=0\\
   &a^0\;!= b(mod\;p),设gcd(a,p)=d
  \left\{\begin{aligned} 
  &d=1,\quad BSGS直接求解\\
\\
  &d>1,\quad\begin{aligned}
​         &a^t\equiv b(mod\;p)\\
​         &a^t+kp=b\quad (若d\% b\ne0,无解返回) \\
​         &\frac ad·a^{t-1}+k\frac pd=\frac bd\\
​         &\frac ad·a^{t-1}\equiv \frac bd(mod\;\frac pd)\\
​         &a^{t-1}\equiv\frac bd·\frac ad^{-1}(mod\;\frac pd)
  \left\{\begin{aligned} 
  &if(\;gcd(a^{t-1},\frac pd)\;)=1\quad &BSGS直接求解\\
  &else\quad&继续递归
\end{aligned}\right.
\end{aligned}
\end{aligned}\right. 
\end{aligned}\right.$$

```cpp
const int INF = 1e8;
int exgcd(int a, int b, int &x, int &y) {
    if (!b) {
        x = 1, y = 0;
        return a;
    }
    int d = exgcd(b, a % b, y, x);
    y -= a / b * x;
    return d;
}
int bsgs(int a, int b, int p) {
    if (1 % p == b % p)
        return 0;
    int k = sqrt(p) + 1;
    unordered_map<int, int> hash;
    for (int i = 0, j = b % p; i < k; i++) {
        hash[j] = i;
        j = (ll)j * a % p;
    }
    int ak = 1;
    for (int i = 0; i < k; i++)
        ak = (ll)ak * a % p;
    for (int i = 1, j = ak; i <= k; i++) {
        if (hash.count(j))
            return i * k - hash[j];
        j = (ll)j * ak % p;
    }
    return -INF;
}
int exbsgs(int a, int b, int p) {
    b = (b % p + p) % p; // b变成正的
    if (1 % p == b % p)
        return 0;
    int x, y;
    int d = exgcd(a, p, x, y);
    if (d > 1) { // a与p不互质，继续递归
        if (b % d)
            return -INF;                                          // 若b不是gcd的倍数
        exgcd(a / d, p / d, x, y);                                // exgcd求逆元
        return exbsgs(a, (ll)b / d * x % p % (p / d), p / d) + 1; // 因为本来求的是t-1的最小值，+1得t
    }
    return bsgs(a, b, p);
}
int main() {
    int a, p, b;
    while (cin >> a >> p >> b, a || p || b) {
        int res = exbsgs(a, b, p);
        if (res == -INF)
            puts("No Solution");
        else
            cout << res << endl;
    }
}
```

## 例题应用

> 给定一个🍅，$x_n=ax_{n−1}+b$ ，已知 $x_1,a,b$ ，求最早出现 $x_n=t$ 的 $n$ 是多少
  
由🍅可以看出，这是一个带常数项等比数列的公式，所以化为  
$x_n+C=a\times(x_{n-1}+C)\quad(C=\frac{b}{a-1})$  
$x_n=a\times x_{n-1}+C\times(a-1)$    
$$\begin{aligned}
x_n+\frac{b}{a-1}&=a\times(x_{n-1}+\frac{b}{a-1})\\&=a^2\times(x_{n-2}+\frac{b}{a-1})\\&...\\&=a^{n-1}(x_1+\frac{b}{a-1})\end{aligned}$$  
$\therefore x_n+\frac{b}{a-1}\equiv a^{n-1}\times(x_1+\frac{b}{a-1})(mod\;p)$  
在 $x_n=t$ 时，$a^{n-1}\equiv \frac{t+\frac{b}{a-1}}{x_1+\frac{b}{a-1}}(mod\;p)$   
令 $b'=\frac{t+\frac{b}{a-1}}{x_1+\frac{b}{a-1}}(mod\;p),\therefore a^{n-1}\equiv b'(mod\;p)$ BSGS去解即可     

⚠️：若 $(x_1+\frac{a−1}{b})≡0(mod\;p)$ ，我们不能取逆元直接求解，但是可以发现倒数第三步的 $a^{n−1}(x_1+\frac{b}{a-1})$ 在余 $p$ 时为 $0$，可以直接特判掉    

**思路总结** 等比数列公式可以化为 $x_n$ 与 $x_1$ 的关系  
因公比存在所以必定有一个幂次方且与 $n$ 有关  
$n$ 即是我们要求的值，指数有 $n$ 的话求指数    
问题即可使用BSGS解  

