---
title: 主席树
---

## 洛谷P1972_HH的项链

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1972"><img src="https://i.loli.net/2021/09/23/CZdUyPovu9sxtTi.png"></a>

#### 💡
一道主席树查找区间不同数的个数的模板题  
对于每个数，就算出现很多次，我们在求的时候实际关注的还是最右侧的位置  
那么在本题里面可以用主席树构建前缀数列中每一个数出现的最右侧的位置  
这样我们就可以在很少的修改下，将一个数列的每个前缀数列中的每个数出现的最右侧位置记录下来了  
也可以做到对于一个位置要么是0要么是1，可以实现直接地区间查询  
那么还是两步  
  
**1.插入**  
在a[i]插入时以上一个版本删掉之前a[i]出现过的位置，在当前版本加入i这个位置    
**2.查询**  
输入l, r  
对于版本r，查询数列中l位置之后的数的出现个数  
若`l <= mid`，那么我们该向左固定区间，同时得知右一半的区间均满足，则 `res += query () + sgtr[sgtr[rt].r].sum`  
若`l > mid`，那么我们该向右固定区间，就还是正常的查询 `res += query()`

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#define ll long long

using namespace std;

const int N = 1e6 + 10;
int a[N], n, m;
struct node {
        int l, r, sum;
} sgtr[N * 40];
int root[N], tot;
int lastPos[1000010];

inline void insert ( int l, int r, int pre, int &now, int p, int op ) {
        sgtr[++tot] = sgtr[pre];
        now = tot;
        sgtr[now].sum += op;

        if ( l == r ) return;

        int mid = (l + r) >> 1;
        if ( p <= mid ) insert ( l, mid, sgtr[pre].l, sgtr[now].l, p, op );
        else insert ( mid + 1, r, sgtr[pre].r, sgtr[now].r, p, op );
}

inline int query ( int l, int r, int rt, int pos ) {
        if ( l == r ) return sgtr[rt].sum;
        int res = 0, mid = (r + l) >> 1;
        if ( pos <= mid ) res += query ( l, mid, sgtr[rt].l, pos ) + sgtr[sgtr[rt].r].sum;
        else res += query ( mid + 1, r, sgtr[rt].r, pos );
        return res;
}

int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif
        scanf("%d", &n);
        for ( int i = 1; i <= n; i ++ ) 
                scanf("%d", &a[i]);

        for ( int i = 1; i <= n; i ++ ) {
                if ( lastPos[a[i]] ) {
                        insert ( 1, n, root[i - 1], root[i], lastPos[a[i]], -1 );
                        insert ( 1, n, root[i], root[i], i, 1 );
                } else {
                        insert ( 1, n, root[i - 1], root[i], i, 1 );
                }
                lastPos[a[i]] = i;
        }

        scanf("%d", &m);
        while ( m -- ) {
                int l, r; scanf("%d%d", &l, &r);
                printf("%d\n", query(1, n, root[r], l) );
        }
}

```

<hr>

## 洛谷P4137_RmqProblemMex

#### 🔗
<a href="https://www.luogu.com.cn/problem/P4137"><img src="https://i.loli.net/2021/09/24/8jlF1bTrPG6XHes.png"></a>

#### 💡
我们可以对每个数存一个最右端位置  
然后维护一下这个前缀版本区间内的最小下标  
在查询[l,r]的时候，只需要查询在root[r]的版本下，下标没有出现在l后的最小的数  
那么每次就是对左右子树分别查看，这个最小下标是否可以出现在子树内，来决定递归哪一个  
肯定优先递归左子树，所以只有左子树的val>=pos的时候，才做右子树  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#define ll long long

using namespace std;

const int N = 3e5 + 10;
struct node {
        int l, r;
        int val; // 维护当前区间内每个数最右侧下标的最小值
} sgtr[N * 40];
int root[N], tot;
int n, a[N], m, x, y;

inline void insert ( int l, int r, int pre, int &now, int p, int c ) { // p是数值，c是新下标
        sgtr[++tot] = sgtr[pre];
        now = tot;
        if ( l == r ) { // 更新
                sgtr[now].val = c;
                return;
        }
        int mid = (l + r) >> 1;
        if ( p <= mid ) // 新数值改变左子树
                insert ( l, mid, sgtr[pre].l, sgtr[now].l, p, c ); 
        else 
                insert ( mid + 1, r, sgtr[pre].r, sgtr[now].r, p, c );
        sgtr[now].val = min ( sgtr[sgtr[now].l].val, sgtr[sgtr[now].r].val ); // 更新一下最小值（pushup）
}

inline int query ( int l, int r, int rt, int pos ) { // 查询 MEX
        if ( l == r ) return l;
        int mid = (l + r) >> 1;
        if ( sgtr[sgtr[rt].l].val >= pos ) // 若左子树右侧下标最小值都出现在[L,R]区间内，就查询右子树 
                return query ( mid + 1, r, sgtr[rt].r, pos );
        else                               // 否则查询左子树
                return query ( l, mid, sgtr[rt].l, pos );
}


int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif
        scanf("%d%d", &n, &m);
        for ( int i = 1; i <= n; i ++ ) 
                scanf("%d", &a[i]);

        for ( int i = 1; i <= n; i ++ ) {
                insert ( 0, 1e9, root[i - 1], root[i], a[i], i ); // ai插入主席树并将ai位置更新为i
        } 
        while ( m -- ) {
                int l, r; scanf("%d%d", &l, &r);
                printf("%d\n", query ( 0, 1e9, root[r], l ) );
        }
}

```

