---
title: 排序
---

###  
<hr>

## 洛谷P1493_分梨子

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1493">![20221113214831](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221113214831.png)</a>

#### 💡
如果确定了两个最小值 $a0,b0$ ，那么我们枚举的要满足 $a_i\ge a0,b_i\ge b0,c1*(a_i-a0)+c2*(b_i-b0)\le c3$  
既然已知 $a0,b0$ ，将这些常数移动过去 $c1*a_i+c2*b_i\le c1*a0+c2*b0+c3$  
但是这样走是一个 $n^3$ 的复杂度，由于是最值那么根据单调性优化   
对于选择顺序无所谓，于是首先按 $a$ 升序排序  
那么从前往后枚举的 $a$ 是从小到大的，则 $a$ 枚举到哪那么哪就是 $a0$  
然后对于 $b$ 的选择，我们在 $a$ 递增时让 $b$ 递减，表示 $b$ 枚举到哪那么哪就是 $b0$  
则可以保证不等号右侧是递减的，既然这一步不满足的 $c1*a_i+c2*b_i$ ，下一步依然不满足      
则对于这一步我们可以使用一个大根堆存放 $c1*a_i+c2*b_i$ ，实时弹出即可，然后弹到合法后维护大根堆内容数量的最大值 

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
# define int ll

int c1, c2, c3, n;
struct node {
    int a, b;
} a[2010];

int res;

inline bool cmp1 (node a, node b) { return a.a < b.a; }
inline bool cmp2 (node a, node b) { return a.b > b.b; }

signed main () {
    ios::sync_with_stdio(false); 
    cin.tie(0);

    cin >> n >> c1 >> c2 >> c3;
    for (int i = 1; i <= n; i ++) cin >> a[i].a >> a[i].b;

    sort(a + 1, a + n + 1, cmp1);
    for (int i = 1; i <= n; i ++) {
        int a0 = a[i].a;
        sort(a + i, a + n + 1, cmp2);
        priority_queue<ll> pque;
        for (int j = i; j <= n; j ++) {
            int b0 = a[j].b;
            ll k = c1 * a0 + c2 * b0 + c3;
            pque.push(c1 * a[j].a + c2 * a[j].b);
            while (pque.size() && pque.top() > k) pque.pop();
            res = max(res, (int)pque.size());
        }
        sort(a + i, a + n + 1, cmp1);
    }
    cout << res << endl;
}
```
<hr>


## HDUOJ6318_SwapsAndInversions

#### 🔗
https://acm.hdu.edu.cn/showproblem.php?pid=6318

#### 💡
关键其实在于：能否想到逆序对就是一个数组化为顺序需要交换的步数  
然后发现其实支付的钱选最小的那个就行了  
用逆序对数乘一下  
（归并求逆序对比较方便）

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


const int N = 100005;

int n;
ll x, y;

int a[N], b[N];
ll cnt, siz;
struct node { // 离散结构体
        int val, order;
        inline friend  bool operator < ( node an, node bn ) {
                return an.val < bn.val;
        }
}nd[N];

inline void Init ( ) { siz = 1, cnt = 0; }

inline void Merge ( int a[], int l, int r ) { // 归并排序
        if ( l == r )  return ;
        int mid = (l + r) >> 1;

        Merge ( a, l, mid );
        Merge( a, mid + 1, r);

        int i = l, j = mid + 1;
        for ( int k = l; k <= r; k ++ ) { // 按照次序合并两个数组
                if ( j > r || (i <= mid  && a[i] <= a[j])) b[k] = a[i ++];
                else cnt += mid - i + 1, b[k] = a[j ++]; 
        }
        for ( int k = l; k <= r; k ++ ) a[k] = b[k]; // 换回来
}

inline void solve ( ) { Init();

        // 离散化
        for ( int i = 1; i <= n; i ++ ) nd[i].val = inputInt(), nd[i].order = i; sort(nd + 1, nd + n + 1);
        for ( int i = 1; i <= n; i ++ ) {
                if ( i == 1 ) a[nd[i].order] = 1;
                else {
                        if ( nd[i].val == nd[i - 1].val ) a[nd[i].order] = siz;
                        else a[nd[i].order] = ++ siz;
                }
        }

        // 获得结果
        cnt = 0;
        Merge(a, 1, n);
        outLL(cnt * MIN(x, y)); puts("");
}

CHIVAS_{
        while( scanf("%d%lld%lld", &n, &x, &y) == 3 ) {
                solve();
        }
        _REGAL;
};

```

<hr>
