---
title:  二分
---

###  
<hr>

## 洛谷P1462_通往奥格瑞玛的道路

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1462"><img src="https://img-blog.csdnimg.cn/c9cdf9a2edd54a448db5492ff12fd394.png"></a>

#### 💡
二分答案，`check()` 可以通过删点来解决  
在不走 $f[x]>mid$ 的情况下，即提前标记 $vis[x]=true$ ，看看最短路是多少  
和血量 $b$ 比较一下  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 1e4 + 10;
const int M = 1e5 + 10;

int n, m; ll b;
ll f[N];

bool vis[N];
ll dis[N];

struct Edge {
        int nxt, to;
        ll val;
} edge[M];
int head[N], cnt;
inline void add_Edge ( int from, int to, ll val ) {
        edge[++cnt] = { head[from], to, val };
        head[from] = cnt;
}

struct node { int id; ll dis; inline friend bool operator < ( node a, node b ) { return a.dis > b.dis; } };
inline bool Check ( ll x ) {
        for ( int i = 1; i <= n; i ++ ) {
                if ( f[i] <= x ) vis[i] = false;
                else             vis[i] = true;
                dis[i] = 1e18;
        }
        priority_queue<node> pque;
        pque.push({1, 0});
        dis[1] = 0;
        while ( !pque.empty() ) {
                node cur = pque.top(); pque.pop();
                if ( vis[cur.id] ) continue; vis[cur.id] = true;
                for ( int i = head[cur.id]; i; i = edge[i].nxt ) {
                        int to = edge[i].to;
                        if ( dis[to] > dis[cur.id] + edge[i].val && !vis[to] ) {
                                dis[to] = dis[cur.id] + edge[i].val;
                                pque.push({to, dis[to]});
                        }
                }
        }
        return dis[n] < b;
}

int main () {
        scanf("%d%d%lld", &n, &m, &b);
        for ( int i = 1; i <= n; i ++ ) scanf("%lld", &f[i]);
        for ( int i = 1; i <= m; i ++ ) {
                int x, y; ll z; scanf("%d%d%lld", &x, &y, &z);
                add_Edge(x, y, z);
                add_Edge(y, x, z);
        }

        ll l = 0, r = 1000000005;
        if ( Check(r) == false ) {
                puts("AFK");
                return 0;
        }

        ll res = r;
        while ( l <= r ) {
                int mid = (l + r) >> 1;
                if ( Check(mid) ) res = mid, r = mid - 1;
                else l = mid + 1;
        }
        printf("%lld\n", res);
}
```
<hr>

## 洛谷P1663_山

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1663"><img src="https://img-blog.csdnimg.cn/0eb7b1d988c04aa9a730a04bd7460727.png"></a>

#### 💡
思考什么样的点才可以被所有地方看见  
在所有山坡<b>直线上方</b>的点  
那么我们对于一个 $y$ ，可以求出它与所有山坡的交点  
利用交点我们可以得到对于每个山坡，它能被看见的话，$x$ 可在的区间  
利用二分答案，每一个 `check()` 是：对于所有 $x$ 可以被看到的区间是否有交集  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
struct node {
        double k, b;
} l[5010];
pair<double, double> p[5010];

int n;

inline bool check ( double y ) {
        double L = -1e10, R = 1e10;
        for ( int i = 0; i < n - 1; i ++ ) {
                if ( l[i].k == 0 ) {
                        if ( l[i].b > y ) return false;
                } else {
                        double x0 = (y - l[i].b) / l[i].k, y0 = y;
                        if ( l[i].k < 0 ) L = max(L, x0);
                        else              R = min(R, x0);
                }
        }
        return L <= R;
}

int main () {
        cin >> n;
        for ( int i = 0; i < n; i ++ ) {
                cin >> p[i].first >> p[i].second;
                if ( i ) {
                        l[i - 1].k = (p[i].second - p[i - 1].second) / (p[i].first - p[i - 1].first);
                        l[i - 1].b = p[i].second - l[i - 1].k * p[i].first;
                } 
        }
        double l = 0, r = 1e10;
        while ( r - l > 1e-6 ) {
                double mid = (l + r) / 2;
                if ( check(mid) ) r = mid;
                else              l = mid;
        }
        printf("%.3f\n", l);
}
```
<hr>

## 洛谷P1704_寻找最优美做题曲线

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1704"><img src="https://img-blog.csdnimg.cn/8d693c7c5186461d96b09396b6de9616.png"></a>

#### 💡
既然 $[p]$ 是必须出现在 $LIS$ 中的  
那么我们可以找到 $[1\to n]$ 中一定不会出现在 $LIS$ 中的，删去      
即对于 $j:p[i-1]\to p[i]$ $c[p[i-1]]\ge c[j]$ 或 $c[j]\ge c[p[i]]$ 的都不行   
一看数据范围用二分法算 $LIS$  
每次遇见 $p[i]$ 后都一定会进行 `push_back()`  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N  = 5e5 + 10;
int n, k;
int p[N], c[N];
bool del[N];

