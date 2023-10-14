---
title: 线性代数
---
###  
<hr>

## 高斯消元

### 洛谷P1092_虫食算

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1092"><img src="https://i.loli.net/2021/11/12/3ZjBEs2iLJ9r8qU.png"></a>

#### 💡
 <img src="https://latex.codecogs.com/svg.image?\inline&space;n\le&space;26" title="\inline n\le&space;26" /> ，现在最不确定且影响我们枚举的因素就是第  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  位是否进位  
我们设  <img src="https://latex.codecogs.com/svg.image?\inline&space;d_i" title="\inline d_i" />  表示第  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  位是否向  <img src="https://latex.codecogs.com/svg.image?\inline&space;i+1" title="\inline i+1" />  位进位，输入三个串  <img src="https://latex.codecogs.com/svg.image?\inline&space;a,b,c" title="\inline a,b,c" /> ， 那么可以列一个方程：  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;\begin{aligned}a_i+b_i+d_{i-1}&=c_i+n\times&space;d_i\\a_i+b_i-c_i&=n\times&space;d_i-d_{i-1}\end{aligned}" title="\inline \begin{aligned}a_i+b_i+d_{i-1}&=c_i+n\times d_i\\a_i+b_i-c_i&=n\times d_i-d_{i-1}\end{aligned}" />   
  
则我们当前有两个系数矩阵（设左为  <img src="https://latex.codecogs.com/svg.image?\inline&space;A" title="\inline A" />  右为  <img src="https://latex.codecogs.com/svg.image?\inline&space;B" title="\inline B" /> )  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;A_{ij}" title="\inline A_{ij}" />  表示在第  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  项，  <img src="https://latex.codecogs.com/svg.image?\inline&space;'A'+j" title="\inline 'A'+j" />  这个字符的系数  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;B_{ij}" title="\inline B_{ij}" />  表示在第  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  项，进位  <img src="https://latex.codecogs.com/svg.image?\inline&space;d_j" title="\inline d_j" />  的系数  
  
我们将  <img src="https://latex.codecogs.com/svg.image?\inline&space;[A]" title="\inline [A]" />  用高斯消元消至只有主对角线不为  <img src="https://latex.codecogs.com/svg.image?\inline&space;0" title="\inline 0" />  （同时  <img src="https://latex.codecogs.com/svg.image?\inline&space;[B]" title="\inline [B]" />  也跟着消）  
则  <img src="https://latex.codecogs.com/svg.image?\inline&space;\sum\limits_{j=0}^{n-1}\frac{g_{ij}}{A_{ii}}" title="\inline \sum\limits_{j=0}^{n-1}\frac{g_{ij}}{A_{ii}}" />  就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;'A'+i" title="\inline 'A'+i" />  所表示的数值  
  
由于我们有成立条件：  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;1." title="\inline 1." /> 不同字符数值不同    
 <img src="https://latex.codecogs.com/svg.image?\inline&space;2." title="\inline 2." />  数值  <img src="https://latex.codecogs.com/svg.image?\inline&space;\in[0,n-1]" title="\inline \in[0,n-1]" />   
所以我们二进制枚举  <img src="https://latex.codecogs.com/svg.image?\inline&space;\{d\}" title="\inline \{d\}" />  每次检查一下是否合法即可  

#### ✅

```cpp
const int N = 30;
int n;
string s1, s2, s3;
int A[N][N], B[N][N];
int d[N];

inline void Matrix () {
        for ( int i = 0; i < n; i ++ ) {
                A[i][s1[n - i - 1] - 'A'] ++;
                A[i][s2[n - i - 1] - 'A'] ++;
                A[i][s3[n - i - 1] - 'A'] --;
                B[i][i] = n;
                if ( i ) B[i][i - 1] = -1;
        }
}
inline int Gcd ( int a, int b ) { return b ? Gcd ( b, a % b ) : a; }
inline void Gauss () {
        for ( int r = 0, c = 0; c < n; c ++ ) {
                int t = r;
                for ( int i = r; i < n; i ++ ) if ( abs(A[i][c]) > abs(A[t][c]) ) t = i;
                if ( A[t][c] == 0 ) continue;
                swap ( A[r], A[t] ); swap ( B[r], B[t] );
                for ( int i = 0; i < n; i ++ ) {
                        if ( i == r ) continue;
                        if ( A[i][c] ) {
                                int t1 = A[i][c] / Gcd ( A[i][c], A[r][c] );
                                int t2 = A[r][c] / Gcd ( A[i][c], A[r][c] );
                                for ( int j = 0; j < n; j ++ ) 
                                        A[r][j] *= t1, 
                                        B[r][j] *= t1,
                                        A[i][j] = A[i][j] * t2 - A[r][j],
                                        B[i][j] = B[i][j] * t2 - B[r][j];
                        }
                }
                r ++;
        }
}

int vis[N], res[N];
inline bool Check () {
        memset ( vis, 0, sizeof vis );
        for ( int i = 0; i < n; i ++ ) {
                res[i] = 0;
                for ( int j = 0; j < n; j ++ ) res[i] += d[j] * B[i][j];

                if ( 
                        res[i] % A[i][i] || 
                        res[i] / A[i][i] < 0 || 
                        res[i] / A[i][i] >= n || 
                        vis[res[i] /= A[i][i]] 
                ) return false;

                vis[res[i]] = 1;
        }
        return true;
}

int main () {
        cin >> n >> s1 >> s2 >> s3;
        Matrix ();
        Gauss ();
        for ( int i = 0; i < (1 << n); i ++ ) {
                for ( int j = 0; j < n; j ++ ) d[j] = (i & (1 << j)) ? 1 : 0;
                if ( Check () ) {
                        for ( int i = 0; i < n; i ++ ) cout << res[i] << (i < n - 1 ? " " : "");
                }
        }
}
```

<hr>

### 洛谷P4035_球形空间产生器

#### 🔗
<a href="https://www.luogu.com.cn/problem/P4035"><img src="https://i.loli.net/2021/08/24/XGilbQp5NPvqmgL.png"></a>

