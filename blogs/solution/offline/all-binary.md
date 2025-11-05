---
title: 整体二分
---

###

## 洛谷P1527_矩阵乘法

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1527">![20221113202835](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113202835.png)</a>

#### 💡
对于一个询问可以二分答案，看某个数值下对于这个子矩阵是否能占满 $k$   
故整体二分下有一个数值域，有一个事件域，有一个位置域  
对于数值域下 $[l,r]$ 与事件域下 $[L,R]$ ，将修改事件的数值在 $[l,mid]$ 内的位置进行更新为 $1$，看子矩阵下的和是否够 $k$，如果够的话尝试向更小的数走放进左类，否则就减去记录(子矩阵的和)放进右类  
对于矩阵修改查询，使用二维树状数组即可  

#### ✅
```cpp
const int N = 510;
int t[N][N];
inline int lowbit (int x) { return x & -x; }
inline void update (int idx, int idy, int c) {
    while (idx < N) {
        int ty = idy;
        while (idy < N) {
            t[idx][idy] += c;
            idy += lowbit(idy);
        }
        idy = ty;
        idx += lowbit(idx);
    }
}
inline int query (int idx, int idy) {
    int res = 0;
    while (idx) {
        int ty = idy;
        while (idy) {
            res += t[idx][idy];
            idy -= lowbit(idy);
        }
        idy = ty;
        idx -= lowbit(idx);
    }
    return res;
}
inline int query (int x1, int y1, int x2, int y2) {
    return query(x2, y2) - query(x2, y1 - 1) - query(x1 - 1, y2) + query(x1 - 1, y1 - 1);
}

struct node {
    int x1, y1, x2, y2, k;
    int qid;
    // update: [{x1},{y1}] update to {k}
    // query: find the {k}th number in [[{x1},{y1}], [{x2},{y2}]]
} q[1000006], q1[1000006], q2[1000006]; int tot;

int res[1000006];
inline void dfs (int l, int r, int L, int R) {
    if (L > R) return;
    if (l == r) {
        for (int i = L; i <= R; i ++) 
            if (q[i].qid)
                res[q[i].qid] = l;
        return;
    }
    int mid = (l + r) >> 1, cnt1 = 0, cnt2 = 0;
    for (int i = L; i <= R; i ++) {
        if (q[i].qid) {
            int num = query(q[i].x1, q[i].y1, q[i].x2, q[i].y2);
            if (q[i].k <= num) q1[++cnt1] = q[i];
            else q[i].k -= num, q2[++cnt2] = q[i];
        } else {
            if (q[i].k <= mid) update(q[i].x1, q[i].y1, 1), q1[++cnt1] = q[i];
            else q2[++cnt2] = q[i];
        }
    }
    for (int i = 1; i <= cnt1; i ++) if (!q1[i].qid) update(q1[i].x1, q1[i].y1, -1);
    for (int i = 1; i <= cnt1; i ++) q[L + i - 1] = q1[i];
    for (int i = 1; i <= cnt2; i ++) q[L + cnt1 + i - 1] = q2[i];
    dfs(l, mid, L, L + cnt1 - 1);
    dfs(mid + 1, r, L + cnt1, L + cnt1 + cnt2 - 1);
}

int main () {
    int n, m; scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; i ++) {
        for (int j = 1; j <= n; j ++) {
            int x; scanf("%d", &x);
            q[(i - 1) * n + j] = {i, j, 0, 0, x, 0};
        }
    }


    for (int i = 1; i <= m; i ++) {
        int x1, x2, y1, y2, k;
        scanf("%d%d%d%d%d", &x1, &y1, &x2, &y2, &k);
        q[n * n + i] = {x1, y1, x2, y2, k, i};
    }

    dfs(0, 1000000000, 1, n * n + m);

    for (int i = 1; i <= m; i ++) printf("%d\n", res[i]);
}
```


## 洛谷P2617_DynamicRankings

#### 🔗
<a href="https://www.luogu.com.cn/problem/P2617">![20221113202448](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113202448.png)</a>

