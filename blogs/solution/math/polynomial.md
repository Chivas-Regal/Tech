---
title: 多项式
---

## 快速傅立叶变换

### 洛谷P1919_A*BProblem升级版

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1919"><img src="https://i.loli.net/2021/08/18/C23OHeJhcURbf6d.png"></a>

#### 💡
我们可以把A转变为一个多项式  
<img src="https://latex.codecogs.com/svg.image?A=A(x)=a_0x^0&plus;a_1x^1&plus;...&plus;a_nx^n" title="A=A(x)=a_0x^0+a_1x^1+...+a_nx^n" />  
B同理  
此时我们想求出两者的积，也就是把A(x)*B(x)  
然后得到的C(x)，对系数转换10进制即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>
#include <cmath>
#include <vector>

using namespace std;

const int N = 3000010;
const double PI = acos(-1.0);

int n, m;
struct Complex { // 复数结构体
        double x, y;
        Complex friend operator + ( Complex a, Complex b ) { return {a.x + b.x, a.y + b.y}; }
        Complex friend operator - ( Complex a, Complex b ) { return {a.x - b.x, a.y - b.y}; }
        Complex friend operator * ( Complex a, Complex b ) { return { a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x}; }
} a[N], b[N];
int rev[N];
int bit, tot;
int res[N];

inline void FFT ( Complex a[], int inv ) {
        for ( int i = 0; i < tot; i ++ ) if ( i < rev[i] ) swap(a[i], a[rev[i]]);
        for ( int mid = 1; mid < tot; mid <<= 1 ) { 
                Complex w1 = {cos(PI / mid), inv * sin(PI / mid)};
                for ( int i = 0; i < tot; i += mid * 2 ) {
                        Complex wk = {1, 0}; 
                        for ( int j = 0; j < mid; j ++, wk = wk * w1 ) {
                                Complex x = a[i + j], y = wk * a[i + j + mid];
                                a[i + j] = x + y, a[i + j + mid] = x - y;
                        }
                }
        }
}

int main() {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
#endif
        string sa, sb;
        cin >> sa >> sb; n = sa.size() - 1, m = sb.size() - 1;
        for ( int i = 0; i <= n; i ++ ) a[i].x = sa[n - i] - '0'; // 每一位拆出来给实部
        for ( int i = 0; i <= m; i ++ ) b[i].x = sb[m - i] - '0';
        while ( (1 << bit) < n + m + 1 ) bit ++;
        tot = 1 << bit;
        for ( int i = 0; i < tot; i ++ ) rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1));
        FFT( a, 1 ); FFT( b, 1 );
        for ( int i = 0; i < tot; i ++ ) a[i] = a[i] * b[i];
        FFT( a, -1 );
        
        int nxt = 0;
        for ( int i = 0; i <= n + m + 1; i ++ ) {
                res[i] = (nxt + (int)(a[i].x / tot + 0.5)) % 10;
                nxt = (nxt + (int)(a[i].x / tot + 0.5)) / 10;
        }
        int i = n + m + 1;
        while ( res[i] == 0 ) i --;
        for ( ; i >= 0; i -- ) cout << res[i]; // 整合给res输出
        return 0;
}
        
