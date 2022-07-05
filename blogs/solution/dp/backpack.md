---
title: 背包DP
---
###  
<hr>

## 牛客2022寒假算法基础集训营4I_爆炸的符卡洋洋洒洒

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/23479/I"><img src="https://img-blog.csdnimg.cn/8222c48d110c41b1a01035316129a99a.png"></a>

#### 💡
限制： $\equiv0(mod\;k)$  
那么我们让背包第二维是模 $k$ 后的值即可  
由于我们很难固定从大到小转移，这里数据也不大，直接开 $2$ 维即可     

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
ll n, k;
pair<ll, ll> pr[1100];
ll dp[1100][2100];
int main () {
        ios::sync_with_stdio(false);
        memset(dp, -0x3f3f3f3f, sizeof dp);
        cin >> n >> k;
        for ( ll i = 1; i <= n; i ++ ) {
                cin >> pr[i].first >> pr[i].second;
                pr[i].first %= k;
        }
        dp[0][0] = 0;
        ll res = 0;
        for ( ll i = 1; i <= n; i ++ ) {
                for ( ll j = 0; j < k; j ++ ) {
                        dp[i][j] = max(dp[i - 1][j], dp[i - 1][((j - pr[i].first) % k + k) % k] + pr[i].second);
                } 
                res = max(res, dp[i][0]);
        }
        cout << (res == 0 ? -1 : res) << endl;
}
```
<hr>

## CodeForces1458B_GlassHalfSpilled

#### 🔗
<a href="https://codeforces.com/contest/1458/problem/B">![20220607162429](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220607162429.png)</a>

#### 💡
这是一个关于每一个位置选或者不选的问题，要一个限制个数之后的最大和  
我们首先不考虑倒水的话，这个问题也就单纯只是上面所说的  
而如果考虑倒水并洒一半的话，现有全部的水量 $sumb$ ，选 $k$ 个最大的结果是 $cur$ ，那么我们肯定是想让别的所有的全尽可能倒给这些杯子，同时受到这些杯子的容量和 $cura$ 的限制，我们此时的结果是 $cur+\min(cura,\frac{sumb-cur}{2})$   
那么问题就只剩如果求限制个数下的最大和，这就是一个 $01$ 背包的经典问题了  
令 $dp[i][j]$ 表示选了 $i$ 个杯子，总容量是 $j$ 下，水量的最大值  
那么对于第 $x$ 个杯子，$dp[i][j]=\max(dp[i][j],dp[i-1][j-a[x]]+b[x]$  
这样求完之后，在获得选 $k$ 个杯子下的答案就可以按上面的枚举 $cura$ 维护最大值求即可

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
double dp[110][10010];

int main () {
        ios::sync_with_stdio(false);
        cin.tie(nullptr);

        int n; cin >> n;
        vector<int> a(n), b(n);
        int sumb = 0, suma = 0;
        for (int i = 0; i < n; i ++) cin >> a[i] >> b[i], sumb += b[i], suma += a[i];

        for (int i = 0; i < 110; i ++) for (int j = 0; j < 10010; j ++) dp[i][j] = -1e12;
        dp[0][0] = 0;

        for (int i = 0; i < n; i ++) {
                for (int j = n; j >= 1; j --) {
                        for (int k = suma; k >= a[i]; k --) {
                                dp[j][k] = max(dp[j][k], dp[j - 1][k - a[i]] + b[i]);
                        }
                }
        }

        for (int i = 1; i <= n; i ++) {
                double res = 0;
                for (int k = 0; k <= suma; k ++) res = max(res, min(1.0 * k, dp[i][k] + (sumb - dp[i][k]) * 1.0 / 2));
                printf("%.10f ", res);
        }
}
```
<hr>


## CodeForces1516C_BabyEhabPartitionsAgain

#### 🔗
https://codeforces.com/contest/1516/problem/C

#### 💡
本题目的是让求：是否能删去一个数或者不删数，使得整个序列不可被拆分成两个相同的序列  
  