#### 💡
注意到这是一个动态修改的区间第 $k$ 大问题，基本上解决办法都是树套树，但是不会树套树思考二分  
对于**单个询问**思考怎么做，可以将 $[l,mid]$ 内的数值对应的下标 $i$ 全部都在树状数组中 update(i,1)，然后检查 $[l,mid]$ 内的数量够不够 $k$ ，不够的话说明要继续往大了加数值，于是向右侧 $[mid+1,r]$ 走，同时让这个查询的 $k$ 减去左边记录过的部分，如果够的话就往左边走让答案更小一点  
那么处理**多个查询**上，可以通过整体二分对多个查询同时进行二分  
由于还有修改操作，我们需要加一个时间轴（事件域） $[L,R]$ ，以保证在查询前的操作是先进行的，同时注意到我们上面的 update(i,1) ，这里我们需要两个操作，在令 $a_x\to y$ 时，有一个 update(a_x,-1) ，有一个 update(y,1) ，即为撤销操作和添加操作    
这样可以分析到，我们在这里有三个域：
- 事件域：用来放置修改和询问
- 数值域：用来二分询问事件的结果
- 下标域：在树状数组的更新中对于当前数值域在 $[l,r]$ ，对修改值于 $[l,mid]$ 中的内容修改，以此判断每个询问事件够不够 $k$    
以数值域在类似单体 $check$ 中进行对 "可行事件" 的操作，以下标域为查询部分的内容进行判断，从而实现对事件域的整体二分  
那么实现过程即为，在 $dfs$ 内的数值域 $[l,r]$ 中，扫描事件域 $[L,R]$   
如果事件为更新，数值在 $[l,mid]$ 之间就 $update(val,op)$ （ $op$ 有加一有减一）并放进左类中，如果数值在 $[mid+1,r]$ 就没有必要修改了，放在右类    
如果事件为询问，检查询问区间内的数值和，如果数值和大于等于 $k$ 说明应该往右边走修改更少的即放进左类，如果小于 $k$ 说明要更大一点，放进右类的同时减去这段数值和表示我们记录过了  
在数值域缩到 $l=r$ 时，说明在这里的询问事件都可以有一个最终结果了，即扫描事件对询问事件赋答案为 $l$  

#### ✅
```cpp
# include "iostream"
# include "algorithm"
# include "cmath"
# include "cstring"
# include "map"
# include "vector"
# include "cstdio"
# include "queue"
# include "set"
# include "bitset"

using namespace std;

const int N = 3e5 + 10;
int t[N];
inline int lowbit (int x) { return x & -x; }
inline void update (int id, int c) {
    while (id < N) {
        t[id] += c;
        id += lowbit(id);
    }
}
inline int query (int id) {
    int res = 0;
    while (id) {
        res += t[id];
        id -= lowbit(id);
    }
    return res;
}

struct node {
    int op, x, y, k;
    int qid;
    // op=2: find [{x},{y}] with {k}th number
    // op=1: a_{y}=x with op
} q[N], q1[N], q2[N]; int tot, qtot;
int a[N];

int res[N];
inline void dfs (int l, int r, int L, int R) {
    if (L > R) return;
    if (l == r) {
        for (int i = L; i <= R; i ++) {
            if (q[i].op == 2) res[q[i].qid] = l;
        }
        return;
    }
    int mid = (l + r) >> 1, cnt1 = 0, cnt2 = 0;
    for (int i = L; i <= R; i ++) {
        if (q[i].op == 2) {
            int num = query(q[i].y) - query(q[i].x - 1);
            if (q[i].k <= num) q1[++cnt1] = q[i];
            else q[i].k -= num, q2[++cnt2] = q[i];
        } else {
            if (q[i].x <= mid) update(q[i].y, q[i].op), q1[++cnt1] = q[i];
            else q2[++cnt2] = q[i];
        }
    }
    for (int i = 1; i <= cnt1; i ++) if (q1[i].op != 2) update(q1[i].y, -q1[i].op);
    for (int i = 1; i <= cnt1; i ++) q[L + i - 1] = q1[i];
    for (int i = 1; i <= cnt2; i ++) q[L + cnt1 + i - 1] = q2[i];
    dfs(l, mid, L, L + cnt1 - 1);
    dfs(mid + 1, r, L + cnt1, L + cnt1 + cnt2 - 1);
}

char ope[3];
int main () {
    int n, m; scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; i ++) {
        scanf("%d", &a[i]);
        q[++tot] = {1, a[i], i, 0, 0};
    }
    for (int i = 1; i <= m; i ++) {
        scanf("%s", ope);
        if (ope[0] == 'Q') {
            int l, r, k; scanf("%d%d%d", &l, &r, &k);
            q[++tot] = {2, l, r, k, ++qtot};
        } else {
            int x, y; scanf("%d%d", &x, &y);
            q[++tot] = {-1, a[x], x, 0, 0};
            a[x] = y;
            q[++tot] = {+1, a[x], x, 0, 0};
        }
    }

    dfs(-1e9, 1e9, 1, tot);
    for (int i = 1; i <= qtot; i ++) printf("%d\n", res[i]);
}
```

