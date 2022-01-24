---
key: 2021-07-24-线性基
layout: article
title: 线性基
subtitle: XOR的压缩🤔
categories: 数学
tags: [数学]
aside:
  toc: true
sidebar:
  nav: docs-en
---

::: tip
导引问题：给出 $n$ 个数： $a_1, a_2, ..., a_n$ ，请问：<br>取其中的一些数进行<span style="color:red;">异或</span>操作，能否得到值 $Q_x$ ?
:::

## 前置知识：异或运算
### 性质
<span style="color: red;">相异为 $1$，相同为 $0$</span><br>
如果 $c=a\oplus b$ <br>
则有: $a\oplus c=b$ 和 $b\oplus c=a$ <br>

:::: tip
<b>小问题</b>  

$1.$ 给出 $2n + 1$ 个整数，除了 $1$ 个数外，其余 $2n$ 个数均成对出现，请编程找出这个单独的数<br>

::: details Answer
累异或，成对的都消掉了
::: 
$2.$ 有 $n + 1$ 个数组成的数列，包含 $1\to n$ 这 $n$ 种整数，也就是说，有一个数是重复出现的，求其值<br>
::: details Answer
解：异或整个数列异或( $1\to n$ )
:::
$3.$ 给出 $2n + 2$ 个整数，除 $2$ 个数外，其余 $2n$ 个数均成对出现，清编程找出这 $2$ 个不成对的数<br> 
::: details Answer
解：做两遍异或，两个单独的数将整个数列分为两大类
:::

::::

## 线性基
### 定义
对于一个数集 $\{A\}$，它的<span style="color:red;">线性基是一个最小的数集 $\{B\}$ </span>，使得A中任意一个数可以通过 $\{B\}$ 中的一些数<span style="color:red;">异或</span>得到<br><br>
对于一个数集，他可能存在不止一个线性基<br><br>
<mark>在某些涉及异或都操作中，线性基可以代替原集合，从而达到减小数据规模的目的</mark>
### 举例
对于一个集合 $A：\{4, 5, 6\}$<br>
它的线性基可以是：  
$1.\{6, 1, 2\}$<br>
$2.\{4, 1, 2\}$<br>
$3.\{5, 1, 3\}$<br>
$\dots$<br>

### 如何求线性基

通过线性代数的知识，求出极大线性无关组<br>

::: tip
$\because A:\;\{4, 5, 6\}\Longrightarrow \{110_2, 101_2, 100_2\}\\
100_2\leftrightarrow100_2,\\100_2 \oplus 110_2\leftrightarrow010_2,\\101_2\oplus100_2\leftrightarrow001_2.\\
\therefore B:\;\{100_2,\;010_x,\;001_2\}\Longrightarrow\{4, 2, 1\}$
:::

线性基的关键在于降低规模<br>
若 $X=a_{i1}\oplus a_{i2}\oplus ...\oplus a_{ik}$ ,则意味着 $X$ 可被其他已选的数表示，所以就去掉 $X$ （不把 $X$ 当作线性基元素）<br><br>
::: tip
<span style="color:red;">思考：</span>为什么要是求得的线性基<span style="color:red;">最高位不同</span>？<br>
::: details Answer
便于计算出 $X$ 是否能被现有的数表示。
:::

::: tip e.g.
问：$1、2、4$ 线性基能否表示 $7$ ？  
由于  
$1\rightarrow001_2$   
$2\rightarrow010_2$  
$4\rightarrow100_2$  
每一位来看，异或起来可以变成 $111_2=7$ 
:::
  
线性基的形式：  
$a[1]=1XXXXX$  
$a[2]=01XXXX$  
$a[3]=0001XX$  
$\dots$  
<span style="color:red;">为了方便，设置d[i]表示非0最高位为右数第i位的数  
$d[5]=1XXXXX$  
$d[4]=01XXXX$  
$d[2]=0001XX$  </span>  

