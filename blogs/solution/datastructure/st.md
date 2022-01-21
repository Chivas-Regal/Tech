---
title: ST表
---

## 牛客2021多校(5)K_KingOfRange

#### 🔗
https://ac.nowcoder.com/acm/contest/11256/K

#### 💡
求整个数列中，Max - Min > k 的子区间个数
  
我们锁定左端点  
如果能固定到最短的右端点  
那么就可以在这个右端点的基础上向右延伸到右边界n  
即获得 n - r + 1 个满足条件的区间  

那么在端点的移动过程中  
我们可以使用双指针的计数思想   
另外我们还想能O(1)查询到区间的 Max 和 Min  
所以我们可以预处理出区间的 Max 和 Min  
于是用到ST表去处理

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
#define TEST(a) cout << "---------" << a << "---------" << endl

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

const int N = 1e5 + 10;
int n, m;
int st_Max[N << 1][100], st_Min[N << 1][100]; // 开大一点，防止倍增越界
int Log2[N << 1];
inline void Get_Log2 ( ) { // 预处理 log 
        Log2[1] = 0;
        for (ll i = 2; i < N; i ++ ) Log2[i] = Log2[i / 2] + 1;
}
inline void Pre_Max_Min ( ) { // 预处理ST表
        int k = Log2[n];
        for ( int j = 1; j <= k; j ++ ) 
                for ( int i = 1; i + (1 << j) - 1 <= n; i ++ ) 
                        st_Max[i][j] = MAX(st_Max[i][j - 1], st_Max[i + (1 << (j - 1))][j - 1]),
                        st_Min[i][j] = MIN(st_Min[i][j - 1], st_Min[i + (1 << (j - 1))][j - 1]);
}
inline int Query_Max ( int l, int r ) { // ST表查询区间的最大值
        int k = Log2[r - l + 1];
        return MAX(st_Max[l][k], st_Max[r - (1 << k) + 1][k]);
}
inline int Query_Min ( int l, int r ) { // ST表查询区间的最小值
        int k = Log2[r - l + 1];
        return MIN(st_Min[l][k], st_Min[r - (1 << k) + 1][k]);
}
inline ll Solve ( int k ) {
        ll res = 0;
        for ( int l = 1, r = 1; l <= n && r <= n; l ++ ) { // 双指针维护区间
                while ( r <= n && Query_Max(l, r) - Query_Min(l, r) <= k ) r ++; // 移动右端点保证满足条件
                res += (ll)n - r + 1; // r 到 n 的区间都可以
        }
        return res;
}

CHIVAS_{
        Get_Log2();

        n = inputInt(), m = inputInt();
        for ( int i = 1; i <= n; i ++ )  st_Max[i][0] = st_Min[i][0] = inputInt();

        Pre_Max_Min();

        while ( m -- ) {
                outLL(Solve(inputLL())); puts("");
        }
        _REGAL;
}
```

<hr>

## CodeForces1549D_IntegersHaveFriends

#### 🔗
https://codeforces.com/contest/1549/problem/D

#### 💡
在两数可同余的时候  
其差值只要大于1即可  
在三数可同余的时候  
其两个差值的gcd只要大于1即可（第一个差值可以通过向上跳gcd区间达到第二个差值  
  
那么我们构建出一个差分数组，然后求gcd大于1的最长区间即可  
这里使用st表构建区间gcd，然后双指针求区间  

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
#define TEST(a) cout << "---------" << a << "---------" << endl

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

ll a[200010];
ll st[200010][25];
ll n;

inline ll gcd ( ll a, ll b ) {
        return b == 0 ? a : gcd(b, a % b);
}

inline void Build(){ // 构建ST
        ll k = 32 - __builtin_clz(n) - 1;
        for (ll j = 1; j <= k; j ++) {
                for (ll i = 1; i + (1 << j) - 1 <= n; i ++) {
                        st[i][j] = gcd(st[i][j - 1],st[i + (1 << (j - 1))][j - 1]);
                }
        }
}
ll Query(ll l, ll r){ // 查询
        ll k = 32 - __builtin_clz(r - l + 1) - 1;
        return gcd(st[l][k], st[r - (1 << k) + 1][k]);
}

inline void solve ( ) {
        n = inputLL();
        for ( ll i = 0; i < n; i ++ ) {
                a[i] = inputLL();
                if ( i != 0 ) st[i][0] = abs(a[i] - a[i - 1]);
        }
        if ( n == 1) {
                outInt(1); puts("");
                return ;
        }
        n --;
        Build();
        ll res = 0;
        for ( ll l = 1, r = 1; l <= n && r <= n; l ++, r = MAX(r, l) ) {
                while ( r <= n && Query(l, r) > 1 ) r ++; // 维护右区间
                res = MAX(res, r - l);
        }outLL(res + 1); puts("");
}

CHIVAS_{
        int cass;
        for ( cass = inputInt(); cass; cass -- ) {
                solve();
        }
}


```


<hr>

## CodeForces1611F_ATMAndStudents

#### 🔗
<a href="https://codeforces.com/contest/1611/problem/F"><img src="https://i.loli.net/2021/11/26/piPkK8fFsSXBa5C.png"></a>