那么首先我们要知道一个序列可以被拆分成两个子序列的条件  
即和为偶数，同时可以选出来几个数的和为 sum / 2，其中 sum 是所有数的和  
所以非这两种情况下，我们根本不用删数就能保证不可拆  
那么我们在判断的时候可以使用**01背包**进行判断，在容量为 sum/2 是否有数可以凑出来这个值  
  
然后就是对删什么数的一个查找过程（利用dp思想）  
我们知道，如果整个序列除上同一个数，那么它能不能拆的答案还是跟以前一样，因为对整体效果不影响  
也就是说，一个所有数被缩小的序列能否拆开，决定了我们原数组能否被拆开，这就是我们的子问题  
这里有三种方法  
  
**方法1:**  
那么我们的目的是暴露出其中的奇数，使得这个 sum' 不再是偶数，它就不能再拆了  
所以我们对每个数不断“除2”，直到数组中出现第一个奇数，输出它的下标即可  
（但要加一个判断它是不是一开始就有奇数）  

**方法2:**  
是对方法1的一个延伸方法，就是求得每个数里面最多含了几个2  
其中含2最少的肯定就是最早变成奇数的  
这种方法好在不用最后再特判一下是不是一开始就有奇数导致我们跳过了循环  
  
**方法3:**  
是上面讲的思路的最直观解法  
我们求得整个序列的GCD  
然后对整个序列约分一下  
其中第一个奇数我们就可以删去让数组不可拆  

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
#define TEST(a) cout << "---------" << a << "---------" << endl

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
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal <vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
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

// 方法1 ------------------------------------------------------------------------------------------
inline bool is_all_even(vector<int> vec){
        for(int i = 0; i < vec.size(); i ++){
                if(vec[i] & 1) return false;
        }
        return true;
}
inline void Cout_Find_1(vector<int> vec){
        while(is_all_even(vec)){
                for(int i = 0; i < vec.size(); i ++){//每个数不断 / 2，直到第一个奇数出现
                        vec[i] >>= 1;
                        if(vec[i] & 1){
                                outInt(1); puts("");
                                outInt(i + 1); puts("");
                                return;
                        }
                }
        }
        for(int i = 0; i < vec.size(); i ++){ // 如果本身就含有奇数
                if(vec[i] & 1){
                        outInt(1); puts("");
                        outInt(i + 1); puts("");
                        return;
                }
        }
}
// --------------------------------------------------------------------------------------------------


// 方法2 ---------------------------------------------------------------------------------------------

inline void Cout_Find_2(vector<int> vec){//寻找每个数
        vector<int> b(vec.size(), 0);
        for(int i = 0; i < vec.size(); i ++){
                while(vec[i] % (1 << b[i]) == 0) b[i] ++;
                b[i] --;
        }
        int res_id = 0;
        for(int i = 0; i < vec.size(); i ++){
                if(b[i] < b[res_id]) res_id = i;
        }
        outInt(1); puts("");
        outInt(res_id + 1); puts("");
}
// ----------------------------------------------------------------------------------------------------


// 方法3 -----------------------------------------------------------------------------------------------

inline void Cout_Find_3(vector<int> vec){//直接约分整个数组
        int gcd = vec[0];
        for(int i = 0; i < vec.size(); i ++) gcd = GCD(gcd, vec[i]);
        for(int i = 0; i < vec.size(); i ++){
                vec[i] /= gcd;
                if(vec[i] & 1){
                        outInt(1); puts("");
                        outInt(i + 1); puts("");
                        return;
                }
        }
}
// ----------------------------------------------------------------------------------------------------

