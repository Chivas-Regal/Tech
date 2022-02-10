---
title: 线段树
---
###  
<hr>

## 洛谷P6327_区间加区间sin和

#### 🔗
<a href="https://www.luogu.com.cn/problem/P6327"><img src="https://img-blog.csdnimg.cn/d5f8f4e7a8124d3188ca5ef74cc95240.png"></a>

#### 💡

首先看修改，对 <img src="https://latex.codecogs.com/svg.image?\inline&space;a" title="\inline a" /> 加 <img src="https://latex.codecogs.com/svg.image?\inline&space;x" title="\inline a" />  
<img src="https://latex.codecogs.com/svg.image?\inline&space;\sin(a+x)" title="\inline a" /> 可以想到和差化积 <img src="https://latex.codecogs.com/svg.image?\inline&space;=\sin(a)\cos(x)+\sin(x)\cos(a)" title="\inline a" />  
我们可以看到每次会用到两个值 <img src="https://latex.codecogs.com/svg.image?\inline&space;\cos" title="\inline a" /> 和 <img src="https://latex.codecogs.com/svg.image?\inline&space;\sin" title="\inline a" /> ，那么我们线段树维护这两个就行了  
可以发现修改也是可以在原有基础上进行 <img src="https://latex.codecogs.com/svg.image?\inline&space;\cos(x)" title="\inline a" /> 和 <img src="https://latex.codecogs.com/svg.image?\inline&space;\sin(x)" title="\inline a" /> 的乘法分配律的  
所以我们可以正常 <img src="https://latex.codecogs.com/svg.image?\inline&space;lazy" title="\inline lazy" /> 维护加的 <img src="https://latex.codecogs.com/svg.image?\inline&space;\sum&space;x" title="\inline a" />    


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#### include <iostream>
#### include <algorithm>
#### include <cstring>
#### include <vector>
#### include <map>
#### include <cmath>


#### define ll long long

using namespace std;

const int N = 2e5 + 10;
int a[N], n, m;

struct Sgtr {
        double sine, cosi;
        ll lazy;
}sgtr[N << 2];

inline void Calc ( double &sumsin, double &sumcos, ll x ) {
        double tmp_sumsin = sumsin;
        double tmp_sumcos = sumcos;
        double sinx       = sin(x);
        double cosx       = cos(x);
        sumsin = tmp_sumsin * cosx + tmp_sumcos * sinx;
        sumcos = tmp_sumcos * cosx - tmp_sumsin * sinx;
}

inline void PushUp ( int rt ) {
        sgtr[rt].sine = sgtr[rt << 1].sine + sgtr[rt << 1 | 1].sine;
        sgtr[rt].cosi = sgtr[rt << 1].cosi + sgtr[rt << 1 | 1].cosi;
}

inline void PushDown ( int l, int r, int rt ) {
        if (!sgtr[rt].lazy) return;

        sgtr[rt << 1].lazy     += sgtr[rt].lazy;
        sgtr[rt << 1 | 1].lazy += sgtr[rt].lazy;

        Calc (sgtr[rt << 1].sine,     sgtr[rt << 1].cosi,     sgtr[rt].lazy);
        Calc (sgtr[rt << 1 | 1].sine, sgtr[rt << 1 | 1].cosi, sgtr[rt].lazy);

        sgtr[rt].lazy = 0;
}

inline void Build ( int l = 1, int r = n, int rt = 1 ) {
        sgtr[rt].lazy = 0;
        if (l == r) {
                sgtr[rt].cosi = cos(a[l]);
                sgtr[rt].sine = sin(a[l]);
                return;
        }

        int mid = (l + r) >> 1;
        Build (l, mid, rt << 1);
        Build (mid + 1, r, rt << 1 | 1);
        PushUp (rt);
}

inline void Update ( int a, int b, ll c, int l = 1, int r = n, int rt = 1 ) {
        if (a <= l && r <= b) {
                sgtr[rt].lazy += c;
                Calc (sgtr[rt].sine, sgtr[rt].cosi, c);
                return;
        }
        if (a > r || b < l) return;

        int mid = (l + r) >> 1;
        PushDown (l, r, rt);
        Update (a, b, c, l, mid, rt << 1);
        Update (a, b, c, mid + 1, r, rt << 1 | 1);
        PushUp (rt);
}

