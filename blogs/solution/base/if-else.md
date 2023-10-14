---
title: 分类讨论
---

###
<hr>

## HDU2021多校9J_UnfairContest

#### 🔗
<a href="https://vjudge.net/contest/461349#problem/J">![20221113230422](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113230422.png)</a>

#### 💡
解题时 $(s,t)$ 看反了，这里当反着讲了  
这里是两个限制下的总数，所以我们可以讨论我们填进 $[n]$ 的这个数算不算  
算的话说明不会被删除，有一个范围，不算的话说明会被删除，也会有一个范围  
确定 $a[n]$ 和 $b[n]$ 所在的范围后，我们可以直接用 $l_{a_n}-r_{b_n}$ 就求得最小值  
在分讨下，有三个主范围：1.$[n]$ 属于前 $s$ 个，2.$[n]$ 属于后 $t$ 个，3.在中间  
对于前两种，我们可以直接算出最后的总和，而对于中间的，我们可以算出在不算 $[n]$ 下的总和  
- 前 $s$ 个：$sum[n-1-t]-sum[s-1]$，可选范围在 $[1,x[s]]$
- 后 $t$ 个：$sum[n-1-t+1]-sum[s]$，可选范围在 $[x[n-1-t+1,h]$
- 中间：$sum[n-1-t]-sum[s]$，可选范围在 $[x[s],x[n-1-t+1]]$    

$a[n]$ 的三种情况和 $b[n]$ 的三种情况  
对于前两种情况互相匹配的，由于总和已经有了，直接判断然后求两者在范围内的最小差（首先要保证这是一个合法的范围即 $l<r$）    
对于含有最后一种情况的，如果是 $a[n]$ 是最后一种情况，$suma'+a_n>sumb\to sumb-suma'+1\le a_n\le h$ ，同时还有 $a_s\le a_n\le h$，两个范围卡出 $a_n$ 的最终范围  
如果 $b[n]$ 是最后一种，同理推得 $1\le b_n\le suma-sumb'-1$ 以及 $b_s\le b_n\le b_{n-1-t+1}$  
如果两者都在最后一种，即 $suma'+a_n>sumb'+b_n$ ，$a_n-b_n\ge sumb'-suma'+1$ ，要判断的不只是范围合法了，也要判断范围最大差是否满足 $\ge sumb'-suma'+1$ ，如果满足的话带上 $sumb'-suma'+1$ 求个最小值即可  
  
至于如果 $s=0$ 或 $t=0$ ，同样的方法去推，多讨论讨论就好了


#### ✅
```cpp
inline ll minDis (pair<ll, ll> a, pair<ll, ll> b) {
    if (a.second < a.first) return 2e18;
    if (b.second < b.first) return 2e18;
    return a.first - b.second;
}

const int N = 1e5 + 10;
ll a[N], b[N];
ll suma[N], sumb[N];

inline void Solve () {
    ll n, s, t, h; scanf("%lld%lld%lld%lld", &n, &t, &s, &h);
    for (int i = 1; i < n; i ++) scanf("%lld", &a[i]);
    for (int i = 1; i < n; i ++) scanf("%lld", &b[i]);
    sort(a + 1, a + n); 
    sort(b + 1, b + n);
    for (int i = 1; i < n; i ++) suma[i] = suma[i - 1] + a[i];
    for (int i = 1; i < n; i ++) sumb[i] = sumb[i - 1] + b[i];

    ll sa, sb;
    pair<ll, ll> range_a, range_b;
    ll res = 2e18;
    if (s && t) {
        // 1-1
        sa = suma[n - 1 - t] - suma[s - 1];
        sb = sumb[n - 1 - t] - sumb[s - 1];
        range_a = {1, a[s]}; range_b = {1, b[s]};
        if (sa > sb) res = min(res, minDis(range_a, range_b));
        // 1-2
        sb = sumb[n - 1 - t + 1] - sumb[s];
        range_b = {b[n - 1 - t + 1], h};
        if (sa > sb) res = min(res, minDis(range_a, range_b));
        // 1-3
        sb = sumb[n - 1 - t] - sumb[s];
        range_b = {max(b[s], 1ll), min(b[n - 1 - t + 1], sa - sb - 1)};
        res = min(res, minDis(range_a, range_b));
        // 2-1
        sa = suma[n - 1 - t + 1] - suma[s];
        sb = sumb[n - 1 - t] - sumb[s - 1];
        range_a = {a[n - 1 - t + 1], h};
        range_b = {1, b[s]};
        if (sa > sb) res = min(res, minDis(range_a, range_b));
        // 2-2
        sb = sumb[n - 1 - t + 1] - sumb[s];
        range_b = {b[n - 1 - t + 1], h};
        if (sa > sb) res = min(res, minDis(range_a, range_b));
        // 2-3
        sb = sumb[n - 1 - t] - sumb[s];
        range_b = {max(b[s], 1ll), min(b[n - 1 - t + 1], sa - sb - 1)};
        res = min(res, minDis(range_a, range_b));
        // 3-1
        sa = suma[n - 1 - t] - suma[s];
        sb = sumb[n - 1 - t] - sumb[s - 1];
        range_a = {max(a[s], sb - sa + 1), min(a[n - 1 - t + 1], h)};
        range_b = {1, b[s]};
        res = min(res, minDis(range_a, range_b));
        // 3-2
        sb = sumb[n - 1 - t + 1] - sumb[s];
        range_a = {max(a[s], sb - sa + 1), min(a[n - 1 - t + 1], h)};
        range_b = {b[n - 1 - t + 1], h};
        res = min(res, minDis(range_a, range_b));
        // 3-3
        range_a = {a[s], a[n - 1 - t + 1]};
        range_b = {b[s], b[n - 1 - t + 1]};
        sb = sumb[n - 1 - t] - sumb[s];
        if (minDis(range_a, range_b) != 2e18 && range_a.second - range_b.first >= sb - sa + 1) res = min(res, max(minDis(range_a, range_b), sb - sa + 1));
    } else if (s && !t) {
        // 1-1
        sa = suma[n - 1] - suma[s - 1];
        sb = sumb[n - 1] - sumb[s - 1];
        range_a = {1, a[s]}, range_b = {1, b[s]};
        if (sa > sb) res = min(res, minDis(range_a, range_b));
        // 1-3
        sb = sumb[n - 1] - sumb[s];
        range_b = {b[s], min(sa - sb - 1, h)};
        res = min(res, minDis(range_a, range_b));
        // 3-1
        sa = suma[n - 1] - suma[s];
        sb = sumb[n - 1] - sumb[s - 1];
        range_a = {max(a[s], sb - sa + 1), a[n - 1]};
        range_b = {1, b[s]};
        res = min(res, minDis(range_a, range_b));
        // 3-3
        range_a = {a[s], h};
        range_b = {b[s], h};
        sa = suma[n - 1] - suma[s];
        sb = sumb[n - 1] - sumb[s];
        if (minDis(range_a, range_b) != 2e18 && range_a.second - range_b.first >= sb - sa + 1) res = min(res, max(minDis(range_a, range_b), sb - sa + 1));
    } else if (!s && t) {
        // 2-2
        sa = suma[n - 1 - t + 1];
        sb = sumb[n - 1 - t + 1];
        range_a = {a[n - 1 - t + 1], h};
        range_b = {b[n - 1 - t + 1], h};
        if (sa > sb) res = min(res, minDis(range_a, range_b));
        // 2-3
        sb = sumb[n - 1 - t];
        range_b = {1, min(b[n - 1 - t + 1], sa - sb - 1)};
        res = min(res, minDis(range_a, range_b));
        // 3-2
        sa = suma[n - 1 - t];
        sb = sumb[n - 1 - t + 1];
        range_a = {max(1ll, sb - sa + 1), a[n - 1 - t + 1]};
        range_b = {b[n - 1 - t + 1], h};
        res = min(res, minDis(range_a, range_b));
        // 3-3
        sa = suma[n - 1 - t];
        sb = sumb[n - 1 - t];
        range_a = {1, a[n - 1 - t + 1]}, range_b = {1, b[n - 1 - t + 1]};
        if (minDis(range_a, range_b) != 2e18 && range_a.second - range_b.first >= sb - sa + 1) res = min(res, max(minDis(range_a, range_b), sb - sa + 1));
    } else { 
        // 3-3
        sa = suma[n - 1];
        sb = sumb[n - 1];
        range_a = {1, h}, range_b = {1, h};
        if (minDis(range_a, range_b) != 2e18 && range_a.second - range_b.first >= sb - sa + 1) res = min(res, max(minDis(range_a, range_b), sb - sa + 1));
    }

    if (res != 2e18) printf("%lld\n", res);
    else puts("IMPOSSIBLE");
}
```
<hr>
