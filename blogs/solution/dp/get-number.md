---
title: 计数DP
---
###  
<hr>

## 洛谷P1136_迎接仪式

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1136"><img src="https://i.loli.net/2021/11/27/9vEbG1QScmyFPCe.png"></a>

#### 💡
换与不换是一种决策，可以用  <img src="https://latex.codecogs.com/svg.image?\inline&space;dp" title="\inline dp" />  实现  
换来换去太绕了，我们可以计算直接改变的  <img src="https://latex.codecogs.com/svg.image?\inline&space;'j'" title="\inline 'j'" /> 和  <img src="https://latex.codecogs.com/svg.image?\inline&space;'z'" title="\inline 'z'" /> 数量，最后计算这两个数量一样的  <img src="https://latex.codecogs.com/svg.image?\inline&space;dp" title="\inline dp" /> 就行了  
  
那么我们可以记录状态  <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[i][j][k][id]" title="\inline dp[i][j][k][id]" /> 表示在第  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" /> 位之前，换来了  <img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline j" /> 个  <img src="https://latex.codecogs.com/svg.image?\inline&space;'j'" title="\inline 'j'" /> 和  <img src="https://latex.codecogs.com/svg.image?\inline&space;k" title="\inline k" /> 个  <img src="https://latex.codecogs.com/svg.image?\inline&space;'z'" title="\inline 'z'" /> 且这一位是  <img src="https://latex.codecogs.com/svg.image?\inline&space;id=0?'j':'z'" title="\inline id=0?'j':'z'" /> ，的最大价值  
  
那么我们线性枚举，枚举第几位，枚举换出了多少个  <img src="https://latex.codecogs.com/svg.image?\inline&space;'j'" title="\inline 'j'" /> 和多少个  <img src="https://latex.codecogs.com/svg.image?\inline&space;'z'" title="\inline 'z'" />   
**在第  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" /> 位**   

如果这一位本身是  <img src="https://latex.codecogs.com/svg.image?\inline&space;'j'" title="\inline 'z'" /> ，我们可以选择换还是不换  
**换：** 产出了一个  <img src="https://latex.codecogs.com/svg.image?\inline&space;'z'" title="\inline 'z'" /> ，上一个状态耗费的是  <img src="https://latex.codecogs.com/svg.image?\inline&space;j-1" title="\inline j-1" /> 个换出  <img src="https://latex.codecogs.com/svg.image?\inline&space;'z'" title="\inline 'z'" /> 的方式，且可以因上一步最后为  <img src="https://latex.codecogs.com/svg.image?\inline&space;'j'" title="\inline 'j'" /> 的位数加价值，或者为  <img src="https://latex.codecogs.com/svg.image?\inline&space;'z'" title="\inline 'z'" /> 不改变， <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[i][j][k][1]=max(dp[i-1][j-1][k][0]+1,dp[i-1][j-1][k][1])" title="\inline dp[i][j][k][1]=max(dp[i-1][j-1][k][0]+1,dp[i-1][j-1][k][1])" />  
**不换：** 本身是  <img src="https://latex.codecogs.com/svg.image?\inline&space;'j'" title="\inline 'j'" /> 也不会受到上一步影响，那么就简单汇聚一下， <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[i][j][k][0]=max(dp[i-1][j][k][0],dp[i-1][j][k][1])" title="\inline dp[i][j][k][0]=max(dp[i-1][j][k][0],dp[i-1][j][k][1])" />     

如果这一位是  <img src="https://latex.codecogs.com/svg.image?\inline&space;'z'" title="\inline 'j'" />   
**换：** 变成了  <img src="https://latex.codecogs.com/svg.image?\inline&space;'j'" title="\inline 'j'" /> ，与上一步无影响也耗费了一个  <img src="https://latex.codecogs.com/svg.image?\inline&space;k" title="\inline k" /> ，上个状态就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;k-1" title="\inline k-1" /> ，汇聚一下， <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[i][j][k][0]=max(dp[i-1][j][k-1][0],dp[i-1][j][k-1][1])" title="\inline dp[i][j][k][0]=max(dp[i-1][j][k-1][0],dp[i-1][j][k-1][1])" />   
**不换：**  本身可以和上一步的  <img src="https://latex.codecogs.com/svg.image?\inline&space;'j'" title="\inline 'j'" /> 产生影响，  <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[i][j][k][1]=max(dp[i-1][j][k][1],dp[i-1][j][k][0]+1)" title="\inline dp[i][j][k][1]=max(dp[i-1][j][k][1],dp[i-1][j][k][0]+1)" />   
  
最后遍历一下修改量  <img src="https://latex.codecogs.com/svg.image?\inline&space;jk" title="\inline jk" /> ，选择最大的  <img src="https://latex.codecogs.com/svg.image?\inline&space;max(dp[n][jk][jk][0],dp[n][jk][jk][1])" title="\inline max(dp[n][jk][jk][0],dp[n][jk][jk][1] )" />  
  
其中注意，初始是前面的都弄好了，且这一位不会产生影响，  <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[0][0][0][1]=0" title="\inline dp[0][0][0][1]=0" />   

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
int N, K;
string s;

