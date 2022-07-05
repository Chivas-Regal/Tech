---
title: Trie树
---
###  
<hr>

## 牛客NC50992_前缀统计

#### 🔗
https://ac.nowcoder.com/acm/contest/1010/A

#### 💡


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  
  

```cpp
#include <algorithm>
#include <iostream>
#include <cstring>
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
#define eps 1e-6
#define ll long long
#define INF 0x7FFFFFFF
#define PI acos(-1.0)
#define pb(x) push_back(x)
#define SP system("pause")
#define mm(a, b) memset(a, b, sizeof(a))
#define fir(i, a, n) for (int i = a; i <= n; i++)
#define rif(i, a, n) for (int i = a; i >= n; i--)
#define each_cass(cass) for (cin >> cass; cass; cass--)

using namespace std;
const int maxn = 1e6+10;
struct Trie{
    int nxt;
    int cnt;
}trie[maxn][26];
int tot = 1;

void insert(string s){
    int deep = 1;
    for (int i = 0; i < s.size(); i++){
        int cur_c = s[i] - 'a';
        if(!trie[deep][cur_c].nxt)
            trie[deep][cur_c].nxt = ++tot;
        deep = trie[deep][cur_c].nxt;
        if (i == s.size() - 1)
            trie[deep][cur_c].cnt++;
    }
}
int search(string s){
    int deep = 1;
    int num=0;
    for (int i = 0; i < s.size(); i++){
        deep = trie[deep][s[i] - 'a'].nxt;
        if(deep==0)
            break;
        num += trie[deep][s[i] - 'a'].cnt;
    }
    return num;
}

int main()
{
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < n; i++){
        string s;
        cin >> s;
        insert(s);
    }
    for (int i = 0; i < m; i++){
        string s;
        cin >> s;
        cout<<search(s)<<endl;
    }
    return 0;
}
```

<hr>

## AcWing145_最大异或对

#### 🔗
https://www.acwing.com/problem/content/145/

#### 💡
用字典树储存 x 二进制后每一位的数  
在查找时都尽量找每一位与当前查找元素相反的数  
维护最大值即可  

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

const int N = 1e5 + 10;
int trie[40 * N][2], tot, a[N];

inline void Insert ( int x ) {
        int p = 0;
        for ( int i = 30; i >= 0; i -- ) {
                int u = x >> i & 1; // 取出那一位的数
                if( ! trie[p][u] ) trie[p][u] = ++ tot;
                p = trie[p][u];
        }
}

inline int Query ( int x ) {
        int p = 0, res = 0;
        for ( int i = 30; i >= 0; i -- ) {
                int u = x >> i & 1;
                if ( trie[p][!u] ) p = trie[p][!u], res = res << 1 | 1;
                else               p = trie[p][u],  res = res << 1;
        }return res;
}

CHIVAS_{
        int n = inputInt(), res = 0;
        for ( int i = 0; i < n; i ++ ) a[i] = inputInt(), Insert(a[i]);
        for ( int i = 0; i < n; i ++ ) res = MAX(res, Query(a[i]));
        outInt(res);
        _REGAL;
};


```

<hr>

## CodeForces817E_ChoosingTheCommander

#### 🔗
<a href="https://codeforces.com/contest/817/problem/E">![20220614180407](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220614180407.png)</a>

#### 💡
本题是让所有的士兵的 $P\oplus a<b$ 的个数，且又有插入又有删除又有询问，比较明显使用字典树  
字典树每个节点要表示这个节点的编号与这个节点被插入数字的数量  
询问小于的太广泛了，我们可以用 $P\oplus a=b$ 也就是 $p=a\oplus b$ 划一根字典树上的分界线，我们只需要计算在“小于”这个分界线的一侧的即可    
而根据二进制的高位优越性，即如果两个二进制串的前缀都相同，那么第一个不同的位便可决定谁大谁小  
所以我们从高到低将一个数字分解二进制插入字典树中，对于当前位 $b_i=1$ ，则我们保证我们选择的子树根当前位是 $!a_i$ 便可以保证这个子树下的所有点异或 $a$ 都小于 $b$ ，便直接累加上这个子节点被插入的数量， $res+t[][!a_i]$   
然后我们走 位为 $a_i\oplus b_i$ 的子树来保证我们走的是相等的分界线   

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 1e5 + 10;

struct node {
        int val;
        int num;
};

struct Trie {
        node t[N * 40][2];
        int idx;
        inline void Insert (int x) {
                int p = 0;
                for (int i = 30; i >= 0; i --) {
                        int u = x >> i & 1;
                        if (!t[p][u].val) t[p][u] = {++idx, 1};
                        else t[p][u].num ++;
                        p = t[p][u].val;
                }
        }
        inline void Delete (int x) {
                int p = 0;
                for (int i = 30; i >= 0; i --) {
                        int u = x >> i & 1;
                        t[p][u].num --;
                        int tmp = p;
                        p = t[p][u].val;
                        if (!t[tmp][u].num) t[tmp][u].val = 0;
                }
        }
        inline int Calc (int x, int y) {
                int res = 0;
                int p = 0;
                for (int i = 30; i >= 0; i --) {
                        int xi = x >> i & 1;
                        int yi = y >> i & 1;
                        if (yi == 1) res += t[p][xi].num;
                        p = t[p][xi ^ yi].val;
                        if (p == 0) return res;
                }
                return res;
        }
}trie;

int main () {
        ios::sync_with_stdio(false);
        cin.tie(nullptr);

        int m; cin >> m;
        while (m --) {
                int op; cin >> op;
                if (op == 1) {
                        int x; cin >> x;
                        trie.Insert(x);
                } else if (op == 2) {
                        int x; cin >> x;
                        trie.Delete(x);
                } else {
                        int x, y; cin >> x >> y;
                        cout << trie.Calc(x, y) << endl;
                }
        }  
}
```
<hr>


