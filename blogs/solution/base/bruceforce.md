---
title: 暴力优化
---

###  
<hr>

## 折半枚举

### HDU2141_CanYouFindIt?

#### 🔗
https://acm.dingbacode.com/showproblem.php?pid=2141

#### 💡
题目让找满足 a[i] + b[j] + c[k] = x    
所以我们改一下式子变成：a[i] + b[j] = x - c[k]  
  
即我们对 a[i] + b[j] 打一个ab表  
然后排序后每输入一个x  
就枚举c[i]然后在ab表内二分查找元素是否存在  

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

//#include <unordered_map>
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
#define TEST(a) cout << "---------" << a << "---------" << '<br>'

#define CHIVAS_ int main()
#define _REGAL exit(0)
#define SP system("pause")
#define IOS ios::sync_with_stdio(false)

//#define map unordered_map

#define PB(x) push_back(x)
#define ALL(a) a.begin(),a.end()
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for (cass = inputInt(); cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;

/*
template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? GCD(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal <vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i])MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal <vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i])MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}
template<typename T> vector<T>& operator-- (vector<T> &v){for (auto& i : v) --i; return v;}
template<typename T> vector<T>& operator++ (vector<T> &v){for (auto& i : v) ++i; return v;}
template<typename T> istream& operator>>(istream& is, vector<T> &v){for (auto& i : v) is >> i; return is;}
template<typename T> ostream& operator<<(ostream& os, vector<T> v){for (auto& i : v) os << i << ' '; return os;}
*/inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

const int N = 550;
ll a[N], b[N], c[N];
vector<ll> ab;
ll l, n, m;
ll nQst;
int CasId;

CHIVAS_{
        while ( scanf("%lld%lld%lld", &l, &n, &m) == 3 ) {
                ab.clear();
                for ( int i = 1; i <= l; i ++ ) a[i] = inputLL();
                for ( int i = 1; i <= n; i ++ ) b[i] = inputLL();
                for ( int i = 1; i <= m; i ++ ) c[i] = inputLL();
                for ( int i = 1; i <= l; i ++ ) for ( int j = 1; j <= n; j ++ ) ab.push_back(a[i] + b[j]);
                sort(ALL(ab));
                nQst = inputLL();
                printf("Case %d:\n", ++CasId);
                while ( nQst -- ) {
                        ll x = inputLL();
                        bool flag = false;
                        for ( int i = 1; i <= m; i ++ ) {
                                if ( binary_search(ALL(ab), x - c[i]) ) {
                                        flag = 1;
                                        break;
                                }
                        }
                        if ( flag ) puts("YES");
                        else        puts("NO");
                }
        }
        _REGAL;
};
```





<hr>

### POJ2785_4ValuesWhoseSumIs0

#### 🔗
http://poj.org/problem?id=2785

#### 💡
同样的，我们先枚举a[i] + b[j]并存入一个数列ab中  
然后排序后枚举c[i] + d[j]  
同时在数列ab中二分查找答案，用upper_bound和lower_bound模拟数字哈希过程固定其元素个数即可  

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

//#include <unordered_map>
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
#define TEST(a) cout << "---------" << a << "---------" << '<br>'

#define CHIVAS_ int main()
#define _REGAL exit(0)
#define SP system("pause")
#define IOS ios::sync_with_stdio(false)

//#define map unordered_map

#define PB(x) push_back(x)
#define ALL(a) a.begin(),a.end()
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for (cass = inputInt(); cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;

/*
template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? GCD(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal <vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i])MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal <vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i])MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}
template<typename T> vector<T>& operator-- (vector<T> &v){for (auto& i : v) --i; return v;}
template<typename T> vector<T>& operator++ (vector<T> &v){for (auto& i : v) ++i; return v;}
template<typename T> istream& operator>>(istream& is, vector<T> &v){for (auto& i : v) is >> i; return is;}
template<typename T> ostream& operator<<(ostream& os, vector<T> v){for (auto& i : v) os << i << ' '; return os;}
*/
inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}


const ll N = 4010;
ll a[N], b[N], c[N], d[N];
ll cd[N * N], id;

CHIVAS_{
        ll n = inputLL();
        for ( ll i = 1; i <= n; i ++ ) a[i] = inputLL(), b[i] = inputLL(), c[i] = inputLL(), d[i] = inputLL();
        for ( ll i = 1; i <= n; i ++ ) for ( ll j = 1; j <= n; j ++ ) cd[id ++] = -(a[i] + b[j]);
        ll res = 0;
        sort(cd, cd + id);
        for ( ll i = 1; i <= n; i ++ ) for ( ll j = 1; j <= n; j ++ ) res += ( upper_bound(cd, cd + id, c[i] + d[j]) - cd ) - ( lower_bound(cd, cd + id, c[i] + d[j]) - cd );
        outLL(res);
        _REGAL;
};
```





<hr>

## 对象缩减

### 牛客2021训练联盟(6)I_LetterWheels

#### 🔗
<a href="https://open.kattis.com/problems/letterwheels"><img src="https://i.loli.net/2021/08/20/jz6p7GT9JvOW4lm.png"></a>

#### 💡
首先能想到的最暴力方式：  
固定s1串，然后枚举s2和s3的偏移量  
一个个枚举，看是不是成立，如果成立就维护一下最小值  
时间O(n^3)，妥妥的TLE  
  
那么在偏移量里面  
我们要枚举双重的，不如提前建立好一个字符串偏移一定的值是不是成立  
这样我们枚举一遍偏移量，然后再顺着字符串内部枚举一下在“这个偏移量之下，两个字符串之间能不能成立”  
然后我们在下面维护答案的时候  
枚举两个偏移量，自然就知道第三个偏移量了，就在这个基础上，如果三个字符串之间互相成立，就维护一下最小值  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <string>
#define INF 0x7FFFFFFF

using namespace std;
// 偏移： ->
const int N = 5e3 + 10;
int isSm[3][N]; // 0:对于1,2的偏移   1:对于2,3的偏移   2:对于1,3的偏移  =1:相同 =0:不同
int len, res = INF;
string s1, s2, s3;

int main () {

        cin >> s1 >> s2 >> s3; len = s1.size();
        
        for ( int i = 0; i < len; i ++ ) { // 偏移量
                for ( int j = 0; j < len; j ++ ) { // 一位一位枚举
                        if ( s1[j] == s2[(i + j) % len] ) isSm[0][i] = 1;
                        if ( s2[j] == s3[(i + j) % len] ) isSm[1][i] = 1;
                        if ( s1[j] == s3[(i + j) % len] ) isSm[2][i] = 1;
                }
        }

        for ( int i = 0; i < len; i ++ ) { // 2对于1的偏移量
                for ( int j = 0; j < len; j ++ ) { // 3对于1的偏移量
                        if ( /*1&3*/!isSm[2][j] &&
                             /*2&1*/!isSm[0][i] &&
                             /*3&2*/!isSm[1][( j - i + len) % len] ) {
                                res = min(res, max(i, j));
                                res = min(res, max(len - i, len - j));
                                res = min(res, min(i, len - i) + min(j, len - j));
                        }
                }
        }
        cout << (res == INF ? -1 : res) << endl;
}

```

<hr>

### 牛客练习赛95B_Non-interger Area

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/11185/B"><img src="https://img-blog.csdnimg.cn/7607631fc3fa4bf3a4753e8b69a61bff.png"></a>

#### 💡
矩形的面积肯定是整数，我们可以画一个三角形外接矩形的图  
<img src="https://img-blog.csdnimg.cn/74dcdd77f14746009f523e1ccc566b4e.png">  
如果矩形内部三角形外部的面积总和为整数，那么这个三角形的面积也一定是整数  
  
外面每一个三角形的面积都是 $d*h*\frac 12$ ，那么我们就要考虑奇偶了  
如果三角形有两个点 $P_1,P_2$ 是一样的奇偶性，即 $x_1,x_2$ 同奇偶， $y_1,y_2$ 同奇偶  
那么这三个三角形一定有一个是 偶乘偶除二  
另外两个三角形是从 $P_3$ 发射的，它的 $x,y$ 与另外两个点的相对 $dir_x,dir_y$ 的奇偶性肯定是相同或者相反  
那么另外两个三角形同奇偶，他们加起来也一定是整数  
  
所以我们需要找三个奇偶性互不相同的点  
那么就不需要考虑数值了，考虑奇偶  
这个可以压缩一下对象，奇数为 $1$ 偶数为 $0$ ，那么我们统计一下 $num_{\{0/1\}\{0/1\}}$  
  
答案便是 $num_{1,1} * num_{0,0} * (num_{1,0} + num_{0,1}) + num_{1,0} * num_{0,1} * (num_{1,1} + num_{0,0})$

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
ll num[2][2];

int main () {
        ios::sync_with_stdio(false);

        int n; cin >> n;
        for ( int i = 0; i < n; i ++ ) {
                ll x, y; cin >> x >> y;
                num[x & 1][y & 1] ++;
        }
        cout << num[1][1] * num[0][0] * (num[1][0] + num[0][1]) + num[1][0] * num[0][1] * (num[1][1] + num[0][0]);
}
```

<hr>

### CodeForces1060C_MaximumSubrectangle

#### 🔗
<a href="https://codeforces.com/problemset/problem/1060/C"><img src="https://i.loli.net/2021/09/18/EOi7obhT8U9JwNj.png"></a>

#### 💡
首先分析问题  
任意两个向量维构成的矩阵两两对应 
同时子区间也能完全对应成立  
所以题目就是让求a序列的某个区间和乘上b序列的某个区间和，在不超过x的情况下，两者长度相乘最大  
  
首先区间和可以很快化为前缀和问题O(1)地减出区间和  
然后可以发现，即然我们要求长度满足条件，所以我们要尽可能让ab数组的某个长度的区间和最小  
这样我们才能让满足条件的区间乘起来最大  
而ab的每个区间都能对应起来，所以一个区间长度的最小值就可以代表同长度的区间  
  
处理一下ab每个长度的区间和的最小值  
对象缩减为区间长度  
这道题就变成了一个枚举区间长度来判断是否满足条件的问题了  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <algorithm>
#include <vector>
#include <cstring>
#define ll long long

using namespace std;

const ll N = 2100;
ll n, m;
ll a[N], b[N]; // 化为前缀和数组
ll lena[N], lenb[N];// lena[i]表示a的子串里面长度为i的最小值，lenb同理
ll res;
ll x;

int main () {
#ifndef ONLINE_JUDGE
        freopen("../in.in", "r", stdin);
        freopen("../out.out", "w", stdout);
#endif
        memset(lena, 0x3f3f3f3f, sizeof lena);
        memset(lenb, 0x3f3f3f3f, sizeof lenb);
        cin >> n >> m;
        for ( ll i = 1; i <= n; i ++ )
                cin >> a[i],
                a[i] += a[i - 1];
        for ( ll i = 1; i <= m; i ++ )
                cin >> b[i],
                b[i] += b[i - 1];

        // 预处理这个最小值
        for ( ll len = 1; len <= n; len ++ )
                for ( ll i = len; i <= n; i ++ )
                        lena[len] = min ( lena[len], a[i] - a[i - len] );
        for ( ll len = 1; len <= m; len ++ )
                for ( ll i = len; i <= m; i ++ )
                        lenb[len] = min ( lenb[len], b[i] - b[i - len] );

        // 如果最小值对应相乘小于x，那么就可以取最大值
        cin >> x;
        for ( ll lna = 1; lna <= n; lna ++ )
                for ( ll lnb = 1; lnb <= m; lnb ++ )
                        if ( lena[lna] * lenb[lnb] <= x )
                                res = max ( res, lna * lnb );
        cout << res << endl;
}

```

<hr>

### CodeForces1579F_ArrayStabilization(ANDversion)

#### 🔗
<a href="https://codeforces.com/contest/1579/problem/F"><img src="https://i.loli.net/2021/09/29/NnoeacT3WZUPmtb.png"></a>

#### 💡
首先应该很明显看到的是，每一个1在遇到0后都会变成0  
即一次次滚动，每滚动一次，都有一些1变成0进行下一次滚动  
  
可以想到会有很多0具有一样的作用，所以没必要全部都算，考虑对象缩减  
同层内0碰到0不用管，因为后面那个0足够有代表性：它都碰不到1，前面的那个也没必要继续走它的路；它能碰到的1也已经开始进入下一次滚动了  
之前的0也不用管了，因为它们已经尽力了，每次只考虑他们中新晋的0  
  
那么问题就成为了：  
每次将上一次得到的新0进行滚动  
每产生一个新0，就加入下一次滚动的数组内  
下一次就利用这些新0进行滚动  
  
如果最后没有新得到的0了就开始遍历，如果存在“漏网之1”，那么就输出-1    
否则就输出滚动次数-1（最后一轮没有对碰，所以不算  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <cstring>
#include <map>
#include <cstdio>
#include <queue>
#include <set>
#define ll long long
#define INF 0x3f3f3f3f

using namespace std;

inline void Solve () {
        int n, k; scanf("%d%d", &n, &k); int a[n];
        vector<int> vec;
        for ( int i = 0; i < n; i ++ ) {
                scanf("%d", &a[i]);
                if ( !a[i] ) vec.push_back(i);
        }
        int res = 0;
        while ( vec.size() ) {
                vector<int> cur;
                for ( auto i : vec ) {
                        int nxt = (i + k) % n;
                        if ( a[nxt] ) a[nxt] = 0, cur.push_back(nxt); // 新变成的0
                }       
                vec.clear(); for ( auto i : cur ) vec.push_back(i); // 新晋的0塞入数组
                res ++;
        }
        for ( int i = 0; i < n; i ++ ) if ( a[i] ) { printf("-1\n"); return; }
        printf("%d\n", res - 1 ); // 最后一轮是没有对碰的，所以最后一轮不算
}

int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif 
        int cass;
        for ( scanf("%d", &cass); cass; cass -- ) {
                Solve();
        }
        return 0;
}
```

<hr>


## 区间跳跃

### 洛谷P1050_循环

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1050"><img src="https://user-images.githubusercontent.com/78973908/139773613-536b48d2-1521-4cd1-b536-0976380ac659.png"></a>

#### 💡
暴力地求k位成为循环节非常麻烦  
那么考虑两点：  
1.每次对于一位求得循环节很简单  
2.对于同一个n，k从小到大得到的结果互相有联系  
  
首先第一个考虑：  
在一位的基础上求，这一位每次乘一个数，如果十次之后不成循环就不行了  
然后第二个考虑：  
比如k=3时，循环节长度为len3，k=2，循环节长度为len2  
len3必定是len2的倍数，因为k=3时，为了保证k=2成循环节，那么len3必定是在基于k=2上跳多少次len2  
所以len3是len2的倍数  
而这个倍数就是在只针对第3位时求得的结果  
  
那么对于n就从[1,k]枚举后面的长度  
每次我们可以将当前求得的这个循环节长度作为指数累放到n每次要乘的数上  
这样可以实现直接跳跃过这个区间，从而保证之前算过的位保持循环节  
我们就可以只专心管理当前计算的位  

```
n = 8123, k = 4

8123           1
8123*8123=3129 2
3129*8123=6867 3
6867*8123=0641 4
0641*8123=6843 #
8123^4=0641

8123           1
8123*0641=6843 2
6843*0641=6363 3
6363*0641=8683 4
8683*0641=5803 5
5803*0641=9723 #
0641^5=9201
(注意此时最后一位就是一直不变） 

8123           1
8123*9201=9723 2
9723*9201=1323 3
1323*9201=2923 4
2923*9201=4523 5
4523*9201=6123 #
9201^5=6001
(注意此时最后两位不变）

8123           1
8123*6001=6123 2
6123*6001=4123 3
4123*6001=2123 4
2123*6001=0123 5
0123*6001=8123 #
(最后就是后三位不变了）

res=4*5*5*5=500
```
当然如果在某一位出现-1了那么整个就不行  
就输出-1  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
public class Main {
        public static BigInteger one = BigInteger.ONE;
        public static BigInteger zero = BigInteger.ZERO;
        public static BigInteger two = BigInteger.valueOf(2);
        public static BigInteger ten = BigInteger.TEN;
        public static BigInteger ksm ( BigInteger a, BigInteger b ) {
                BigInteger res = BigInteger.ONE;
                while ( b.compareTo(zero) == 1 ) {
                        if ( b.mod(two).compareTo(one) == 0 ) {
                                res = res.multiply(a);
                        }
                        a = a.multiply(a);
                        b = b.divide(two);
                }
                return res;
        }
        public static BigInteger Solve ( BigInteger n, BigInteger k, BigInteger mul /* 每次乘的数，实现跳步 */ ) { // 针对第k位得到的分解后的循环节长度
                BigInteger mo = ksm(ten, k);
                n = n.mod(mo);
                BigInteger nn = n;
                for ( int i = 1; i <= 100; i ++ ) {
                        n = n.multiply(mul).mod(mo);
                        if ( n.compareTo(nn) == 0 ) return BigInteger.valueOf(i);
                }
                return BigInteger.valueOf(-1);
        }
        public static void main (String[] args) {
                Scanner input = new Scanner(System.in);
                BigInteger n = input.nextBigInteger ();
                BigInteger k = input.nextBigInteger ();
                BigInteger lst = one; // 实时更新每一位得到的结果
                BigInteger res = one; // 总答案
                BigInteger cur = n;   // 每次n要乘的数（区间跳跃
                for ( BigInteger i = one; i.compareTo(k) <= 0; i = i.add(one) ) {
                        cur = ksm(cur, lst).mod(ksm(ten, k));
                        lst = Solve(n, i, cur);
                        if ( i.compareTo(k) == 0 ) {
                                if ( lst.compareTo(zero) < 0 ) System.out.println("-1");
                                else                           System.out.println(lst.multiply(res));
                                return;
                        }
                        if ( lst.compareTo(zero) < 0 ) {
                                System.out.println("-1");
                                return;
                        }
                        res = res.multiply(lst);
                }
                input.close();
        }
}
```

<hr>

### AcWing3639_数组延伸

#### 🔗
https://www.acwing.com/problem/content/description/3639/

#### 💡
暴力优化进行模拟  
我们每次把一个区间压缩为一个块表示一连串相等的数  
这个块由两部分组成，一部分表示这一块都是什么数和这一块有多少个数  
然后我们在累加的时候对每一块的乘积（这一块所有元素的和）进行累加即可  


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
//#define push_back emplace_back

#define _int(a) int a; cin >> a
#define  _ll(a) ll a; cin >> a
#define _char(a) char a; cin >> a
#define _string(a) string a; cin >> a
#define _vectorInt(a, n) vector<int>a(n); cin >> a
#define _vectorLL(a, b) vector<ll>a(n); cin >> a

#define PB(x) push_back(x)
#define ALL(a) a.begin(),a.end()
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for (cin >> cass; cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;

template<typename T> inline void Read(T &x){T f = 1; x = 0;char s = getchar();while(s < '0' || s > '9'){if(s == '-') f = -1; s = getchar();}while('0'<=s&&s<='9'){x=(x<<3)+(x<<1)+(s^48);s=getchar();}x*=f;}
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

#pragma endregion

//全局变量
#pragma region

#pragma endregion

//主体------------------------------------------

inline void solve(){
        int n; scanf("%d", &n);
        int x; scanf("%d", &x);
        vector<int> a;
        for(int i = 0, x; i < n; i ++) scanf("%d", &x), a.push_back(x);
        ll res = 0;
        vector<pair<int, int> > vec;//first表示元素，second表示个数
        for(int i = 0; i < n; i ++) vec.push_back({a[i], 1});//预存：a中的每一个元素都存入1个
        for(int i = 0; i < vec.size(); i ++){
                if(vec[i].first % x == 0) 
                        vec.push_back({vec[i].first / x, vec[i].second * x});//之后这一块的值是当前块的值/x，个数是当前块*x，因为当前块的每一个数都可以分出来x个
                else break;
        }
        for(int i = 0; i < vec.size(); i ++) res += vec[i].first * vec[i].second;//延伸完数组进行累加
        printf("%lld\n", res);
}

CHIVAS_{
        int cass;
        scanf("%d", &cass);
        while(cass --){
                solve();
        }
        _REGAL;
}
```

<hr>

### CodeForces813B_TheGoldenAge

#### 🔗
https://codeforces.com/problemset/problem/813/B

#### 💡
本题让统计连续的unluckyNumber区间长度  
那么可以在整个[l, r]序列中先把luckyNumber抠掉  
然后在两个luckNumber中跳区间  
同时对跳过的区间维护一下区间最长值即可  
PS：要开__int128

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
//#include <unordered_map>
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
#define INT __int128

#define LOWBIT(x) ((x) & (-x))
#define LOWBD(a, x) lower_bound(a.begin(), a.end(), x) - a.begin()
#define UPPBD(a, x) upper_bound(a.begin(), a.end(), x) - a.begin()
#define TEST(a) cout << "---------" << a << "---------" << '<br>'

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
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return make_pair(MaxVal, MaxId);}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return make_pair(MinVal, MinId);}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal < vec[i]) MaxVal = vec[i], MaxId = i; return make_pair(MaxVal, MaxId);}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i]) MinVal = vec[i], MinId = i; return make_pair(MinVal, MinId);}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return make_pair(cnt, div);}

inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

inline INT ksm(INT a, INT b) { // 快速幂
        INT res = 1;
        while ( b ) {
                if ( b & 1 ) res = res * a;
                a = a * a;
                b >>= 1;
        }return res;
}


CHIVAS_{
        ll xx, yy, l_l, r_r;  cin >> xx >> yy >> l_l >> r_r;
        INT x = xx, y = yy, l = l_l, r = r_r;
        vector<INT> vec;
        for ( INT a = 0; ksm(x, a) <= 1e20; a ++ ) {
                for ( INT b = 0; ksm(y, b) + ksm(x, a) <= 1e20; b ++ ) {
                        if ( ksm(x, a) + ksm(y, b) >= l && 
                             ksm(x, a) + ksm(y, b) <= r    ) 
                                vec.push_back(ksm(x, a) + ksm(y, b));  // 将满足条件的插入到表里面
                }
        }
        sort ( ALL(vec) ); 

        if ( vec.size() == 0 ) { // 特判会不会根本没有数插进去
                cout << (ll)(r - l + 1) << endl;
                return 0;
        }
        
        INT res = vec[0] - l; // 初始为左端点到左侧第一个unlucky数
        for ( INT i = 1; i < vec.size(); i ++ ) {
                if ( vec[i] == vec[i - 1] ) continue; // 防止爆负数
                res = MAX( res, vec[i] - vec[i - 1] - 1 );  // 对区间维护最大值
        }
        res = MAX ( res, r - vec.back() ); // 再维护一下右端点到右侧第一个unlucky数
        cout << (ll)res << endl;
        _REGAL;
}
```

<hr>

### CodeForces1511C_YetAnotherCardDeck

#### 🔗
<a href="https://codeforces.com/problemset/problem/1511/C"><img src="https://i.loli.net/2021/10/13/dygXnUF87E2OIWJ.png"></a>

#### 💡
可以看做是一类区间跳跃  
题目说过，数字编号最多到50  
同时因为每次我们都把数值固定位置最前的元素移动到整个数组最前面  
所以我们每次移动的就那最多50个数字  
暴力就行了，一个位置的数字代表整个同数字的元素，每次挑选出那个元素x后，从1到50判断一下哪个的位置小于x，都向后推1即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>

using namespace std;

int n, q;
int id[51];

int main () {

        cin >> n >> q;
        for ( int i = 1, a; i <= n; i ++ ) {
                cin >> a;
                if ( !id[a] ) id[a] = i;
        }
        for ( int i = 1, t; i <= q; i ++ ) {
                cin >> t;
                cout << id[t] << " ";

                for ( int j = 1; j <= 50; j ++ ) if ( id[j] < id[t] ) id[j] ++;
                id[t] = 1;
        }

        return 0;
}



```