/*
FFT:            1524157891004055895123067864200200646789061868481059858831257643955833850367278502666927131954920793240938240966819899216931602390126499790993189428688835402911622011521694514727469596012471524
BigInteger:
        1524157891004055895125653722788645091233506312925504303275702088400278294811722947111371576399365237685382685411264343661376046834570944235437633873133279847355807870107294514727469596012471524
*/
```

<hr>

### 洛谷P3803_【模板】多项式乘法（FFT）

#### 🔗
<a href="https://www.luogu.com.cn/problem/P3803"><img src="https://i.loli.net/2021/10/06/DSZP5Nme9XAr3Yk.png"></a>

#### 💡
<a href="https://chivas-regal.github.io/%E6%95%B0%E5%AD%A6/2021/08/15/%E5%BF%AB%E9%80%9F%E5%82%85%E7%AB%8B%E5%8F%B6%E5%8F%98%E6%8D%A2FFT.html">Blog--例题讲解</a>

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 3000010;
const double PI = acos(-1.0);

int n, m;
struct Complex { // 复数结构体
        double x, y;
        Complex friend operator + ( Complex a, Complex b ) { return {a.x + b.x, a.y + b.y}; }
        Complex friend operator - ( Complex a, Complex b ) { return {a.x - b.x, a.y - b.y}; }
        Complex friend operator * ( Complex a, Complex b ) { return { a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x}; }
} a[N], b[N]; // 两个多项式的点表示
int rev[N];   // 分治时候的二进制表示对应的结果二进制表示，即反过来了
int bit, tot; // 二进制上的位数，总个数

inline void FFT ( Complex a[], int inv ) {
        for ( int i = 0; i < tot; i ++ ) if ( i < rev[i] ) swap(a[i], a[rev[i]]); // 变成正确的分治结果位置（只能换一半，防止换回来
        for ( int mid = 1; mid < tot; mid <<= 1 ) { // 枚举分块的块长度
                Complex w1 = {cos(PI / mid), inv * sin(PI / mid)}; // 这也是把整个单位圆平均切成mid个后出现的 \omega^1
                for ( int i = 0; i < tot; i += mid * 2 ) { // 两个两个块向后跳，枚举每一段
                        Complex wk = {1, 0}; // w(n, 0)单位一开始
                        for ( int j = 0; j < mid; j ++, wk = wk * w1 ) { // 把区间里面数枚举一遍，且wk要往上跑一格
                                Complex x = a[i + j], y = wk * a[i + j + mid]; // x把左边提出，y把右边提出
                                a[i + j] = x + y, a[i + j + mid] = x - y;      // 左边和右边重构
                        }
                }
        }
}

int main() {
        cin >> n >> m;
        for ( int i = 0; i <= n; i ++ ) cin >> a[i].x; // 把输入的系数塞入实部
        for ( int i = 0; i <= m; i ++ ) cin >> b[i].x; // 把输入的系数塞入虚部
        while ( (1 << bit) < n + m + 1 ) bit ++; // 次数最多到n+m+1，所以利用n+m+1记录二进制位数
        tot = 1 << bit; // 在二进制位数下计算刚好达不到的那个位数的数
        for ( int i = 0; i < tot; i ++ ) rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1)); // 每个rev[i]初始化为i的二进制逆转
        FFT( a, 1 ); FFT( b, 1 ); // 完成a和b的点表示
        for ( int i = 0; i < tot; i ++ ) a[i] = a[i] * b[i]; // 点表示法内完成两方程合并
        FFT( a, -1 ); // 逆向做一遍得到系数表示
        for ( int i = 0; i <= n + m; i ++ ) cout << (int)(a[i].x / tot + 0.5) << " "; // 防止精度丢失，要向上0.5再强转扔精度
        return 0;
}
```

<hr>

### CodeForces608B_HammingDistance Sum

#### 🔗
<a href="https://codeforces.com/problemset/problem/608/B"><img src="https://i.loli.net/2021/09/09/rladEgOGcVRpSxH.png"></a>

#### 💡
求每一步匹配不上的数量  
也就是不相似度的累加和  
我们可以求一下相似度，然后  
用所有都相似的相似度减去我们求到的相似度累加和就是不相似度的累加和  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <algorithm>
#include <map>
#include <cmath>
#include <vector>
using namespace std;
#define ll long long

const ll N = 1000010;
const double PI = acos(-1.0);
ll res[N];

ll n, m;
struct Complex {
        double x, y;
        Complex friend operator + ( Complex a, Complex b ) { return {a.x + b.x, a.y + b.y}; }
        Complex friend operator - ( Complex a, Complex b ) { return {a.x - b.x, a.y - b.y}; }
        Complex friend operator * ( Complex a, Complex b ) { return { a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x}; }
} a[N], b[N];
ll rev[N];
ll bit, tot; 
string sa, sb;

