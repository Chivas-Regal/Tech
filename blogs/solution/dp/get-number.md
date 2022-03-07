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

## ABC234F_Reordering

#### 🔗
<a href="https://atcoder.jp/contests/abc234/tasks/abc234_f">![20220303170815](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220303170815.png)</a>

#### 💡
设 $'a'$ 有 $A$ 个， $'b'$ 有 $B$ 个 ...  
那么答案即为  
$$\sum\limits_{a=0}^A\sum\limits_{b=0}^B\sum\limits_{c=0}^C\dots\sum\limits_{z=0}^Z\frac{(a+b+c+\dots+z)!}{a!\times b!\times c!\times\dots\times z!}$$  
观察分子分母性质  
分母：计算下一个字符时枚举的个数可以直接乘阶乘  
分子：同长度下分子相同  
  
那么我们先不看分子，先去枚举字符枚举个数进行递推  
令 $dp[i][j]$ 表示枚举到第 $i$ 个字符时 ，长度为 $j$ 时 个数$/j!$ 的结果   
那么在枚举第 $i$ 个字符用了 $j$ 个，之前有了 $k$ 个字符时  
$dp[i][j+k]=dp[i][j+k]+dp[i-1][k]\times \frac1{j!}$    

然后最后统计答案将当前长度的阶乘乘上即可  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int mod = 998244353;

ll dp[30][5010];
string s;
ll num[30];

inline ll ksm ( ll a, ll b ) { ll res = 1; while ( b ) { if ( b & 1 ) res = res * a % mod; a = a * a % mod; b >>= 1; } return res; }
inline ll inv ( ll x ) { return ksm(x, mod - 2); }
ll ivf[5010], f[5010];
inline void get_F () {
	f[0] = ivf[0] = 1;
	for ( int i = 1; i < 5010; i ++ ) f[i] = f[i - 1] * i % mod, ivf[i] = ivf[i - 1] * inv(i) % mod;
}