<hr>

## 区间打表

### 洛谷P1836_数页码

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1836"><img src="https://img-blog.csdnimg.cn/85c8cd767515436397cb494f1ef7c93b.png"></a>

#### 💡
一类浅显的数位<img src="https://latex.codecogs.com/svg.image?\inline&space;dp" title="\inline a" />问题，可以直接分段打表  
我们设置 <img src="https://latex.codecogs.com/svg.image?\inline&space;s[i]" title="\inline a" /> 表示 <img src="https://latex.codecogs.com/svg.image?\inline&space;[0,10^i)" title="\inline a" /> 所有数的数位和  
直接递推打表就可以造出来  
在推 <img src="https://latex.codecogs.com/svg.image?\inline&space;s[i]" title="\inline s[i]" /> 时，<img src="https://latex.codecogs.com/svg.image?\inline&space;s[i-1]" title="\inline s[i]" /> 会出现 <img src="https://latex.codecogs.com/svg.image?\inline&space;10" title="\inline s[i]" /> 次，而 <img src="https://latex.codecogs.com/svg.image?\inline&space;[0,9]" title="\inline s[i]" /> 会各自出现 <img src="https://latex.codecogs.com/svg.image?\inline&space;10^{i-1}" title="\inline s[i]" /> 次  
所以直接 <img src="https://latex.codecogs.com/svg.image?\inline&space;s[i]=s[i-1]*10&plus;45*10^{(i-1)}" title="\inline s[i]=s[i-1]*10+45*10^(i-1)" />  
  
