---
key: 2021-05-28-生成函数
layout: article
title: 生成函数
aside:
  toc: true
sidebar:
  nav: docs-en
---

>思考问题：
>如果有10种不同颜色的球各一个，从中取两个，不同的取球方案是多少？
>简单的排列组合问题，很轻松就能$C_{10}^2$ = 45
>但如果换一种问题，有面值1、2、3、4、5、...、99、100元的硬币各一枚，那么有多少种组成方案？

# 😄普通型母函数

## 📕前置芝士

### 🎈幂相乘

幂次相乘 = 指数相加  
$x^{a} * x^{b} = x^{a + b}$  

### 🎈Hash

将某个数存入某个地址内从而完成某种映射关系，并可以$O(1)$的时间内查找到和进行操作  
母函数算法某种程度上利用了hash的，了解hash可以更深刻地理解该算法  
[Hash传送门](https://blog.csdn.net/SnopzYz/article/details/116141690)  

## 📕概述

### 🎈概念 & 用处

母函数分为普通型母函数与指数型母函数  
普通型母函数用于解决多重集的组合问题  
指数型母函数用于解决多重集的排列问题  
  
在某种意义上可以联系起来背包问题进行思考  
两者有互通之处但同时又能解决两种不同的问题  
  
我们定义一个序列$a_0、a_1、a_2、...$并构造一函数  
$G_x = a_0 + a_1x + a_2x^2 + ...$  
则称$G_x$是序列$a_0、a_1、a_2、...$的母函数  
  
同时如果已知函数$G_x = (1 + x)^2$  
则在展开后可以得到$G_x = 1 + 2x + x^2$  
则有该函数是序列$1、2、1$的母函数  
  
### 🎈构造表示 

例如我们规定：有1元硬币，3元硬币，5元硬币，问都可以构造出来什么数值  
我们利用以下规则：  
每一种硬币都为一个小括号内的多项式  
同时将硬币面值x作为指数（从0开始，x^1^，x^2^，...）  
  
在这里我们构建1元硬币的多项式：$1 + x + x^2 + x^3 + x^4 + x^5 + ...$，  
我们能很轻松发现1元硬币能构造出的数值为0、1、2、3、4、5、...  
构建3元硬币的多项式：$1 + x^3 + x^6 + x^9 + ...$，  
我们可以发现3元硬币构造出的数值为0、3、6、...  
构建五元硬币的多项式：$1 + x^5 + x^{10} + ....$，  
得到数值0、5、10、...  
  
在得到所有硬币能构造出来的数值时，我们利用这几个多项式相乘  
$(1 + x + x^2 + x^3 + x^4 + x^5 + ...) * (1 + x^3 + x^6 + x^9 + ...) * (1 + x^5 + x^{10} + ....) = 1 + x^1 + x^2 + 2x^3 + 2x^4 + 3x^5 + 4x^6 + 4x^7 + 5x^8 + 6x^9 + 7x^{10} + .....$  
$bx^a$表示有b种不同的方法能构造出来数值a  
其中每一种情况都能有对应的结果，但同时不同的情况构造出来同样的数值时，这两种情况又会累加，所以我们可以得到都能构建出什么数值，与构建出来某种数值有几种方法  
  
### 🎈过程

建立两个数组c1，c2，c1~i~表示前面括号合并后指数i的系数，c2~i~表示下一个准备合并的括号的指数i的系数  
1.初始化第一个多项式  
2.多项式两两合并（括号的合并）{  
&nbsp;&nbsp;&nbsp;&nbsp;数值映射累加给c2，c2[第一个括号某个指数 + 第二个括号某个指数] += c1[第一个括号某个指数]  
&nbsp;&nbsp;&nbsp;&nbsp;c2的值赋给c1，c2清空  
}  
  
## 📕程序实现

```cpp
const int maxn=10000;
int c1[maxn + 1];//c1[i]表示母函数第一个小括号内的表达式中，指数为i的系数
int c2[maxn + 1];//第二个的系数（职业备胎（狗头））
int main(){
    int n;//组合出来n
    while(cin >> n)
    {
        memset(c1, 0, sizeof(c1));
        memset(c2, 0, sizeof(c2));
        for(int i = 0; i <= n; i += elem[1]) c1[i] = 1;//对第一个括号的内容进行赋1
        
        //=========================================主体
        for(int i = 2; i <= n; i ++)//做n-1趟前两括号合并
        {
            for(int j = 0; j <= n; j ++)//第1个括号
            {
                for(int k = 0; k + j <= n; k += elem[i])//第2个括号，(k+=i)是因为下一个括号指数会+=i
                     c2[j + k] += c1[j];//合并后系数相加，要继承一下上一个
            }
            for(int j = 0; j <= n; j ++)//替换一下第一个括号数组，初始化下一个括号数组
            {
                c1[j] = c2[j];
                c2[j] = 0;
            }
        }
        //=============================================
        cout << c1[n] << endl;//此时就剩一个括号，c1[n]即为合并结束后的n次方系数
    }
}
```

# 😄指数型母函数

>思考：  
>考虑n个元素组成的多重集，其中a[1]重复了n[1]次，a[2]重复了n[2]次，...，a[k]重复了n[k]次，n = n[1] + n[2] + ... + n[k]。  
>现在从中取r个进行排列，求不同的排列数  
>解：若r = n，即考虑n个元素的全排列，则不同的排列数显然是 n!/n[1]!/n[2]!/.../n[k]!  
>  
>深入实例：  
>假设有8个元素，其中a[1]重复3次，a[2]重复2次，a[3]重复3次
>从中取r个组合，其组合数为c[r]，则其对应母函数为:    
>$G_x = (1 + x + x^2 + x^3) * (1 + x + x^2) * (1 + x + x^2 + x^3)$   
>$\quad\;\;= (1 + 2x + 3x^2 + 3x^3 + 2x^4 + x^5)*(1 + x + x^2 + x^3)$  
>$\quad\;\;= 1 + 3x + 6x^2 + 9x^3 + 10x^4 + 9x^5 + 6x^6 + 3x^7 + x^8$  
>  
>>分析$x^4$项组成，会发现表示了从8个元素取4个的组合方案，例如$x_1 * x_3^3,x_1^2 * x_3^2....$  
>>讨论排列数：$x_1^2 * x_3^2$的不同排列数为$\frac{4!}{2! * 2!}$，$x_{1} * x_{3}^3$的不同排列数为$\frac{4!}{1!*3!}$  
>>所以所有的不同排列数为:  
>>$4! * (\frac1{1! * 3!} + \frac1{1! * 3!} + \frac1{2!*2!} + \frac1{1!*1!*2!} + \frac1{2!*2!} + \frac1{3!*1!} + \frac1{2!*1!*1!} + \frac1{1!*2!*1!} + \frac1{3!*1!} + \frac1{2!*2!} = 16+18+36 = 70$  
  
## 📕概述 

### 🎈定义 & 用处

$G_x = (1 + \frac x{1!} + \frac {x^2}{2!} + \frac {x^2}{2!})(1 + \frac x{1!} + \frac{x^2}{2!})(1 + \frac x{1!} + \frac {x^2}{2!} + \frac {x^3}{3!})$  
$\quad\;\;= 1 + 3x + \frac 92x^2 + \frac{14}3x^3 + \frac{35}{12}x^4 + \frac{17}{12}x^5 + \frac{35}{72}x^6 + \frac8{72}x^7 + \frac1{72}x^8$  
$\quad\;\;= 1! + \frac3{1!}x + \frac9{2!}x^2 + \frac{28}{3!}x^3 + \frac{70}{4!}x^4 + \frac{170}{5!}x^5 + \frac{350}{6!}x^6 + \frac{560}{7!}x^7 + \frac{560}{8!}x^8$  
标准化为$\frac a{b!}x^b$的a便是方案数  
  
对于序列$a_0,a_1,a_2,...,$  
函数$G_x = a_0 + (\frac {a_1}{1!}x + \frac{a_2}{2!}x^2 + \frac {a_3}{3!}x^3 + ... + \frac {a_k}{k!}x^k + .. )$  
称为序列$a_0,a_1,a_2$...对应的指数型母函数  
这样对于一个多重集，其中$a_1$重复$n_1$次，$a_2$重复$n_2$次，...，$a_k$重复$n_k$次，从中取r个排列的不同排列数对应的指数型母函数为：  
$G_x = (1 + \frac {x}{1!} + \frac {x^2}{2!} + ...+ \frac {x^{n_1}}{n_1!}) * (1 + \frac {x}{1!} + \frac {x^2}{2!} + ...+ \frac {x^{n_2}}{n_2!}) * ... * (1 + \frac {x}{1!} + \frac {x^2}{2!} + ...+ \frac {x^{n_k}}{n_k!})$  
  
### 🎈过程 & 构造表示 

与普通型母函数差不多，只需要注意分母的阶乘化简即可  
  
## 📕程序实现 

```cpp
const int N = 21;
double c1[N], c2[N];//注意类型
int val[N], F[N];
void Factorial(){
    F[0] = 1;
    for(int i = 1; i <= 20; i ++) F[i] = F[i - 1] * i;
}
int main(){
    Factorial();
    while(scanf("%d%d", &n, &m) == 2){
        for(int i = 0; i < n; i ++) scanf("%d", &val[i]);
        memset(c1, 0, sizeof(c1));
        memset(c2, 0, sizeof(c2));
        for(int i = 0; i <= val[0]; i ++) c1[i] = 1.0 / F[i];
        for(int i = 1; i < n; i ++){
            for(int j = 0; j <= n; j ++){
                for(int k = 0; k + j <= m && k <= val[i]; k ++) c2[j + k] += c1[j] / F[k];//多了一个对阶乘的除法
            }
            for(int j = 0; j <= m; j ++) c1[j] = c2[j], c2[j] = 0;
        }
        printf("%.0f\n",c1[m] * F[m]);//在这里对除的阶乘进行恢复
    }
}
```


