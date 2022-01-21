---
key: 2021-05-30-矩阵ksm
layout: article
title: 矩阵ksm
subtitle: 递推式还能跑ksm？🤔
categories: 数学
tags: [数学]
aside:
  toc: true
sidebar:
  nav: docs-en
---

>思考问题：    
>一个基础的斐波那契数列公式：$f_{i} = f_{i - 1} + f_{i - 2}$  
>如果求 $n = 1e9(mod)$ 的项，该如何求？  

# 📕前置芝士
## 🎈ksm

基于一种分块模式的双向累乘  
将时间复杂度优化为$O(logn)$  
***默认搜到此篇均会ksm，所以不细讲了，如果不会请去提前了解***  

```cpp
inline ll ksm(ll a, ll b, ll mod){
		ll res = 1;
		while(b){
				if(b & 1) res = res * a % mod;
				a = a * a % mod;//底数平方
				b >>= 1;//指数减半
		}return res;
}
```
## 🎈矩阵乘法

一个$m\times n$的矩阵$A(m,n)$左乘一个$n\times p$的矩阵$B(n,p)$会得到一个$m\times p$的矩阵$C(m,p)$  
结果是一个$m$行$p$列的矩阵，其中第$i$行第$j$列位置上的数为：第一个矩阵第$i$行上的$n$个数与第二个矩阵第$j$列上的$n$个数对应相乘后所得的$n$个乘积之和  
  
<table>
    <tr>
        <td>$A[1][1]$</td><td>$A[1][2]$</td><th rowspan="2">$\times$</th><td>$B[1][1]$</td><td>$B[1][2]$</td><th rowspan="2">$=$</th><td>$A[1][1]\times B[1][1]+A[1][2]\times B[2][1]$</td><td>$A[1][1]\times B[1][2]+A[1][2]\times B[2][2]$</td>
    </tr>
    <tr>
        <td>$A[2][1]$</td><td>$A[2][2]$</td><td>$B[2][1]$</td><td>$B[2][2]$</td><td>$A[2][1]\times B[1][1]+A[2][2]\times B[2][1]$</td><td>$A[1][2]\times B[1][2]+A[2][2]\times B[2][2]$</td>
    </tr>
</table>

**特点**  
满足结合律和分配律，不满足交换律  
只有当矩阵$A$的列数与矩阵$B$的行数相等时，矩阵$A\times B$才有意义  
  
# 📕概述
## 🎈概念&用处

矩阵$ksm$是一种将递推式转化为矩阵乘法形式，然后与$ksm$一样优化时间的算法。  

## 🎈过程

因为递推式一般都有个初始值  
所以形似给你一个数$x$，算它乘上$b$次$a$后的值，这样就是求$x \times  ksm(a, b)$  
所以矩阵$ksm$的流程便是：  
$1.$构造初始矩阵  
$2.$构造连乘矩阵  
$3.$建立矩阵乘法运算  
$4.$建立ksm运算  
$5.$利用第一行求答案  

虽然看着很麻烦，但是可以对流程分一下块：  
$（1）$就是对初始值的一种判定构造  
$（2）$就是对我们的递推式进行转换  
$（3，4）$就是为我们的矩阵ksm建立基础，可以在矩阵结构体内完成  
$（5）$就是求答案  

# 📕建立思想

## 😄Fibonacci

构造出$f_{n} = f_{n - 1} + f_{n - 2}$的B矩阵  
<table>
    <tr>
        <th>$C[n]$</th><th rowspan="3">$=$</th><th colspan="2">$B$</th><th rowspan="3">$\times$</th><th>$C[n-1]$</th><th rowspan = "3">$=...= B^{n - 1} \times $</th><th>$C[1]$</th>
    </tr>
    <tr>
        <td>$f[n]$</td><td>$1$</td><td>$1$</td><td>$f[n - 1]$</td><td>$f[1]$</td>
    </tr>
    <tr>
        <td>$f[n-1]$</td><td>$1$</td><td>$0$</td><td>$f[n - 2]$</td><td>$f[0]$</td>
    </tr>
</table>

这里   
$C$矩阵也称“竖矩阵”，用处就是保存所求递推结果。  
$B$矩阵也称：递推矩阵”，用处就是与$ksm$结合加速递推。  