我们观测一个数 <img src="https://latex.codecogs.com/svg.image?\inline&space;123" title="\inline 123" />   
可以拆成 <img src="https://latex.codecogs.com/svg.image?\inline&space;100&plus;20&plus;3" title="\inline 100+20+3" /> 这样算  
但是要思考好每一位上每个数出现的次数  
如第一位 <img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="\inline" /> ，出现过 <img src="https://latex.codecogs.com/svg.image?\inline&space;24" title="\inline" /> 次  
第二位 <img src="https://latex.codecogs.com/svg.image?\inline&space;2" title="\inline" />，出现过 <img src="https://latex.codecogs.com/svg.image?\inline&space;4" title="\inline" /> 次
第三位 <img src="https://latex.codecogs.com/svg.image?\inline&space;3" title="\inline" />，出现过 <img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="\inline" /> 次
  
输入按字符串 <img src="https://latex.codecogs.com/svg.image?\inline&space;str" title="\inline" /> 处理  
第 <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline" /> 位也就是 <img src="https://latex.codecogs.com/svg.image?\inline&space;str[i]" title="\inline" /> 会出现 <img src="https://latex.codecogs.com/svg.image?\inline&space;stoi(str[i+1,sz-1])+1" title="\inline" /> 次，这便是贡献<img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="\inline" />： <img src="https://latex.codecogs.com/svg.image?\inline&space;str[i]*(stoi(str[i+1,sz-1])+1)" title="\inline" />  
后面的<img src="https://latex.codecogs.com/svg.image?\inline&space;[0,10^{sz-i-1})" title="\inline" />跟着第 <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline" /> 位往上跳 <img src="https://latex.codecogs.com/svg.image?\inline&space;str[i]" title="\inline" /> 次，这便是贡献<img src="https://latex.codecogs.com/svg.image?\inline&space;2" title="\inline" />：<img src="https://latex.codecogs.com/svg.image?\inline&space;str[i]*s[sz-i-1]" title="\inline" />  
<img src="https://latex.codecogs.com/svg.image?\inline&space;str[i]" title="\inline" /> 出现次数算过了，<img src="https://latex.codecogs.com/svg.image?\inline&space;[0,str[i-1]]" title="\inline" /> 出现的次数也要算一下，这便是贡献<img src="https://latex.codecogs.com/svg.image?\inline&space;3" title="\inline" />：<img src="https://latex.codecogs.com/svg.image?\inline&space;\sum\limits_{i=0}^{str[i]-1}*10^{sz-i-1}" title="\inline" />  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#### include <iostream>
#### include <vector>
#### include <map>
#### include <algorithm>

