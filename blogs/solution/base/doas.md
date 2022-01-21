---
title: 模拟
---

## 洛谷P1067_多项式输出

#### 🔗
https://vjudge.net/problem/%E8%AE%A1%E8%92%9C%E5%AE%A2-T2057#author=Chivas_Regal

#### 💡
将每一部分分为三部分  
1.符号  
2.系数  
3.指数后缀  
  
符号注意是不是第一位即可  
  
系数若abs>1使用绝对值，但要特判如果是最后一位且是1的情况  
  
后缀就是i不是最后一位的时候输出x，且不是倒数第二位的时候输出指数  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>

using namespace std;

int main () {
        
        int n; cin >> n;
        for ( int i = 0, x; i <= n; i ++ ) {
                cin >> x;
                if ( !x ) continue;

                // 前符号
                if ( x > 0 ) { if ( i ) cout << "+"; }
                else cout << "-"; 

                // 系数
                if ( abs(x) > 1 ) cout << abs(x);
                else if ( abs(x) == 1 && i == n ) cout << 1;
                
                // 后缀
                if ( i == n ) continue;
                cout << "x";
                if ( i != n - 1 ) cout << "^" << n - i;
        }

}
```

<hr>

## CodeForces1512C_A-BPanlindrom

#### 🔗
<a href="https://codeforces.com/problemset/problem/1512/C"><img src="https://img-blog.csdnimg.cn/20210411072936231.png"></a>

#### 💡
对于模拟题，考验的就是细心程度  
在字符串构造和判断中，我是先将字符串打造成易于我去操作的形式  
在本题中我先使得字符串是个回文串，如果在构造时发现有的地方确定不回文了，输出-1  
然后对已有的'0'和'1'计数，并在a和b中删去，如果a和b在计数的时候就有<0的了，就输出-1  
此时我们的'?'都是一对一对的或者中间有一个  
从[0~s.size()/2]进行修'?'，如果a和b有>=2的，就对这个位置设为'0'或'1'，并a-=2或b-=2，最后是对奇数长度的判断(奇数长度中心的'?'会没有被重载)，查看a和b是否有不为0的，并将该点设为'0'或'1'  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
void solve()
{
    int a, b;
    cin >> a >> b;
    string s;
    cin >> s;

    //使串回文
    for (int i = 0; i < s.size(); i++)
    {
        if (s[s.size() - 1 - i] != '?' && s[i] != '?' && s[s.size() - 1 - i] != s[i])//确定不回文的情况
        {
            cout << "-1" << endl;
            return;
        }
        if (s[s.size() - 1 - i] == '?')
            s[s.size() - 1 - i] = s[i];
    }

    //初步计数'0'和'1'
    for (int i = 0; i < s.size(); i++)
    {
        if (s[i] == '1')
            b--;
        else if (s[i] == '0')
            a--;
    }
    if(a<0||b<0){//计数不通过的情况
        cout << "-1" << endl;
        return;
    }

    //'?'的设置
    for (int i = 0; i < s.size() / 2; i++)
    {
        if(s[i]=='?')
        {
            if (a < 2 && b < 2)//没法设置的情况
            {
                cout << "-1" << endl;
                return;
            }
            if (a >= 2)
            {
                s[i] = s[s.size() - 1 - i] = '0';
                a -= 2;
            }
            else if (b >= 2)
            {
                s[i] = s[s.size() - 1 - i] = '1';
                b -= 2;
            }
        }
    }
    if(s.size()&1){
        if(a)
            s[s.size() / 2] = '0';
        else if(b)
            s[s.size() / 2] = '1';
    }
    cout << s << endl;
}
int main()
{
    int cass;
    each_cass(cass)
    {
        solve();
    }
    return 0;
}
```

<hr>

## CodeForces1549C_WebofLies

#### 🔗
<a href="https://codeforces.com/problemset/problem/1549/C"><img src="https://i.loli.net/2021/11/27/c1P67L3nyMprmNu.png"></a>

#### 💡
看起来是个图论+数据结构题  
但是有个很明显的模拟方式  
（先纸上模拟流程）  
  
开始时所有人都活着，所以res设为n  
每连一个边，小的数死了，但大的数还是或者，所以受影响的只有小数（此时考虑以点权正负作为判断一个人死活的信息）  
每删一个边，小的数可能活了，大的数不受影响，所以发现正负点权还不够，小的数是否能活取决于有多少个让它变成负数的点  
所以可以考虑到初始为0，每次连边小的数-1，删边小的数+1  
在加减点权的时候动态维护一下所有人里面点权为0的个数即可实现O(1)查询    

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