int main () {
	get_F();

	cin >> s;
	for ( auto i : s ) num[i - 'a' + 1] ++;

	dp[0][0] = 1;
	for ( int i = 1; i <= 27; i ++ ) {
		for ( int j = 0; j <= s.size() - num[i]; j ++ ) {
			for ( int k = 0; k <= num[i]; k ++ ) {
				dp[i][j + k] = (dp[i][j + k] + dp[i - 1][j] * ivf[k] % mod) % mod;
			}
		}
	}
	ll res = 0;
	for ( int i = 1; i <= s.size(); i ++ ) res = (res + dp[27][i] * f[i] % mod) % mod;
	cout << res << endl;
}
```
<hr>

## CodeForces1635D_InfiniteSet

#### 🔗
<a href="https://codeforces.com/contest/1635/problem/D"><img src="https://img-blog.csdnimg.cn/d44a4c18fe324c4caebd7a0cd3dc29c4.png"></a>

#### 💡
$2x+1$ 为奇，$4x$ 为偶  
若 $a<b$，$a\in[a]$ 且 $b\in[a]$ 且 $a$ 可变为 $b$ ，删去 $b$ ，称为去重  
去重操作从大到小，对数的奇偶性进行向下修正，直到为偶数且模 $4$ 不为 $0$ 停止，如果向下修正时当前数已经存在，那么需要删掉    
去重后，剩下的所有在变化中将毫不相干  
  
注意 $2^p$ 说明是一个二进制问题  
考虑一下，对于  
$$1_2\left\{\begin{aligned}
&\stackrel{\times2+1}{\longrightarrow}11_2\\
&\stackrel{\times4}{\longrightarrow}100_2
\end{aligned}\right.$$ 
可以看出，一个 $x$ 位的数可以推到 $x+1$ 位与 $x+2$ 位  
阶梯问题，所以是 $fibonacci$  
那么对于一个有 $sz$ 位的数，可以变化出 $p$ 位以下的有 $p-sz+1$ 位  
即 $fibonacci$ 前缀和 $sum[p-sz+1]$  
对去重后的所有数累加即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 2e5 + 10;
const int mod = 1e9 + 7;
ll n, p;
set<ll> st;
vector<ll> a;

ll fibo[N];

int main () {
        ios::sync_with_stdio(false);
        fibo[1] = fibo[2] = 1;
        for ( int i = 3; i < N; i ++ ) fibo[i] = (fibo[i - 1] + fibo[i - 2]) % mod;
        for ( int i = 2; i < N; i ++ ) fibo[i] = (fibo[i] + fibo[i - 1]) % mod; // fibonacci 前缀和

        cin >> n >> p;
        for ( int i = 0; i < n; i ++ ) {
                ll x; cin >> x;
                st.insert(x);
                a.push_back(x);
        }
        // 去重
        sort ( a.begin(), a.end(), greater<ll>() );
        a.erase(unique(a.begin(), a.end()), a.end());
        for ( int i = 0; i < a.size(); i ++ ) {
                if ( *st.lower_bound(a[i]) != a[i] ) continue;

                ll cur = a[i];
                bool flag = false;
                while ( cur ) {
                        if ( cur & 1 ) cur = (cur - 1) / 2; // 反式 *2+1
                        else {
                                if ( cur % 4 ) break; // 化不下去了
                                else cur /= 4; // 反式 *4
                        }
                        if ( *st.lower_bound(cur) == cur ) { // [a]内存在
                                flag = true;
                                break;
                        }
                }
                if ( flag ) st.erase(a[i]);
        }
        // 逐个累加
        ll res = 0;
        for ( auto i : st ) {
                ll tmp = i;
                ll sz = 0; while ( tmp ) sz ++, tmp /= 2; 
                if ( p >= sz ) (res += fibo[p - sz + 1]) %= mod;
        }
        cout << res << endl;
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


## NamomoCamp2022春季div1每日一题9_路径计数2

#### 🔗
<a href="http://oj.daimayuan.top/course/10/problem/467">![20220307183909](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220307183909.png)</a>

#### 💡
直接从 $(1,1)$ 到 $(n,n)$ 很好求  
::: tip  
令 $f[i][j]$ 表示从 $(x_i,y_i)\to(x_j,y_j)$ 会经过 $i$ 行 $j$ 列  
观察矩阵 $f[i][j]=f[i][j-1]+f[i-1][j]\quad(i/j:0\to\infty)$ :  
<table>
<tr>
<td>1</td><td>1</td><td>1</td><td>1</td>
</tr>
<tr>
<td>1</td><td>2</td><td>3</td><td>4</td>
</tr>
<tr>
<td>1</td><td>3</td><td>6</td><td>10</td>
</tr>
<tr>
<td>1</td><td>4</td><td>10</td><td>14</td>
</tr>
</table>  
易知 $f[n][m]=\binom{n+m}{n}$
:::
但是由于中间有障碍，要减去经过障碍到达 $(n,n)$ 的方案数    
  
而前后障碍路径会相互嵌套，等于说如果有两个障碍 $(x_1,y_1),(x_2,y_2)$ ，减去 $(1,1)\to(x_1,y_1)\to(n,n)$ 与 $(1,1)\to(x_2,y_2)\to(n,n)$ 会多减一个 $(1,1)\to(x_1,y_1)\to(x_2,y_2)\to(n,n)$ ，要加上，那么即为<b>容斥</b>    
  
由于在计算 $(1,1)$ 到 $i$ 个障碍物时，需要容斥掉前面的障碍物，所以我们需要<b>一个状态去记录</b>一下对于上述问题，前面障碍物的合法方案数  
（前面是指满足 $x_j\le x_i,y_j\le y_i$ 的坐标） 
  
令 $dp[i]$ 表示从 $(1,1)$ 到达 $(x_i,y_i)$ 在容斥掉 $1～(i-1)$ 这些障碍物的结果，也就是从 $(1,1)$ 不经过这些障碍物直接到达 $(x_i,y_i)$ 的方案数  
我们用 $calc(\{x_1,y_1\},\{x_2,y_2\})$ 计算 $(x_1,y_1)\to(x_2,y_2)$ 的方案数  
那么转移便是 $(1,1)\to(x_i,y_i)$ 的方案数容斥掉前面 $(x_j,y_j)\to(x_i,y_i)$ 的方案数乘上对应的 $dp[j]$    
$dp[i]=calc(\{1,1\},\{x_i,y_i\})-\sum\limits_{j=1}^{i-1}calc(\{x_j,y_j\},\{x_i,y_i\})\times dp[j]$  
  
我们将 $(n,n)$ 设为最后一个障碍物，答案便易得了  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 2e6 + 10;
const int M = 3e3 + 10;
int n, m;
vector<pair<int, int> > vec;

const int mod = 1e9 + 7;
inline ll ksm ( ll a, ll b ) { ll res = 1; while ( b ) { if ( b & 1 ) res = res * a % mod; a = a * a % mod; b >>= 1; } return res; }
inline ll inv ( ll x ) { return ksm(x, mod - 2); }


ll ivf[N], f[N];
inline void get_F () { ivf[0] = f[0] = 1; for ( int i = 1; i < N; i ++ ) { ivf[i] = ivf[i - 1] * inv(i) % mod; f[i] = f[i - 1] * i % mod; } }
inline ll C ( int n, int m ) { return f[n] * ivf[m] % mod * ivf[n - m] % mod; }
inline ll calc ( pair<int, int> a, pair<int, int> b  ) { int curn = b.first - a.first + b.second - a.second; int curm = b.first - a.first; return C(curn, curm); }

ll dp[M];
int main () {
        get_F();
        scanf("%d%d", &n, &m);
        for ( int i = 0; i < m; i ++ ) {
                int x, y; scanf("%d%d", &x, &y);
                vec.push_back({x, y});
        }
        vec.push_back({n, n});
        sort ( vec.begin(), vec.end() );

        for ( int i = 0; i <= m; i ++ ) {
                dp[i] = calc({1, 1}, vec[i]);
                for ( int j = 0; j <= m; j ++ ) {
                        if ( i == j ) continue;
                        if ( vec[j].second <= vec[i].second && vec[j].first <= vec[i].first ) {
                                dp[i] -= dp[j] * calc(vec[j], vec[i]) % mod;
                                dp[i] = (dp[i] % mod + mod) % mod;
                        }
                }
        }
        printf("%lld\n", dp[m]);
}
```
<hr>