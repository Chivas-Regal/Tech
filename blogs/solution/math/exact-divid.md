---
title: 整除相关
---

## 因数、素数

### 洛谷P1128_求正整数

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1128"><img src="https://i.loli.net/2021/11/08/PF7LW5UVTGQxbAC.png"></a>

#### 💡
**唯一分解定理**  
如果  <img src="https://latex.codecogs.com/svg.image?\inline&space;x" title="\inline x" />  可以被质因数分解为  <img src="https://latex.codecogs.com/svg.image?\inline&space;x=p_1^{a_1}\times&space;p_2^{a_2}\times&space;p_3^{a_3}\times&space;...\times&space;p_k^{a_k}" title="\inline x=p_1^{a_1}\times p_2^{a_2}\times p_3^{a_3}\times ...\times p_k^{a_k}" />   
则  <img src="https://latex.codecogs.com/svg.image?\inline&space;x" title="\inline x" />  的因数个数为  <img src="https://latex.codecogs.com/svg.image?\inline&space;(a_1+1)\times&space;(a_2+1)\times&space;(a_3+1)\times&space;...\times&space;(a_k+1)" title="\inline (a_1+1)\times (a_2+1)\times (a_3+1)\times ...\times (a_k+1)" />   

**解题思路**  
这个题很对应这个定理  
~~所以定理应该能很快想到吧（是吧是吧~~ 

现在给出的是因数个数  <img src="https://latex.codecogs.com/svg.image?\inline&space;n" title="\inline n" /> ，那么我们利用公式贪心地反推一下不就好了吗？   
我们第一反应肯定能想到可以对  <img src="https://latex.codecogs.com/svg.image?\inline&space;n" title="\inline n" />  分解质因数  <img src="https://latex.codecogs.com/svg.image?\inline&space;\{a\}" title="\inline \{a\}" />   
那么每一个质因数  <img src="https://latex.codecogs.com/svg.image?\inline&space;a" title="\inline a" />  都可以有一个  <img src="https://latex.codecogs.com/svg.image?\inline&space;ksm(p,a-1)" title="\inline ksm(p,a-1)" />  来构造我们要求的这个数  <img src="https://latex.codecogs.com/svg.image?\inline&space;m" title="\inline m" />    
根据贪心，我们肯定希望越大的质因数  <img src="https://latex.codecogs.com/svg.image?\inline&space;a" title="\inline a" />  去与越小的质数  <img src="https://latex.codecogs.com/svg.image?\inline&space;p" title="\inline p" />  凑数，这样可以使得  <img src="https://latex.codecogs.com/svg.image?\inline&space;m" title="\inline m" />  更小  
这样的基础共识就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;m=p_1^{(a_1-1)}\times&space;p_2^{(a_2-1)}\times&space;p_3^{(a_3-1)}\times...\times&space;p_{sz}^{(a_{sz}-1)}" title="\inline m=p_1^{(a_1-1)}\times p_2^{(a_2-1)}\times p_3^{(a_3-1)}\times...\times p_{sz}^{(a_{sz}-1)}" /> 

而由于大质数的变化性会很大
我们可以考虑合并某两个因数  <img src="https://latex.codecogs.com/svg.image?\inline&space;a_i=a_i\times&space;a_j" title="\inline a_i=a_i\times&space;a_j" />   
例如如果给你  <img src="https://latex.codecogs.com/svg.image?\inline&space;n=16" title="\inline n=16" />   
我们可以分解成  <img src="https://latex.codecogs.com/svg.image?\inline&space;2*2*2*2" title="\inline 2*2*2*2" />  ，此时  <img src="https://latex.codecogs.com/svg.image?\inline&space;m=2^1*3^1*5^1*7^1=210" title="\inline m=2^1*3^1*5^1*7^1=210" />   
而考虑合并一下一个因数给第一个  <img src="https://latex.codecogs.com/svg.image?\inline&space;2" title="\inline 2" /> ，此时  <img src="https://latex.codecogs.com/svg.image?\inline&space;m=2^3*3^1*5^1=120" title="\inline m=2^3*3^1*5^1=120" />   
会变得更小  

所以我们可以枚举我们可不可以在  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  的基础上乘上  <img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline j" />  ，也就是把  <img src="https://latex.codecogs.com/svg.image?\inline&space;a[j]" title="\inline a[j]" />  合并给  <img src="https://latex.codecogs.com/svg.image?\inline&space;a[i]" title="\inline a[i]" />  同时  <img src="https://latex.codecogs.com/svg.image?\inline&space;a[j]" title="\inline a[j]" />  删掉且整体  <img src="https://latex.codecogs.com/svg.image?\inline&space;sz--" title="\inline sz--" />   
看看这样做会不会更小更优
如果更优的话就和合并掉，然后继续进行这套操作  
  
数很大要开高精，这里直接拿  <img src="https://latex.codecogs.com/svg.image?\inline&space;BigInteger" title="\inline BigInteger" />  写了  
（由于计算了一下对  <img src="https://latex.codecogs.com/svg.image?\inline&space;n" title="\inline n" />  分解后本身就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;log" title="\inline log" />  级别的，我们最多合并  <img src="https://latex.codecogs.com/svg.image?\inline&space;\frac{(logn+1)logn}2" title="\inline \frac{(logn + 1)logn}2" />  次，所以时间复杂度最高的为  <img src="https://latex.codecogs.com/svg.image?\inline&space;log(n)^2" title="\inline log(n)^2" /> ，然后  <img src="https://latex.codecogs.com/svg.image?\inline&space;Java" title="\inline Java" />  学的也不好，就啥都开暴力了（逃  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```java
import java.lang.reflect.Array;
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.*;

