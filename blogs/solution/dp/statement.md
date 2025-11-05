---
title: 状压DP
---
###  


## 洛谷P1171_售货员的难题

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1171"><img src="https://i.loli.net/2021/11/30/Cbq2Jav6L1XVWpm.png"></a>
           
#### 💡
这个题目数据对全排列很难不心动  
然后设置  <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[i][j]" title="\inline dp[i][j]" /> 表示第  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  个点走的是  <img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline j" />   
可以通过爆搜剪枝做  
  
但是代码很长  
可以想到，全排列中，每走过一个点，那么这个点其实就在这一趟中没什么用了  
而且第  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" /> 个点走的是  <img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline j" /> 的话似乎也没有用到前面的排列  
那么不如就记录某个点是否走过了  
这样走过的点会形成一个  <img src="https://latex.codecogs.com/svg.image?\inline&space;01" title="\inline 01" />  状态：  <img src="https://latex.codecogs.com/svg.image?\inline&space;s" title="\inline s" />   
我们用这个状态进行推，设置  <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[s][i]" title="\inline dp[i][j]" /> 表示第  <img src="https://latex.codecogs.com/svg.image?\inline&space;s" title="\inline s" /> 状态下，最后走到的点是  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />   
此时可以新换入一个  <img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="\inline 1" /> 来表示新的状态，即如果第  <img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline j" /> 位是  <img src="https://latex.codecogs.com/svg.image?\inline&space;0" title="\inline 0" /> 的话，就可以通过  <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[s][i]" title="\inline dp[s][i]" /> 推过去，距离加了  <img src="https://latex.codecogs.com/svg.image?\inline&space;g[i][j]" title="\inline g[i][j]" />   
    
那么转移方程就是： <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[s|(1<<j)][j]=min(dp[s|(1<<j)][j],dp[s][i]+g[i][j])" title="\inline dp[s|(1<<j)][j]=min(dp[s|(1<<j)][j],dp[s][i]+g[i][j])" />  

最后再计算一下走到  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" /> 后再走回去的距离  
此时所有的点都走过了，所以状态是全  <img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="\inline 1" /> 的

#### ✅

```cpp
int dp[1050000][20]; // dp[i][j]: i状态下，最后一个点走到j
int g[20][20];

int n;

int main () {
        memset ( dp, 0x3f3f3f3f, sizeof dp );

        cin >> n;
        for ( int i = 0; i < n; i ++ ) for ( int j = 0; j < n; j ++ ) cin >> g[i][j];

        dp[1][0] = 0;
        
        for ( int s = 0; s < (1 << n); s ++ ) {
                for ( int i = 0; i < n; i ++ ) { // s状态下从i出发
                        if ( dp[s][i] != 0x3f3f3f3f ) {
                                for ( int j = 0; j < n; j ++ ) {
                                        if ( (s & (1 << j)) == 0 ) { // 没走到过j，那就走到j
                                                int news = s | (1 << j); // 走到j后是一个新状态
                                                dp[news][j] = min ( dp[news][j], dp[s][i] + g[i][j] );
                                        }
                                }
                        }
                }
        }

        int res = 0x3f3f3f3f;
        for ( int i = 0; i < n; i ++ ) {
                res = min ( res, dp[(1 << n) - 1][i] + g[i][0] ); // 每个点都走过一遍的状态，从i走回0
        }
        cout << res << endl;
}
```



## 洛谷P1896_互不侵犯

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1896">![20220714162643](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220714162643.png)</a>

#### 💡
一个计数问题，结果一看就很大，肯定不能搜  
这也是二维，组合数做起来很麻烦  
那么计数的另一个方案就是 $dp$   
依然是那个问题，这是一个二维的，化成一维表示就很好弄了，那就把一个维度压缩吧，每一个数表示放不放刚好对应了 $01$ 的状态压缩  
用 $dp[i][j][k]$ 表示前 $i$ 行，第 $i$ 行状态为 $j$ ，有 $k$ 个国王的方案数  
从 $1$ 到 $n$ 枚举行进行递推  
枚举上一行的状态 $s$ 和这一行的状态 $t$ ，判断一下这两行这样拼接是否可行  
  
首先是判断每一行是否成立，如果存在相邻的两个 $1$ 就不行    

```cpp
inline bool check1 (int x) {
        x <<= 1;
        for (int j = 1; j <= n; j ++) if ((x >> j & 1) && ((x >> (j + 1) & 1) || (x >> (j - 1) & 1))) return false;
        return true;
}
```

其次是判断这两行拼一起是否成立，如果 $u$ 的第 $i$ 位为 $1$ ，那么 $v$ 的第 $i-1,i,i+1$ 位都不为 $1$   