## CodeForces1625D_BinarySpiders

#### 🔗
<a href="https://codeforces.com/contest/1625/problem/D">![20220304141042](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220304141042.png)</a>

#### 💡
考虑 $k$ 有 $m$ 位，若一对数 $m$ 以上的位存在不同的，那么必然可以  
若一对数 $m$ 以上的位相同，那么去检查相同的内部是否存在两者 $\oplus\ge k$  
那么存 $m$ 以上的前缀  
- 不同，随便选
- 相同，考虑 $a\oplus b\ge k,a\oplus c\ge k\Longrightarrow a_m\neq b_m,a_m\neq c_m\Longrightarrow b_m=c_m\Longrightarrow b\oplus c\lt k$，所以此时最多可以选两个，但至少可以选一个  
  
同前缀内可以用 $Trie$ 数去查每个数的最大异或  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 3e5 + 10;

int n, k, m;
map<int, int> id;
map<int, vector<int> > pres;

inline int Bits ( int x ) {
        int res = 0;
        while ( x ) x >>= 1, res ++;
        return res;
}

namespace Trie {
        int t[N * 30][2], idx;
        inline void Init () { memset(t, 0, sizeof (int) * 2 * (idx + 1)); idx = 0; }
        inline void Insert ( int x ) {
                int p = 0;
                for ( int i = 30; i >= 0; i -- ) {
                        int u = x >> i & 1;
                        if ( !t[p][u] ) t[p][u] = ++ idx;
                        p = t[p][u];
                }
        }
        inline int Query ( int x ) {
                int res = 0, p = 0;
                for ( int i = 30; i >= 0; i -- ) {
                        int u = x >> i & 1;
                        if ( !t[p][!u] ) {
                                res = res << 1 | u;
                                p = t[p][u];
                        } else {
                                res = res << 1 | (!u);
                                p = t[p][!u];
                        }
                }
                return res;
        }
}

int main () {
        ios::sync_with_stdio(false);

        cin >> n >> k; m = Bits(k);
        for ( int i = 1; i <= n; i ++ ) {
                int x; cin >> x;
                pres[x >> m].push_back(x);
                id[x] = i;
        }
        if ( k == 0 ) {
                cout << n << endl;
                for ( int i = 1; i <= n; i ++ ) cout << i << " ";
                return 0;
        }
        vector<int> res; 
        for ( auto pre : pres ) {
                bool flag = false;
                Trie::Init();
                for ( auto x : pre.second ) {
                        int t = Trie::Query(x);
                        if ( (t ^ x) >= k ) {
                                res.push_back(id[t]);
                                res.push_back(id[x]);
                                flag = true;
                                break;
                        }
                        Trie::Insert(x);
                }
                if ( !flag ) res.push_back(id[pre.second[0]]);
        }
        if ( res.size() <= 1 ) cout << "-1" << endl;
        else {
                cout << res.size() << endl;
                for ( auto i : res ) cout << i << " ";
                cout << endl;
        }
}
```
<hr>

## CodeForces1658D2_388535（Hard Version）

#### 🔗
<a href="https://codeforces.com/contest/1658/problem/D2">![20220331202954](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220331202954.png)</a>

#### 💡
首先 $[a]$ 中一定存在一个 $[l\oplus x]$   
那么枚举 $[a]$ 看谁是就可以  
但问题是如果去检查是否可以  
考虑 $[l,r]$ 固定了一个最小值一个最大值  
且由于不同的数异或同一个数得出的数也是不同的，那么如果知道最大值最小值我们就可以得到整个区间  
而在字典树中我们可以去查找异或的最小值最大值  
我们去检查对应的 $x$ 即 $a_i\oplus l$ 在整个字典树中的最小值最大值是不是 $l$ 和 $r$ 即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const int N = 2e5 + 10;
 
namespace Trie {
        int t[N * 5][2], idx;
        inline void Init () {
                memset(t, 0, idx * 2 * sizeof(int));
                idx = 0;
        }
        inline void Insert ( int val ) {
                int p = 0;
                for ( int i = 17; i >= 0; i -- ) {
                        int u = val >> i & 1; 
                        if ( !t[p][u] ) t[p][u] = ++ idx;
                        p = t[p][u];
                }
        }
        inline int Query_Max ( int val ) {
                int p = 0, res = 0;
                for ( int i = 17; i >= 0; i -- ) {
                        int u = val >> i & 1;
                        if ( t[p][!u] ) {
                                res = res << 1 | 1;
                                p = t[p][!u];
                        } else {
                                res = res << 1;
                                p = t[p][u];
                        }
                }
                return res;
        }
        inline int Query_Min ( int val ) {
                int p = 0, res = 0;
                for ( int i = 17; i >= 0; i -- ) {
                        int u = val >> i & 1;
                        if ( t[p][u] ) {
                                res = res << 1;
                                p = t[p][u];
                        } else {
                                res = res << 1 | 1;
                                p = t[p][!u];
                        }
                }
                return res;
        }
}
 
inline void Solve() {
        int l, r; cin >> l >> r;
        Trie::Init();
        vector<int> a(r - l + 1); for ( int &i : a ) cin >> i, Trie::Insert(i);
 
        for ( int i : a ) {
                int mn = Trie::Query_Min(i ^ l);
                int mx = Trie::Query_Max(i ^ l);
                if ( mn == l && mx == r ) {
                        cout << (i ^ l) << endl;
                        return;
                }
        }
}
```
<hr>

