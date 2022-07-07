---
title: 双指针
---
###  
<hr>

## 牛客2021多校(1)D_DeterminethePhotoPosition

#### 🔗
https://ac.nowcoder.com/acm/contest/11166/D

#### 💡
在每一行内求连续的0的长度，用来塞下几个老师
所以很明显可以用双指针写  
cnt0 - m + 1就是这一段0内放下老师的方案数  
（如果想要在最后一个数计算方便的话可以在每个字符串最后插入一个'1')

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

string Map[2100];

CHIVAS_{
        int n, m; cin >> n >> m;
        for(int i = 0; i < n; i ++){
                cin >> Map[i];
                Map[i] += "1";//插入
        }
        string s; cin >> s;
        int res = 0;
        for(int i = 0; i < n; i ++){
                int cnt = 0;
                for(int j = 0; j < n + 1; j ++){//行内尺取
                        if(Map[i][j] == '0') cnt ++;
                        else                 res += MAX(0, cnt - m + 1), cnt = 0;
                }
        }
        outInt(res);
        _REGAL;
};

```

<hr>

## 牛客2021多校(6)I_IntervalsontheRing

#### 🔗
https://ac.nowcoder.com/acm/contest/11257/I

#### 💡
让我们构造一个交集为给定输入区间的一套输出区间  
可以得到输出区间中如果有一个区间里面某一块lr没有包含上，那么最后的答案里面这一块lr也不会包含上  
那么我们只需要对输入的区间里面的单位都设置为1后，求所有全0区间即可（但要绕环  
所以本题是一道环形双指针问题

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

#define pii pair<int, int> 
#define pll pair<ll, ll>
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

const int N = 5000;
int vis[N];

inline void solve() {
        MEM(vis, 0);
        int n, m; cin >> n >> m;
        for ( int i = 0; i < m; i ++ ) {
                int l, r; cin >> l >> r; l --, r --;
                for ( int i = l;; i = (i + 1 ) % n ) {
                        vis[i] = 1;
                        if(i == r) break;
                }
        }
        int stt;
        for ( stt = 0; stt < n; stt ++ ) {
                if ( vis[stt] == 0 ) break;
        } // 随便固定一个stt位置（为0
        if ( stt == n ) {
                cout << 1 << endl << 2 << " " << 1 << endl;
                return ;
        }

        vector<pii> res;
        while( !vis[stt] ) stt = (stt + n - 1) % n; // 让stt移动到某个全1区间的末尾
        int tgt = (stt + n - 1) % n; while (vis[tgt] == 1) tgt = (tgt - 1 + n) % n; tgt = (tgt + 1) % n; // 让tgt移动到与stt同全1区间的开头
        
        // i快，j慢
        for ( int i = stt, j = i; ; j = i){
                j = (j + 1) % n; while( !vis[j] ) j = (j + 1) % n; // j走到下一个全1区间的开头
                res.push_back(make_pair(j, i));

                if ( j == tgt ) break; // 说明已经一圈了，就break掉了

                while (vis[j] ) j = (j + 1) % n; // j继续往后走到下一个全0区间的开头
                i = (j + n - 1) % n; // i位于下一个全1区间的末尾
        }

        cout << res.size() << endl;
        for ( int i = 0; i < res.size(); i ++ ) {
                cout << res[i].first + 1 << " " << res[i].second + 1 << endl;
        }
}

CHIVAS_{IOS;
        int cass;
        for(cin >> cass; cass; cass --) {
                solve();
        }
        _REGAL;
}
/*
10
12 3
2 4
6 8
10 11
*/
```

<hr>

## 牛客2022寒假算法基础集训营2F_小沙的算数

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/23477/F"><img src="https://img-blog.csdnimg.cn/9881248a6479460a9030bd79473ea72a.png"></a>

