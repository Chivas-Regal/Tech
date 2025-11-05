---
title: 网络流
---
###  


## 51Nod1442_士兵的旅行

#### 🔗
<a href="https://vjudge.net/problem/51Nod-1442">![20221113225836](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113225836.png)</a>

#### 💡
每个士兵只可以走一步，故不能单纯地连个图，不然会有士兵走完之后继续跟着流向下一个走  
所以我们要建出一个”死胡同“点，那么就让每一个接纳外界士兵的点不会向除了汇点之外别的点流  
那么这个点就和普通点分开了，设 $i$ 点的用于接纳外界士兵的点为 $i'$ ，发现 $i'$ 其实接纳 $i$ 的也可以，最终 $i'$ 向 $T$ 的容量必须是 $b_i$   
所以对每一个 $i$ ，连接 $S\to i$ 容量为 $a_i$ ，$i'\to T$ 容量为 $b_i$  
对于每一个无向边 $(u,v)$ ，连接 $u\to v'$ 容量为 $\infty$ ，$v\to u'$ 容量为 $\infty$ 

#### ✅
```cpp
const int N = 210;
const int M = 1e6 + 10;
struct Edge {
    int nxt, to, flow;
} edge[M];
int head[N], cnt = 1;
inline void add_Edge (int from, int to, int flow) {
    edge[++cnt] = {head[from], to, flow};
    head[from] = cnt;
    edge[++cnt] = {head[to], from, 0};
    head[to] = cnt;
}

int deep[N], aim;
inline bool bfs (int S, int T) {
    aim = T;
    memset(deep, 0, sizeof deep);
    deep[S] = 1;
    queue<int> que; que.push(S);
    while (!que.empty()) {
        int u = que.front(); que.pop();
        for (int i = head[u]; i; i = edge[i].nxt) {
            int v = edge[i].to;
            if (!deep[v] && edge[i].flow) {
                deep[v] = deep[u] + 1;
                que.push(v);
            }
        }
    }
    return deep[T];
}
inline int dfs (int u, int fl) {
    if (u == aim) return fl;
    int f = 0;
    for (int i = head[u]; i && fl; i = edge[i].nxt) {
        int v = edge[i].to;
        if (deep[v] == deep[u] + 1 && edge[i].flow) {
            int x = dfs(v, min(fl, edge[i].flow));
            fl -= x;
            f += x;
            edge[i].flow -= x;
            edge[i ^ 1].flow += x;
        }
    }
    if (!f) deep[u] = -2;
    return f;
}
inline int dicnic (int S, int T) {
    int ret = 0;
    while (bfs(S, T)) ret += dfs(S, 0x3f3f3f3f);
    return ret;
}

int main () {
    int n, m; scanf("%d%d", &n, &m);
    int S = n * 2 + 1, T = S + 1;
    int suma = 0;
    for (int i = 1, x; i <= n; i ++) {
        scanf("%d", &x);
        add_Edge(S, i, x);
        add_Edge(i, i + n, 0x3f3f3f3f);
        suma += x;
    }
    int sumb = 0;
    for (int i = 1, x; i <= n; i ++) {
        scanf("%d", &x);
        add_Edge(i + n, T, x);
        sumb += x;
    }
    for (int i = 1; i <= m; i ++) {
        int u, v; scanf("%d%d", &u, &v);
        add_Edge(u, n + v, 0x3f3f3f3f);
        add_Edge(v, n + u, 0x3f3f3f3f);
    }
    int mxf = dicnic(S, T);
    if (mxf == sumb && mxf == suma) puts("YES");
    else puts("NO");

}
```


## 洛谷P1251_餐巾计划问题

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1251">![20221113203606](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113203606.png)</a>

