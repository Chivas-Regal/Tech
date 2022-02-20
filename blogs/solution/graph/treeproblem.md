---
title: 树上问题
---
###  
<hr>

## 树的重心

### POJ1655_BalancingAct

#### 🔗
<a href="http://poj.org/problem?id=1655"><img src="https://i.loli.net/2021/09/27/goTJAuW86V52F3U.png"></a>  

#### 💡
本题是让输出树的值最小的重心和这个重心的重量   
算是模板题  
  
回溯求得  
我们要求的每个树的子树大小然后进行比较，得到一个初步的重量  
拿这个初步的重量和另一端的重量进行比较，也就是`n-sz[x]`  
得到后，根据重心的性质：如果重量小于等于n/2，那么可以成为树的重心  
在这个条件下进行比较当前点是否满足，满足的话比较一下数值大小   
  
最后输出重心和重量

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 2e4 + 10, M = 5e4;
int n;

namespace TreeMap {
        struct Edge { int nxt, to; } edge[M];
        int head[M], cnt;
        inline void Init () {
                for ( int i = 0; i < M; i ++ ) head[i] = -1;
                cnt = 0;
        }
        inline void add_Edge ( int from, int to ) {
                edge[ ++ cnt ] = { head[from], to };
                head[from] = cnt;
        }
} using namespace TreeMap;


namespace TreeWeightCenter {
        int sz[N], weight[N], center;
        inline void Init () {
                for ( int i = 0; i < N; i ++ ) 
                        sz[i] = 1, 
                        weight[i] = 0;
                center = 1e9;
        }
        inline void dfs ( int x, int fath ) {
                for ( int i = head[x]; ~i; i = edge[i].nxt ) {
                        int to = edge[i].to;
                        if ( to == fath ) continue;
                        dfs ( to, x );
                        sz[x] += sz[to]; // 子树大小
                        weight[x] = max ( weight[x], sz[to] ); // 重量选择最大子树大小
                }
                weight[x] = max ( weight[x], n - sz[x] ); // 还要和另一端的子树对比一下
                if ( weight[x] <= n / 2 ) center = min ( center, x ); // 可以作为重心
        }
} using namespace TreeWeightCenter;


