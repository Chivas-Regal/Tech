---
title: 悬线法
---
###  
<hr>

## 洛谷P1169_棋盘制作

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1169"><img src="https://i.loli.net/2021/11/30/6qftiQR9NW5yUYJ.png"></a>

#### 💡
求最大子全满足要求的矩阵问题  
应该一眼想到悬线法  

这道题每一个单位都可以满足哟求，所以初始化都是横  <img src="https://latex.codecogs.com/svg.image?\inline&space;j" title="\inline j" /> 竖  <img src="https://latex.codecogs.com/svg.image?\inline&space;1" title="\inline 1" />   
拉线和缩线的时候两者都满足要求的判断就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;\[a[i][j]\oplus&space;a[i-1][j]\neq0\]" title="\inline [a[i][j]^a[i-1][j]\neq0]" /> 或者  <img src="https://latex.codecogs.com/svg.image?\inline&space;[a[i][j]\oplus&space;a[i][j\pm1]\neq0]" title="\inline [a[i][j]\oplus&spacea[i][j\pm1]\neq0]" />   

#### ✅

```cpp
const int N = 1e3 + 10;
char Map[N][N];
int lft[N][N], rgt[N][N], up[N][N];

int main () {

        int n, m; cin >> n >> m;
        for ( int i = 1; i <= n; i ++ ) for ( int j = 1; j <= m; j ++ ) cin >> Map[i][j];

        for ( int i = 1; i <= n; i ++ ) {
                for ( int j = 1; j <= m; j ++ )     lft[i][j] = rgt[i][j] = j, up[i][j] = 1;
                for ( int j = 2; j <= m; j ++ )     if ( Map[i][j] ^ Map[i][j - 1] ) lft[i][j] = lft[i][j - 1]; 
                for ( int j = m - 1; j >= 0; j -- ) if ( Map[i][j] ^ Map[i][j + 1] ) rgt[i][j] = rgt[i][j + 1]; 
                if ( i >= 2 ) 
                        for ( int j = 1; j <= m; j ++ ) 
                                if ( Map[i][j] ^ Map[i - 1][j] ) 
                                        up[i][j] = up[i - 1][j] + 1,
                                        lft[i][j] = max(lft[i][j], lft[i - 1][j]),
                                        rgt[i][j] = min(rgt[i][j], rgt[i - 1][j]);
        }
        int res1 = 0, res2 = 0;
        for ( int i = 1; i <= n; i ++ ) {
                for ( int j = 1; j <= n; j ++ ) {
                        res1 = max(res1, min(up[i][j], rgt[i][j] - lft[i][j] + 1) * min(up[i][j], rgt[i][j] - lft[i][j] + 1) ),
                        res2 = max(res2, up[i][j] * (rgt[i][j] - lft[i][j] + 1)); // 面积 = 长 * 高
                }
        }
        cout << res1 << endl << res2 << endl;
}
```

<hr>

## 洛谷P2701_巨大的牛棚BigBarn

#### 🔗
https://www.luogu.com.cn/problem/P2701

#### 💡
先将 '#' 在原图中构造出来  
然后求全 '.' 的最大子矩阵  
利用悬线法即可  
到最后维护下最大的"长宽最小值"即是最大正方形  

#### ✅

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

const int N = 1e3 + 10;
char Map[N][N];
int lft[N][N], rgt[N][N], up[N][N];

inline void solve () {
        int n = inputInt(), t = inputInt();
        for ( int i = 1; i <= n; i ++ ) for ( int j = 1; j <= n; j ++ ) Map[i][j] = '.';
        for ( int i = 0; i < t; i ++ ) Map[inputInt()][inputInt()] = '#';
        for ( int i = 1; i <= n; i ++ ) {
                for ( int j = 1; j <= n; j ++ )     lft[i][j] = rgt[i][j] = j * (Map[i][j] == '.'), up[i][j] = (Map[i][j] == '.'); // 初始化
                for ( int j = 2; j <= n; j ++ )     if ( Map[i][j] == '.' && Map[i][j - 1] == '.' ) lft[i][j] = lft[i][j - 1]; // 递推左端点
                for ( int j = n - 1; j >= 0; j -- ) if ( Map[i][j] == '.' && Map[i][j + 1] == '.' ) rgt[i][j] = rgt[i][j + 1]; // 递推右端点
        }
        for ( int i = 2; i <= n; i ++ ) {
                for ( int j = 1; j <= n; j ++ ) if ( Map[i][j] == '.' && Map[i - 1][j] == '.' ) up[i][j] = up[i - 1][j] + 1; // 递推高
        }
        for ( int i = 1; i <= n; i ++ ) {
                for ( int j = 1; j <= n; j ++ ) {
                        if ( (i ^ 1) && Map[i][j] == '.' && Map[i - 1][j] == '.' ) { // 第一行之外缩横边
                                lft[i][j] = MAX(lft[i][j], lft[i - 1][j]); 
                                rgt[i][j] = MIN(rgt[i][j], rgt[i - 1][j]);
                        }
                }
        }
        int res = 0;
        for ( int i = 1; i <= n; i ++ ) {
                for ( int j = 1; j <= n; j ++ ) {
                        res = MAX(res, MIN(up[i][j], rgt[i][j] - lft[i][j] + 1)); // 维护最大的"长宽最小值"
                }
        }
        outInt(res);
}