inline double Query ( int a, int b, int l = 1, int r = n, int rt = 1 ) {
        if (a <= l && r <= b) return sgtr[rt].sine;
        if (a > r || b < l)   return 0;
        PushDown (l, r, rt);
        int mid = (l + r) >> 1;
        return Query (a, b, l, mid, rt << 1) + Query (a, b, mid + 1, r, rt << 1 | 1);
}

int main () {
        scanf("%d", &n);
        for ( int i = 1; i <= n; i ++ ) scanf("%d", &a[i]);
        scanf("%d", &m);

        Build();
        while ( m -- ) {
                int op; scanf("%d", &op);
                if ( op == 1 ) {
                        int l, r, v; scanf("%d%d%d", &l, &r, &v);
                        Update (l, r, v);
                } else {
                        int l, r;    scanf("%d%d", &l, &r);
                        printf("%.1f\n", Query(l, r));
                }
        }
}
```

<hr>

## 牛客2022寒假算法基础集训营4B_进制

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/23479/B"><img src="https://img-blog.csdnimg.cn/6ce037fb4092415f9ee78d7c71b562a6.png"></a>

#### 💡
正解很好想，就是找出区间中最大的数，我们利用的进制就是 `mx + 1`   
问题在于快速求进制和快速求 $mx$  
两个线段树即可  
一个区间 $max$ 一个区间求大数  
令 $s[i][N<<2]$ 为 $i$ 进制的线段树数组  
那么向上更新时便是左子树多乘进制套着右子树向上走    
$s[i][rt]=s[i][rt<<1] \times i^{r-mid}+s[i][rt<<1|1]$

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const ll N = 1e5 + 10;
const ll mod = 1e9 + 7;
ll a[N], n, q;

namespace SegmentTree_Max {
        ll sgtr[N << 2];
        inline void push_Up ( ll rt ) {
                sgtr[rt] = max ( sgtr[rt << 1], sgtr[rt << 1 | 1] );
        }
        inline void Build ( ll l, ll r, ll rt ) {
                if ( l == r ) { sgtr[rt] = a[l]; return; }
                ll mid = (l + r) >> 1;
                Build ( l, mid, rt << 1 );
                Build ( mid + 1, r, rt << 1 | 1 );
                push_Up ( rt ); 
        }
        inline void Update ( ll id, ll c, ll l, ll r, ll rt ) {
                if ( l > id || r < id ) return;
                if ( l == id && r == id ) { sgtr[rt] = c; return; }
                ll mid = (l + r) >> 1;
                Update ( id, c, l, mid, rt << 1 );
                Update ( id, c, mid + 1, r, rt << 1 | 1 );
                push_Up ( rt );
        }
        inline ll Query ( ll a, ll b, ll l, ll r, ll rt ) {
                if ( a <= l && r <= b ) return sgtr[rt];
                if ( a > r || b < l )   return 0;
                ll mid = (l + r) >> 1;
                return max ( Query ( a, b, l, mid, rt << 1 ), Query ( a, b, mid + 1, r, rt << 1 | 1) ); 
        }
}
namespace SegmentTree_Num {
        ll s[15][N << 2];
        inline ll ksm ( ll a, ll b ) { ll res = 1; while ( b ) { if ( b & 1 ) res = res * a % mod; a = a * a % mod; b >>= 1; } return res; }
        inline void Build ( ll l, ll r, ll rt ) {
                if ( l == r ) {
                        for ( int i = 2; i <= 10; i ++ ) 
                                s[i][rt] = a[l];
                        return;
                }
                int mid = (l + r) >> 1;
                Build(l, mid, rt << 1);
                Build(mid + 1, r, rt << 1 | 1);
                for ( int i = 2; i <= 10; i ++ ) 
                        s[i][rt] = (s[i][rt << 1] * ksm(i, r - mid) % mod + s[i][rt << 1 | 1]) % mod;
        }
        inline void Update ( ll id, ll c, ll l, ll r, ll rt ) {
                if ( l > id || r < id ) return;
                if ( id == l && r == id ) {
                        for ( int i = 2; i <= 10; i ++ )
                                s[i][rt] = c;
                        return;
                } 

                ll mid = (l + r) >> 1;
                Update(id, c, l, mid, rt << 1);
                Update(id, c, mid + 1, r, rt << 1 | 1);
                for ( int i = 2; i <= 10; i ++ )
                        s[i][rt] = (s[i][rt << 1] * ksm(i, r - mid) % mod + s[i][rt << 1 | 1]) % mod;
        }

        inline ll Query ( ll a, ll b, ll l, ll r, ll rt, ll bs ) { // 区间压缩的理解下面的题有说  
                if ( a > r || b < l )   return 0;
                if ( l == a && r == b ) return s[bs][rt];
                ll mid = (l + r) >> 1;
                if ( b <= mid ) return Query ( a, b, l, mid, rt << 1, bs );
                else if ( a > mid ) return Query ( a, b, mid + 1, r, rt << 1 | 1, bs );
                else return (Query ( a, mid, l, mid, rt << 1, bs ) * ksm(bs, b - mid) % mod + Query ( mid + 1, b, mid + 1, r, rt << 1 | 1, bs )) % mod;
        }
}


int main () {
        ios::sync_with_stdio(false);

        cin >> n >> q;
        string s; cin >> s; for ( ll i = 1; i <= n; i ++ ) a[i] = s[i - 1] - '0';
        SegmentTree_Max::Build(1, n, 1);
        SegmentTree_Num::Build(1, n, 1);
        while ( q -- ) {
                ll op, x, y; cin >> op >> x >> y;
                if ( op == 1 ) {
                        SegmentTree_Num::Update(x, y, 1, n, 1);
                        SegmentTree_Max::Update(x, y, 1, n, 1);
                } else {
                        int mx = SegmentTree_Max::Query(x, y, 1, n, 1); 
                        cout << SegmentTree_Num::Query(x, y, 1, n, 1, mx + 1) << endl;
                }
        }
}
```
<hr>