#### 💡
每一天都可以向别的天运流，故以天为节点  
有一个特点，就是本天用脏的抹布，今天可以不投送去洗，到回头再洗  
那么就要有一个脏抹布的流通道，为了分清脏抹布和干净抹布，每一天拆成两部分，早上和晚上  
早上可以买抹布、接收洗完的抹布，晚上向第二天晚上运输脏抹布或者向第 $i+d1$ 天和 $i+d2$ 天运输干净抹布  
这里每一个抹布洗净都需要花费，那么就是以单独的抹布为单位水量的费用流    
令 `add_Edge(i, j, f, c)` 表示节点 $i$ 到节点 $j$ 的容量为 $f$ ，单位流量的花费为 $c$，令第 $i$ 天白天为 $i$ ，晚上为 $i+n$     
两种洗抹布方式：第一种间隔 $d1$ 天，每个花费 $c1$ ，第二种间隔 $d2$ 天，每个花费 $c2$
  
流通道为以下几种  
- 白天购买抹布：`add_Edge(S, i, inf, p)` 
- 晚上补齐脏抹布：`add_Edge(S, i + n, r[i], 0)`
- 晚上用第一种方式洗抹布：`add_Edge(i + n, i + d1, inf, c1)`
- 晚上用第二种方式洗抹布：`add_Edge(i + n, i + d2, inf, c2)`
- 晚上向下一天晚上存抹布：`add_Edge(i + n, i + n + 1, inf, 0)`
  
同时要有一个保证最大流满足每天要求的通道：`add_Edge(i, T, r[i], 0)`  
那么在最大流的时候就可以满足要求了，求一下费用即可  

#### ✅
```cpp
# define int ll
const int N = 4010;
const int M = 1e6 + 10;
struct Edge {
    int nxt, to, flow, cost;
} edge[M];
int head[N], cnt = 1;
inline void add_Edge (int from, int to, int flow, int cost) {
    edge[++cnt] = {head[from], to, flow, cost};
    head[from] = cnt;
    edge[++cnt] = {head[to], from, 0, -cost};
    head[to] = cnt;
}

int n, r[N];
int p, d1, c1, d2, c2;

int aim;
int dis[N], vis[N];
inline bool spfa (int S, int T) {
    aim = T;
    for (int i = S; i <= T; i ++) dis[i] = 1e18;
    // memset(vis, 0, sizeof vis);
    dis[S] = 0;
    queue<int> que; que.push(S); vis[S] = 1;
    while (!que.empty()) {
        int u = que.front(); que.pop();
        vis[u] = 0;
        for (int i = head[u]; i; i = edge[i].nxt) {
            int v = edge[i].to;
            if (dis[v] > dis[u] + edge[i].cost && edge[i].flow) {
                dis[v] = dis[u] + edge[i].cost;
                if (!vis[v]) que.push(v), vis[v] = 1;
            }
        }
    }
    return dis[T] != 1e18;
}

int mincost, maxflow;
inline int dfs (int u, int fl) {
    if (u == aim) {
        maxflow += fl;
        return fl;
    }
    vis[u] = 1;
    int f = 0;
    for (int i = head[u]; i && fl; i = edge[i].nxt) {
        int v = edge[i].to;
        if (dis[v] == dis[u] + edge[i].cost && edge[i].flow && !vis[v]) {
            int x = dfs(v, min(fl, edge[i].flow));
            f += x; fl -= x;
            edge[i].flow -= x;
            edge[i ^ 1].flow += x;
            mincost += x * edge[i].cost;
        }
    }
    vis[u] = 0;
    if (!f) dis[u] = 1e18;
    return f;
}

signed main () {
    scanf("%lld", &n);
    for (int i = 1; i <= n; i ++) scanf("%lld", &r[i]);
    scanf("%lld%lld%lld%lld%lld", &p, &d1, &c1, &d2, &c2);

    int S = 0, T = 2 * n + 1;
    for (int i = 1; i <= n; i ++) {
        add_Edge(i, T, r[i], 0);
        if (i + 1 <= n)  add_Edge(i + n, i + n + 1, 1e18, 0);
        if (i + d1 <= n) add_Edge(i + n, i + d1, 1e18, c1);
        if (i + d2 <= n) add_Edge(i + n, i + d2, 1e18, c2);
        add_Edge(S, i + n, r[i], 0);
        add_Edge(S, i, 1e18, p);
    }

    while (spfa(S, T)) dfs(S, 1e18);

    printf("%lld\n", mincost);
}
```


