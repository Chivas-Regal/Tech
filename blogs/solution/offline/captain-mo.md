---
title: 莫队
---

## 普通莫队

### CodeForces617E_XORAndFavoriteNumber

#### 🔗
<a href="https://vjudge.net/contest/456121#problem/E"><img src="https://i.loli.net/2021/09/03/MYkj5xgtvmXrlsB.png"></a>

#### 💡
由于异或的性质，反复异或等于0  
所以求a[l]^a[l+1]^...^a[r]时  
可以将a[i]标记为前缀和，然后求a[l-1]^a[r]即可  
那么问题转化为记录区间里面a[l-1]^a[r]=k的个数  
那么对于每个a[r]我们求一下a[r]^k的个数累加即可

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream> 
#include <algorithm> 
#include <cmath> 
#include <queue>
#include <cstring>
#include <vector>
#include <unordered_map>
#include <map>
#define ll long long

using namespace std;

const ll N = 1e5 + 10;

struct Q{
	ll l, r, id;
}q[N];// 查询
ll a[N], res[N], RES, pos[N]; // 数列，记录答案，当前答案，块编号
ll cnt[5000010]; // 统计出现过的数的个数
ll n, m, k, len;

int main () {
	ios::sync_with_stdio(false);
#ifndef ONLINE_JUDGE
	freopen("in.in", "r", stdin);
	freopen("out.out", "w", stdout);
#endif

	auto add = [&] ( ll id ) {
		RES += cnt[a[id] ^ k]; // 利用区间内出现数的个数求一下当前RES
		cnt[a[id]] ++;  // 前缀和出现个数++
	};
	auto sub = [&] ( ll id ) {
		cnt[a[id]] --;
		RES -= cnt[a[id] ^ k];
	}; 

	cin >> n >> m >> k; len = sqrt(n);

	for ( ll i = 1; i <= n; i ++ ) {
		cin >> a[i]; a[i] ^= a[i - 1];
		pos[i] = i / len;
	}

	for ( ll i = 0; i < m; i ++ ) {
		cin >> q[i].l >> q[i].r;
		q[i].id = i;
	}

	sort ( q, q + m, []( Q a, Q b ) {
		if ( pos[a.l] != pos[b.l] ) return pos[a.l] < pos[b.l];
		return a.r < b.r;		
	});

	ll l = 1, r = 0; cnt[0] = 1;
	for ( ll i = 0; i < m; i ++ ) {
		while ( l > q[i].l ) add ( -- l - 1 );
		while ( r < q[i].r ) add ( ++ r );
		while ( l < q[i].l ) sub ( l ++ - 1 );
		while ( r > q[i].r ) sub ( r -- );
		res[q[i].id] = RES; 
	}
	for ( ll i = 0; i < m; i ++ ) {
		cout << res[i] << endl;
	}
	return 0;
}

```

<hr>


### 洛谷P3674_小清新人渣的本愿

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
  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

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


## 带修莫队

### 黑暗爆炸2120_数颜色

#### 🔗
<a href="https://vjudge.net/problem/%E9%BB%91%E6%9A%97%E7%88%86%E7%82%B8-2120"><img src="https://i.loli.net/2021/09/07/NbCXdY15jLcJHlO.png"></a>

#### 💡
带修莫队的模板题  
add和sub也就是普通的记录一下出现次数就行  
关键在于对第三个指针（时间戳）的记录  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <cmath>
#include <algorithm>

using namespace std;


const int N = 133350, M = 1e6 + 10;
int cnt[M], a[N], res[N];
int n, m, len;
int nq, nm, RES;
struct Q{
	int l, r, t, id;
}qry[N];
struct M{
	int x, y;
}mdf[N];

inline void add ( int x ) {
	RES += ! cnt[x] ++;
}
inline void sub ( int x ) {
	RES -= ! -- cnt[x];
}
inline int get ( int id ) {
	return id / len;
}

int main () {
	scanf("%d%d", &n, &m);
	for ( int i = 1; i <= n; i ++ )
		scanf("%d", &a[i]);
	for ( int i = 1; i <= m; i ++ ) {
		char op[2]; int x, y;
		scanf("%s%d%d", op, &x, &y);
		if ( op[0] == 'Q' ) ++ nq, qry[nq] = { x, y, nm, nq };
		else                ++ nm, mdf[nm] = { x, y };
	} 
	len = cbrt ((double)n * nm) + 1;
	sort ( qry + 1, qry + 1 + nm, [&]( Q a, Q b ){
		if ( get(a.l) != get(b.l) ) return get(a.l) < get(b.l);
		if ( get(a.r) != get(b.r) ) return get(a.r) < get(b.r);
		if ( get(a.r) & 1 ) return a.t > b.t;
		return a.t < b.t;		
	});
	
	for ( int L = 1, R = 0, T = 0, k = 1; k <= nq; k ++ ) {
		while ( L < qry[k].l ) sub ( a[L ++] );
		while ( L > qry[k].l ) add ( a[-- L] );
		while ( R < qry[k].r ) add ( a[++ R] );
		while ( R > qry[k].r ) sub ( a[R --] );
		while ( T != qry[k].t ) {
			if ( T < qry[k].t ) T ++;
			if ( L <= mdf[T].x && mdf[T].x <= R ) 
				sub ( a[mdf[T].x] ),
				add ( mdf[T].y );
			swap ( a[mdf[T].x], mdf[T].y );
			if ( T > qry[k].t ) T --;
		}
		res[qry[k].id] = RES;
	}
	for ( int i = 1; i <= nq; i ++ ) 
		printf("%d\n", res[i]);
	return 0;
}
```

<hr>