inline void FFT ( Complex a[], ll inv ) {
        for ( ll i = 0; i < tot; i ++ ) if ( i < rev[i] ) swap(a[i], a[rev[i]]);
        for ( ll mid = 1; mid < tot; mid <<= 1 ) {
                Complex w1 = {cos(PI / mid), inv * sin(PI / mid)};
                for ( ll i = 0; i < tot; i += mid * 2 ) {
                        Complex wk = {1, 0};
                        for ( ll j = 0; j < mid; j ++, wk = wk * w1 ) {
                                Complex x = a[i + j], y = wk * a[i + j + mid];
                                a[i + j] = x + y, a[i + j + mid] = x - y;
                        }
                }
        }
}

inline void Solve ( char c ) {
        for ( ll i = 0; i < N; i ++ ) a[i] = b[i] = {0, 0};
        for ( ll i = 0; i < n; i ++ ) a[i].x = (sa[i] == c);
        for ( ll i = 0; i < m; i ++ ) b[i].x = (sb[m - i - 1] == c);
        FFT(a, 1); FFT(b, 1);
        for ( ll i = 0; i < tot; i ++ ) a[i] = a[i] * b[i];
        FFT(a, -1);  
        for ( ll i = m - 1; i <= n + m - 2; i ++ ) {
                res[i] += (ll)(a[i].x / tot + 0.5);
        }
}

int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif

        cin >> sb >> sa;
        n = sa.size(), m = sb.size();
        while ( (1ll << bit) <= n + m - 2 ) bit ++; tot = 1ll << bit;
        for ( ll i = 0; i < tot; i ++ ) rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1));

        Solve('1'); Solve('0');
        ll RES = (n - m + 1) * m; // 都完美匹配上的情况
        for ( ll i = m - 1; i <= n - 1; i ++ ) RES -= res[i]; // 减去相似度
        cout << RES << endl;
}
```

<hr>

### HDUOJ1028_IgnatiusandthePrincessIII

#### 🔗
<a href="https://acm.hdu.edu.cn/showproblem.php?pid=1028"><img src="https://user-images.githubusercontent.com/78973908/129878123-d4c3d1ed-f1ad-47b1-a647-ea4bec8c8d37.png"></a>

#### 💡
本题就是一个母函数的模板题  
这里使用FFT优化  
  
1.构造本问题的生成函数  
<img src="https://latex.codecogs.com/svg.image?(1&plus;x&plus;x^2&plus;...&plus;x^n)*(1&plus;x^2&plus;x^4&plus;...&plus;x^{\left\lfloor\frac&space;n2\right&space;\rfloor&space;*&space;2})*(1&plus;x^3&plus;x^6&plus;...&plus;x^{\left\lfloor\frac&space;n3\right&space;\rfloor&space;*&space;3})&space;*..." title="(1+x+x^2+...+x^n)*(1+x^2+x^4+...+x^{\left\lfloor\frac n2\right \rfloor * 2})*(1+x^3+x^6+...+x^{\left\lfloor\frac n3\right \rfloor * 3}) *..." />  
  
2.转移为多项式问题  
<img src="https://latex.codecogs.com/svg.image?(1&plus;1x&plus;1x^2&plus;...&plus;1x^n)*(1&plus;0x^1&plus;1x^2&plus;0x^3&plus;1x^4&plus;...&plus;1x^{\left&space;\lfloor&space;\frac&space;n2\right&space;\rfloor*2})*...." title="(1+1x+1x^2+...+1x^n)*(1+0x^1+1x^2+0x^3+1x^4+...+1x^{\left \lfloor \frac n2\right \rfloor*2})*...." />  
  
每次合并创建的多项式给a  
对b不断地重启与清零，a在求得后对虚部与某些实部清零    
  
<span style="color: orange;">PS:小数据不推荐使用FFT，常数较大有些吃亏</span>

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>
#include <cmath>
#include <vector>

using namespace std;

const int N = 30010;
const double PI = acos(-1.0);

int n, m, num;
struct Complex { // 复数结构体
        double x, y;
        Complex () {}
        Complex ( double _x, double _y ) : x(_x), y(_y) {}
        Complex friend operator+(Complex a, Complex b) { return {a.x + b.x, a.y + b.y}; }
        Complex friend operator-(Complex a, Complex b) { return {a.x - b.x, a.y - b.y}; }
        Complex friend operator*(Complex a, Complex b) { return {a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x}; }
} a[N], b[N];
int rev[N];
int bit, tot;

inline void FFT(Complex a[], int inv) {
        for ( int i = 0; i < tot; i ++ ) if (i < rev[i]) swap(a[i], a[rev[i]]);
        for ( int mid = 1; mid < tot; mid <<= 1) {
                Complex w1 = {cos(PI / mid), inv * sin(PI / mid)};
                for ( int i = 0; i < tot; i += mid * 2 ) {
                        Complex wk = {1, 0};
                        for (int j = 0; j < mid; j++, wk = wk * w1) {
                                Complex x = a[i + j], y = wk * a[i + j + mid];
                                a[i + j] = x + y, a[i + j + mid] = x - y;
                        }
                }
        }
}

int main(){
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
#endif
        num = 120;
        for ( int i = 0; i <= num; i ++ ) a[i].x = 1;
        n = num;
        for ( int k = 2; k <= num; k ++ ){
                m = num / k * k;
                
                while ( (1 << bit) < n + m + 1 ) bit ++;
                tot = 1 << bit;
                
                // b的重启读入
                for ( int i = 0; i <= m; i ++ ) b[i].x = (i % k == 0), b[i].y = 0; // k的倍数为1，否则为0。 虚部固定为0
                for ( int i = m + 1; i < tot; i ++ ) b[i].x = 0, b[i].y = 0; // 后面的实部和虚部也要为0

                // rev数组的更新
                for ( int i = 0; i < tot; i ++ ) rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1)); // 二进制反转
                
                FFT(a, 1); FFT(b, 1);
                for ( int i = 0; i < tot; i ++ ) a[i] = a[i] * b[i];
                FFT(a, -1);
                
                // a的重启读入
                for ( int i = 0; i <= n + m; i ++ ) a[i] = {(double)(int)(a[i].x / tot + 0.5), 0}; // 读入后虚部重启为0
                for ( int i = n + m + 1; i <= N; i ++ ) a[i] = {0, 0}; // 实部虚部重启为0
                
                n += m; // 第一个多项式扩到n + m
        }
        
        while ( scanf("%d", &num) == 1 ){
                printf("%d\n", (int)(a[num].x + 0.5));
        }
}
```