## 牛客2022寒假算法基础集训营5E_复苏小孩

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/23480/E"><img src="https://img-blog.csdnimg.cn/1cf9d482c13043998c7f012b30d99af7.png"></a>

#### 💡
先简化一下情况    
我们设置当前某个鬼的力量为 $x$   
那么有两种情况  
- 吸收力量：$x=x+\frac{3-x}{2}=\frac{x+3}{2}$  
- 被吸收力量：$x=\frac{x+0}{2}$  
  
那么我们可以将这两种情况抽象成数位关系的进制  
即 $0.5$ 进制，每个位置要么是 $0$ 要么是 $3$  
对于这种修改查询我们可以想到使用**线段树维护大数**来解决  
令 $s[i][N<<2]$ 为第 $i$ 只鬼的线段树数组  
那么向上更新时便是左子树多乘进制套着右子树向上走    
$s[i][rt]=s[i][rt<<1] \times(\frac12)^{r-mid}+s[i][rt<<1|1]$  
  
查询时也与之类似，但要考虑到防止右侧没有数但是左侧仍然进位的情况  
我们进行区间压缩  
即  

```cpp
// 查询 [a,b] ，第 bs 只鬼 
inline ll Query ( ll a, ll b, ll l, ll r, ll rt, ll bs ) { 
        ...
        if ( b <= mid ) return Query ( a, b, l, mid, rt << 1, bs ); // 向左压缩
        else if ( a > mid ) return Query ( a, b, mid + 1, r, rt << 1 | 1, bs ); // 向右压缩
        else return (Query ( a, mid, l, mid, rt << 1, bs ) * ksm(iv2, b - mid) % mod + Query ( mid + 1, b, mid + 1, r, rt << 1 | 1, bs )) % mod; // 向中间压缩
}
```
  
当然还有一些细节部分  
- 开始时力量默认为 $1$ ，所以 $x$ 位要额外 $+1$ 进行求值
- 开始那一位带上了一遍 $/2$ 所以最后要多除一遍 $2$    

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const ll N = 1e5 + 10;
const ll mod = 998244353;
ll a[N];

