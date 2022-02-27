---
title: 区间DP
---
###  
<hr>

## 洛谷P1005_矩阵取数游戏


#### 🔗
  <a href="https://www.luogu.com.cn/record/61391875"><img src="https://i.loli.net/2021/11/08/xtfWkDi1KOBhFZH.png"></a>
  
#### 💡
  
由于每一行互不影响，所以我们一行一行分开处理  
每行两个端点左右可以选左也可以选右  
且每一个都有自己的权值，要求从选左选右序列中找到一个价值最大的  
那么一看就有区间dp那味儿了  
如果dp数组两个下标  <img src="https://latex.codecogs.com/svg.image?\inline&space;i,j" title="\inline i,j" />  维护的是选到  <img src="https://latex.codecogs.com/svg.image?\inline&space;[i,j]" title="\inline [i,j]" /> 时的最大值  
那么这个是可以通过转移的，即  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[i][j]=max(dp[i-1][j]+a[i]*2^k,dp[i][j+1]+a[j]*2^k)" title="\inline dp[i][j]=max(dp[i-1][j]+a[i]*2^k,dp[i][j+1]+a[j]*2^k)" /> 
 <img src="https://latex.codecogs.com/svg.image?\inline&space;k" title="\inline k" /> 表示已经选过的个数  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const LL N = 100;
LL a[N];
ll n, m;
LL res = 0;
LL dp[N][N];

inline LL ksm ( LL a, LL b ) {
        LL res = 1;
        while ( b ) {
                if ( b % 2 ) res = res * a;
                a = a * a;
                b /= 2;
        }
        return res;
}

inline LL Solve () {
        memset ( dp, 0, sizeof dp );
        LL ans = 0;
        for ( int i = 1; i <= m; i ++ ) { ll x; cin >> x; a[i] = x; }
        for ( int i = 1; i <= m; i ++ ) {
                for ( int j = m; j >= i; j -- )
                        dp[i][j] = max (
                                dp[i - 1][j] + a[i - 1] * ksm ( 2, m - j + i - 1 ), 
                                dp[i][j + 1] + a[j + 1] * ksm ( 2, m - j + i - 1 )
                        );
        }
        for ( int i = 1; i <= m; i ++ ) ans = max ( ans, dp[i][i] + ksm ( 2, m ) * a[i] );
        return ans;
}

inline void Print_128 ( LL x ) {
        if ( x == 0 ) { cout << 0 << endl; return; }
        string res;
        while ( x ) res += x % 10 + '0', x /= 10;
        reverse ( res.begin(), res.end() );
        cout << res << endl;
}

