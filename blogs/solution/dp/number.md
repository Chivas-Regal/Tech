---
title: æ°ä½DP
---
###  
<hr>

## HDUOJ2089_ä¸è¦62

#### ð
https://acm.dingbacode.com/showproblem.php?pid=2089

#### ð¡
æ¬é¢è®©è®°å½æ²¡æ â4â å â62â çæ°  
â4âæ¯å¯ä»¥ç´æ¥å¨æ¯ä¸ä½ä¸è¿è¡å¤æ­ï¼â62âåéè¦å ä¸ä¸ªè®°å½åé¢æ¯å¦ä¸º6çis_6åéï¼å¨è¿ä¸ªåºç¡ä¸å¤æ­2  
æ±åºé´åæ»¡è¶³æ¡ä»¶çæ°çä¸ªæ°ï¼å¯ä»¥ç¨åç¼åçææ³æ±åºé´å  

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

const int N = 100;
int num[N], dp[N][2];

inline int DFS ( int n, bool is_6, bool is_max ) { // 62æ¯è¿æ°ï¼ä¸è½ç´æ¥å¤æ­ï¼æä»¥è¦å ä¸ªä¸ä¸ä½çè®°å½
        if ( !n ) return 1;
        if ( !is_max && ~dp[n][is_6] ) return dp[n][is_6];

        ll res = 0, m = is_max ? num[n] : 9;
        for ( int i = 0; i <= m; i ++ ) {
                if ( !(is_6 && i == 2) && i != 4 ) res += DFS ( n - 1, i == 6, is_max && i == m );
        } 
        if ( !is_max ) dp[n][is_6] = res;
        return res;
}
inline int Solve ( int x ) {
        int len;
        for ( len = 0; x; x /= 10 ) num[ ++ len ] = x % 10;
        return DFS(len, 0, 1); 
}
CHIVAS_{
        MEM(dp, -1);
        int l, r;
        while ( scanf("%d%d", &l, &r) == 2 , l || r ) {
                outInt( Solve(r) - Solve(l - 1) ); puts(""); // åç¼åç»è®¡åºé´åæ»¡è¶³æ¡ä»¶çæ°çä¸ªæ°
        }
        _REGAL;
}
```

<hr>

## HDUOJ3555_Bomb

#### ð
https://acm.dingbacode.com/showproblem.php?pid=3555

           
#### ð¡
æä»¬å¯ä»¥å©ç¨æ°ä½DPæä¸å« "49" çç»è®¡åºæ¥  
ç¶å x - solve(x) + 1 å³æ¯æ­£è§£  
æ¬é¢ä¸ºç±»æ¨¡æ¿é¢  

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

const int N = 100;
ll dp[N][2], b[N];

inline ll DFS ( int n, bool is_4, bool is_max ) {
        if ( !n ) return 1;
        if ( !is_max && dp[n][is_4] != -1 ) return dp[n][is_4];

        ll res = 0;
        int m = is_max? b[n] : 9; 
        for ( int i = 0; i <= m; i ++ ) {
                // ææä¸æ 49 çç»è®¡åºæ¥
                if ( !(is_4 && i == 9) ) res += DFS ( n - 1, i == 4, is_max && i == m );
        }
        if ( !is_max ) dp[n][is_4] = res;
        return res;
}

inline ll solve ( ll x ) {
        int len;
        for ( len = 0; x; x /= 10 ) b[ ++ len ] = x % 10;
        return DFS ( len, 0, true );
}

CHIVAS_{
        int cass;
        MEM (dp, -1);
        EACH_CASE ( cass ) {
                ll x = inputLL();
                outLL(x - solve(x) + 1); puts("");
        }
        _REGAL;
}
```

<hr>

## HDUOJ4507_æ¨7ä¸æå¦»

#### ð
https://acm.dingbacode.com/showproblem.php?pid=4507

           
#### ð¡
æ¬é¢å¯¹æ°çè¦æ±ï¼  
1.åä½ä¸è½åºç°7ï¼å¨æä¸¾ä½çæ¶åæ7è·³è¿å»å³å¯  
2.åä½åä¸è½æ¯7çåæ°ï¼åæ°åè¡¨éé¢è®¾ç½®sumï¼è¡¨ç¤ºåä¸ªä½çåæ¨¡7çæ°å¼ï¼è¥ä¸º0ä»£è¡¨æ¯7çåæ°  
3.æ°ä¸è½æ¯7çåæ°ï¼åæ°åè¡¨è®¾ä¸ä¸ªnumï¼è¡¨ç¤ºèªèº«æ¨¡7çæ°å¼ï¼è¥ä¸º0ä»£è¡¨æ¯7çåæ°  
  
