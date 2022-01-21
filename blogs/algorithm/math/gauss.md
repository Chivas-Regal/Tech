---
key: 2021-08-23-高斯消元
layout: article
title: 高斯消元
subtitle: 用矩阵解方程？🤔
categories: 数学
tags: [数学]
aside:
  toc: true
sidebar:
  nav: docs-en
---

# 高斯消元的作用

高斯消元可以在 $n^3$ 的时间复杂度之内解一个  
$$\left\{\begin{aligned} 
&a_{11}x_1+a_{12}x_2+...+a_{1n}x_n=b_1 \\
&a_{21}x_1+a_{22}x_2+...+a_{2n}x_n=b_2 \\
&... \\
&a_{n1}x_1+a_{n2}x_2+...+a_{nn}x_n=b_n\end{aligned}\right.$$
  
这样的多元线性方程组  
解可以有无解、无穷多解、唯一解

# 矩阵

## 性质
  
将系数抽出成行列式
  
$$\left[\begin{matrix}
&a_{11}&a_{12}&...&a_{1n} \\
&a_{21}&a_{22}&...&a_{2n} \\
&...\\ &a_{n1}&a_{n2}&...&a_{nn}
\end{matrix}\right].$$  
  
下面这些变换是等价变换

$1.$  把某一行乘上一个非零数  
$2.$  交换某两行  
$3.$  把某行若干倍加到另一行上去  

## 目的

想变成

$$\left\{\begin{aligned} &a_{11}x_{1}&+a_{12}x_2&+...&+a_{1n}x_n&=b_1\\ &&a_{22}x_2&+...&+a_{2n}x_n&=b_2\\ &&&\;\quad...\\ &&&&\;\quad x_n&=b_n \end{aligned}\right.$$

这样一个上三角方程组形式  
那么就可以从最后一个已知的解一个个往上求得别的解

## 结果

1.完美的阶梯形：唯一解   
2.不完美阶梯形：$$\left\{\begin{aligned} &0=非0：&无解\\ &0=0：&无穷解 \end{aligned}\right.$$

# 行列式

## 行列式定义

一个$n$阶方阵也就是 $A$ 行列式的值记为 $det(A)$ 或 $|A|$  
$$det(A)=\sum\limits_P(-1)^{inv(P)}\prod\limits_iA_{1,P_1}...A_{n,P_n}$$  
$P=permutation(1...n)$  
$inv$是当前排列$P$的逆序对数量


## 行列式性质 

$1.$ 交换行列式两行(列)，行列式的值<span style="color: red;">变号</span>  
$2.$ 一个上三角行列式的值是<span style="color: red;">主对角线的累乘</span>  
$3.$ 行列式一行(列)乘或除任意数值不影响整个行列式的值  
$4.$ 行列式一行(列)减去另一行(列)后不影响整个行列式的值


# 例方程组与过程

$Question:$ 解方程
$$\left\{\begin{aligned}
&x_1+2x_2-x_3=-6\\
&2x_1+x_2-3x_3=-9\\
&-x_1-x_2+2x_3=7
\end{aligned}\right.$$

抽出系数矩阵  
$$\left[\begin{matrix}
&1&2&-1&6\\
&2&1&-3&-9\\
&-1&-1&2&7
\end{matrix}\right].$$
  

**高斯消元：**  

枚举每一列c  
$1.$  找到当前列绝对值最大一行 
$2.$  将该行换到最上面  
$3.$  将该行第一个数变成1 
$4.$  将下面所有行的当前列消为0    
向上消元，将每一列只保留前面的1，后面的消为0 
   

$$
\left[\begin{matrix}
&2&1&-3&-9\\
&1&2&-1&6\\
&-1&-1&2&7
\end{matrix}\right].
\Rightarrow
\left[\begin{matrix}
&1&\frac12&-\frac32&-\frac92\\
&1&2&-1&-6\\
&-1&-1&2&7
\end{matrix}\right].
\stackrel{\begin{aligned}
row_3+row_2\\
row_2-row_1\end{aligned}}
{\Rightarrow}\left[\begin{matrix}
&1&\frac12&-\frac32&-\frac92\\
&0&\frac32&\frac12&-\frac32\\
&0&-\frac12&\frac12&\frac52
\end{matrix}\right].$$  

$$\left[\begin{matrix} &1&\frac12&-\frac32&-\frac92\ &0&\frac32&\frac12&-\frac32\\ &0&-\frac12&\frac12&\frac52 \end{matrix}\right]. \Rightarrow \left[\begin{matrix} &1&\frac12&-\frac32&-\frac92\\ &0&1&\frac13&-1\\ &0&-\frac12&\frac12&\frac52 \end{matrix}\right]. \stackrel{row_3+\frac{row_2}2}{\Rightarrow} \left[\begin{matrix} &1&\frac12&-\frac32&-\frac92\\ &0&1&\frac13&-1\\ &0&0&\frac23&2 \end{matrix}\right].$$  

$$\left[\begin{matrix}&1&\frac12&-\frac32&-\frac92\\&0&1&\frac13&-1\\&0&0&\frac23&2\end{matrix}\right].\Rightarrow \left[\begin{matrix}&1&\frac12&-\frac32&-\frac92\\&0&1&\frac13&-1\\&0&0&1&3\end{matrix}\right].$$  

$$\left[\begin{matrix} &1&\frac12&-\frac32&-\frac92\\ &0&1&\frac13&-1\\ &0&0&1&3 \end{matrix}\right]. \stackrel{row_2-\frac{row_3}3}{\Rightarrow} \left[\begin{matrix} &1&\frac12&-\frac32&-\frac92\\ &0&1&0&-2\\ &0&0&1&3 \end{matrix}\right]. \stackrel{row\_1-\frac{row_2}3}{\Rightarrow} \left[\begin{matrix} &1&0&-\frac32&-\frac72\\ &0&1&0&-2\\ &0&0&1&3 \end{matrix}\right]. \stackrel{row_1-\frac{3*row_3}2}{\Rightarrow} \left[\begin{matrix} &1&0&0&1\\ &0&1&0&-2\\ &0&0&1&3 \end{matrix}\right].$$      

解得方程：$(x_1,x_2,x_3)=(1,-2,3)$

# 三类高斯消元  

## 实数解方程  

实数解方程就按上面的步骤即可  
每次提出来最大的放到上面然后将下面的一列全消掉  
最后再反着消一遍即可  

```cpp
inline int Gauss () {
        int c, r;
        for ( c = 0, r = 0; c < n; c ++ ) {
                int t = r;
                for ( int i = r; i < n; i ++ ) if ( fabs(a[i][c]) > fabs(a[t][c]) ) t = i;
                if ( fabs(a[t][c]) < eps ) continue;
                for ( int i = c; i <= n; i ++ ) swap(a[r][i], a[t][i]);
                for ( int i = n; i >= c; i -- ) a[r][i] /= a[r][c];
                for ( int i = r + 1; i < n; i ++ ) 
                        if ( fabs(a[i][c]) > eps )
                                for ( int j = n; j >= c; j -- ) a[i][j] -= a[r][j] * a[i][c];
                r ++;
        }
        if ( r < n ) {
                for ( int i = r; i < n; i ++ )
                        if ( fabs(a[i][n]) > eps ) return 2;
                return 1;
        }
        for ( int i = n - 1; i >= 0; i -- ) 
                for ( int j = i + 1; j < n; j ++ )
                        a[i][n] -= a[j][n] * a[i][j];
        return 0;
}
```

## 整数解方程  

整数解方程不一样的地方在于不能直接除了  
而是应该以另一种手段将  $a_{ij}$ 通过 $a_{ii}$  变成 $0$   
可以将  $a_{ii}$ 和  $a_{ij}$ 都变成 $lcm(a_{ii},a_{ij})$ （注意同行里面别的也要乘对应要乘的数  
然后再进行两行相减即可  

```cpp
inline int Gcd ( int a, int b ) { return b ? Gcd ( b, a % b ) : a; }
inline void Gauss () {
        for ( int r = 0, c = 0; c < n; c ++ ) {
                int t = r;
                for ( int i = r; i < n; i ++ ) if ( abs(A[i][c]) > abs(A[t][c]) ) t = i;
                if ( A[t][c] == 0 ) continue;
                swap ( A[r], A[t] ); 
                for ( int i = 0; i < n; i ++ ) {
                        if ( i == r ) continue;
                        if ( A[i][c] ) {
                                int t1 = A[i][c] / Gcd ( A[i][c], A[r][c] );
                                int t2 = A[r][c] / Gcd ( A[i][c], A[r][c] );
                                for ( int j = 0; j < n; j ++ ) 
                                        A[r][j] *= t1, 
                                        A[i][j] = A[i][j] * t2 - A[r][j];
                        }
                }
                r ++;
        }
}
```

## 整数解行列式

高斯消元可以将一个行列式<mark>主对角线下面的部分解成全部是0</mark>的情况   
在这里我们要完整地解出一个全部都是整数的行列式的整数值  
由于辗转相除法是可以将第二个元素消到$0$，所以可以<mark>结合辗转相除法</mark>使用  
对于一个我们想要通过第$A_{jj}$个单位消到$0$的单位$A_{ij}$  
我们可以只考虑他们两个，但是由于操作时为了保证行列式值的正确性我们要<span style="color: red;">操作整行</span>  
所以记录一下$A_{jj}$除$A_{ij}$后向下取整后的值$d$，对于这个两个我们让$A_{jj}-=A_{ij}\times d$便可实现取模操作，然后对于这两行每一列的两个单位进行同样的操作  
最后再互换一下，直到我们要消的元素变成0为止


```cpp
inline int Gauss ( int n ) {
	int res = 1;
	for ( int i = 1; i <= n; i ++ ) { // 在(i, i)上进行消元
		for ( int ii = i + 1; ii <= n; ii ++ ) { // 将(ii, i)变成0
			while ( a[ii][i] ) { // 还没有消到 0
				int d = a[i][i] / a[ii][i];
				for ( int j = i; j <= n; j ++ )
					a[i][j] = (a[i][j] - (ll)d * a[ii][j] % mod + mod) % mod,
					swap ( a[i][j], a[ii][j] );
				res = -res; // 行(列)互换最后的值要相反
			}
		}
		res = (ll)res * a[i][i] % mod; // 乘对角线
		if ( res == 0 ) return 0;
	}
	return (res % mod + mod) % mod;
}
```

# 例题

**洛谷P4035_球形空间产生器**  
[题目地址](https://www.luogu.com.cn/problem/P4035)  
[题解地址](https://github.com/Chivas-Regal/ACM/blob/main/Code/%E6%95%B0%E5%AD%A6/%E7%BA%BF%E6%80%A7%E4%BB%A3%E6%95%B0/%E9%AB%98%E6%96%AF%E6%B6%88%E5%85%83/%E7%90%83%E5%BD%A2%E7%A9%BA%E9%97%B4%E4%BA%A7%E7%94%9F%E5%99%A8.md)  
  
**洛谷P7112_行列式求值**  
[题目地址](https://www.luogu.com.cn/problem/P7112)  
[题解地址]()   
  
**洛谷P1092_虫食算**  
[题目地址](https://www.luogu.com.cn/problem/P1092)  
[题解地址]()   