int main () {
        ios::sync_with_stdio(false);
        cin >> n >> k;
        for ( int i = 1; i <= k; i ++ ) cin >> p[i];
        for ( int i = 1; i <= n; i ++ ) cin >> c[i];

        sort ( p + 1, p + 1 + k );
        for ( int i = 2; i <= k; i ++ ) {
                if ( c[p[i]] <= c[p[i - 1]] ) {
                        cout << "impossible" << endl;
                        return 0;
                }
        }


        for ( int j = 1; j < p[1]; j ++ ) if ( c[j] >= c[p[1]] ) del[j] = true;
        for ( int j = p[k] + 1; j <= n; j ++ ) if ( c[j] <= c[p[k]] ) del[j] = true;
        for ( int i = 2; i <= k; i ++ ) {
                for ( int j = p[i - 1] + 1; j < p[i]; j ++ ) {
                        if ( c[j] <= c[p[i - 1]] || c[j] >= c[p[i]] ) 
                                del[j] = true;
                }
        }

        vector<int> vec;
        for ( int i = 1; i <= n; i ++ ) {
                if ( del[i] ) continue;
                if ( vec.empty() || vec.back() < c[i] ) vec.push_back(c[i]);
                else vec[lower_bound(vec.begin(), vec.end(), c[i]) - vec.begin()] = c[i];
        }
        cout << vec.size() << endl;
}
```
<hr>

## 洛谷P1768_天路

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1768"><img src="https://img-blog.csdnimg.cn/1a3261ad18f94a929450dd2dff4a440e.png"></a>

#### 💡  
带环的图很难求最长环  
可以想一想能不能判断一个数是否为答案  
  
考虑若 $res$ 是最后的结果  
那么必然所有的环均满足  
$$\begin{aligned}
\frac{\sum V}{\sum P}&\le res\\
\sum V&\le res\times \sum P\\
res\times \sum P-\sum V&\ge 0
\end{aligned}$$  
  
这样权值大小就很明显了，<mark>在最大值中找到最小的也是二分答案的标志</mark>    
使用密度二分，每次对边权重新赋值 $val=mid\times p-v$  
如果具有环 $res\times\sum P-\sum V\lt 0$ 那么说明还没有到最大值  
否则的话可能比最大值要大  
那么就是判断是否有负环，如果有的话就说名具有环满足上面的不等式，这个便是 `check()`  
  
要注意可能会有不连通的情况，我们可以建立超级源点连接所有的边  
这里 `BFS` 版 $SPFA$ 会寄， `DFS` 版勉强过  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 7010;
const int M = 40010;

struct Edge {
        int nxt, to;
        int v, p;
        double val;
} edge[M];
int head[N], cnt;
inline void add_Edge ( int from, int to, int v, int p ) {
        edge[++cnt] = { head[from], to, v, p };
        head[from] = cnt;
}
int n, m;


bool vis[N];
double dis[N];

inline bool has_Neg ( int x ) {
        vis[x] = true;
        for ( int i = head[x]; i; i = edge[i].nxt ) {
                int to = edge[i].to;
                if ( dis[to] > dis[x] + edge[i].val ) {
                        dis[to] = dis[x] + edge[i].val;
                        if ( vis[to] ) return true;
                        if ( has_Neg(to) ) return true;
                }
        }
        vis[x] = false;
        return false;
}

int main () {
        scanf("%d%d", &n, &m);       
        for ( int i = 0; i < m; i ++ ) {
                int a, b, c, d; scanf("%d%d%d%d", &a, &b, &c, &d);
                add_Edge(a, b, c, d);
        }
        for ( int i = 1; i <= n; i ++ ) add_Edge(0, i, 0, 0);

        double l = 0, r = 7000000;
        while ( r - l > 1e-6 ) {
                double mid = (l + r) / 2;
                for ( int i = 1; i <= cnt; i ++ ) edge[i].val = mid * edge[i].p - edge[i].v;
                for ( int i = 0; i <= n; i ++ ) vis[i] = 0, dis[i] = 100000000;
                dis[0] = 0;
                has_Neg(0) ? l = mid : r = mid;
        }
        if ( l == 0 ) {
                puts("-1");
                return 0;
        }
        printf("%.1f\n", l);
}
```
<hr>



## 洛谷P2323_公路修建问题

#### 🔗
<a href="https://www.luogu.com.cn/problem/P2323"><img src="https://img-blog.csdnimg.cn/45b1e8f082124ea5b412e1515eb278c3.png"></a>

#### 💡
因为答案是一个数值且要最小，所以具有单调性   
且具有很多限制，如果给定一个数值我们可以很好地得出是否可以完成指标（ $k$ 个 $c1$ ，还要完成可以构建生成树  
那么我们利用这个限制，去二分答案求解，`check()` 可以通过删边来解决    
每次用 $x=mid$ 去 $check()$ 先扫一遍尽可能去把 $c1<=x$ 的道路都建上  
满足了 $k$ 个边了再去看看生成树可不可以  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 2e4 + 10;
int n, k, m;

namespace UnionSet {
        int nod[N];
        inline void Init () { for ( int i = 0; i <= n; i ++ ) nod[i] = i; }
        inline int Find ( int x ) { return x == nod[x] ? x : Find(nod[x]); }
        inline void Merge ( int x, int y ) { int fx = Find(x), fy = Find(y); if ( fx != fy ) nod[fx] = fy; }
        inline bool is_Similar ( int x, int y ) { int fx = Find(x), fy = Find(y); return fx == fy; }
} using namespace UnionSet;

struct Edge {
        int a, b, c1, c2;
} e[N];

inline bool Check ( int x ) {
        Init();
        int cntk = 0, cnt = 0;
        for ( int i = 0; i < m; i ++ ) {
                if ( e[i].c1 <= x ) {
                        if ( !is_Similar(e[i].a, e[i].b) ) 
                                Merge(e[i].a, e[i].b),
                                cntk ++,
                                cnt ++;
                }
                if ( cnt == n - 1 ) {
                        return cntk >= k;
                }
        }
        if ( cntk < k ) return false;
        for ( int i = 0; i < m; i ++ ) {
                if ( e[i].c2 <= x ) {
                        if ( !is_Similar(e[i].a, e[i].b) ) 
                                Merge(e[i].a, e[i].b),
                                cnt ++;
                }
                if ( cnt == n - 1 ) break;
        }
        return cnt == n - 1;
}