int dp[510][105][105][2];  

int main () {
        cin >> N >> K >> s; s = "0" + s;

        memset ( dp, -0x3f3f3f3f, sizeof dp );
        dp[0][0][0][1] = 0;

        for ( int i = 1; i <= N; i ++ ) {
                for ( int j = 0; j <= K; j ++ ) {
                        for ( int k = 0; k <= K; k ++ ) {
                                if ( s[i] == 'j' ) {
                                        dp[i][j][k][0] = max ( dp[i - 1][j][k][0], dp[i - 1][j][k][1] );
                                        if ( j ) dp[i][j][k][1] = max ( dp[i - 1][j - 1][k][0] + 1, dp[i - 1][j - 1][k][1] );
                                } else {
                                        dp[i][j][k][1] = max ( dp[i - 1][j][k][1], dp[i - 1][j][k][0] + 1 );
                                        if ( k ) dp[i][j][k][0] = max ( dp[i - 1][j][k - 1][0], dp[i - 1][j][k - 1][1] );
                                }
                        }
                }
        }

        int res = -0x3f3f3f3f;
        for ( int jk = 0; jk <= K; jk ++ ) {
                res = max ( res, max (dp[N][jk][jk][0], dp[N][jk][jk][1]) );
        }
        cout << res << endl;
}
```

<hr>

## 洛谷P5484_基因补全

#### 🔗
<a href="https://www.luogu.com.cn/problem/P5484"><img src="https://s2.loli.net/2022/01/14/vo2L6X9tDRHgKW4.png"></a>

#### 💡
##### 任务简化

要匹配的话我们按要求把字符串  <img src="https://latex.codecogs.com/svg.image?\inline&space;A" title="\inline A" />  转译一下  
由于我们可以在字符串  <img src="https://latex.codecogs.com/svg.image?\inline&space;B" title="\inline B" />  中加入任何字符变成 <img src="https://latex.codecogs.com/svg.image?\inline&space;A" title="\inline A" />  
反过来就是问我们在字符串 <img src="https://latex.codecogs.com/svg.image?\inline&space;A" title="\inline A" /> 的子序列中能找到多少个 <img src="https://latex.codecogs.com/svg.image?\inline&space;B" title="\inline B" />  

##### 问题解法

这个问题就很简单了  
我们枚举字符串 <img src="https://latex.codecogs.com/svg.image?\inline&space;A" title="\inline A" /> 的下标  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  ， <img src="https://latex.codecogs.com/svg.image?\inline&space;A_i" title="\inline A_i" />  能做出的贡献就是：  
对于所有的  <img src="https://latex.codecogs.com/svg.image?\inline&space;B_j=A_i" title="\inline B_j=A_i" />  ，若  <img src="https://latex.codecogs.com/svg.image?\inline&space;j>1" title="\inline j>1" />  ，那么在字符串 <img src="https://latex.codecogs.com/svg.image?\inline&space;A" title="\inline A" /> 的所有  <img src="https://latex.codecogs.com/svg.image?\inline&space;B_{j-1}" title="\inline B_{j-1}" />  字符全都接着  <img src="https://latex.codecogs.com/svg.image?\inline&space;B_j" title="\inline B_j" />  这个字符再往后走一步  
如果  <img src="https://latex.codecogs.com/svg.image?\inline&space;j=0" title="\inline j=0" />  就是他自己要  <img src="https://latex.codecogs.com/svg.image?\inline&space;+1" title="\inline +1" />    
那就是妥妥的 计数  <img src="https://latex.codecogs.com/svg.image?\inline&space;dp" title="\inline dp" />  了
  
##### 伪代码设计
  
所以我们设置  <img src="https://latex.codecogs.com/svg.image?\inline&space;dp_j" title="\inline dp_j" />  表示外层枚举到  <img src="https://latex.codecogs.com/svg.image?\inline&space;A_i" title="\inline A_i" />  时，子序列结尾为  <img src="https://latex.codecogs.com/svg.image?\inline&space;B_j" title="\inline B_j" />  的方案数  
那么转移方程为 ：  
<img src="https://latex.codecogs.com/svg.image?\inline&space;\begin{aligned}&space;&space;&for\;i[0\longrightarrow&space;n-1]:\\&space;&space;&\quad&space;for\;j[m-1\longrightarrow&space;0]:\\&space;&space;&\quad\quad\quad&space;if\;j>0:&dp_j=dp_j&plus;dp_{j-1}\\&space;&space;&\quad\quad\quad&space;else:&dp_j=dp_j&plus;dp_{j-1}\end{aligned}" title="\inline \begin{aligned} &for\;i[0\longrightarrow n-1]:\\ &\quad for\;j[m-1\longrightarrow 0]:\\ &\quad\quad\quad if\;j>0:&dp_j=dp_j+dp_{j-1}\\ &\quad\quad\quad else:&dp_j=dp_j+dp_{j-1}\end{aligned}" />   
>注意，这里倒着枚举  <img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline j" />  是防止同一步之前更新过的  <img src="https://latex.codecogs.com/svg.image?\inline&space;j-1" title="\inline j-1" />  加给  <img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline j" /> 

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

数过大，普通的类型会溢出  
这里只给出直观的普通类型 C++ 代码，改大数可以自行更改（我用的是 java

```cpp
ll dp[2005];