#### 💡
n维太难想，考虑一下2维圆  
在上面任意取3个点  <img src="https://latex.codecogs.com/svg.image?\inline&space;(x1,&space;y1),(x2,&space;y2),(x3,&space;y3)" title="\inline (x1, y1),(x2, y2),(x3, y3)" />  与圆心  <img src="https://latex.codecogs.com/svg.image?\inline&space;(x0,y0)" title="\inline (x0,y0)" />   
得到一个公式：  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;\left\{\begin{aligned}(x_1-x_0)^2+(y_1-y_0)^2=R^2\\(x_2-x_0)^2+(y_2-y_0)^2=R^2\\(x_3-x_0)^2+(y_3-y_0)^2=R^2\end{aligned}\right." title="\inline \left\{\begin{aligned}(x_1-x_0)^2+(y_1-y_0)^2=R^2\\(x_2-x_0)^2+(y_2-y_0)^2=R^2\\(x_3-x_0)^2+(y_3-y_0)^2=R^2\end{aligned}\right." /> 

那么此时我们就可以拓展到n维  
我们建立球心坐标  <img src="https://latex.codecogs.com/svg.image?\inline&space;[x_1,x_2,...x_n]" title="\inline [x_1,x_2,...x_n]" />    
第  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  个点坐标  <img src="https://latex.codecogs.com/svg.image?\inline&space;[a_{i_1},a_{i_2},a_{i_3},...,a_{i_n}]" title="\inline [a_{i_1}, a_{i_2}, a_{i_3},...,a_{i_n}]" />   
则有方程:  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;\left\{\begin{aligned}&(a_{1_1}-x_1)^2+(a_{1_2}-x_2)^2+...+(a_{1_n}-x_n)^2=R^2\\\\&(a_{2_1}-x_1)^2+(a_{2_2}-x_2)^2+...+(a_{2_n}-x_n)^2=R^2\\&...\\&(a_{n_1}-x_1)^2+(a_{n_2}-x_2)^2+...+(a_{n_n}-x_n)^2=R^2\\&(a_{n+1_1}-x_1)^2+(a_{n+1_2}-x_2)^2+...+(a_{n+1_n}-x_n)^2=R^2\end{aligned}\right." title="\inline \left\{\begin{aligned} &(a_{1_1}-x_1)^2+(a_{1_2}-x_2)^2+...+(a_{1_n}-x_n)^2=R^2\\\\ &(a_{2_1}-x_1)^2+(a_{2_2}-x_2)^2+...+(a_{2_n}-x_n)^2=R^2\\ &...\\ &(a_{n_1}-x_1)^2+(a_{n_2}-x_2)^2+...+(a_{n_n}-x_n)^2=R^2\\ &(a_{n+1_1}-x_1)^2+(a_{n+1_2}-x_2)^2+...+(a_{n+1_n}-x_n)^2=R^2 \end{aligned}\right." />   
解一下方程组就可以得到这个圆心坐标  
做减法将平方项消掉就可以变成一次方程  
减法可以先看二维下前两个式子相减

即  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;\begin{aligned}&\quad(a_{2}-x_1)^2-(a_{1}-x_1)^2=R^2-R^2\\&\Rightarrow&space;a_{2}^2-a_{1}^2-2(a_{2}-a_{1})x_1=0\\&\Rightarrow&space;a_{2}^2-a_{1}^2=2(a_{2}-a_{1})x_1\end{aligned}" title="\inline \begin{aligned} &\quad(a_{2}-x_1)^2-(a_{1}-x_1)^2=R^2-R^2\\ &\Rightarrow a_{2}^2-a_{1}^2-2(a_{2}-a_{1})x_1=0\\ &\Rightarrow a_{2}^2-a_{1}^2=2(a_{2}-a_{1})x_1 \end{aligned}" />   

转换成朴素的可以变成：

 <img src="https://latex.codecogs.com/svg.image?\inline&space;\left\{\begin{aligned}&(2)-(1):\quad\stackrel{\color{blue}{b_{1_1}}}{2(a_{2_1}-a_{1_1})}x_1+\stackrel{\color{blue}b_{1_2}}{2(a_{2_2}-a{1_2})}x_2+...+2\stackrel{\color{blue}b_{1\_3}}{(a_{2_n}-a_{1_n})}x_n=\stackrel{\color{blue}b_{1_{n+1}}}{a_{2_1}^2+a_{2_2}^2+...+a_{2_n}^2-a_{1_1}^2-a_{1_2}^2-...-a_{1_n}^2}\\&(3)-(1):\\&(4)-(1):\\&...\\&(n+1)-(1):\\\end{aligned}\right." title="\inline \left\{\begin{aligned} &(2)-(1):\quad \stackrel{\color{blue}{b_{1_1}}}{2(a_{2_1}-a_{1_1})}x_1+\stackrel{\color{blue}b_{1_2}}{2(a_{2_2}-a{1_2})}x_2+...+2\stackrel{\color{blue}b_{1\_3}}{(a_{2_n}-a_{1_n})}x_n=\stackrel{\color{blue}b_{1_{n+1}}}{a_{2_1}^2+a_{2_2}^2+...+a_{2_n}^2-a_{1_1}^2-a_{1_2}^2-...-a_{1_n}^2}\\ &(3)-(1):\\ &(4)-(1):\\ &...\\ &(n+1)-(1):\\ \end{aligned}\right." />   
 <img src="https://latex.codecogs.com/svg.image?\inline&space;n" title="\inline n" />  元一次线性方程组，剩下的交给高斯消元即可  


#### ✅

```cpp
#include <iostream>
#include <cmath>

using namespace std;

const int N = 110;
const double eps = 1e-6;
int n;
double a[N][N]; // 输入的坐标
double b[N][N]; // 转换的系数


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

int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif

        cin >> n;
        for ( int i = 0; i <= n; i ++ ) for ( int j = 0; j < n; j ++ ) cin >> b[i][j];
        for ( int i = 0; i < n; i ++ ) {
                for ( int j = 0; j < n; j ++ ) 
                        a[i][j] = 2 * (b[i + 1][j] - b[i][j]),
                        a[i][n] += b[i + 1][j] * b[i + 1][j] - b[i][j] * b[i][j];
        }
        int t = Gauss();
        for ( int i = 0; i < n; i ++ ) printf("%.3f%c", a[i][n], i == n - 1? '\n' : ' ');
}
```

<hr>

### ICPC2020济南A_MatrixEquation

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/10662/A">![20220902232028](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220902232028.png)</a>

#### 💡
二维乘二维不好推，尝试抽出来一列 $j$ 来推  
要求为  
$\left[\begin{aligned}
a_{11}\;a_{12}\;...\;a_{1n}\\
a_{21}\;a_{22}\;...\;a_{2n}\\
...\\
a_{n1}\;a_{n2}\;...\;a_{nn}
\end{aligned}\right]*\left[\begin{aligned}
c_{1j}\\
c_{2j}\\
...\\
c_{nj}
\end{aligned}\right]=\left[\begin{aligned}
b_{1j}c_{1j}\\
b_{2j}c_{2j}\\
...\\
b_{nj}c_{nj}
\end{aligned}\right]$    
  
转化成方程组为：  
$\begin{aligned}
a_{11}c_{1j}+a_{12}c_{2j}+...+a_{1n}c_{nj}=b_{1j}c_{1j}\\
a_{21}c_{1j}+a_{22}c_{2j}+...+a_{2n}c_{nj}=b_{2j}c_{2j}\\
...
\end{aligned}$  
右侧移动到左侧为  
$(a_{11}-b_{1j})c_{1j}+a_{12}c_{2j}+...+a_{1n}c_{nj}=0\\a_{21}c_{1j}+(a_{22}-b_{2j})c_{2j}+...+a_{2n}c_{nj}=0\\...$  
解这个方程组为  
$\left[\begin{aligned}
(a_{11}-b_{1j})\;a_{12}\;...\;a_{1n}\\
a_{21}\;(a_{22}-b_{2j})\;...\;a_{2n}\\
...\\
a_{n1}\;a_{n2}\;...\;(a_{nn}-b_{nj})
\end{aligned}\right]*\left[\begin{aligned}
c_{1j}\\
c_{2j}\\
...\\
c_{nj}
\end{aligned}\right]=\left[\begin{aligned}
0\\0\\...\\0
\end{aligned}\right]$   
每一列解这类矩阵表示的异或方程组，对于方案数则是看其自由元数量，令其自由元数量为 $x$，则这一列的方案数为 $2^x$  
累乘即为答案

#### ✅
```cpp
const int N = 210;
const int mod = 998244353;

inline int ksm (int a, int b) {
    int res = 1;
    while (b) {
        if (b & 1) res = 1ll * res * a % mod;
        a = 1ll * a * a % mod;
        b >>= 1;
    }
    return res;
}

int n;
int a[N][N], A[N][N], B[N][N];
int freeX[N];

inline int Gauss () {
    int free_idx = 0;
    int c, r;
    for (c = r = 0; c < n && r < n; c ++, r ++) {
        int mxR = r;
        for (int i = r; i < n; i ++) if (abs(a[i][c]) > abs(a[mxR][c])) mxR = i;
        for (int j = c; j <= n; j ++) swap(a[r][j], a[mxR][j]);
        if (a[r][c] == 0) {
            freeX[free_idx ++] = c;
            r --;
            continue;
        }
        for (int i = r + 1; i < n; i ++) {
            if (a[i][c]) {
                for (int j = c; j <= n; j ++) {
                    a[i][j] ^= a[r][j];
                }
            }
        }
    }
    for (int i = r; i < n; i ++) if (a[i][n] != 0) return -1;
    return max(0, n - r);
}

int main () {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> n;
    for (int i = 0; i < n; i ++) for (int j = 0; j < n; j ++) cin >> A[i][j];
    for (int i = 0; i < n; i ++) for (int j = 0; j < n; j ++) cin >> B[i][j];

    int res = 1;
    for (int j = 0; j < n; j ++) {
        for (int i = 0; i < n; i ++) {
            for (int k = 0; k < n; k ++) {
                if (i == k) {
                    a[i][k] = (A[i][k] - B[i][j] + 2) % 2;
                } else {
                    a[i][k] = A[i][k];
                }
            }
        }
        int freedom = Gauss();
        res = 1ll * res * ksm(2, freedom) % mod;
    }
    cout << res << endl;
}
```
<hr>


## 线性基

### 洛谷P3857_彩灯

#### 🔗
<a href="https://www.luogu.com.cn/problem/P3857"><img src="https://img-blog.csdnimg.cn/0c0677a36be64b2f81e96ef67f7c40ee.png"></a>

#### 💡
这样的彩灯可以看作一个二进制数列  
数列异或不同的个数就是这个二进制数列能利用线性基异或出来的个数  
那么我们构造出线性基，化简后统计一下不同的数量即可，最后有 2^cnt 的个数

#### ✅

```cpp
const int mxBit = 50;
const int mod = 2008;
ll d[mxBit + 10];
ll l[mxBit + 10];
int cnt, n, m;

inline void Insert ( ll x ) {
        for ( int i = mxBit; i >= 0; i -- ) {
                if ( x & (1ll << i) ) {
                        if ( !d[i] ) { d[i] = x; return; }
                        else          x ^= d[i];
                }
        }
}
inline void Merge () { // 化简线性基
        for ( int i = 0; i <= mxBit; i ++ ) {
                for ( int j = i + 1; j <= mxBit; j ++ ) {
                        if ( d[j] & (1ll << i) ) d[j] ^= d[i];
                }
        }
        for ( int i = 0; i <= mxBit; i ++ ) if ( d[i] ) l[cnt ++] = d[i];
}
int main () {
        cin >> n >> m;
        for ( int i = 0; i < m; i ++ ) {
                string s; cin >> s;
                ll x = 0; for ( int i = 0; i < n; i ++ ) x = x * 2 + (s[i] == 'O');
                Insert ( x );
        }
        Merge ();
        cout << (1ll << cnt) % mod << endl;
}
```



<hr>

### 洛谷P4301_新Nim游戏

#### 🔗
<a href="https://www.luogu.com.cn/problem/P4301"><img src="https://img-blog.csdnimg.cn/75ce3df45add404b9abf8896e23635ec.png"></a>

#### 💡
根据尼姆博弈异或sg  
我们知道如果这些数如果异或出来0的话就不行  
所以作为第一个人拿的时候要选择性拿走  
  
一个一个插入线性基，如果有一个插不进去代表这个插进去的话就可以和已有的形成0  
我们就需要拿走这个数  
我们要从大往小插入，这样可以尽可能让大的进入线性基从而缩小答案  

#### ✅

```cpp
const ll mxbt = 30;
const ll N = 1e3 + 10;

namespace XORstruct {
        ll d[mxbt + 10];
        inline bool Insert ( ll x ) {
                for ( ll i = mxbt; i >= 0; i -- ) {
                        if ( x & (1ll << i) ) {
                                if ( !d[i] ) {d[i] = x; return true;}
                                else         x ^= d[i];
                        }
                }
                return false;
        }
} using namespace XORstruct;

int main () {
        ll n, res = 0; cin >> n;
        ll a[n + 10]; for ( int i = 0; i < n; i ++ ) cin >> a[i];
        sort ( a, a + n, greater<ll>() );
        for ( ll i = 0; i < n; i ++ ) {
                if ( !Insert ( a[i] ) ) res += a[i];
        }
        cout << res << endl;
}
```

<hr>

### 洛谷P4570_元素

#### 🔗
https://darkbzoj.tk/problem/2460

#### 💡
本题让求id异或不为0的情况下，val的最大值  
众所周知，一个数如果与前面出现过的数异或值相等，那带上它的异或值为0  
同时线性基中，判断是否会与前面的异或值相等，可以用线性基中“在穿过线性基，若最后被消完，说明带上它会与前面的凑0异或”的性质  
所以每次插入加判断是否为0    

由于前面的先放进去线性基为空，不容易被清0，所以我们利用贪心将val较大的id放前面，然后一个个特判即可  

#### ✅

```cpp
const int N = 1100;
const int MaxBit = 60;

struct Ore { ll id, val; friend bool operator < ( Ore a, Ore b ) { return a.val > b.val; }}a[N]; // 按价值升序排序
ll n, d[70], res;

inline void Insert ( Ore A ) {
        ll x = A.id;
        for ( ll i = MaxBit; i >= 0; i -- ) {
                if ( (x >> i) & 1 ) {
                        if ( d[i] ) x ^= d[i];
                        else { d[i] = x; break; }
                }
        }
        if ( x ) res += A.val; // 若没有与前面的异或为0，就加入res
}

int main (){
        n = inputLL();
        for ( ll i = 0; i < n; i ++ ) a[i] = {inputLL(), inputLL()};
        sort ( a, a + n );
        for ( ll i = 0; i < n; i ++ ) Insert( a[i] );
        outLL(res);
        return 0;
};
```



<hr>

### 牛客NC17968_xor序列

#### 🔗
<a href="https://ac.nowcoder.com/acm/problem/17968"><img src="https://i.loli.net/2021/11/25/as87AUVJENuel1R.png"></a>

#### 💡
首先知道  <img src="https://latex.codecogs.com/svg.image?\inline&space;x\oplus&space;d=y\Rightarrow&space;x\oplus&space;y=d" title="\inline x\oplus&space;y=d\Rightarrow&space;x\oplus&space;y=d" />  
所以我们只需要知道  <img src="https://latex.codecogs.com/svg.image?\inline&space;x\oplus&space;y" title="\inline x\oplus&space;y" /> 是否在  <img src="https://latex.codecogs.com/svg.image?\inline&space;\{a\}" title="\inline \{a\}" /> 中能异或出来就行了  
这个就可以直接使用线性基，看看这个数可不可以插进去即可  
记得查询完如果能插入的话还要拔出来  

#### ✅

```cpp
const int N = 1e5 + 10;
const int mxBt = 64;
ll n, m;
ll d[mxBt];

inline int Insert ( ll x ) {
        for ( int j = mxBt - 1; j >= 0; j -- ) {
                if ( x & (1ll << j) ) {
                        if ( d[j] == 0 ) { d[j] = x; return j; }
                        else               x ^= d[j];
                }
        }
        return -1;
}

int main () {
        ios::sync_with_stdio(false);
        cin >> n; 
        for ( ll i = 1, x; i <= n; i ++ )
                cin >> x,
                Insert ( x );
        cin >> m;
        for ( ll i = 1; i <= m; i ++ ) {
                ll x, y; cin >> x >> y;
                int chg = Insert ( x ^ y );
                if ( chg == -1 )          cout << "YES" << endl;
                else                      cout << "NO" << endl, d[chg] = 0;
        }
}
```

<hr>

### 牛客挑战赛59C_异或

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/11199/C">![20220416164253](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220416164253.png)</a>

#### 💡
求数列中异或最大值，那就是线性基  
但是奇数个偶数个就很难处理，我们考虑异或的性质  
<b>如果一个数 $x$ 被使用偶数次那么就是 $0$ ，否则是 $x$ </b>，对应于这道题就是个数 $+1$   
在这个性质中，发现 偶数$+0=$偶数，奇数$+1=$偶数  
那么我们首先要满足“选了几个数那么 $x$ 就用了几次”  
我们让线性基最高位设置为 $a_1$ ，这样每个数通过线性基都会经过 $a_1$ ，即 $a_i=a_i\oplus a_1,\;i\in[2,n]$  
对于偶数，我们求 $[2,n]$ 组成的线性基的最大值即可，反正就算选了奇数个就意味着补出来 $a_1$ 变成偶数个     
对于奇数，我们求 $[1,n]$ 组成的线性基最大值即可，这样的话我们也就是一定会比上一个答案多补一个 $a_1$ ，一定是奇数个       
实现方式就是答案的最高位是否为 $1$   
当然要用 `bitset` 维护  

#### ✅
```cpp
namespace Basis {
        bitset<2003> d[2003];
        inline void Insert (bitset<2003> x) {
                for (int i = 2001; i >= 0; i --) {
                        if (x[i]) {
                                if (d[i].none()) { d[i] = x; break; }
                                x ^= d[i];
                        }
                }
        }
        inline bitset<2003> Query (bitset<2003> x) {
                for (int i = 2001; i >= 0; i --) {
                        if (!x[i]) x ^= d[i];
                }
                return x;
        }
}

inline void print (bitset<2003> x) {
        int i = 2000;
        while (i >= 0 && !x[i]) i --;
        while (i >= 0) cout << x[i --];
        cout << endl;
}

int main () {
        cin.tie(0)->sync_with_stdio(0);
        cin.exceptions(cin.failbit);

        int n; cin >> n;
        for (int i = 0; i < n; i ++) {
                string s; cin >> s;
                Basis::Insert(bitset<2003>(s).set(2001));
        }

        bitset<2003> res;
        res[2001] = 1;
        print(Basis::Query(res));
        res[2001] = 0;
        print(Basis::Query(res));
}
```
<hr>


### ABC236F_Spices

#### 🔗
<a href="https://atcoder.jp/contests/abc236/tasks/abc236_f"><img src="https://img-blog.csdnimg.cn/6034fce15a524943afa2cca8f1d99448.png"></a>

#### 💡
让 $1,2,\dots,2^N-1$ 没有异或不出来的，异或空位问题，很容易想到线性基  
那么在这里，还有一个权值是 $c_i$ 价格，那么我们可以想到用 $kruskal$ 最小生成树的方式贪心地去搭建线性基的 $d$ 数组  
对每一个调料按 $c$ 排序  
从小到大枚举，如果能 $id$ 插入就让它把 $d[i]$ 占了，并且使结果加上这个 $c$   

#### ✅
```cpp
const ll N = 1e5 + 10;
struct node {
        ll val, id;
        inline friend bool operator < ( node a, node b ) {
                return a.val < b.val;
        }
}nd[N];
 
ll n;
ll d[20];
 
inline ll Insert ( ll x ) {
        for ( ll j = n - 1; j >= 0; j -- ) {
                if ( x & (1ll << j) ) {
                        if ( d[j] == 0 ) { d[j] = x; return 1; }
                        else               x ^= d[j];
                }
        }
        return 0;
}
 
int main () {
        ios::sync_with_stdio(false);
        cin >> n; 
        for ( ll i = 1, x; i <= (1 << n) - 1; i ++ )
                cin >> nd[i].val, nd[i].id = i;
        sort ( nd + 1, nd + (1 << n) );
        ll res = 0;
        for ( ll i = 1; i <= (1 << n) - 1; i ++ ) {
                ll ist = Insert(nd[i].id);
                if (ist == 1) {
                        res += nd[i].val;
                }
        }
        cout << res << endl;
}
```

<hr>

### HDUOJ3949_XOR

#### 🔗
https://acm.hdu.edu.cn/showproblem.php?pid=3949

#### 💡
对于求第k小的数，在线性基位运算中，我们要想到对k二进制拆分，然后中途过res，计算出结果  
对k每一位判有没有1，前提是这一位最多只有一个1，所以我们还要对线性基进行简化和整理  

其中特判情况是，整理完之后的线性基如果个数没有n大，那么说明存在一个0，求第k小就变成了求第k-1小  
同时 cnt 个线性基元素最多只能拼出来 2^cnt-1 种答案，如果 k>=2^cnt-1 的话就是没有第 k 小就没有-1的情况  

#### ✅

```cpp
/*
           ________   _                                              ________                              _
          /  ______| | |                                            |   __   |                            | |
         /  /        | |                                            |  |__|  |                            | |
         |  |        | |___    _   _   _   ___  _   _____           |     ___|   ______   _____   ___  _  | |
         |  |        |  __ \  |_| | | | | |  _\| | | ____|          |  |\  \    |  __  | |  _  | |  _\| | | |
         |  |        | |  \ |  _  | | | | | | \  | | \___           |  | \  \   | |_/ _| | |_| | | | \  | | |
         \  \______  | |  | | | | \ |_| / | |_/  |  ___/ |          |  |  \  \  |    /_   \__  | | |_/  | | |
Author :  \________| |_|  |_| |_|  \___/  |___/|_| |_____| _________|__|   \__\ |______|     | | |___/|_| |_|
                                                                                         ____| |
                                                                                         \_____/
*/

//#include <unordered_map>
#include <algorithm>
#include <iostream>
#include <cstring>
#include <utility>
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <map>
#include <set>

#define G 10.0
#define LNF 1e18
#define EPS 1e-6
#define PI acos(-1.0)
#define INF 0x7FFFFFFF

#define ll long long
#define ull unsigned long long

#define LOWBIT(x) ((x) & (-x))
#define LOWBD(a, x) lower_bound(a.begin(), a.end(), x) - a.begin()
#define UPPBD(a, x) upper_bound(a.begin(), a.end(), x) - a.begin()
#define TEST(a) cout << "---------" << a << "---------" << endl

#define CHIVAS_ int main()
#define _REGAL exit(0)
#define SP system("pause")
#define IOS ios::sync_with_stdio(false)

//#define map unordered_map

#define PB(x) push_back(x)
#define ALL(a) a.begin(),a.end()
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for (cass = inputInt(); cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;


template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? GCD(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal <vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i])MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal <vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i])MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}
template<typename T> vector<T>& operator-- (vector<T> &v){for (auto& i : v) --i; return v;}
template<typename T> vector<T>& operator++ (vector<T> &v){for (auto& i : v) ++i; return v;}
template<typename T> istream& operator>>(istream& is, vector<T> &v){for (auto& i : v) is >> i; return is;}
template<typename T> ostream& operator<<(ostream& os, vector<T> v){for (auto& i : v) os << i << ' '; return os;}

inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

const int N = 1e4 + 5;
const int MaxBit = 60;

ll d[MaxBit], a[N], l[MaxBit];
ll cass, n, Q, k, CasId, cnt;

inline void Init ( ) { cnt = 0; MEM(d, 0); MEM(l, 0); }

inline void Insert ( ll x ) { // 将数据x放入集合建立线性基
        for ( ll i = MaxBit; i >= 0; i -- ) {
                if ( (x >> i) & 1 ) {
                        if ( d[i] ) x ^= d[i];
                        else { d[i] = x; break; }
                }
        }
}

inline void Simple () { // 对线性基的简化和整理
        for ( ll i = 0; i <= MaxBit; i ++ ) {
                for ( int j = i + 1; j <= MaxBit; j ++ ) {
                        if ( (d[j] >> i) & 1 ) d[j] ^= d[i];
                }
        }
        for ( int i = 0; i <= MaxBit; i ++ ) {
                if ( d[i] ) l[cnt++] = d[i];
        }
}

CHIVAS_{
        ll cass;
        EACH_CASE ( cass ) {
                printf("Case #%d:\n", ++ CasId); Init();
                n = inputLL();
                for ( ll i = 1; i <= n; i ++ ) a[i] = inputLL(), Insert(a[i]);

                Simple();

                Q = inputLL();
                while ( Q -- ) {
                        k = inputLL() - (cnt != n);

                        if ( k >= (1ll << cnt)) { // cnt 个线性基最多能拼出 2^cnt - 1 个数
                                puts("-1");
                        } else {
                                ll res = 0;
                                for ( ll i = 0; i <= MaxBit; i ++ ) { // 对k二进制枚举，求得res（每出现一次位上是1的线性基，k的选择就真正意义 /2 ）
                                        if ( (k >> i) & 1 )  res ^= l[i];
                                }
                                outLL(res); puts("");
                        }
                }
        }
        _REGAL;
}
```



<hr>

### README

<h1 align="center">【模板】</h1>

#### 🔗
**题目描述**  
给定 n 个整数（数字可能重复），求在这些数中选取任意个，使得他们的异或和最大。  
  
**输入格式**  
第一行一个数 n，表示元素个数  
  
接下来一行 n 个数  
  
**输出格式**  
仅一行，表示答案。  
  
**输入输出样例**  
**输入**  
2  
1 1  
**输出**  
1  
**说明/提示**  
<img src="https://latex.codecogs.com/svg.image?1&space;\le&space;n&space;\le&space;50,&space;0&space;\le&space;S_i&space;\le&space;2^{50}" title="1 \le n \le 50, 0 \le S_i \le 2^{50}" />  
  
<a href="https://www.luogu.com.cn/problem/P3812">Luogu传送门</a>

#### 💡  
对整个集合求线性基  
对于res  
它哪一位的当前情况是0且线性基这一位为1  
就让res乘上这一位的线性基  
  
#### ✅


```cpp
/*
           ________   _                                              ________                              _
          /  ______| | |                                            |   __   |                            | |
         /  /        | |                                            |  |__|  |                            | |
         |  |        | |___    _   _   _   ___  _   _____           |     ___|   ______   _____   ___  _  | |
         |  |        |  __ \  |_| | | | | |  _\| | | ____|          |  |\  \    |  __  | |  _  | |  _\| | | |
         |  |        | |  \ |  _  | | | | | | \  | | \___           |  | \  \   | |_/ _| | |_| | | | \  | | |
         \  \______  | |  | | | | \ |_| / | |_/  |  ___/ |          |  |  \  \  |    /_   \__  | | |_/  | | |
Author :  \________| |_|  |_| |_|  \___/  |___/|_| |_____| _________|__|   \__\ |______|     | | |___/|_| |_|
                                                                                         ____| |
                                                                                         \_____/
*/

//#include <unordered_map>
#include <algorithm>
#include <iostream>
#include <cstring>
#include <utility>
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <map>
#include <set>

#define G 10.0
#define LNF 1e18
#define EPS 1e-6
#define PI acos(-1.0)
#define INF 0x7FFFFFFF

#define ll long long
#define ull unsigned long long

#define LOWBIT(x) ((x) & (-x))
#define LOWBD(a, x) lower_bound(a.begin(), a.end(), x) - a.begin()
#define UPPBD(a, x) upper_bound(a.begin(), a.end(), x) - a.begin()
#define TEST(a) cout << "---------" << a << "---------" << endl

#define CHIVAS_ int main()
#define _REGAL exit(0)
#define SP system("pause")
#define IOS ios::sync_with_stdio(false)

//#define map unordered_map

#define PB(x) push_back(x)
#define ALL(a) a.begin(),a.end()
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for (cass = inputInt(); cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;


template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? GCD(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal <vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i])MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal <vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i])MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}
template<typename T> vector<T>& operator-- (vector<T> &v){for (auto& i : v) --i; return v;}
template<typename T> vector<T>& operator++ (vector<T> &v){for (auto& i : v) ++i; return v;}
template<typename T> istream& operator>>(istream& is, vector<T> &v){for (auto& i : v) is >> i; return is;}
template<typename T> ostream& operator<<(ostream& os, vector<T> v){for (auto& i : v) os << i << ' '; return os;}
inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}


ll d[60], n;

CHIVAS_{
        n = inputLL();
        for ( ll i = 1; i <= n; i ++ ) {
                ll x = inputLL();
                for ( ll j = 49; j >= 0; j -- ) {
                        if ( x & (1ll << j) ) {
                                if ( d[j] ) x ^= d[j];
                                else { d[j] = x; break; }
                        }
                }
        }

        ll res = 0;
        for ( ll i = 49; i >= 0; i -- ) {
                if ( (res & (1ll << i)) == 0 && d[i] ) res ^= d[i];
        }
        outLL(res);
        _REGAL;
};
```



<hr>

## 矩阵加速

### 牛客练习赛80C_不降数

#### 🔗
https://ac.nowcoder.com/acm/contest/11170/C

#### 💡
我们可以发现如下性质：(1~9)为计数次数出现个数  
n=1时 (1 ~ 9)就是答案，所以9出现过1次，别的都是0次  
n=2时 (1 ~ 9)+(1 ~ 8)+(1 ~ 7)+..+(1 ~ 1)得到: 9一次，8一次，7一次，...，1一次  
n=3时 (1 ~ 9)+..+(1 ~ 1)  +  (1 ~ 8)+..+(1 ~ 1) + (1 ~ 7)+..+(1 ~ 1) + .. + (1 ~ 1)得到9一次，8两次，7三次，....，1九次
...后面一个自己手算一下即可  
得到下表
<table>
<tr>
<th>n</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th>
</tr>
<tr>
<td>1</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>0</td><td>1</td>
</tr>
<tr>
<td>2</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td>
</tr>
<tr>
<td>3</td><td>9</td><td>8</td><td>7</td><td>6</td><td>5</td><td>4</td><td>3</td><td>2</td><td>1</td>
</tr>
<tr>
<td>4</td><td>45</td><td>37</td><td>29</td><td>21</td><td>15</td><td>10</td><td>6</td><td>3</td><td>1</td>
</tr>
<tr>..</tr><td>..</td><td>..</td><td>..</td><td>..</td><td>..</td><td>..</td><td>..</td><td>..</td><td>..</td><td>..</td>
</table>  
会发现每一次更新当点都是上一行这个点之后的和（证明方式有点不好打，大家可以自己试试）  
而如果一行一行递推显然时间爆T，那么怎么算呢  
（一位学长给我说可以用分块打表）  
这里我用的是矩阵ksm：  
用a[i]表示计数次数为i次出现的次数   
建立矩阵乘法如下  
<table>
<tr>
<td>1</td><td>0</td><td>0</td><td>0</td><td>...</td><td>0</td><td rowspan="6" valign="top">^n</td><td>a[1]</td>
</tr>
<tr>
<td>1</td><td>1</td><td>0</td><td>0</td><td>...</td><td>0</td><td>a[2]</td>
</tr>
<tr>
<tr>
<td>1</td><td>1</td><td>1</td><td>0</td><td>...</td><td>0</td><td>a[3]</td>
</tr>
<tr>
<td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td><td>...</td>
</tr>
<tr>
<td>1</td><td>1</td><td>1</td><td>1</td><td>...</td><td>1</td><td>a[9]</td>
</tr>
</table>  
因为a[i]都保存了上一行的前i个，所以我们递推时不能改变原有的值，从后往前递推，就将方矩阵和竖矩阵倒过来建  

#### ✅  
  

```cpp
#include <algorithm>
#include <iostream>
#include <cstring>
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <map>
#include <set>
#define G 10.0
#define LNF 1e18
#define eps 1e-6
#define ll long long
#define INF 0x7FFFFFFF
#define PI acos(-1.0)
#define pb(x) push_back(x)
#define SP system("pause")
#define mm(a, b) memset(a, b, sizeof(a))
#define fir(i, a, n) for (int i = a; i <= n; i++)
#define rif(i, a, n) for (int i = a; i >= n; i--)
#define each_cass(cass) for (scanf("%d", &cass); cass; cass--)

using namespace std;

const ll mod = 100019;
struct Matrix{
    ll m[10][10];
    Matrix(int flag)//构造函数
    {
        fir(i, 1, 9) fir(j, 1, 9) m[i][j] = flag * (i == j);
    }
    Matrix Mul(Matrix a,Matrix b)//矩阵乘
    {
        Matrix ans(0);
        fir(i, 1, 9) fir(j, 1, 9) fir(k, 1, 9) ans.m[i][j] = (ans.m[i][j] + a.m[i][k] * b.m[k][j]) % mod;
        return ans;
    }
    Matrix ksm(Matrix a,ll b)//ksm
    {
        Matrix ans(1);
        while(b){
            if(b&1)
                ans = Mul(ans, a);
            a = Mul(a, a);
            b >>= 1;
        }
        return ans;
    }
};

int main()
{
    ll n;
    cin >> n;
    ll a[10] = {0, 1, 0, 0, 0, 0, 0, 0, 0, 0};//这里算的时候拿a[i]表示9-i+1计数出现的次数，并且初始数组为n=1的情况
    Matrix cur(1);
    fir(i, 1, 9) fir(j, 1, 9) cur.m[i][j] = 1*(j<=i);
    cur = cur.ksm(cur, n);
    
    //sum出a[i]*i的结果
    ll sum = 0;
    fir(i,1,9)
    fir(j,1,9)
    {
        sum = (sum + cur.m[i][j] * a[j]%mod)%mod;
    }
    cout << sum << endl;
    return 0;
}

```

<hr>

### 牛客NC230081_MagicGems

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/24157/B"><img src="https://i.loli.net/2021/11/25/PGmu3thx1kQjEZg.png"></a>

#### 💡
一个计数问题  
一个宝石可以被分解，那么容量也降低  
那么要拿第  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  个的时候可以由  <img src="https://latex.codecogs.com/svg.image?\inline&space;i-1" title="\inline i-1" /> 推过来，也可以选择分解这个，由  <img src="https://latex.codecogs.com/svg.image?\inline&space;i-m" title="\inline i-m" />  推过来
那么我们可以设计出递推式  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;f_i=f_{i-1}+f_{i-m}" title="\inline f_i=f_{i-1}+f_{i-m}" />  
   
由于  <img src="https://latex.codecogs.com/svg.image?\inline&space;n" title="\inline n" /> 很大，那么直接矩阵<img src="https://latex.codecogs.com/svg.image?\inline&space;ksm" title="\inline ksm" />优化

#### ✅

```cpp
const int mod = 1e9 + 7;
const int N = 110;

struct Matrix {
        ll m[N][N];
        inline Matrix ( int e ) { 
                for ( int i = 0; i < N; i ++ ) 
                        for ( int j = 0; j < N; j ++ ) 
                                m[i][j] = e * (i == j); 
        }
        inline Matrix Mul ( Matrix a, Matrix b ) {
                Matrix res(0);
                for ( int i = 0; i < N; i ++ ) {
                        for ( int j = 0; j < N; j ++ ) {
                                for ( int k = 0; k < N; k ++ ) {
                                        res.m[i][j] = (res.m[i][j] + a.m[i][k] * b.m[k][j] % mod) % mod;
                                }
                        }
                }
                return res;
        }
        inline Matrix ksm ( Matrix a, ll b ) {
                Matrix res(1);
                while ( b ) {
                        if ( b & 1 ) res = Mul(res, a);
                        a = Mul(a, a);
                        b >>= 1;
                }
                return res;
        }
};

int main () {
        ll n, m; cin >> n >> m;
        if ( n < m ) { cout << 1 << endl; return 0; }
        Matrix res(0); 
        res.m[0][0] = res.m[0][m - 1] = 1;
        for ( int i = 1; i < m; i ++ ) res.m[i][i - 1] = 1;
        res = res.ksm(res, n - m + 1);

        ll RES = 0;
        for ( int i = 0; i < m; i ++ ) RES = (RES + res.m[0][i]) % mod;
        cout << RES << endl;

}
```

<hr>

### 牛客NC230082_SashaAndArray

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/24157/C"><img src="https://i.loli.net/2021/11/25/yJkxhsDW2CSl9cY.png"></a>

#### 💡
一个涉及到区间修改和区间求和的问题  
且  <img src="https://latex.codecogs.com/svg.image?\inline&space;a_i" title="\inline a_i" />  到最后会很大，所以想矩阵  <img src="https://latex.codecogs.com/svg.image?\inline&space;ksm" title="\inline ksm" />  ，我们设置  <img src="https://latex.codecogs.com/svg.image?\inline&space;base" title="\inline base" />  矩阵就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;fibonacci" title="\inline fibonacci" />  的基础矩阵  
那么在矩阵里面区间修改加也就是变成了区间修改乘（区间和矩阵乘上  <img src="https://latex.codecogs.com/svg.image?\inline&space;base" title="\inline base" />  矩阵的  <img src="https://latex.codecogs.com/svg.image?\inline&space;c" title="\inline c" />  次方  
区间乘可以由乘法分配律满足，所以线段树懒标记就可以实现    
而统计的时候就是区间查询加，这个就直接用线段树的区间求和数组计算加后的矩阵  
由于满足乘法分配律，我们直接用初始的竖矩阵去乘这个区间和矩阵就行了  


#### ✅

```cpp
struct Mat {
        ll m[2][2];
        inline Mat() {}
        inline Mat ( int e ) {
                for ( int i = 0; i < 2; i ++ ) 
                        for ( int j = 0; j < 2; j ++ )
                                m[i][j] = e * (i == j);
        }
        inline Mat operator + ( Mat a ) {
                Mat res(0);
                for ( int i = 0; i < 2; i ++ )
                        for ( int j = 0; j < 2; j ++ )
                                res.m[i][j] = (a.m[i][j] + m[i][j]) % mod;
                return res;
        }
        inline friend Mat operator * ( Mat a, Mat b ) {
                Mat res(0);
                for ( int i = 0; i < 2; i ++ )
                        for ( int j = 0; j < 2; j ++ )
                                for ( int k = 0; k < 2; k ++ )
                                        res.m[i][j] = (res.m[i][j] + a.m[i][k] * b.m[k][j] % mod) % mod;
                return res;
        }
        inline bool operator == ( Mat b ) {
                for ( int i = 0; i < 2; i ++ )
                        for ( int j = 0; j < 2; j ++ )
                                if ( m[i][j] != b.m[i][j] ) return false;
                return true;
        }
} base, one(1), zero(0), res(0);
inline Mat ksm ( Mat a, ll b ) { Mat res(1); while ( b ) { if ( b & 1 ) res = res * a; a = a * a; b >>= 1; } return res; }

const int N = 1e5 + 10;
int n, m, a[N];

struct SegmenTree {
        Mat val, lazy;
} sgtr[N << 2];
inline void PushUp ( int rt ) { sgtr[rt].val = sgtr[rt << 1].val + sgtr[rt << 1 | 1].val; }
inline void PushDown ( int rt, int l, int r ) {
        auto &cur = sgtr[rt], &lson = sgtr[rt << 1], &rson = sgtr[rt << 1 | 1];
        if ( cur.lazy == one ) return;

        int mid = (l + r) >> 1;
        lson.val = lson.val * cur.lazy; lson.lazy = lson.lazy * cur.lazy;
        rson.val = rson.val * cur.lazy; rson.lazy = rson.lazy * cur.lazy;
        cur.lazy = one;
}
inline void Build ( int l, int r, int rt ) {
        sgtr[rt].lazy = one;
        if ( l == r ) {
                if ( a[l] == 1 )      sgtr[rt].val.m[0][0] = 1;
                else if ( a[l] == 2 ) sgtr[rt].val.m[0][0] = sgtr[rt].val.m[0][1] = 1;
                else                  sgtr[rt].val = res * ksm(base, a[l] - 2);
                return;
        }

        int mid = (l + r) >> 1;
        Build ( l, mid, rt << 1 );
        Build ( mid + 1, r, rt << 1 | 1);
        PushUp ( rt ); 
}
inline void Update ( int a, int b, Mat c, int l, int r, int rt ) {
        if ( a <= l && r <= b ) {
                sgtr[rt].val = sgtr[rt].val * c;
                sgtr[rt].lazy = sgtr[rt].lazy * c;
                return;
        }
        if ( a > r || b < l ) return;
        int mid = (l + r) >> 1;
        PushDown ( rt, l, r );
        Update ( a, b, c, l, mid, rt << 1 );
        Update ( a, b, c, mid + 1, r, rt << 1 | 1 );
        PushUp ( rt );
}
inline ll Query ( int a, int b, int l, int r, int rt ) {
        if ( a <= l && r <= b ) return sgtr[rt].val.m[0][0];
        if ( a > r || b < l )   return 0;
        PushDown ( rt, l, r );
        int mid = (l + r) >> 1;
        return (Query ( a, b, l, mid, rt << 1 ) + Query ( a, b, mid + 1, r, rt << 1 | 1 )) % mod;
}

int main () {
        base.m[0][0] = base.m[0][1] = base.m[1][0] = 1; base.m[1][1] = 0;
        res.m[0][0] = res.m[0][1] = 1;

        cin >> n >> m;
        for ( int i = 1; i <= n; i ++ ) cin >> a[i];
        Build ( 1, n, 1 );

        while ( m -- ) {
                int op; cin >> op;
                if ( op == 1 ) {
                        int l, r, x; cin >> l >> r >> x;
                        Update ( l, r, ksm(base, x), 1, n, 1 );
                } else {
                        int l, r; cin >> l >> r;
                        cout << Query ( l, r, 1, n, 1 ) << endl;
                }
        }
}
```

<hr>

### HDUOJ1575_TrA

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=1575

#### 💡


#### ✅  
  

```cpp
#include                                                  <map>
#include                                                  <set>
#include                                                <stack>
#include                                                <queue>
#include                                                <cmath>
#include                                               <string>
#include                                               <vector>
#include                                               <cstdio>
#include                                              <cstring>
#include                                             <iostream>
#include                                            <algorithm>
#define G                                                  10.0
#define LNF                                                1e18
#define eps                                                1e-6
#define mod                                             1e9 + 7
#define ll                                            long long
#define INF                                          0x7FFFFFFF
#define PI                                           acos(-1.0)
#define pb(x)                                      push_back(x)
#define SP                                      system("pause")
#define mm(a, b)                        memset(a, b, sizeof(a))
#define fir(i, a, n)                for (ll i = a; i <= n; i++)
#define rif(i, a, n)                for (ll i = a; i >= n; i--)
#define each_cass(cass)  for (scanf("%d", &cass); cass; cass--)

using namespace std;

const int maxn = 100;
int n, k;
struct Mat{
    ll m[maxn][maxn];
    Mat(int flag){
        fir(i, 1, n)
            fir(j, 1, n)
                m[i][j] = flag * (i == j);
    }
    Mat Mul(Mat a,Mat b){
        Mat ans(0);
        fir(i, 1, n)
            fir(j, 1, n)
                fir(k, 1, n)
                    ans.m[i][j] = (ans.m[i][j] + a.m[i][k] * b.m[k][j])%9973;
        return ans;
    }
    Mat ksm(Mat a,ll b){
        Mat ans(1);
        while(b){
            if(b&1)
                ans = Mul(ans, a);
            a = Mul(a, a);
            b >>= 1;
        }
        return ans;
    }
};
int main(){
    int cass;
    each_cass(cass){
        Mat cur(0);
        scanf("%d%d", &n, &k);
        fir(i, 1, n)
            fir(j, 1, n)
                scanf("%lld", &cur.m[i][j]);
        cur = cur.ksm(cur, k);
        ll res = 0;
        fir(i, 1, n) res = (res + cur.m[i][i]) % 9973;
        printf("%lld\n", res);
    }
    return 0;
}
```

<hr>

### HDUOJ1757_ASimpleMathProblem

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=1757

#### 💡


#### ✅  
  

```cpp
#include                                            <algorithm>
#include                                             <iostream>
#include                                              <cstring>
#include                                               <string>
#include                                               <vector>
#include                                               <cstdio>
#include                                                <stack>
#include                                                <queue>
#include                                                <cmath>
#include                                                  <map>
#include                                                  <set>
#define G                                                  10.0
#define LNF                                                1e18
#define eps                                                1e-6
#define ll                                            long long
#define INF                                          0x7FFFFFFF
#define PI                                           acos(-1.0)
#define pb(x)                                      push_back(x)
#define SP                                      system("pause")
#define mm(a, b)                        memset(a, b, sizeof(a))
#define fir(i, a, n)                for (ll i = a; i <= n; i++)
#define rif(i, a, n)                for (ll i = a; i >= n; i--)
#define each_cass(cass)  for (scanf("%d", &cass); cass; cass--)

using namespace std;

const int maxn = 15;

ll n, k, mod;
struct Mat{
    ll m[maxn][maxn];
    Mat(ll flag){//构造函数
        fir(i, 1, n) 
            fir(j, 1, n) 
                m[i][j] = flag * (i == j);
    }
    Mat Mul(Mat a,Mat b){//矩阵乘
        Mat ans(0);
        fir(i, 1, n)
            fir(j, 1, n)
                fir(k, 1, n)
                    ans.m[i][j] = (ans.m[i][j] + a.m[i][k] * b.m[k][j]) % mod;
        return ans;
    }
    Mat ksm(Mat a,ll b){//快速幂
        Mat ans(1);
        while(b){
            if(b&1)
                ans = Mul(ans, a);
            a = Mul(a, a);
            b >>= 1;
        }
        return ans;
    }
};

int main(){
    while (scanf("%lld%lld", &k, &mod) == 2){
        Mat cur(0);
        n = 10;
        fir(i, 1, n) scanf("%lld", &cur.m[1][i]);
        fir(i, 2, n)
            fir(j, 1, n)
                cur.m[i][j] = 1 * (i - 1 == j);
        if(k<10){
            printf("%lld\n", k % mod);
            continue;
        }
        cur = cur.ksm(cur, k-9);
        ll ans = 0;
        fir(i, 1, n) ans = (ans + cur.m[1][i] * (10 - i) % mod) % mod;
        printf("%lld\n", ans);
    }
    //SP;
}
```

<hr>

### HDUOJ2276_Kiki&LittleKiki2

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=2276


#### 💡


#### ✅  
  

```cpp
#include <map>
#include <set>
#include <stack>
#include <queue>
#include <cmath>
#include <string>
#include <vector>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <algorithm>
#define G 10.0
#define LNF 1e18
#define eps 1e-6
#define ll long long
#define INF 0x7FFFFFFF
#define PI acos(-1.0)
#define pb(x) push_back(x)
#define SP system("pause")
#define mm(a, b) memset(a, b, sizeof(a))
#define fir(i, a, n) for (ll i = a; i <= n; i++)
#define rif(i, a, n) for (ll i = a; i >= n; i--)
#define each_cass(cass) for (scanf("%d", &cass); cass; cass--)

using namespace std;

ll len, n;
const ll mod = 2;
struct Matrix
{
    ll m[110][110];
    Matrix(int flag)
    {
        fir(i, 1, len)
            fir(j, 1, len)
                m[i][j] = flag * (i == j);
    }
    Matrix Mul(Matrix a, Matrix b)
    {
        Matrix ans(0);
        fir(i, 1, len)
            fir(j, 1, len)
                fir(k, 1, len)
                    ans.m[i][j] = (ans.m[i][j] + a.m[i][k] * b.m[k][j]) % mod;
        return ans;
    }
    Matrix ksm(Matrix a, ll b)
    {
        Matrix ans(1);
        while (b)
        {
            if (b & 1)
                ans = Mul(ans, a);
            a = Mul(a, a);
            b >>= 1;
        }
        return ans;
    }
};

int main()
{
    while (scanf("%lld", &n) == 1)
    {
        string s;
        getchar();
        cin >> s;
        len = s.size();
        Matrix cur(0);
        for (int i = 1; i <= len; i++)
        {
            cur.m[i][i] = 1;
            if (i > 1)
                cur.m[i][i - 1] = 1;
            else
                cur.m[i][len] = 1;
        }
        cur = cur.ksm(cur, n);
        ll a[len + 10];
        for (int i = 0; i < len; i++)
        {
            a[i + 1] = s[i] - '0';
        }
        ll ans[105] = {0};
        fir(i, 1, len)
            fir(j, 1, len) 
                ans[i] = (ans[i] + cur.m[i][j] * a[j]) % mod;//最后一个矩阵的每一行都要求出来
        fir(i, 1, len) printf("%d", ans[i]);
        printf("\n");
    }
    return 0;
}
/*
构建(len*len)的矩阵：
1 0 0 0 0 0 1
1 1 0 0 0 0 0
0 1 1 0 0 0 0
0 0 1 1 0 0 0
0 0 0 1 1 0 0
0 0 0 0 1 1 0
0 0 0 0 0 1 1
*/
```

<hr>

### HDUOJ2604_Queuing

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=2604

#### 💡


#### ✅  
  

```cpp
#include <stack>
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <cstring>
#include <cstdio>
#include <cstdlib>
#include <map>
#include <queue>
#include <cmath>
#define fir(i, a, n) for (int i = a; i <= n; i++)
#define rif(i, a, n) for (int i = a; i >= n; i--)
#define mm(a, b) memset(a, b, sizeof(a))
#define SP system("pause")
typedef long long ll;
const int INF = 0x7FFFFFFF;
const double G = 10;
const double eps = 1e-6;
const double PI = acos(-1.0);
using namespace std;

ll n=4;
ll l,mod;
struct Mat{
    ll m[10][10];
    Mat(ll flag){
        fir(i,1,n)
            fir(j,1,n)
                m[i][j]=flag*(i==j);
    }
    Mat Mul(Mat a,Mat b)
    {
        Mat ans(0);
        fir(i,1,n)
            fir(j,1,n)
                fir(k,1,n)
                    ans.m[i][j]=(ans.m[i][j]+a.m[i][k]*b.m[k][j]%mod)%mod;
        return ans;
    }
    Mat ksm(Mat a,ll b){
        Mat ans(1);
        while(b){
            if(b&1) ans=Mul(ans,a);
            a=Mul(a,a);
            b>>=1;
        }
        return ans;
    }
};

int main(){
    ll a[5];
    a[1]=2;a[2]=4;a[3]=6;a[4]=9;
    while(scanf("%lld%lld",&l,&mod)==2){
        if(l<=4) 
        {
            printf("%lld\n",a[l]%mod);
            continue;
        }
        Mat cur(0);
        cur.m[1][1]=cur.m[1][3]=cur.m[1][4]=1;
        cur.m[1][2]=0;
        fir(i,2,4)
            fir(j,1,4)
                cur.m[i][j]=1*(i-1==j);
        cur=cur.ksm(cur,l-4);
        ll ans=0;
        fir(i,1,4) ans=(ans+cur.m[1][i]*a[n-i+1]%mod)%mod;
        printf("%lld\n",ans);
    }
}
```

<hr>

### HDUOJ2793_SumOfTribonacciNumbers

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=2793

#### 💡


#### ✅  
  

```cpp
#include <map>
#include <set>
#include <stack>
#include <queue>
#include <cmath>
#include <string>
#include <vector>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <algorithm>
#define G 10.0
#define LNF 1e18
#define eps 1e-6
#define ll long long
#define INF 0x7FFFFFFF
#define PI acos(-1.0)
#define pb(x) push_back(x)
#define SP system("pause")
#define mm(a, b) memset(a, b, sizeof(a))
#define fir(i, a, n) for (ll i = a; i <= n; i++)
#define rif(i, a, n) for (ll i = a; i >= n; i--)
#define each_cass(cass) for (scanf("%d", &cass); cass; cass--)

using namespace std;

const int maxn = 100;
const int mod = 1e9 + 7;
const int n = 4;
struct Matrix
{
    ll m[maxn][maxn];
    Matrix(int flag)
    {
        fir(i, 1, n)
        {
            fir(j, 1, n)
            {
                m[i][j] = flag * (i == j);
            }
        }
    }
    Matrix Mul(Matrix a, Matrix b)
    {
        Matrix ans(0);
        fir(i, 1, n)
            fir(j, 1, n)
                fir(k, 1, n)
                    ans.m[i][j] = (ans.m[i][j] + a.m[i][k] * b.m[k][j]) % mod;
        return ans;
    }
    Matrix ksm(Matrix a, ll b)
    {
        Matrix ans(1);
        while (b)
        {
            if (b & 1)
                ans = Mul(ans, a);
            a = Mul(a, a);
            b >>= 1;
        }
        return ans;
    }
};
int main()
{
    ll fibo[5] = {0, 3, 1, 1, 1};
    ll l, r;
    while (scanf("%lld%lld", &l, &r) == 2)
    {
        //我从1开始算的，题目是从0开始的，所以位数++，但区间和应包含l，所以l--
        l++;
        r++;
        l--;
        //
        ll ans_l = 0;
        ll ans_r = 0;
        if (l <= 3)
            ans_l = l;
        else
        {
            Matrix cur_l(0);
            cur_l.m[1][1] = cur_l.m[1][2] = cur_l.m[1][3] = cur_l.m[1][4] = cur_l.m[2][2] = cur_l.m[2][3] = cur_l.m[2][4] = cur_l.m[3][2] = cur_l.m[4][3] = 1;
            cur_l = cur_l.ksm(cur_l, l - 3);
            fir(i, 1, 4)
            {
                ans_l = (ans_l + cur_l.m[1][i] * fibo[i] % mod) % mod;
            }
        }
        if (r <= 3)
            ans_r = r;
        else
        {
            Matrix cur_r(0);
            cur_r.m[1][1] = cur_r.m[1][2] = cur_r.m[1][3] = cur_r.m[1][4] = cur_r.m[2][2] = cur_r.m[2][3] = cur_r.m[2][4] = cur_r.m[3][2] = cur_r.m[4][3] = 1;
            cur_r = cur_r.ksm(cur_r, r - 3);
            fir(i, 1, 4)
            {
                ans_r = (ans_r + cur_r.m[1][i] * fibo[i] % mod) % mod;
            }
        }
        cout << (ans_r - ans_l + mod) % mod << endl;
    }
    return 0;
}
```

<hr>

### HDUOJ3306_AnotherKindOfFibonacci

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=3306

#### 💡


#### ✅  
  

```cpp
#include <map>
#include <set>
#include <stack>
#include <queue>
#include <cmath>
#include <string>
#include <vector>
#include <cstdio>
#include <cstring>
#include <iostream>
#include <algorithm>
#define G 10.0
#define LNF 1e18
#define eps 1e-6
#define ll long long
#define INF 0x7FFFFFFF
#define PI acos(-1.0)
#define pb(x) push_back(x)
#define SP system("pause")
#define mm(a, b) memset(a, b, sizeof(a))
#define fir(i, a, n) for (ll i = a; i <= n; i++)
#define rif(i, a, n) for (ll i = a; i >= n; i--)
#define each_cass(cass) for (scanf("%d", &cass); cass; cass--)

using namespace std;
const int mod = 1e4 + 7;
const int n = 4;
struct Matrix
{
    ll m[10][10];
    Matrix(int flag)
    {
        fir(i, 1, n)
            fir(j, 1, n)
                m[i][j] = flag * (i == j);
    }
    Matrix Mul(Matrix a, Matrix b)
    {
        Matrix ans(0);
        fir(i, 1, n)
            fir(j, 1, n)
                fir(k, 1, n)
                    ans.m[i][j] = (ans.m[i][j] + a.m[i][k] * b.m[k][j]) % mod;
        return ans;
    }
    Matrix ksm(Matrix a, ll b)
    {
        Matrix ans(1);
        while (b)
        {
            if (b & 1)
                ans = Mul(ans, a);
            a = Mul(a, a);
            b >>= 1;
        }
        return ans;
    }
};

int main(){
    ll N, X, Y;
    ll a[5] = {0ll, 2ll, 1ll, 1ll, 1ll};
    while(scanf("%lld%lld%lld",&N,&X,&Y)==3){
        N++;
        if (N <= 2)
        {
            printf("%lld\n", N);
            continue;
        }
        Matrix cur(0);
        cur.m[1][1] = cur.m[4][2] = 1;
        cur.m[1][2] = cur.m[2][2] = X * X % mod;
        cur.m[1][3] = cur.m[2][3] = 2 * X * Y % mod;
        cur.m[1][4] = cur.m[2][4] = Y * Y % mod;
        cur.m[3][3] = Y % mod;
        cur.m[3][2] = X % mod;
        cur = cur.ksm(cur, N-2);
        ll res = 0;
        for (int i = 1; i <= 4; i++)
            res = (res + cur.m[1][i] * a[i] % mod) % mod;
        printf("%lld\n", res);
    }
    return 0;
}
```

<hr>

### HDUOJ4565_SoEasy!

#### 🔗
<a href="https://acm.hdu.edu.cn/showproblem.php?pid=4565"><img src="https://i.loli.net/2021/08/17/qobTNGrjvJEdPDs.png"></a>  
	
#### 💡
根据二项式定理，可以设计两个式子  
<img src="https://latex.codecogs.com/svg.image?\begin{aligned}(a&plus;\sqrt{b})^n=An&plus;B_n\sqrt{b}\\(a-\sqrt{b})^n=A_n-B_n\sqrt{b}\end{aligned}&space;" title="\begin{aligned}(a+\sqrt{b})^n=An+B_n\sqrt{b}\\(a-\sqrt{b})^n=A_n-B_n\sqrt{b}\end{aligned} " />  
通过转化来的式子合并一下  
<img src="https://latex.codecogs.com/svg.image?\begin{aligned}(a&plus;\sqrt{b})^n&plus;(a-\sqrt{b})^n=2A_n\\(a&plus;\sqrt{b})^n=2A_n-(a-\sqrt{b})^n\end{aligned}&space;" title="\begin{aligned}(a+\sqrt{b})^n+(a-\sqrt{b})^n=2A_n\\(a+\sqrt{b})^n=2A_n-(a-\sqrt{b})^n\end{aligned} " />  
利用限制条件有  
<img src="https://latex.codecogs.com/svg.image?\begin{aligned}&space;&space;&space;\because&space;a-1<\sqrt[]{b}<a\\\therefore&space;0<a-\sqrt[]{b}<0\\\therefore&space;(a&plus;\sqrt[]{b})^n=2A_n&space;&space;-(a-\sqrt[]{b})^n\left\{\begin{aligned}&<2A_n\\&>2A_n-1\end{aligned}\right.&space;\Rightarrow\lceil(a&plus;\sqrt[]{b})^n\rceil=2A_n&space;\end{aligned}" title="\begin{aligned} \because a-1<\sqrt[]{b}<a\\\therefore 0<a-\sqrt[]{b}<0\\\therefore (a+\sqrt[]{b})^n=2A_n -(a-\sqrt[]{b})^n\left\{\begin{aligned}&<2A_n\\&>2A_n-1\end{aligned}\right. \Rightarrow\lceil(a+\sqrt[]{b})^n\rceil=2A_n \end{aligned}" />  
得到新式  
<img src="https://latex.codecogs.com/svg.image?\lceil&space;(a&plus;\sqrt[]{b})^n\rceil&space;=2A_n=(a&plus;\sqrt[]{b})^n&plus;(a-\sqrt{b})^n&space;&space;" title="\lceil (a+\sqrt[]{b})^n\rceil =2A_n=(a+\sqrt[]{b})^n+(a-\sqrt{b})^n " />  
令<img src="https://latex.codecogs.com/svg.image?x=a&plus;\sqrt[]{b},\quad&space;y=a-\sqrt[]{b}&space;&space;" title="x=a+\sqrt[]{b},\quad y=a-\sqrt[]{b} " />  
则<img src="https://latex.codecogs.com/svg.image?(a&plus;\sqrt[]{b})^n&plus;(a-\sqrt[]{b})^n=x^n&plus;y^n=(x&plus;y)(x^{n-1}&plus;y^{n-1})-xy(x^{n-2}&plus;y^{n-2})&space;&space;" title="(a+\sqrt[]{b})^n+(a-\sqrt[]{b})^n=x^n+y^n=(x+y)(x^{n-1}+y^{n-1})-xy(x^{n-2}+y^{n-2}) " />  
得到函数式<img src="https://latex.codecogs.com/svg.image?g(n)=x^n&plus;y^n,\quad&space;x&plus;y=2a,\quad&space;xy=a^2-b" title="g(n)=x^n+y^n,\quad x+y=2a,\quad xy=a^2-b" />  
同时有递推  
<img src="https://latex.codecogs.com/svg.image?g(n)=2a*g(n-1)-(a^2-b^2)*g(n-2)" title="g(n)=2a*g(n-1)-(a^2-b^2)*g(n-2)" />  
利用求得的递推式构建矩阵ksm即可，但要防止爆数据类型，可以使用大数


#### ✅
```java
import java.util.*;
import java.math.*;

public class Main {
	static BigInteger a, b, n, mod;
	static Mat res;
	public static void main ( String[] args ) {
		Scanner input = new Scanner(System.in);
		while ( input.hasNext() ) {
			a = input.nextBigInteger();
			b = input.nextBigInteger();
			n = input.nextBigInteger();
			mod = input.nextBigInteger();
			
			res = new Mat(0);
			res.m[0][0] = a.multiply(BigInteger.valueOf(2)).mod(mod); res.m[0][1] = b.subtract(a.multiply(a)).mod(mod);
			res.m[1][0] = BigInteger.ONE;             res.m[1][1] = BigInteger.ZERO;
			res = res.ksm(res, n.subtract(BigInteger.ONE));
			System.out.println(res.m[0][0].multiply(BigInteger.valueOf(2)).mod(mod).multiply(a).mod(mod).add(res.m[0][1].multiply(BigInteger.valueOf(2)).mod(mod)).mod(mod).add(mod).mod(mod));
		}
		input.close();
	}
}

class Mat {
	BigInteger[][] m = new BigInteger[3][3];
	Mat ( int flag ) {
		for ( int i = 0; i < 3; i ++ ) 
			for ( int j = 0; j < 3; j ++ ) {
				if ( i == j ) m[i][j] = BigInteger.valueOf(flag);
				else m[i][j] = BigInteger.ZERO;
			}
	}
	Mat Mul ( Mat a, Mat b ) {
		Mat res = new Mat(0);
		for ( int i = 0; i < 3; i ++ ) 
			for ( int j = 0 ;j < 3; j ++ ) 
				for ( int k = 0; k < 3; k ++ ) 
					res.m[i][j] = res.m[i][j].add(a.m[i][k].multiply(b.m[k][j]).mod(Main.mod)).mod(Main.mod);
		return res;
	}
	Mat ksm ( Mat a, BigInteger b ) {
		Mat res = new Mat(1);
		while ( b.compareTo(BigInteger.ZERO) == 1 ) {
			if ( b.mod(BigInteger.valueOf(2)).compareTo(BigInteger.ONE) == 0 ) res = Mul(res, a);
			a = Mul(a, a);
			b = b.divide(BigInteger.valueOf(2));
		}
		return res;
	}
};
```

<hr>

### HDUOJ6470_Count

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=6470

#### 💡


#### ✅  
  

```cpp
#include                                                  <map>
#include                                                  <set>
#include                                                <stack>
#include                                                <queue>
#include                                                <cmath>
#include                                               <string>
#include                                               <vector>
#include                                               <cstdio>
#include                                              <cstring>
#include                                             <iostream>
#include                                            <algorithm>
#define G                                                  10.0
#define LNF                                                1e18
#define eps                                                1e-6
#define ll                                            long long
#define INF                                          0x7FFFFFFF
#define PI                                           acos(-1.0)
#define pb(x)                                      push_back(x)
#define SP                                      system("pause")
#define mm(a, b)                        memset(a, b, sizeof(a))
#define fir(i, a, n)                for (ll i = a; i <= n; i++)
#define rif(i, a, n)                for (ll i = a; i >= n; i--)
#define each_cass(cass)  for (scanf("%d", &cass); cass; cass--)

using namespace std;

const int maxn = 15;
const int mod = 123456789;
ll n;
struct Mat{
    ll m[maxn][maxn];
    Mat(int flag){
        fir(i, 1, 6)
            fir(j, 1, 6)
                m[i][j] = flag * (i == j);
    }
    Mat Mul(Mat a,Mat b){
        Mat ans(0);
        fir(i, 1, 6)
            fir(j, 1, 6)
                fir(k, 1, 6)
                    ans.m[i][j] = (ans.m[i][j] + a.m[i][k] * b.m[k][j])%mod;
        return ans;
    }
    Mat ksm(Mat a,ll b){
        Mat ans(1);
        while(b){
            if(b&1)
                ans = Mul(ans, a);
            a = Mul(a, a);
            b >>= 1;
        }
        return ans;
    }
};
int main(){
    int cass;
    ll a[10];
    a[1] = 2, a[2] = 1, a[3] = 8, a[4] = 4, a[5] = 2, a[6] = 1;
    each_cass(cass){
        scanf("%lld", &n);
        if(n<3){
            printf("%lld\n", n);
            continue;
        }
        Mat cur(0);
        cur.m[1][1] = 1;
        cur.m[1][2] = 2;
        cur.m[1][3] = 1;
        cur.m[1][4] = 3;
        cur.m[1][5] = 3;
        cur.m[1][6] = 1;
        cur.m[2][1] = 1;
        cur.m[3][3] = 1;
        cur.m[3][4] = 3;
        cur.m[3][5] = 3;
        cur.m[3][6] = 1;
        cur.m[4][4] = 1;
        cur.m[4][5] = 2;
        cur.m[4][6] = 1;
        cur.m[5][5] = 1;
        cur.m[5][6] = 1;
        cur.m[6][6] = 1;
        cur = cur.ksm(cur, n - 2);
        ll ans = 0;
        
        for (int i = 1; i <= 6; i++)
            ans = (ans + a[i] * cur.m[1][i] % mod) % mod;
        printf("%lld\n", ans);
    }
    return 0;
}
```

<hr>