#### 💡
由于这道题只有两个运算两个优先级  
所以我们可以采用双指针，以 `+` 为分界线，同 `*` 为一个块分配到一个 `node{l, r, val]` 中  
预先统计出一个无修改的答案  
在修改时 `x, y` ，我们 `lower_bound` 出第一个 $l>=x+1$ 的块，然后前一个就是我们修改的块  
修改使答案 `res - node.val + node.val / a[x] * y` ，并更新这个块的 `val`   

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const ll N = 1e6 + 10;
const ll mod = 1e9 + 7;
ll a[N];
ll n, m;
char s[N];

struct node {
        ll l, r, val;
        inline node () {}
        inline node ( ll a, ll  b, ll c ) { 
                l = a, r = b, val = c;
        }
        inline friend bool operator < ( node a, node b ) {
                if ( a.l != b.l ) return a.l < b.l;
                if ( a.r != b.r ) return a.r < b.r;
                return a.val < b.val;
        }
};

inline ll ksm ( ll a, ll b ) { ll res = 1; while ( b ) { if ( b & 1 ) res = res * a % mod; a = a * a % mod; b >>= 1; } return res; }
inline ll inv ( ll x ) { return ksm(x, mod - 2); }

int main () {
        ios::sync_with_stdio(false);

        cin >> n >> m;
        cin >> (s + 1);  s[n] = '+';
        for ( ll i = 1; i <= n; i ++ ) cin >> a[i];
        vector<node> vec;
        for ( ll i = 1; i <= n; i ++ ) {
                if ( s[i] == '+' ) vec.push_back({i, i, a[i]});
                else {
                        ll l = i;
                        ll cur = 1;
                        while ( i < n && s[i] == '*' ) cur = cur * a[i] % mod, i ++; cur = cur * a[i] % mod;
                        ll r = i;
                        vec.push_back({l, r, cur});
                }
        }
        ll res = 0;
        for ( auto i : vec ) 
                res += i.val, res %= mod;
        vec.push_back({10000000, 10000000, 100000});

        while ( m -- ) {
                ll x, y; cin >> x >> y;
                ll id = lower_bound(vec.begin(), vec.end(), node(x + 1, x + 1, 0)) - vec.begin();
                id --;
                res = ((res - vec[id].val + vec[id].val * inv(a[x]) % mod * y % mod) % mod + mod) % mod; 
                vec[id].val = vec[id].val * inv(a[x]) % mod * y % mod;
                a[x] = y;
                cout << res << endl;
        }
}
```
<hr>

## 湘潭2021全国邀请赛11_Substring

#### 🔗
https://acm.hdu.edu.cn/showproblem.php?pid=6948

#### 💡
一个很明显的双指针  
我们想固定子串  
其右指针会不断前进  
那么左指针用来保证固定到的子串要成立  
  
所以如果某个字符个数超过k了  
那么就将左指针移动到能将这个字符数量-1的位置

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
/*
________ _ ________ _
/ ______| | | | __ | | |
/ / | | | |__| | | |
| | | |___ _ _ _ ___ _ _____ | ___| ______ _____ ___ _ | |
| | | __ \ |_| | | | | | _\| | | ____| | |\ \ | __ | | _ | | _\| | | |
| | | | \ | _ | | | | | | \ | | \___ | | \ \ | |_/ _| | |_| | | | \ | | |
\ \______ | | | | | | \ |_| / | |_/ | ___/ | | | \ \ | /_ \__ | | |_/ | | |
Author : \________| |_| |_| |_| \___/ |___/|_| |_____| _________|__| \__\ |______| | | |___/|_| |_|
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
template<typename T> inline T MAX(T a, T b){return a > b? a : b;}
template<typename T> inline T MIN(T a, T b){return a > b? b : a;}
template<typename T> inline void SWAP(T &a, T &b){T tp = a; a = b; b = tp;}
template<typename T> inline T GCD(T a, T b){return b > 0? GCD(b, a % b) : a;}
template<typename T> inline void ADD_TO_VEC_int(T &n, vector<T> &vec){vec.clear(); cin >> n; for(int i = 0; i < n; i ++){T x; cin >> x, vec.PB(x);}}
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal <
vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_ll(vector<T> vec){T MinVal = LNF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i])MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<T, T> MaxInVector_int(vector<T> vec){T MaxVal = -INF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal <vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
template<typename T> inline pair<T, T> MinInVector_int(vector<T> vec){T MinVal = INF, MinId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MinVal > vec[i])MinVal = vec[i], MinId = i; return {MinVal, MinId};}
template<typename T> inline pair<map<T, T>, vector<T> > DIV(T n){T nn = n;map<T, T> cnt;vector<T> div;for(ll i = 2; i * i <= nn; i ++){while(n % i == 0){if(!cnt[i]) div.push_back(i);cnt[i] ++;n /= i;}}if(n != 1){if(!cnt[n]) div.push_back(n);cnt[n] ++;n /= n;}return {cnt, div};}
template<typename T> vector<T>& operator-- (vector<T> &v){for (auto& i : v) --i; return v;}
template<typename T> vector<T>& operator++ (vector<T> &v){for (auto& i : v) ++i; return v;}
template<typename T> istream& operator>>(istream& is, vector<T> &v){for (auto& i : v) is >> i; return is;}
template<typename T> ostream& operator<<(ostream& os, vector<T> v){for (auto& i : v) os << i << ' '; return os;}
inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

int vis[30];

CHIVAS_{
        int k; string s;
        while ( cin >> k >> s ) {
                MEM(vis, 0);
                int res = 0;
                for ( int r = 0, l = 0; r < s.size(); r ++ ) {
                        vis[s[r] - 'a'] ++;
                        while ( vis[s[r] - 'a'] > k ) vis[s[l] - 'a'] --, l ++;
                        res = MAX(res, r - l + 1);
                }
                outInt(res);
                puts("");
        }
        _REGAL;
};

```

