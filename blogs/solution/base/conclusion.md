---
title: 结论
---

###  
<hr>

## 牛客2021多校(1)F_Find3-friendlyIntegers

#### 🔗
https://ac.nowcoder.com/acm/contest/11166/F

#### 💡
这种数字类问题，可以先想利用前缀求区间  
但是这一题发现  
在二位数还勉强可以构造  
在三位数不管如何构造，也构造不出来一个不能"模三"的数  
所以在100以内暴力查询  
100以外就直接计算有多少个数即可

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
/*
           ________   _                                              ________                              _
          /  ______| | |                                            |   __   |                            | |
         /  /        | |                                            |  |__|  |                            | |
         |  |        | |___    _   _   _   ___  _   _____           |     ___|   ______   _____   ___  _  | |
         |  |        |  __ \  |_| | | | | |  _\| | | ____|          |  |\  \    |  __  | |  _  | |  _\| | | |
         |  |        | |  \ |  _  | | | | | | \  | | \___           |  | \  \   | |_/ _| | |_| | | | \  | | |
         \  \______  | |  | | | | \ |_| / | |_/  |  ___/ |          |  |  \  \  |    /_   \__  | | |_/  | | |
Author :  \________| |_|  |_| |_|  \___/  |___/|_| |_____| _________|__|   \__\ |______|     | | |___/|_| |_|
                                                                                         ____| |
                                                                                         \_____/
*/
#include <unordered_map>
#include <algorithm>
#include <iostream>
#include <cstring>
#include <utility>
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <map>
#include <set>

#define G 10.0
#define LNF 1e18
#define EPS 1e-6
#define PI acos(-1.0)
#define INF 0x7FFFFFFF

#define ll long long
#define ull unsigned long long

#define LOWBIT(x) ((x) & (-x))
#define LOWBD(a, x) lower_bound(a.begin(), a.end(), x) - a.begin()
#define UPPBD(a, x) upper_bound(a.begin(), a.end(), x) - a.begin()
#define TEST(a) cout << "---------" << a << "---------" << '\n'

#define CHIVAS_ int main()
#define _REGAL exit(0)

#define SP system("pause")
#define IOS ios::sync_with_stdio(false)
//#define map unordered_map

#define _int(a) int a; cin >> a
#define  _ll(a) ll a; cin >> a
#define _char(a) char a; cin >> a
#define _string(a) string a; cin >> a
#define _vectorInt(a, n) vector<int>a(n); cin >> a
#define _vectorLL(a, b) vector<ll>a(n); cin >> a

#define PB(x) push_back(x)
#define ALL(a) a.begin(),a.end()
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for (cass = inputInt(); cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;

template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? GCD(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}
template<typename T>             vector<T>& operator--            (vector<T> &v){for (auto& i : v) --i;            return  v;}
template<typename T>             vector<T>& operator++            (vector<T> &v){for (auto& i : v) ++i;            return  v;}
template<typename T>             istream& operator>>(istream& is,  vector<T> &v){for (auto& i : v) is >> i;        return is;}
template<typename T>             ostream& operator<<(ostream& os,  vector<T>  v){for (auto& i : v) os << i << ' '; return os;}
inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}


inline bool calc(ll x){
        if(x / 10 == 0){
                if(x % 3 == 0) return true;
                else return false;
        }
        if(x % 3 == 0 || x % 10 % 3 == 0 || x / 10 % 3 == 0) return true;
        return false;
}

CHIVAS_{
        int cass;
        EACH_CASE(cass){
                ll L, R; cin >> L >> R;
                ll res = 0;
                ll i = L;
                for(; i <= MIN(99ll, R); i ++) res += calc(i);//暴力查询
                if(i <= R) res += (R - i + 1);//超100的数
                cout << res << endl;
        }
        _REGAL;
};