public class Main {
        static int N = 100010;
        static Vector<BigInteger> prime = new Vector<BigInteger>();
        static Vector<Integer> intprime = new Vector<Integer>();
        static boolean[] notprime = new boolean[N];

        static BigInteger one = BigInteger.ONE;
        static BigInteger two = BigInteger.valueOf(2);
        static BigInteger zero = BigInteger.ZERO;
        static BigInteger ten = BigInteger.TEN;

        public static void Sieve () { // 线性筛
                notprime[0] = notprime[1] = true;
                for ( int i = 2; i < N; i ++ ) {
                        if ( !notprime[i] ) {
                                prime.add(BigInteger.valueOf(i));
                                intprime.add(i);
                        }
                        for ( int j = 0; j < intprime.size() && i * intprime.elementAt(j) < N; j ++ ) {
                                notprime[i * intprime.elementAt(j)] = true;
                                if ( i % intprime.elementAt(j) == 0 ) break;
                        }
                }
        }
        public static BigInteger ksm ( BigInteger a, BigInteger b ) { // 快速幂
                BigInteger res = BigInteger.ONE;
                while ( b.compareTo(zero) == 1 ) {
                        if ( b.mod(two).compareTo(one) == 0 ) res = res.multiply(a);
                        a = a.multiply(a);
                        b = b.divide(two);
                }
                return res;
        }
        public static void main ( String[] args ) {
                Scanner input = new Scanner(System.in);
                Sieve();
                BigInteger n = input.nextBigInteger();

                BigInteger[] dv = new BigInteger[100]; // 对n分解的质因数数组
                int sz = 0; // 数组长度
                for ( int i = 0; i < prime.size() && BigInteger.valueOf(i).multiply(BigInteger.valueOf(i)).compareTo(n) <= 0; i ++ ) {
                        while ( n.mod(prime.elementAt(i)).compareTo(zero) == 0 ) {
                                n = n.divide(prime.elementAt(i));
                                dv[sz ++] = prime.elementAt(i);
                        }
                }
                if ( n.compareTo(one) == 1 ) dv[sz ++] = n;

                for ( int i = 0; i < sz; i ++ ) { // 降序排个序（冒泡儿（逃
                        for ( int j = i + 1; j < sz; j ++ ) {
                                if ( dv[i].compareTo(dv[j]) == -1 ) {
                                        BigInteger tmp = dv[i];
                                        dv[i] = dv[j];
                                        dv[j] = tmp;
                                }
                        }
                }

                boolean flag = true;
                while ( flag ) {
                        flag = false; // false为这一趟没有a[j]可以给a[i]合并
                        BigInteger res = one;
                        for ( int i = 0; i < sz; i ++ ) { // 计算一下本身结果
                                res = res.multiply(ksm(prime.elementAt(i), dv[i].subtract(one)));
                        }
                        for ( int i = 0; i < sz; i ++ ) {
                                for ( int j = i + 1; j < sz; j ++ ) {
                                        dv[i] = dv[i].multiply(dv[j]); // a[j]乘给a[i]
                                        int idx = 0;
                                        BigInteger cur = one; // 计算这次剪掉a[j]后的结果
                                        for ( int k = 0; k < j; k ++ ) cur = cur.multiply(ksm(prime.elementAt(idx ++), dv[k].subtract(one)));
                                        for ( int k = j + 1; k < sz; k ++ ) cur = cur.multiply(ksm(prime.elementAt(idx ++), dv[k].subtract(one)));
                                        if ( cur.compareTo(res) == -1 )  { // 如果结果小于本身的，那就直接跳出循环开始找下一层
                                                flag = true;
                                                sz --; for ( int k = j; k < sz; k ++ ) dv[k] = dv[k + 1]; // 把 dv[j] 删掉 
                                                break;
                                        }
                                        dv[i] = dv[i].divide(dv[j]); // 否则的话就再把a[j]还回去
                                }
                                if ( flag ) {
                                        break;
                                }
                        }
                }

                BigInteger res = one; // 最终结果再算一下（复制粘贴上面的代码
                for ( int i = 0; i < sz; i ++ ) {
                        res = res.multiply(ksm(prime.elementAt(i), dv[i].subtract(one)));
                }
                System.out.println(res);
                input.close();
        }
}
```

<hr>

### 洛谷P1445_樱花

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1445"><img src="https://i.loli.net/2021/11/24/YcGKu7R56ajZpVd.png"></a>

#### 💡
这个柿子比较难看，我们化简一下  
 <img src="https://latex.codecogs.com/svg.image?\inline&space;\begin{aligned}\frac1x+\frac1y&=\frac1{n!}\\yn!+xn!&=xy\\xy-(x+y)n!&=0\\n!^2-(x+y)n!+xy&=n!^2\\(x+n!)(y+n!)&=n!^2\end{aligned}" title="\inline \begin{aligned}\frac1x+\frac1y&=\frac1{n!}\\yn!+xn!&=xy\\xy-(x+y)n!&=0\\n!^2-(x+y)n!+xy&=n!^2\\(x+n!)(y+n!)&=n!^2\end{aligned}" />   
  
令  <img src="https://latex.codecogs.com/svg.image?\inline&space;A=x+n!,\;B=y+n!" title="\inline A=x+n!,\;B=y+n!" />   
则  <img src="https://latex.codecogs.com/svg.image?\inline&space;AB=n!^2" title="\inline AB=n!^2" />   
 <img src="https://latex.codecogs.com/svg.image?\inline&space;A" title="\inline A" />  是整数则  <img src="https://latex.codecogs.com/svg.image?\inline&space;x" title="\inline x" />  也是整数， <img src="https://latex.codecogs.com/svg.image?\inline&space;B" title="\inline B" />  同理  
只要  <img src="https://latex.codecogs.com/svg.image?\inline&space;A" title="\inline A" />  是  <img src="https://latex.codecogs.com/svg.image?\inline&space;n!^2" title="\inline n!^2" />  的因数，那么  <img src="https://latex.codecogs.com/svg.image?\inline&space;B" title="\inline B" />  也会是  <img src="https://latex.codecogs.com/svg.image?\inline&space;n!^2" title="\inline n!^2" />  的因数  
那么这道题就变成了求  <img src="https://latex.codecogs.com/svg.image?\inline&space;n!^2" title="\inline n!^2" />  因数的个数  
  
由唯一分解定理我们知道，若  <img src="https://latex.codecogs.com/svg.image?\inline&space;n=\prod\limits_{p|n}p^a" title="\inline n=\prod\limits_{p|n}p^a" />   
那么  <img src="https://latex.codecogs.com/svg.image?\inline&space;n" title="\inline n" />  的因数个数就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;\prod\limits_{p|a}(a+1)" title="\inline \prod\limits_{p|a}(a+1)" />   
  
由于是求  <img src="https://latex.codecogs.com/svg.image?\inline&space;n!^2" title="\inline n!^2" />  的因数  
我们可以对  <img src="https://latex.codecogs.com/svg.image?\inline&space;1\rightarrow&space;n" title="\inline 1\rightarrow&space;n" />  的每一个数都分解一下质因数  
然后让  <img src="https://latex.codecogs.com/svg.image?\inline&space;a" title="\inline a" />  乘  <img src="https://latex.codecogs.com/svg.image?\inline&space;2" title="\inline 2" />   
再唯一分解定理进行求解即可  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int mod = 1e9 + 7;
const int N = 1e6 + 10;

namespace Number {
        bool not_prime[N];
        vector<ll> prime;
        inline void Sieve () {
                not_prime[0] = not_prime[1] = 1;
                for ( int i = 2; i < N; i ++ ) {
                        if ( !not_prime[i] ) prime.push_back(i);
                        for ( ll j = 0; j < prime.size() && i * prime[j] < N; j ++ ) {
                                not_prime[i * prime[j]] = 1;
                                if ( i % prime[j] == 0 ) break;
                        }
                }
        }
} using namespace Number;



ll mp[N], n;

int main () {
        Sieve (); cin >> n;
        for ( int i = 1; i <= n; i ++ ) {
                int x = i;
                for ( int j = 0; j < prime.size() && prime[j] * prime[j] <= x; j ++ ) {
                        while ( x % prime[j] == 0 ) 
                                mp[prime[j]] += 2, 
                                x /= prime[j];
                }
                if ( x > 1 ) 
                        mp[x] += 2;
        }
        ll res = 1;
        for ( int i = 1; i <= n; i ++ ) res = res * (mp[i] + 1) % mod;
        cout << res << endl;
}
```