int main () {
        cin >> n >> m;
        for ( int i = 1; i <= n; i ++ ) res += Solve ();
        Print_128(res);
}
```
</details>

<hr>

## 洛谷P1220_关路灯

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1220"><img src="https://i.loli.net/2021/12/02/jiWgtSOIUvEZoPN.png"></a>

#### 💡
  
这种左右端点决策扩展的问题，应想到用区间DP  
  
人是一步步走的，那么这里就出现了四种转移方式  
<img src="https://latex.codecogs.com/svg.image?\inline&space;1." title="\inline 1." />从<img src="https://latex.codecogs.com/svg.image?\inline&space;[i,j]" title="\inline [i,j]" />的  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  走向  <img src="https://latex.codecogs.com/svg.image?\inline&space;j+1" title="\inline j+1" />   
<img src="https://latex.codecogs.com/svg.image?\inline&space;2." title="\inline 1." />从<img src="https://latex.codecogs.com/svg.image?\inline&space;[i,j]" title="\inline [i,j]" />的  <img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline j" />  走向  <img src="https://latex.codecogs.com/svg.image?\inline&space;j+1" title="\inline j+1" />   
<img src="https://latex.codecogs.com/svg.image?\inline&space;3." title="\inline 1." />从<img src="https://latex.codecogs.com/svg.image?\inline&space;[i,j]" title="\inline [i,j]" />的  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  走向  <img src="https://latex.codecogs.com/svg.image?\inline&space;i-1" title="\inline i-1" />   
<img src="https://latex.codecogs.com/svg.image?\inline&space;4." title="\inline 1." />从<img src="https://latex.codecogs.com/svg.image?\inline&space;[i,j]" title="\inline [i,j]" />的  <img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline j" />  走向  <img src="https://latex.codecogs.com/svg.image?\inline&space;i-1" title="\inline i-1" />   
那么也对应了不同的影响  
从  <img src="https://latex.codecogs.com/svg.image?\inline&space;x" title="\inline x" />  走向  <img src="https://latex.codecogs.com/svg.image?\inline&space;y" title="\inline y" />  这一段产生的影响为 "未关掉的灯泡数量的功率和  <img src="https://latex.codecogs.com/svg.image?\inline&space;\times" title="\inline \times" />   <img src="https://latex.codecogs.com/svg.image?\inline&space;x\rightarrow&space;y" title="\inline x" /> 的路程"  
  
功率和我们可以记录功率前缀和，然后总和减去关掉过的区间灯泡功率和 

```cpp
inline int Work ( int i, int j ) {
        return a[i - 1].y + a[n].y - a[j].y;
}
```
路程直接就距离相减即可  
```cpp
inline int WalkTime ( int i, int j ) {
        return abs(a[j].x - a[i].x);
}
```  
  
状态就记录区间，然后再记录一下当前在区间  <img src="https://latex.codecogs.com/svg.image?\inline&space;[i,j]" title="\inline [i,j]" />   的左侧  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  还是右侧  <img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline j" /> 
那么转移方程为  
<img src="https://latex.codecogs.com/svg.image?\inline&space;dp[i-1][j][0]=min(dp[i][j][1]+walkTime(i-1,j)\times&space;work(i,j))" title="\inline dp[i-1][j][0]=min(dp[i-1][j][0],dp[i][j][1]+WalkTime(i-1,j)\times&space;Work(i,j))" /> 
<img src="https://latex.codecogs.com/svg.image?\inline&space;dp[i-1][j][0]=min(dp[i][j][0]+walkTime(i-1,i)\times&space;work(i,j))" title="\inline dp[i-1][j][0]=min(dp[i-1][j][0],dp[i][j][0]+WalkTime(i-1,i)\times&space;Work(i,j))" /> 
<img src="https://latex.codecogs.com/svg.image?\inline&space;dp[i][j+1][1]=min(dp[i][j][1]+walkTime(j,j+1)\times&space;work(i,j))" title="\inline dp[i][j+1][1]=min(dp[i][j+1][1],dp[i][j][1]+WalkTime(j,j+1)\times&space;Work(i,j))" /> 
<img src="https://latex.codecogs.com/svg.image?\inline&space;dp[i][j+1][1]=min(dp[i][j][0]+walkTime(i,j+1)\times&space;work(i,j))" title="\inline dp[i][j+1][1]=min(dp[i][j+1][1],dp[i][j][0]+WalkTime(i,j+1)\times&space;Work(i,j))" />   


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
# include <iostream>
# include <algorithm>
# include <cstring>
# include <vector>
# include <map>

# define ll long long

using namespace std;

const int N = 55;
int dp[N][N][2];

#### define pii pair<int, int>
#### define x first
#### define y second

int n, c;
pii a[N];

inline int Work ( int i, int j )     { return a[i - 1].y + a[n].y - a[j].y; }
inline int WalkTime ( int i, int j ) { return abs(a[j].x - a[i].x); }

int main () {
        ios::sync_with_stdio(false);

        cin >> n >> c;
        for ( int i = 1; i <= n; i ++ ) cin >> a[i].x >> a[i].y;
        for ( int i = 1; i <= n; i ++ ) a[i].y += a[i - 1].y;
        
        memset ( dp, 0x3f3f3f3f, sizeof dp );
        dp[c][c][0] = dp[c][c][1] = 0;

        for ( int i = c; i >= 1; i -- ) {
                for ( int j = c; j <= n; j ++ ) {
                        dp[i - 1][j][0] = min ( dp[i - 1][j][0], dp[i][j][1] + WalkTime ( i - 1, j ) * Work ( i, j ) );
                        dp[i - 1][j][0] = min ( dp[i - 1][j][0], dp[i][j][0] + WalkTime ( i - 1, i ) * Work ( i, j ) );
                        dp[i][j + 1][1] = min ( dp[i][j + 1][1], dp[i][j][1] + WalkTime ( j, j + 1 ) * Work ( i, j ) );
                        dp[i][j + 1][1] = min ( dp[i][j + 1][1], dp[i][j][0] + WalkTime ( i, j + 1 ) * Work ( i, j ) );
                }
        }

        cout << min ( dp[1][n][0], dp[1][n][1] ) << endl;
        
}
```

