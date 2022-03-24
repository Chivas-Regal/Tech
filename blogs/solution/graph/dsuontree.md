---
title: 树上启发式合并
---

##
<hr>

## CodeForces600E_LomsatGelral

#### 🔗
<a href="https://codeforces.com/contest/600/problem/E">![20220324201640](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220324201640.png)</a>

#### 💡
本题为模板题，知识点与伪代码看[这里](https://tech.chivas-regal.top/blogs/algorithm/graph/dsuontree.html)  
本题 $AC$ 代码已批注释

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 1e5 + 10;
const int M = 2e5 + 10;
struct Edge {
        int nxt, to;
} edge[M];
int head[N], cnt;
inline void add_Edge ( int from, int to ) {
        edge[++cnt] = { head[from], to };
        head[from] = cnt;
}

int n, col[N], num[N];

int son[N], sz[N];
inline void pre_Son ( int u, int fa ) { // todo: 预处理出重儿子
        sz[u] = 1; son[u] = 0;
        for ( int i = head[u]; i; i = edge[i].nxt ) {
                int v = edge[i].to;
                if ( v == fa ) continue;
                pre_Son(v, u);
                sz[u] += sz[v];
                if ( sz[v] > sz[son[u]] ) son[u] = v;
        }
}

int flag;
ll max_num, max_col, res[N];
inline void dfs_Count ( int u, int fa, int val ) { // todo: 暴力处理出 flag 节点之外的所有点从而得到的答案
        num[col[u]] += val;
        if ( num[col[u]] > max_num ) // 更新最大颜色
                max_num = num[col[u]],
                max_col = col[u];
        else if ( num[col[u]] == max_num ) // 同数量颜色要累加
                max_col += col[u];
        
        for ( int i = head[u]; i; i = edge[i].nxt ) {
                int v = edge[i].to;
                if ( v == fa || v == flag ) continue;
                dfs_Count(v, u, val);
        }
}

inline void dfs_Main ( int u, int fa, bool keep ) { // todo: 树上启发式合并
        for ( int i = head[u]; i; i = edge[i].nxt ) {
                int v = edge[i].to;
                if ( v == fa || v == son[u] ) continue;
                dfs_Main(v, u, false); // 先递归轻儿子
        }
        if ( son[u] ) dfs_Main(son[u], u, true), flag = son[u]; // 递归重儿子

        dfs_Count(u, fa, 1); // 暴力统计所有轻儿子树
        res[u] = max_col;
        flag = 0;
        if ( !keep ) { // 这是个轻节点，删除它的所有贡献信息
                dfs_Count(u, fa, -1); 
                max_num = max_col = 0; // 它对最大值的贡献也要删除
        }
}


int main () {
        scanf("%d", &n);
        for ( int i = 1; i <= n; i ++ ) scanf("%d", &col[i]);
        for ( int i = 1; i < n; i ++ ) {
                int u, v; scanf("%d%d", &u, &v);
                add_Edge(u, v);
                add_Edge(v, u);
        }

        pre_Son(1, 0);
        dfs_Main(1, 0, 1);

        for ( int i = 1; i <= n; i ++ ) printf("%lld ", res[i]);
}
```
<hr>