namespace SegmentTree_Num {
        ll s[15][N << 2];
        inline ll ksm ( ll a, ll b ) { ll res = 1; while ( b ) { if ( b & 1 ) res = res * a % mod; a = a * a % mod; b >>= 1; } return res; }
        inline ll inv ( ll x ) { return ksm(x, mod - 2); }
        ll iv2 = inv(2);
        inline void Build ( ll l, ll r, ll rt ) {
                if ( l == r ) {
                        for ( ll i = 1; i <= 3; i ++ ) 
                                s[i][rt] = 3 * (a[l] == i);
                        return;
                }
                ll mid = (l + r) >> 1;
                Build(l, mid, rt << 1);
                Build(mid + 1, r, rt << 1 | 1);
                for ( ll i = 1; i <= 3; i ++ ) 
                        s[i][rt] = (s[i][rt << 1] * ksm(iv2, r - mid) % mod + s[i][rt << 1 | 1]) % mod;
        }
        inline void Update ( ll id, ll c, ll l, ll r, ll rt ) {
                if ( l > id || r < id ) return;
                if ( id == l && r == id ) {
                        for ( ll i = 1; i <= 3; i ++ )
                                s[i][rt] = 3 * (c == i);
                        return;
                } 

                ll mid = (l + r) >> 1;
                Update(id, c, l, mid, rt << 1);
                Update(id, c, mid + 1, r, rt << 1 | 1);
                for ( ll i = 1; i <= 3; i ++ )
                        s[i][rt] = (s[i][rt << 1] * ksm(iv2, r - mid) % mod + s[i][rt << 1 | 1]) % mod;
        }
        inline void Pre ( ll id, ll l, ll r, ll rt ) { // id位+1
                if ( l > id || r < id ) return;
                if ( id == l && r == id ) {
                        for ( ll i = 1; i <= 3; i ++ ) s[i][rt] ++;
                        return;
                }
                ll mid = (l + r) >> 1;
                Pre(id, l, mid, rt << 1);
                Pre(id, mid + 1, r, rt << 1 | 1);
                for ( ll i = 1; i <= 3; i ++ )
                        s[i][rt] = (s[i][rt << 1] * ksm(iv2, r - mid) % mod + s[i][rt << 1 | 1]) % mod;
        }
        inline void Las ( ll id, ll l, ll r, ll rt ) { // id位-1
                if ( l > id || r < id ) return;
                if ( id == l && r == id ) {
                        for ( ll i = 1; i <= 3; i ++ ) s[i][rt] --;
                        return;
                }
                ll mid = (l + r) >> 1;
                Las(id, l, mid, rt << 1);
                Las(id, mid + 1, r, rt << 1 | 1);
                for ( ll i = 1; i <= 3; i ++ )
                        s[i][rt] = (s[i][rt << 1] * ksm(iv2, r - mid) % mod + s[i][rt << 1 | 1]) % mod;
        }


