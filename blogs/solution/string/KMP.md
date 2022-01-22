---
title: KMP
---
###  
<hr>

## CodeForces1200E_CompressWords

#### 🔗
https://codeforces.com/problemset/problem/1200/E

#### 💡
题目意思是，每次合并 res 和当前字符串 s   
我们在合并时有可能会删去字符串，但是删去的长度不会超过s  
所以我们在匹配时只需要匹配不超过vec[i]长度的res与vec[i]的公共前后缀  

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

#define CHIVAS_ inline int MAIN()
#define _REGAL return 0;

#define SP system("pause")
#define IOS ios::sync_with_stdio(false)
//#define map unordered_map

#define pbb pair<bool, bool>
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
inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

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

namespace Solution_In_Codeforces{
        inline void solve();
        namespace N_cass {
                void Main(){ int cass; for ( cin >> cass; cass; cass -- ) { solve();} };
        }
        namespace One_cass {
                void Main(){ solve(); };
        }
}
inline void Solution_In_Codeforces::solve() {}




inline void Get_next ( int *nxt, string s ) { // 自获取nxt数组
        nxt[0] = -1;
        for ( int i = 0, j = -1; i < s.size(); i ++ ) {
                while ( j >= 0 && s[i + 1] != s[j + 1] ) j = nxt[j];
                if ( s[i + 1] == s[j + 1] ) j ++;
                nxt[i + 1] = j;
        }
}
inline int KMP ( string a, string b ) { // kmp前后缀匹配
        int nxt[b.size() + 10];
        int res;
        Get_next(nxt, b);
        for ( int i = -1, j = -1; i + 1 < a.size(); i ++ ) {
                while ( j >= 0 && b[j + 1] != a[i + 1] ) j = nxt[j];
                if ( b[j + 1] == a[i + 1] ) j ++;
                if ( i + 1 == a.size() - 1 ) res = j;
                if ( j + 1 == b.size() ) j = nxt[j];
        }return res + 1;
}


CHIVAS_{
        int n; cin >> n;
        vector<string> vec;
        for ( int i = 0; i < n; i ++ ) {
                string s; cin >> s;
                vec.push_back(s);
        }
        string res = vec[0];
        for ( int i = 1; i < n; i ++ ) {
                int las = MIN(res.size(), vec[i].size() + 1);           // res后面用来匹配vec[i]的长度
                string a = res.substr(res.size() - las, las);           // res后面用来匹配vec[i]的字符串
                int com = KMP(a, vec[i]);                               // a 与 vec[i] 匹配后得到的要删去字符的数量
                res += vec[i].substr(com, vec[i].size() - com + 1);     // res 加上这次匹配的字符
        } cout << res << endl;
        _REGAL;
}