CHIVAS_{
        int n = inputInt();
        vector<int> a(n), dp(200010, 0);
        int sum = 0;
        for(int i = 0; i < n; i ++){
                a[i] = inputInt();
                sum += a[i];
        }
        for(int i = 0; i < n; i ++){//01背包凑sum / 2
                for(int j = sum; j >= a[i]; j --){
                        dp[j] = MAX(dp[j], dp[j - a[i]] + a[i]);
                }
        }
        if((sum & 1) || dp[sum >> 1] != (sum >> 1)){//为奇数或者凑不出来都是0
                outInt(0); puts("");
                return 0;
        }

        Cout_Find_1(a);//全是偶数且可以凑出sum / 2时，寻找要删哪个
        
        _REGAL;
}




```





<hr>

## HDUOJ2639_BoneCollector2

#### 🔗
https://acm.hdu.edu.cn/showproblem.php?pid=2639

#### 💡
在dp中，我们会获取到很多种情况  
而每一种情况都衍生出一种分支  
简单来说就是一个由决策差异产生的树状结构（但不是树形DP）   
  
  
但我们只需要前 k 种情况  
对这 k 种情况由两种决策选项产生的 2k 种状态去重排序，只需要取其中前 k 个即可  
在每次对一个新物品进行决策时都做一下这个效果，维持一下前 k 个最优解即可

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
#define TEST(a) cout << "---------" << a << "---------" << endl

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
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal <vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
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

const int maxn = 1e3 + 10;
int N, V, K, w[maxn], v[maxn];
int dp[maxn][35]; // 多开一维用于记录动态最优解
vector<int> vec; // 帮我们对第几优排序的工具人

inline void solve () {
        MEM(dp, 0); // 初始化

        N = inputInt(), V = inputInt(), K = inputInt();
        for ( int i = 1; i <= N; i ++ ) w[i] = inputInt();
        for ( int i = 1; i <= N; i ++ ) v[i] = inputInt();

        for ( int i = 1; i <= N; i ++ ) {
                for ( int j = V; j >= v[i]; j -- ) {

                        vec.clear(); // 工具人的初始化
                        for ( int o = 1; o <= K; o ++ ) {
                                vec.push_back(dp[j][o]),               // 不拿的策略压进去
                                vec.push_back(dp[j - v[i]][o] + w[i]); // 拿的策略压进去
                        }

                        sort (vec.begin(), vec.end(), greater<int>());                  // 对这些策略排个序
                        int sz = unique(vec.begin(), vec.end()) - vec.begin();          // 去重之后的个数
                        for ( int o = 1; o <= MIN(K, sz); o ++ ) dp[j][o] = vec[o - 1]; // 拿来吧你

                }
        }

        outInt(dp[V][K]); puts("");
}

CHIVAS_{
        int cass;
        for ( cass = inputInt(); cass; cass -- ) {
                solve();
        }
        _REGAL;
};



```





<hr>

## HDUOJ2844_Coins

#### 🔗
https://acm.dingbacode.com/showproblem.php?pid=2844

#### 💡
一样物品有拿的数量限制，典型的多重背包。  
多重背包要用到二进制转换来拆成01背包。<br><br>  
同时在合并dp过程中，本题的方案数是聚合形式的  
也就是说，一个子状态的最优解要整个加给父状态，实现对方案数的合并。  
<br><br>
最后 1～m 统计一下不为 0 的 dp 值的数量即可  

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

const int N = 110, M = 1e5 + 10;
int a[N], c[N];
int dp[M];

CHIVAS_{
        int n, m;
        while ( scanf("%d%d", &n, &m) == 2 && n || m ) {
                vector<int> cost; // 转换输入：二进制转换
                for ( int i = 0; i < n; i ++ ) a[i] = inputInt();
                for ( int i = 0; i < n; i ++ ) {
                        c[i] = inputInt();
                        for ( int k = 1; k <= c[i]; k <<= 1 ) {
                                c[i] -= k;
                                cost.push_back ( k * a[i] );
                        }
                        if(c[i]) cost.push_back ( c[i] * a[i] );
                }

                // 开始多重背包
                MEM(dp, 0); dp[0] = 1; // 初始化：0就是都不拿，有这么一种拿法
                for ( int i = 0; i < cost.size(); i ++ ) {
                        for ( int j = m; j >= cost[i]; j --) {
                                dp[j] += dp[j - cost[i]]; // 集合前面的方案数
                        }
                }

                int res = 0;
                for ( int i = 1; i <= m; i ++ ) res += dp[i] != 0;
                outInt(res); puts("");
        }
        _REGAL;
}