int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif
        int cass; scanf("%d", &cass); while ( cass -- ) {
                TreeMap::Init(); TreeWeightCenter::Init();
                scanf("%d", &n);
                for ( int i = 1, a, b; i < n; i ++ )
                        scanf("%d%d", &a, &b),
                        add_Edge(a, b),
                        add_Edge(b, a);
                dfs ( 1, 1 );
                printf("%d %d\n", center, weight[center]);
        }
}
```

<hr>

## 树链剖分

### 洛谷P3384_【模板】轻重链剖分树链剖分

#### 🔗
<a href="https://www.luogu.com.cn/problem/P3384"><img src="https://img-blog.csdnimg.cn/2bfd48f1132546ff818bd88abcea01e0.png"></a>

#### 💡
板子，包含了路径修改查询，子树修改查询  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const ll N = 1e5 + 10;
const ll M = 2e5 + 10;

ll a[N], n, m, r, p;

namespace Map {
        struct Edge {
                ll nxt, to;
        } edge[M];
        ll cnt, head[M];

        inline void add_Edge ( ll from, ll to ) {
                edge[ ++cnt ] = { head[from], to };
                head[from] = cnt;
        }

} using namespace Map;

namespace TreeDivid {
        ll top[N], fa[N], son[N], sz[N], dep[N];
        ll dfn[N], id[N], idx;
        inline void DFS1 ( ll x, ll fath ) {
                sz[x] = 1; dep[x] = dep[fath] + 1;
                son[x] = 0, fa[x] = fath;
                for ( ll i = head[x]; i; i = edge[i].nxt ) {
                        ll to = edge[i].to; if ( to == fath ) continue;
                        DFS1 ( to, x );
                        sz[x] += sz[to];
                        if ( sz[son[x]] < sz[to] ) son[x] = to;
                }
        }
        inline void DFS2 ( ll x, ll topx ) {
                top[x] = topx;
                dfn[ ++ idx ] = x; id[x] = idx;
                if ( son[x] ) DFS2 ( son[x], topx );
                for ( ll i = head[x]; i; i = edge[i].nxt ) {
                        ll to = edge[i].to;
                        if ( to == fa[x] || to == son[x] ) continue;
                        DFS2 ( to, to );
                }
        }
} using namespace TreeDivid;

namespace SegmentTree {
        struct Sgtr {
                ll val, lazy;
        }sgtr[ N << 2 ];
        inline void pushUp ( ll rt ) {
                sgtr[rt].val = (sgtr[rt << 1].val + sgtr[rt << 1 | 1].val) % p;
        }
        inline void pushDown ( ll l, ll r, ll rt ) {
                if ( !sgtr[rt].lazy ) return;
                auto &now = sgtr[rt], &lson = sgtr[rt << 1], &rson = sgtr[rt << 1 | 1];
                ll mid = (l + r) >> 1;
                lson.lazy += now.lazy; lson.val += now.lazy * (mid - l + 1);
                rson.lazy += now.lazy; rson.val += now.lazy * (r - mid);
                now.lazy = 0;
        }
        inline void Build ( ll l, ll r, ll rt ) {
                sgtr[rt].lazy = 0;
                if ( l == r ) { sgtr[rt].val = a[dfn[l]]; return; }
                ll mid = (l + r) >> 1;
                Build ( l, mid, rt << 1 );
                Build ( mid + 1, r, rt << 1 | 1);
                pushUp ( rt );
        }
        inline void Update ( ll a, ll b, ll c, ll l, ll r, ll rt ) {
                if ( a <= l && r <= b ) { sgtr[rt].val = (sgtr[rt].val + c * (r - l + 1) % p) % p; sgtr[rt].lazy = (sgtr[rt].lazy + c) % p; return; }
                if ( a > r || b < l ) return;
                ll mid = (l + r) >> 1;
                pushDown ( l, r, rt );
                Update ( a, b, c, l, mid, rt << 1 );
                Update ( a, b, c, mid + 1, r, rt << 1 | 1);
                pushUp ( rt );
        }
        inline ll Query ( ll a, ll b, ll l, ll r, ll rt ) {
                if ( a <= l && r <= b ) return sgtr[rt].val;
                if ( a > r || b < l ) return 0;
                ll mid = (l + r) >> 1;
                pushDown ( l, r, rt );
                return (Query ( a, b, l, mid, rt << 1 ) + Query ( a, b, mid + 1, r, rt << 1 | 1)) % p;
        }
} using namespace SegmentTree;

inline void Change ( ll x, ll y, ll c ) {
        while ( top[x] != top[y] ) {
                if ( dep[top[x]] < dep[top[y]] ) swap ( x, y );
                Update ( id[top[x]], id[x], c, 1, n, 1 );
                x = fa[top[x]];
        }
        if ( dep[x] > dep[y] ) swap ( x, y );
        Update ( id[x], id[y], c, 1, n, 1 );
}
inline ll Get ( ll x, ll y ) {
        ll res = 0;
        while ( top[x] != top[y] ) {
                if ( dep[top[x]] < dep[top[y]] ) swap ( x, y );
                res = (res + Query ( id[top[x]], id[x], 1, n, 1 )) % p;
                x = fa[top[x]];
        }
        if ( dep[x] > dep[y] ) swap ( x, y );
        return (res + Query ( id[x], id[y], 1, n, 1 )) % p;
}

int main () {
        ios::sync_with_stdio(false);
        cin >> n >> m >> r >> p;
        for ( ll i = 1; i <= n; i ++ ) cin >> a[i];
        for ( ll i = 1, x, y; i < n; i ++ ) {
                cin >> x >> y;
                add_Edge ( x, y );
                add_Edge ( y, x );
        }
        DFS1 ( r, 0 ); DFS2 ( r, r ); Build (1, n, 1);
        while ( m -- ) {
                ll op; cin >> op;
                if ( op == 1 ) {        // 路径操作
                        ll x, y, z; cin >> x >> y >> z;
                        Change ( x, y, z );
                } else if ( op == 2 ) { // 路经查询
                        ll x, y; cin >> x >> y;
                        cout << Get ( x, y ) << endl;
                } else if ( op == 3 ) { // 子树操作
                        ll x, z; cin >> x >> z;
                        Update ( id[x], id[x] + sz[x] - 1, z, 1, n, 1 );
                } else {                // 子树查询
                        ll x; cin >> x;
                        cout << Query ( id[x], id[x] + sz[x] - 1, 1, n, 1 ) << endl;
                }
         }
}
```

