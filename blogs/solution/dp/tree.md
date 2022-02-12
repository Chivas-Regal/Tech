---
title: 树形DP
---
###  
<hr>

## 洛谷P2899_CellPhoneNetworkG

#### 🔗
<a href="https://www.luogu.com.cn/problem/P2899"><img src="https://img-blog.csdnimg.cn/c1fbbf9a4ffb403daae865b1825a5478.png"></a>

#### 💡
由于一个节点可以被自己给信号，可以被儿子给信号，可以被父亲给信号  
所以我们设置 $dp[i][0/1/2]$ 表示 $i$ 节点被 $[$自己$/$儿子$/$父亲$]$ 给信号需要的节点数  
  
<b>若被自己给信号</b>  
那么它的儿子被谁给信号都可以  
$dp[u][0]+=min(dp[v][0],dp[v][1],dp[v][2])$  
  
<b>若被父亲给信号</b>  
那么说明儿子 $v$ 一定没法从 $u$ 身上获得信号  
$dp[u][2]+=min(dp[v][0],dp[v][1])$  
  
<b>若被儿子给信号</b>  
那么还是上面这种  
但是要注意，我们只有一个父亲，但可能有很多个儿子  
所以在众多儿子中我们需要保证至少选一个 $dp[v][0]$  
那么可以先把 $dp[v][0]$ 都选了，然后对所有儿子的 $dp[v][1]-dp[v][0]$ 进行排序  
然后在前 儿子个数$-1$ 个儿子内看看哪些可以替换为 $dp[v][1]$  
即  
  
$
dp[u][1]+=\sum\limits_{son}dp[son][0]\\
\textbf{sort}(son,\{dp[son][1]-dp[son][0],\textbf{<}\})\\
\textbf{for}\;son\;\textbf{in}\;sons\;\;\textbf{\&}\;\;son\neq endson:\\
\qquad \textbf{if}\;dp[son][1]-dp[son][0]<0:\\
\qquad\qquad dp[u][1]+=dp[son][1]-dp[son][0];\\
\qquad \textbf{else}\\
\qquad\qquad \textbf{break};\\
$  

<b>统计答案</b>   
由于根节点无父亲，所以最后取 $min(dp[rt][0],dp[rt][1])$

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
// 有上述转移，此处就不放置代码了
```
<hr>


## gym103145C_VertexDeletion

#### 🔗
<a href="https://codeforces.com/gym/103145/problem/C"><img src="https://i.loli.net/2021/09/06/X7mSDUEoxi8vnVp.png"></a>


#### 💡
一个树形dp的比较经典的模型  
由于本题设计两个点存在问题：存在、存在且与另一个存在相连  
再带上一个不存在的问题，所以设计三个状态  
dp[x][0]：不存在  
dp[x][1]：存在但不连子节点  
dp[x][2]：存在且连了子节点  
  
分类讨论一下：  
0--不存在：除了不连子节点的点以外，其余状态点都可以连  
<img src="https://latex.codecogs.com/svg.image?dp[x][0]&space;=&space;\prod(dp[y][0]&plus;dp[y][2])&space;" title="dp[x][0] = \prod(dp[y][0]+dp[y][2]) " />  
1--存在但不连子节点：连上所有不存在的点  
<img src="https://latex.codecogs.com/svg.image?dp[x][1]&space;=&space;\prod&space;dp[y][0]" title="dp[x][1] = \prod dp[y][0]" />  
2--存在且连了子节点：除了子节点都不存在以外，别的方式都可以连  
<img src="https://latex.codecogs.com/svg.image?dp[x][2]&space;=&space;\prod(dp[y][0]&space;&plus;&space;dp[y][1]&space;&plus;&space;dp[y][2])&space;-&space;\prod&space;dp[y][0]" title="dp[x][2] = \prod(dp[y][0] + dp[y][1] + dp[y][2]) - \prod dp[y][0]" />
  
最后不能选存在且不连子节点的祖先，这样是一个被孤立的点，所以我们计算  
<img src="https://latex.codecogs.com/svg.image?dp[1][0]&space;&plus;dp[1][2]" title="dp[1][0] +dp[1][2]" />

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#define ll long long
using namespace std;

const int N = 1e5 + 10,
	  M = 2e5 + 10,
	  mod = 998244353;

struct Edge {
	int nxt, to;
}edge[M];

int head[M], cnt;
ll dp[N][3];
int vis[N];
int n;

inline void Init () {
	for ( int i = 0; i < n * 2 + 5; i ++ ) 
		head[i] = -1;
	for ( int i = 0; i < n + 5; i ++ ) 
		vis[i] = 0,  
		dp[i][0] = dp[i][1] = dp[i][2] = 1;
	cnt = 0;
}

inline void Add_Edge ( int from, int to ) {
	edge[++cnt] = { head[from], to };
	head[from] = cnt; 
}

inline void DFS ( int x ) {
	vis[x] = 1;
	for ( int i = head[x]; ~i; i = edge[i].nxt ) {
		int to = edge[i].to;
		if ( vis[to] ) continue;
		DFS ( to );

		dp[x][0] = dp[x][0] * ( dp[to][0] + dp[to][2] ) % mod;
		dp[x][1] = dp[x][1] * dp[to][0] % mod;	
		dp[x][2] = dp[x][2] * ( dp[to][0] + dp[to][1] + dp[to][2] ) % mod;
	}
	dp[x][2] = ((dp[x][2] + mod - dp[x][1]) % mod + mod) % mod;
}

int main () {
#ifndef ONLINE_JUDGE
	freopen("in.in", "r", stdin);
	freopen("out.out", "w", stdout);
#endif
	int cass;
	for ( scanf("%d", &cass); cass; cass -- ) {
		scanf("%d", &n); Init(); 
		for ( int i = 1; i < n; i ++ ) {
			int a, b; scanf("%d%d", &a, &b); 
			Add_Edge ( a, b );
			Add_Edge ( b, a );
		}
		DFS (1);
		printf("%lld\n",( dp[1][0] + dp[1][2] ) % mod);
	}
	return 0;
}
```