<hr>

### HDUOJ1398_SquareCoins

#### 🔗
<a href="https://acm.hdu.edu.cn/showproblem.php?pid=1398"><img src="https://i.loli.net/2021/08/18/nEyv2pHq3jJmoZe.png"></a>

#### 💡
与<a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E6%95%B0%E5%AD%A6/%E5%A4%9A%E9%A1%B9%E5%BC%8F/%E5%BF%AB%E9%80%9F%E5%82%85%E7%AB%8B%E5%8F%B6%E5%8F%98%E6%8D%A2/Ignatius%20and%20the%20Princess%20III.md">FFT加速母函数</a>一样，这里构造的多项式的系数为1的条件是i%(k*k)==0  
同样的，在枚举下一个括号的最后一个1时，使用m=num/(k*k)*(k*k)

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <cstring>
#include <algorithm>
#include <cmath>
#include <vector>

using namespace std;

const int N = 10210;
const double PI = acos(-1.0);

int n, m, num;
struct Complex { // 复数结构体
        double x, y;
        Complex () {}
        Complex ( double _x, double _y ) : x(_x), y(_y) {}
        Complex friend operator+(Complex a, Complex b) { return {a.x + b.x, a.y + b.y}; }
        Complex friend operator-(Complex a, Complex b) { return {a.x - b.x, a.y - b.y}; }
        Complex friend operator*(Complex a, Complex b) { return {a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x}; }
} a[N], b[N];
int rev[N];
int bit, tot;

inline void FFT ( Complex a[], int inv ) {
        for ( int i = 0; i < tot; i ++ ) if ( i < rev[i] ) swap(a[i], a[rev[i]]);
        for ( int mid = 1; mid < tot; mid <<= 1 ) {
                Complex w1 = {cos(PI / mid), inv * sin(PI / mid)};
                for ( int i = 0; i < tot; i += mid * 2 ) {
                        Complex wk = {1, 0};
                        for ( int j = 0; j < mid; j ++, wk = wk * w1 ) {
                                Complex x = a[i + j], y = wk * a[i + j + mid];
                                a[i + j] = x + y, a[i + j + mid] = x - y;
                        }
                }
        }
}

