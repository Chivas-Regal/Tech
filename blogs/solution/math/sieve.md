---
title: 筛法
---
###  
<hr>

## CodeForces1512G_ShortTask

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

## CodeForces1627D_NotAdding

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

## ICPC吉林站2020G_Matrix

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

## LOJ10199_轻拍牛头

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