        inline ll Query ( ll a, ll b, ll l, ll r, ll rt, ll bs ) { 
                if ( a > r || b < l )   return 0;
                if ( l == a && r == b ) return s[bs][rt];
                ll mid = (l + r) >> 1;
                if ( b <= mid ) return Query ( a, b, l, mid, rt << 1, bs );
                else if ( a > mid ) return Query ( a, b, mid + 1, r, rt << 1 | 1, bs );
                else return (Query ( a, mid, l, mid, rt << 1, bs ) * ksm(iv2, b - mid) % mod + Query ( mid + 1, b, mid + 1, r, rt << 1 | 1, bs )) % mod;
        }
}
char s[N];
int main () {
        ll n, q; scanf("%lld%lld", &n, &q);
        scanf("%s", s);
        for ( ll i = 1; i <= n; i ++ ) a[i] = s[i - 1] - '0';
        SegmentTree_Num::Build(1, n, 1);
        while ( q -- ) {
                ll op, x, y; scanf("%lld%lld%lld", &op, &x, &y);
                if ( op == 1 ) {
                        SegmentTree_Num::Update(x, y, 1, n, 1);
                        a[x] = y;
                } else {
                        SegmentTree_Num::Pre(x, 1, n, 1);
                        for ( ll i = 1; i <= 3; i ++ ) printf("%lld ", SegmentTree_Num::Query(x, y, 1, n, 1, i) * SegmentTree_Num::iv2 % mod);
                        puts("");
                        SegmentTree_Num::Las(x, 1, n, 1);
                }
        }
}
```
<hr>


## 牛客练习赛68A_牛牛的mex

#### 🔗
https://ac.nowcoder.com/acm/contest/13647/A

#### 💡
线段树储存前后缀最小值  
从而在区间内未出现的最小数O(1)查询


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  


```cpp
#include <stack>
#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <cstring>
#include <cstdio>
#include <map>
#include <set>
#include <queue>
#include <cmath>
#define rep1(i, a, n) for (ll i = a; i <= n; i++)
#define rep2(i, a, n) for (ll i = a; i >= n; i--)
#define mm(a, b) memset(a, b, sizeof(a))
#define each_cass(cass) for (cin >> cass; cass; cass--)
typedef long long ll;
void mc(ll *aa, ll *a, ll len) { rep1(i, 1, len) * (aa + i) = *(a + i); }
const int INF = 0x7FFFFFFF;
const ll LNF = 1e18;
const double G = 10;
const double eps = 1e-6;
const double PI = acos(-1.0);
const int mod = 1e9 + 7;
using namespace std;
const int maxn = 1e5 + 10;
int minn[maxn << 2];
int a[maxn];