<hr>

## 虚树

### 洛谷P2495_消耗战

#### 🔗
<a href="https://www.luogu.com.cn/problem/P2495"><img src="https://i.loli.net/2021/10/16/L7D5hCdegkOGptv.png"></a>

#### 💡
首先想到树形dp向上转移  
对于i，当前儿子是to，预处理出来1到每个节点的最短距离minv[i]  
如果to是关键点：dp[i] += minv[i]  
如果to不是关键点：dp[i] += min ( minv[i], dp[to] )  
  
而题目中询问的是总和  
那么我们其实就可以算出来影响到的点和边的dp最优解  
有很多没受到影响的其实不必要跑dp，时间承担不了  
对需要的跑dp，可以想到构建一棵虚树  
再虚树上跑  
  
就对关键点和交汇点建立虚树即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <map>
#include <vector>
#include <cstring>
#include <algorithm>
#include <unordered_map>
#include <queue>

#define ll long long
using namespace std;

const int N = 500500;
const int M = 10000;


int n, q, num;

namespace Map {
        struct Edge {
                int nxt, to;
                ll val;
        }edge[N << 1], vedge[N << 1]; // 主树边，虚树边
        int  head[N << 1],  cnt = 0;  // 主树指针
        int vhead[N << 1], vcnt = 0;  // 虚树指针
        inline void add_Edge ( int from, int to, ll val ) { // 添加主树
                edge[ ++ cnt ] = (Edge){ head[from], to, val };
                head[from] = cnt;
        }
        inline void add_vEdge ( int from, int to ) {        // 添加虚树 
                vedge[ ++ vcnt ] = (Edge){ vhead[from], to };
                vhead[from] = vcnt;
        }
} using namespace Map;

namespace VirtualTree {
        int dfscnt = 1, dfn[N]; // dfs序
        int dep[N];             // 深度
        int fa[N][25];          // 父亲st表
        int mxFa[N];            // 优化 -> i最多有mxFa[i]层祖先
        ll  minv[N];             // 1到i的最小边权是minv[i]
        
        // 预处理fa[][]，dfn[]，minv[]
        inline void dfs ( int pos ) {
                int k;
                for ( k = 0; fa[pos][k]; k ++ ) fa[pos][k + 1] = fa[fa[pos][k]][k];
                mxFa[pos] = k;
                dfn[pos] = dfscnt ++;
                for ( int i = head[pos]; i; i = edge[i].nxt ) {
                        int to = edge[i].to;
                        if ( !dfn[to] ) 
                                dep[to] = dep[pos] + 1,
                                minv[to] = min ( minv[pos], edge[i].val ),
                                fa[to][0] = pos,
                                dfs ( to );
                }
        }

        // st求LCA
        inline int LCA ( int x, int y ) {
                if ( dep[x] < dep[y] ) swap ( x, y );
                for ( int i = mxFa[x]; i >= 0; i -- ) if ( dep[fa[x][i]] >= dep[y] ) x = fa[x][i];
                if ( x == y ) return x;
                for ( int i = mxFa[x]; i >= 0; i -- ) if ( fa[x][i] != fa[y][i] ) x = fa[x][i],
                                                                                  y = fa[y][i];
                return fa[x][0];
        }
        int stk[N], top; // 单调栈
        int lst[N];      // 查询的一套关键点
        inline void build () {
                sort ( lst + 1, lst + num + 1, [&]( int x, int y ) { return dfn[x] < dfn[y]; } ); // 按dfs序排序
                stk[top = 1] = lst[1]; // 此时stk[0] = 0，dep[0] = 0，深度最小的哨兵
                for ( int i = 2; i <= num; i ++ ) {
                        int now = lst[i];
                        int lca = LCA ( now, stk[top] );
                        while ( 1 ) {
                                if ( dep[lca] >= dep[stk[top - 1]] ) { // lca已在下面，应作为右链元素了
                                        if ( lca != stk[top] ) {       // top要删掉了
                                                add_vEdge ( lca, stk[top] );
                                                if ( lca != stk[top - 1] ) stk[top] = lca; // lca加入
                                                else                       top --;         // lca已有
                                        }
                                        break;
                                } else { // 一直弹直到lca在下面
                                        add_vEdge ( stk[top - 1], stk[top] );
                                        top --;
                                }
                        }
                        stk[ ++ top ] = now;
                }
                while ( --top ) add_vEdge ( stk[top], stk[top + 1] );
        }
} using namespace VirtualTree;