易得$C_{n} = B \times C_{n - 1} = B \times B \times C_{n - 2} =...= B^{n - 1} \times C_{1}$，且$f[n - 1]$也可以由B同行矩阵从上一次的$C[n - 1]$中获取  
从而要求$f[n]$可以利用快速幂运算先求出$B^{n - 1}$，最后再做一次矩阵乘法即可（矩阵$C$的第一个元素即为要求的$f[n]$）  

## 😄含系数递推式
 
与上个类似，但是会更普遍一些  
$f_{n} = a \times f_{n - 1} + b \times f_{n - 2}$  
B矩阵为  

<table>
    <tr>
        <td>$a$</td><td>$b$</td>
    </tr>
    <tr>
        <td>$1$</td><td>$0$</td>
    </tr>
</table>

## 😄跳系数递推式
构造$f_{n} = 3 \times f_{n - 1} + 5 \times f_{n - 3} + 9 \times f_{n - 4}$的B矩阵  
可视为连续，只不过中间跳过的系数为$0$而已  
<table>
<tr>
<td>$3$</td><td>$0$</td><td>$5$</td><td>$9$</td>
</tr>
<tr>
<td>$1$</td><td>$0$</td><td>$0$</td><td>$0$</td>
</tr>
<tr>
<td>$0$</td><td>$1$</td><td>$0$</td><td>$0$</td>
</tr>
<tr>
<td>$0$</td><td>$0$</td><td>$1$</td><td>$0$</td>
</tr>
</table>

## 😄带常量递推式 
构造$f_{n} = a \times f_{n - 1} + b \times f_{n - 3} + c$的矩阵运算  

<table>
<tr>
<td>$f[n]$</td><th rowspan="4">$=$</th><td>$a$</td><td>$0$</td><td>$b$</td><td>$1$</td><th rowspan="4">$\times$</th><td>$f[n-1]$</td><th rowspan="4">$=$</th><td>$a$</td><td>$0$</td><td>$b$</td><td>$1$</td><td rowspan="4" valign="top">^$(n-2)$</td><th rowspan="4">$\times $</th><td>$f[2]$</td>
</tr>
<tr>
<td>$f[n-1]$</td><td>$1$</td><td>$0$</td><td>$0$</td><td>$0$</td><td>$f[n-2]$</td><td>$1$</td><td>$0$</td><td>$0$</td><td>$0$</td><td>$f[1]$</td>
</tr>
<tr>
<td>$f[n-2]$</td><td>$0$</td><td>$1$</td><td>$0$</td><td>$0$</td><td>$f[n-3]$</td><td>$0$</td><td>$1$</td><td>$0$</td><td>$0$</td><td>$f[0]$</td>
</tr>
<tr>
<td>$c$</td><td>$0$</td><td>$0$</td><td>$0$</td><td>$1$</td><td>$c$</td><td>$0$</td><td>$0$</td><td>$0$</td><td>$1$</td><td>$c$</td>
</tr>
</table>

## 😄带变量递推式
构造$f_{1} = 1,\qquad f_{2} = 2,\qquad f_{n} = f_{n - 1} + 2 \times f_{n - 2} + n^3$的矩阵运算  
写函数来表示变量，此情况可以利用二项式定理：$n^3 = (n - 1 + 1)^3 = (n - 1)^3 + 3 \times (n - 1)^2 + 3 \times (n - 1) + 1$  

<table>
<tr>
<td>$f[n]$</td><th rowspan="6">$=$</th><td>$1$</td><td>$2$</td><td>$1$</td><td>$3$</td><td>$3$</td><td>$1$</td><td rowspan="6" valign="top">^$(n-2)$</td><td>$f[2]$</td>
</tr>
<tr>
<td>$f[n-1]$</td><td>$1$</td><td>$0$</td><td>$0$</td><td>$0$</td><td>$0$</td><td>$0$</td><td>$f[1]$</td>
</tr>
<tr>
<td>$n^3$</td><td>$0$</td><td>$0$</td><td>$1$</td><td>$3$</td><td>$3$</td><td>$1$</td><td>$8$</td>
</tr>
<tr>
<td>$n^2$</td><td>$0$</td><td>$0$</td><td>$0$</td><td>$1$</td><td>$2$</td><td>$1$</td><td>$4$</td>
</tr>
<tr>
<td>$n$</td><td>$0$</td><td>$0$</td><td>$0$</td><td>$0$</td><td>$1$</td><td>$1$</td><td>$2$</td>
</tr>
<tr>
<td>$1$</td><td>$0$</td><td>$0$</td><td>$0$</td><td>$0$</td><td>$0$</td><td>$1$</td><td>$1$</td>
</tr>
</table>