å¨æ±å¹³æ¹åæ¶ï¼æä»¬å¯ä»¥ä½¿ç¨å¹³æ¹åå¬å¼ï¼å³ :  
<img src="https://latex.codecogs.com/svg.image?23^2=(20&plus;3)^2=20^2&plus;3^2&plus;2*20*3" title="23^2=(20+3)^2=20^2+3^2+2*20*3" />  
<img src="https://latex.codecogs.com/svg.image?123^2=(100&plus;23)^2=100^2&plus;23^2&plus;2*100*23&space;" title="123^2=(100+23)^2=100^2+23^2+2*100*23 " />  
å¯ä»¥éè¿è®°å½å¡«æ³æ°éãå¡«æ³æ°æ»åå¹¶è®°å½åé¢å ä½çå¹³æ¹ååæº¯åºæ´ä½å¹³æ¹å


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

const ll mod = 1e9 + 7;
const ll N = 30;
struct node { 
        ll num, sum, SUM; // ä¸ä¸ä½çå¡«æ³æ°éï¼å¡«æ³çæ°çæ»åï¼å¡«æ³çæ°çå¹³å¡å
}dp[N][10][10]; // [ä½æ°][åä½æ°å%7][æ¬èº«%7]
ll b[N], len;   // ä¸ä¸ªæ°è¢«æåä¸ºä¸ä¸ªä½æ°ç»
ll pow10[N];    // é¢å¤ç10^i

inline node DFS ( int n, int sum, int num, bool is_max ) { // sum å num é½æ¯æ¨¡7åçå¼
        if ( !n ) {
                node tmp = {num && sum, 0, 0}; // æ¬èº«ä¸æ°ä½åæä¸ä¸ªæ¯7çåæ°çè¯ï¼å¼å§å°±ä¸ä¸ªé½ç»ä¸äº
                return tmp;
        } if ( !is_max && ~dp[n][num][sum].num ) return dp[n][num][sum];

        int m = is_max ? b[n] : 9;
        node res = {0, 0, 0};
        for ( int i = 0; i <= m; i ++ ) {
                if ( i == 7 ) continue;
                node tmp = DFS ( n - 1, (sum + i) % 7, (num * 10 + i) % 7, is_max && i == m );
                ll CurPos = pow10[n - 1] * i % mod; // è·å¾å½åä½çæ°ç¡®åä»£è¡¨ä»ä¹ï¼æ¯å¦231ç200é¨å

                // è®°å½ä¸å±ä¸ªæ°
                res.num = (res.num + tmp.num) % mod; 
                // æ¬ä½ä¸ä¸å±ä¸ªæ°ç¸ä¹ï¼ä¸ä¸å¯¹åº
                res.sum = (res.sum + (tmp.sum + CurPos * tmp.num % mod) % mod) % mod;
                // ç¨å¹³æ¹åå¬å¼ 
                res.SUM = (res.SUM + ((tmp.SUM + 2 * CurPos * tmp.sum % mod) % mod + tmp.num * CurPos % mod * CurPos % mod) % mod) % mod;
        }
        if ( !is_max ) dp[n][num][sum] = res;
        return res;
}

inline ll solve ( ll x ) {
        for ( len = 0; x; x /= 10 ) b[ ++ len ] = x % 10;
        return DFS(len, 0, 0, 1).SUM; 
}

CHIVAS_{
        pow10[0] = 1;
        for ( ll i = 1; i < N; i ++ ) pow10[i] = (pow10[i - 1] * 10) % mod;
        MEM(dp, -1);

        int cass;
        EACH_CASE ( cass ) {
                ll l = inputLL(), r = inputLL();
                outLL((solve(r) - solve(l - 1) + mod) % mod); puts("");
        }
        _REGAL;
}

