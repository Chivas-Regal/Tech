---
title: 筛法
---
###  
<hr>

## 埃氏筛

### CodeForces1512G_ShortTask

#### 🔗
<a href="https://codeforces.com/problemset/problem/1512/G"><img src="https://img-blog.csdnimg.cn/5b206cdb8bd74dafa8c530e12e895270.png"></a>

#### 💡
每个数的因数都要算一遍，那么我们就需要用到埃氏筛的重复筛的性质  
给了两秒，可以支持O(nlogn)    
那么我们直接开埃氏筛存数即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>

using namespace std;

const int N = 1e7 + 10;
int mark[N], res[N], n;

inline void Get () {
	for ( int i = 1; i < N; i ++ )
		for ( int j = i; j < N; j += i )
			mark[j] += i; // 每个数的因子和都要记录一下
	for ( int i = 1; i < N; i ++ ) 
		if ( mark[i] < N && !res[mark[i]] )
                        res[mark[i]] = i; // 第一个出现的存进去
}

int main () {
	Get(); int cass, x;
	for ( cin >> cass; cass; cass -- )
		cin >> x, cout << (res[x] == 0? -1 : res[x])<< endl;
}
```

<hr>

### CodeForces1627D_NotAdding

#### 🔗
<a href="https://codeforces.com/contest/1627/problem/D"><img src="https://s2.loli.net/2022/01/18/GtWesXr3kMwVHCY.png"></a>

#### 💡
可以简单的得到，其实就是每次选任意多任意的位置上的数，将它们的  <img src="https://latex.codecogs.com/svg.image?\inline&space;gcd" title="\inline gcd" /> 放进数组  
那么我们可以枚举这个  <img src="https://latex.codecogs.com/svg.image?\inline&space;gcd" title="\inline gcd" /> ，将数组中所有是它的倍数的数求一下  <img src="https://latex.codecogs.com/svg.image?\inline&space;gcd" title="\inline gcd" /> ，如果这些数的  <img src="https://latex.codecogs.com/svg.image?\inline&space;gcd" title="\inline gcd" /> 就是我们当前枚举的  <img src="https://latex.codecogs.com/svg.image?\inline&space;gcd" title="\inline gcd" /> 并且该  <img src="https://latex.codecogs.com/svg.image?\inline&space;gcd" title="\inline gcd" /> 没有在原数组内出现过，那么我们就可以加入  
  
枚举所有的倍数，埃氏筛就可以实现  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 1e6 + 1;
int vis[N];
 
inline int gcd ( int a, int b ) {
        return b ? gcd(b, a % b) : a;
}
 
int main () {
        ios::sync_with_stdio(false);
 
        int n; cin >> n;
        for ( int i = 0; i < n; i ++ ) {
                int x; cin >> x;
                vis[x] = 1;
        }
        int res = 0;
        for ( int i = 1; i < N; i ++ ) {
                if ( vis[i] ) continue;
                int g = 0;
                for ( int j = i; j < N; j += i ) {
                        if ( vis[j] ) g = gcd(g, j);
                }
                res += g == i;
        }
        cout << res << endl;
}
```

<hr>

## CodeForces1646E_PowerBoard

#### 🔗
<a href="https://codeforces.com/contest/1646/problem/E">![20220307213243](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220307213243.png)</a>

#### 💡
思考一下什么时候会出现重复， $2^4=4^2=16^1$  
那么我们考虑一下分组  
对于一个正整数 $x$ ，令所有以 $x^k$ 开始的行归为一组 $Group(x)$  
即:  
$$Group(x)=\left\{\begin{aligned}
k=1,\quad &x,x^2,x^3,\dots\newline
k=2,\quad &x^2,x^4,x^6,\dots\newline
k=3,\quad &x^3,x^6,x^9,\dots\newline
\dotso
\end{aligned}\right\}
$$  
显然，同一组内不同行不同列可能存在相同数，而 $x\neq y\Longrightarrow Group(x)\cap Group(y)=\empty$   
那么对于每一组行为 $i$ ，列为 $j$ ，我们需要统计 $i\times j$ 的个数然后不同组进行累加即可  