```

<hr>

## OpenJ2726_采药

#### 🔗
https://vjudge.net/problem/OpenJ_Bailian-2726

#### 💡
本题就是一个很裸的01背包模板
细节请看[学习传送门](https://chivas-regal.github.io/%E5%8A%A8%E6%80%81%E8%A7%84%E5%88%92/2021/07/20/%E8%83%8C%E5%8C%85DP.html)

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
#define TEST(a) cout << "---------" << a << "---------" << endl

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
template<typename T> inline pair<T, T> MaxInVector_ll(vector<T> vec){T MaxVal = -LNF, MaxId = 0;for(int i = 0; i < (int)vec.size(); i ++) if(MaxVal <vec[i]) MaxVal = vec[i], MaxId = i; return {MaxVal, MaxId};}
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

const int M = 1100;
int dp[M], t[20], w[20];

CHIVAS_{
        int T = inputInt(), M = inputInt();
        for ( int i = 0; i < M; i ++ ) t[i] = inputInt(), w[i] = inputInt();
        for ( int i = 0; i < M; i ++ ) {
                for ( int j = T; j >= t[i]; j -- ) {
                        dp[j] = MAX(dp[j], dp[j - t[i]] + w[i]);
                }
        }
        outInt(dp[T]);
        _REGAL;
};


```





<hr>

## UVA624_CD

#### 🔗
https://vjudge.net/problem/UVA-624

#### 💡
基本的01背包，加上记录背包内容。  
我们可以开一个 `pair<vector<int>, int> dp[N]`  
此时`dp[i].first`表示背包内容， `dp[i].second`表示背包内部价值  
在更新的时候，只需要用`second`进行比较，然后`first, second`一起更新即可  

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

const int N = 10000;
pair<vector<int>, int> dp[N];
int n, num, minutes[N];

CHIVAS_{
        while(scanf("%d%d", &n, &num) == 2){
                for ( int i = 0; i < N; i ++ ) dp[i] = {{}, 0}; //初始化
                
                for ( int i = 0; i < num; i ++ ) minutes[i] = inputInt(); 
                
                for ( int i = 0; i < num; i ++ ) {
                        for ( int j = n; j >= minutes[i]; j -- ) {
                                if(dp[j].second < dp[j - minutes[i]].second + minutes[i]) //朴素的比较
                                        dp[j] = dp[j - minutes[i]],
                                        dp[j].first.push_back(minutes[i]),
                                        dp[j].second += minutes[i]; //一起更新
                        }
                }
                for(int i = 0; i < dp[n].first.size(); i ++, putchar(' ')) outInt(dp[n].first[i]);
                printf("sum:%d\n", dp[n].second);
        }
        _REGAL;
}