## 洛谷P3332_K大数查询

#### 🔗
<a href="https://www.luogu.com.cn/problem/P3332">![20221113202644](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113202644.png)</a>

#### 💡
思路待写...

#### ✅
```cpp
const int N = 1e5 + 10;
struct Sgtr {
    int val, lazy;
} t[N << 2];
inline void pushup (int rt) {
    t[rt].val = t[rt << 1].val + t[rt << 1 | 1].val;
}
inline void pushdown (int l, int r, int rt) {
    if (!t[rt].lazy) return;
    int mid = (l + r) >> 1;
    t[rt << 1].val += t[rt].lazy * (mid - l + 1);
    t[rt << 1].lazy += t[rt].lazy;
    t[rt << 1 | 1].val += t[rt].lazy * (r - mid);
    t[rt << 1 | 1].lazy += t[rt].lazy;
    t[rt].lazy = 0;
}
inline void update (int a, int b, int c, int l, int r, int rt) {
    if (a <= l && r <= b) {
        t[rt].lazy += c;
        t[rt].val += c * (r - l + 1);
        return;
    }
    pushdown(l, r, rt);
    int mid = (l + r) >> 1;
    if (a <= mid) update(a, b, c, l, mid, rt << 1);
    if (b > mid)  update(a, b, c, mid + 1, r, rt << 1 | 1);
    pushup(rt);
}
inline int query (int a, int b, int l, int r, int rt) {
    if (a <= l && r <= b) return t[rt].val;
    pushdown(l, r, rt);
    int mid = (l + r) >> 1;
    int res = 0;
    if (a <= mid) res += query(a, b, l, mid, rt << 1);
    if (b > mid)  res += query(a, b, mid + 1, r, rt << 1 | 1);
    return res;
}

struct node {
    int l, r; ll k;
    int qid;
} q[N], q1[N], q2[N]; int tot;

int n, m;
int res[N], totq;
inline void dfs (int l, int r, int L, int R) {
    if (L > R) return;
    if (l == r) {
        for (int i = L; i <= R; i ++) {
            if (q[i].qid) {
                res[q[i].qid] = l;
            }
        }
        return;
    }
    int mid = (l + r) >> 1, cnt1 = 0, cnt2 = 0;
    for (int i = L; i <= R; i ++) {
        if (q[i].qid) {
            int num = query(q[i].l, q[i].r, 1, n, 1);
            if (q[i].k <= num) q2[++cnt2] = q[i];
            else q[i].k -= num, q1[++cnt1] = q[i];
        } else {
            if (q[i].k > mid) update(q[i].l, q[i].r, 1, 1, n, 1), q2[++cnt2] = q[i];
            else q1[++cnt1] = q[i];
        }
    }
    for (int i = 1; i <= cnt2; i ++) if (!q2[i].qid) update(q2[i].l, q2[i].r, -1, 1, n, 1);
    for (int i = 1; i <= cnt1; i ++) q[L + i - 1] = q1[i];
    for (int i = 1; i <= cnt2; i ++) q[L + cnt1 + i - 1] = q2[i];
    dfs(l, mid, L, L + cnt1 - 1);
    dfs(mid + 1, r, L + cnt1, L + cnt1 + cnt2 - 1);
}

signed main () {
    scanf("%lld%lld", &n, &m);
    for (int i = 1; i <= m; i ++) {
        int op, l, r; ll c; scanf("%lld%lld%lld%lld", &op, &l, &r, &c);
        if (op == 1) {
            q[++tot] = {l, r, c, 0};
        } else {
            q[++tot] = {l, r, c, ++totq};
        }
    }
    dfs(0, 50000, 1, m);
    for (int i = 1; i <= totq; i ++) printf("%lld\n", res[i]);
}
```