<hr>

## ABC250F_OneFourth

#### 🔗
<a href="https://atcoder.jp/contests/abc250/tasks/abc250_f">![20220509144741](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220509144741.png)</a>

#### 💡
首先要留意这个公式：  
对于按顺序给出的点 $[x,y]$ ，围出的多边形面积 $S=\sum\limits_{i=0}^{n-1}x_iy_{(i+1)\%n}-x_{(i+1)\%n}y_i$  
由于题目是在某种意义上让 整个凸多边形面积的四分之一 与 我们选出的相邻点组成的凸多边形的面积 差最小  
  
而思考一下上面的公式，在已有凸多边形面积的情况下，向尾部添加一个点或者向开头删去一个点都可以 $O(1)$ 求的:  
- 尾部加点
  - 断掉最后一个点和第一个点的关系  
  - 添加最后一个点和新加入点的关系
  - 添加新加入点和第一个点的关系
- 开头删点
  - 断掉第一个点和第二个点的关系
  - 断掉最后一个点和第一个点的关系
  - 添加最后一个点和第一个点的关系

那么我们可以用上面两个元素进行尺取   
维护一下让我们选出的面积要小于等于总面积的四分之一即可     
  
尺取我们 $r$ 是可以一直走的，但是 $l$ 走一轮就行了，所以 $l$ 不会进行模 $n$ ，特判 $l=n$ 时停止  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
int main () {
        ios::sync_with_stdio(false);
        cin.tie(nullptr);

        ll n; cin >> n; 
        auto add = [&](ll x, ll val) { return (x + val) % n; }; // 下一个点
        auto sub = [&](ll x, ll val) { return (x - val + n) % n; }; // 上一个点

        vector<ll> x(n), y(n);
        for (ll i = 0; i < n; i ++) cin >> x[i] >> y[i];

        ll S = 0;
        for (ll i = 0; i < n; i ++) {
                S += x[i] * y[add(i, 1)] - x[add(i, 1)] * y[i];
        } S = llabs(S);


        ll res = __LONG_LONG_MAX__;
        auto update_Min = [&](ll sum) { // 切出来的一块面积为 sum ，更新答案
                ll cura = 4ll * (S - llabs(sum));
                ll curb = 4ll * llabs(sum);
                res = min({res, llabs(S - cura), llabs(S - curb)});      
        };

        ll sum = (x[0] * y[1] - x[1] * y[0]) + (x[1] * y[2] - x[2] * y[1]) + (x[2] * y[0] - x[0] * y[2]); // 先放入三个点  

        for (ll l = 0, r = 3; l < n; r = add(r, 1)) {
                // 尾部加点
                sum -= x[sub(r, 1)] * y[l] - x[l] * y[sub(r, 1)];
                sum += x[sub(r, 1)] * y[r] - x[r] * y[sub(r, 1)];
                sum += x[r] * y[l] - x[l] * y[r];
                update_Min(sum);
                while (sum * 4 > S) { // 开头删点
                        sum -= x[r] * y[l] - x[l] * y[r];
                        sum -= x[l] * y[add(l, 1)] - x[add(l, 1)] * y[l];
                        l ++;
                        if (l == n) break;
                        sum += x[r] * y[l] - x[l] * y[r];
                        update_Min(sum);
                }
        }

        cout << res << endl;
}
```
<hr>




## CodeForces660C_HardProcess

#### 🔗
https://vjudge.net/problem/CodeForces-660C

#### 💡
最长的全1子串，我们肯定要集中的把一段尽量全改成1  
那么我们只需要右指针向前移动，遇到0改成1  
左指针保证子串修改次数上限，若超过就移动到一个改过的位置并将其改回来  

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

const int N = 3e5 + 10;
int n, k;
int a[N], b[N];
int res;
pair<int, int> pr;

CHIVAS_{
        n = inputInt(), k = inputInt();
        for ( int i = 1; i <= n; i ++ ) a[i] = inputInt(), b[i] = a[i];
        for ( int l = 1, r = 1; r <= n; r ++ ) {
                if(a[r] == 0) b[r] = 1, k --;
                while ( k < 0 ) {
                        if ( a[l] == 0 ) k ++, b[l] = 0;
                        l ++;
                }
                if ( res < r - l + 1 ) {
                        res = r - l + 1;
                        pr = {l, r};
                }
        }
        outInt(res); puts("");
        for ( int i = 1; i <= n; i ++ ) {
                if ( i != 1 ) putchar(' ');
                if ( i >= pr.first && i <= pr.second ) outInt(1);
                else outInt(a[i]);
        }
        _REGAL;
};
```