```

<hr>

## CodeForces507C_GuessYourWayOut

#### 🔗
<a href="https://codeforces.com/problemset/problem/507/C"><img src="https://i.loli.net/2021/09/08/wWV3gmbDsBKa61d.png"></a>

#### 💡
这道题刚开始可能没有什么思路，在纸上画一下一个比较大的树的遍历顺序并把值写上去  
发现在把叶子分为两部分时，左区间的右端点与右区间的左端点的差值为<img src="https://latex.codecogs.com/svg.image?2^h-1" title="2^h-1" />，再进一步划分就是<img src="https://latex.codecogs.com/svg.image?2^{h-1}-1" title="2^{h-1}-1" />   
每一个区间的左右端点差值也有类似的性质  
一个节点的左儿子的树在中间两个数是递增的，右儿子中间两个数是递减的  
把所有的可以用的性质挖出来之后  
我们发现可以二分查找地推出来我们找的序号的值  
设变量l,r是左右总区间端点序号，l1,r1是左区间的两个端点序号，l2,r2是右区间的两个端点序号  
val_l1,val_r1是左区间的两个端点值，val_l2,val_r2是右区间的两个端点值  
并建立一个VAL_L用来继承上一步求得的val_l1或者val_l2（具体是哪个要根据我们选择的是左区间还是右区间  
推到最后l=r时停止  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <cmath>
#include <algorithm>
#define ll long long

using namespace std;

ll h, n; 

int main () {
#ifndef ONLINE_JUDGE
	freopen("in.in", "r", stdin);
	freopen("out.out", "w", stdout);
#endif

	cin >> h >> n;
	ll l = 1, r = (1ll << h);

	ll l1, r1, l2, r2;
	ll val_l1 = (1ll << h), val_r1, val_l2, val_r2 = (1ll << (h + 1)) - 1;
	ll dep = (1ll << h); // 两端点差值
	ll val_l = (1ll << h);

	bool flag = true; // 选左儿子false, 选右儿子true

	while ( l != r ) {
		// 8个变量的值根据结论进行推
		l1 = l,          r1 = l1 + dep / 2 - 1, 
		l2 = r1 + 1,     r2 = r;
		val_l1 = val_l;           
		val_r1 = val_l1 - dep / 2 + 1;
		if ( flag ) 
			val_l2 = val_r1 + dep - 1; 
		else 
			val_l2 = val_r1 - dep + 1;	
		val_r2 = val_l2 + dep / 2 - 1;

		if ( l1 <= n && n <= r1 ) // 进入左区间
			l = l1, r = r1,
			val_l = val_l1,// 继承左区间的左端点
			flag = false;
		else                      // 进入右区间
			l = l2, r = r2,
			val_l = val_l2,// 继承右区间的左端点
			flag = true;
		dep /= 2;
	}
	cout << val_l - 1 << endl;
}
```

<hr>

## HDU2021多校(5)3_VCisAllYouNeed

#### 🔗
<a href="https://acm.dingbacode.com/showproblem.php?pid=7014"><img src="https://i.loli.net/2021/10/14/TV1fX2RZ6wShgnI.png"></a>