## 洛谷P1264_K-联赛

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1264">![20220829151121](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220829151121.png)</a>

#### 💡
想让每场比赛都打，并且在图上有一定的方向要求，考虑到网络流的流向分配问题。  
每场比赛都打就意味着每条边都优先使用，而如果让源点和汇点都连接人的话，那么是无法通过边的。  
所以可以将每条边的中间开一个点，让源点连接这些边中的点，汇点连接每个人，就可以保证尽可能走互相的边，也就是对应着尽量去两两比赛。  
而方向要求则是：在未知与 $i$ 比赛的全让第 $i$ 个人赢且带上已经固定输赢的情况下，每一个人有一个已经赢的次数 $deg$ ，令最终 $deg_j\le deg_i$ 为目标，去分配未知比赛的输赢  
所以 $S$ 向 $(x,y)$ 连边的容量为 $a_{xy}$ ，$x$ 向 $T$ 连边的容量为 $deg_i-deg_x$ ，每个人的 $deg$ 增量不超过 $deg_i-deg_x$，这样就满足了要求  
在这张图上判断是否可以让 $i$ 赢的方式即是否能让每条边都用上，即满流。

#### ✅
```cpp
const int N = 1e3 + 10;
const int M = 1e4 + 10;
struct Edge {
    int nxt, to, flow;
} edge[M];
int head[N], cnt;
inline void add_Edge (int from, int to, int flow) {
    edge[++cnt] = {head[from], to, flow};
    head[from] = cnt;
    edge[++cnt] = {head[to], from, 0};
    head[to] = cnt;
}

int deep[N];
int aim;
inline bool bfs (int S, int T) {
    memset(deep, 0, sizeof deep);
    aim = T;
    queue<int> que; que.push(S);
    deep[S] = 1;
    while (!que.empty()) {
        int u = que.front(); que.pop();
        for (int i = head[u]; i; i = edge[i].nxt) {
            int v = edge[i].to;
            if (!deep[v] && edge[i].flow) {
                deep[v] = deep[u] + 1;
                que.push(v);
            }
        }
    }
    return deep[T];
}
inline int dfs (int u, int fl) {
    if (u == aim) return fl;
    int f = 0;
    for (int i = head[u]; i && fl; i = edge[i].nxt) {
        int v = edge[i].to;
        if (deep[v] == deep[u] + 1 && edge[i].flow) {
            int x = dfs(v, min(fl, edge[i].flow));
            edge[i].flow -= x;
            edge[i ^ 1].flow += x;
            fl -= x;
            f += x;
        }
    }
    if (!f) deep[u] = -2;
    return f;
}
inline int dicnic (int S, int T) {
    int ret = 0;
    while (bfs(S, T)) ret += dfs(S, 0x3f3f3f3f);
    return ret;
}

int n, deg[N], g[30][30];

int pt_idx;

inline bool check (int x) {
    cnt = 1;
    for (int i = 1; i <= pt_idx; i ++) head[i] = 0;

    pt_idx = n;
    int S = ++pt_idx, T = ++pt_idx;
    int degx = deg[x];
    for (int i = 1; i <= n; i ++) {
        if (i != x) deg[x] += g[i][x];
    }
    for (int i = 1; i <= n; i ++) {
        if (i == x) continue;
        if (deg[i] > deg[x]) {
            deg[x] = degx;
            return false;
        }
        add_Edge(i, T, deg[x] - deg[i]);
    }
    int sumflow = 0;
    for (int i = 1; i <= n; i ++) {
        for (int j = i + 1; j <= n; j ++) {
            if (!g[i][j] || i == x || j == x) continue;
            sumflow += g[i][j];
            ++pt_idx;
            add_Edge(S, pt_idx, g[i][j]);
            add_Edge(pt_idx, i, g[i][j]);
            add_Edge(pt_idx, j, g[i][j]);
        }
    }
    int maxflow = dicnic(S, T);
    deg[x] = degx;
    return maxflow == sumflow;
}

int main () {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    cin >> n;
    for (int i = 1; i <= n; i ++) {
        int w, d; cin >> w >> d;
        deg[i] += w;
    }
    for (int i = 1; i <= n; i ++) {
        for (int j = 1; j <= n; j ++) {
            cin >> g[i][j];
        }
    }
    for (int i = 1; i <= n; i ++) {
        //cout << " " << i << endl;
        if (check(i)) cout << i << " ";   
    }
}
```

