---
title: 差分约束
---
###  
<hr>

## HDUOJ1384_Intervals


#### 🔗 
https://acm.dingbacode.com/showproblem.php?pid=1384

#### 💡
设置dis[i]表示[0, i]这个区间至少有多少点能被选中</br>
于是得到三个约束点</br>
1. (b[i]) - (a[i] - 1) >= c[i]
2. (d[i]) - (d[i - 1]) >= 0
3. (d[i]) - (d[i - 1]) <= 1

根据这三个条件建图，然后用“>=”求最长路即可</br>
因为会出现-1</br>
所以使用SPFA</br>

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
template<typename T> inline void read(T &f) { f = 0; T fu = 1; char c = getchar();while (c < '0' || c > '9') { if (c == '-') { fu = -1; } c = getchar(); }while (c >= '0' && c <= '9') { f = (f << 3) + (f << 1) + (c & 15); c = getchar(); }f *= fu;}
template<typename T> inline void write(T x) { if(x < 0) x = ~(x - 1), putchar('-'); if(x > 9) write(x / 10); putchar(x % 10 + '0'); }

const int N = 250000;
int n;
int dis[N], vis[N];
struct Edge{ int nxt, to, val; }edge[N];
int head[N];
int cnt;
int stt, tgt;

inline void Init (){
        for(int i = 0; i < N; i ++){
                vis[i] = 0;
                dis[i] = -1e9;
                head[i] = -1;
        }
        cnt = 0;
        stt = 1e9, tgt = -1;
} 

inline void AddEdge (int from, int to, int val){
        edge[++cnt].nxt = head[from];
        edge[cnt].to = to;
        edge[cnt].val = val;
        head[from] = cnt;
}

inline void DrawMap (){
        for (int i = 0, a, b, c; i < n; i ++){
                scanf("%d%d%d", &a, &b, &c);
                AddEdge(a - 1, b, c);
                
                stt = MIN(stt, a - 1);
                tgt = MAX(tgt, b);
        }
        for (int i = stt; i <= tgt; i ++){
                AddEdge(i - 1, i, 0);
                AddEdge(i, i - 1, -1);
        }
}

inline void SPFA (int start){
        dis[start] = 0;
        queue<int> que; que.push(start); vis[start] = 1;
        while (que.size()){
                int x = que.front(); que.pop(); vis[x] = 0;
                for (int i = head[x]; ~i; i = edge[i].nxt){
                        int y = edge[i].to;
                        if (dis[y] < dis[x] + edge[i].val){
                                dis[y] = dis[x] + edge[i].val;
                                if (!vis[y]) vis[y] = 1, que.push(y);
                        }
                }
        }
}

CHIVAS_{
        while (scanf("%d", &n) == 1){
                Init();
                DrawMap();
                SPFA(stt);
                printf("%d\n", dis[tgt]);
        }
        _REGAL;
}
```

<hr>

## HDUOJ3592_WorldExhibition

#### 🔗
https://acm.dingbacode.com/showproblem.php?pid=3592

#### 💡
一个比较明显的差分约束题型</br></br>
前x个：a[i] b[i] c[i]</br>
表示：b[i] - a[i] <= c[i]</br>
后y个：a[i] b[i] c[i]</br>
表示：b[i] - a[i] >= c[i]</br></br>
求最大值，所以要跑最短路，标准化一下不等式得</br>
x: b[i] - a[i] <= c[i]</br>
y: a[i] - b[i] <= -c[i]</br>
使用Bellman-Ford</br>
1.距离无限大，-1</br>
2.有负环，-2</br>
3.不是1.2.就输出</br>

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
#define EACH_CASE(cass) for (cass = readInt(); cass; cass--)

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
inline int readInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline int writeInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll readLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline int writeLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

const int N = 1100, M = 21000;
int fr[M], to[M], vl[M];
int dis[N];
int n, x, y;

inline void Init(){
        for(int i = 0; i < N; i ++) dis[i] = 1e9;
}
inline void DrawMap(){
        n = readInt(); x = readInt(); y = readInt();
        for(int i = 0; i < x; i ++) fr[i] = readInt(), to[i] = readInt(), vl[i] = readInt();
        for(int i = 0; i < y; i ++) to[i + x] = readInt(), fr[i + x] = readInt(), vl[i + x] = -readInt();
}
inline void Bellman_Ford(){
        dis[1] = 0;
        for(int k = 1; k < n; k ++){
                for(int i = 0; i < x + y; i ++){
                        dis[to[i]] = MIN(dis[fr[i]] + vl[i], dis[to[i]]);
                }
        }
        if (dis[n] == 1e9) { puts("-2"); return; }//到不了，无限远
        for(int i = 0; i < x + y; i ++){
                if(dis[to[i]] > dis[fr[i]] + vl[i]){
                        puts("-1"); return;//还能松弛，有负环
                }
        }
        writeInt(dis[n]); puts("");
}


CHIVAS_{
        int cass;
        EACH_CASE(cass){
                Init();
                DrawMap();
                Bellman_Ford();
        }
        _REGAL;
}
```

<hr>

## Luogu2294_狡猾的商人

#### 🔗
<a href="https://www.luogu.com.cn/problem/P2294"><img src="https://i.loli.net/2021/09/30/NfUE4PLFRgHaudw.png"></a>

#### 💡
对于给定的a,b,c  
可以使用前缀和，(b)-(a-1)=c  
那么就建边:  
(b)-(a-1)<=c  
(a-1)-(b)<=-c  
  
即然检查正确性，那么就跑图，对于每个连通块看一下有没有负环  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const ll N = 1e2 + 10, M = 2e3 + 10;

int stt[M], tgt[M], val[M], cnt;
int dis[N], vis[N];
int n, m;

inline bool Bellman_Ford ( int x ) {
        memset ( dis, 0x3f3f3f, sizeof dis ); dis[x] = 0;
        for ( int k = 0; k < n - 1; k ++ ) 
                for ( int i = 0; i < cnt; i ++ )
                        dis[tgt[i]] = min ( dis[tgt[i]], dis[stt[i]] + val[i] ), 
                        vis[tgt[i]] = 1;
        for ( int i = 0; i < cnt; i ++ )
                if ( dis[tgt[i]] > dis[stt[i]] + val[i] ) 
                        return false;
        return true;
}

int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif 
        int cass;
        for ( scanf("%d", &cass); cass; cass -- ) {
                scanf("%d%d", &n, &m);
                cnt = 0; memset ( vis, 0, sizeof vis );
                for ( int i = 0, a, b, c; i < m; i ++ ) 
                        scanf("%d%d%d", &a, &b, &c),
                        stt[cnt] = a - 1, tgt[cnt] = b, val[cnt ++] = c,
                        stt[cnt] = b, tgt[cnt] = a - 1, val[cnt ++] = -c;
                dis[0] = 0;
                
                bool flag = true;
                for ( int i = 0; i <= n; i ++ ) {
                        if ( !vis[i] && !Bellman_Ford( i ) ) { flag = false; break; }
                }
                if ( flag ) puts("true");
                else        puts("false");
        }
        return 0;
}
```

<hr>
