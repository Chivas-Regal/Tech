---
title: 回文自动机
---

###
<hr>

## 洛谷P4555_最长双回文串

#### 🔗
<a href="https://www.luogu.com.cn/problem/P4555">![20220928154903](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220928154903.png)</a>

#### 💡
要求连续两段子区间满足某种性质，求最长的两段子区间的和，这种问题如果一个子区间很好求的话，可以通过枚举断点实现正反效果  
即类似于 [CodeForces1409E_TwoPlatforms](../base/sum-dir.md#codeforces1409etwoplatforms) 的操作，在断点为 $i$ 时，加上正的 $i$ 和反的 $i+1$ 来使得两个最长的单子区间拼成的双子区间最长  
这里求一个最长回文子串很好求，求一个以 $i$ 结束的最长回文子串也很好求，当然这都是建立在 $pam$ 上是前缀的后缀来定的，对于反向的最长单子区间，只需要将字符串反过来再跑一遍 $pam$ 同时维护数值即可  

#### ✅
```cpp
const int N = 1e6 + 10;
char s[N];
struct PalindromeAutoMaton {
    int ed, ct;
    int fa[N], len[N], to[N][26];
    inline PalindromeAutoMaton () {
        ed = 0; ct = 1;
        fa[0] = 1; len[1] = -1;
    }
    inline int get_fa (int u, int id) {
        while (id - len[u] - 1 < 1 || s[id - len[u] - 1] != s[id]) u = fa[u];
        return u;
    }
    inline void insert (int c, int id) {
        int father = get_fa(ed, id);
        if (!to[father][c]) {
            fa[++ct] = to[get_fa(fa[father], id)][c];
            to[father][c] = ct;
            len[ct] = len[father] + 2;
        }
        ed = to[father][c];
    }
    inline void clear () {
        for (int i = 0; i <= ct; i ++) {
            fa[i] = len[i] = 0;
            for (int j = 0; j < 26; j ++) to[i][j] = 0;
        }
        ed = 0; ct = 1;
        fa[0] = 1, len[1] = -1;
    }
} pam;

int a[N], b[N];

int main () {
    scanf("%s", s + 1); int n = strlen(s + 1);
    for (int i = 1; i <= n; i ++) {
        pam.insert(s[i] - 'a', i);
        a[i] = pam.len[pam.ed];
    }
    pam.clear();
    reverse(s + 1, s + 1 + n);
    for (int i = 1; i <= n; i ++) {
        pam.insert(s[i] - 'a', i);
        b[n - i + 1] = pam.len[pam.ed];
    }
    int res = 0;
    for (int i = 1; i < n; i ++) {
        res = max(res, a[i] + b[i + 1]);
    }
    printf("%d\n", res);
}
```
<hr>

## 洛谷P4287_双倍回文

#### 🔗
<a href="https://www.luogu.com.cn/problem/P4287">![20220928162137](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220928162137.png)</a>

#### 💡
分析一下这样的双倍回文串的性质：  
$1.$ 长度是 $4$ 的倍数  
$2.$ 自己是回文串  
$3.$ 长度是自己一半的后缀/前缀串依然是回文串  
  
由于 $pam$ 的 $fail$ 树上一个点的祖先是按长度从大到小的它的回文后缀，因此如果一个节点是双倍回文串，那么它的祖先中一定会存在长度是它一半的回文串，故先按 $fail$ 树建一个树图    
一个检查树上祖先中是否和它有一定关系限制的点的问题，可以直接使用 $dfs$ ，一个 $num$ 数组记录祖先中存在什么，在进入 $dfs$ 时加上，退出时减去，每一个点判断一下是不是四的倍数以及 $num$ 是否存在 $len[u]/2$   

#### ✅
```cpp
const int N = 1e6 + 10;
int n; 
char s[N];

struct PalindromAutoMaton {
    int ed, ct;
    int len[N], fa[N], to[N][26];
    inline PalindromAutoMaton () {
        ed = 0; ct = 1;
        fa[0] = fa[1] = 1; len[1] = -1;
    }
    inline int get_fa (int u, int id) {
        while (id - len[u] - 1 <= 0 || s[id - len[u] - 1] != s[id]) u = fa[u];
        return u;
    }
    inline void insert (int c, int id) {
        int father = get_fa(ed, id);
        if (!to[father][c]) {
            fa[++ct] = to[get_fa(fa[father], id)][c];
            to[father][c] = ct;
            len[ct] = len[father] + 2;
        }
        ed = to[father][c];
    }
} pam;
struct Edge {
    int nxt, to;
} edge[N]; int head[N], cnt;
inline void add_Edge (int from, int to) {
    edge[++cnt] = {head[from], to};
    head[from] = cnt;
}

int num[N], res;
inline void dfs (int u) {
    if (pam.len[u] % 4 == 0 && num[pam.len[u] / 2]) res = max(res, pam.len[u]);
    num[pam.len[u]] ++;
    for (int i = head[u]; i; i = edge[i].nxt) {
        int v = edge[i].to;
        dfs(v);
    }
    num[pam.len[u]] --;
}

int main () {
    scanf("%d%s", &n, s + 1);
    for (int i = 1; i <= n; i ++) pam.insert(s[i] - 'a', i);
    for (int i = 0; i <= pam.ct; i ++) {
        if (i != 1) add_Edge(pam.fa[i], i);
    }
    dfs(1);
    printf("%d", res);
}
```
<hr>