## 洛谷P2754_家园 / 星际转移问题

#### 🔗
<a href="https://www.luogu.com.cn/problem/P2754">![20221113203951](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113203951.png)</a>

#### 💡
如果就是正常平面上画一个图，会发现出现绕环的情况，也就是对于一条航母路线，是一个环，这样就会导致环上两个点同时接收流量的情况出现，而正常来看是有时间存在的  
既然存在时间，那就多加一条时间线，而对于相同的节点，在不同时刻是存在不同的状态，它们不是一个点  
故一个时间开 $n+2$ 个节点（$n$ 个空间站和地月球），那么就在 $i$ 时刻，$j$ 航母可以用 $S[j][i\%sz[j]]$ 与 $S[j][(i+1)\%sz[j]]$ 相连，容量就是该航母容量 $r[j]$    
而且相邻时刻下，同一个节点的人是可以留在这个点的，就对每一个时刻的每一个节点向下一个时刻的该节点传递一个 $\infty$ 的容量  
那么为了研究 $0$ 到 $t$ 时间，能运走多少人，开 $t+1$ 个时刻进行上面的操作，然后就需要源点向每一个时刻的地球都挂 $\infty$ 个人，然后让每一时刻的月球连向汇点容量为 $\infty$ ，$t$ 时间内能运走的人数就是总流量  
这只是能判断出来这么长时间能运多少，这是一个判定条件，且时间越长能运的越多  
故开二分  

#### ✅
```cpp
const int N = 15, M = 25, K = 55;
struct Edge {
    int nxt, to, flow;
} edge[N * K * N * N + 10];
int head[N * K * N + 10], cnt;
inline void add_Edge (int from, int to, int flow) {
    edge[++cnt] = {head[from], to, flow};
    head[from] = cnt;
    edge[++cnt] = {head[to], from, 0};
    head[to] = cnt;
}
inline void init_Edge () {
    memset(head, 0, sizeof head);
    cnt = 1;
}

int deep[N * K * N + 10], aim;
inline bool bfs (int S, int T) {
    aim = T;
    memset(deep, 0, sizeof deep);
    deep[S] = 1; queue<int> que;
    que.push(S);
    while (!que.empty()) {
        int u = que.front(); que.pop();
        for (int i = head[u]; i; i = edge[i].nxt) {
            int v = edge[i].to;
            if (edge[i].flow && !deep[v]) {
                deep[v] = deep[u] + 1;
                que.push(v);
            }
        }
    }
    return deep[T];
}
inline int dfs (int u, int fl) {
    if (u == aim) return fl;
    int f = 0;
    for (int i = head[u]; i && fl; i = edge[i].nxt) {
        int v = edge[i].to;
        if (deep[v] == deep[u] + 1 && edge[i].flow) {
            int x = dfs(v, min(fl, edge[i].flow));
            edge[i].flow -= x;
            edge[i ^ 1].flow += x;
            fl -= x;
            f += x;
        }
    }
    if (!f) deep[u] = -2;
    return f;
}
inline int dicnic (int S, int T) {
    int ret = 0;
    while (bfs(S, T)) ret += dfs(S, 0x3f3f3f3f);
    return ret;
}

vector<int> path[M];
int h[M], sz[M];
int n, m, k;

int S, T;
int mat[N * K][N];
inline bool Check (int x) {
    init_Edge();
    for (int i = 0; i + 1 < x; i ++) {
        for (int j = 1; j <= m; j ++) {
            int u = path[j][i % sz[j]];
            int v = path[j][(i + 1) % sz[j]];
            add_Edge(mat[i][u], mat[i + 1][v], h[j]);
        }
        for (int j = 0; j <= n + 1; j ++) 
            add_Edge(mat[i][j], mat[i + 1][j], 0x3f3f3f3f);
    }
    for (int i = 0; i < x; i ++) 
        add_Edge(S, mat[i][0], 0x3f3f3f3f),
        add_Edge(mat[i][n + 1], T, 0x3f3f3f3f);
    int mxf = dicnic(S, T);
    return mxf >= k;
}

int main () {
    for (int i = 0; i < N * K; i ++) for (int j = 0; j < N; j ++) mat[i][j] = i * N + j;
    S = N * K * N;
    T = S + 1;

    scanf("%d%d%d", &n, &m, &k);
    for (int i = 1; i <= m; i ++) {
        scanf("%d%d", &h[i], &sz[i]);
        for (int j = 1; j <= sz[i]; j ++) {
            int x; scanf("%d", &x);
            path[i].push_back(x == -1 ? n + 1 : x);
        }
    }

    int l = 1, r = N * K - 1, res = 0x3f3f3f3f;
    while (l <= r) {
        int mid = (l + r) >> 1;
        if (Check(mid)) res = mid, r = mid - 1;
        else l = mid + 1;
    }
    printf("%d\n", res == 0x3f3f3f3f ? 0 : res - 1);
}
```


