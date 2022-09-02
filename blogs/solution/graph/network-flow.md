---
title: 网络流
---
###  
<hr>

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

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
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
<hr>