```

<hr>

## ICPC2020ä¸æµ·ç«C_SumOfLog

#### ð
<a href="https://codeforces.com/gym/102900/problem/C"><img src="https://img-blog.csdnimg.cn/22c08ad3440c4ad7a629af2975f96976.png"></a>

#### ð¡
å³æ³¨ä¸ä¸ <img src="https://latex.codecogs.com/svg.image?\inline&space;[i\&j=0]" title="\inline [i\&j=0]" />ï¼è¿æ ·çè¯æ¯ä¸ä½é½ä¸åæå¯ä»¥ååºè´¡ç®ï¼é£ä¹<img src="https://latex.codecogs.com/svg.image?\inline&space;log(i+j)" title="\inline [i\&j=0]" />å°±æ¯<img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline [i\&j=0]" />å<img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline [i\&j=0]" />çæé«ä½  
ç¬¬ä¸ç¼æ³å°æåç»åä¹±æï¼ä½æ¯æ¶ä¸ä½æ <img src="https://latex.codecogs.com/svg.image?\inline&space;XY" title="\inline [i\&j=0]" /> çéå¶è®©éæ°ä¸è½éä¾¿é  
é£ä¹æ¢ç¶æ¯ä¸çï¼å¯ä»¥éç¨æ°ä½dpå»è·  
  
éå¶ä¸ºä¸¤ä¸ªä¸çï¼æ­£å¸¸ä¸ä¸ªä½æ°
æä»¥æä»¬è®¾ç½® <img src="https://latex.codecogs.com/svg.image?\inline&space;dp[i][j][k]" title="\inline [i\&j=0]" /> è¡¨ç¤ºæä¸¾å°ç¬¬ <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="" /> ä½ï¼ç¬¬ä¸ä¸ªæ°æ¯å¦å°è¾¾ä¸çï¼ç¬¬äºä¸ªæ°æ¯å¦å°è¾¾ä¸ç  
  
æä»¬å¨ <img src="https://latex.codecogs.com/svg.image?\inline&space;dfs" title="" />åæ°ä¸ä¹ä¿æè¿æ ·çç¶æï¼å¹¶å ä¸ºæä¸¤ä¸ªæ°ï¼æä»¬å¨æä¸¾ç¬¬<img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="" />ä½çæ¶ååºæä¸¤é <img src="https://latex.codecogs.com/svg.image?\inline&space;01" title="" />ï¼å¹¶æ ¹æ®æ¯å¦ä¸ºæé«æ°æ¥ç»å®æä¸¾çæå¤§å¼ï¼ä¿è¯ä¸¤ä¸ªä¸åä¸º<img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="" />å³å¯

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int mod = 1e9 + 7;

int a[40], b[40]; // äºè¿å¶è¡¨ç¤º
ll dp[40][2][2];

inline ll DFS ( int id, bool is_high_x, bool is_high_y ) {
        if ( !(~id) ) return 1;
        if ( ~dp[id][is_high_x][is_high_y] ) return dp[id][is_high_x][is_high_y];

        int topx = is_high_x ? a[id] : 1; // æ ¹æ®æé«ä½è®¾ç½®æä¸¾çæå¤§å¼
        int topy = is_high_y ? b[id] : 1;

        ll res = 0;
        for ( int i = 0; i <= topx; i ++ ) {
                for ( int j = 0; j <= topy; j ++ ) {
                        if ( i && j ) continue;
                        res += DFS(id - 1, is_high_x && i == topx, is_high_y && j == topy); // åå°ä½èµ°ï¼ä¼ éâæ¯å¦æé«ä½â
                        res %= mod;
                }
        }
        return dp[id][is_high_x][is_high_y] = res;
}

inline void Solve () {
        ll x, y; cin >> x >> y;
        ll lenx = 0, leny = 0;
        memset(dp, -1, sizeof dp);
        memset(a, 0, sizeof a);
        memset(b, 0, sizeof b);
        while ( x ) a[lenx ++] = x % 2, x /= 2;
        while ( y ) b[leny ++] = y % 2, y /= 2;

        ll res = 0;
        for ( int i = 0; i < max(lenx, leny); i ++ ) {
                int topx = i >= lenx - 1 ? a[i] : 1;
                int topy = i >= leny - 1 ? b[i] : 1;
                for ( int j = 0; j <= topx; j ++ ) {
                        for ( int k = j == 0; k <= topy; k ++ ) { // æé«ä½é½æ¯0çè¯æ²¡ææä¸¾çå¿è¦
                                if ( j && k ) continue;
                                res += DFS(i - 1, i >= lenx - 1 && j == topx, i >= leny - 1 && k == topy) * (i + 1) % mod;
                                res %= mod;
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