```cpp
// 对于 a[1].a[2].....a[n] 的线性基
ll d[61];
for ( int i = 1; i <= n; i ++ ) { // 枚举这个序列
	ll x = a[i];
	for ( int j = 60; j >= 0; j -- ) {  // 从高位向下看看还需不需要再构造东西了
		if ( x & (1ll << j) ) { // 如果a[i]这一位是"1"
			if ( !d[j] ) { d[j] = x; break; } // 如果d[j]也没有构造过就构造一下
			else         x ^= d[j];           // 否则通过异或将这一位去掉
		}
	}
}
```

### 线性基的性质
线性基没有值为 $0$ 的元素 （ 因为 $0$ 在异或中不起作用 ）  
<span style="color:red;">线性基元素</span>中任意一个<span style="color: red;">都无法</span>通过另外的线性基元素异或得到  
<span style="color:red;">原集合</span>中任意一个<span style="color: red;">都可以</span>通过线性基中某些数异或得到  

### 问题解决 

#### $Question\_1$
回看导引问题   
::: details Answer
将这n个数求出线性基，将询问的值通过线性基后为0则表示可以表示，否则无法表示  

```cpp
inline bool check ( ll x ) {
	for ( int j = 60; j >= 0; j -- ) {
		if ( x & (1ll << j) ) {
			if ( !d[j] ) return false;
			else x ^= d[j];
		}
	}
	return (x == 0);
}
```
:::
  
    
#### $Question\_2$

给出 $n$ 个数，$a[1],a[2]...a[n]$ ,问取出其中一些数进行异或操作，能够得到的<span style="color: red;">最大</span>的数是多少  
::: details Answer
用最简形式的线性基异或  
1.将这 $n$ 个数求出线性基 $d[]$  
2.将答案初始化为 $0$  
3.从最高位向最低位查询，若当前答案该位（第$i$位）为 $0$ 且 $d[i]\neq 0$，则当前答案异或 $d[i]$  
4.所有位查询以后得到的答案就是最大值  

```cpp
inline ll Find ( ) {
	ll res = 0;
	for ( int i = 60; i >= 0; i -- ) {
		if ( ((1ll << i) & res) == 0 && d[i] ) res ^= d[i]; // 该位相反为1
	}
	return res;
}
```
:::
  
#### $Question\_3$
给出 $n$ 个数，$a[1],a[2]...a[n]$ ,问取出其中一些数进行异或操作，能够得到的<span style="color: red;">最小</span>的数是多少  
::: details Answer  
将这n个数求出线性基 $d[]$  
在构造线性基的过程中，若存在一个数插入线性基时插入失败，即插入后 $x=0$ ，那么最小值为 $0$   
若答案不为 $0$，则答案为最小可确定位所表示的 $d[i]$ ，即：从低位往高位看，如果一个位置的 $d[i]\neq0$，则答案就是该 $d[i]$  
:::
  
#### $Question\_4$  
给出 $n$ 个数，$a[1],a[2],...,a[n]$，问取出其中的一些数进行异或操作，能够得到的<span style="color: red;">第 $k$ 小的数</span>是多少(去重过)  
::: details Answer
求出最简线性基 $d[]$  
观察 $d[]$ ，我们只能在 $d[i]\neq0$ 时自由选择第 $i$ 位为 $0$ 或者为 $1$  
由于线性基无法异或出 $0$ ，特盘是否会出现异或为 $0$ 的情况，若出现则 $k-1$   
对于能够选择的位，我吗可以确定 $0$ 或者 $1$ 。那我们将 $k$ 二进制表示，若某一位为 $0$ ，则可以选择位的值置为 $0$，否则置为 $1$   
    
这里可以采用k的二进制去求：  
我们从 $d$ 下标 $0$ 开始往上照到第一个不为 $0$ 的线性基  
如果 $k$ 这一位是 $1$ ，就把找到的对应线性基异或进答案，否则就不异或进去  
然后 $k$ 整除 $2$ ，继续这一过程  
:::