int main () {
        ll n, m; cin >> n >> m;
        string s, t; cin >> s >> t;
        // 转义
        for ( int i = 0; i < n; i ++ ) {
                if ( s[i] == 'A' ) s[i] = 'T';
                else if ( s[i] == 'T' ) s[i] = 'A';
                else if ( s[i] == 'C' ) s[i] = 'G';
                else s[i] = 'C'; 
        } 
        // 计数
        for ( int i = 0; i < n; i ++ ) {
                for ( int j = m - 1; j >= 0; j -- ) {
                        if ( s[i] == t[j] ) {
                                if ( j ) dp[j] += dp[j - 1];
                                else dp[j] ++;
                        }
                }
        }
        cout << dp[m - 1] << endl;
}
```

<hr>

## ICPC2021台湾省赛G_GardenPark

#### 🔗
<a href="https://codeforces.com/gym/103373/problem/G"><img src="https://s2.loli.net/2022/01/14/GJDlbeI1MXwcoku.png"></a>

#### 💡
一个计数问题  
而且每个权值小的边都可以将自己的方案数推给相邻权值大的边  
就直接计数dp就完事了  
  
由于我们是小边推给大边  
这里要按边权从小打大开始遍历  
并且发现这里走过一条边有不同的方向，所以我们设置一个 `dp_up[i]` 和一个 `dp_down[i]` 来表示终止于这条边上到下的方案数和从下到上的方案数  
  
那么我们可以先从这条边深度大的点枚举它的相邻边，这样是累积 `dp_up`    
如果相邻边小，我们要看这个相邻边是从深度小的推向深度大的还是深度大到深度小的  
如果是小推大，那么就 `dp_up[i] += dp_down[该邻边编号]`  否则 `dp_up[i] += do_up[该邻边编号]`  
选择深度小的点枚举相邻边同理  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
ll n;
struct Edge {
        ll nxt, to, val;
        ll id; // 该边编号
} edge [400005];
ll head[200005], cnt;
inline void add_Edge ( ll from, ll to, ll val, ll id ) {
        edge [ ++ cnt ] = {head[from], to, val, id};
        head[from] = cnt;
}

struct Way {
        ll a, b, c;
} w[200005];

map<ll, vector<ll> > mp;
ll d[200005];

inline void dfs_Dep ( ll x, ll fa, ll dp ) {
        d[x] = dp;
        for ( ll i = head[x]; i; i = edge[i].nxt ) {
                if ( edge[i].to == fa ) continue;
                dfs_Dep(edge[i].to, x, dp + 1);
        }
}
ll dp_up[200005], dp_down[200005];

int main () {
        scanf("%lld", &n);
        for ( ll i = 0; i < n - 1; i ++ ) {
                scanf("%lld%lld%lld", &w[i].a, &w[i].b, &w[i].c);
                mp[w[i].c].push_back(i);
                add_Edge(w[i].a, w[i].b, w[i].c, i);
                add_Edge(w[i].b, w[i].a, w[i].c, i);
        }
        dfs_Dep(1, 1, 0);
        for ( auto m : mp ) {
                ll val = m.first;
                for ( ll ve = 0; ve < m.second.size(); ve ++ ) {
                        ll uppt = w[m.second[ve]].a;
                        ll dwpt = w[m.second[ve]].b;
                        ll lnvl = w[m.second[ve]].c;
                        if ( d[uppt] > d[dwpt] ) swap(uppt, dwpt);

                        dp_up[m.second[ve]] = dp_down[m.second[ve]] = 1;

                        // dp_dw
                        for ( ll i = head[uppt]; i; i = edge[i].nxt ) {
                                ll to = edge[i].to;
                                ll vl = edge[i].val;
                                ll id = edge[i].id;
                                if ( vl >= lnvl ) continue; // 严格小于
                                if ( d[to] > d[uppt] ) { // 这样看相邻边是向上推的
                                        dp_down[m.second[ve]] += dp_up[id];
                                } else { // 向下推的
                                        dp_down[m.second[ve]] += dp_down[id];
                                }
                        } 
                        // dp_up
                        for ( ll i = head[dwpt]; i; i = edge[i].nxt ) {
                                ll to = edge[i].to;
                                ll vl = edge[i].val;
                                ll id = edge[i].id;
                                if ( vl >= lnvl ) continue;
                                if ( d[to] > d[dwpt] ) {
                                        dp_up[m.second[ve]] += dp_up[id];
                                } else {
                                        dp_up[m.second[ve]] += dp_down[id];
                                }
                        }
                }
        }
        ll res = 0;
        for ( ll i = 0; i < n - 1; i ++ ) res += dp_up[i] + dp_down[i];
        cout << res << endl;
}
```

<hr>