<hr>

## CodeForces1043D_MysteriousCrime

#### 🔗
<a href="https://codeforces.com/contest/1043/problem/D">![20220706212145](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220706212145.png)</a>

#### 💡
本题就是让求所有串的公共子串个数  
而且注意到 $m\le 10$ ，说明可以直接检查  
既然是公共子串，那么 $1$ 串子串中相邻的数在别的串也一定相邻  
所以对每一个串的每一个数都存一下位置，然后遍历 $1$ 串，用双指针每一次找出最长的连续的公共子串长度 $len$ ，个数为 $len(len-1)$   
遇到断开的就计算，然后对 $len$ 设置为 $1$ 意味着重新开始    

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 1e5 + 10;
const int M = 20;
int n, m;
int id[M][N];
int a[M][N];
 
int main () {
        ios::sync_with_stdio(false);
        cin.tie(nullptr);
 
        cin >> n >> m;
        for (int i = 0; i < m; i ++) {
                for (int j = 0; j < n; j ++) {
                        int x; cin >> x;
                        id[i][x] = j;
                        a[i][j] = x;
                }
        }
 
        ll len = 1;
        ll res = 0;
        for (int i = 1; i <= n; i ++) {
                bool flag = 1;
                for (int j = 0; j < m; j ++) {
                        if (id[j][a[0][i]] != id[j][a[0][i - 1]] + 1) flag = 0;
                }
                if (flag) {
                        len ++;
                } else { // 断了
                        res += len + (len - 1) * len / 2;
                        len = 1;
                }
        }
        cout << res << endl;
}
```
<hr>


## NCD2019K_MasaoudLOVESPIZZAS

#### 🔗
<a href="https://codeforces.com/gym/102163/problem/K"><img src="https://s2.loli.net/2022/01/06/zRhQVGom2Hn39bp.png"></a>

#### 💡
求有多少个子段和不超过  <img src="https://latex.codecogs.com/svg.image?\inline&space;k" title="\inline k" />  
不一样的子段的差异就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;[l,r]" title="\inline [l,r]" /> 的差异，所以我们可以找对于每个  <img src="https://latex.codecogs.com/svg.image?\inline&space;l" title="\inline l" /> 有多少个  <img src="https://latex.codecogs.com/svg.image?\inline&space;r" title="\inline r" /> 满足，也就是对于每个  <img src="https://latex.codecogs.com/svg.image?\inline&space;l" title="\inline l" /> 的满足条件的最大字段长   
然后累加  
这个先**预处理一下前缀和**然后通过双指针就可以实现  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
ll a[100005];
ll b[100005];
ll n, k;

inline void Solve () {
        cin >> n >> k;
        for ( int i = 1; i <= n; i ++ ) 
                cin >> a[i],
                b[i] = b[i - 1] + a[i];

        ll cur = 0;
        ll res = 0;
        
        for ( int l = 1, r = 1; l <= n; l ++ ) {
                r = max(l - 1, r);
                while ( r <= n && b[r] - b[l - 1] < k ) r ++;
                res += r - l;
        }
        cout << res << endl;
}

int main () {
        ios::sync_with_stdio(false);
        ll cass; cin >> cass; while ( cass -- ) {
                Solve ();
        }
}
```

