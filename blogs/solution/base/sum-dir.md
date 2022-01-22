---
title: 前缀-差分
---

## 洛谷T214799_夏摩山谷II

#### 🔗
<a href="https://www.luogu.com.cn/problem/T214799"><img src="https://img-blog.csdnimg.cn/c5d74cf1cb1c4ce3b25f39da3801dc81.png"></a>

#### 💡

::: tip
本题在 [$T214551$ 《夏摩山谷》](https://www.luogu.com.cn/problem/T214551) 中本身是一个推公式题，后来被 [There,hello 大大]([《夏摩山谷》题解 - There Hello](https://blog.therehello.top/xia_mo_shan_gu/)) 发现了新的思考方式，我在此思考方式上进行深化拓展，便诞生了 $Hard\;version$  
:::  
  
我们先看一个二重传递  

$$\begin{aligned}
&\sum\limits_{i=1}^n\sum\limits_{j=1}^ij\\=&\sum\limits_{i=1}^n\sum\limits_{j=1}^i\sum\limits_{k=1}^j1
\end{aligned}$$    
将其化为了三重传递  
  
我们发现在这里 $j$ 是 $1$ 的第 $j$ 个前缀和， $j$ 是其上界  
所以对于最内重，其值为 $S_1\{\}$    
我们令 $1=S_0$ ，则 $S_{1_j}=\sum\limits_{k=1}^jS_{0_k}$  
  
而对于第二重，它的值是 $...\sum\limits_{j=1}^iS_{1_j}$   
有了上面的基础，我们不难看出这是一个关于 $S_1\{\}$ 的第 $i$ 个前缀和，$i$ 是上界  
所以对于第二重，其值为 $S_2\{\}$  
$S_{2_i}=\sum\limits_{j=1}^iS_{1_j}$    
  
对于第三重，同理，这是<mark>一个关于 $S_2\{\}$ 的第 $n$ 个前缀和</mark>， $n$ 是上界  
  
<b>模型建立</b>  
我们思考一下<span style="color: red;">什么时候会产生这种前缀和关系且第一重是 $1$ 的</span>  
对于上述的前缀和公式 $S[i][j]=s[i][j-1]+s[i-1][j-1]$  
可以想到这个东西是杨辉三角的转置矩阵的递推式  
  
那么对于一个 $k$ 重，其上界为 $n$ 的宁静公式  
可以变成一个 $k+1$ 重从 $\sum\limits_{a_{k+1}=1}^{a_k}1$ 开始的式子  
  
对于这样的式子，我们更是对 $k$ 进行了 $+1$ 的延伸，所以其值在杨辉三角的第 $k+1$ 列  
因 $n$ 为每一个正整数都是成立且具备值的，所以应从第 $k+1$ 列的从上往下第一个 $1$ 开始走 $n$ 个行，即为 $k+1+n-1=k+n$ 行  
  
那么便有了答案：$C_{k+n}^{k+1}\%mod$  
  
::: danger
$n$ 和 $k$ 都很大，而模数很小，这是一个突破口，所以应用 $Lucas$ 定理求组合数
:::
  
#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
ll n, mod, k;

inline ll ksm ( ll a, ll b ) { ll res = 1; while ( b ) { if ( b & 1 ) res = res * a % mod; a = a * a % mod; b >>= 1; } return res; }
inline ll inv ( ll x ) { return ksm(x, mod - 2); }

inline ll C(ll n, ll m) {
        ll up = 1, down = 1;
        for ( ll i = 0; i < m; i ++ ) {
                up = up * (n - i) % mod;
                down = down * (i + 1) % mod;
        }
        return up * inv(down) % mod;
}
inline ll Lucas ( ll n, ll m ) {
        if ( !m ) return 1ll;
        return C(n % mod, m % mod) * Lucas(n / mod, m / mod) % mod;
}

int main () {
        ios::sync_with_stdio(false);
        cin >> n >> mod >> k;
        cout << Lucas(n + k, k + 1) << endl;
}
```

<hr>

## ABC233F_ParenthesisChecking

#### 🔗
<a href="https://atcoder.jp/contests/abc223/tasks/abc223_f"><img src="https://user-images.githubusercontent.com/78973908/137866247-01669ac7-7e42-4d9b-b8c2-699b3f2d97cc.png"></a>

#### 💡
**括号匹配的本质是两两相消。**  
对于每一个位置的点重定义一下它的权值：`'(' = 1，')' = -1`  
在累加过程中，<img src="https://latex.codecogs.com/svg.image?1" title="1" />可以和<img src="https://latex.codecogs.com/svg.image?-1" title="-1" />相消为<img src="https://latex.codecogs.com/svg.image?0" title="0" />，所以**计算总贡献**  

那么可以记录一个**权值前缀和**  
那么对于每一个区间，如果其中的**最小值**小于 <img src="https://latex.codecogs.com/svg.image?l-1" title="l-1" /> 的前缀和的话，那么就一定是不匹配的（最小值的位置前右括号太多了  
当然如果本身 <img src="https://latex.codecogs.com/svg.image?l-1" title="l-1" /> 的前缀和不等于 <img src="https://latex.codecogs.com/svg.image?r" title="r" /> 的前缀和就也是不匹配的  
这里的最小值可以使用线段树进行维护，修改便直接在线段树上修改如果本身是'('，修改后区间-2，否则+2  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <set>
#include <map>
#include <deque>

using namespace std;

#define ll long long

const int N = 2e5 + 10;
char s[N];
int a[N], n, q;

namespace SegmentTree {
        struct Sgtr { int val, lazy; } sgtr[N << 2];
        inline void push_Up ( int rt ) {
                sgtr[rt].val = min ( sgtr[rt << 1].val, sgtr[rt << 1 | 1].val );
        }
        inline void push_Down ( int l, int r, int rt ) {
                if ( !sgtr[rt].lazy ) return;
                sgtr[rt << 1].val += sgtr[rt].lazy;
                sgtr[rt << 1 | 1].val += sgtr[rt].lazy;
                sgtr[rt << 1].lazy += sgtr[rt].lazy;
                sgtr[rt << 1 | 1].lazy += sgtr[rt].lazy;
                sgtr[rt].lazy = 0;
        }
        inline void Build ( int l, int r, int rt ) {
                if ( l == r ) { sgtr[rt].val = a[l]; return; }
                int mid = (l + r) >> 1;
                Build ( l, mid, rt << 1 );
                Build ( mid + 1, r, rt << 1 | 1 );
                push_Up ( rt ); 
        }
        inline void Update ( int a, int b, int c, int l, int r, int rt ) {
                if ( a <= l && r <= b ) { sgtr[rt].lazy += c, sgtr[rt].val += c; return; }
                if ( a > r || b < l ) return;
                int mid = (l + r) >> 1;
                push_Down ( l, r, rt );
                Update ( a, b, c, l, mid, rt << 1 );
                Update ( a, b, c, mid + 1, r, rt << 1 | 1 );
                push_Up ( rt );
        }
        inline int Query ( int a, int b, int l, int r, int rt ) {
                if ( a <= l && r <= b ) return sgtr[rt].val;
                if ( a > r || b < l )   return N;
                int mid = (l + r) >> 1;
                push_Down ( l, r, rt );
                return min ( Query ( a, b, l, mid, rt << 1 ), Query ( a, b, mid + 1, r, rt << 1 | 1) ); 
        }
} using namespace SegmentTree;

int main () {
        ios::sync_with_stdio(false);
        cin >> n >> q >> (s + 1);
        for ( int i = 1; i <= n; i ++ ) 
                if ( s[i] == '(' ) a[i] = a[i - 1] + 1;
                else               a[i] = a[i - 1] - 1;
        Build ( 1, n, 1 );
        while ( q -- ) {
                int op, l, r; cin >> op >> l >> r;
                if ( op == 1 ) {
                        if ( s[l] == s[r] ) continue;
                        if ( s[l] == '(' ) Update ( l, r - 1, -2, 1, n, 1 );
                        else               Update ( l, r - 1,  2, 1, n, 1 );
                        swap ( s[l], s[r] );
                } else {
                        int L = l == 1 ? 0 : Query ( l - 1, l - 1, 1, n, 1 ), R = Query ( r, r, 1, n, 1 );
                        if ( L != R ) { cout << "No" << endl; continue; }
                        if ( Query ( l, r, 1, n, 1 ) < L ) { cout << "No" << endl; continue; }
                        cout << "Yes" << endl;
                }
        }
}
```

<hr>

## AcWing3494_最大的和

#### 🔗
<a href="https://www.acwing.com/problem/content/3496/"><img src="https://img-blog.csdnimg.cn/2021061811560530.png"></a>

#### 💡
我们想获取区间内选了之后的sum变化，即选取能让答案增加最多的区间  
因此我们就需要两个数值来对比  
  
可以使用两个前缀和  
一个是只记录选了1的数的前缀和，一个是记录全选的前缀和  
两个前缀和在k的区间内的差值，就是这k个数从只选1到全选之后所能做出的贡献  
记录贡献最大值，然后加上第一个前缀和[n]  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 1e5 + 10;

ll n, k;
ll a[N], b[N], sum1[N], sum2[N];
ll res;

int main(){
    read(n); read(k);
    for(int i = 1; i <= n; i ++) read(a[i]);
    for(int i = 1; i <= n; i ++) read(b[i]), 
    	sum1[i] = sum1[i - 1] + a[i] * b[i], 
    	sum2[i] = sum2[i - 1] + a[i];

    for(int i = k; i <= n; i ++) 
    	res = MAX(res, (sum2[i] - sum2[i - k]) - (sum1[i] - sum1[i - k]));
    res += sum1[n];
    
    write(res);
    return 0;
}
```

<hr>

## CodeForces608B_HammingDistanceSum

#### 🔗
<a href="https://codeforces.com/problemset/problem/608/B"><img src="https://img-blog.csdnimg.cn/1ad09f3dcdae48929edc16088cf4ac6d.png"></a>

#### 💡
求一位一位匹配下的不相似度和  
那么考虑一下可以计算一下a串每个位置的元素对这个匹配度的贡献值  
锁定一下这个位置都能和b串的哪个区间的字符匹配  
计算可得是[i,b.size()-a.size()+i]的区间匹配  
  
如果当前a[i]是'1'，那么我们统计一下这个区间内的'0'的个数  
如果当前a[i]是'0'，那么我们统计一下这个区间内的'1'的个数  
  
预处理一下前缀和，然后对于枚举每个b[i]求一下对应的区间和累加即可  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#define ll long long

using namespace std;

const int N = 2e5 + 10;
ll sum[2][N], res;
// sum[i][j]表示j以前i出现的个数

int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif
        string a, b; cin >> a >> b;
        a = "0" + a,   b = "0" + b;

        for ( int i = 1; i < b.size(); i ++ ) 
                sum[1][i] = sum[1][i - 1] + (b[i] == '1'),
                sum[0][i] = sum[0][i - 1] + (b[i] == '0');

        for ( int i = 1; i <= a.size(); i ++ ) {
                if ( a[i] == '1' ) res = res + sum[0][b.size() - a.size() + i] - sum[0][i - 1];
                else               res = res + sum[1][b.size() - a.size() + i] - sum[1][i - 1];
        }
        cout << res << endl;
        return 0;
}
```

<hr>

## CodeForces611C_NewYearAndDomino

#### 🔗
<a href="https://codeforces.com/problemset/problem/611/C"><img src="https://user-images.githubusercontent.com/78973908/132656458-7e71dbd7-a4b8-4f48-b75e-07a89960f037.png"></a>

#### 💡
因为行和列地位一样，接下来说行的性质也就是列的性质  
  
对于每个区间[l,r]我们查询的时候对于[l,l+1]和[l+1,l]的摆放方式其实是一样的，所以我们可以默认这个牌向左（上）摆放  
而摆放方式只有两种：左和上  
那么我们可以做两套前缀和  
sumrow[i][j]表示第i行的前j个格子可以横着放多少个牌  
sumcol[i][j]表示第j列第前i个格子可以竖着放多少个牌  
那么对于初始化的时候，如果当前格子和上一个格子有一个是"#"那么都不能累加，因为都没法放  
  
然后查询的时候，直接查sum[][r]-sum[][l]或sum[r][]-sum[l][]即可  
因为我们不需要第l个，它没法贡献  
每一行和每一列都遍历一次累加计算一下  
  
  
#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <algorithm>
#include <map>
#include <cmath>
#include <vector>
#include <list>
using namespace std;
#define ll long long
#define eps 1e-12

const ll N = 510;
ll sumcol[N][N], sumrow[N][N];

int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif
        ll n, m; cin >> n >> m;
        string Map[N];
        for ( ll i = 0; i < n; i ++ ) cin >> Map[i];
        for ( ll i = 0; i < n; i ++ ) {
                for ( ll j = 1; j < m; j ++ ) {
                        if ( Map[i][j - 1] == '.' && Map[i][j] == '.' ) sumrow[i][j] = sumrow[i][j - 1] +  1;
                        else sumrow[i][j] = sumrow[i][j - 1];  
                }
        }
        for ( ll j = 0; j < m; j ++ ) {
                for ( ll i = 1; i < n; i ++ ) {
                        if ( Map[i - 1][j] == '.' && Map[i][j] == '.' ) sumcol[i][j] = sumcol[i - 1][j] +  1;
                        else sumcol[i][j] = sumcol[i - 1][j];  
                }
        }
        ll q; cin >> q;
        while ( q -- ) {
                ll res =  0;
                ll x1, y1, x2, y2; cin >> x1 >> y1 >> x2 >> y2;
                x1 --, y1 --, x2 --, y2 --;
                for ( ll i = x1; i <= x2; i ++ ) res += sumrow[i][y2] - sumrow[i][y1];
                for ( ll i = y1; i <= y2; i ++ ) res += sumcol[x2][i] - sumcol[x1][i];
                cout << res << endl;
        }
}
```

<hr>

## CodeForces612D_TheUnionOfK-Segments

#### 🔗
<a href="https://codeforces.com/problemset/problem/612/D"><img src="https://i.loli.net/2021/09/09/jmbocQT6YXziOwB.png"></a>

#### 💡
这道题可以看作一个个[l,r]铺布，看最好多少  
能很快想到可以用数组去模拟高度  
范围这么大就告辞  
那么就可以使用差分数组的思想：只改两个点打到区间修改的目的  
由于全放在一个完整图的数组里面我们遍历的时候不好遍历，所以数组内只放置l和r的位置  
  
对l和r都存在的数组进行升序排序，并设一个记录高度的值
对于一个l，如果在这个位置+1之后是k，说明是一个满足题意的区间的开始，塞入答案  
对于一个r，如果在这个位置-1之前是k，说明是一个满足题意的区间的结束，塞入答案  
但要考虑两相邻区间贴着的情况，也就是同一个点存在一个l也存在一个r，那么此时我们可以先去使用l进行高度+1再用r进行高度-1，这样就安全了  
  
输出的时候一次输出两个就行了  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <algorithm>
#include <map>
#include <cmath>
#include <vector>
#include <cstring>
#include <list>
using namespace std;
#define ll long long
const ll mod = 998244353;
const double PI = acos(-1.0);
const double eps = 1e-9;

int main () {
        ios::sync_with_stdio(false);
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif
        int k, n; cin >> n >> k;
        vector<pair<int, int> > vec;
        for ( int i = 0; i < n; i ++ ) {
                int x, y; cin >> x >> y;
                vec.push_back({x, 1});
                vec.push_back({y, -1});
        }
        sort ( vec.begin(), vec.end(), [] ( pair<int, int> a, pair<int, int> b) {
                if ( a.first != b.first ) return a.first < b.first;
                return a.second > b.second;
        });

        vector<int> res;
        int lvl = 0; // 高度
        for ( int i = 0; i < vec.size(); i ++ ) {
                if ( vec[i].second == 1 ) {
                        lvl ++;
                        if ( lvl == k ) res.push_back(vec[i].first);
                } else {
                        if ( lvl == k ) res.push_back(vec[i].first);
                        lvl --;
                }
        }
        cout << res.size() / 2 << endl;
        for ( int i = 0; i < res.size(); i += 2 ) {
                cout << res[i] << " " << res[i + 1] << endl;
        }
}
```