#### define ll long long

using namespace std;

ll s[15];

inline ll ksm ( ll a, ll b ) {
        ll res = 1;
        while ( b ) {
                if ( b & 1 ) res = res * a;
                a = a * a;
                b >>= 1;
        }
        return res;
}

inline ll back_num ( string s, int id ) {
        ll res = 0;
        for ( int i = id + 1; i < s.size(); i ++ ) {
                res = res * 10 + (s[i] - '0');
        }
        return res + 1;
}

int main () {
        s[0] = 0;
        for ( int i = 1; i <= 10; i ++ ) {
                s[i] = s[i - 1] * 10 + 45 * ksm(10, i - 1);
        }

        ll res = 0;
        string str; cin >> str;
        for ( int i = 0; i < str.size(); i ++ ) {
                // 贡献1:str[i] 这个数在后面出现了多少次
                res += (ll)(str[i] - '0') * back_num(str, i);       

                // 贡献2:str[i] 后面的[0, 99...99] 跳了多少次
                res += (ll)(str[i] - '0') * s[str.size() - i - 1];  

                // 贡献3:str[i] 以下的数出现过多少次
                res += max(0, str[i] - '0' - 1) * (str[i] - '0') / 2 * ksm(10, str.size() - i - 1);
        }
        cout << res << endl;
}
```

<hr>