int main(){
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
#endif
        num = 300;
        for ( int i = 0; i <= num; i ++ ) a[i].x = 1;
        n = num;
        for ( int k = 2; k <= 17; k ++ ){
                m = num / (k * k) * (k * k);
                
                while ( (1 << bit) < n + m + 1 ) bit ++;
                tot = 1 << bit;
                
                // b的重启读入
                for ( int i = 0; i <= m; i ++ ) b[i].x = (i % (k * k) == 0), b[i].y = 0; // k的倍数为1，否则为0。 虚部固定为0
                for ( int i = m + 1; i < tot; i ++ ) b[i].x = 0, b[i].y = 0; // 后面的实部和虚部也要为0

                // rev数组的更新
                for ( int i = 0; i < tot; i ++ ) rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1)); // 二进制反转
                
                FFT(a, 1); FFT(b, 1);
                for ( int i = 0; i < tot; i ++ ) a[i] = a[i] * b[i];
                FFT(a, -1);
                
                // a的重启读入
                for ( int i = 0; i <= n + m; i ++ ) a[i] = {(double)(int)(a[i].x / tot + 0.5), 0}; // 读入后虚部重启为0
                for ( int i = n + m + 1; i <= N; i ++ ) a[i] = {0, 0}; // 实部虚部重启为0
                
                n += m; // 第一个多项式扩到n + m
        }
        
        while ( scanf("%d", &num) == 1 && num ){
                printf("%d\n", (int)(a[num].x + 0.5));
        }
}





/*

int elem[18] = {0, 1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289};

*/
```

<hr>

### HDUOJ2087_剪花布条

#### 🔗
<a href="https://acm.hdu.edu.cn/showproblem.php?pid=2087"><img src="https://i.loli.net/2021/08/22/i15QuOEZDmw2jGH.png"></a>

#### 💡
本题可以使用fft去写  
对每个字符c建立一个多项式，系数表示当前位是不是c，如果是为1，不是为0  
b字符串反着建之后，每一次匹配可以与a的每一位形成一个固定的指数  
然后直接访问指数得到c字符的贡献值即可  
如果贡献值满m，那么就匹配成功，指针向后移动m位  
否则匹配不成功，指针移动一位  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <map>
#include <algorithm>
#include <string>
#include <cstring>

using namespace std;


const int N = 3010;
const double PI = acos(-1.0);

int n, m;
struct Complex {
        double x, y;
        Complex friend operator + ( Complex a, Complex b ) { return {a.x + b.x, a.y + b.y}; }
        Complex friend operator - ( Complex a, Complex b ) { return {a.x - b.x, a.y - b.y}; }
        Complex friend operator * ( Complex a, Complex b ) { return { a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x}; }
} a[N], b[N]; 
int rev[N]; 
int bit, tot; 

inline void FFT ( Complex a[], int inv ) {
        for ( int i = 0; i < tot; i ++ ) if ( i < rev[i] ) swap(a[i], a[rev[i]]);
        for ( int mid = 1; mid < tot; mid <<= 1 ) { 
                Complex w1 = {cos(PI / mid), inv * sin(PI / mid)}; 
                for ( int i = 0; i < tot; i += mid * 2 ) {
                        Complex wk = {1, 0}; 
                        for ( int j = 0; j < mid; j ++, wk = wk * w1 ) { 
                                Complex x = a[i + j], y = wk * a[i + j + mid]; 
                                a[i + j] = x + y, a[i + j + mid] = x - y;      
                        }
                }
        }
}

string sa, sb;
int res[N];

inline void Solve ( char c ) {
        for ( int i = 0; i < N; i ++ ) a[i] = b[i] = {0, 0};
        for ( int i = 0; i < n; i ++ ) a[i].x = sa[i] == c;
        for ( int i = 0; i < m; i ++ ) b[m - i - 1].x = sb[i] == c;
        FFT(a, 1); FFT(b, 1);
        for ( int i = 0; i <= m + n - 2; i ++ ) a[i] = a[i] * b[i];
        FFT(a, -1);
        for ( int i = m - 1; i <= n - 1; i ++ ) res[i] += (int)(a[i].x / tot + 0.5);
}

int main () {

#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif

        while ( cin >> sa && sa != "#" ) { cin >> sb;
                
                memset( res, 0, sizeof res ); // 重启一下res数组
                memset( rev, 0, sizeof rev ); 
                tot = 0, bit = 0;
                
                n = sa.size(), m = sb.size();
                // 搭建rev数组
                while ( (1ll << bit) <= n + m - 2 ) bit ++; tot = 1ll << bit;
                for ( int i = 0; i <= n + m - 2; i ++ ) rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1));
                
                // 把出现的字符扔进去
                map<char, int> chr;
                for ( int i = 0; i < n; i ++ ) chr[sa[i]] ++;
                for ( int i = 0; i < m; i ++ ) chr[sb[i]] ++;
                for ( auto i : chr ) Solve(i.first); // 各跑一遍积累贡献值
                
                int RES = 0;
                int id = m - 1; while ( id <= n - 1 ) {
                        if ( res[id] == m ) id += m, RES ++;
                        else id ++;
                }
                cout << RES << endl;

        }
}
```