<hr>

## 牛客NC21758_LittleWAndDiscretization

#### 🔗
<a href="https://ac.nowcoder.com/acm/problem/21758"><img src="https://i.loli.net/2021/09/24/7FDZbBk9UyzYJR4.png"></a>

#### 💡
首先分析，在离散化的时候，哪些数会发生改变  
若中间空了一个数，后面的数皆会改变  
空的也就是mex，所以取出mex，然后求出这个区间内比mex大的有多少个数  
  
**求mex**  
我们可以对每个数存一个最右端位置  
然后维护一下这个前缀版本区间内的最小下标  
在查询[l,r]的时候，只需要查询在root[r]的版本下，下标没有出现在l后的最小的数  
那么每次就是对左右子树分别查看，这个最小下标是否可以出现在子树内，来决定递归哪一个  
肯定优先递归左子树，所以只有左子树的val>=pos的时候，才做右子树  
  
**求比mex大的数**  
存主席树时，也存一个该区间内数的个数  
求出来mex后，在两个版本前缀主席树相减下，求出这个区间[mex+1, 1e9]的权值和  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 3e5 + 10;
struct node {
        int l, r;
        int val; // 维护当前区间内每个数最右侧下标的最小值
        int sum; // 维护当前区间内有多少个数
} sgtr[N * 40];
int root[N], tot;
int n, a[N], m, x, y;

inline void insert ( int l, int r, int pre, int &now, int p, int c ) { // p是数值，c是新下标
        sgtr[++tot] = sgtr[pre];
        now = tot;
        sgtr[now].sum ++;
        if ( l == r ) { // 更新
                sgtr[now].val = c;
                return;
        }
        int mid = (l + r) >> 1;
        if ( p <= mid ) // 新数值改变左子树
                insert ( l, mid, sgtr[pre].l, sgtr[now].l, p, c ); 
        else 
                insert ( mid + 1, r, sgtr[pre].r, sgtr[now].r, p, c );
        sgtr[now].val = min ( sgtr[sgtr[now].l].val, sgtr[sgtr[now].r].val ); // 更新一下最小值（pushup）
}

inline int query ( int l, int r, int rt, int pos ) { // 查询 MEX
        if ( l == r ) return l;
        int mid = (l + r) >> 1;
        if ( sgtr[sgtr[rt].l].val >= pos ) // 若左子树右侧下标最小值都出现在[L,R]区间内，就查询右子树 
                return query ( mid + 1, r, sgtr[rt].r, pos );
        else                               // 否则查询左子树
                return query ( l, mid, sgtr[rt].l, pos );
}

inline int getSum ( int l, int r, int L, int R, int pos ) { // 区间减出>=pos的所有数的个数
        if ( l == r ) return sgtr[R].sum - sgtr[L].sum;
        int mid = (l + r) >> 1;
        int res = 0;
        if ( pos <= mid ) 
                res += getSum ( l, mid, sgtr[L].l, sgtr[R].l, pos ) + sgtr[sgtr[R].r].sum - sgtr[sgtr[L].r].sum; // 如果pos在左子树则右子树全部满足
        else 
                res += getSum ( mid + 1, r, sgtr[L].r, sgtr[R].r, pos );
        return res;
}


int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif
        scanf("%d", &n);
        for ( int i = 1; i <= n; i ++ ) 
                scanf("%d", &a[i]);

        for ( int i = 1; i <= n; i ++ ) {
                insert ( 1, 1e9, root[i - 1], root[i], a[i], i ); // ai插入主席树并将ai位置更新为i
        } 
        scanf("%d", &m);
        while ( m -- ) {
                int l, r; scanf("%d%d", &l, &r);
                int mex = query ( 1, 1e9, root[r], l ); // 取出区间mex
                printf ( "%d\n", getSum ( 1, 1e9, root[l - 1], root[r], mex + 1 ) ); // 找比mex大的数的个数
        }
}

```

<hr>