<hr>

## POJ2566_BoundFound

#### 🔗
https://vjudge.net/problem/POJ-2566

#### 💡
既然开abs的话，那么顺序（正反）已经无所谓了  
我们需要在意的就只有用来求区间和的前缀和 sum 了  
因为题目要求固定区间，所以我们要同时记录每个sum的下标
所以我们对sum数组排个序  
然后用双指针向后找  
  
这类找最接近的双指针只需要 “ 大了左指针前推，小了右指针前推 ” 从而使每一步都尽可能接近这个数    
并在过程中维护最接近的区间即可

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

/*
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
*/
inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

inline ll abss(ll x) { return x > 0ll ? x : -x; } // 对 long long 需要特殊的abs
const int N = 100005;
ll n, k;
struct node { ll id, sum;  inline friend  bool  operator < (node a, node b) {return a.sum < b.sum;} } no[N];

CHIVAS_{
        while ( scanf("%lld%lld", &n, &k) == 2 && (n || k) ) {
                no[0] = node{0, 0};
                for ( ll i = 1; i <= n; i ++ ) no[i] = node{ i,no[i - 1].sum + inputInt()};
                sort(no , no + 1 + n);
                while( k -- ) {
                        ll x = inputLL();
                        pair<pair<ll, ll>, ll> res = make_pair(make_pair(0, 0), INF); // {{左右端点}, 和} 
                        ll l = 0, r = 1;
                        while ( r <= n && abss(res.second - x) ) {
                                ll Sum = no[r].sum - no[l].sum ;

                                if ( abss(Sum - x) < abss(res.second - x) ) res = make_pair(make_pair(no[l].id, no[r].id), Sum); // 维护
                                
                                // 小了左指针前进，大了右指针前进
                                if ( Sum >= x ) l ++;
                                else r ++;
                                if ( r == l ) r ++; // 相同就右指针前进以拉开区间
                        }
                        printf("%lld %lld %lld\n", res.second, min(res.first.second, res.first.first) + 1, max(res.first.second, res.first.first));
                }
        }
        _REGAL;
};
```

<hr>