CHIVAS_{
        solve();
        _REGAL;
};
```

<hr>

## CCPC2021湖北省赛I_Sequence

#### 🔗
<a href="https://codeforces.com/gym/103104/problem/I">![20221113203043](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113203043.png)</a>

#### 💡
就是在矩阵上给定几个点，问不包含这些点的矩形数量    
不包含的点可以用 $1$ 表示   
在被几个钉子封闭下的子矩阵，可以考虑悬线法的单调栈方式    
枚举的就是每个矩阵的左下角 $i,j$ ，以当前的 $0$ 高度为高度的子矩阵就是左侧第一个比自己小的点 $l$ ，数量为 $h[i][j]*(j-l)$  
但是注意到可以缩一点高度继续向左，新增的数量就是在 $i,l$ 位置求得的数量，可以用 $dp[i][j]$ 表示以 $(i,j)$ 为右下角的合法矩阵数量  
则 $dp[i][j]=dp[i][l]+h[i][j]*(j-l)$    
或者不用 $dp$ ，处理出来第一个小于等于自己的点 $r$ （如果处理小于的话可能会导致互相冲突重复计数），然后令当前点作为矩阵下边的其中一点，子矩阵方案数为 $h[i][j]*(j-l+1)*(r-j+1)$

#### ✅
```cpp
const int N = 5010;
 
int a[N][N];
int h[N][N];
int n, m;
int l[N], r[N];
ll dp[N][N];
 
inline void Solve () {
    cin >> n >> m;
    for (int i = 1; i <= m; i ++) {
        int x, y; cin >> x >> y;
        a[x][y] = 1;
    }
    for (int i = 1; i <= n; i ++) {
        for (int j = 1; j <= n; j ++) {
            if (a[i][j] == 0) {
                h[i][j] = h[i - 1][j] + 1;
            }
        }
    }
    ll res = 0;
    for (int i = 1; i <= n; i ++) {
        stack<int> stk;
        for (int j = 1; j <= n; j ++) {
            while (stk.size() && h[i][stk.top()] >= h[i][j]) stk.pop();
            l[j] = stk.empty() ? 1 : stk.top() + 1;
            stk.push(j);
        }
        stk = stack<int>();
        for (int j = n; j >= 1; j --) {
            while (stk.size() && h[i][stk.top()] > h[i][j]) stk.pop();
            r[j] = stk.empty() ? n : stk.top() - 1;
            stk.push(j);
        }
        for (int j = 1; j <= n; j ++) {
            res += (ll)h[i][j] * (j - l[j] + 1) * (r[j] - j + 1);
        }
    }
    cout << res << endl;
}
 
int main () {
    ios::sync_with_stdio(false);
    cin.tie(0);
    int cass = 1; while (cass --) {
        Solve ();
    }
}
```
<hr>

## ICPC2016AmmanD_Rectangles

#### 🔗
<a href="https://codeforces.com/gym/101102/problem/D">![20221113203218](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113203218.png)</a>

#### 💡
这个是问满足条件的矩阵数量  
首先正常悬线法，按相同颜色向下传递高度，以当前点高度能延伸到的左右距离先算出来  
然后注意到可能延伸到的不是相同颜色，故要去找到该点以相同颜色能延伸到的左右距离  
左端点取最大值，右端点取最小值来调整区间  
算好后也就是横向距离 $[l,r]$ 和高度 $h[i][j]$ 形成的矩阵是合法的，其中以 $(i,j)$ 为下边一点的矩阵数量都可以算出来了，也就是 $h[i][j]*(r-j+1)*(j-l+1)$   
用 $res$ 累加这个值即可   

#### ✅
```cpp
const int N = 1010;
 
int n, m;
int a[N][N];
int h[N][N];
int l[N], r[N];
int lg[N];
 
int stmn[N][20], stmx[N][20];
 
ll res = 0;
 