int main(){

#ifndef ONLINE_JUDGE
freopen("in.in", "r", stdin);
freopen("out.out", "w", stdout);
#endif

        MAIN();

#ifndef ONLINE_JUDGE
cerr    << "\033[1m\033[31m\n" 
        << "\n\n===============================\n" 
        << "|| Time elapsed: " << 1.0 * clock() / CLOCKS_PER_SEC << " s. ||\n" 
        << "===============================" 
        << "\033[0m";
#endif

        exit(0);
}
```

<hr>

## HDU1686_Oulipo

#### 🔗
https://acm.hdu.edu.cn/showproblem.php?pid=1686

#### 💡
由于这里每匹配上一次后可以重复匹配  
所以在匹配到最后计数完成后，副串不用回到-1，只需要回溯一次nxt即可  

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
inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

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

namespace Solution_In_Codeforces{
        inline void solve();
        namespace N_cass {
                int Main(){ int cass; for ( cin >> cass; cass; cass -- ) { solve();} return 0;};
        }
        namespace One_cass {
                int Main(){ solve(); return 0;};
        }
}
inline void Solution_In_Codeforces::solve(){};


const int N = 1e6 + 10;

class KMP_node{
private:
        string a, b;
        int nxt[N];

public:
        inline KMP_node ( string aa, string bb ) {
                a = aa;
                b = bb;
        }
        inline void Get_Next ( ) {
                for ( int i = 0; i < N; i ++ ) nxt[i] = -1;
                int j = -1, m = b.size();
                for ( int i = 0; i + 1 < m; i ++ ) {
                        while ( j >= 0 && b[i + 1] != b[j + 1] ) j = nxt[j];
                        if ( b[i + 1] == b[j + 1] ) j ++;
                        nxt[i + 1] = j;
                }
        }
        inline int KMP ( ) {
                int n = a.size(), m = b.size();
                int j = -1, res = 0;
                for ( int i = -1; i + 1 < n; i ++ ) {
                        while ( j >= 0 && a[i + 1] != b[j + 1] ) j = nxt[j];
                        if ( a[i + 1] == b[j + 1]) j ++;
                        if ( j == m - 1 ) {
                                res ++;
                                j = nxt[j];
                        }
                }
                return res;
        }
};

string sa, sb;




inline void Main(){IOS;
        int cass;
        for ( cin >> cass; cass; cass -- ){
                cin >> sa >> sb;
                KMP_node kmp = KMP_node(sb, sa);
                kmp.Get_Next();
                cout << kmp.KMP() << endl;
        }
}
















































int main(){

#ifndef ONLINE_JUDGE
freopen("in.in", "r", stdin);
freopen("out.out", "w", stdout);
#endif

        Main();

#ifndef ONLINE_JUDGE
cerr << "\033[1m\033[31m" << "\n\n===============================\n" << "|| Time elapsed: " << 1.0 * clock() / CLOCKS_PER_SEC << " s. ||\n" << "===============================" << "\033[0m";
#endif

        return 0;
}
```

<hr>

## HDU2087_剪花布条

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=2087

#### 💡
KMP模板  
但是不能重复  
所以一旦判成一次j要变-1  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  
  

```cpp
#pragma region
#pragma GCC optimize(3,"Ofast","inline")
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
#include <map>
#include <set>
#define G 10.0
#define LNF 1e18
#define eps 1e-6
#define PI acos(-1.0)
#define ll long long
#define INF 0x7FFFFFFF
#define Regal exit(0)
#define Chivas int main()
#define pb(x) push_back(x)
#define SP system("pause")
#define Max(a,b) ((a)>(b)?(a):(b))
#define Min(a,b) ((a)<(b)?(a):(b))
#define IOS ios::sync_with_stdio(false)
#define mm(a, b) memset(a, b, sizeof(a))
#define each_cass(cass) for (cin>>cass; cass; cass--)
#define test(a) cout << "---------" << a << "---------" << '\n'
 
using namespace std;
#pragma endregion

//全局变量
#pragma region
struct node_KMP{
    string a, b;
    int nxt[1010];
    inline void GetNext(){//模式串自己和自己匹配的过程
        int len = b.size();
        for(int i = 0; i < len; i ++) nxt[i] = -1;//初始化nxt
        int j = -1;//i和j要错一位，不然都相等了
        for(int i = 0; i < len - 1; i ++){
            while(j >= 0 && b[j + 1] != b[i + 1]) j = nxt[j];//j要向前拉
            if(b[i + 1] == b[j + 1]) j ++;//都匹配j可以++
            nxt[i + 1] = j;//记录每个点的nxt值，因为判就按下一位判的，所以每次存的都是下一位的nxt
        }
    }
    inline int KMP(){//a和b匹配的过程
        int lenb = b.size();
        int lena = a.size();
        int j = -1;
        int cnt = 0;
        for(int i = -1; i < lena - 1; i ++){
            while(j >= 0 && b[j + 1] != a[i + 1]) j = nxt[j];//向前拉
            if(b[j + 1] == a[i + 1]) j ++;
            if(j == lenb - 1){//因为判都是按下一位判的，所以j的下一位到头了就是成功了
                cnt ++;
                j = -1;//前面的裁掉了，要重新开始了
            }
        }
        return cnt;
    }
};
#pragma endregion

//主体------------------------------------------

Chivas{
    string a, b;
    node_KMP nd;
    IOS;
    while(cin >> a, a != "#"){
        cin >> b;

        nd.a = a, nd.b = b;
        nd.GetNext();
        cout << nd.KMP() << endl;

    }
    Regal;
}
```

