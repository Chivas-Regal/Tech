---
key: 2021-07-16-扩展欧几里得
layout: article
title: 扩展欧几里得
subtitle: 求方程组？🤔
categories: 数学
tags: [数学]
aside:
  toc: true
sidebar:
  nav: docs-en
---

# 前置知识——欧几里得算法<br>
循环实现: <br>

```cpp
int gcd(int a, int b){
	int tmp;
	while(b){
		tmp = a % b;
		a = b;
		b = tmp;
	}
	return a;
}
```

递归实现<br>

```cpp
int gcd(int a, int b){
	return b == 0? a : gcd(b, a % b);
}
```

# 贝祖定理

## 定义
贝祖定理又称裴蜀定理 $(Bezouts\;identity)$<br>
对于任意的不全为 $0$ 的非负整数对 $a,b$ ，一定存在整数 $x,y$ 满足： $$a*x+b*y=(a,b)$$

## 证明
在 $exgcd$ 最后一步中， $(b=0)\Rightarrow (x = 1, y = 0)$ ，一定成立<br>
$b\ne 0$ 的时候<br>
假设 $x_0,y_0$ 是 $b\times x + (a \% b)  y = (a,b)$ 的一组解（下一步）<br>
即 $b * x_0 + (a \% b) \times y_0 = (a,b)$<br>
那么只要能证明 $a \times x_1 + b \times y_1 = (a,b)$ 成立即可（本步）<br><br><br>
易得 $a\%b=a-\left\lfloor\frac ab\right\rfloor\times b$ ，那么
$$\begin{aligned}&bx_0+(a-\left \lfloor \frac ab \right \rfloor \times b)\times y_0\\=& ay_0+b(x_0-\left \lfloor \frac ab \right \rfloor \times y_0)\\\Rightarrow&ax_1+by_1=(a,b)\qquad  (x_1=y_0,\quad y_1=x_0-\left \lfloor \frac ab \right \rfloor \times y_0)\end{aligned}$$<br>
**定理得证**<br><br>

## 通解的求法  

$$\begin{aligned}ax+by&=c\\y&=\frac{c-ax}{b}\end{aligned}$$  
我们设 $(x_0,y_0)$ 是一组已知解  
$x_1=x_0+n$  
那么  
$$\begin{aligned}
	y_1&=\frac{c-a(x_0-n)}{b}\\
	&=\frac{c-ax_0}{b}-\frac{a}{b}n\\
	&=y_0-\frac abn\\
	&=y_o-\frac{\frac{a}{(a,b)}}{\frac{b}{(a,b)}}n
\end{aligned}$$  
可知，当 $n\equiv0(mod\;\frac{b}{(a,b)})$ 解就一定存在  
即对于任意整数 $k$ ：  
$$\left\{\begin{aligned}x_1=x_0+k\frac b{(a,b)}\\y_1=y_0-k\frac a{(a,b)}\end{aligned}\right.$$

# 扩展欧几里得算法

## 代码思路
本质与欧几里得流程类似，都是个递归函数<br>
<ol>
<li style="color: orange;"><p style="color: black;">设置递归出口，即上面说的“最后一步”，同时做出最后一步的东西：`{x = 1, y = 0; return a;}`</p></li>
<li style="color: orange;"><p style="color: black;">递归的本质是欧几里得，所以`d = exgcd(b, a % b, x, y);`</p></li>
<li style="color: orange;"><p style="color: black;">回溯，利用上面裴蜀定理证明过程的到的公式： $x_1=y_0,\quad y_1=x_0-\left \lfloor \frac ab \right \rfloor y_0$ 后续遍历(回溯)求 $(x,y)$</p></li>
<li style="color: orange;"><p style="color: black;">我们即然求出来了 $(a,b)$ 那么就可以用它，在最后一步进行`return d;`，得到 $(a,b)$</p></li>
</ol>

## 程序

```
int ex_gcd(int a, int b, int &x, int &y){
	if(b == 0) { x = 1, y = 0;  return a; }//出口：最后一步的解
	int d = ex_gcd(b, a % b, x, y);
	
	//回溯出上一步的(x,y)
	int tmp = x;
	x = y;
	y = tmp - (a / b) * y;
	
	return d;
}
```