## 洛谷P2763_试题库问题

#### 🔗
<a href="https://www.luogu.com.cn/problem/P2763">![20221113203457](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113203457.png)</a>

#### 💡
建图说得很明确了，属于的关系就建图，试题域 $[1,n]$ ，类型域 $[n+1,n+k]$ ，$S=n+k+1,\;T=n+k+2$  
首先是给定的分配要求，必须全满，那就是对应的如果 $x$ 类型要 $c$ 个，就 `add_Edge(S, k + i, c)`  
其次是给定的属于关系，对应如果 $x$ 试题属于 $y$ 类型，潜藏性质为每个试题只能用一次，就 `add_Edge(k + y, x, 1)`  
其次必须汇向 $T$ ，那么最后连接的是每个试题，那就每个试题只能用一次的性质连向 $T$ ，即 `add_Edge(i, T, 1)`    
那么如果满流说明有解，否则必有缺的类型，输出无解  
在确定分配方案时，其实就是如果一条反边有流量，说明这条边正向流过，那么对应一个试题 $x$ 和一种类型 $y$ ，如果 $x\to y$ 有流量，说明 $y$ 使用了试题 $x$ ，就要将 $x$ 加入 $y$ 的分配中   

#### ✅
```cpp
const int N = (1000 + 20 + 2) + 10;
const int M = 1e6 + 10;
struct Edge {
    int nxt, to, flow;
} edge[M];
int head[N], cnt = 1;
inline void add_Edge (int from, int to, int flow) {
    edge[++cnt] = {head[from], to, flow};
    head[from] = cnt;
    edge[++cnt] = {head[to], from, 0};
    head[to] = cnt;
}

int deep[N], aim;
inline bool bfs (int S, int T) {
    aim = T;
    memset(deep, 0, sizeof deep);
    deep[S] = 1;
    queue<int> que; que.push(S);
    while (!que.empty()) {
        int u = que.front(); que.pop();
        for (int i = head[u]; i; i = edge[i].nxt) {
            int v = edge[i].to;
            if (edge[i].flow && deep[v] == 0) {
                deep[v] = deep[u] + 1;
                que.push(v);
            }
        }
    }
    return deep[T];
}
inline int dfs (int u, int fl) {
    if (u == aim) return fl;
    int f = 0;
    for (int i = head[u]; i && fl; i = edge[i].nxt) {
        int v = edge[i].to;
        if (edge[i].flow && deep[v] == deep[u] + 1) {
            int x = dfs(v, min(fl, edge[i].flow));
            fl -= x;
            f += x;
            edge[i].flow -= x;
            edge[i ^ 1].flow += x;
        }
    }
    if (!f) deep[u] = -2;
    return f;
}
inline int dicnic (int S, int T) {
    int ret = 0;
    while (bfs(S, T)) ret += dfs(S, 0x3f3f3f3f);
    return ret;
}

int k, n;

int main () {
    scanf("%d%d", &k, &n);
    int S = n + k + 1, T = S + 1;
    int sum = 0;
    for (int i = 1; i <= k; i ++) {
        int c; scanf("%d", &c);
        add_Edge(S, n + i, c);
        sum += c;
    }
    for (int i = 1; i <= n; i ++) {
        int len; scanf("%d", &len);
        for (int j = 1; j <= len; j ++) {
            int x; scanf("%d", &x);
            add_Edge(n + x, i, 1);
        }
        add_Edge(i, T, 1);
    }
    int mxf = dicnic(S, T);
    if (mxf != sum) {
        printf("No Solution!\n");
        return 0;
    }
    for (int u = n + 1; u <= n + k; u ++) {
        printf("%d:", u - n);
        for (int i = head[u]; i; i = edge[i].nxt) {
            int v = edge[i].to;
            if (v == S) continue;
            if (edge[i ^ 1].flow) printf(" %d", v);
        }
        printf("\n");
    }
}
```