<hr>

## HDU2594_Simpson'sHiddenTalents

#### 🔗
http://acm.hdu.edu.cn/showproblem.php?pid=2594

#### 💡
把两个串拼在一起  
求总串的nxt值但不能超过两个串的最小长度  
  
这里就算一下a的nxt值  
然后KMP中b和a向后走  
b的后面和a的nxt含的长度匹配  
若b走到尾时看一下a的j在哪，就是b的后缀中a的前缀匹配的长度  

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

#define CHIVAS_ inline int Main()
#define _REGAL return 0;

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
inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

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

namespace Solution_In_Codeforces{
        inline void solve();
        namespace N_cass {
                int Main(){ int cass; for ( cin >> cass; cass; cass -- ) { solve();} return 0;};
        }
        namespace One_cass {
                int Main(){ solve(); return 0;};
        }
}
inline void Solution_In_Codeforces::solve(){};


const int N = 5e4 + 10;

class KMP_node{
private:
        string a, b;
        int nxt[N];

public:
        inline KMP_node ( string aa, string bb) { a = aa; b = bb; }
        inline void Get_Next ( ) {
                int j = -1;
                for ( int i = 0; i < N; i ++ ) nxt[i] = -1;
                for ( int i = 0; i + 1 < a.size(); i ++ ) {
                        while ( j >= 0 && a[j + 1] != a[i + 1] ) j = nxt[j];
                        if ( a[j + 1] == a[i + 1] ) j ++;
                        nxt[i + 1] = j;
                }
        }
        inline void KMP ( ) {
                int j = -1, res = 0;
                for ( int i = -1; i + 1 < b.size(); i ++ ) {
                        while ( j >= 0 && a[j + 1] != b[i + 1] ) j = nxt[j];
                        if ( a[j + 1] == b[i + 1] ) j ++;
                        if ( i + 1 == b.size() - 1 ) res = j;
                        if ( j == a.size() - 1 ) j = nxt[j];
                }
                if ( res == -1 ) cout << "0" << endl;
                else cout << a.substr(0, res + 1) << " " << res + 1 << endl;
        }
};

string sa, sb;

CHIVAS_{IOS;
        while ( cin >> sa >> sb ) {
                KMP_node kmp = KMP_node(sa, sb);
                kmp.Get_Next();
                kmp.KMP();
        }
        _REGAL;
}
















