bool query[N];
inline ll dp ( int pos ) {
        ll sum = 0, res;
        for ( int i = vhead[pos]; i; i = vedge[i].nxt ) sum += dp ( vedge[i].to );
        if ( query[pos] ) res = minv[pos];
        else              res = min ( minv[pos], sum );
        // 实时清空
        query[pos] = false;
        vhead[pos] = 0;
        return res;
}

int main () {
        minv[1] = 1e18;
        scanf("%d", &n);
        for ( ll i = 0, x, y, val; i < n - 1; i ++ ) 
                scanf("%lld%lld%lld", &x, &y, &val),
                add_Edge ( x, y, val ),
                add_Edge ( y, x, val );
        dfs ( 1 );
        scanf("%d", &q);
        while ( q -- ) {
                scanf("%d", &num);
                for ( int i = 1; i <= num; i ++ ) scanf("%d", &lst[i]), query[lst[i]] = true;
                build();
                printf("%lld\n", dp(stk[1]));
                vcnt = 0;
        }
} 

```

<hr>

### 洛谷P3320_寻宝游戏

#### 🔗
<a href="https://www.luogu.com.cn/problem/P3320"><img src="https://img-blog.csdnimg.cn/99765486d7484a738eb3c6fe5786d5b6.png"></a>

#### 💡
可以观察到每一次的值都是虚树的边权和的两倍  
但是这棵虚树我们不需要完整地造出来  
因为我们只是求它的边权和，并没有转移  
所以可以用STL实现点的删除和增加（这里用的是set  
  
预处理LCA，每一次加点其实就是计算改变的边权  
改变的是这个插入的点和它dfs序内两个相邻虚点的距离  
两点距离 = dist[i] + dist[j] - dist[lca] * 2  
求相邻的两个点可以直接使用set.lower_bound-1和upper_bound实现  
  
最后如果虚树不为空还要加上两个哨兵之间的距离  
（这里弄了一个大哨兵和一个小哨兵）  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
namespace Map {
        struct Edge {
                int nxt, to;
                ll val;
        } edge[M];
        int cnt = 0;
        int head[M];
        inline void add_Edge ( int from, int to, ll val ) {
                edge [ ++ cnt ] = (Edge){ head[from], to, val };
                head[from] = cnt;
        } 
} using namespace Map;

namespace ProblemOnTree {
        int dep[N], fa[N][25], mxFa[N];
        ll  dist[N];
        int dfn[N], dfsid = 0, nfd[N];
        inline void dfs ( int pos, int fath ) {
                int k;
                for ( k = 0; fa[pos][k]; k ++ ) fa[pos][k + 1] = fa[fa[pos][k]][k];
                mxFa[pos] = k;
                dfn[pos] = ++dfsid, nfd[dfsid] = pos;
                for ( int i = head[pos]; i; i = edge[i].nxt ) {
                        int to = edge[i].to;
                        if ( to == fath ) continue;
                        dep[to] = dep[pos] + 1;
                        fa[to][0] = pos;
                        dist[to] = dist[pos] + edge[i].val;
                         dfs ( to, pos );
                }
        }
        inline int LCA ( int x, int y ) {
                if ( dep[x] < dep[y] ) swap ( x, y );
                for ( int i = mxFa[x]; i >= 0; i -- ) if ( dep[fa[x][i]] >= dep[y] ) x = fa[x][i];
                if ( x == y ) return x;
                for ( int i = mxFa[x]; i >= 0; i -- ) if ( fa[x][i] != fa[y][i] ) x = fa[x][i], y = fa[y][i];
                return fa[x][0];
        }
        inline ll Dis ( int x, int y ) {
                return dist[x] + dist[y] - dist[LCA(x, y)] * 2;
        }
} using namespace ProblemOnTree;

int n, m; 
ll res;
int x, y, z;
set<int> st;

int main () {
        scanf("%d%d", &n, &m);
        for ( int i = 1; i < n; i ++ ) {
                scanf("%d%d%d", &x, &y, &z);
                add_Edge ( x, y, z );
                add_Edge ( y, x, z );
        }
        dfs ( 1, 1 );
        st.insert(-1); st.insert(99999999);
        for ( int i = 0, x, op; i < m; i ++ ) {
                scanf("%d", &x);
                if ( *st.lower_bound(dfn[x]) == dfn[x] )  op = -1, st.erase(dfn[x]); 
                else                                      op = 1,  st.insert(dfn[x]);
                
                int l = *--st.lower_bound(dfn[x]), r = *st.upper_bound(dfn[x]);

                if ( l != -1 )                  res += Dis ( nfd[l], x ) * op;
                if ( r != 99999999 )            res += Dis ( x, nfd[r] ) * op;
                if ( l != -1 && r != 99999999 ) res -= Dis ( nfd[l], nfd[r] ) * op;

                printf("%lld\n", res + (st.size() == 2 ? 0 : Dis(nfd[*++st.begin()], nfd[*--st.lower_bound(99999999)])) );
        }
}
```