## ICPC2018南京I_MagicPotion 

#### 🔗
<a href="https://codeforces.com/gym/101981/attachments">![20220924135305](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220924135305.png)</a>

#### 💡
一个关于分配哪个人去打哪个怪兽的问题，边的分配就可以考虑网络流了  
一个人默认可以打一个，可以最多吃一瓶药再打一个，这两种打法是不同性质的，故需要两个副源点  
一个从 $S$ 接收 $n$ 代表默认打，一个从 $S$ 接收 $k$ 代表嗑药打  
每一个副源点都向每一个人连接一条为 $1$ 的边代表在这种情况下每个人最多可以打一个，然后让每个人向自己可以打的怪兽连一条 $1$ 的边代表每个怪兽一个人只能打一下，然后每个怪兽向 $T$ 连接一条为 $1$ 的边代表每个怪兽最多可以被打一次  
好了建完了，最大流板子一上就过了  

#### ✅
```cpp
const int N = 2010;
const int M = 1e7 + 10;
struct Edge {
    int nxt, to, flow;
} edge[M];
int head[N], curhead[N], cnt = 1;

inline void add (int from, int to, int flow) {
    edge[++cnt] = {head[from], to, flow};
    head[from] = cnt;
    edge[++cnt] = {head[to], from, 0};
    head[to] = cnt;
}

int aim;
int deep[N];
inline bool bfs (int S, int T) {
    memset(deep, 0, sizeof deep);
    aim = T;
    deep[S] = 1;
    queue<int> que; que.push(S);
    while (!que.empty()) {
        int u = que.front(); que.pop();
        for (int i = head[u]; i; i = edge[i].nxt) {
            int v = edge[i].to;
            if (!deep[v] && edge[i].flow) {
                deep[v] = deep[u] + 1;
                que.push(v);
            }
        }
    }
    return deep[T];
}
inline int dfs (int u, int fl) {
    if (u == aim) return fl;
    int f = 0;
    for (int i = head[u]; i && fl; i = edge[i].nxt) {
        int v = edge[i].to;
        if (edge[i].flow && deep[v] == deep[u] + 1) {
            int x = dfs(v, min(fl, edge[i].flow));
            edge[i].flow -= x;
            edge[i ^ 1].flow += x;
            fl -= x;
            f += x;
        }
    }
    if (!f) deep[u] = -2;
    return f;
}
inline int dicnic (int S, int T) {
    int ret = 0;
    while (bfs(S, T)) ret += dfs(S, 0x3f3f3f3f);
    return ret;
}

int main () {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    int n, m, k; cin >> n >> m >> k;
    for (int i = 1; i <= n; i ++) {
        int sz; cin >> sz;
        for (int j = 0; j < sz; j ++) {
            int x; cin >> x;
            add(i, n + x, 2);
        }
    }
    int idxp = n + m;
    int S = ++idxp, T = ++idxp;
    int p1 = ++idxp, p2 = ++idxp;
    add(S, p1, n);
    add(S, p2, k);
    for (int i = 1; i <= n; i ++) add(p1, i, 1), add(p2, i, 1);
    for (int i = 1; i <= m; i ++) add(n + i, T, 1);

    cout << dicnic(S, T) << endl;
}
```