int mp[200010]; // 记录点权

inline void solve ( ) {
        int n, m; cin >> n >> m;
        int res = n;
        for ( int i = 0; i < m; i ++ ) {
                int x, y; cin >> x >> y;
                int minn = MIN(x, y), maxx = MAX(x, y); // 找出小的
                if ( mp[minn] == 0 ) res --; mp[minn] --;
        }
        int q; cin >> q;
        for ( int i = 0; i < q; i ++ ) {
                int op; cin >> op;
                if ( op == 1 ) {
                        int x, y; cin >> x >> y;
                        int minn = MIN(x, y), maxx = MAX(x, y); // 找出小的
                        if ( mp[minn] == 0 ) res --; mp[minn] --;
                } else if ( op == 2 ) {
                        int x, y; cin >> x >> y;
                        int minn = MIN(x, y), maxx = MAX(x, y); // 找出小的
                        if ( mp[minn] == -1 ) res ++; mp[minn] ++;
                } else {
                        cout << res << endl;
                }
        }
}

CHIVAS_{
        solve();
}
```

<hr>

## CodeForces1555B_TwoTables

#### 🔗
https://codeforces.com/contest/1555/problem/B

#### 💡
首先可以很明显知道：如果两个方块的宽之和>W，长之和也>H，那么这两个方块没法分开  
那么根据这个规律又能知道：第二个方块必定塞到角落里面，从而使得第一个方块通过平移即可分开  
那么由这个规律，我们只需要模拟出第一个方块应该向（横竖左右）哪平移成立且最小  
通过第二个块中心+第一个块的边长到边界的距离这个关系即可开始模拟  

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


inline void solve ( ) {
        double x1, y1, x2, y2;
        double W, H, w1, h1, w2, h2; cin >> W >> H;
        cin >> x1 >> y1 >> x2 >> y2 >> w2 >> h2;
        w1 = fabs(x1 - x2); h1 = fabs(y1 - y2);
        if ( w1 + w2 > W && h1 + h2 > H ) {
                cout << "-1" << endl;
                return ;
        }

        double midx = (x1 + x2) / 2, midy = (y1 + y2) / 2;

        double resToCol = 1e9, resToRow = 1e9;
        if ( w1 + w2 <= W ) { // 横向平移成立
                if ( midx >= w2 + w1 / 2 ) { // 本来就分开了，不用移动
                        puts("0.000000"); 
                        return;
                }
                if ( W - midx >= w2 + w1 / 2 ) { // 本来就分开了，不用移动
                        puts("0.000000");
                        return;
                }
                resToCol = MIN(fabs(midx - w2 - w1 / 2), fabs(W - midx - w2 - w1 / 2)); // 求横向移动的最近距离
                
        } 
        if ( h1 + h2 <= H ) {
                if ( midy >= h2 + h1 / 2 ) { // 本来就分开了，不用移动
                        puts("0.000000");
                        return;
                }
                if ( H - midy >= h2 + h1 / 2 ) { // 本来就分开了，不用移动
                        puts("0.000000");
                        return;
                }
                resToRow = MIN(fabs(midy - h2 - h1 / 2), fabs(H - midy - h2 - h1 / 2)); // 求竖向移动的最近距离
        }
        printf("%.6f\n", MIN(resToCol, resToRow)); // 横向移动与竖向移动求最小移动距离
}


CHIVAS_{
        int cass;
        EACH_CASE ( cass ) {
                solve();
        }
        _REGAL;
}
```

<hr>

## CodeForces1593B_MakeItDivisibleBy25

#### 🔗
<a href="https://codeforces.com/contest/1593/problem/B"><img src="https://i.loli.net/2021/10/14/MlcQW16wzOqIeDh.png"></a>

#### 💡
首先逆序一下好找  
可以确定的是每次找的都是两个字符  
且答案是最后一个字符的位置-1  
那么就写一个函数，找两个字符，找到第一个之后开始第二重循环找第二个，如果找到就返回j-1，否则就是返回inf  
  
对找四种字符`'0','0'`、`'5', '2'`、`'0', '5'`、`'5', '7'`进行比较  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
inline int find ( string s, char a, char b ) {
        for ( int i = 0; i < s.size(); i ++ ) {
                if ( s[i] == a ) {
                        for ( int j = i + 1; j < s.size(); j ++ ) {
                                if ( s[j] == b ) return j - 1;
                        }
                        return 0x3f3f3f3f; // 找到第一个a再找b找不到那就没办法了
                }
        }
        return 0x3f3f3f3f; // 连a也找不到
}

