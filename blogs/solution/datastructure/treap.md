---
title: 平衡树
---

### 
<hr>

## CodeForces1042D_PetyaAndArray

#### 🔗
<a href="https://codeforces.com/contest/1042/problem/D">![20220707190615](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220707190615.png)</a>

#### 💡
（设前缀和为 $[pre]$ ）  
问题就是累加 对于每一个 $i$ ，它前面的 $j$ 有多少个满足 $pre_i-pre_j<k$   
本来想二分或者双指针直接莽，突然发现它的前缀和不存在单调性，没法移动   
式子可以变成 $pre_j+k>pre_i$  那这个问题就只能用数据结构边计算边更新，每次累加查询数据结构里面插入过的大于 $pre_i$ 的数量，然后塞入 $pre+k$    
用权值线段树了话发现这些数都特别大，并且查询范围时存在加减关系，离散化有一点麻烦  
而只有大小关系，可以直接平衡树实现：将 $fhq-treap$ 按 $val$ 分裂后右树的大小就是查询结果  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 2e5 + 10;
struct node {
        int l, r;
        ll val; int key;
        int size;
} t[N];
int root, cnt;
mt19937 rnd(233);
inline int newnode (ll val) {
        t[++cnt] = {0, 0, val, (int)rnd(), 1};
        return cnt;
}
inline void pushup (int now) {
        t[now].size = t[t[now].l].size + t[t[now].r].size + 1;
}
inline void Split (int now, ll val, int &x, int &y) {
        if (!now) {
                x = y = 0;
        } else {
                if (val < t[now].val) {
                        y = now;
                        Split(t[now].l, val, x, t[y].l);
                        pushup(y);
                } else {
                        x = now;
                        Split(t[now].r, val, t[now].r, y);
                        pushup(x);
                }
        }
}
inline int Merge (int x, int y) {
        if (!x || !y) return x + y;
        if (t[x].key >= t[y].key) {
                t[x].r = Merge(t[x].r, y);
                pushup(x);
                return x;
        } else {
                t[y].l = Merge(x, t[y].l);
                pushup(y);
                return y;
        }
}
inline void Insert (ll val) {
        int x, y;
        Split(root, val, x, y);
        root = Merge(Merge(x, newnode(val)), y);
}
inline int get_BiggerSize (ll val) {
        int x, y;
        Split(root, val, x, y);
        int res = t[y].size;
        root = Merge(x, y);
        return res;
}

int n; 
ll k;
int main () {
        ios::sync_with_stdio(false);
        cin.tie(nullptr);

        cin >> n >> k;
        ll sum = 0;
        ll res = 0;    
        Insert(k);
        for (int i = 0; i < n; i ++) {
                ll x; cin >> x;
                sum = sum + x;
                res = res + get_BiggerSize(sum);
                Insert(sum + k);
        } 
        cout << res << endl;
}
```
<hr>