<hr>

## CodeForces1409E_TwoPlatforms

#### 🔗
<a href="https://codeforces.com/problemset/problem/1409/E"><img src="https://i.loli.net/2021/09/26/y8aDkSu6xjUotqs.png"></a>

#### 💡
首先分析这是两块板子，必然是一前一后  
那么我们可以设置一个前缀最大覆盖，一个后缀最大覆盖  
每次对当前的球二分出最多能覆盖多少个点，并将当前的前缀或者后缀赋值为`max(之前的覆盖最大值，这一次点覆盖最大值)`  
然后枚举断点，扫一遍维护一下`max(res, pre[i] + nxt[i + 1])`  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <cstring>
#define ll long long
 
using namespace std;

const int N = 2e5 + 10;
ll n, k;
ll a[N];
ll pre[N], nxt[N]; // 前缀挡球最大个数，后缀挡球最大个数  
 
int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif
        ll cass; scanf("%lld", &cass); while ( cass -- ) {
                scanf("%lld%lld", &n, &k);
                a[0] = a[n + 1] = 1e18;
                pre[0] = nxt[n + 1] = 0;

                for ( int i = 1; i <= n; i ++ ) scanf("%lld", &a[i]);
                for ( int i = 1, x; i <= n; i ++ ) scanf("%d", &x); // 高度没啥用
                sort ( a + 1, a + n + 1 );

                for ( int i = 1; i <= n; i ++ ) 
                        pre[i] = max ( pre[i - 1], (ll)i - (lower_bound(a + 1, a + i + 1, a[i] - k) - a) + 1); // 向前二分
                for ( int i = n; i >= 1; i -- ) 
                        nxt[i] = max ( nxt[i + 1], ((ll)(upper_bound(a + i, a + n + 1, a[i] + k) - a) - 1) - i + 1); // 向后二分
                ll res = 0;
                for ( int i = 0; i <= n; i ++ ) res = max ( res, pre[i] + nxt[i + 1] );
                printf("%lld\n", res);
        }
}
```

<hr>

## HDU2021多校(1)5_Minimumspanningtree

#### 🔗
https://acm.hdu.edu.cn/showproblem.php?pid=6954

#### 💡
在模拟中得到每个数连边后做出的贡献值是一定的  
这个贡献值对后面的所有数都有贡献  
所以我们使用差分记录这个贡献值  
然后在处理完差分之后前缀累加一下得到每个输入的输出  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

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
#include <ctime>
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
#define TEST(a) cout << "---------" << a << "---------" << '<br>'

#define CHIVAS_ int main()
#define _REGAL exit(0)

#define SP system("pause")
#define IOS ios::sync_with_stdio(false)
#define beginTime clock_t startTime, toTime;startTime=clock();
#define endTime toTime=clock();cout << "The run time is:" << (double)(toTime - startTime)/CLOCKS_PER_SEC<<"s"<<endl;

//#define map unordered_map

#define _int(a) int a; cin >> a
#define  _ll(a) ll a; cin >> a
#define _char(a) char a; cin >> a
#define _string(a) string a; cin >> a
#define _vectorInt(a, n) vector<int>a(n); cin >> a
#define _vectorLL(a, b) vector<ll>a(n); cin >> a

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
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}
template<typename T>             vector<T>& operator--            (vector<T> &v){for (auto& i : v) --i;            return  v;}
template<typename T>             vector<T>& operator++            (vector<T> &v){for (auto& i : v) ++i;            return  v;}
template<typename T>             istream& operator>>(istream& is,  vector<T> &v){for (auto& i : v) is >> i;        return is;}
template<typename T>             ostream& operator<<(ostream& os,  vector<T>  v){for (auto& i : v) os << i << ' '; return os;}
inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

const int N = 1e7 + 10;
vector<ll> prime;
bool isprime[N];
ll dir[N], a[N]; // 差分数组，答案数组
int cass;

inline void Get_euler() {
        isprime[0] = isprime[1] = 1;
        for ( ll i = 2; i < N; i ++ ) {
                if( !isprime[i] ) { prime.push_back(i), dir[i] = (i == 2 ? 0 : 2 * i); } // 除了2以外的质数都要和2连一般
                for ( ll j = 0; j < prime.size() && prime[j] * i < N; j ++ ) {
                        isprime[i * prime[j]] = 1;
                        dir[i * prime[j]] = i * prime[j]; // 不是质数，差分等于它自己
                        if ( i % prime[j] == 0 ) break;
                }
        }

        for ( ll i = 1; i <= N; i ++ ) a[i] = a[i - 1] + dir[i];
}



CHIVAS_{beginTime

        Get_euler();
        EACH_CASE ( cass ) {
                outLL(a[inputLL()]); puts("");
        }

        endTime _REGAL;
};


```

