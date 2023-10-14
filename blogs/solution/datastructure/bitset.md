---
title: bitset
---
###  
<hr>

## 洛谷P3674_小清新人渣的本愿

#### 🔗
<a href="https://www.luogu.com.cn/problem/P3674"><img src="https://i.loli.net/2021/09/12/LhMZuKQd7z5mC12.png"></a>

#### 💡
一道莫队维护bitset的好题  
bitset是一个很妙的STL容器，可以实现很多优化  
是否有两个数的差为<img src="https://latex.codecogs.com/svg.image?x" title="x" />，只需要判断<img src="https://latex.codecogs.com/svg.image?bst1\And&space;(bst1&space;<<&space;x)" title="bst1\And (bst1 << x)" />是否存在1即可 
  
是否有两个数的和为<img src="https://latex.codecogs.com/svg.image?x" title="x" />  
可以推导一下  
<img src="https://latex.codecogs.com/svg.image?\begin{aligned}a-N&plus;b=x-N\\a-(N-b)=x-N\\a=(N-b)-(N-x)\end{aligned}" title="\begin{aligned}a-N+b=x-N\\a-(N-b)=x-N\\a=(N-b)-(N-x)\end{aligned}" />  
那么我们建立一个存放<img src="https://latex.codecogs.com/svg.image?N-x" title="N-x" />的bst2，然后查一下<img src="https://latex.codecogs.com/svg.image?bst1&space;\And&space;(bst2&space;>>&space;(N-x))" title="bst1 \And (bst2 >> (N-x))" />中是否存在1即可  
  
是否有两个数的积为<img src="https://latex.codecogs.com/svg.image?x" title="x" />  
直接暴力枚举因数然后查一下在不在就行了  
  

#### ✅

```cpp
#include <iostream>
#include <cstring>
#include <cstdio>
#include <vector>
#include <algorithm>
#include <cmath>
#include <map>
#include <bitset>
#define ll long long

using namespace std;

const int N = 1e5 + 10;
int n, m, len;
int a[N];
struct Q {
        int id, l, r;
        int tgt, opt;
} q[N];
bitset<N> bst1, bst2;
int res[N], vis[N];

inline void add ( int x ) {
        if ( !(vis[x] ++) ) bst1[x] = bst2[N - x] = true;
}
inline void del ( int x ) {
        if ( !(-- vis[x]) ) bst1[x] = bst2[N - x] = false;
}


inline int get ( int x ) {
        return x / len;
}

int main () {
        ios::sync_with_stdio(false);
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif
        cin >> n >> m; len = sqrt ( n );
        for ( int i = 1; i <= n; i ++ ) cin >> a[i];
        for ( int i = 0; i < m; i ++ ) {
                int opt, l, r, x; cin >> opt >> l >> r >> x;
                q[i] = {i, l, r, x, opt};
        }
        sort ( q, q + m, [&](Q a, Q b){
                if ( get(a.l) != get(b.l) ) return get(a.l) < get(b.l);
                return a.r < b.r;
        });
        for ( int L = 1, R = 0, i = 0; i < m; i ++ ) {
                
                while ( L < q[i].l ) del ( a[ L ++ ] );
                while ( L > q[i].l ) add ( a[ -- L ] );
                while ( R > q[i].r ) del ( a[ R -- ] );
                while ( R < q[i].r ) add ( a[ ++ R ] );

                if ( q[i].opt == 1 ) {
                        res[q[i].id] = (bst1 & (bst1 << q[i].tgt)).any();
                } else if ( q[i].opt == 2 ) {
                        res[q[i].id] = (bst1 & (bst2 >> (N - q[i].tgt))).any();
                } else {
                        for ( int j = 1; j * j <= q[i].tgt; j ++ ) {
                                if ( q[i].tgt % j == 0 && bst1[j] && bst1[q[i].tgt / j] ) {
                                        res[q[i].id] = true;
                                        break;
                                }
                        }
                }
        }
        for ( int i = 0; i < m; i ++ ) {
                puts(res[i] ? "hana" : "bi");
        }
}
```

<hr>

## HDU2021多校(10)3_PtyLovesLines

#### 🔗
<a href="https://acm.dingbacode.com/showproblem.php?pid=7079"><img src="https://i.loli.net/2021/10/20/EP2QloZ7uydMcAi.png"></a>

#### 💡
  
对于x根棍子  
每个棍数量首先为0，然后是他们的摆放情况（初始默认分成两部分，两部分互相垂直    
(1, x-1)：这样的话是可以从1根棍子的摆放情况通过每个数量+1*(x-1)转移出来  
(2, x-2)：这样的话是可以从2根棍子的摆放情况通过每个数量+2*(x-2)转移出来  
(3, x-3)：这样的话是可以从3根棍子的摆放情况通过每个数量+3*(x-3)转移出来  
...  
(x-1, 1)：这样的话是可以从x-1根棍子的摆放情况通过每个数量+(x-1)*1转移出来  
那么就有了转移的方式，x根棍子可以`for ( int i = 1; i < x; i ++ ) for ( auto j : vis[i] ) vis[j.first + i * (x - i)] = 1`  
  
这类不管每个位置的数量，直管每个位置存不存在的递推关系，应该很快想到用bitset优化去解  
即 `for ( int i = 1; i < x; i ++ ) bst[x] |= bst[i] << (i * (x - i) );`  
但是这样还是太慢，我们打好一小部分去观察一下大致的表  
```
1: 0
2: 0 1
3: 0 2 3
4: 0 3 4 5 6
5: 0 4 6 7 8 9 10
6: 0 5 8 9 11 12 13 14 15
7: 0 6 10 11 12 14 15 16 17 18 19 20 21
```  
可以发现后面连续的数越来越长了，并且i后面连续的数的开始要比i-1后面连续的数的开始要大  
那么对于x是从y开始连续的话，对于x-1从y开始也必然连续  
那么暴力打一下700的表看看从哪个开始连续（等待ing  

```cpp
const int N = 710, M = 244660;
bitset<M> bst[N];
inline void Pre () {
        for ( int i = 1; i <= 700; i ++ ) {
                bst[i][0] = 1;
                for ( int j = 1; j < i; j ++ ) {
                        bst[i] |= bst[j] << (j * (i - j));
                }
        }
}
int main () {
        ios::sync_with_stdio(false); Pre();
        int res = 0, cur = 244650;
        while ( bst[700][244650] == 1 ) res = cur, bst[700] <<= 1, cur --;
        cout << res << endl;
}
```
发现从31152就能连续  
那直接把bitset的尺寸缩到31152+5即可  
然后就能飞速预处理了  
输出的时候输出1的位置，然后从M开始一直输出到(n-1)*n/2

#### ✅
```cpp
const int N = 710, M = 31152;
bitset<M> bst[N];

inline void Pre () {
        for ( int i = 1; i <= 700; i ++ ) {
                bst[i][0] = 1;
                for ( int j = 1; j < i; j ++ ) {
                        bst[i] |= bst[j] << (j * (i - j));
                }
        }
}
int main () {
        ios::sync_with_stdio(false); Pre();
        int cass; cin >> cass; while ( cass -- ) {
                int n; cin >> n;
                cout << 0; 
                for ( int i = 1; i < M; i ++ ) if ( bst[n][i] ) cout << " " << i;
                for ( int i = M; i <= (n - 1) * n / 2; i ++ )  cout << " " << i;
                cout << endl;
        }
}
```

<hr>
