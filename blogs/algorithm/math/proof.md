---
key: 2021-08-27-数学推导
layout: article
title: 推导 & 证明
aside:
  toc: true
sidebar:
  nav: docs-en
---

- <a href="#Q1"><font size="4px">定理证明</font></a>
  - <a href="#Q1_1"><font size="4px">威尔逊定理变式：$\prod\limits_{x\in\{(p,n)=1\}}x\equiv\pm1(mod\;n)$</font></a>
  - <a href="#Q1_2"><font size="4px">和差化积：$\sin(\alpha\pm\beta)\;and\;\cos(\alpha\pm\beta)$</font></a>
- <a href="#Q2"><font size="4px">求递推式</font></a> 
  - <a href="#Q2_1"><font size="4px">$S_n=\left\lceil (a+\sqrt b)^n\right\rceil\%m$</font></a>
- <a href="#Q3"><font size="4px">时间复杂度化简</font></a>
  - <a href="#Q3_1"><font size="4px">$f(k)=\sum\limits_{i_1=L}^H\sum\limits_{i_2=L}^H...\sum\limits_{i_n=L}^H[gcd(i_1,i_2,...,i_n)=k]$</font></a>
<br /><br /><br /><br /><br /><br />

# <font size="6px" id="Q1">定理</font>
## <font size="6px" id="Q1_1"><b>威尔逊定理变式：$\prod\limits_{x\in\{(p,n)=1\}}x\equiv\pm1(mod\;n)$</b></font>

|$Thoughts$|$Solution$|
| --- | --- |
|问题转化|求证小n且与n互质的数的乘积模 $n$ 一定为 $1$ 或 $-1$|
|因为是乘积，又与1有关，所以想<mark>逆元</mark>|在 $x^2\not\equiv1(mod\;n)$ 时<br><mark>$x\neq inv(x)$</mark>，$\therefore\;x$ 与 $inv(x)$ 在数组中<mark>成对出现</mark>且乘积贡献为1<br />|
|特殊情况处理|在 $x^2\equiv1(mod\; n)$ 时<br><mark>$x=inv(x)$</mark><br>但同时 $(n-x)^2=n^2-nx+x^2\equiv x^2\equiv1(mod\;n)$<br />$\therefore$<mark>$\;n-x=inv(n-x)$</mark><br />在此时 $x$ 与 $n-x$ 也独立成对出现，乘积贡献为<span style="color: grey">$\boxed{x(n-x)=nx-x^2\equiv-1(mod\;n)}$</span>-1|
|得出结论|<span style="color: red;">在小于 $n$ 且与 $n$ 互质的数中，会产生若干对数<br>它们的乘积要么是 $1$ 要么是 $-1$ <br />所以累乘是 $1$ 或 $-1$ </span> |

# <font size="4px" id="Q1_2">和差化积：$\sin(\alpha\pm\beta)\;and\;\cos(\alpha\pm\beta)$</font>

|$Thoughts$|$Solution$|
|---|---|
|首先先证明<font style="color: red;">$\sin(\alpha+\beta)$</font>| $\begin{aligned}S_{\triangle ABC}&=S_{\triangle ABD}+S_{\triangle BDC}\\ab\sin(\alpha+\beta)&=ac\sin\alpha+bc\sin\beta\\\sin(\alpha+\beta)&=\frac cb\sin\alpha+\frac ca\sin\beta\\\sin(\alpha+\beta)&=\cos\beta\sin\alpha+\cos\alpha\sin\beta\end{aligned}$ | 
|$\sin(\alpha-\beta)$|$\begin{aligned}&\sin(\alpha-\beta)\\=&\sin(\alpha+(-\beta))\\=&\cos(-\beta)\sin\alpha+\cos\alpha\sin(-\beta)\\=&\cos\beta\sin\alpha-\cos\alpha\sin\beta\end{aligned}$|
|$\cos(\alpha+\beta)$|$\begin{aligned}&\cos(\alpha+\beta)\\=&\sin(90^{\circ}-\alpha-\beta)\\=&\sin((90^{\circ}-\alpha)+(-\beta))\\=&\cos(90^{\circ}-\alpha)\sin(-\beta)+\cos(-\beta)\sin(90^{\circ}-\alpha)\\=&-\sin\alpha\sin\beta+\cos\beta\cos\alpha\\=&\cos\beta\cos\alpha-\sin\beta\sin\alpha\end{aligned}$|
|$\cos(\alpha-\beta)$|$\begin{aligned}&\cos(\alpha-\beta)\\=&\cos(\alpha+(-\beta))\\=&\cos(-\beta)\cos\alpha-\sin(-\beta)\sin\alpha\\=&\cos\beta\sin\alpha+\sin\beta\sin\alpha\end{aligned}$|
    