<hr>

### CodeForces1445C_Division

#### 🔗
https://codeforces.com/problemset/problem/1445/C

#### 💡
既然a是x的倍数，x就一定可以是a变来的，b不能是x的因数，就转化为了探究a和b关系的一道题。  
b不能是x的因数，则保证了x中不能有b的所有(相同也算)质因数，所以x是由a除掉b的某个质因数的一部分得来的。  
于是我们对b拆解质因数，并在a除这种质因数时判断除到什么程度了a不是b的倍数，最大的就是x  

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

void solve()
{
        ll a = inputLL(), b = inputLL();
        vector<ll> vec; //存放质因数
        if (a < b) {     //特殊情况，不需要分了，已经满足了
                outLL(a), puts("");
                return;
        }
        ll cur_b = b; //替代b
        for (ll i = 2; i * i <= cur_b; i++){
                if (cur_b % i) continue;
                while (cur_b % i == 0) cur_b /= i;
                vec.push_back(i);
        }
        if (cur_b > 1) vec.push_back(cur_b);
        ll ans = 0; //记录结果并维护最大值
        for (ll i = 0; i < (ll)vec.size(); i++){
                ll x = a;
                //若a是b的倍数，a把b的某个质因数除完(非最优)就不是它的倍数了，看看除到第几个就不是了
                while (x % vec[i] == 0 && x % b == 0) x /= vec[i];
                ans = max(ans, x);
        }
        outLL(ans);
}
CHIVAS_{
        int cass;
        EACH_CASE(cass){
                solve();
        }
        _REGAL;
}
                