int main () {
        scanf("%d%d%d", &n, &k, &m);
        for ( int i = 0; i < m; i ++ ) scanf("%d%d%d%d", &e[i].a, &e[i].b, &e[i].c1, &e[i].c2);
        int l = 1, r = 30000;
        int res = 30000;
        while ( l <= r ) {
                int mid = (l + r) >> 1;
                if ( Check(mid) ) res = mid, r = mid - 1;
                else l = mid + 1;
        }
        
        printf("%d\n", res);
        Init();

        int cnt = 0, cntk = 0;
        for ( int i = 0; i < m; i ++ ) {
                if ( e[i].c1 <= res ) {
                        if ( !is_Similar(e[i].a, e[i].b) ) 
                                Merge(e[i].a, e[i].b),
                                cntk ++,
                                cnt ++,
                                printf("%d 1\n", i + 1);
                }
                if ( cnt == n - 1 ) return 0;
        }
        for ( int i = 0; i < m; i ++ ) {
                if ( e[i].c2 <= res ) {
                        if ( !is_Similar(e[i].a, e[i].b) ) 
                                Merge(e[i].a, e[i].b),
                                cnt ++,
                                printf("%d 2\n", i + 1);
                }
                if ( cnt == n - 1 ) return 0;
        }
}
```
<hr>

## 洛谷P5657_格雷码

#### 🔗
<a href="https://www.luogu.com.cn/problem/P5657"><img src="https://img-blog.csdnimg.cn/7cae6e11dfb6423db987fbaad4b06079.png"></a>

#### 💡
**一道二分观察的好题**  
(感觉没有涉及到位运算的思想鸭（逃  
  
因为每一次都是将整个序列的长度*2  
是一个以 2 为基数按规律构造的序列  
那么可以想 log(n) 怎么操作  
  
好好观察一下，将当前固定出的序列分半（记为这是第x次分半  
可以看出，在x位上，原段的两半呈现一半为1一半为0，如果上一步是选择右边的一半，那么左1右0，否则左0右1  
  
根据这个规律，我们就可以二分地写出来了 

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" />

```cpp
int main () {
        ios::sync_with_stdio(false);
        ll n; cin >> n;
        ll k; cin >> k;
        ll l = 0, r = (1ll << n) - 1;
        bool where; //false: lft, true: rgt
        while ( n -- ) {
                ll mid = (l + r) >> 1;
                if ( k <= mid ) cout << 0 + where, r = mid, where = false;
                else            cout << 1 - where, l = mid + 1, where = true;
        }
}
```

<hr>


## 牛客2022寒假算法基础集训营5A_疫苗小孩

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/23480/A"><img src="https://img-blog.csdnimg.cn/55f7e80521ab443bbecb6d6cf214412c.png"></a>

#### 💡
统计字符串中为 $0$ 的位置 $\{ps\}$ 后  
我们枚举每个起始点 $ps[i]$   
对 $ps[i]$ 去找离 $ps[i]+k$ 最近的左右两点，满足的统计一下 $max$   
然后对该左右两点分别去找最近的 $ps+k$ 的左右两点，满足的统计一下 $max$   
即：  
$i\left\{\begin{aligned}
pos01\left\{\begin{aligned}pos011\\pos012\end{aligned}\right.\\
pos02\left\{\begin{aligned}pos021\\pos022\end{aligned}\right.
\end{aligned}\right.$  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
ll k, w, q; 
inline ll calc ( ll a, ll b ) { // 计算 a->b 的提升值
        return w - llabs(b - a - k) * q;
}

int main () {
        ios::sync_with_stdio(false);

        ll n; string s; cin >> n >> s;
        cin >> k >> w >> q;
        vector<ll> ps;
        for ( int i = 0; i < s.size(); i ++ ) {
                if ( s[i] == '0' ) ps.push_back(i);
        }
        ll res = 0;
        for ( int i = 0; i < ps.size(); i ++ ) {
                ll pos02 = lower_bound(ps.begin(), ps.end(), ps[i] + k) - ps.begin();
                ll pos01 = pos02 - 1;
                if ( pos02 != ps.size() && pos02 > i ) res = max(res, calc(ps[i], ps[pos02]));
                if ( pos01 != ps.size() && pos01 > i ) res = max(res, calc(ps[i], ps[pos01]));

                if ( pos02 != ps.size() && pos02 > i ) {
                        ll disi02 = calc(ps[i], ps[pos02]);
                        ll pos022 = lower_bound(ps.begin(), ps.end(), ps[pos02] + k) - ps.begin();
                        ll pos021 = pos022 - 1;
                        if ( pos022 != ps.size() && pos022 > pos02 ) res = max(res, disi02 + calc(ps[pos02], ps[pos022]));
                        if ( pos021 != ps.size() && pos021 > pos02 ) res = max(res, disi02 + calc(ps[pos02], ps[pos021]));
                }
                if ( pos01 != ps.size() && pos01 > i ) {
                        ll disi01 = calc(ps[i], ps[pos01]);
                        ll pos012 = lower_bound(ps.begin(), ps.end(), ps[pos01] + k) - ps.begin();
                        ll pos011 = pos012 - 1;
                        if ( pos012 != ps.size() && pos012 > pos01 ) res = max(res, disi01 + calc(ps[pos01], ps[pos012]));
                        if ( pos011 != ps.size() && pos011 > pos01 ) res = max(res, disi01 + calc(ps[pos01], ps[pos011]));
                }
        }
        cout << res << endl;
}
```
<hr>