# <font size="6px" id="Q2">递推式</font>
## <font size="6px" id="Q2_1"><b>$S_n=\left\lceil (a+\sqrt b)^n\right\rceil\%m$</b></font>

|$Thoughts$|$Solution$|
|---|---|
| 根据<mark>二项式定理</mark>，可以设计以下两个式子 | $(a+\sqrt b)^n=A_n+B_n\sqrt b$ <br /> $(a-\sqrt b)^n=A_n-B_n\sqrt b$ |
| 通过转换来的式子合并一下  | <mark>$(a+\sqrt b)^n+(a-\sqrt b)^n=2A_n$</mark><br>$(a+\sqrt b)^n=2A_n-(a-\sqrt b)^n$  |
|利用限制条件有| $\because a-1\lt \sqrt b\lt a$ <br /> $\therefore 0\lt a-\sqrt b\lt 0$ <br />  $\therefore (a+\sqrt b)^n=2A_n-(a-\sqrt b)^n\left\{\begin{aligned} &\lt 2A_n \\ &\gt 2A_n-1\end{aligned}\right.\Rightarrow \left\lceil(a+\sqrt b)^n\right\rceil=2A_n$ |
|得到新式| $\left\lceil(a+\sqrt b)^n\right\rceil=2A_n=(a+\sqrt b)^n+(a-\sqrt b)^n$ |
|代数转换|令 $x=a+\sqrt b,\quad y=a-\sqrt b$<br>则 $(a+\sqrt b)^n +(a-\sqrt b)^n=\;$<mark>$x^n+y^n=(x+y)(x^{n-1}+y^{n-1})-xy(x^{n-2}+y^{n-2})$</mark>|
|构造递推函数|令 $g(n)=x^n+y^n\quad x+y=2a\quad xy=a^2-b$ <br /> $\therefore\;$ <span style="color:red;"> $g(n)=2a\times g(n-1)-(a^2-b^2)\times g(n-2),\quad g(1)=2a,\quad g(0)=2$ </span>|

# <font size="6px" id="Q3">时间化简</font>
# <font size="6px" id="Q3_1"><b>$f(k)=\sum\limits_{i_1=L}^H\sum\limits_{i_2=L}^H...\sum\limits_{i_n=L}^H[gcd(i_1,i_2,...,i_n)=k]$</b></font>

|$Thoughts$|$Solution$|
| --- | ---|
|构建基础方程式|由变换式 $F(k)=\sum\limits_{k\mid d}f(d)\Rightarrow f(k)=\sum\limits_{k\mid d}\mu(\frac dk)F(d)$<br />构建 $F(k)=\sum\limits_{i_1'=L}^H\sum\limits_{i_2'=L}^H...\sum\limits_{i_n'=L}^H[k\mid gcd(i_1,i_2,...,i_n)]$|
|化简 $F(x)$|不去枚举不必要枚举的数，令<span style="color:blue;"> $i'=\frac ik$ </span>，即<mark>枚举倍数</mark><br />$\therefore F(k)=\sum\limits_{i_1'=\frac {L-1}k}^{\frac Hk}\sum\limits_{i_2'=\frac {L-1}k}^{\frac Hk}...\sum\limits_{i_n'=\frac {L-1}k}^{\frac Hk}1=(\left\lfloor \frac Hk\right\rfloor-\left\lfloor\frac {L-1}k\right\rfloor)^n$ <br /><span style="color: red">$L-1$是前缀和思想，向前取一位</span>|
|<mark>根据反演式进行变换</mark>|由 $f(k)=\sum\limits_{k\mid d}\mu(\frac dk)F(d)$<br>我们在枚举d时同样要枚举倍数<br />$\therefore$ 令 <span style="color: blue;">$d'=\frac dk$</span>，同时令 <span style="color: blue;">$L'=\frac {L-1}k,\;H'=\frac Hk$</span><br>则此时 $f(k)=\sum\limits_{d'=1}^{H'}\mu(d')F(d'k)$|
|化简 $f(x)$|$F(d'k)=(\left\lfloor\frac{H}{d'k}\right\rfloor-\left\lfloor\frac{L-1}{d'k}\right\rfloor)^n$<br />$f(k)=\sum\limits_{d'=1}^{H'}\mu(d')(\left\lfloor\frac{H'}{d}\right\rfloor-\left\lfloor\frac{L'}{d'}\right\rfloor)^n$|
