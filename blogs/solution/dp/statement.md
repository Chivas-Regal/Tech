---
title: 状压DP
---

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

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

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

<hr>

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

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

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

<hr>