## ABC236E_AverageAndMedian

#### 🔗
<a href="https://atcoder.jp/contests/abc236/tasks/abc236_e"><img src="https://img-blog.csdnimg.cn/067234edc7384a5bb0e9c52215c77902.png"></a>

#### 💡

::: tip
二分求平均数是一个经典的密度二分
:::

一个位置可以选或者不选，但是不能有两个相邻的不选  
这个我们可以感觉到 $dp$ 就可以推出来  

<b>平均数</b>  
问题在于： 在不同选中数量下，一个数对平均数的贡献是不同的  
但是我们求总值是很好求的  
这个就奠定了我们可以给出一个平均数 `ave` 来判断能否获得比这个平均数更大的值  
每一个数的贡献就变成了 `x-ave`  
只要最终贡献大于 `0` ，我们就可以说能造出来  
通过这个编写一个 `check` ，过程中采用 $dp$ 的解法去递推，判断最终结果即可  
  
<b>中位数</b>  
有了上一个问题做支撑  
我们也可以想到这个可以尝试用二分去解决  
根上一个不同的是，我们在设置期望中位数 `mid` 后，每一个数的贡献不同了  
思考中位数的命名性质，我们只要求出 “比 `mid` 大的数的个数” 减去 “比 `mid` 小的数的个数” 的差  
如果这个差大于 $0$ ，那么就说明我们可以造出比它更高的中位数  
  
两个 `check` 搭建完毕，可以二分了  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 1e5 + 10;
int n;
int a[N];
 
double f[2][N]; // 0:不选i，1:选i
inline bool Check1 ( double ave ) {
        for ( int i = 1; i <= n; i ++ ) {
                f[1][i] = max(f[1][i - 1] + 1.0 * a[i] - ave, f[0][i - 1] + 1.0 * a[i] - ave);
                f[0][i] = f[1][i - 1];
        }
        return max(f[1][n], f[0][n]) > 0;
}
inline void Solve1 () {
        double l = 0, r = 1e9;
        while ( l - r < -1e-6 ) {
                double mid = (l + r) / 2;
                if ( Check1(mid) ) l = mid;
                else r = mid;
        }
        printf("%.4f\n", l);
}
 
double g[2][N]; // 0:不选i，1:选i
inline bool Check2 ( int mid ) {
        for ( int i = 1; i <= n; i ++ ) {
                g[1][i] = max(g[1][i - 1] + (a[i] >= mid ? 1 : -1), g[0][i - 1] + (a[i] >= mid ? 1 : -1) );
                g[0][i] = g[1][i - 1];
        }
        return max(g[1][n], g[0][n]) > 0;
}
inline void Solve2 () {
        int l = 0, r = 1e9;
        int res = 0;
        while ( l <= r ) {
                int mid = (l + r) / 2;
                if ( Check2(mid) ) l = mid + 1, res = mid;
                else r = mid - 1;
        }
        printf("%d\n", res);
}
 
int main () {
        scanf("%d", &n);
        for ( int i = 1; i <= n; i ++ ) scanf("%d", &a[i]);
        Solve1();
        Solve2();
}
```
<hr>

## AcWing2694_最长公共子序列

#### 🔗
<a href="https://www.acwing.com/problem/content/2696/"><img src="https://img-blog.csdnimg.cn/20210617202526361.png"></a>

#### 💡
LCS是个动态规划问题，但我们可以用DP的思想贪过去  
  
因为a中每个数只出现过一次，所以在这道题里面，我们可以将问题转化为一个LIS问题  
  
首先设置一个数组id[]用来存入a数组里面的每个出现的数的下标  
  
然后将b数组转化为b'数组，即b'[i] = id[b[i]]用来表示：b数组中当前数在a数组中对应的下标  
  
那么要想b中的某个序列在a中也是其中的序列  
  
就需要我们得到的这个b'中的某个子序列，在a中出现过就行了，同时要保证在a中的下标是顺序的  
  
所以问题可以转化为求b'数组的最长上升子序列  
  
具体LIS问题求法可以看 -> [这里](https://blog.csdn.net/SnopzYz/article/details/117997834?spm=1001.2014.3001.5501)  
  
我们发现这个数据范围是$1e6$的，所以我们采用贪心+二分优化，时间复杂度O(nlogn)  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 1e6 + 10;

int id[N], n;
vector<int> vec;

int main(){
    read(n);
    for(int i = 1, x; i <= n; i ++)  read(x), id[x] = i;
    for(int i = 1, x; i <= n; i ++){ read(x);
        if(!id[x]) continue;//注意：如果没出现过那就不要加进去了
        if(vec.empty() || vec.back() < id[x]) vec.push_back(id[x]);
        else                                  vec[lower_bound(vec.begin(), vec.end(), id[x]) - vec.begin()] = id[x];
    }write(vec.size());
    return 0;
}
```

<hr>

## CodeForces1632D_NewYearConcert

#### 🔗

<a href="https://codeforces.com/contest/1632/problem/D"><img src="https://img-blog.csdnimg.cn/6c8a4705c9164eb6aca81bb43163d0f8.png"></a>