void PushUp(int rt) { minn[rt] = min(minn[rt << 1], minn[rt << 1 | 1]); }
void Build(int l, int r, int rt)
{
    if (l == r)
    {
        minn[rt] = a[l];
        return;
    }
    int mid = (l + r) >> 1;
    Build(l, mid, rt<<1);
    Build(mid + 1, r, rt<<1|1);
    PushUp(rt);
}
int Query(int a, int b, int l, int r, int rt)
{
    if (a > r || b < l)
        return INF;
    if (a <= l && b >= r)
        return minn[rt];
    int mid = (l + r) >> 1;
    return min(Query(a, b, l, mid, rt << 1), Query(a, b, mid + 1, r, rt << 1 | 1));
}
int main()
{
    int n, q;
    cin >> n >> q;
    a[0]=a[n+1]=n;
    for (int i = 1; i <= n; i++)
        cin >> a[i];
    Build(0, n+1, 1);
    while (q--)
    {
        int l, r;
        cin >> l >> r;
        cout << min(Query(0, l-1, 0, n+1, 1), Query(r+1, n+1, 0, n+1, 1)) << endl;
    }
}
```

<hr>

## 牛客NC230082_SashaAndArray

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/24157/C"><img src="https://i.loli.net/2021/11/25/yJkxhsDW2CSl9cY.png"></a>

#### 💡
一个涉及到区间修改和区间求和的问题  
且  <img src="https://latex.codecogs.com/svg.image?\inline&space;a_i" title="\inline a_i" />  到最后会很大，所以想矩阵  <img src="https://latex.codecogs.com/svg.image?\inline&space;ksm" title="\inline ksm" />  ，我们设置  <img src="https://latex.codecogs.com/svg.image?\inline&space;base" title="\inline base" />  矩阵就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;fibonacci" title="\inline fibonacci" />  的基础矩阵  
那么在矩阵里面区间修改加也就是变成了区间修改乘（区间和矩阵乘上  <img src="https://latex.codecogs.com/svg.image?\inline&space;base" title="\inline base" />  矩阵的  <img src="https://latex.codecogs.com/svg.image?\inline&space;c" title="\inline c" />  次方  
区间乘可以由乘法分配律满足，所以线段树懒标记就可以实现    
而统计的时候就是区间查询加，这个就直接用线段树的区间求和数组计算加后的矩阵  
由于满足乘法分配律，我们直接用初始的竖矩阵去乘这个区间和矩阵就行了  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

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

## HDU1394_MinimumInversionNumber

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=1394

#### 💡 


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  


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
#define mod 1e9 + 7
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
const int maxn = 5e3 + 10;
struct SegTree
{
    int val;
    int lazy;
} SegTree[maxn << 2];
int n;
int a[maxn];

void PushUp(int rt);
void PushDown(int l, int r, int rt);
void BuildTree(int l, int r, int rt);
void UpDate(int a, int b, int c, int l, int r, int rt);
ll Query(int a, int b, int l, int r, int rt);

int main()
{
    while (scanf("%d", &n) == 1)
    {
        BuildTree(1, n, 1);
        ll cnt = 0;
        fir(i, 1, n)
            scanf("%d", &a[i]),
            UpDate(a[i], a[i], 1, 1, n, 1), 
            cnt += Query(a[i] + 1, n, 1, n, 1);
        ll res = cnt;
        fir(i, 1, n)
        {
            cnt += (n - 1 - a[i]) - a[i];
            res = min(res, cnt);
        }
        printf("%lld\n", res);
    }
    return 0;
}

void PushUp(int rt)
{
    SegTree[rt].val = SegTree[rt << 1].val + SegTree[rt << 1 | 1].val;
}
void PushDown(int l, int r, int rt)
{
    if (!SegTree[rt].lazy)
        return;
    int mid = (l + r) >> 1;
    SegTree[rt << 1].val += SegTree[rt].lazy * (mid - l + 1);
    SegTree[rt << 1 | 1].val += SegTree[rt].lazy * (r - mid);
    SegTree[rt << 1].lazy += SegTree[rt].lazy;
    SegTree[rt << 1 | 1].lazy += SegTree[rt].lazy;
    SegTree[rt].lazy = 0;
}
void BuildTree(int l, int r, int rt)
{
    SegTree[rt].lazy = 0;
    if (l == r)
    {
        SegTree[rt].val = 0;
        return;
    }
    int mid = (l + r) >> 1;
    BuildTree(l, mid, rt << 1);
    BuildTree(mid + 1, r, rt << 1 | 1);
    PushUp(rt);
}
void UpDate(int a, int b, int c, int l, int r, int rt)
{
    if (a > r || b < l)
        return;
    if (a <= l && b >= r)
    {
        SegTree[rt].val += c * (r - l + 1);
        SegTree[rt].lazy += c;
        return;
    }
    PushDown(l, r, rt);
    int mid = (l + r) >> 1;
    UpDate(a, b, c, l, mid, rt << 1);
    UpDate(a, b, c, mid + 1, r, rt << 1 | 1);
    PushUp(rt);
}
ll Query(int a, int b, int l, int r, int rt)
{
    if (a > r || b < l)
        return 0;
    if (a <= l && b >= r)
        return SegTree[rt].val;
    int mid = (l + r) >> 1;
    return Query(a, b, l, mid, rt << 1) + Query(a, b, mid + 1, r, rt << 1 | 1);
}
```

<hr>

## POJ2299_Ultra-QuickSort


#### 🔗
http://poj.org/problem?id=2299

#### 💡


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
#define INT __int128

#define LOWBIT(x) ((x) & (-x))
#define LOWBD(a, x) lower_bound(a.begin(), a.end(), x) - a.begin()
#define UPPBD(a, x) upper_bound(a.begin(), a.end(), x) - a.begin()
#define TEST(a) cout << "---------" << a << "---------" << endl

#define CHIVAS_ inline int MAIN(){
#define _REGAL return 0;}

#define SP system("pause")
#define IOS ios::sync_with_stdio(false)
//#define map unordered_map

#define pbb pair<bool, bool>
#define pii pair<int, int> 
#define pll pair<ll, ll>
#define PB(x) push_back(x)
#define ALL(a) a.begin(),a.end()
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for ( int cass = inputInt(); cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;
inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? GCD(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return make_pair(MaxVal, MaxId);}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return make_pair(MinVal, MinId);}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return make_pair(MaxVal, MaxId);}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return make_pair(MinVal, MinId);}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return make_pair(cnt, div);}

namespace Solution_In_Codeforces{
        inline void solve();
        namespace N_cass {
                void Main(){ int cass; for ( cin >> cass; cass; cass -- ) { solve();} };
        }
        namespace One_cass {
                void Main(){ solve(); };
        }
}
inline void Solution_In_Codeforces::solve() {}