枚举 $x$ ，要想 $x^k\le n$ ，那么 $k\lt 20$    
对于 $x$ 看它在 $n$ 内的 $max\_k$ ，也就意味着可以形成一个 $max\_k$ 行 $m$ 列矩阵  
那么我们可以先处理出来 $n\_dif[i]$ 表示在一组内，一个 $i$ 行 $m$ 列矩阵的不同 $i\times j$ 的数量，这个可以用埃氏筛枚举倍数实现    
然后在枚举 $x$ 计算完 $max\_k$ 后累加 $n\_dif[max\_k]$ 即可  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 1e6 + 10;
int n, m;
bool vis[N * 25];
ll n_dif[25];

int main () {
        ios::sync_with_stdio(false);

        cin >> n >> m;

        for ( int i = 1; i <= 20; i ++ ) {
                n_dif[i] += n_dif[i - 1];
                for ( int j = 1; j <= m; j ++ ) {
                        if ( !vis[i * j] ) 
                                vis[i * j] = true,
                                n_dif[i] ++;
                }
        }

        memset(vis, 0, sizeof vis);

        ll res = 1;
        for ( int x = 2; x <= n; x ++ ) {
                int row = 0;
                for ( ll pw = x; pw <= n; pw *= x ) {
                        if ( vis[pw] ) continue; vis[pw] = true;
                        row ++;
                }
                res += n_dif[row];
        }
        cout << res << endl;
}
```
<hr>

## CodeForces1649D_IntegralArray

#### 🔗
<a href="https://codeforces.com/contest/1649/problem/D">![20220308092829](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220308092829.png)</a>

#### 💡
分两步考虑了  
由于 $a=\left\lfloor\frac xy\right\rfloor$ 要看对于 $y:1\to x$ 看其中每一个 $a$ 出现的情况，这些是会有很多重复的情况，那么我们可以开数论分块  
对每一个出现过的 $a_i$ 数论分块，看一个块内 $y\in[l,r]\;(\left\lfloor\frac xl\right\rfloor=\left\lfloor\frac xr\right\rfloor)$ 是否有出现过数，出现过的话那么 $\left\lfloor\frac xl\right\rfloor$ 也必然要出现，这个如果没有出现就是 `No` 了  
这个复杂度就是 $O(n\sqrt{m})$ ，是会超的    
  
既然我们可以对分母分块，那么也自然可以用埃氏筛枚举倍数的方式对分子分块  
枚举分母 $a$，再枚举 $a$ 的倍数 $i$ ，那么一个块 $[l,r]=[a\times i,a\times(i+1)-1]$
那么 $\left\lfloor\frac la\right\rfloor=\left\lfloor ra\right\rfloor=i$  
如果 $[l,r]$ 出现过且 $i$ 每出现就是 `No`  
复杂度均摊 $O(mlogm)$  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
int sum[1000005]; // 记录区间数字个数
int cnt[1000005]; // 记录单点数字个数
 
inline void Solve () {
        int n, c; cin >> n >> c; a.clear();
        
        for ( int i = 0; i <= c; i ++ ) sum[i] = cnt[i] = 0;
        for ( int i = 0; i < n; i ++ ) {
                int x; cin >> x;
                sum[x] ++;
                cnt[x] = 1;
        }
        for ( int i = 1; i <= c; i ++ ) sum[i] += sum[i - 1];
 
 
        for ( int i = 1; i <= c; i ++ ) {
                if ( !cnt[i] ) continue;
                for ( int j = 1; j * i <= c; j ++ ) {
                        int L = j * i, R = min(j * i + i - 1, c);
                        if ( sum[R] - sum[L - 1] && !cnt[j] ) {
                                cout << "No" << endl;
                                return ;
                        } 
                }
        }
        cout << "Yes" << endl;
}
```
<hr>


### ICPC吉林站2020G_Matrix

#### 🔗
<a href="https://codeforces.com/gym/102800/attachments"><img src="https://i.loli.net/2021/11/11/vqLZV6SGARBt38T.png"></a>

#### 💡
一个埃氏筛的思想  
从  <img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="\inline 1" />  枚举  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  然后改变  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  的倍数的话  
每个数有多少个因数就会被筛几次  
  
