---
key: 2021-07-16-中国剩余定理
layout: article
title: 中国剩余定理
subtitle: 扩展：跳模数啊，空间跳跃？结果还不变？🤔
categories: 数学
tags: [数论]
aside:
  toc: true
sidebar:
  nav: docs-en
---
  

# 导引问题
求出一个x满足多个模线性方程  
例如：  
$$x\equiv2(mod\quad3)\\x\equiv3(mod\quad5)$$
# 经典问题 ———— 物不知数
“今有物，不知其数，三三数之余二，五五数之余三，七七数之余二，问物几何？”  ————《孙子算经》  
等价于求下面这个模线性方程组的正整数解  
$$x\equiv2(mod\quad3)\\x\equiv3(mod\quad5)\\x\equiv2(mod\quad7)$$  
问题分析：  
1.特殊的<span style="color:red;">线性同余方程组</span></br>（特殊点：<span style="color:red;">模数两两互质</span>）
2.中国剩余定理（孙子定理）
# 定义
若$m_1,m_2,...,m_n$是两两互质的正整数，则对于任意的n个整数$a_1,a_2,...,a_n$，同余方程组 $x\equiv a_i(mod\quad m_i)\quad i=1,2,...n$ 有正整数解，并且在模M下解唯一  
<span style="color:red;">构造</span>方程组的解为： $x=a_1M_1x_1+a_2M_2x_2+...+a_nM_nx_n$  
其中： $M=\prod m_i\quad,\quad M_i=\frac M{m_i}\quad,\quad x_i$ 是线性同余方程  
$M_ix_i\equiv1(mod\quad m_i)$ 的一个解（因为 $M_i$ 和 $m_i$ 互质，必有解）  
<span style="color: red;">问题转化</span>：求n个线性同余方程的公共解$x_i$  

```cpp
int ChineseRemain(int n){
	int Ans = 0, M = 1;
	for (int i = 1; i <= n; i ++) M *= m[i];
	for (int i = 1, Mi, xi, yi, d; i <= n; i ++){
		Mi = M / m[i];
		d = exgcd(Mi, m[i], xi, yi);
		Ans = (Ans + Mi * xi * a[i]) % M;
	}
	return (Ans + M) % M;
}
```
# 回顾经典 ———— 物不知数
m[1] = 3, m[2] = 5, m[3] = 7;  
a[1] = 2, a[2] = 3, a[3] = 2;  
M = 3 * 5 * 7 = 105;   
M1 = 5 * 7 = 35, M2 = 3 * 7 = 21, M3 = 3 * 5 = 15;  
exgcd -> x1 = 2, x2 = 1, x3 = 1;  
x = (2 * 35 * 2 + 3 * 21 * 1 + 2 * 15 * 1) % 105 = 233 % 105 = 23;  
问题的通解是： 23 + 105 * k  
# 一般情况
模数 $m_i$ 不保证两两互质，即进入到"中国剩余定理的一般情况"  
<ul>
<li><span style="color:red;">数学归纳法</span></li>
<li>假设已经求出前k-1个方程构成的方程组的一个解x  
记 $m=lcm(m_1,m_2,...,m_{k-1})$ , 则 $x+i*m$ 是前 $k-1$ 个方程的通解</br><span style="color:grey">此时 $x + im$ 依然是前 $k-1$ 个方程的解是因为在对m取模的情况下，加m的倍数得到的结果不变</span></li>
<li>同样的，考虑第k个方程，<span style="color: grey">求出一个合理的倍数t使得其成为第k个方程的解</span>，即 $x + t * m\equiv a_k(mod\quad m_k)$  
该方程等价于 $m*t\equiv a_k-x(mod\quad m_k)$ ，其中t是未知量。</li>
<li>可以判断是否有解，若有解，则可以用扩欧求出这个解。也就是说， $x'=x+t*m$ 就是前k个方程构成的方程组的一个解。</br>若无解，总方程无解。</li>
</ul>

```cpp
inline ll Ex_crt(){
        ll X = a[1], M = m[1];                //前一步的X，前一步的lcm
        for (ll i = 2, t, y; i <= n; i ++){
                ll gcd = Ex_gcd(M, m[i], t, y), miDIVgcd = m[i] / gcd; // 求得gcd，并使m[i]约分一下好乘进M里面
                ll c = (a[i] - X % m[i] + m[i]) % m[i];//ax≡c(mod b) 等式右侧的c，并让他变成可行的最小正整数
                if(c % gcd) return -1;
                t = ksc(t, c / gcd, miDIVgcd); // 因为扩欧求得的是等号右侧为gcd时的x解，而此时等号右端为c，需要让X乘上c/gcd个t，此时先给t变了再说


                X += t * M;
                M *= miDIVgcd; //计算LCM
                X = (X % M + M) % M; //保持最小正整数解
        }return X;
}
```
