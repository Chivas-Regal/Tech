---
title: 基环树
---

###
<hr>

## HDU2021多校7G_LinkWithLimit 

#### 🔗
<a href="https://vjudge.net/contest/461347#problem/G">![20221113232011](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113232011.png)</a>

#### 💡
首先这是一个图都能注意到，每条边为 $i\to f[i]$  
然后看到这个公式其实也就是 $x$ 行走无穷路径的路径权值平均数  
最后一定会进一个环这个也是显而易见的，因为每个点都有一个目标节点  
在平均数下，无穷的路径代表无穷绕环，那么环上的数在总和的占比会无限增大，即平均值最后趋向环上的平均值  
所以我们只需要提出来每个环，然后判断这个环的边权平均数是否相等即可  


#### ✅
```cpp
const int N = 1e5 + 10;
int n, f[N];
int vis[N], visblk[N];
int nod[N];
inline int find (int x) {return x == nod[x] ? x : nod[x] = find(nod[x]);}
inline void merge (int x, int y) {
    x = find(x); y = find(y);
    if (x == y) return;
    nod[x] = y;
}

ll sum, num;
inline void dfs (int i) {
    if (vis[i] == 1) {
        sum += i;
        num ++;
    } else if (vis[i] > 1) return;
    vis[i] ++;
    dfs(f[i]);
}

inline void Solve () {
    scanf("%d", &n);
    for (int i = 1; i <= n; i ++) vis[i] = visblk[i] = 0, nod[i] = i;
    for (int i = 1; i <= n; i ++) {
        scanf("%d", &f[i]);
        merge(i, f[i]);
    }

    vector<pair<ll, ll> > rols;
    for (int i = 1; i <= n; i ++) {
        if (!visblk[find(i)]) {
            sum = num = 0;
            dfs(i);
            rols.push_back({sum, num});
            visblk[find(i)] = 1;
        }
    }
    for (int i = 1; i < rols.size(); i ++) {
        if (llabs(rols[i].first * rols[i - 1].second - rols[i - 1].first * rols[i].second)) {
            printf("NO\n");
            return;
        }
    }
    printf("YES\n");
}

int main () {
    int t; scanf("%d", &t); while (t --) {
        Solve();
    }
}
```
<hr>