inline void Solve () {
    res = 0;
    cin >> n >> m;
    for (int i = 1; i <= n; i ++) {
        for (int j = 1; j <= m; j ++) {
            cin >> a[i][j];
        }
    }
    for (int i = 1; i <= n; i ++) {
        for (int j = 1; j <= m; j ++) {
            if (a[i][j] == a[i - 1][j]) {
                h[i][j] = h[i - 1][j] + 1;
            } else {
                h[i][j] = 1;
            }
        }
    }
 
    for (int i = 1; i <= n; i ++) {
        stack<int> stk;
        for (int j = 1; j <= m; j ++) {
            while (!stk.empty() && h[i][j] <= h[i][stk.top()]) stk.pop();
            l[j] = stk.empty() ? 1 : stk.top() + 1;
            stk.push(j);
        }
        stk = stack<int>();
        for (int j = m; j >= 1; j --) {
            while (!stk.empty() && h[i][j] < h[i][stk.top()]) stk.pop();
            r[j] = stk.empty() ? m : stk.top() - 1;
            stk.push(j);
        }
        for (int j = 1; j <= m; j ++) stmx[j][0] = stmn[j][0] = a[i][j];
        for (int j = 1; j <= lg[m]; j ++) {
            for (int k = 1; k + (1 << j) - 1 <= m; k ++) {
                stmx[k][j] = max(stmx[k][j - 1], stmx[k + (1 << (j - 1))][j - 1]);
                stmn[k][j] = min(stmn[k][j - 1], stmn[k + (1 << (j - 1))][j - 1]);
            }
        }
        auto querymax = [&](int l, int r) {
            int k = lg[r - l + 1];
            return max(stmx[l][k], stmx[r - (1 << k) + 1][k]);
        };
        auto querymin = [&](int l, int r) {
            int k = lg[r - l + 1];
            return min(stmn[l][k], stmn[r - (1 << k) + 1][k]);
        };
        for (int j = 1, L, R, rs; j <= m; j ++) {
            L = 1, R = j, rs = j;
            while (L <= R) {
                int mid = (L + R) >> 1;
                if (querymax(mid, j) == a[i][j] && querymin(mid, j) == a[i][j]) R = mid - 1, rs = mid;
                else L = mid + 1;
            }
            l[j] = max(l[j], rs);
            L = j, R = m, rs = j;
            while (L <= R) {
                int mid = (L + R) >> 1;
                if (querymax(j, mid) == a[i][j] && querymin(j, mid) == a[i][j]) L = mid + 1, rs = mid;
                else R = mid - 1;
            }
            r[j] = min(r[j], rs);
        }
        for (int j = 1; j <= m; j ++) {
            res += (ll)(j - l[j] + 1) * (r[j] - j + 1) * h[i][j];
        }
    }
    cout << res << endl;
}
 
int main () {
    ios::sync_with_stdio(false);
    cin.tie(0);
 
    lg[0] = -1;
    for (int i = 1; i < N; i ++) lg[i] = lg[i >> 1] + 1;
 
    int cass = 1; cin >> cass; while (cass --) {
        Solve ();
    }
}
```
<hr>


## README

<h1 align="center">📕【模板】悬线法</h1>
<h3> ❓ : 在 01矩阵 内求最大的 全1矩阵  面积</h3>

预处理出每个点的列中最长值，横向左移最远点，横向右移最远点，这样就有了长和高  
  
在求面积之前，还要缩一下横向端点  
原因是：  
<table>
  <tr>
    <td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td>  
  </tr>
  <tr>
    <td>1</td><td>1</td><td>0</td><td>1</td><td>0</td><td>1</td><td>1</td>  
  </tr>
  <tr>
    <td>0</td><td>1</td><td>1</td><td>x</td><td>1</td><td>1</td><td>0</td>
  </tr>
</table>
此时x点得到的是由第三行固定的左右边和整个3行的高  
但明显应需要被上面的lft和rgt继承一下才行  
所以我们要用上一行的结果在一定条件下缩边    
  

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

const int N = 1e3 + 10;
char Map[N][N];
int lft[N][N], rgt[N][N], up[N][N];

inline void solve () {

        int n = inputInt(), m = inputInt(); // 长 * 宽
        for ( int i = 1; i <= n; i ++ ) for ( int j = 1; j <= m; j ++ ) Map[i][j] = inputInt();

        for ( int i = 1; i <= n; i ++ ) {
                for ( int j = 1; j <= m; j ++ )     lft[i][j] = rgt[i][j] = j * (Map[i][j] == 1), up[i][j] = (Map[i][j] == 1); // 初始化
                for ( int j = 2; j <= m; j ++ )     if ( Map[i][j] && Map[i][j - 1] ) lft[i][j] = lft[i][j - 1]; // 递推左端点
                for ( int j = m - 1; j >= 0; j -- ) if ( Map[i][j] && Map[i][j + 1] ) rgt[i][j] = rgt[i][j + 1]; // 递推右端点
        }
        for ( int i = 2; i <= n; i ++ ) {
                for ( int j = 1; j <= m; j ++ ) if ( Map[i][j] && Map[i - 1][j] ) up[i][j] = up[i - 1][j] + 1; // 递推高
        }
        for ( int i = 2; i <= n; i ++ ) {
                for ( int j = 1; j <= m; j ++ ) {
                        if ( Map[i][j] && Map[i - 1][j] ) { // 第一行之外缩横边
                                lft[i][j] = MAX(lft[i][j], lft[i - 1][j]);
                                rgt[i][j] = MIN(rgt[i][j], rgt[i - 1][j]);
                        }
                }
        }
        int res = 0;
        for ( int i = 1; i <= n; i ++ ) {
                for ( int j = 1; j <= n; j ++ ) {
                        res = MAX(res, up[i][j] * (rgt[i][j] - lft[i][j] + 1)); // 面积 = 长 * 高
                }
        }
        outInt(res);
}

CHIVAS_{
        solve();
        _REGAL;
};
```

<hr>