int main(){

#ifndef ONLINE_JUDGE
freopen("in.in", "r", stdin);
freopen("out.out", "w", stdout);
#endif

        Main();

#ifndef ONLINE_JUDGE
cerr << "\033[1m\033[31m" << "\n\n===============================\n" << "|| Time elapsed: " << 1.0 * clock() / CLOCKS_PER_SEC << " s. ||\n" << "===============================" << "\033[0m";
#endif

        exit(0);
}
```

<hr>

## HDU3336_CountTheString

#### 🔗
https://acm.hdu.edu.cn/showproblem.php?pid=3336

#### 💡
开始的时候想到，如果枚举出来前缀，然后用KMP搜一遍  
时间O(n^2)，肯定会超时  
  
那么想到KMP是使用nxt数组进行回溯到重复的公共前后缀  
那么我们可以发现每一次回溯都是因为有一个相同的串（而且如果前面顶到头，则就与前缀有关了）  
那么我们只需要每个位置统计一下回溯的数量即可  
不断回溯时间过长，可以使nxt[i]递推出dp[i] = dp[nxt[i]] + 1  

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

#define CHIVAS_ inline int Main()
#define _REGAL return 0;

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
inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

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

namespace Solution_In_Codeforces{
        inline void solve();
        namespace N_cass {
                int Main(){ int cass; for ( cin >> cass; cass; cass -- ) { solve();} return 0;};
        }
        namespace One_cass {
                int Main(){ solve(); return 0;};
        }
}

const int mod = 1e4 + 7;
const int N = 2e5 + 10;

class KMP_node{
private:
        string a, b;
        int nxt[N], dp[N];

public:
        inline KMP_node ( string aa, string bb ) { a = aa, b = bb; }
        inline void Get_Next ( ) {
                int j = -1;
                for ( int i = 0; i < b.size(); i ++ ) nxt[i] = -1, dp[i] = 0;
                for ( int i = 0; i + 1 < b.size(); i ++ ) {
                        while ( j >= 0 && b[j + 1] != b[i + 1] ) j = nxt[j];
                        if ( b[j + 1] == b[i + 1] ) j ++;
                        nxt[i + 1] = j;
                }
        }
        inline int Work ( ) { // 既然每次回溯都证明有一个公共串（也就是有一个相等的），回溯太慢，我们用nxt递推
                int res = 0;
                for ( int i = 0; i < b.size(); i ++ ) {
                        dp[i] = dp[nxt[i]] + 1;
                        res = (res + dp[i]) % mod;
                }
                return res;
        }
};

inline void Solution_In_Codeforces::solve(){
        int n; cin >> n; string s; cin >> s;
        KMP_node kmp = KMP_node("", s);
        kmp.Get_Next();  
        cout << kmp.Work() << endl;
}

CHIVAS_{IOS;
        Solution_In_Codeforces::N_cass::Main();
        _REGAL;
}









































int main(){

#ifndef ONLINE_JUDGE
freopen("in.in", "r", stdin);
freopen("out.out", "w", stdout);
#endif

        Main();

#ifndef ONLINE_JUDGE
cerr << "\033[1m\033[31m" << "\n\n===============================\n" << "|| Time elapsed: " << 1.0 * clock() / CLOCKS_PER_SEC << " s. ||\n" << "===============================" << "\033[0m";
#endif

        exit(0);
}
```

<hr>

## HDU5763_AnotherMeaning

#### 🔗
https://acm.hdu.edu.cn/showproblem.php?pid=5763

#### 💡
在计算时我们发现这是一个方案数递推  
那么可以得到，这道题可以使用dp汇聚方案  
a串在每个点是否可以表示为一个 * 取决于这一点是否以b串结尾  
那么就有一线性递推式：若mark[i] = 1, dp[i] = dp[i - 1] + dp[i - b.size()]  
使用kmp不裁剪拼接一下

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

#define CHIVAS_ inline int MAIN()
#define _REGAL return 0;

#define SP system("pause")
#define IOS ios::sync_with_stdio(false)
//#define map unordered_map

#define pbb pair<bool, bool>
#define pii pair<int, int> 
#define pll pair<ll, ll>
#define PB(x) push_back(x)
#define ALL(a) a.begin(),a.end()
#define MEM(a, b) memset(a, b, sizeof(a))
#define EACH_CASE(cass) for ( int cass = inputInt(); cass; cass--)

#define LS l, mid, rt << 1
#define RS mid + 1, r, rt << 1 | 1
#define GETMID (l + r) >> 1

using namespace std;
inline int inputInt(){int X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1);}
inline void outInt(int X){if(X<0) {putchar('-'); X=~(X-1);}int s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}
inline ll inputLL(){ll X=0; bool flag=1; char ch=getchar();while(ch<'0'||ch>'9') {if(ch=='-') flag=0; ch=getchar();}while(ch>='0'&&ch<='9') {X=(X<<1)+(X<<3)+ch-'0'; ch=getchar();}if(flag) return X;return ~(X-1); }
inline void outLL(ll X){if(X<0) {putchar('-'); X=~(X-1);}ll s[20],top=0;while(X) {s[++top]=X%10; X/=10;}if(!top) s[++top]=0;while(top) putchar(s[top--]+'0');}

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

namespace Solution_In_Codeforces{
        inline void solve();
        namespace N_cass {
                void Main(){ int cass; for ( cin >> cass; cass; cass -- ) { solve();} };
        }
        namespace One_cass {
                void Main(){ solve(); };
        }
}
inline void Solution_In_Codeforces::solve() {}