#### 💡
思索一下，如果我们对一个从 $i$ 开始的前缀可以发现存在这样 $gcd=l-r+1$ 的，那么我们可以在 $i$ 的位置加一个很大的质数从而隔断 $i$ 到 $1$ 的位置  
这样我们后面的任意一个位置到达 $i$ 都会变成 $gcd=1$ ，我们要从 $l=i+1$ 之后进行判断即可  
所以隔断后我们在后面枚举 $i$ 时只需要判断 $\sum\limits_{j=l+1}^i[gcd=i-j+1]$ 是否 $\ge 1$ 即是否存在  
注意一下单调性，对于固定的右端点，区间越长 $gcd$ 不会越来越大，同时区间长度越来越大，他们两个呈相遇状  
那么我们找这个满足 $gcd(a[j\rightarrow i])=i-j+1$ 就可以采用二分左端点的形式  
- 如果 $gcd(a[j\rightarrow i])<i-j+1$ 说明我们枚举的太长了，应该让左端点往右走  
- 如果 $gcd(a[j\rightarrow i])>i-j+1$ 就说明要往左走  
- 如果 $gcd(a[j\rightarrow i])=i-j+1$ 就说明找到了，存在这样的位置，我们对 $i$ 进行隔断然后让答案 $+1$ 即可   

注意中间存在区间查询 $gcd$ 的操作，可以使用 $st$ 表预处理  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 2e5 + 10;
ll st[N][25];
ll a[N];
ll n;

inline ll gcd ( ll a, ll b ) { return b ? gcd(b, a % b) : a; }
inline void Build(){ // 构建ST
        for ( int i = 1; i <= n; i ++ ) st[i][0] = a[i];
        ll k = 32 - __builtin_clz(n) - 1;
        for (ll j = 1; j <= k; j ++) {
                for (ll i = 1; i + (1 << j) - 1 <= n; i ++) {
                        st[i][j] = gcd(st[i][j - 1],st[i + (1 << (j - 1))][j - 1]);
                }
        }
}
ll Query(ll l, ll r){ // 查询
        ll k = 32 - __builtin_clz(r - l + 1) - 1;
        return gcd(st[l][k], st[r - (1 << k) + 1][k]);
}

inline int check ( ll p, ll i ) {
        ll qry = Query(p, i);
        if ( qry < i - p + 1 ) return -1;
        else if ( qry == i - p + 1 ) return 0;
        return 1;
}

inline void Solve () {
        cin >> n;
        for ( int i = 1; i <= n; i ++ ) cin >> a[i];
        Build();
        int l = 1, res = 0; // 隔断后面的第一个位置，答案
        for ( int i = 1; i <= n; i ++ ) {
                int R = i;
                int L = l;
                bool flg = 0;
                while ( L <= R ) {
                        int mid = (L + R) >> 1;
                        if ( check(mid, i) == 0) {
                                flg = true;
                                break;
                        } 
                        if ( check(mid, i) == 1 ) R = mid - 1;
                        else L = mid + 1;
                }
                if ( flg ) {
                        l = i + 1;
                        res ++;
                }
                cout << res << " ";
        }
}
```
<hr>


## CodeForces1611F_ATMAndStudents

#### 🔗
<a href="https://codeforces.com/contest/1611/problem/F"><img src="https://i.loli.net/2021/11/26/piPkK8fFsSXBa5C.png"></a>

#### 💡
看到这个题首先会想一段区间会被前缀影响也会被后缀影响，那么我们可以采用区间求解的形式  
  
由于收益的累加是从前往后的，所以我们建立一个前缀和  <img src="https://latex.codecogs.com/svg.image?\inline&space;\{sum\}" title="\inline \{sum\}" />  表示从  <img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="\inline 1" />  到  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  这一段的总收益为  <img src="https://latex.codecogs.com/svg.image?\inline&space;sum[i]" title="\inline sum[i]" />    
如果我们选  <img src="https://latex.codecogs.com/svg.image?\inline&space;[l,r]" title="\inline [l,r]" />  这一段，因为不看前面的收益了，所以从  <img src="https://latex.codecogs.com/svg.image?\inline&space;l" title="\inline l" />  到  <img src="https://latex.codecogs.com/svg.image?\inline&space;x" title="\inline x" />  的准确收益会是  <img src="https://latex.codecogs.com/svg.image?\inline&space;sum[x]-sum[l-1]" title="\inline sum[x] - sum[l - 1]" />   
而这一段能否被选择的关键在于**这一段准确收益的最小值是否低于<img src="https://latex.codecogs.com/svg.image?\inline&space;s" title="\inline s" />**  
  
好了， <img src="https://latex.codecogs.com/svg.image?\inline&space;\{sum\}" title="\inline \{sum\}" />  的**区间最小值**，可以开一个  <img src="https://latex.codecogs.com/svg.image?\inline&space;ST" title="\inline ST" />  表  


```cpp
for ( int i = 1; i <= n; i ++ ) st[i][0] = sum[i];

inline void Build () {
        int k = 32 - __builtin_clz(n) - 1;
        for ( int j = 1; j <= k; j ++ ) {
                for ( int i = 1; i + (1 << j) - 1 <= n; i ++ ) {
                        st[i][j] = min ( st[i][j - 1], st[i + (1 << (j - 1))][j - 1] );
                }
        }
}
inline ll Query ( int l, int r ) {
        int k = 32 - __builtin_clz(r - l + 1) - 1;
        return min ( st[l][k], st[r - (1 << k) + 1][k] );
}
```

那么如何确定最多能选多长的区间呢？  
由于区间长度的行于不行单调递增  
那么可以采用**二分区间长度**，对每一个二分到的区间长度下的区间最小值（准确收益下的）逐一判断  
如果不可行说明我们这个选的太长了，应该跑小的那一半，否则跑大的那一半  

```cpp
inline bool this_MinInLen ( int len ) {
        for ( int i = 1; i + len - 1 <= n; i ++ ) {
                ll cur = Query ( i, i + len - 1 );
                if ( s + (cur - sum[i - 1]) >= 0 ) { // cur-sum[i-1]：准确收益
                        if ( len > res.second - res.first + 1 ) res = {i, i + len - 1};
                        return true;
                }
        }
        return false;
}