<hr>

## 子树问题

### ABC239E_SubtreeK-thMax

#### 🔗
<a href="https://atcoder.jp/contests/abc239/tasks/abc239_e"><img src="https://img-blog.csdnimg.cn/25a30af4e188482980e8e955f94e5fcd.png"></a>

#### 💡
这个题的突破口在于是否能快速注意到数据范围 $k\le 20$  
注意到这个就很好做了  
每个点维护一个子树权值的小顶堆，装入子树下最大的 $20$ 个点权  
用 $DFS$ 回溯维护  
每次查询就跑一下这个堆即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 1e5 + 10;
const int M = 2e5 + 10;
priority_queue<int, vector<int>, greater<int> > pque[N];
int n, q;
struct Edge {
        int nxt, to;
} edge[M];
int head[N], cnt;
inline void add_Edge ( int from, int to ) {
        edge[++cnt] = { head[from], to };
        head[from] = cnt;
}
int val[N];
 
inline void DFS ( int x, int fa ) {
        pque[x].push(val[x]);
        for ( int i = head[x]; i; i = edge[i].nxt ) {
                int y = edge[i].to;
                if ( y == fa ) continue;
                DFS(y, x);
                priority_queue<int> tmp;
                while ( pque[y].size() ) {
                        tmp.push(pque[y].top());
                        if ( pque[x].size() < 20 ) pque[x].push(pque[y].top());
                        else {
                                if ( pque[y].top() > pque[x].top() ) pque[x].pop(), pque[x].push(pque[y].top());
                        }
                        pque[y].pop();
                }
                while ( tmp.size() ) pque[y].push(tmp.top()), tmp.pop();
        } 
}
 
