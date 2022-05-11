---
title: 快速傅立叶变换
categories: 数学
tags: [数论]
aside:
  toc: true
---

## 前置知识

### 多项式系数表示法

$A(x)=a_0+a_1x+a_2x^2+\dots +a_nx^n$  
  
<b>系数表示法的好处<b>  
可以直接利用参数 $x$ 计算多项式值，即直接代入上式 $O(n)$ 地计算    

### 多项式点值表示法  
 
首先要知道一个定理：<mark>任意 $n+1$ 个不同点均可以确定一个 $n$ 次多项式</mark>  
::: tip
$$x_1\rightarrow x_{n+1}:\left\{\begin{aligned}
a_0&+a_1x_1+a_2x_1^2+\dots+a_nx_1^n=y_1\\
a_0&+a_1x_2+a_2x_2^2+\dots+a_nx_2^n=y_2\\
&\dots\\
a_0&+a_1x_n+a_2x_n^2+\dots+a_nx_n^n=y_n\\
a_0&+a_1x_{n+1}+a_2x_{n+1}^2+\dots+a_nx_{n+1}^n=y_{n+1}
\end{aligned}\right.$$  
$$\left(\begin{aligned}
&1&\quad&x_1&\quad&x_1^2&\quad&\dots&\quad&x_1^n&\\
&1&\quad&x_2&\quad&x_2^2&\quad&\dots&\quad&x_2^n&\\
&\dots&\\
&1&\quad&x_{n+1}&\quad&x_{n+1}^2&\quad&\dots&\quad&x_{n+1}^n&
\end{aligned}\right)=\prod\limits_{1\le i,j\le n+1}(x_i-x_j)\neq 0$$  
即使用了 $n+1$ 个特殊点，这个方程组用高斯消元便可以解
:::  
  
<b>点表示法的好处</b>    
$A(x)B(x)$ 有 $[0,n+m]$ 次，所以要取 $n+m+1$ 个点  
$A:(x_1,A(x_1)),(x_2,A(x_2)),\dots,(x_{n+m+1},A(x_{n+m+1}))$  
$B:(x_1,B(x_1)),(x_2,B(x_2)),\dots,(x_{n+m+1},B(x_{n+m+1}))$  
若求 $C(x_i),\;C(x_i)=A(x_i)B(x_i)$  
$\therefore C:(x_1,A(x_1)B(x_1)),(x_2,A(x_2)B(x_2)),\dots,(x_{n+m+1},A(x_{n+m+1})B(x_{n+m+1}))$  
时间复杂度 $O(nm)\rightarrow O(n+m)$  
  
### 卷积  

也就是多项式乘法  
对于系数分别为 $[a]$ 的多项式 $A$ 与系数分别为 $[b]$ 的多项式 $B$ ，其卷积出来的多项式 $C$ 的第 $k$ 项系数 $c_k$ 为  
$c_k=\sum\limits_{i+j=k}a_ib_j=\sum\limits_{i=0}^ka_ib_{k-i}$    
  
### 算法引导

我们得到两个系数表示法的多项式，想要卷积出来一个系数表示法的多项式，在乘法时可以借助点表示法去乘从而优化时间，但这样时间复杂度就卡在了系数表示法和点表示法互相转换上面，所以有一个前提  
系数表示法 $\stackrel{quick}{\rightleftharpoons}$ 点值表示法  
  
## 快速求点值  
  
### 复数与单位根

引入特殊点：复平面上的单位根    
  
<b>复数：</b>  
$a+bi$  
<img src="https://img-blog.csdnimg.cn/223ae1ee31c0442abd6f11fe6bb74bc1.png">    
运算：  
- 相加：$(a+bi)+(c+di)=(a+c)+(b+d)i$ ，平行四边形对角线
- 相乘：$(a+bi)(c+di)=(ac-bd)+(ad+bc)i$ ，向量长度为两向量长的乘积，复角为两向量复角的和

<b>单位根：</b>  
<img src="https://img-blog.csdnimg.cn/b99ffea1374f4512b9271c2c7ee2c557.png">  
将单位圆从 $x$ 轴 $n$ 等分，获得 $n$ 次单位根  
$e^{i\theta}=cos\theta+isin\theta$  
$\omega_n^k=cos(2\pi\frac kn)+i\sin(2\pi\frac kn)=e^{2\pi\frac kn i}$

  
### 单位根性质  
  
$1.\omega_n^k=\omega_{2n}^{2k}$  
::: tip
分成 $n$ 份第 $k$ 个和分成 $2n$ 份第 $2k$ 个是相同的
:::  
$2.\omega_n^{k+\frac n2}=-\omega_n^k$  
::: tip
相当于跨越了半个圆
:::
$3.\omega_n^k\omega_n^l=\omega_n^{k+l}$  
::: tip
可以代入欧拉公式证明  
$\omega_n^k=e^{2\pi\frac kni}$  
$\omega_n^l=e^{2\pi\frac lni}$  
$\omega_n^k\omega_n^l=e^{\frac 2\pi in(k+l)}=\omega_n^{k+l}$ 
:::  
  
其实之所以引入单位根也是因为这个特性，相乘等于系数相加，和 $x^ix^j=x^{i+j}$ 的特性一样  
  
## DFT

### 思想

$A(x)$ 系数：$(a_0,a_1,\dots,a_{n-1})$  
代入一组单位根： $(\omega_n^0,\omega_n^1,\dots,\omega_n^{n-1})$ 快速求出 $(A(\omega_n^0),A(\omega_n^1),\dots,A(\omega_n^{n-1}))$  
在 $A(x)$ 中看    
我们可以用分治的方式将其划分为两个相等的部分，对于每一部分求完直接合并  
  
$$\begin{aligned}
A(x)&=(a_0+a_2x^2+\dots+a_{n-2}x^{n-2})+(a_1x^1+a_3x^3+\dots+a_{n-1}x^{n-1})\\
&=(a_0+a_2x^2+\dots+a_{n-2}x^{n-2})+x(a_1+a_3x^2+\dots+a_{n-1}x^{n-2})
\end{aligned}$$    
  
这里即奇偶划分    
然后用 $x$ 表 $x^2$ 换元  
$A_1(x)=a_0+a_2x+a_4x^2+\dots+a_{n-2}x^{\frac n2-1}$  
$A_2(x)=a_1+a_3x+a_5x^2+\dots+a_{n-1}x^{\frac n2-1}$  
则 $A(x)=A_1(x^2)+A_2(x^2)$

### 方法

分类讨论一下    
  
$k\in[0,\frac n2)$  
$\begin{aligned}A(\omega_n^k)&=A_1((\omega_n^k)^2)+\omega_n^kA_2((x_n^k)^2)\\&=A_1(\omega_{\frac n2}^k)+\omega_n^kA_2(\omega_{\frac n2}^k)\end{aligned}$  
  
$k\in[\frac n2,n-1]$  
$\begin{aligned}
A(\omega_n^{k+\frac n2})=&A_1((\omega_n^{k+\frac n2})^2)+\omega_n^{k+\frac n2}((\omega_n^k)^2)\\
=&A_1(\omega_n^{2k+n})-\omega_n^kA_2(\omega_n^{2k+n})\\
=&A_1(\omega_n^{2k}\omega_n^n)-\omega_n^kA_2(\omega_n^{2k}\omega_n^n)\\
=&A_1(\omega_{\frac n2}^k)-\omega_n^kA_2(\omega_{\frac n2}^k)
\end{aligned}$
  
这样分类进行递归，时间复杂度为 $O(nlogn)$  
  
## IDFT

$(\omega_n^k,A(\omega_n^k))\quad A(x)=c_0+c_1x+\dots+c_{n-1}x^{n-1}$  
令 $y_k=A(\omega_n^k)$ ，则 $c_k=\sum\limits_{i=0}^{n-1}y_i(\omega_n^{-k})^i$  
原系数 $a_k=\frac{c_k}n$  
想快速求出上面的 $c_{[0,n-1]}$ ，可以把式子当做一个关于 $y$ 的多项式  
则 $B(x)=y_0+y_1x+\dots+y_{n-1}x^{n-1}$  
则 $c_k=B(\omega_n^{-k})$ 而 $B(\omega_n^{-k})$ 的一个个求解还需 $FFT$ 从而推出 $c_k$ 与 $A(x)$  
那么本质就是一遍 $FFT$ 推出点表示，再来一遍推出系数表示  
第一遍求 $A(\omega_n^0)\rightarrow A(x_n^{n-1})$  
第二遍求 $B(\omega_n^0)\rightarrow B(\omega_n^{-(n-1)})$  
  
$$\begin{aligned}
c_k &=\sum_{i=0}^{n-1} y_k\left(\omega_n^{-k}\right)^i \\
&=\sum_{i=0}^{n-1}\left(\sum\limits_{j=0}^{n-1} a_j\left(\omega_n^i\right)^j\right)\left(\omega_n^{-k}\right)^i \\
&=\sum_{i=0}^{n-1}\left(\sum\limits_{j=0}^{n-1} a_j\left(\omega_n^{j-k}\right)^i\right) \\
&=\sum_{j=0}^{n-1} a_j\left(\sum_{i=0}^{n-1}\left(\omega_{n}^{j-k}\right)^i\right)
\end{aligned}$$  
  
::: tip
令 $S(x)=1+x+x^2+\dots+x^n$  
则   
$$S(\omega_n^k):k\left\{\begin{aligned}
\neq 0&\quad &S(\omega_n^k)=1+\omega_n^k+\omega_n^{2k}+\dots+\omega_n^{(n-1)k}\\
&&\omega_n^k(S(\omega_n^k))=\omega_n^k+\omega_n^{2k}+\dots+\omega_n^0\\
&&(1-\omega_n^k)S=0\\
&&\because k\neq 0:\omega_n^k\neq 1\quad \therefore S=0\\
\\
=0 &&S(\omega_n^k)=S(1)=n
\end{aligned}\right.$$
:::  
  
$$=\sum\limits_{j=0}^{n-1}(S(\omega_n^{j-k}))$$  
  
::: tip
因为只有在 $j=k$ 时候不得 $0$ 会被记入后面是 $n$  
:::
 
$$\therefore =na_k$$  
  
## 蝴蝶变换  
  
由于 $FFT$ 本来就涉及很多实数运算，常数非常大，如果此时我们再使用递归的话常数会更大，考虑使用递推来实现  
写一组系数与递归后的系数进行对比：  
  
$$\begin{aligned}\underline{\overset{000}{a_{0}} \quad \overset{001}{a_{1}} \quad \overset{010}{a_{2}} \quad\overset{011}{a_3}}\quad&\underline{\overset{100}{a_4}\quad\overset{101}{a_5}\quad\overset{110}{a_6}\quad\overset{111}{a_7}} \\  
  \underline{a_{0} \quad a_{2}}\; \quad \underline{a_{4}\quad a_6}\;\quad &\underline{a_1\quad a_3}\quad \;\underline{a_5\quad a_7} \quad\\  
  \underset{000}{\underline{a_{0}}} \quad \underset{100}{\underline{a_{4}}} \quad \underset{010}{\underline{a_{2}}}\quad\underset{110}{\underline{a_6}}\quad&\underset{001}{\underline{a_1}}\quad\underset{101}{\underline{a_5}}\quad\underset{011}{\underline{a_3}}\quad\underset{111}{\underline{a_7}}\end{aligned}$$

发现最后一次操作后，下标与原下标互为翻转： $0001_2\rightarrow1000_2$  
  
那么我们可以先得出最后的序列，然后向上进行操作模拟递归的回溯操作  
用 $rev_i$ 代表将 $i$ 二进制翻转后的数   
$bit$ 为 $n+m$ 最多需要的二进制位数  
`rev[i] = (rev[i >> 1] >> 1) | (1 << (bit - 1))`  
  
## 程序  

已有最高次为 $n$ 的多项式 $A$ 的系数 $[a]$  
已有最高次为 $m$ 的多项式 $B$ 的系数 $[b]$  
求 $A*B=C$ 的所有系数  
  
```cpp
const int N = 3000010;
const double PI = acos(-1.0);

int n, m;
struct Complex { // 复数结构体
        double x, y;
        Complex friend operator + (Complex a, Complex b) { return {a.x + b.x, a.y + b.y}; }
        Complex friend operator - (Complex a, Complex b) { return {a.x - b.x, a.y - b.y}; }
        Complex friend operator * (Complex a, Complex b) { return {a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x}; }
} a[N], b[N]; // 两个多项式的点表示
int rev[N];   // 分治时候的二进制表示对应的结果二进制表示，即反过来了
int bit, tot; // 二进制上的位数，总个数

inline void FFT (Complex a[], int inv) {
        for (int i = 0; i < tot; i ++) if (i < rev[i]) swap(a[i], a[rev[i]]); // 变成正确的分治结果位置（只能换一半，防止换回来
        for (int mid = 1; mid < tot; mid <<= 1) { // 枚举分块的块长度
                Complex w1 = {cos(PI / mid), inv * sin(PI / mid)}; // 这也是把整个单位圆平均切成mid个后出现的 \omega^1
                for (int i = 0; i < tot; i += mid * 2) { // 两个两个块向后跳，枚举每一段
                        Complex wk = {1, 0}; // w(n, 0)单位一开始
                        for (int j = 0; j < mid; j ++, wk = wk * w1) { // 把区间里面数枚举一遍，且wk要往上跑一格
                                Complex x = a[i + j], y = wk * a[i + j + mid]; // x把左边提出，y把右边提出
                                a[i + j] = x + y, a[i + j + mid] = x - y;      // 左边和右边重构
                        }
                }
        }
}

int main() {
        cin >> n >> m;
        for (int i = 0; i <= n; i ++) cin >> a[i].x; // 把输入的系数塞入实部
        for (int i = 0; i <= m; i ++) cin >> b[i].x; // 把输入的系数塞入虚部
        while ((1 << bit) < n + m + 1) bit ++; // 次数最多到n+m+1，所以利用n+m+1记录二进制位数
        tot = 1 << bit; // 在二进制位数下计算刚好达不到的那个位数的数
        for (int i = 0; i < tot; i ++) rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1)); // 每个rev[i]初始化为i的二进制逆转
        FFT(a, 1); FFT(b, 1); // 完成a和b的点表示
        for (int i = 0; i < tot; i ++) a[i] = a[i] * b[i]; // 点表示法内完成两方程合并
        FFT(a, -1); // 逆向做一遍得到系数表示
        for (int i = 0; i <= n + m; i ++) cout << (int)(a[i].x / tot + 0.5) << " "; // 防止精度丢失，要向上0.5再强转扔精度
        return 0;
}
```