int l = 1, r = n;
while ( l <= r ) {
        int mid = ( l + r ) >> 1;
        if ( this_MinInLen(mid) ) l = mid + 1;
        else                      r = mid - 1;
}
this_MinInLen ( l );
```

时间复杂度： $O(nlogn)$  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 2e5 + 10;
ll a[N], sum[N];
ll st[N][100];
int n;
ll s;
pair<int, int> res;

inline void Build () {
        int k = 32 - __builtin_clz(n) - 1;
        for ( int j = 1; j <= k; j ++ ) {
                for ( int i = 1; i + (1 << j) - 1 <= n; i ++ ) {
                        st[i][j] = min ( st[i][j - 1], st[i + (1 << (j - 1))][j - 1] );
                }
        }
}
inline ll Query ( int l, int r ) {
        int k = 32 - __builtin_clz(r - l + 1) - 1;
        return min ( st[l][k], st[r - (1 << k) + 1][k] );
}
inline bool this_MinInLen ( int len ) {
        for ( int i = 1; i + len - 1 <= n; i ++ ) {
                ll cur = Query ( i, i + len - 1 );
                if ( s + (cur - sum[i - 1]) >= 0 ) {
                        if ( len > res.second - res.first + 1 ) res = {i, i + len - 1};
                        return true;
                }
        }
        return false;
}

inline void Solve () {
        res = {0, -1};

        cin >> n >> s;
        for ( int i = 1; i <= n; i ++ ) {
                cin >> a[i];
                sum[i] = sum[i - 1] + a[i];
                st[i][0] = sum[i];
        }

        Build ();

        int l = 1, r = n;
        while ( l <= r ) {
                int mid = ( l + r ) >> 1;
                if ( this_MinInLen(mid) ) l = mid + 1;
                else                      r = mid - 1;
        }
        this_MinInLen ( l );
        
        if ( res.first <= res.second ) cout << res.first << " " << res.second << endl;
        else                           cout << -1 << endl;
}

int main () {
        ios::sync_with_stdio(false);
        int cass; cin >> cass; while ( cass -- ) {
                Solve ();
        }
}
```

<hr>

## CodeForces1512D_CorruptedArray

#### 🔗
<a href="https://codeforces.com/problemset/problem/1512/D在b排列中我们想舍弃一个数，然后将排列的前n个数的和等于第n+1个数，我们只需要求出整个b排列的sum，然后去寻找sum减去哪个数再/2可以在其中找到（而且不能是当前减去的那个数），删去的那个数为x，找到的那个数为b[n+1]"><img src="https://img-blog.csdnimg.cn/20210411083143257.png"></a>

#### 💡
在b排列中我们想舍弃一个数，然后将排列的前n个数的和等于第n+1个数，我们只需要求出整个b排列的sum，然后去寻找sum减去哪个数再/2可以在其中找到（而且不能是当前减去的那个数），删去的那个数为x，找到的那个数为b[n+1]

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
void solve()
{
    vector<ll> b;//b排列
    ll n;
    ll sum = 0;//排列的和
    cin >> n;
    for (ll i = 0; i < n + 2; i++)
    {
        ll x;
        cin >> x;
        b.push_back(x);
        sum += x;
    }
    sort(b.begin(), b.end());//排序，方便二分
    for (ll i = 0; i < b.size(); i++)
    {
        ll cur_sum = sum - b[i];
        if (cur_sum & 1)//奇数不再操作，因为无法准确/2
            continue;
        cur_sum /= 2;
        if (!binary_search(b.begin(), b.end(), cur_sum))//找不到的就不再操作
            continue;
        int con=b[i];//记录一下删掉的是哪个，下面两行有用
        b.erase(b.begin() + i, b.begin() + i + 1);
        if (!binary_search(b.begin(), b.end(), cur_sum))//唯一一个小坑点，可能会因为找到的数是当前的数，而当前的数又被删掉了
        {
            b.insert(b.begin()+i,con);//若删掉就再放回去，这次操作不能满足，continue了
            continue;
        }
        ll id = lower_bound(b.begin(), b.end(), cur_sum) - b.begin();//寻找我们应该设为b[n+1]的数
        b.erase(b.begin() + id, b.begin() + id + 1);//删掉这个数
        for (ll j = 0; j < b.size(); j++)//此时我们就只有n个数了，就是a的排列
        {
            cout << b[j] << " ";
        }
        return;
    }
    cout << "-1" << endl;//循环完了也找不到能满足的，就"-1"
}
int main()
{
    int cass;
    each_cass(cass)
    {
        solve();
    }
    return 0;
}
```

<hr>

## CodeForces1530C_Persuit

#### 🔗
https://codeforces.com/contest/1530/problem/C

#### 💡
一步一步向后走的话，很多模拟细节很难维护，而且走的次数会很多  
我们需要在 n 的后面找到一个满足条件的数  
而且要尽可能小  
这种大范围找数的题型可以用二分  
写个check函数判断一下就可以开始二分了  

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
#include <unordered_map>
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
#define TEST(a) cout << "---------" << a << "---------" << '\n'

#define CHIVAS_ int main()
#define _REGAL exit(0)

#define SP system("pause")
#define IOS ios::sync_with_stdio(false)
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

int n;

inline bool check(deque<int> da, deque<int> db, int x){
        for(int i = n + 1; i <= x; i ++){
                da.push_back(100); db.push_front(0);
        }
        int los = x / 4;
        while(los --) da.pop_front(), db.pop_front();
        int suma = 0, sumb = 0;
        for(int i = 0; i < da.size(); i ++) suma += da[i], sumb += db[i];
        return suma >= sumb;
}

inline void solve(){
        n = inputInt();
        deque<int> da, db;
        for(int i = 0; i < n; i ++) da.push_back(inputInt());
        for(int i = 0; i < n; i ++) db.push_back(inputInt());
        sort(ALL(da)); sort(ALL(db));
        
        int r = n * 10, l = n;
        while(l <= r){
                int mid = (l + r) >> 1;
                if(check(da, db, mid)) r = mid - 1;
                else l = mid + 1;
        }cout << r - n + 1 << endl;
}
int main(){
        int cass;
        EACH_CASE(cass){
                solve();
        }
}
```