```

<hr>

### CodeForces1593D2_HalfOfSame

#### 🔗
<a href="https://codeforces.com/contest/1593/problem/D2"><img src="https://i.loli.net/2021/10/14/TKNPUoI84dOLbG7.png"></a>

#### 💡
这道题是让一半的数一样  
那么就在差值上做文章  
  
首先还是个特判，如果已经有一半以上都是一样的话那么就是-1  
然后枚举基点是谁  
对基点以后的数求一下他们与基点的差值  
0特殊记录一下因为这代表与基点相同的点，并塞到一个计数变量cnt内  
  
对每个差值统计一下因数k，因为每个因数都可以让这个差值变成0  
枚举的过程中，如果出现一个因数出现的个数+cnt超过一半了，那么就维护一下答案的最大值  
但要记得也去统计另一个因数dir/k并且满足条件了话就维护  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 300;
int a[N], dir[N];
map<int, int> mp;

inline void Solve() {
        mp.clear();
        int n; cin >> n;
        for ( int i = 0; i < n; i ++ ) cin >> a[i], mp[a[i]] ++;
        for ( int i = 0; i < n; i ++ ) if ( mp[a[i]] >= n / 2 ) { cout << "-1" << endl; return; }
        sort ( a, a + n );
        
        int res = -1;

        for ( int i = 0; i < n / 2 + 1; i ++ ) {
                int samecnt = 0; mp.clear();
                for ( int j = i; j < n; j ++ ) {
                        samecnt += a[j] == a[i];
                        dir[j] = a[j] - a[i];
                }
                for ( int j = i; j < n; j ++ ) {
                        if ( dir[j] == 0 ) continue;
                        for ( int k = 1; k * k <= dir[j]; k ++ ) {
                                if ( dir[j] % k == 0 ) {
                                        mp[k] ++;
                                        if ( mp[k] + samecnt >= n / 2 ) res = max ( res, k );
                                        if ( k * k != dir[j] ) {
                                                mp[dir[j] / k] ++;
                                                if ( mp[dir[j] / k] + samecnt >= n / 2 ) res = max ( res, dir[j] / k );
                                        } 
                                }
                        }
                }
        }        
        cout << res << endl;
}

int main () {
        ios::sync_with_stdio(false);
        ll cass; cin >> cass; while ( cass -- ) {
                Solve();
        }
}
```

<hr>

### HDU2021多校(6)1_YesPrimeMinister

#### 🔗
<a href="https://acm.dingbacode.com/showproblem.php?pid=7025"><img src="https://i.loli.net/2021/10/14/xdH39a52foTyMbl.png"></a>

#### 💡
首先分析一下等差数列求和公式：<img src="https://latex.codecogs.com/svg.image?\frac{(l&plus;r)*(r-l&plus;1)}{2}" title="\frac{(l+r)*(r-l+1)}{2}" />  
如果正数超过两项，则必然会产生一个因数，所以只有正数三项不行  
  
**先考虑一项：**  
1.就是n是质数的情况，就输出1    
**然后考虑两项：**  
2.首先是只有两个数，即(n-1)+n和(n+1)+n有一个是质数，就可以输出2  
3.然后是正数部分多出来两个数，就是从i=n+1开始往后找，如果i+(i+1)是质数，就需要i*2+1长度的数列  
  
**然后考虑暴力数列和为一项：**  
4.可以预处理出来素数表后，找出第一个比n大的质数p，这个答案是p*2  
  
在非1、2情况下拿3和4出的答案进行比较，输出较小的那个  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
namespace primeNumber {
        const int N = 5e7 + 10;
        vector<int> prime;
        bool notprime[N];
        inline void Sieve () {
                notprime[0] = notprime[1] = 1; 
                for ( int i = 2; i < N; i ++ ) {
                        if ( !notprime[i] ) prime.push_back(i);
                        for ( int j = 0; j < prime.size() && i * prime[j] < N; j ++ ) {
                                notprime[i * prime[j]] = 1;
                                if ( i % prime[j] == 0 ) break;
                        }
                }
        }
} using namespace primeNumber;

inline void Solve () {
        int n; cin >> n;
        if ( n > 0 && notprime[n] == 0 ) { cout << 1 << endl; return; } 
        if ( n > 0 && (notprime[n + n + 1] == 0 || notprime[n + n - 1] == 0) ) { cout << 2 << endl; return; }

        int res = prime[upper_bound(prime.begin(), prime.end(), abs(n)) - prime.begin()] * 2;
        for ( int i = abs(n) + 1; i * 2 + 1 < N; i ++ ) {
                if ( notprime[i * 2 + 1] == 0 ) { cout << min(res, i * 2 + 1) << endl; return;}
        }
        cout << res << endl;
}

int main () {
        ios::sync_with_stdio(false);
        Sieve();
        int cass; cin >> cass; while ( cass -- ) {
                Solve();
        }
}
```

<hr>

## 欧拉函数

### 洛谷P2158_仪仗队

#### 🔗
https://www.luogu.com.cn/problem/P2158

#### 💡
每个能被看到的点的gcd(x, y) = 1  
  
将正方形分成两个三角形  
对于每个三角形  
寻找互质数即可  
所以   
<img src="https://latex.codecogs.com/svg.image?res=\sum\limits_1^{n-1}phi(i)\quad*2&plus;1" title="res=\sum\limits_1^{n-1}phi(i)\quad*2+1" />

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  
  

```cpp
#pragma region
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
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <utility>
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

#define CHIVAS int main()
#define _REGAL exit(0)

#define SP system("pause")
#define IOS ios::sync_with_stdio(false)
#define map unordered_map