<hr>

### ICPC2021大田H_RockPaperScissors

#### 🔗
<a href="https://codeforces.com/gym/101667/attachments"><img src="https://i.loli.net/2021/08/21/Y7k9Mf3lQIoJaEe.png"></a>

#### 💡
本题是用于解决字符串匹配相似度的  
本题最朴素的写法就是暴力匹配，然后时间是O(nm)，稳T  
最显眼的还是只有三个字符，字符串在一位一位匹配的时候，很像多项式卷积的过程，用到一位对应一位求解  
那么其实可以反转一下b串，让这个对应刚好使得指数为定值  
那么我们也可以利用多项式卷积，把一个字符串以某个字符匹配时的相似度做一个多项式  
即我们在以字符c匹配时令一个位置的系数为[s[i]=c]  
那么可以构造出这样一个多项式  
<img src="https://latex.codecogs.com/svg.image?\begin{aligned}&a_0x^0&plus;a_1x^1&plus;a_2x^2&plus;a_3x^3\\&b_0x^2&plus;x_1x^1&plus;x_2x^0&space;\end{aligned}&space;" title="\begin{aligned}&a_0x^0+a_1x^1+a_2x^2+a_3x^3\\&b_0x^2+x_1x^1+x_2x^0 \end{aligned} " />  
这样在第一次匹配时，即寻找指数为2的卷积结果。第二次匹配时寻找指数为3的卷积结果...  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <cmath>
#include <algorithm>
using namespace std;

const int N = 300010;
const double PI = acos(-1.0);
int res[N];

int n, m;
struct Complex { // 复数结构体
        double x, y;
        Complex friend operator + ( Complex a, Complex b ) { return {a.x + b.x, a.y + b.y}; }
        Complex friend operator - ( Complex a, Complex b ) { return {a.x - b.x, a.y - b.y}; }
        Complex friend operator * ( Complex a, Complex b ) { return { a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x}; }
} a[N], b[N];
int rev[N];
int bit, tot; 
string sa, sb;

inline void FFT ( Complex a[], int inv ) {
        for ( int i = 0; i < tot; i ++ ) if ( i < rev[i] ) swap(a[i], a[rev[i]]);
        for ( int mid = 1; mid < tot; mid <<= 1 ) {
                Complex w1 = {cos(PI / mid), inv * sin(PI / mid)};
                for ( int i = 0; i < tot; i += mid * 2 ) {
                        Complex wk = {1, 0};
                        for ( int j = 0; j < mid; j ++, wk = wk * w1 ) {
                                Complex x = a[i + j], y = wk * a[i + j + mid];
                                a[i + j] = x + y, a[i + j + mid] = x - y;
                        }
                }
        }
}