<hr>

## ICPC2020上海站D_Walker

#### 🔗
<a href="https://codeforces.com/gym/102900/problem/D"><img src="https://img-blog.csdnimg.cn/a8392a32b3be40949f3988e1d84496ac.png"></a>

#### 💡
给定一条路，两个人的位置，两个人的速度，怎么样最快走完这条路  
  
如果考虑左左，左右，右左，右右这样会很麻烦，要根据速度还要考虑相遇点  
相遇最好，每个人都能做出贡献  
那么我们根据相遇入手  
  
首先要考虑一个人走完全程的情况  
然后是相遇点  
1.相遇完不扭头  
2.相遇完扭头  
  
相遇完不扭头很好计算，就直接对向走到头即可  
相遇完扭头我们可以二分一下 p1,p2 中间的相遇点  
对每个相遇点我们求一下两个人全部走完自己路程的最小用时  
其实有了相遇点这个就会很好求，就是每个人已经固定了要走的 l 和 r 了，在 l,r 内走需要 `(min(p-l,r-p)+(r-l))/v`  
所以在这里我们不需要考虑一个人左走还是右走，程序会用 `min` 判断  
  
我们二分一百次之后的中点就已经很确定了，每次维护一下花费时间的最小值即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
inline double LRTime ( double l, double r, double v, double p ) {
        return (min(p - l, r - p) + (r - l)) / v;
}

inline void Solve () {
        double n, p1, v1, p2, v2; 
        cin >> n >> p1 >> v1 >> p2 >> v2;

        if ( p1 > p2 ) swap(p1, p2), swap(v1, v2);

        double res = min(LRTime(0, n, v1, p1), LRTime(0, n, v2, p2));
        res = min(res, max((n - p1) / v1, p2 / v2));

        double l = p1, r = p2;
        for ( int i = 0; i < 100; i ++ ) {
                double mid = (l + r) / 2;
                double res1 = LRTime(0, mid, v1, p1);
                double res2 = LRTime(mid, n, v2, p2);

                res = min(res, max(res1, res2));
                if ( res1 > res2 ) r = mid;
                else l = mid;
        }

        printf("%.10f\n", res);
}