#define PB(x) push_back(x)
#define ALL(a) ((a).begin(),(a).end())
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for (cin >> cass; cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;

template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? gcd(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}

#pragma endregion

//全局变量
#pragma region
const int maxn = 40010;
bool isprime[maxn];
int prime[maxn];
int phi[maxn];
int cnt = 0;
#pragma endregion

//主体------------------------------------------

inline void GET_PHI(){
    phi[1] = 1;
    for(int i = 2; i <= maxn; i ++){
        if(!isprime[i]) prime[++cnt] = i, phi[i] = i - 1;
        for(int j = 1; j <= cnt && i * prime[j] <= maxn; j ++){
            isprime[i * prime[j]] = true;
            if(i % prime[j] == 0){
                phi[i * prime[j]] = phi[i] * prime[j];
                break;
            }else phi[i * prime[j]] = phi[i] * (prime[j] - 1);
        }
    }
}

CHIVAS{
    GET_PHI();
    int n; cin >> n;
    int res = 0;
    for(int i = 1; i < n; i ++) res += phi[i];
    cout << (n == 1? 0 : (res << 1 | 1)) << endl;
    _REGAL;
}
```

<hr>

### 洛谷P2398_GCDSUM

#### 🔗
<a href="https://www.luogu.com.cn/problem/P2398"><img src="https://img-blog.csdnimg.cn/c778e79a96624c4b89b12b9fbb8aff14.png"></a>

#### 💡
<img src="https://latex.codecogs.com/svg.image?\begin{aligned}&\sum\limits_{i=1}^n\sum\limits_{j=1}^ngcd(i,j)\\=&\sum\limits_{k=1}^nk\sum\limits_{i=1}^{n}\sum\limits_{j=1}^{n}[gcd(i,j)=k]\\=&\sum\limits_{k=1}^nk\sum\limits_{i=1}^{\left\lfloor\frac&space;nk\right\rfloor}\sum\limits_{j=1}^{\left\lfloor\frac&space;nk\right\rfloor}[gcd(i,j)=1]\end{aligned}" title="\begin{aligned}&\sum\limits_{i=1}^n\sum\limits_{j=1}^ngcd(i,j)\\=&\sum\limits_{k=1}^nk\sum\limits_{i=1}^{n}\sum\limits_{j=1}^{n}[gcd(i,j)=k]\\=&\sum\limits_{k=1}^nk\sum\limits_{i=1}^{\left\lfloor\frac nk\right\rfloor}\sum\limits_{j=1}^{\left\lfloor\frac nk\right\rfloor}[gcd(i,j)=1]\end{aligned}" />  

在转化完之后变成了在 n / k 内求两个数互质的个数   
那么可以利用欧拉函数，不重复地计算任选两个数互质的个数，即1~n/k的phi和  
由于每个数的区间都一样所以会重复，就是将当前答案*2，减去重复的(1,1)    
对每一个结果乘k累加    
  
当然每次求1~n/k的phi和都可以预先前缀和处理一下  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
namespace Number {
        const ll N = 2e6 + 10;
        bool notprime[N];
        ll phi[N];
        vector<ll> prime;
        ll sum[N];

        inline void Sieve () {
                notprime[1] = notprime[0] = phi[1] = 1;
                for ( ll i = 2; i < N; i ++ ) {
                        if ( !notprime[i] ) 
                                prime.push_back(i),
                                phi[i] = i - 1;
                        for ( ll j = 0; j < prime.size() && i * prime[j] < N; j ++ ) {
                                notprime[i * prime[j]] = 1;
                                if ( i % prime[j] == 0 ) { phi[i * prime[j]] = phi[i] * prime[j]; break; }
                                else                     phi[i * prime[j]] = phi[i] * (prime[j] - 1);
                        }
                }
                for ( ll i = 1; i < N; i ++ ) sum[i] = sum[i - 1] + phi[i];
        }
} using namespace Number;

int main () {
        ios::sync_with_stdio(false); Sieve ();
        ll n; cin >> n;
        ll res = 0;
        for ( ll k = 1; k <= n; k ++ ) {
                res += k * (sum[n / k] * 2 - 1);
        }
        cout << res << endl;
}
```

<hr>

### HDUOJ2588_GCD

#### 🔗
https://acm.dingbacode.com/showproblem.php?pid=2588

#### 💡
我们可以转化一下, <img src="https://latex.codecogs.com/svg.image?gcd(i,n)=a\Longrightarrow&space;gcd(\frac&space;ia,\frac&space;na)=1" title="gcd(i,n)=a\Longrightarrow gcd(\frac ia,\frac na)=1" />  
我们枚举的是 n 的大于等于 m 的因子(a)  
此时在这个位置上个数就是<img src="https://latex.codecogs.com/svg.image?\phi(\frac&space;na)" title="\phi(\frac na)" />  
由于因数都是成对出现的，所以我们只需遍历一边因子，即从 1 到 <img src="https://latex.codecogs.com/svg.image?\sqrt{n}" title="\sqrt{n}" /> 即可

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

inline ll phi(ll x){ // 数比较大，直接求
        ll res = x;
        for(ll i = 2; i * i <= x; i ++){
                if(x % i == 0) res -= res / i;
                while(x % i == 0) x /= i;
        }
        if(x > 1) res -= res / x;
        return res;
}

CHIVAS_{
        int cass;
        EACH_CASE(cass){
                ll n = inputLL(), m = inputLL();
                ll res = 0;
                for(ll i = 1; i * i <= n; i ++){
                        if(n % i) continue;
                        if(i >= m) res += phi(n / i); // 枚举大于m的n的倍数
                        if(n / i >= m && i * i != n) res += phi(i); // 枚举大于m的n的倍数
                }
                outLL(res); puts("");
        }
        _REGAL;
};
```

<hr>

### POJ1284_PrimitiveRoots

#### 🔗
http://poj.org/problem?id=1284

#### 💡
原根的一个知识点  
每个数x的原根个数为phi[phi[x]]  

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
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <utility>
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

#define CHIVAS int main()
#define _REGAL exit(0)

#define SP system("pause")
#define IOS ios::sync_with_stdio(false)
#define map unordered_map

#define PB(x) push_back(x)
#define ALL(a) ((a).begin(),(a).end())
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for (cin >> cass; cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;

template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? gcd(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}

#pragma endregion

//全局变量
#pragma region
const int maxn = 70000;
int cnt = 0;
int phi[maxn];
int prime[maxn];
int isprime[maxn];

#pragma endregion

//主体------------------------------------------

inline void GET_PHI(){
    phi[1] = 1;
    for(int i = 2; i <= maxn; i ++){
        if(!isprime[i]) prime[++cnt] = i, phi[i] = i - 1;
        for(int j = 1; j <= cnt && i * prime[j] <= maxn; j ++){
            isprime[i * prime[j]] = 1;
            if(i % prime[j] == 0){
                phi[i * prime[j]] = phi[i] * prime[j];
                break;
            }else phi[i * prime[j]] = phi[i] * (prime[j] - 1);
        }
    }
}

CHIVAS{
    ll n;
    GET_PHI();
    while(cin >> n) cout << phi[phi[n]] << endl;
    _REGAL;
}
```

<hr>

### POJ2407_Relatives

#### 🔗
http://poj.org/problem?id=2407

#### 💡
欧拉函数的模板  
只需要求欧拉值即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  
  

```cpp
#pragma region
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
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <utility>
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

#define CHIVAS int main()
#define _REGAL exit(0)

#define SP system("pause")
#define IOS ios::sync_with_stdio(false)
#define map unordered_map

#define PB(x) push_back(x)
#define ALL(a) ((a).begin(),(a).end())
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for (cin >> cass; cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;

template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? gcd(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}

#pragma endregion

//全局变量
#pragma region

#pragma endregion

//主体------------------------------------------

inline int PHI(ll n){
    ll res = n;
    for(ll i = 2; i * i <= n; i ++){
        if(n % i == 0){
            res = res * (i - 1) / i;
            while(n % i ==0 ) n /= i;
        }
    }
    if(n > 1) res = res * (n - 1) / n;
    return res;
}

CHIVAS{
    ll n;
    while(cin >> n, n) cout << PHI(n) << endl;
    _REGAL;
}
```

<hr>

### POJ2478_FareySequence

#### 🔗
http://poj.org/problem?id=2478

#### 💡
每个数以自己为分母时可以有phi[x]个数互质成立  
所以求2 ~ n的phi和即可  

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
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <utility>
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

#define CHIVAS int main()
#define _REGAL exit(0)

#define SP system("pause")
#define IOS ios::sync_with_stdio(false)
#define map unordered_map

#define PB(x) push_back(x)
#define ALL(a) ((a).begin(),(a).end())
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for (cin >> cass; cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;

template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? gcd(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}

#pragma endregion

//全局变量
#pragma region
const int maxn = 1e6 + 10;
ll phi[maxn];
ll isprime[maxn];
ll prime[maxn];
ll cnt = 0;
#pragma endregion

//主体------------------------------------------

inline void GET_PHI(){
    phi[1] = 1;
    for(ll i = 2; i <= maxn; i ++){
        if(!isprime[i]) prime[++cnt] = i, phi[i] = i - 1;
        for(ll j = 1; j <= cnt && i * prime[j] <= maxn; j ++){
            isprime[i * prime[j]] = 1;
            if(i % prime[j] == 0){
                phi[i * prime[j]] = phi[i] * prime[j];
                break;
            }else phi[i * prime[j]] = phi[i] * (prime[j] - 1);
        }
    }
}

CHIVAS{
    GET_PHI();
    ll n;
    while(cin >> n, n){
        ll res = 0;
        for(int i = 2; i <= n; i ++) res += phi[i];
        cout << res << endl;
    }
    _REGAL;
}
```

<hr>

### POJ2773_Happy2006

#### 🔗
http://poj.org/problem?id=2773

#### 💡
需要了解到的一个性质：  
gcd(a, b) = gcd(a + b * T, b) = gcd(a, b + a * T)  
其中T为周期，  
利用周期的性质，  
我们可以很轻松地把k排除n以内的数  
并在计数时从n * T + 1开始计算  
  
虽然是暴力，但是优化了时间  
 
#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  
  

```cpp
#pragma region
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
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <utility>
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

#define CHIVAS int main()
#define _REGAL exit(0)

#define SP system("pause")
#define IOS ios::sync_with_stdio(false)
#define map unordered_map

#define PB(x) push_back(x)
#define ALL(a) ((a).begin(),(a).end())
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for (cin >> cass; cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;

template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? gcd(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}

#pragma endregion

//全局变量
#pragma region
const int maxn = 1e6 + 10;
ll phi[maxn];
ll isprime[maxn];
ll prime[maxn];
ll cnt = 0;
#pragma endregion

//主体------------------------------------------

inline void GET_PHI(){
    phi[1] = 1;
    for(ll i = 2; i <= maxn; i ++){
        if(!isprime[i]) prime[++cnt] = i, phi[i] = i - 1;
        for(ll j = 1; j <= cnt && i * prime[j] <= maxn; j ++){
            isprime[i * prime[j]] = 1;
            if(i % prime[j] == 0){
                phi[i * prime[j]] = phi[i] * prime[j];
                break;
            }else phi[i * prime[j]] = phi[i] * (prime[j] - 1);
        }
    }
}

CHIVAS{GET_PHI();
    ll n, k;
    while(cin >> n >> k){
        ll T = k / phi[n];//周期数
        k %= phi[n];//这T个周期以外还有多少个，优化时间的精髓
        if(k == 0) T --, k = phi[n];//能整除要抠出来一组T
        for(ll i = n * T + 1; ; i ++){
            if(GCD(i, n) == 1) k --;
            if(k == 0){
                cout << i << endl;
                break;
            }
        }
    }
    _REGAL;
}
```

<hr>

### POJ3090_VisibleLatticePoints

#### 🔗
http://poj.org/problem?id=3090

#### 💡
就是入门题那个仪仗队  
只不过这里n++而已  

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
#include <string>
#include <vector>
#include <cstdio>
#include <stack>
#include <queue>
#include <cmath>
#include <utility>
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

#define CHIVAS int main()
#define _REGAL exit(0)

#define SP system("pause")
#define IOS ios::sync_with_stdio(false)
#define map unordered_map

#define PB(x) push_back(x)
#define ALL(a) ((a).begin(),(a).end())
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for (cin >> cass; cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;

template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? gcd(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}

#pragma endregion

//全局变量
#pragma region
const int maxn = 1e3 + 10;
ll phi[maxn];
ll isprime[maxn];
ll prime[maxn];
ll cnt = 0;
int cas_id = 0;
#pragma endregion

//主体------------------------------------------

inline void GET_PHI(){
    phi[1] = 1;
    for(ll i = 2; i <= maxn; i ++){
        if(!isprime[i]) prime[++cnt] = i, phi[i] = i - 1;
        for(ll j = 1; j <= cnt && i * prime[j] <= maxn; j ++){
            isprime[i * prime[j]] = 1;
            if(i % prime[j] == 0){
                phi[i * prime[j]] = phi[i] * prime[j];
                break;
            }else phi[i * prime[j]] = phi[i] * (prime[j] - 1);
        }
    }
}

inline void solve(){
    ll n, res = 0; cin >> n; n ++;
    for(int i = 1; i < n; i ++) res += phi[i];
    res = (res << 1 | 1);
    cout << ++cas_id << " " << n - 1 << " " << res << endl;
}

CHIVAS{
    GET_PHI();
    int cass;
    EACH_CASE(cass){
        solve();
    }
    _REGAL;
}

```

<hr>

### Question_phi

#### 🔗
<h3>❓：给出若干个正整数<img src="https://latex.codecogs.com/svg.image?n" title="n" />，请你求出最小的<img src="https://latex.codecogs.com/svg.image?m" title="m" />，使得<img src="https://latex.codecogs.com/svg.image?\phi(m)\ge&space;n" title="\phi(m)\ge n" />。<h3>

#### 💡
首先要很容易想到一个性质：x为素数时，<img src="https://latex.codecogs.com/svg.image?\phi(x)=x-1" title="\phi(x)=x-1" />    
而n后面的第一个素数肯定能满足<img src="https://latex.codecogs.com/svg.image?\phi\ge&space;n" title="\phi\ge n" />    
根据素数分布规则来看，我们完全可以从<img src="https://latex.codecogs.com/svg.image?n" title="n" />向后找，从 n 到 大于n的第一个素数 这个范围内会有满足条件的数  
且时间复杂度能过去  

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

const int N = 1e6 + 10;
int phi[N], isprime[N];
vector<int> prime;

inline void GET_PHI(){
        isprime[0] = isprime[1] = 1, phi[1] = 1;
        for(int i = 2; i < N; i ++){
                if(!isprime[i]) prime.push_back(i), phi[i] = i - 1;
                for(int j = 0; j < prime.size() && i * prime[j] < N; j ++){
                        isprime[i * prime[j]] = 1;
                        if(i % prime[j] == 0){
                                phi[i * prime[j]] = phi[i] * prime[j];
                                break;
                        }else   phi[i * prime[j]] = phi[i] * (prime[j] - 1);
                }
        }
}

CHIVAS_{GET_PHI();
        int cass;
        EACH_CASE(cass){
                int n = inputInt();
                for(int i = n; ; i ++){
                        if(phi[i] >= n){
                                outInt(i); puts("");
                                break;
                        }
                }
        }
}
```

<hr>

### README

<h1 align="center">📕【模板】欧拉函数</h1>

#### 🔗
https://acm.dingbacode.com/contests/contest_showproblem.php?pid=1007&cid=1019

#### 💡
[学习传送门](https://chivas-regal.github.io/%E6%95%B0%E5%AD%A6/2021/07/16/%E6%AC%A7%E6%8B%89%E5%87%BD%E6%95%B0%E5%92%8C%E6%AC%A7%E6%8B%89%E5%AE%9A%E7%90%86.html)

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

const int N  = 32770;
ll phi[N];
vector<ll> prime;
ll isprime[N];

inline void GET_PHI(){//欧拉筛打表
        phi[1] = 1; isprime[1] = isprime[0] = 1;
        for(ll i = 2; i < N; i ++){
                if(!isprime[i]) prime.push_back(i), phi[i] = i - 1;
                for(ll j = 0; j < prime.size() && i * prime[j] < N; j ++){
                        isprime[i * prime[j]] = 1;
                        if(i % prime[j] == 0) { phi[i * prime[j]] = phi[i] * prime[j]; break; } //定理：对于i % j == 0，有phi[i * j] = phi[i] * j
                        phi[i * prime[j]] = phi[i] * (prime[j] - 1); //积性函数性质：如果gcd(i, j) == 1, phi[i * j] = phi[i] * phi[j]。在这里j为质数，所以有phi[i] * phi[j] = phi[i] * (j - 1)
                }
        }
}

inline void solve(){
        ll n = inputInt();
        outLL(phi[n]); puts("");
}
CHIVAS_{GET_PHI();
        int cass;
        EACH_CASE(cass){
                solve();
        }
        _REGAL;
}

```

<hr>

## 欧拉降幂

### HDUOJ5728_PowMod

#### 🔗
https://acm.dingbacode.com/showproblem.php?pid=5728

#### 💡
问题可拆解成两个子问题（子过程）  
<ol>
  <li>
    <b>解K</b><br>
    由于 n 无平方因子，所以 n 唯一分解成几个质因子之后，每个质因子 p 都与别的互质<br><br>
    即：<br><img src="https://latex.codecogs.com/svg.image?\phi(p*\frac&space;np)=\phi(p)*\phi(\frac&space;np)" title="\phi(p*\frac np)=\phi(p)*\phi(\frac np)" /><br><br>
    设<br><img src="https://latex.codecogs.com/svg.image?\sum\limits_{n=1}^m\phi(i,n)=f(n,m)" title="\sum\limits_{n=1}^m\phi(i,n)=f(n,m)" /><br><br>
    <img src="https://latex.codecogs.com/svg.image?\sum\limits_{n=1}^m\phi(i,n)=\phi(p)\sum\limits_{i=1}^m\phi(i,\frac&space;np)&plus;\sum\limits_{i=1}^{\frac&space;mp}\phi(i,n)" title="\sum\limits_{n=1}^m\phi(i,n)=\phi(p)\sum\limits_{i=1}^m\phi(i,\frac np)+\sum\limits_{i=1}^{\frac mp}\phi(i,n)" /><img src="https://latex.codecogs.com/svg.image?\Rightarrow&space;f(n,m)=\phi(p)*f(\frac&space;np,&space;m)&plus;f(n,&space;\frac&space;mp)" title="\Rightarrow f(n,m)=\phi(p)*f(\frac np, m)+f(n, \frac mp)" /><br>
  </li>
  <li>
    <b>递归降幂</b><br>
    用<br><img src="https://latex.codecogs.com/svg.image?a^b=a^{b%\phi(n)&plus;\phi(n)}(mod\quad&space;n)" title="a^b=a^{b%\phi(n)+\phi(n)}(mod\quad n)" />递归一层层降幂<br>
    递归出口是 phi = 1 <br>
  </li>
</ol>

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

const int N = 1e7 + 10, mod = 1e9 + 7;
int phi[N], isprime[N];
int sum[N];
vector<int> prime;

inline void GET_PHI () {
        isprime[0] = isprime[1] = 1, phi[1] = 1;
        for ( int i = 2; i < N; i ++ ) {
                if ( !isprime[i] ) prime.push_back(i), phi[i] = i - 1;
                for ( int j = 0; j < prime.size() && i * prime[j] < N; j ++ ) {
                        isprime[i * prime[j]] = 1;
                        if ( i % prime[j] == 0 ) {
                                phi[i * prime[j]] = phi[i] * prime[j];
                                break;
                        }else   phi[i * prime[j]] = phi[i] * (prime[j] - 1);
                }
        }
        for ( int i = 1; i < N; i ++ ) sum[i] = (sum[i - 1] + phi[i]) % mod;
}

inline ll GET_K ( int n, int m ) { //解K
        //把f ( n, m )换回累加phi的形式，会得到三个特判，也能成为递归出口
        if ( m < 1 ) return 0;
        if ( m == 1 ) return phi[n];
        if ( n == 1 ) return sum[m];

        if ( phi[n] == n - 1 ) return (GET_K(1, m) * phi[n] % mod + GET_K(n, m / n)) % mod; // 质数，没必要查因子了
        for ( int i = 2; i * i <= n; i ++ ){ // 质因子拆解
                if ( n % i ) continue;
                return (phi[i] * GET_K(n / i, m) % mod + GET_K(n, m / i)) % mod;
        }
}

inline ll ksm ( ll a, ll b, ll mod ) {
        ll res = 1;
        while ( b ) {
                if ( b & 1 ) res = res * a % mod;
                a = a * a % mod;
                b >>= 1;
        }return res;
}

inline ll get(ll k, ll p){ // 递归降层幂
        if ( p == 2 ) return k & 1;
        return ksm ( k, get ( k, phi[p] ) + phi[p], p );
}

CHIVAS_{GET_PHI();
        int n, m, p;
        while ( scanf ( "%d%d%d", &n, &m, &p ) == 3 ) {
                ll k = GET_K ( n, m );
                outLL ( get ( k, p ) ); puts("");
        }
        _REGAL;
};



```

<hr>

### README

#### 🔗
https://www.luogu.com.cn/problem/P5091

#### 💡
[学习传送门](https://chivas-regal.github.io/%E6%95%B0%E5%AD%A6/2021/07/16/%E6%AC%A7%E6%8B%89%E5%87%BD%E6%95%B0%E5%92%8C%E6%AC%A7%E6%8B%89%E5%AE%9A%E7%90%86.html)

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

ll a, m;
string s;
ll b = 0;
//  a^{s} (mod m) <=> a^{b} (mod m)

inline ll phi(ll x){
        ll xx = x;
        ll res = x;
        for(ll i = 2; i * i <= xx; i ++){
                if(x % i == 0){
                        res -= res / i;
                        while(x % i == 0) x /= i;
                }
        }
        if(x != 1) res -= res / x;
        return res;
}

inline ll ksm(){
        ll res = 1;
        while(b){
                if(b & 1) res = res * a % m;
                a = a * a % m;
                b >>= 1;
        }return res;
}

CHIVAS_{
        cin >> a >> m >> s;
        ll phi_m = phi(m), flag = 0;
        for(ll i = 0; i < s.size(); i ++){
                b = b * 10 + s[i] - '0';
                if(b > phi_m) flag = 1, b %= phi_m; // 一边转一边判断有没有 phi(m) 大
        }
        b += (flag && GCD(a, m) != 1) * phi_m; // 三个情况全满足了，nice
        cout << ksm();
        _REGAL;
};





```

<hr>