上例中$f_{n} = f_{n - 1} + 2 \times f_{n - 2} + n^3 + n^2$，可以二项式完再合并同类项   

## 😄求数列区间和

$f_{0} = f_{1} = f_{2} = 1,\qquad f_{n} = f_{n - 1} + f_{n - 2} + f_{n - 3}$，  给定a,b求$(f_{a} + f_{a + 1} +...+ f_{b})\quad mod\quad (1e9+7)$ ，可转化为求前缀和$S_{n}$  

<table>
<tr>
<td>$S[n]$</td><th rowspan="4">=</th><td>$1$</td><td>$1$</td><td>$1$</td><td>$1$</td><th rowspan="4"></th><td>$S[n-1]$</td><th rowspan="4">=</th><td>$1$</td><td>$1$</td><td>$1$</td><td>$1$</td><td rowspan="4" valign="top">$\^(n-2)$</td><td>$S[2]$</td>
</tr>
<tr>
<td>$f[n]$</td><td>$0$</td><td>$1$</td><td>$1$</td><td>$1$</td><td>$f[n-1]$</td><td>$0$</td><td>$1$</td><td>$1$</td><td>$1$</td><td>$f[2]$</td>
</tr>
<tr>
<td>$f[n-1]$</td><td>$0$</td><td>$1$</td><td>$0$</td><td>$0$</td><td>$f[n-2]$</td><td>$0$</td><td>$1$</td><td>$0$</td><td>$0$</td><td>$f[1]$</td>
</tr>
<td>$f[n-2]$</td><td>$0$</td><td>$0$</td><td>$1$</td><td>$0$</td><td>$f[n-3]$</td><td>$0$</td><td>$0$</td><td>$1$</td><td>$0$</td><td>$f[0]$</td>
</table>

## 😄平方前缀和并含乘法项的表达式
$f_{0} = 1,\qquad f_{1} = 1,\qquad f_{n} = x \times f_{n - 1} + y \times f_{n - 2}$，求$S_{n} = \sum_{i = 0} ^ {n}(a_{i}^2)$  
先平方展开：$f_{n}^2 = x^2 \times f_{n - 1}^2 + 2 \times x \times y \times f_{n - 1} \times f_{n - 2} + y^2 \times f_{n - 2}^2$  
  
<table>
<tr>
<td>$S[n]$</td><th rowspan="4">=</th><td>$1$</td><td>$x^2$</td><td>$2\times x\times y$</td><td>$y^2$</td><th rowspan="4"></th><td>$S[n-1]$</td><th rowspan="4">=</th><td>$1$</td><td>$x^2$</td><td>$2\times x\times y$</td><td>$y^2$</td><td rowspan="4" valign="top">$\^(n-1)$</td><td>$S[1]$</td>
</tr>
<tr>
<td>$f[n]^2$</td><td>$0$</td><td>$x^2$</td><td>$2\times x\times y$</td><td>$y^2$</td><td>$f[n-1]^2$</td><td>$0$</td><td>$x^2$</td><td>$2\times x\times y$</td><td>$y^2$</td><td>$f[1]^2$</td>
</tr>
<tr>
<td>$f[n]\times f[n-1]$</td><td>$0$</td><td>$x$</td><td>$y$</td><td>$0$</td><td>$f[n]\times f[n-2]$</td><td>$0$</td><td>$x$</td><td>$y$</td><td>$0$</td><td>$f[1]\times f[0]$</td>
</tr>
<td>$f[n-1]^2$</td><td>$0$</td><td>$1$</td><td>$0$</td><td>$0$</td><td>$f[n-2]^2$</td><td>$0$</td><td>$1$</td><td>$0$</td><td>$0$</td><td>$f[0]^2$</td>
</table>

## 😄应用