int main () {
        scanf("%d%d", &n, &q);
        for ( int i = 1; i <= n; i ++ ) scanf("%d", &val[i]);
        for ( int i = 0; i < n - 1; i ++ ) {
                int a, b; scanf("%d%d", &a, &b);
                add_Edge(a, b);
                add_Edge(b, a);
        }
        DFS(1, 1);
        while ( q -- ) {
                int v, k; scanf("%d%d", &v, &k);
                priority_queue<int> tmp;
                while ( pque[v].size() ) tmp.push(pque[v].top()), pque[v].pop();
                int idx = 0;
                while ( tmp.size() ) {
                        idx ++;
                        if ( idx == k ) printf("%d\n", tmp.top());
                        pque[v].push(tmp.top()); tmp.pop();
                }
        }
}
```
<hr>


### CodeForces1626E_BlackAndWhiteTree

#### 🔗
<a href="https://codeforces.com/contest/1626/problem/E"><img src="https://s2.loli.net/2022/01/18/ipuAclJtRTLyNEw.png"></a>

#### 💡
如果一个点只有它的两侧各有一个点，那么它是可以动的，但仍会选另一个点导致弹回原位，我们把它视作动不了  
我们考虑什么样的边可以保证通过（并且不弹回来）  
对于  <img src="https://latex.codecogs.com/svg.image?\inline&space;x\rightarrow&space;y" title="\inline x\rightarrow&space;y" /> 以  <img src="https://latex.codecogs.com/svg.image?\inline&space;y" title="\inline y" /> 为根的子树有多于两个黑点，那么我们可以借用一个黑点走到  <img src="https://latex.codecogs.com/svg.image?\inline&space;y" title="\inline y" /> 然后再借用另一个往里走，这个是不会弹回来的，所以这条边是可以走的  
如果  <img src="https://latex.codecogs.com/svg.image?\inline&space;y" title="\inline y" /> 黑点，  <img src="https://latex.codecogs.com/svg.image?\inline&space;x" title="\inline x" /> 只需要一步就可以走到他想去的点，所以也可以视作能走  
  
如果对于每个方向都求一次  <img src="https://latex.codecogs.com/svg.image?\inline&space;son[i]" title="\inline son[i]" /> 那么时间肯定不允许  
但是由于子树的性质：   
如果整棵树以  <img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="\inline 1" /> 为根  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;y" title="\inline y" /> 的子树  <img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="\inline 1" /> 为  <img src="https://latex.codecogs.com/svg.image?\inline&space;son[y]" title="\inline son[y]" />   
 子树  <img src="https://latex.codecogs.com/svg.image?\inline&space;2" title="\inline 2" /> 为  <img src="https://latex.codecogs.com/svg.image?\inline&space;son[1]-son[y]+y" title="\inline son[1]-son[y]+y" />   
   
利用这个性质，我们遍历一次 DFS 即可  
然后我们根据上面对“边是否能走”的判断来建一个新图  
如果  <img src="https://latex.codecogs.com/svg.image?\inline&space;x\rightarrow&space;y" title="\inline x\rightarrow&space;" /> 可以走，那么我们建一条  <img src="https://latex.codecogs.com/svg.image?\inline&space;y\rightarrow&space;x" title="\inline y\rightarrow&space;x" /> 的边，这样的话我们从所有黑点多源 BFS 即可走出所有能到达黑点的点  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int M = 6e5 + 10;
const int N = 3e5 + 10;
struct Edge {
        int nxt, to;
} edge[2][M];
int head[2][N], cnt[2];
inline void add_Edge ( int from, int to, int id ) {
        edge[id][++cnt[id]] = { head[id][from], to };
        head[id][from] = cnt[id];
}
int n, c[N];
int fa[N];
int num[N];

inline void DFS ( int x, int fath ) {
        fa[x] = fath;
        num[x] += c[x];
        for ( int i = head[0][x]; i; i = edge[0][i].nxt ) {
                int y = edge[0][i].to;
                if ( y == fath ) continue;
                DFS(y, x);
                num[x] += num[y];
        }
}

int main () {
        scanf("%d", &n);
        for ( int i = 1; i <= n; i ++ ) scanf("%d", &c[i]);
        for ( int i = 0; i < n - 1; i ++ ) {
                int a, b; scanf("%d%d", &a, &b);
                add_Edge(a, b, 0);
                add_Edge(b, a, 0);
        }        
        DFS(1, -1);

        for ( int x = 1; x <= n; x ++ ) {
                for ( int i = head[0][x]; i; i = edge[0][i].nxt ) {
                        int y = edge[0][i].to;
                        if ( c[x] ) {
                                add_Edge(x, y, 1);
                        } else {
                                if ( fa[y] == x && num[1] - num[y] > 1 ) add_Edge(x, y, 1);
                                else if ( fa[x] == y && num[x] > 1 )     add_Edge(x, y, 1);
                        }
                }
        }

        queue<int> que;
        for ( int i = 1; i <= n; i ++ ) if ( c[i] ) que.push(i);
        while ( que.size() ) {
                int x = que.front(); que.pop();
                for ( int i = head[1][x]; i; i = edge[1][i].nxt ) {
                        int y = edge[1][i].to;
                        if ( !c[y] ) 
                                c[y] = 1,
                                que.push(y);
                }
        }
        for ( int i = 1; i <= n; i ++ ) printf("%d ", c[i]);
}
```

<hr>