## UVA563_Crimewave

#### 🔗
<a href="https://vjudge.net/problem/UVA-563">![20221113225551](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113225551.png)</a>

#### 💡
其实如果正常来看是可以矩阵边就当边建去连接相邻的交点，然后银行要走到外面就是给外围的一圈点连向汇点，源点走向每一个目标银行  
但是这里注意到每一个点只可以使用一次，那么就是依旧需要开一个限制边来表示这个点  
故一个交点拆成一个入点和一个出点，入点接收周围四个的点，出点向周围四个点发送，入点和出点开一条容量为 $1$ 的边从而使得这个点只能有 $1$ 的流量  


#### ✅
```cpp
const int N = 55;
const int NN = N * N * 2;
const int M = NN * 100;
struct Edge {
    int nxt, to, flow;
} edge[M];
int head[NN], cnt = 1;
inline void add_Edge (int from, int to, int flow) {
    edge[++cnt] = {head[from], to, flow};
    head[from] = cnt;
    edge[++cnt] = {head[to], from, 0};
    head[to] = cnt;
}
int dx[] = {0, 0, 1, -1};
int dy[] = {1, -1, 0, 0};

int n, m, b;
inline int getId (int x, int y, int op) { // {0:in} {1:out}
    return ((x - 1) * m + y) + n * m * (op == 1);
}

int deep[NN], aim;
inline bool bfs (int S, int T) {
    aim = T;
    memset(deep, 0, sizeof deep);
    deep[S] = 1; queue<int> que; que.push(S);
    while (!que.empty()) {
        int u = que.front(); que.pop();
        for (int i = head[u]; i; i = edge[i].nxt) {
            int v = edge[i].to;
            if (edge[i].flow && !deep[v]) {
                deep[v] = deep[u] + 1;
                que.push(v);
            }
        }
    } 
    return deep[T];
}
inline int dfs (int u, int fl) {
    if (u == aim) return fl;
    int f = 0;
    for (int i = head[u]; i && fl; i = edge[i].nxt) {
        int v = edge[i].to;
        if (deep[v] == deep[u] + 1 && edge[i].flow) {
            int x = dfs(v, min(fl, edge[i].flow));
            edge[i].flow -= x;
            edge[i ^ 1].flow += x;
            fl -= x;
            f += x;
        }
    }
    if (!f) deep[u] = -2;
    return f;
}
inline int dicnic (int S, int T) {
    int ret = 0;
    while (bfs(S, T)) ret += dfs(S, 0x3f3f3f3f);
    return ret;
}

inline void Solve () {
    scanf("%d%d%d", &n, &m, &b);
    int S = getId(n, m, 1) + 1, T = S + 1;
    for (int i = 0; i <= T; i ++) head[i] = 0; cnt = 1;
    for (int x = 1; x <= n; x ++) {
        for (int y = 1; y <= m; y ++) {
            add_Edge(getId(x, y, 0), getId(x, y, 1), 1);
            if (x == 1 || x == n || y == 1 || y == m) add_Edge(getId(x, y, 1), T, 1);
            else {
                for (int i = 0; i < 4; i ++) {
                    int nx = x + dx[i];
                    int ny = y + dy[i];
                    if (nx >= 1 && nx <= n && ny >= 1 && ny <= m) 
                        add_Edge(getId(x, y, 1), getId(nx, ny, 0), 1);
                }
            }
        }
    }
    for (int i = 1; i <= b; i ++) {
        int x, y; scanf("%d%d", &x, &y);
        add_Edge(S, getId(x, y, 0), 1);
    }

    int mxf = dicnic(S, T);
    if (mxf != b) printf("not ");
    puts("possible");
}
int main () {
    int cass; scanf("%d", &cass); while (cass --) {
        Solve();
    }
}
```