<hr>

## HDU2021多校(5)9_Array

#### 🔗
<a href="https://acm.dingbacode.com/showproblem.php?pid=7020"><img src="https://img-blog.csdnimg.cn/f79012f522be4ae3beaac838fe1de587.png"></a>

#### 💡
与[LuoguP4062 Yazid 的新生舞会](https://www.luogu.com.cn/problem/P4062)一样，是求含有绝对众数的区间个数，但是数据量是1e6所以最多只能有一个log，但是如果一个
log就很难做到很多分治类做法  
  
对于一个数x，对于第i个位置，如果当前位置是x那么就可以设置为1，否则是-1  
那么对这个值求一下前缀和sum，如果对于一个位置sum[i]-sum[j]>0，说明这段区间内这个数出现个数比别的所有数出现个数要多  
那么问题就转化为，对于每个数x，建立完sum数组之后，求每一个位置前面sum[j] < sum[i]的个数  
  
可以维护一个f1数组用来维护每一个sum的个数，f2数组是用来对f1进行区间修改的差分数组  
在当前这一段一直出现x或者未到最小值，可以直接线性求解，SUM不断累加sum[个数]    
如果到了最小值并且还是没有出现x，意味着一直下减，前面一定不会出现解  
那么就可以跳过这一段，里面的要改的数可以通过区间修改一起改了，同时SUM重置为0  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <map>
#include <vector>
#include <cstring>
#include <algorithm>
#include <unordered_map>

#define ll long long
using namespace std;


const int N = 2e6 + 10;

map<int, vector<int> > g;

int n, cass, a[N]; 
ll res = 0;

inline void Solve ( int x ) {
        g[x].push_back(n + 1);
        unordered_map<ll, ll> f1, f2;
        f1[0] = 1; ll sum = 0/*前面多少个比当前前缀和小的*/, tmp = 0/*当前前缀和*/, minn = 0/*前面出现过的最小前缀和*/;
        for ( int i = 1, j = 0; i <= n; i ++ ) {
                if ( i > g[x][j] ) j ++; // 保持g[x][j]一直 >= i
                if ( a[i] == x ) {
                        tmp ++; 
                        f1[tmp] += f2[tmp] + 1; // 利用差分的f2让f1往前走一步
                        f2[tmp + 1] += f2[tmp]; f2[tmp] = 0;
                        sum += f1[tmp - 1]; // 又多了一个比tmp小的
                        res += sum;
                } else if ( tmp - 1 <= minn ) { // 这个区间跳过
                        int len = g[x][j] - i; // 跳过区间的每个sum的个数 ++
                        ++ f2[tmp - len + 1]; -- f2[tmp]; // 区间修改
                        ++ f1[tmp - len];
                        tmp -= len;
                        i = g[x][j] - 1;
                        sum = 0; // 最小的，前面没有更小的了，所以sum清0
                } else {
                        sum -= f1[-- tmp]; // 就是光减而已，也没多什么，就利用已有的f1计算即可
                        res += sum;
                        ++ f1[tmp];
                }
                if ( tmp < minn ) minn = tmp; // 最小值维护一下
        }
}

int main () {
        ios::sync_with_stdio(false);
        for ( cin >> cass; cass; cass -- ) {
                cin >> n;
                for ( int i = 1; i <= n; i ++ ) {
                        cin >> a[i];
                        g[a[i]].push_back(i); // 对每个存一下位置
                }
                res = 0;
                for ( auto v : g ) { // 分开解决
                        Solve(v.first);
                        g[v.first].clear(); // 在求完就可以删掉了
                }
                cout << res << endl;
        }
}

```

<hr>

## HDU2021多校(7)12_Yiwenwith Sqc

#### 🔗
<a href="https://acm.dingbacode.com/showproblem.php?pid=7055"><img src="https://i.loli.net/2021/10/14/DHYf7mUtuZ8W9T5.png"></a>

#### 💡
对于这种，我们分开考虑贡献  
对于一个字符出现的位置进行记录  
并可以得出一个个这个字符没有出现的连续段落，大小设置为sz    
  
相差i个的段落的位置个数的相乘每一个贡献是i^2  
那么对于每个字符贡献就是  
<img src="https://latex.codecogs.com/svg.image?\begin{aligned}&\sum\limits_{i=1}^{sz}\sum\limits_{j=i&plus;1}^{sz}[a_ia_j(j-i)^2]\\=&\sum\limits_{i=1}^{sz}\sum\limits_{j=i&plus;1}^{sz}[a_j*a_ii^2-2a_jj*a_ii&plus;a_jj^2*a_i]\end{aligned}" title="\begin{aligned}&\sum\limits_{i=1}^{sz}\sum\limits_{j=i+1}^{sz}[a_ia_j(j-i)^2]\\=&\sum\limits_{i=1}^{sz}\sum\limits_{j=i+1}^{sz}[a_j*a_ii^2-2a_jj*a_ii+a_jj^2*a_i]\end{aligned}" />  
看到这个式子应很快反应到，对于j:[2->sz]，每次累加的都是(j-1)的三个前缀和  
  
所以设三个前缀和  
`sum1[i]` 表示 `a[i] * i * i` 的前缀和  
`sum2[i]` 表示 `a[i] * i` 的前缀和  
`sum3[i]` 表示 `a[i]` 的前缀和  
然后j从2往n遍历，每次加上`a[j] * j * j * sum3[j-1]`再减去`a[j] * j * 2 * sum2[j - 1]`再加上`a[j] * sum1[j - 1]`  
  
把每个字符求得的贡献累加一下即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const ll mod = 998244353;

const ll N = 1e5 + 10;
ll sum1[N], sum2[N], sum3[N];

inline void Solve() {
        map<char, vector<ll> > los, mp;
        string s; cin >> s;
        for ( ll i = 0; i < s.size(); i ++ ) {
                mp[s[i]].push_back(i);
        }
        for ( auto i : mp ) {
                los[i.first].push_back(0); // 整体向后移，方便前缀和记录
                los[i.first].push_back(i.second[0] + 1);// 初始的区间
                for ( ll j = 1; j < i.second.size(); j ++ ) los[i.first].push_back(i.second[j] - i.second[j - 1]); // 两两区间
                los[i.first].push_back(s.size() - i.second.back()); // 最后的区间
        }
        ll res = 0;
        for ( auto i : los ) {
                for ( ll j = 1; j < i.second.size(); j ++ ) {
                        sum1[j] = (sum1[j - 1] + i.second[j] * j % mod * j % mod ) % mod;
                        sum2[j] = (sum2[j - 1] + i.second[j] * j % mod) % mod;
                        sum3[j] = (sum3[j - 1] + i.second[j]) % mod;
                }
                for ( ll j = 2; j < i.second.size(); j ++ ) {
                        res = ( res + i.second[j] * j % mod * j % mod * sum3[j - 1] % mod) % mod;
                        res = ((res - i.second[j] * j % mod * 2 % mod * sum2[j - 1] % mod) % mod + mod) % mod;
                        res = ( res + i.second[j] * sum1[j - 1] % mod) % mod;
                }
        }
        cout << res << endl;
}

int main () {
        ios::sync_with_stdio(false);
        ll cass; cin >> cass; while ( cass -- ) {
                Solve();
        }
}
```

<hr>