inline void Solve ( char c ) {
        for ( int i = 0; i < N; i ++ ) a[i] = b[i] = {0, 0};
        for ( int i = 0; i < n; i ++ ) a[i].x = (sa[i] == c);
        for ( int i = 0; i < m; i ++ ) b[i].x = (sb[m - i - 1] == c);
        FFT(a, 1); FFT(b, 1);
        for ( int i = 0; i < tot; i ++ ) a[i] = a[i] * b[i];
        FFT(a, -1);  
        for ( int i = m - 1; i <= n + m - 2; i ++ ) {
                res[i] += (int)(a[i].x / tot + 0.5);
        }
}

int main () {
        cin >> n >> m >> sa >> sb;
        for ( int i = 0; i < m; i ++ ) {
                if ( sb[i] == 'S' ) sb[i] = 'P';
                else if ( sb[i] == 'P' ) sb[i] = 'R';
                else sb[i] = 'S';
        }
        while ( (1ll << bit) <= n + m - 2 ) bit ++; tot = 1ll << bit;
        for ( int i = 0; i < tot; i ++ ) rev[i] = (rev[i >> 1] >> 1) | ((i & 1) << (bit - 1));

        Solve('R'); Solve('S'); Solve('P');
        int RES = 0;
        for ( int i = m - 1; i <= n + m - 2; i ++ ) RES = max ( RES, res[i] );
        cout << RES << endl;
}
```

<hr>

## 拉格朗日插值

### ICPC2021台湾省赛E_EatCoin

#### 🔗
<a href="https://codeforces.com/gym/103373/problem/E"><img src="https://s2.loli.net/2022/01/14/9Ut3VzCna2kwZEG.png "></a>

#### 💡
首先我们化简一下问题  
第  <img src="https://latex.codecogs.com/svg.image?\inline&space;d" title="\inline d" /> 天算法会消耗  <img src="https://latex.codecogs.com/svg.image?\inline&space;p" title="\inline p" /> ，获得  <img src="https://latex.codecogs.com/svg.image?\inline&space;qd^5" title="\inline qd^5" />   
也就是若算法可以执行，那么将获得  <img src="https://latex.codecogs.com/svg.image?\inline&space;-p+qd^5" title="\inline -p+qd^5" />  
若开始前有  <img src="https://latex.codecogs.com/svg.image?\inline&space;x" title="\inline x" /> ，执行  <img src="https://latex.codecogs.com/svg.image?\inline&space;y" title="\inline y" /> 天后会成为  <img src="https://latex.codecogs.com/svg.image?\inline&space;x-py+q\sum\limits_{i=1}^yi^5" title="\inline x-py+q\sum\limits_{i=1}^yi^5" />  
我们要让这个值  <img src="https://latex.codecogs.com/svg.image?\inline&space;\ge10^{99}" title="\inline \ge10^{99}" />  
同时要保证  <img src="https://latex.codecogs.com/svg.image?\inline&space;\forall&space;j\in[0,y],x-pj+q\sum\limits_{i=1}^ji^5\ge&space;p" title="\inline \forall&space;j\in[0,y],x-pj+q\sum\limits_{i=1}^ji^5\ge&space;p" /> ，不然就继续不了算法了，（左侧如果开始上升那么就可以保证了  
  
我们求  <img src="https://latex.codecogs.com/svg.image?\inline&space;\sum\limits_{i=1}^ji^5" title="\inline \sum\limits_{i=1}^ji^5" /> 可以用求[自然数幂和](http://www.chivas-regal.top/%E6%95%B0%E5%AD%A6/2021/11/19/%E6%8B%89%E6%A0%BC%E6%9C%97%E6%97%A5%E6%8F%92%E5%80%BC%E6%B3%95.html#%E5%BA%94%E7%94%A8%E8%87%AA%E7%84%B6%E6%95%B0%E7%9A%84%E5%B9%82%E5%92%8C)的方式进行拉格朗日插值，这里  <img src="https://latex.codecogs.com/svg.image?\inline&space;k" title="\inline k" /> 不大，所以就是常数复杂度  
我们求  <img src="https://latex.codecogs.com/svg.image?\inline&space;x" title="\inline x" /> 可以使用第二个限制进行二分  
求  <img src="https://latex.codecogs.com/svg.image?\inline&space;y" title="\inline y" /> 可以使用第一个进行二分  
  
数很大，开java的`BigInteger`

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
public class Main{
        static int N = 100;
        static BigInteger zero = BigInteger.ZERO;
        static BigInteger one = BigInteger.ONE;
        static BigInteger two = BigInteger.valueOf(2);
        static BigInteger six = BigInteger.valueOf(6);
        static BigInteger ten = BigInteger.TEN;
        static BigInteger five = BigInteger.valueOf(5);

        static BigInteger ksm ( BigInteger a, BigInteger b ) {
                BigInteger res = one;
                while ( b.compareTo(zero) == 1 ) {
                        if ( b.mod(two).compareTo(one) == 0 ) {
                                res = res.multiply(a);
                        } a = a.multiply(a);
                        b = b.divide(two);
                } return res;
        }
        static BigInteger[] fac = new BigInteger[N];
        static BigInteger[] pre = new BigInteger[N];
        static BigInteger[] suf = new BigInteger[N];
        static BigInteger pownk ( BigInteger n, int k ) {
                BigInteger y = zero, up = zero, down = zero, res = zero;
                fac[0] = pre[0] = suf[k + 3] = one;
                for ( int i = 1; i <= k + 2; i ++ ) {
                        pre[i] = pre[i - 1].multiply(n.subtract(BigInteger.valueOf(i)));
                        fac[i] = fac[i - 1].multiply(BigInteger.valueOf(i));
                }
                for ( int i = k + 2; i >= 1; i -- ) {
                        suf[i] = suf[i + 1].multiply(n.subtract(BigInteger.valueOf(i)));
                }
                for ( int i = 1; i <= k + 2; i ++ ) {
                        y = y.add(ksm(BigInteger.valueOf(i), BigInteger.valueOf(k)));
                        up = pre[i - 1].multiply(suf[i + 1]);
                        down = fac[i - 1].multiply(fac[k + 2 - i]).multiply(((k - i) & 1) > 0 ? zero.subtract(one) : one);
                        res = res.add(y.multiply(up).divide(down));
                }
                return res;
        }
        static BigInteger q, p;
        static BigInteger x, y;

        static boolean check ( BigInteger j ) {
                BigInteger a = x.subtract(p.multiply(j)).add(q.multiply(pownk(j, 5)));
                BigInteger b = ksm(ten, BigInteger.valueOf(99));
                if ( a.compareTo(b) >= 0 ) return true;
                return false;
        }
        static boolean chk_x ( BigInteger xx ) {
                boolean flg = false;
                for ( Long i = Long.valueOf(0);; i ++ ) {
                        if ( xx.subtract(p.multiply(BigInteger.valueOf(i))).add(q.multiply(pownk(BigInteger.valueOf(i), 5))).compareTo(p) == -1 ) break;
                        if ( i > Long.valueOf(0) && xx.subtract(p.multiply(BigInteger.valueOf(i))).add(q.multiply(pownk(BigInteger.valueOf(i), 5))).compareTo(xx.subtract(p.multiply(BigInteger.valueOf(i - 1))).add(q.multiply(pownk(BigInteger.valueOf(i - 1), 5)))) == 1 ) { flg = true; break;}
                }
                return flg;
        }

        public static void main (String[] args) {
                Scanner input = new Scanner(System.in);
                p = input.nextBigInteger();
                q = input.nextBigInteger();
                x = p;
                y = zero;
                
                BigInteger l = zero, r = ksm(ten, BigInteger.valueOf(20));
                while ( l.compareTo(r) == -1 ) {
                        BigInteger mid = l.add(r).divide(two);
                        if ( chk_x(mid) ) r = mid;
                        else l = mid.add(one);
                }
                x = l;

                l = zero; r = ksm(ten, BigInteger.valueOf(30));
                while ( l.compareTo(r) == -1 ) {
                        BigInteger mid = l.add(r).divide(two);
                        if ( check(mid) ) r = mid;
                        else l = mid.add(one);
                }
                y = l;
                System.out.println(x + "\n" + y);
        }
}
```

<hr>
