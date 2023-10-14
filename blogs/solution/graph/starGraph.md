---
title: 特殊图
---

###  
<hr>

## 牛客2022寒假算法基础集训营2E_小沙的长路

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/23477/E"><img src="https://img-blog.csdnimg.cn/16eed0f102a94997bf1dc8b00e7a3b6c.png"></a>

#### 💡
对于最短的最长路，也就是竞赛图，直接使用性质 $n-1$   

对于最长的最长路，考虑半欧拉有向图的性质  
即首尾出度入度相差 $1$ ，别的相等   
以及欧拉图的性质  
即所有点入度等于出度  
注意每个点最多有 $n-1$ 个度   
  
那么对于 $n$ 是偶数， $n-1$ 是奇数，所以我们只能造半欧拉图  
我们别的节点用 $n-2$ 的度来平分入度出度，两个点度为 $n-1$ 来满足上述性质，此时最长路为 $\frac{(n-2)\times(n-2)+2\times(n-1)}{2}$  
对于 $n$ 是奇数，$n-1$ 是偶数，我们完全可以造欧拉图  
我们让每个点度均为 $n-1$ ，那么最长路为 $\frac{n(n-1)}{2}$    

#### ✅
```cpp
int main () {
        ios::sync_with_stdio(false);

        ll n; cin >> n;
        if ( n % 2 == 0 ) {
                ll res1 = n - 1;
                ll res2 = (n - 2) * (n - 2) + 2 * (n - 1);
                cout << res1 << ' ' << res2 / 2 << endl;
        } else {
                ll res1 = n - 1;
                ll res2 = (n - 1) * n;
                cout << res1 << " " << res2 / 2 << endl;
        }
} 
```
<hr>

## 牛客练习赛99E_NP-Easy问题

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/34330/E">![20220528010046](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220528010046.png)</a>

#### 💡
首先有一个很显然的结论：<mark>对点染色，要求邻点颜色不同，那么最少使用颜色数量为该图中最大完全子图中点的个数</mark>  
如果能明白这个结论了，那问题就不难了  
对于 $0$ ，说明这是一个完全图，要求 $m=\frac{n(n+1)}2=m$  
对于 $-1$ ，说明去掉一个点之后是一个完全图  
那么如果删去 $i$ ，$m$ 要减去 $deg_i$ ，我们看删去哪个点后 $m$ 依然最大，那么也就是找最小的 $deg_i$ ，看看删去之后是否 $m=\frac{(n-1)(n-2)}{2}$  
如果都不满足就只能输出 $-2$   
  
当然本题有很多要卡常的地方，因为 $\sum m\le10^6$ 但是 $n$ 没有限制  
所以我们每次建边时将存在邻边的点存一下，然后查询最小的 $deg_i$ 和清空 $deg$ 都用这个容器来进行更新即可   

#### ✅
```cpp
int deg[1000006];

inline void Solve () {
        int n, m; scanf("%d%d", &n, &m);
        set<int> hasedge;
        int minsz = 0x3f3f3f3f;
        for (int i = 0; i < m; i ++) {
                int u, v; scanf("%d%d", &u, &v);
                deg[u] ++;
                deg[v] ++;
                hasedge.insert(u);
                hasedge.insert(v);
        }
        if (m == 1ll * (n - 1) * n / 2) {
                puts("0");
                goto end;
        }

        if (hasedge.size() != n) minsz = 0;
        else {
                for (int i : hasedge) minsz = min(minsz, deg[i]);
        }
        if (m - minsz >= 1ll * (1ll * n - 1) * (1ll * n - 2) / 2) {
                puts("-1");
                goto end;
        }
        puts("-2");
        end:;
        for (int i : hasedge) deg[i] = 0;
}
```
<hr>

