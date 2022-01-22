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

<details>
  <summary align="center">查看题解</summary>
  
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
#### include <iostream>
#### include <algorithm>
#### include <cstring>
#### include <vector>
#### include <map>

#### define ll long long

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