## 洛谷P7424_整体二分

#### 🔗
<a href="https://www.luogu.com.cn/problem/P7424">![20221010212220](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221010212220.png)</a>

#### 💡
这个问题里面，对于一个木板什么时候能被击碎很好求，二分即可  
现在是要知道所有木板什么时候被击碎，才可以处理出来答案，所有模板那就是整体二分  
将木板和子弹放在一起，$[l,r]$ 作为时间轴，$[L,R]$ 作为物品内容  
对于即将进行分治的 $[l,mid]$  
去看什么样的木板应该放在左边那一类 $\rightarrow$ 可以**在 $mid$ 以前被摧毁**的  
什么样的子弹应该放在左边哪一类 $\rightarrow$ 那就是时间轴在 $mid$ 左边的子弹  
$[L,R]$ 内的子弹先进行处理，也就是单点更新，然后处理木板，若在 $[l,mid]$ 内的子弹可以击碎这个木板（也就是区间查询），那就将这些木板放在左边那一类，否则放在右边（记得减去左边的贡献）  
然后递归处理 $([l,mid]$，左类物品$)$，$([mid+1,r]$，右类物品$)$    

在 $l=r$ 时作为递归出口，去检查 $[L,R]$ 内的物品有几个是木板，那么这些木板就意味着一定可以被 $l$ 这个时间摧毁  
但要注意也可能有摧毁不了的木板，那么将全局范围设置为 $[1,m+1]$ ，这样摧毁不了的最后会进 $m+1$ 那一部分，不会被统计到     

#### ✅
```cpp
const int N = 4e5 + 10;

int t[N];
inline int lowbit (int x) { return x & -x; }
inline void update (int id, int c) {
    while (id < N) {
        t[id] += c;
        id += lowbit(id);
    }
}
inline int query (int id) {
    int res = 0;
    while (id) {
        res += t[id];
        id -= lowbit(id);
    }
    return res;
}

struct node {
    int l, r, v;
    bool type; // 0:hack 1:mood
    int id;
} q[N], q1[N], q2[N];
int tot;

int res[N];
inline void dfs (int l, int r, int L, int R) {
    if (L > R) return;
    if (l == r) {
        for (int i = L; i <= R; i ++) {
            res[l] += q[i].type;
        }
        return;
    }
    int mid = (l + r) >> 1, cnt1 = 0, cnt2 = 0;
    for (int i = L; i <= R; i ++) {
        if (q[i].type) {
            int sum = query(q[i].r) - query(q[i].l - 1);
            if (sum >= q[i].v) q1[++cnt1] = q[i];
            else q[i].v -= sum, q2[++cnt2] = q[i];
        } else {
            if (q[i].id <= mid) update(q[i].l, 1), q1[++cnt1] = q[i];
            else q2[++cnt2] = q[i];
        }
    }
    for (int i = 1; i <= cnt1; i ++) if (!q1[i].type) update(q1[i].l, -1);
    for (int i = 1; i <= cnt1; i ++) q[L + i - 1] = q1[i];
    for (int i = 1; i <= cnt2; i ++) q[L + cnt1 + i - 1] = q2[i];
    dfs(l, mid, L, L + cnt1 - 1);
    dfs(mid + 1, r, L + cnt1, L + cnt1 + cnt2 - 1);
}

int l[N], r[N], v[N];
int main () {
    int n, m; scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; i ++) scanf("%d%d%d", &l[i], &r[i], &v[i]);
    // 先处理子弹，故木板等会儿再放
    for (int i = 1; i <= m; i ++) {
        int x; scanf("%d", &x);
        q[++tot] = {x, 0, 0, 0, i};
    }
    for (int i = 1; i <= n; i ++) {
        q[++tot] = {l[i], r[i], v[i], 1, i};
    }

    dfs(1, m + 1, 1, tot);
    for (int i = 1; i <= m; i ++) {
        printf("%d\n", res[i]);
    }
}
```