<hr>

## HDUOJ2412_PartyatHali-Bula

#### 🔗
https://acm.hdu.edu.cn/showproblem.php?pid=2412

#### 💡
选了上司就不能选员工了  
所以我们设dp[i][0]表示不选根节点i时的最大选数，dp[i][1]表示选根节点i时的最大选数  
dp[i][0]了话，员工选不选都行，就对每个子节点求最优即可  
dp[i][1]了话，员工不能选，+dp[son[i]][0]    
  
在选使用哪个子状态时，使用的那个子状态如果是多解，那么此时父状态也是多解  
最后还要判断一下总问题的两种可能性是不是相同


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <unordered_map>
#include <iostream>
#include <cstdio>
#include <string>

using namespace std;

const int N = 205;
struct Edge {
        int nxt; string to;
        inline Edge () {}
        inline Edge ( int _nxt, string _to ) : nxt(_nxt), to(_to) {}
} edge[2 * N];
unordered_map <string, int> head, vis, num;
unordered_map <string, pair<int, int> > dp, f; 
int cnt, n;
string stt; 

inline void Init () {
        head.clear();
        vis.clear();
        num.clear();
        cnt = 0;
}
inline void Add_edge ( string from, string to ) { edge[++cnt] = Edge(head[from], to); head[from] = cnt; }
inline void DFS ( string x ) {
        if ( !num[x] ) { dp[x] = make_pair(0, 1); f[x] = make_pair(0, 0); return; }
        vis[x] = 1;
        dp[x] = make_pair(0, 1);
        f[x] = make_pair(0, 0);
        for ( int i = head[x]; i; i = edge[i].nxt ) {
                string to = edge[i].to;
                if ( !vis[to] ) DFS ( to );

                if ( dp[to].first == dp[to].second ) { // 看看通过哪个推最优解，如果子阶段是多解，那么它对应的
                        dp[x].first += dp[to].first;
                        f[x].first = 1;
                } else if ( dp[to].first > dp[to].second ) {
                        dp[x].first += dp[to].first;
                        if ( f[to].first ) f[x].first = 1;
                } else if ( dp[to].first < dp[to].second ) {
                        dp[x].first += dp[to].second;
                        if( f[to].second ) f[x].first = 1;
                }
                dp[x].second += dp[to].first;
                if ( f[to].first ) f[x].second = 1;
        }
}

int main () {
        while ( cin >> n, n ) {
                Init();
                cin >> stt;
                for ( int i = 0; i < n - 1; i ++ ) {
                        string a, b; cin >> a >> b;
                        Add_edge( b, a ); num[b] ++;
                }
                DFS ( stt );
                if ( dp[stt].first > dp[stt].second ) { // 看看利用哪个得到最优解
                        cout << dp[stt].first << " " << (f[stt].first ? "No" : "Yes") << endl;
                } else if ( dp[stt].first < dp[stt].second ) {
                        cout << dp[stt].second << " " << (f[stt].second ? "No" : "Yes") << endl;
                } else {
                        cout << dp[stt].first << " " << "No" << endl;
                }
        }
        return 0;
}
```

<hr>