<hr>

## NamomoCamp2022春季div1每日一题2_NoCrossing

#### 🔗
<a href="http://oj.daimayuan.top/problem/437"><img src="https://img-blog.csdnimg.cn/285cf76822ea4e18aa79fe8835b7250b.png"></a>

#### 💡
在图上画一画可行的走法便可得到  
这个题要考虑好我们走的点在坐标上一定要是让 $[l,r]$ 不断下压的   
这非常有区间 $dp$ 的味道  
那么我们维护 $dp[s][l][r][to]$  
- $s$ 为滚动下标
- $l,r$ 为我们维护的区间
- $to$ 指方向，也意味着在 $[l,r]$ 区间内我们最终会停在 $0/1:l/r$  
那么状态转移即为  

$[l,mid]$ 一定是停在 $mid$ ，毕竟 $mid\to l$ 没有可转移的状态  
$[mid,r]$ 同理也是停在 $mid$  
$[l,mid],[mid,r]$ 都可以由 $l\to r\to mid$ 和 $r\to l\to mid$ 可以固定出来  
所以 $dp[l,mid],dp[mid,r]$ 都由 $dp[l,r][1]+g[r][mid]$ 和 $dp[l,r][0]+g[l][mid]$ 维护最小值  

更新 $k$ 次后我们即可得到我们想要的  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int M = 2010,
          N = 110;

int g[N][N];
int n, m, k;
int dp[2][N][N][2]; // s, l, r, to{{0,left},{1,right}}


int main () {
        scanf("%d%d%d", &n, &k, &m);
        memset(g, 0x3f3f3f, sizeof g);
        for ( int i = 0; i < m; i ++ ) {
                int a, b, c; scanf("%d%d%d", &a, &b, &c);
                g[a][b] = min(g[a][b], c);
        }
        memset(dp[0], 0x3f3f3f3f, sizeof dp[0]);
        for ( int i = 1; i <= n; i ++ ) dp[0][0][i][1] = dp[0][i][n + 1][0] = 0;
        for ( int S = 1; S <= k - 1; S ++ ) {
                int s = S & 1;
                memset(dp[s], 0x3f3f3f3f, sizeof dp[s]);
                for ( int l = 0; l <= n + 1; l ++ ) {
                        for ( int r = l + 2; r <= n + 1; r ++ ) {
                                for ( int mid = l + 1; mid < r; mid ++ ) {
                                        int tmp = min(dp[!s][l][r][1] + g[r][mid], dp[!s][l][r][0] + g[l][mid]);
                                        dp[s][l][mid][1] = min(dp[s][l][mid][1], tmp);
                                        dp[s][mid][r][0] = min(dp[s][mid][r][0], tmp);
                                }
                        }
                }
        }
        int res = 0x3f3f3f3f;
        for ( int l = 0; l <= n + 1; l ++ ) {
                for ( int r = l + 1; r <= n + 1; r ++ ) {
                        res = min({res, dp[k - 1 & 1][l][r][0], dp[k - 1 & 1][l][r][1]});
                }
        }
        cout << (res == 0x3f3f3f3f ? -1 : res) << endl;
}
```
<hr>