一个$01$循环串，长度为$L（L\le100)$，这个擦混每秒都会进行一次变换，变换规则是：如果左边是$1$，则改变自己的状态，否则保持不变。给定初始状态，问$n$秒以后这个串状态  
状态转移方程：定义$f_{(n,l)}$表示n秒以后，第$l$个字符是$0$还是$1$。  

$f_{(n, l)} =$
$\begin{aligned}
f_{(n - 1, l)},  & \text{f{(n - 1, l - 1)} = 0} \\
1 - f_{(n - 1, l)}, & \text{f{(n - 1, l - 1)} != 0}
\end{aligned}$  
根据同余性质化简得： $f_{(n, l)} = f_{(n - 1, l - 1)} + f_{(n - 1, l)}$  
然后根据这个递推式构造矩阵即可  

# 📕程序实现
## 🎈主功能建立

```cpp
//其实主功能就是一个Matrix的结构体
const int maxn = /*...*/;
const int mod = /*...*/;
struct Mat{
    ll m[maxn][maxn];//j矩阵
    Mat(int flag = 0){//初始化构造函数
        for(int i = 0; i < maxn; i ++)
            for(int j = 0; j < maxn; j ++){
                m[i][j] = flag * (i == j);
            }
    }
    inline Mat Mul(Mat a, Mat b){//矩阵乘法
        Mat res(0);
        for(int i = 0; i < maxn; i ++){
            for(int j = 0; j < maxn; j ++){
                for(int k = 0; k < maxn; k ++){
                    res.m[i][j] = (res.m[i][j] + a.m[i][k] * b.m[k][j] % mod) % mod;
                }
            }
        }
        return res;
    }
    inline Mat ksm(Mat a, ll b){//矩阵的ksm实现
        Mat res(1);
        while(b){
            if(b & 1) res = Mul(res, a);
            a = Mul(a, a);
            b >>= 1;
        }return res;
    }
};
```
## 🎈题目演示  

[luogu《矩阵加速（数列）模板》传送门](https://www.luogu.com.cn/problem/P1939)  
![在这里插入图片描述](https://img-blog.csdnimg.cn/20210602004901502.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L1Nub3B6WXo=,size_16,color_FFFFFF,t_70)  
  
**思路：**   
一个跳系数的递推式  
建立矩阵结构体  
建立B矩阵  
建立初始矩阵  
运算得B矩阵的幂  
利用第一行得出答案  

**代码：**  

```cpp
const int maxn = 3;
const int mod = 1e9 + 7;

struct Mat{
    ll m[maxn][maxn];
    Mat(int flag = 0){
        for(int i = 0; i < maxn; i ++)
            for(int j = 0; j < maxn; j ++){
                m[i][j] = flag * (i == j);
            }
    }
    inline Mat Mul(Mat a, Mat b){
        Mat res(0);
        for(int i = 0; i < maxn; i ++){
            for(int j = 0; j < maxn; j ++){
                for(int k = 0; k < maxn; k ++){
                    res.m[i][j] = (res.m[i][j] + a.m[i][k] * b.m[k][j] % mod) % mod;
                }
            }
        }
        return res;
    }
    inline Mat ksm(Mat a, ll b){
        Mat res(1);
        while(b){
            if(b & 1) res = Mul(res, a);
            a = Mul(a, a);
            b >>= 1;
        }return res;
    }
};

/*
a[i]       1 0 1    a[i - 1]
a[i - 1]   1 0 0    a[i - 2]
a[i - 2]   0 1 0    a[i - 3]
*/

inline void solve(){
    int n; cin >> n;
    if(n == 1 || n == 2 || n == 3){
        cout << 1 << endl;
        return;
    }

    Mat cur(0);//B矩阵
    cur.m[0][0] = 1, cur.m[0][1] = 0, cur.m[0][2] = 1;
    cur.m[1][0] = 1, cur.m[1][1] = 0, cur.m[1][2] = 0;
    cur.m[2][0] = 0, cur.m[2][1] = 1, cur.m[2][2] = 0;
    
    cur = cur.ksm(cur, n - 3);//ksm运行
    cout << (cur.m[0][0] * 1 + cur.m[0][1] * 1 + cur.m[0][2] * 1) % mod << endl;//第一行与初始的竖矩阵运行的结果
}

CHIVAS{
        int cass;
        EACH_CASE(cass){
            solve();
        }
        _REGAL;
}
```