// =============================================================  BeginCode  ==========================================================================================


const ll mod = 1e9 + 7;
const ll N = 100005;
int nxt[N];
ll mark[N], dp[N]; // 标记， 递推
ll CasId = 0;

inline void Get_Next ( string s ) {
        nxt[0] = -1;
        for ( ll i = 0, j = -1; i < s.size(); i ++ ) {
                while ( j >= 0 && s[i + 1] != s[j + 1] ) j = nxt[j];
                if ( s[i + 1] == s[j + 1] ) j ++;
                nxt[i + 1] = j;
        }
}

inline void KMP ( string a, string b ) {
        MEM(mark, 0);
        Get_Next ( b );
        for ( ll i = -1, j = -1; i + 1 < a.size(); i ++ ) {
                while ( j >= 0 && a[i + 1] != b[j + 1] ) j = nxt[j];
                if ( a[i + 1] == b[j + 1] ) j ++;
                if ( j + 1 == b.size() ) mark[i + 1] = 1, j = nxt[j]; // 若凑成了就在这个位置标记一下
        }
}

CHIVAS_{
        EACH_CASE( cass ) {
                string a, b; cin >> a >> b;
                cout << "Case #" << ++CasId << ": ";

                KMP(a, b);
                //for ( int i = 0; i < a.size(); i ++ ) cout << mark[i] << " "; cout << endl;

                dp[0] = 1;      
                for ( int i = 1; i <= a.size(); i ++ ) {
                        dp[i] = dp[i - 1];
                        if ( mark[i - 1] ) dp[i] = (dp[i] + dp[i - b.size()]) % mod;
                }cout << dp[a.size()] << endl;
        }
        _REGAL;
}









// =============================================================  EndCode  ==========================================================================================
































int main(){

#ifndef ONLINE_JUDGE
freopen("in.in", "r", stdin);
freopen("out.out", "w", stdout);
#endif

        MAIN();

#ifndef ONLINE_JUDGE
cerr    << "\033[1m\033[31m\n" 
        << "\n\n===============================\n" 
        << "|| Time elapsed: " << 1.0 * clock() / CLOCKS_PER_SEC << " s. ||\n" 
        << "===============================" 
        << "\033[0m";
#endif

        exit(0);
}
```

<hr>

## PTA_好中缀

#### 🔗
https://pintia.cn/problem-sets/1384757951243542528/problems/1384758301778305035

#### 💡
是一个单一对next数组的应用过程

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >  
  

```cpp
#pragma GCC optimize(3,"Ofast","inline")
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
#define PI acos(-1.0)
#define ll long long
#define INF 0x7FFFFFFF
#define Regal exit(0)
#define Chivas int main()
#define pb(x) push_back(x)
#define SP system("pause")
#define Max(a,b) ((a)>(b)?(a):(b))
#define Min(a,b) ((a)<(b)?(a):(b))
#define IOS ios::sync_with_stdio(false)
#define mm(a, b) memset(a, b, sizeof(a))
#define each_cass(cass) for (cin>>cass; cass; cass--)
#define test(a) cout << "---------" << a << "---------" << '\n'
 
using namespace std;

const int maxn = 100005;

int Next[maxn];
int ans[maxn];
string s;

inline void get_next(){
    int i = 0;
    int k = -1;
    Next[0] = -1;
    int len = s.size();
    while(i < len){
        if(k == -1 || s[i] == s[k]) Next[++i] = ++k;
        else                        k = Next[k];
    }
}


Chivas{
    IOS;
    getline(cin,s);
    get_next();
    
    int len = s.size();
    int len_ans = 0;
    int j = Next[s.size()];
    while(j > 0){
        ans[len_ans ++] = j;
        j = Next[j];
    }
    sort(ans, ans + len_ans, greater<int>());

    if(s.size() == 1){
        cout << "1" << endl;
        Regal;
    }

    int res = len - ans[1] * 2;
    if(res < 0) res = 0;
    printf("%d", res);
    Regal;
}
```

<hr>