#### 💡
看到这个题首先会想一段区间会被前缀影响也会被后缀影响，那么我们可以采用区间求解的形式  
  
由于收益的累加是从前往后的，所以我们建立一个前缀和  <img src="https://latex.codecogs.com/svg.image?\inline&space;\{sum\}" title="\inline \{sum\}" />  表示从  <img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="\inline 1" />  到  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />  这一段的总收益为  <img src="https://latex.codecogs.com/svg.image?\inline&space;sum[i]" title="\inline sum[i]" />    
如果我们选  <img src="https://latex.codecogs.com/svg.image?\inline&space;[l,r]" title="\inline [l,r]" />  这一段，因为不看前面的收益了，所以从  <img src="https://latex.codecogs.com/svg.image?\inline&space;l" title="\inline l" />  到  <img src="https://latex.codecogs.com/svg.image?\inline&space;x" title="\inline x" />  的准确收益会是  <img src="https://latex.codecogs.com/svg.image?\inline&space;sum[x]-sum[l-1]" title="\inline sum[x] - sum[l - 1]" />   
而这一段能否被选择的关键在于**这一段准确收益的最小值是否低于<img src="https://latex.codecogs.com/svg.image?\inline&space;s" title="\inline s" />**  
  
好了， <img src="https://latex.codecogs.com/svg.image?\inline&space;\{sum\}" title="\inline \{sum\}" />  的**区间最小值**，可以开一个  <img src="https://latex.codecogs.com/svg.image?\inline&space;ST" title="\inline ST" />  表  


```cpp
for ( int i = 1; i <= n; i ++ ) st[i][0] = sum[i];

inline void Build () {
        int k = 32 - __builtin_clz(n) - 1;
        for ( int j = 1; j <= k; j ++ ) {
                for ( int i = 1; i + (1 << j) - 1 <= n; i ++ ) {
                        st[i][j] = min ( st[i][j - 1], st[i + (1 << (j - 1))][j - 1] );
                }
        }
}
inline ll Query ( int l, int r ) {
        int k = 32 - __builtin_clz(r - l + 1) - 1;
        return min ( st[l][k], st[r - (1 << k) + 1][k] );
}
```

那么如何确定最多能选多长的区间呢？  
由于区间长度的行于不行单调递增  
那么可以采用**二分区间长度**，对每一个二分到的区间长度下的区间最小值（准确收益下的）逐一判断  
如果不可行说明我们这个选的太长了，应该跑小的那一半，否则跑大的那一半  

```cpp
inline bool this_MinInLen ( int len ) {
        for ( int i = 1; i + len - 1 <= n; i ++ ) {
                ll cur = Query ( i, i + len - 1 );
                if ( s + (cur - sum[i - 1]) >= 0 ) { // cur-sum[i-1]：准确收益
                        if ( len > res.second - res.first + 1 ) res = {i, i + len - 1};
                        return true;
                }
        }
        return false;
}


int l = 1, r = n;
while ( l <= r ) {
        int mid = ( l + r ) >> 1;
        if ( this_MinInLen(mid) ) l = mid + 1;
        else                      r = mid - 1;
}
this_MinInLen ( l );
```

时间复杂度： $O(nlogn)$  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 2e5 + 10;
ll a[N], sum[N];
ll st[N][100];
int n;
ll s;
pair<int, int> res;

inline void Build () {
        int k = 32 - __builtin_clz(n) - 1;
        for ( int j = 1; j <= k; j ++ ) {
                for ( int i = 1; i + (1 << j) - 1 <= n; i ++ ) {
                        st[i][j] = min ( st[i][j - 1], st[i + (1 << (j - 1))][j - 1] );
                }
        }
}
inline ll Query ( int l, int r ) {
        int k = 32 - __builtin_clz(r - l + 1) - 1;
        return min ( st[l][k], st[r - (1 << k) + 1][k] );
}
inline bool this_MinInLen ( int len ) {
        for ( int i = 1; i + len - 1 <= n; i ++ ) {
                ll cur = Query ( i, i + len - 1 );
                if ( s + (cur - sum[i - 1]) >= 0 ) {
                        if ( len > res.second - res.first + 1 ) res = {i, i + len - 1};
                        return true;
                }
        }
        return false;
}

inline void Solve () {
        res = {0, -1};

        cin >> n >> s;
        for ( int i = 1; i <= n; i ++ ) {
                cin >> a[i];
                sum[i] = sum[i - 1] + a[i];
                st[i][0] = sum[i];
        }

        Build ();

        int l = 1, r = n;
        while ( l <= r ) {
                int mid = ( l + r ) >> 1;
                if ( this_MinInLen(mid) ) l = mid + 1;
                else                      r = mid - 1;
        }
        this_MinInLen ( l );
        
        if ( res.first <= res.second ) cout << res.first << " " << res.second << endl;
        else                           cout << -1 << endl;
}

int main () {
        ios::sync_with_stdio(false);
        int cass; cin >> cass; while ( cass -- ) {
                Solve ();
        }
}
```

<hr>