// =============================================================  BeginCode  ==========================================================================================


const int maxn = 5e5 + 15;
struct SegTree{
        int lazy;
        int val;
} SegTree[maxn << 2];
struct Num{
        int id;
        int val;
        friend bool operator<(Num a,Num b){
                return a.val < b.val;
        }   
} Num[maxn];
int A[maxn];
int n;

inline void Disc();
inline void PushUp(int rt);
inline void PushDown(int l, int r, int rt);
inline void BuildTree(int l, int r, int rt);
inline void UpDate(int a, int b, int c, int l, int r, int rt);
inline ll Query(int a, int b, int l, int r, int rt);


CHIVAS_
        while(scanf("%lld",&n)==1,n){
                for (int i = 1; i <= n; i++) scanf("%lld", &Num[i].val), Num[i].id = i;
                Disc();
                ll cnt = 0;
                BuildTree(1, n, 1);
                for (int i = 1; i <= n; i++){
                UpDate(A[i], A[i], 1, 1, n, 1);
                cnt += Query(A[i]+1, n, 1, n, 1);
                }
                printf("%lld\n", cnt);
        }
_REGAL

inline void Disc(){
        int cnt = 0;
        sort(Num + 1, Num + n + 1);
        A[Num[1].id] = 1;
        cnt=1;
        for (int i = 2; i <= n; i++){
                if(Num[i].val==Num[i-1].val)
                A[Num[i].id] = cnt;
                else
                A[Num[i].id] = ++cnt;
        }
}
inline void PushUp(int rt){
        SegTree[rt].val = SegTree[rt << 1].val + SegTree[rt << 1 | 1].val;
}
inline void PushDown(int l, int r, int rt){
        if (!SegTree[rt].lazy)
                return;
        int mid = (l + r) >> 1;
        SegTree[rt << 1].val += SegTree[rt].lazy * (mid - l + 1);
        SegTree[rt << 1 | 1].val += SegTree[rt].lazy * (r - mid);
        SegTree[rt << 1].lazy += SegTree[rt].lazy;
        SegTree[rt << 1 | 1].lazy += SegTree[rt].lazy;
        SegTree[rt].lazy = 0;
}
inline void BuildTree(int l, int r, int rt){
        SegTree[rt].lazy = 0;
        if (l == r)
        {
                SegTree[rt].val = 0;
                return;
        }
        int mid = (l + r) >> 1;
        BuildTree(l, mid, rt << 1);
        BuildTree(mid + 1, r, rt << 1 | 1);
        PushUp(rt);
}
inline void UpDate(int a, int b, int c, int l, int r, int rt){
        if (a > r || b < l)
                return;
        if (a <= l && b >= r){
                SegTree[rt].val += c * (r - l + 1);
                SegTree[rt].lazy += c;
                return;
        }
        PushDown(l, r, rt);
        int mid = (l + r) >> 1;
        UpDate(a, b, c, l, mid, rt << 1);
        UpDate(a, b, c, mid + 1, r, rt << 1 | 1);
        PushUp(rt);
}
inline ll Query(int a, int b, int l, int r, int rt){
        if (a > r || b < l)
                return 0;
        if (a <= l && b >= r)
                return SegTree[rt].val;
        PushDown ( l, r, rt );
        int mid = (l + r) >> 1;
        return Query(a, b, l, mid, rt << 1) + Query(a, b, mid + 1, r, rt << 1 | 1);
}     





// =============================================================  EndCode  ==========================================================================================
































int main(){

#ifndef ONLINE_JUDGE
freopen("in.in", "r", stdin);
freopen("out.out", "w", stdout);
#endif

        MAIN();

#ifndef ONLINE_JUDGE
cerr    << "\033[1m\033[31m\n" 
        << "\n\n===============================\n" 
        << "|| Time elapsed: " << 1.0 * clock() / CLOCKS_PER_SEC << " s. ||\n" 
        << "===============================" 
        << "\033[0m";
#endif

        exit(0);
};
```

<hr>