```

<hr>

## UVA12589_LearningVector

#### 🔗
https://vjudge.net/problem/UVA-12589#author=0

#### 💡
<b>一个 “二维费用 + 泛化物品” 背包</b><br><br>
我们先推导一下物品价值：<br>
每一个向量 l1 会在之前的向量 l2 基础上添加一个矩形(x的延伸)和一个三角形(向量向下的面积)  
矩形的面积 = l2所能到达的y坐标 * l1的x长度  
三角形的面积 = l1的x长度 * l1的y长度  
发现这是个会变的，所以是泛化价值
<br><br>
然后推导一下dp维：    
既然我们上面要用到之前步骤中的所能到达的y坐标，所以有一维是"当前最后一个向量所能达到的y坐标"  
但我们有个条件约束是能用的向量个数，所以还有一维是"可用个数"  
<br><br>
物品价值有了，循环维度有了，分析结束

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


const int N = 100;
int dp[N * N][N]; // 依据两个信息，1：位置坐标y，2：可用个数
struct  node { int x, y; friend  bool  operator < (node a, node b) { return a.y * b.x > b.y * a.x; } } no[N]; // 贪心地排个序
int casId;

CHIVAS_{
        int cass;
        EACH_CASE ( cass ) {
                int n = inputInt(), k = inputInt(), res = 0;
                for ( int i = 0; i < N * N; i ++ ) for ( int j = 0; j < N; j ++ ) dp[i][j] = -1; dp[0][0] = 0; // 初始化

                for ( int i = 0; i < n; i ++ ) no[i] = {inputInt(), inputInt()}; sort(no, no + n);
                for ( int i = 0; i < n; i ++ ) {
                        for ( int j = N * N - 1; j >= no[i].y; j -- ) { // 位置信息的倒推
                                for ( int o = k; o >= 1; o --) { // 可用个数依赖的倒推
                                        if ( dp[j - no[i].y][o - 1] == -1 ) continue; // 之前没有达到过这个位置
                                        dp[j][o] = MAX(dp[j][o], dp[j - no[i].y][o - 1] + (j - no[i].y) * no[i].x * 2 + no[i].x * no[i].y); // 泛化的价值
                                        res = MAX(res, dp[j][o]); // 最终结果里面位置坐标那一维不好确定，这里采用实时记录
                                }
                        }
                }
                printf("Case %d: %d\n", ++ casId, res);
        }
        _REGAL;
}


```

<hr>

## CodeForces1633D_MakeThemEqual

#### 🔗
<a href="https://codeforces.com/contest/1633/problem/D"><img src="https://img-blog.csdnimg.cn/49789d91e1e64995ab4a9a865e8f080b.png"></a>

#### 💡
首先我们肯定要去求一下每个数最少被 $1$ 跑多少遍，设为$[stp]$  
然后我们现在的条件可以建模为：有 $k$ 的容积，$n$ 个物品，每个物品容积价值也有  
那么就是背包问题  
  
如果 $O(nk)$ 肯定会超时，但是我们注意到，$max[stp]$ 不会很大  
所以其实所有物品的体积加起来不会达到 $1e6$  
那么我们可以通过这个压缩一下容积进行求解  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
const ll N = 1e3 + 10;
ll stp[N];
ll vis[N];
ll dp[1000005];
ll mx = 0;

inline void BFS () {
        queue<pair<ll, ll> > q;
        q.push({1, 0});
        while ( q.size() ) {
                pair<ll, ll> cur = q.front(); q.pop();
                if ( cur.first > 1000 || vis[cur.first] ) continue; vis[cur.first] = 1;
                stp[cur.first] = cur.second;
                for ( ll x = 1; x <= cur.first; x ++ ) 
                        q.push({cur.first + cur.first / x, cur.second + 1});
        } 
}

inline void Solve () {
        ll n, m; cin >> n >> m;
        vector<ll> b, c; b.push_back(0); c.push_back(0);
        ll sum = 0;
        for ( ll i = 1; i <= n; i ++ ) {
                ll x; cin >> x;
                b.push_back(stp[x]);
                sum += stp[x];
        }
        for ( ll i = 1; i <= n; i ++ ) {
                ll x; cin >> x;
                c.push_back(x);
        }
        m = min(m, sum);
        memset(dp, 0, sizeof dp);
        for ( ll i = 1; i <= n; i ++ ) {
                for ( ll j = m; j >= b[i]; j -- ) {
                        dp[j] = max(dp[j], dp[j - b[i]] + c[i]);
                }
        }
        cout << dp[m] << endl;
}

int main () {
        memset(stp, 0x3f3f3f3f, sizeof stp);
        BFS(); 
        ios::sync_with_stdio(false);
        ll cass; cin >> cass; while ( cass -- ) {
                Solve ();
        }
}
```
<hr>