int main () {
        ios::sync_with_stdio(false);

        ll cass; cin >> cass; while ( cass -- ) {
                Solve();
        }
        
}
```

<hr>

## ICPC2021台湾省赛E_EatCoin

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

## NCD2019A_HasanTheLazyJudge

#### 🔗
<a href="https://codeforces.com/gym/102163/problem/A"><img src="https://s2.loli.net/2022/01/05/OLajGf3wosketHd.png"></a>

#### 💡
答案问我们在满足一定条件下的结果，要最优的  
可以使用二分答案  
  
我们对结果  <img src="https://latex.codecogs.com/svg.image?\inline&space;len" title="\inline len" /> 进行二分，思考这个答案如何进行  <img src="https://latex.codecogs.com/svg.image?\inline&space;check" title="\inline check" />  
  
首先，这两条线的长度都至少为  <img src="https://latex.codecogs.com/svg.image?\inline&space;len\times2" title="\inline len\times2" />   
我们设横线为  <img src="https://latex.codecogs.com/svg.image?\inline&space;p" title="\inline p" /> 竖线为  <img src="https://latex.codecogs.com/svg.image?\inline&space;q" title="\inline q" /> ，每条线都有  <img src="https://latex.codecogs.com/svg.image?\inline&space;\{a,b,pos\}" title="\inline \{a,b,pos\}" /> ，即端点、垂直坐标，我们枚举竖线，满足的情况应为  <img src="https://latex.codecogs.com/svg.image?\inline&space;q.pos\in[p.a+len,p.b-len]" title="\inline q.pos\in[p.a+len,p.b-len]" /> 且  <img src="https://latex.codecogs.com/svg.image?\inline&space;q.pos\in[q.a+len,q.b-len]" title="\inline q.pos\in[q.a+len,q.b-len]" />，这个集合  <img src="https://latex.codecogs.com/svg.image?\inline&space;\alpha" title="\inline \alpha" />  是包含在集合  <img src="https://latex.codecogs.com/svg.image?\inline&space;\beta:q.pos\in[p.a,p.b]" title="\inline q.pos\in[p.a+len,p.b-len]" /> 中的，我们首先要满足  <img src="https://latex.codecogs.com/svg.image?\inline&space;\alpha" title="\inline \alpha" /> 才能找  <img src="https://latex.codecogs.com/svg.image?\inline&space;\beta" title="\inline \beta" />      
我们可以把这两个情况用两种方式同步求  
   

对于  <img src="https://latex.codecogs.com/svg.image?\inline&space;\beta" title="\inline \alpha" />，可以发现这三者有偏序关系，所以排序就可以解决  
我们存入每个横线的  <img src="https://latex.codecogs.com/svg.image?\inline&space;a+len" title="\inline l" /> 和  <img src="https://latex.codecogs.com/svg.image?\inline&space;b-len" title="\inline b" /> 以及竖线的  <img src="https://latex.codecogs.com/svg.image?\inline&space;pos" title="\inline pos" /> ，将它们进行排序后进行遍历，如果当前遍历到的是横线的  <img src="https://latex.codecogs.com/svg.image?\inline&space;a" title="\inline a" /> ，就把这个横线的  <img src="https://latex.codecogs.com/svg.image?\inline&space;pos" title="\inline pos" /> 存入，如果是  <img src="https://latex.codecogs.com/svg.image?\inline&space;b" title="\inline b" /> 就把这个横线的  <img src="https://latex.codecogs.com/svg.image?\inline&space;pos" title="\inline pos" /> 弹出，这个可以用一个 `multiset` 来维护  
如果遍历到的是  <img src="https://latex.codecogs.com/svg.image?\inline&space;q" title="\inline q" /> 的  <img src="https://latex.codecogs.com/svg.image?\inline&space;pos" title="\inline pos" /> ，就是子集的求法  
已知所有存在 `multiset` 中的  <img src="https://latex.codecogs.com/svg.image?\inline&space;pos" title="\inline pos" /> 都是满足第一个集合的情况，我们在其中进行二分出满足  <img src="https://latex.codecogs.com/svg.image?\inline&space;[q.a+len" title="\inline [p.a" /> 这个子集的最左端，如果这个点也能满足  <img src="https://latex.codecogs.com/svg.image?\inline&space;\le&space;q.b-len" title="\inline \le&space;q.b-len" /> 那么就说明可能存在比这个答案更大的情况，我们就  <img src="https://latex.codecogs.com/svg.image?\inline&space;check" title="\inline check" /> 成功了  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
onst int N = 1e5 + 10;

struct node {
        int a, b, pos;
        inline friend bool operator < ( node a, node b ) {
                if ( a.a != b.a ) return a.a < b.a;
                return a.b < b.b;
        }
} p[N], q[N];
int n, m;

inline bool Check ( int len ) {
        vector<node> vec;
        for ( int i = 0; i < n; i ++ ) {
                if ( p[i].b - p[i].a >= 2 * len ) 
                        vec.push_back({p[i].a + len, 1, p[i].pos}), // 优先满足区间的左端点
                        vec.push_back({p[i].b - len, 3, p[i].pos}); // 最后满足区间的右端点
        }
        for ( int i = 0; i < m; i ++ ) {
                if ( q[i].b - q[i].a >= 2 * len ) 
                        vec.push_back({q[i].pos, 2, i}); // 我们要尽可能在两个端点中间看看有没有 q[i].pos
        }
        sort ( vec.begin(), vec.end() );

        multiset<int> mst;
        for ( auto i : vec ) {
                if ( i.b == 1 ) mst.insert(i.pos);
                else if ( i.b == 3 ) mst.erase(mst.find(i.pos));
                else {
                        auto id = mst.lower_bound(q[i.pos].a + len); // 找子集合的区间左端点
                        if ( id == mst.end() ) continue; // 找不到
                        if ( *id <= q[i.pos].b - len ) return true;  // 这个也能满足子集合的区间右端点
                }
        }
        return false;
}

inline void Solve () {
        cin >> n >> m;
        for ( int i = 0, x, y, z; i < n; i ++ ) cin >> x >> y >> z, p[i] = {min(x, y), max(x, y), z};
        for ( int i = 0, x, y, z; i < m; i ++ ) cin >> x >> y >> z, q[i] = {min(x, y), max(x, y), z};

        int l = 0, r = 5e4;
        int res = 0;
        while ( l <= r ) {
                int mid = (l + r) >> 1;
                if ( Check(mid) ) l = mid + 1, res = mid;
                else r = mid - 1;
        }
        cout << res << endl;
}

int main () {
        ios::sync_with_stdio(false);
        int cass; cin >> cass; while ( cass -- ) {
                Solve ();
        }
}
```

<hr>

## POJ3579_Median

#### 🔗
http://poj.org/problem?id=3579

#### 💡
一个比较妙的二分题  
首先我们获得差值的中位数  
而差值之间又无太大的关系  
所以我们利用中位数的性质  
在个数上做文章  
  
而本题中个数上操作的方法就是：二分找出所处差值在中间的元素  
check函数：枚举的差值，用a[i]-x然后upperbound遍历出比他小的数的个数和总差值数目(n*(n-1)/2)的关系  
然后在这层关系上二分缩l和r即可    

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

#define LOWBIT(x) ((x) & (-x))
#define LOWBD(a, x) lower_bound(a.begin(), a.end(), x) - a.begin()
#define UPPBD(a, x) upper_bound(a.begin(), a.end(), x) - a.begin()
#define TEST(a) cout << "---------" << a << "---------" << '<br>'

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

/*
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
*/inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

const int N = 1e5 + 10;
ll a[N], n, npr;

inline int check ( ll x ) {
        ll cnt = 0;
        for ( ll i = 1; i <= n; i ++ ) {
                cnt += upper_bound( a + 1, a + 1 + n, a[i] - x) - (a + 1);
        }
        return cnt < npr / 2 + 1;
}

inline void solve(){
        for ( int i = 1; i <= n; i ++ ) a[i] = inputLL(); sort(a + 1, a + 1 + n);

        int l = 0, r = a[n] - a[1];
        while ( l <= r ) {
                ll mid = (l + r) >> 1;
                if ( check (mid) ) r = mid - 1;
                else l = mid + 1;
        }
        outInt(r); puts("");
}

CHIVAS_{
        while ( scanf("%lld", &n) == 1 ) {
                npr = (n - 1) * n / 2;
                solve();
        }
        _REGAL;
};
```





<hr>