我们设  <img src="https://latex.codecogs.com/svg.image?\inline&space;dv[i]" title="\inline dv[i]" /> 表示  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" /> 的因数个数  
那么一个位置在  <img src="https://latex.codecogs.com/svg.image?\inline&space;(i,j)" title="\inline (i,j)" /> 的元素会被筛  <img src="https://latex.codecogs.com/svg.image?\inline&space;dv[i]\times&space;dv[j]" title="\inline dv[i]\times&space;dv[j]" /> 次  
为了使一个位置的元素筛奇数次，则  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" /> 和  <img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline j" /> 都具有奇数个因数才可以  
性质：具有奇数个因数的数都是完全平方数  
所以我们计算  <img src="https://latex.codecogs.com/svg.image?\inline&space;\left\lfloor\sqrt[]{n}\right\rfloor\times\left\lfloor\sqrt{m}\right\rfloor" title="\inline \left\lfloor\sqrt[]{n}\right\rfloor\times\left\lfloor\sqrt{m}\right\rfloor" /> 即可

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
int main () {
        ios::sync_with_stdio(false);
        int cass; cin >> cass; while ( cass -- ) {
                ll n, m; cin >> n >> m;
                cout << (ll)sqrt(n) * (ll)sqrt(m) << endl;
        }
}
```

<hr>

### LOJ10199_轻拍牛头

#### 🔗
<a href="https://loj.ac/p/10199"><img src="https://i.loli.net/2021/08/17/H6A7etja5nFfP4u.png"></a>

#### 💡
题目任务转化是让求整个数列有多少个数是a[i]的因数  
那么我们可以直接对每个数用埃氏筛的思想把倍数统计一遍  
但是一个个统计会超时，因为如果都是1的话一个个会超大的重复量  
所以我们可以使用一个数组统计一下每个数出现的次数  
只需要把数枚举一遍即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <unordered_map>
#include <iostream>

using namespace std;

const int N = 1e6 + 10;
unordered_map<int, int> mark;
int res[N], n, a[N];

inline void Get () {
        for ( auto i : mark )
                for ( int j = i.first; j < N; j += i.first )
                        res[j] += i.second;
}

int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
#endif
        cin >> n;
        for ( int i = 0; i < n; i ++ ) cin >> a[i], mark[a[i]] ++;
        Get();
        for ( int i = 0; i < n; i ++ ) cout << res[a[i]] - 1 << endl;
}
```

<hr>

## 杜教筛

### ABC239Ex_DiceProduct2

#### 🔗
<a href="https://atcoder.jp/contests/abc239/tasks/abc239_h"><img src="https://img-blog.csdnimg.cn/83741fe4345f46b29a3305a23d5ab1ce.png"></a>

#### 💡

转化成 $dp$ 去考虑  
在 $N$ 下，设 $dp_x$ 表示 $M=x$ 时的期望  
则  
$$dp_x=1+\frac1N\sum\limits_{i=1}^Ndp_{\frac xi}$$  
由于 $i=1$ 时不影响 $x$ ， $1$ 会贯彻从而可以让答案 $\times\frac{N}{N-1}$   
::: tip 例如
$1+\frac12+\frac14+\frac18+\dots=2$  
$1+\frac13+\frac19+\frac1{27}+\dots=3$  
$\dots$
:::  
那么原式为  
$$\begin{aligned}
&\frac N{N-1}(1+\frac1N\sum\limits_{i=2}^Nf_{\left\lfloor\frac xi\right\rfloor})\\
=&\frac{N+\sum\limits_{i=2}^Nf_{\left\lfloor\frac xi\right\rfloor}}{N-1}
\end{aligned}$$  
发现内部有 $\left\lfloor\right\rfloor$ 可以使用杜教筛进行整除分块  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int mod = 1e9 + 7;
inline ll ksm ( ll a, ll b ) { ll res = 1; while ( b ) { if ( b & 1 ) res = res * a % mod; a = a * a % mod; b >>= 1; } return res; }
inline ll inv ( ll x ) { return ksm(x, mod - 2); }

ll N, M, invnsub1;
inline ll g ( ll k, ll x ) { return k / (k / x); }
unordered_map<ll, ll> mp;
inline ll duSieve ( ll x ) {
        if ( mp[x] ) return mp[x];
        ll res = 0;
        for ( int L = 2, R; L <= min(N, x); L = R + 1 ) {
                R = min(N, g(x, L));
                res += duSieve(x / L) * (R - L + 1) % mod;
                res %= mod;
        }
        return mp[x] = (N + res) * invnsub1 % mod;
}

int main () {
        ios::sync_with_stdio(false);

        cin >> N >> M;
        invnsub1 = inv(N - 1);
        cout << duSieve(M) << endl;
}
```

<hr>