inline void Solve () {
        string s; cin >> s; reverse(s.begin(), s.end());
        cout << min ( min(find(s, '0', '0'), find(s, '5', '2')), min ( find(s, '0', '5'), find(s, '5', '7')) ) << endl;
}

int main () {
        ios::sync_with_stdio(false);
        int cass; cin >> cass; while ( cass -- ) {
                Solve ();
        }
        return 0;
}
```

<hr>

## CodeForces1911C_PolycarpRecoversThePermutation

#### 🔗
<a href="https://codeforces.com/contest/1611/problem/C"><img src="https://i.loli.net/2021/11/26/piMymS25GXldJUF.png"></a>

#### 💡
a按几乎固定顺序得到b  
给定b求a  
反着求结果，那么就可以反着模拟  
  
这道题的多变就只在于最后一个元素应该放在哪  
反着模拟就是每次挑出最大的  
然后由于最后一步的变化可以得到两种情况（放左边和放右边）    
看看这两种情况能否推出来a  

如果两种都推不出来就肯定是-1  
否则的话哪种能推出来就输出哪个  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
inline bool same ( deque<int> a, deque<int> b ) { // 两个队列一样
        while ( a.size() ) {
                if ( a.back() != b.back() ) return false;
                a.pop_back(); b.pop_back();
        }
        return true;
}
 
inline bool Check ( deque<int> a, deque<int> b ) { // 看看a能否正着推出b
        deque<int> crt1, crt2;
        while ( a.size() > 1 ) {
                if ( a.front() < a.back() ) {
                        crt1.push_front(a.front());
                        crt2.push_front(a.front());
                        a.pop_front();
                } else {
                        crt1.push_back(a.back());
                        crt2.push_back(a.back());
                        a.pop_back();
                }
        }
        crt1.push_back(a.back());
        crt2.push_front(a.back());
        if ( same(crt1, b) || same(crt2, b) ) return true;
        return false;
}
 
inline void Solve () {
        int n; cin >> n;
        deque<int> dq, tmp;
        for ( int i = 0, x; i < n; i ++ ) cin >> x, dq.push_back(x), tmp.push_back(x);
        deque<int> crt1, crt2; // b反推a的两种情况
        while ( dq.size() > 1 ) {
                if ( dq.front() > dq.back() ) {
                        crt1.push_front(dq.front());
                        crt2.push_front(dq.front());
                        dq.pop_front();
                } else {
                        crt1.push_back(dq.back());
                        crt2.push_back(dq.back());
                        dq.pop_back();
                }
        }
        crt1.push_back(dq.back());
        crt2.push_front(dq.back());
        // 看看有没有可以转化成tmp
        if ( Check(crt1, tmp) ) {
                while ( crt1.size() ) cout << crt1.front() << " ", crt1.pop_front();
        } else if ( Check(crt2, tmp) ) {
                while ( crt2.size() ) cout << crt2.front() << " ", crt2.pop_front();
        } else cout << -1;
        cout << endl;
}
 
int main () {
        ios::sync_with_stdio(false);
        int cass; cin >> cass; while ( cass -- ) {
                Solve ();
        }
}
```

<hr>

## HDU2021多校(5)6_CuteTree

#### 🔗
<a href="https://acm.dingbacode.com/showproblem.php?pid=7017"><img src="https://i.loli.net/2021/10/14/MIyoid2FSAQEbRv.png"></a>

#### 💡
分析一下数组的遍历没有什么用  
用处就是每次的`tot++`  
硬写也就log  
直接模拟就行了

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
int n;
int tot;

inline void dfs ( int l, int r ) {
        tot ++;
        if ( l == r ) return;
        if ( r - l == 1 ) {
                dfs ( l, l );
                dfs ( r, r );
        } else {
                int len = r - l + 1;
                int b = l + ( len / 3 + (len % 3 != 0) ) - 1;
                int c = (b + r) / 2;
                dfs ( l, b );
                dfs ( b + 1, c );
                dfs ( c + 1, r );
        }
}

inline void Solve () {
        tot = 0; cin >> n;
        for ( int i = 0, x; i < n; i ++ ) cin >> x;
        dfs ( 1, n );
        cout << tot << "\n";
}

int main () {
        ios::sync_with_stdio(false);
        int cass;
        for ( cin >> cass; cass; cass -- ) {
                Solve();
        }
}
```

<hr>