```cpp
inline bool check2 (int x, int y) {
        x <<= 1;
        y <<= 1;
        for (int j = 1; j <= n; j ++) {
                if (x >> j & 1) {
                        if ((y >> j & 1) || (y >> (j + 1) & 1) || (y >> (j - 1) & 1)) {
                                return false;
                        }
                }
        } 
        return true;
}
```

这样判断完之后，去枚举到这一行之后的国王数 $k$ ，然后转移累加即可  

#### ✅
```cpp
int main () {
        ios::sync_with_stdio(false);
        cin.tie(nullptr);

        cin >> n >> k;

        dp[0][0][0] = 1;
        for (int i = 1; i <= n; i ++) {
                for (int s = 0; s < (1 << n); s ++) {
                        int s1 = __builtin_popcount(s);
                        if (!check1(s)) continue;
                        for (int t = 0; t < (1 << n); t ++) {
                                int t1 = __builtin_popcount(t);
                                if (!check1(t) || !check2(s, t)) continue;
                                for (int kk = s1 + t1; kk <= k; kk ++) dp[i][t][kk] += dp[i - 1][s][kk - t1];
                        }
                }
        }
        ll res = 0;
        for (int s = 0; s < (1 << n); s ++) res += dp[n][s][k];
        cout << res << endl;
}
```


## 洛谷P4163_排列

#### 🔗
<a href="https://www.luogu.com.cn/problem/P4163">![20220428175354](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220428175354.png)</a>

#### 💡
想暴力 `next_permutation()` 写，但是时间差一点  
$|s|$ 不是很大，开状压  
我们枚举每一个数的选择状态 $s$ ，然后枚举 $cur=[0,d-1]$ 为该选择状态下得到的余数  
然后枚举下一个应该塞哪个下标（设为 $i$），则 下一个状态为 $s|(1<<i)$ ，下一个余数为 $cur*10+a[i]$  
这样转移过程就出来了  

#### ✅
```cpp
inline void Solve () {
        string s; cin >> s;
        int d; cin >> d;

        vector<int> cnt(10, 0);
        for (char c : s) cnt[c - '0'] ++;

        vector<vector<int> > dp((1 << s.size()), vector<int>(d));

        dp[0][0] = 1;
        for (int S = 0; S < (1 << s.size()); S ++) {
                for (int i = 0; i < s.size(); i ++) {
                        if (!(S & (1 << i))) {
                                for (int cur = 0; cur < d; cur ++) {
                                        int nxt = (cur * 10 % d + s[i] - '0') % d;
                                        dp[S | (1 << i)][nxt] += dp[S][cur];
                                }
                        }
                }
        }
        
        int res = dp[(1 << s.size()) - 1][0];
        for (int i = 0; i < 10; i ++) {
                if (cnt[i]) {
                        for (int j = 2; j <= cnt[i]; j ++) res /= j;
                }
        }
        cout << res << endl;
}
```


## CCPC2021女生赛C_连锁商店

#### 🔗
<a href="https://codeforces.com/gym/103389/problem/C"><img src="https://s2.loli.net/2022/01/13/7urOm9w23AtzMVC.png"></a>

#### 💡
类似于一个旅行商问题  
n不大，我们可以想着用状压来表示状态  
但它是  <img src="https://latex.codecogs.com/svg.image?\inline&space;36" title="\inline 36" /> ，如果用  <img src="https://latex.codecogs.com/svg.image?\inline&space;36" title="\inline 36" /> 位二进制肯定会超内存，想想优化  
如果一个公司只有一个点，那么是没有必要用这个状态的  
因为不能反方向走的话，根本不用决定这个点是否出现过在这个状态内  
所以可以把这类只有一个点的公司拿出来单独选择  
而把至少有两个点的公司压入二进制状态，我们第二维就可以作为上一步是哪个点  
那么这个问题就状压DP  <img src="https://latex.codecogs.com/svg.image?\inline&space;sxy" title="\inline sxy" /> 就可以解决了  

#### ✅