#### 💡
画一个图  
发现基础的二维控制在三个点以内就行  
后面每多一维其实是有给出一个边去分割  
此时也就是点数<=维度+1即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
int main () {
        ios::sync_with_stdio(false);
        int cass;
        for ( cin >> cass; cass; cass -- ) {
                ll n, k; cin >> n >> k;
                if ( n - k < 2 ) cout << "Yes" << endl;
                else cout << "No" << endl;
        }
}
```

<hr>

## HDU2021多校(5)7_BanZhuan

#### 🔗
<a href="https://acm.dingbacode.com/showproblem.php?pid=7018"><img src="https://i.loli.net/2021/10/14/6FSnKb9sGhPZLE5.png"></a>

#### 💡
首先看最大费用  
就是不仅很坦诚地造出来一个n阶方块  
同时还要每个都从最高的位置往下落  
那么就是  
<img src="https://latex.codecogs.com/svg.image?\sum\limits_{x=1}^n\sum\limits_{y=1}^n[xy^2]nn=\frac{(1&plus;n)n}{2}\frac{n(1&plus;n)(1&plus;2n)}{6}nn" title="\sum\limits_{x=1}^n\sum\limits_{y=1}^n[xy^2]nn=\frac{(1+n)n}{2}\frac{n(1+n)(1+2n)}{6}nn" />
  
再看看最小费用  
每一个都是刚好放上去而不让它落下，然后能缺的就缺  
下面的一层正常放  
画一个二阶发现最划算的是在x=1和y=1的两侧构造一面墙  
同时交界处不放方块  
那么就是  
<img src="https://latex.codecogs.com/svg.image?\begin{aligned}\sum\limits_{x=1}^n\sum\limits_{y=1}^n[xy^2]&plus;\sum\limits_{x=2}^n\sum\limits_{z=2}^n[xz]&plus;\sum\limits_{y=2}^n\sum\limits_{z=2}^n[y^2z]=\frac{(1&plus;n)n}{2}\frac{n(1&plus;n)(1&plus;2n)}{6}&plus;\frac{(2&plus;n)(n-1)}{2}\frac{(2&plus;n)(n-1)}{2}&plus;\frac{(2&plus;n)(n-1)}{2}[\frac{n(1&plus;n)(1&plus;2n)}{6}-1]\end{aligned}" title="\begin{aligned}\sum\limits_{x=1}^n\sum\limits_{y=1}^n[xy^2]+\sum\limits_{x=2}^n\sum\limits_{z=2}^n[xz]+\sum\limits_{y=2}^n\sum\limits_{z=2}^n[y^2z]=\frac{(1+n)n}{2}\frac{n(1+n)(1+2n)}{6}+\frac{(2+n)(n-1)}{2}\frac{(2+n)(n-1)}{2}+\frac{(2+n)(n-1)}{2}[\frac{n(1+n)(1+2n)}{6}-1]\end{aligned}" />
  
数很大还要取模，直接开`BigInteger`
#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```java
public class Main {
        static BigInteger m = BigInteger.valueOf(1000000007);
        static BigInteger one = BigInteger.ONE;
        static BigInteger two = BigInteger.valueOf(2);
        static BigInteger zero = BigInteger.ZERO;
        static BigInteger six = BigInteger.valueOf(6);
        static BigInteger ksm ( BigInteger a, BigInteger b ) {
                BigInteger res = BigInteger.ONE;
                while ( b.compareTo(BigInteger.ZERO) == 1 ) {
                        if ( b.mod(two).compareTo(BigInteger.ONE) == 0 ) res = res.multiply(a).mod(m);
                        a = a.multiply(a).mod(m);
                        b = b.divide(two);
                }
                return res;
        }
        public static void main ( String[] args ) {
                boolean flag = true;
                Scanner input = new Scanner(System.in);
                int cass = input.nextInt(); while ( cass -- > 0 ) {
                        BigInteger n = input.nextBigInteger();
                        
                        BigInteger resBig = n.multiply(n).multiply(n).multiply(n);
                        resBig = resBig.multiply(n.add(one)).multiply(n.add(one));
                        resBig = resBig.multiply(n.multiply(two).add(one));
                        resBig = resBig.divide(six).divide(two).mod(m);
                        
                        BigInteger resSml = n.multiply(n);
                        resSml = resSml.multiply(n.add(one)).multiply(n.add(one));
                        resSml = resSml.multiply(n.multiply(two).add(one));
                        resSml = resSml.divide(six).divide(two).mod(m);
                        BigInteger tmp1 = two.add(n).multiply(n.subtract(one)).divide(two);
                        BigInteger tmp2 = n.multiply(n.add(one)).multiply(n.multiply(two).add(one)).divide(six).subtract(one);
                        tmp2 = tmp2.multiply(tmp1);
                        tmp1 = tmp1.multiply(tmp1);
                        resSml = resSml.add(tmp2).add(tmp1).mod(m);

                        System.out.println(resSml);
                        System.out.println(resBig);
                        flag = false;
                }
                input.close();
        }
}
```

<hr>