```cpp
const int N = 40;
const int M = 1600;
int n, m;
int c[N], w[N];
struct Edge {
        int nxt, to;
} edge[M];
int head[N], cnt;
int vis[N][N];
inline void add_Edge ( int from, int to ) {
        edge[++ cnt] = { head[from], to };
        head[from] = cnt;
}

int dp[300000][40];

// 用来挑出来独立公司的一些工具
vector<int> vec;
int numc[N];
bool one[N]; 
vector<int> cam;

int id[N]; // 公司的新编号

int main () {
        scanf("%d%d", &n, &m);
        for ( int i = 1; i <= n; i ++ ) scanf("%d", &c[i]), c[i] --, numc[c[i]] ++, vec.push_back(i);
        for ( int i = 0; i < n; i ++ ) scanf("%d", &w[i]);
        for ( int i = 1; i <= m; i ++ ) {
                int a, b; scanf("%d%d", &a, &b);
                add_Edge(a, b);
                vis[a][b] = 1;
        }
        for ( int i = 2; i <= n; i ++ ) if ( !vis[1][i] ) add_Edge (1, i);
        sort ( vec.begin(), vec.end(), [&](int x, int y) {
                return numc[c[x]] > numc[c[y]];
        });
        while ( vec.size() && numc[c[vec.back()]] == 1 ) one[vec.back()] = true, vec.pop_back();
        for ( int i = 0; i < vec.size(); i ++ ) cam.push_back(c[vec[i]]);
        sort ( cam.begin(), cam.end() );
        cam.erase(unique(cam.begin(), cam.end()), cam.end());
        for ( int i = 0; i < cam.size(); i ++ ) id[cam[i]] = i;

        // 普通的状压
        if ( one[1] ) dp[0][1] = w[c[1]];
        else dp[1 << (id[c[1]])][1] = w[c[1]];

        for ( int s = 0; s < (1ll << cam.size()); s ++ ) {
                for ( int x = 1; x <= n; x ++ ) {
                        for ( int i = head[x]; i; i = edge[i].nxt ) {
                                int to = edge[i].to;
                                if ( one[to] ) dp[s][to] = max(dp[s][to], dp[s][x] + w[c[to]]);
                                else if ( !(s & (1 << (id[c[to]]) ) ) ) dp[s | (1 << id[c[to]])][to] = max(dp[s | (1 << id[c[to]])][to], dp[s][x] + w[c[to]]); 
                                else dp[s][to] = max(dp[s][to], dp[s][x]); // 由于可能断步，所以可以尝试继承一下
                        }
                }
        }
        for ( int i = 1; i <= n; i ++ ) {
                int cur = 0;
                for ( int s = 0; s < (1ll << cam.size()); s ++ ) {
                        if ( one[i] ) cur = max(cur, dp[s][i] );
                        else if ( s & (1 << id[c[i]])) cur = max(cur, dp[s][i] );
                }
                printf("%d\n", cur);
        }
}
```



## ICPC2021台北D_LargestRemainder

#### 🔗
<a href="https://codeforces.com/gym/103443/problem/D">![20220501215553](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220501215553.png)</a>

#### 💡
（训练赛，看见 $D$ 这么小果断状压  
既然让余数最大时排列出来的数最大，排列出来的数做限制的话太大了，那么就用余数做限制。（这个其实分析一下时间复杂度也能看出来出题人想让用余数做限制吧  
我们令第一维表示每一个下标选择的状态，第二维表示余数。  
那么对于所有数的选择情况都已经出来了   
  
第一重套路地枚举状态 $s$，然后找出来 $s$ 中没有用过的下标  
里面套一重枚举余数 $d$   
那么对于以前没选过 $i$ ，此时要选 $i$ ，新余数就是 $(d\times10+a[i])%k$  
我们此时有了新状态，有了新余数，转移维护最大排列值即可   
  
最后找答案就从大到小枚举满状态下的余数，如果存在的话就输出即可  

#### ✅
```cpp
ll dp[1 << 17][210];
int D, K;
vector<int> a;
 
int main() {
	ios::sync_with_stdio(false); cin.tie(0);
	scanf("%d%d", &D, &K);
	for (int i = 0; i < D; i ++) {
		int x; scanf("%d", &x);
		a.push_back(x);
	}
	for (int S = 0; S < (1 << D); S ++) {
		for (int i = 0; i < K; i ++) dp[S][i] = -1;
	}
	dp[0][0] = 0;
 
	for (int S = 0; S < (1 << D); S ++) {
		vector<int> s0; // 没有选的位置 
		for (int i = 0; i < D; i ++) if (!(S & (1 << i))) s0.push_back(i); 
		for (int cur = 0; cur < K; cur ++) {
			if (dp[S][cur] == -1) continue;
			for (int j = 0; j < s0.size(); j ++) {
				int nxt = (cur * 10 % K + a[s0[j]]) % K;
				dp[S | (1 << s0[j])][nxt] = max(dp[S | (1 << s0[j])][nxt], dp[S][cur] * 10 + a[s0[j]]);
			}
		}
	}
	for (int k = K - 1; k >= 0; k --) {
		if (dp[(1 << D) - 1][k] >= 0) {
			printf("%lld", dp[(1 << D) - 1][k]);
			return 0;
		}
	}
	return 0;
}
```
