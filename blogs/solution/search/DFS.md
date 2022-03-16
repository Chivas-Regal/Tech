---
title: DFS
---
###  
<hr>

## 洛谷P1034_矩形覆盖

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1034"><img src="https://i.loli.net/2021/11/08/zkj1RuNLO2AfIS6.png"></a>

#### 💡
我们必然是想将所有的点分为连续的  <img src="https://latex.codecogs.com/svg.image?\inline&space;k" title="\inline k" />  块  
即要么双关键字  <img src="https://latex.codecogs.com/svg.image?\inline&space;(x,y)" title="\inline (x,y)" /> 要么  <img src="https://latex.codecogs.com/svg.image?\inline&space;(y,x)" title="\inline (y,x)" />   
单一种不行是有可能相临的两个  <img src="https://latex.codecogs.com/svg.image?\inline&space;x" title="\inline x" /> (或  <img src="https://latex.codecogs.com/svg.image?\inline&space;y" title="\inline y" /> ) 之间的 <img src="https://latex.codecogs.com/svg.image?\inline&space;y" title="\inline y" /> (或  <img src="https://latex.codecogs.com/svg.image?\inline&space;x" title="\inline x" /> )差的很大，这样的话就排一种其实也是选择得相对分散了  
我们对这两个方式排过序后，每种都计算一下在这种排序方案下我们能得到的最小值，进行比较一下即可  
  
至于怎么算最小值，我们可以枚举最多  <img src="https://latex.codecogs.com/svg.image?\inline&space;k-1" title="\inline k-1" />  个断点  
以断点进行分割计算每一块的最大最小  <img src="https://latex.codecogs.com/svg.image?\inline&space;x" title="\inline x" /> 和最大最小  <img src="https://latex.codecogs.com/svg.image?\inline&space;y" title="\inline y" /> ，他们差值的乘积就是这一个矩形的面积

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 100;
int n, k;
struct Point {
        int x, y;
} pt[N];

inline void DFS ( vector<int> paus, int num, int &res ) { // 断点，我们需要的断点数量，传递答案
        if ( paus.size() == num ) {
                int cur = 0;
                paus.push_back(n);
                for ( int k = 1; k < paus.size(); k ++ ) {
                        int maxX = 0, maxY = 0, minX = 0x3f3f3f3f, minY = 0x3f3f3f3f;
                        for ( int i = paus[k - 1] + 1; i <= paus[k]; i ++ ) {
                                maxX = max(maxX, pt[i].x), minX = min(minX, pt[i].x),
                                maxY = max(maxY, pt[i].y), minY = min(minY, pt[i].y);
                        }
                        cur += (maxX - minX) * (maxY - minY);
                }
                res = min(res, cur);
                return;
        }
        for ( int i = paus.back() + 1; i < n; i ++ ) {
                paus.push_back(i); 
                DFS ( paus, num, res );
                paus.pop_back();
        }
}

int main () {
        int res = 0x3f3f3f3f;
        cin >> n >> k;
        for ( int i = 1; i <= n; i ++ ) cin >> pt[i].x >> pt[i].y;
        sort ( pt + 1, pt + 1 + n, [&]( Point a, Point b ) {
                if ( a.x != b.x ) return a.x < b.x;
                return a.y < b.y;
        } );
        for ( int i = 1; i <= k; i ++ ) {
                DFS({0}, i, res);
        }
        sort ( pt + 1, pt + 1 + n, [&]( Point a, Point b ) {
                if ( a.y != b.y ) return a.y < b.y;
                return a.x < b.x;
        } );
        for ( int i = 1; i <= k; i ++ ) {
                DFS({0}, i, res);
        }
        cout << res << endl;
}

```

<hr>

## 洛谷P1041_传染病控制

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1041"><img src="https://i.loli.net/2021/11/08/7R9mzdfIFSvkqEl.png"></a>

#### 💡
感性地理解一下，从根开始传播，每一次只能取一个点隔断  
那其实就是，每一次选择一个深度的一个点进行隔断  
  
我们可以暴力搜一下，对于一个深度，我们选择哪些点进行隔断  
当然如果这个点上面有祖先已经被隔断了，那么这个点是安全的，就不需要进行隔断  
我们其实要算的就是最后不安全的点数的最小值  
  
我们先预处理出深度数组  
然后  <img src="https://latex.codecogs.com/svg.image?\inline&space;Dfs" title="\inline Dfs" />  每次下潜一个深度  
在这个深度下枚举我们要隔断哪个不安全的点  
隔断后这个点的子树全部变为安全（通过又一种深搜  <img src="https://latex.codecogs.com/svg.image?\inline&space;Save" title="\inline Save" /> 实现，当然我们要回溯一下再变成不安全代表我们不选  
每一次进行隔断都会安全化整个子树，所以我们预处理时也统计一下所有节点的子树大小即可  
  
每次走到最深的点时就维护一下  <img src="https://latex.codecogs.com/svg.image?\inline&space;res" title="\inline res" /> 的最小值

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
int res = 0x3f3f3f3f;

namespace Map {
        const int M = 610;
        int head[M], cnt;
        struct Edge {
                int nxt, to;
        } edge[M];

        inline void add_Edge ( int from, int to ) {
                edge [ ++ cnt ] = { head[from], to };
                head[from] = cnt;
        }
} using namespace Map;

const int N = 310;
namespace TreeInformation {
        int dep[N], fa[N], mxdep, sz[N];
        inline void dfs ( int x, int fath ) {
                fa[x] = fath; dep[x] = dep[fath] + 1; sz[x] = 1;
                mxdep = max ( mxdep, dep[x] );
                for ( int i = head[x]; i; i = edge[i].nxt ) {
                        int to = edge[i].to;
                        if ( to == fath ) continue;
                        dfs ( to, x );
                        sz[x] += sz[to];
                }
        }
        int saf[N];
        inline void Save ( int x, int is ) {
                for ( int i = head[x]; i; i = edge[i].nxt ) {
                        int to = edge[i].to;
                        if ( to == fa[x] ) continue;
                        saf[to] = is;
                        Save ( to, is );
                }
        }
} using namespace TreeInformation;


vector<int> vec[N]; // vec[i]表示深度为i的点集合
int n, m;
map<int, int> tmp;

inline void Solve ( int d, int num ) {
        bool flag = false;
        if ( d > mxdep ) { res = min(res, num); return ;}
        for ( auto id : vec[d] ) {
                if ( saf[id] ) continue;
                saf[id] = 1; Save ( id, 1 );
                Solve ( d + 1, num - sz[id] );
                saf[id] = 0; Save ( id, 0 );
                flag = true;
        }
        if ( !flag ) res = min ( res, num );
}

int main () {
        ios::sync_with_stdio(false);
        cin >> n >> m;
        for ( int i = 0, x, y; i < m; i ++ ) {
                cin >> x >> y;
                add_Edge ( x, y );
                add_Edge ( y, x );
        }
        dfs ( 1, 1 );
        for ( int i = 1; i <= n; i ++ ) vec[dep[i]].push_back(i);
        Solve ( 2, n );
        cout << res << endl;       
}
```

<hr>

## 洛谷P1074_靶形数独

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1074"><img src="https://i.loli.net/2021/11/11/LxriZwV6NmY9oua.png"></a>

#### 💡
大小很小，多枝多可能  
于是直接开爆搜  
  
仔细一想约束条件就有很多了  
比如同行同列不能出现两个相同的  
同九宫格不能出现两个相同的  
  
那么我们开一个行数组列数组块数组  
记录一下每块、每行、每列是否有  <img src="https://latex.codecogs.com/svg.image?\inline&space;i" title="\inline i" />   
这样的话就是搜索的结果，剪枝剪下去也不会非常大  
而且还能保证最后出来的都是完成的数独    

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <vector>

#define ll long long

using namespace std;

const int N = 15;
int a[N][N];
int res = -1;

bool row[N][N], col[N][N], blk[N][N]; // ()[i][j] 第 i (行、列、块) 是否有 j

inline int which ( int x, int y ) { // 第几块
        if ( x < 3 ) {
                if ( y < 3 ) return 1;
                if ( y < 6 ) return 2;
                if ( y < 9 ) return 3;
        } else if ( x < 6 ) {
                if ( y < 3 ) return 4;
                if ( y < 6 ) return 5;
                if ( y < 9 ) return 6;
        } else {
                if ( y < 3 ) return 7;
                if ( y < 6 ) return 8;
                if ( y < 9 ) return 9;
        }
}

inline void DFS ( int i, int j ) {
        if ( j >= 9 ) {
                int cur = 0;
                for ( int x = 0; x < 9; x ++ ) {
                        for ( int y = 0; y < 9; y ++ ) {
                                if      ( x >= 4 && x <= 4 && y >= 4 && y <= 4 ) cur += a[x][y] * 10;
                                else if ( x >= 3 && x <= 5 && y >= 3 && y <= 5 ) cur += a[x][y] * 9;
                                else if ( x >= 2 && x <= 6 && y >= 2 && y <= 6 ) cur += a[x][y] * 8;
                                else if ( x >= 1 && x <= 7 && y >= 1 && y <= 7 ) cur += a[x][y] * 7;
                                else                                             cur += a[x][y] * 6;
                        }
                }

                res = max ( res, cur );
                return;
        }

        int nxtj = j + (i + 1) / 9; // 下一个的列
        int nxti = (i + 1) % 9;     // 下一个的行
 
        if ( a[i][j] ) DFS ( nxti, nxtj ); // 预订了
        else {
                for ( int num = 9; num >= 1; num -- ) if ( !row[i][num] && !col[j][num] && !blk[which(i, j)][num] ) { // 都满足就搜下去
                        row[i][num] = col[j][num] = blk[which(i, j)][num] = 1;
                        a[i][j] = num; DFS ( nxti, nxtj ); a[i][j] = 0;
                        row[i][num] = col[j][num] = blk[which(i, j)][num] = 0;          
                }
        }
}

int main () {
        for ( int i = 0; i < 9; i ++ ) for ( int j = 0; j < 9; j ++ ) {
                scanf("%d", &a[i][j]);
                if ( a[i][j] ) 
                        row[i][a[i][j]] = col[j][a[i][j]] = blk[which(i, j)][a[i][j]] = 1;
        }
        DFS ( 0, 0 );
        printf("%d\n", res);
        return 0;
}
```

<hr>

## 洛谷P1127_词链

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1127"><img src="https://i.loli.net/2021/11/15/VW5bIh9EFe4RArd.png"></a>

#### 💡
看到这道题第一反应应该是要想到搜索的  
每一个词后面选择性接词  
排个序，如果接到n个词的话第一次就一定是解，输出  
我们预处理出来以每个字母开头的字符串集合  
  
DFS，然后发现TLE两个点  
考虑优化  
看一下有无解的关系   
如果一个字母作为首字母的次数小于作为尾字母次数-1，一定不行   
如果一个字母作为首字母的数量是作为尾字母的数量+1  
那么这个字母必定要作为词链首字母  
如果这样的字母出现多于一个的话就一定不行，冲突了  
如果是一个的话就遍历这一个就行了  
如果没有的话就说明成环，每一个跑一遍就行了  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
vector<int> chr[30];
int n;
string s[1100];

int vis[1100];
int asBeg[30];
int asEnd[30];

inline void dfs ( vector<int> id ) {
        if ( id.size() == n ) {
                for ( int i = 0; i < id.size(); i ++ ) {
                        if ( i ) cout << ".";
                        cout << s[id[i]];
                }
                exit(0);
        }

        for ( int i = 0; i < chr[s[id.back()].back() - 'a'].size(); i ++ ) {
                if ( !vis[chr[s[id.back()].back() - 'a'][i]] ) {
                        vis[chr[s[id.back()].back() - 'a'][i]] = 1;
                        id.push_back(chr[s[id.back()].back() - 'a'][i]); dfs ( id ); id.pop_back();
                        vis[chr[s[id.back()].back() - 'a'][i]] = 0;
                }
        }
}


int main () {
        cin >> n;
        for ( int i = 0; i < n; i ++ ) 
                cin >> s[i],
                asBeg[s[i][0] - 'a'] ++,
                asEnd[s[i].back() - 'a'] ++;
        sort ( s, s + n );
        for ( int i = 0; i < n; i ++ )
                chr[s[i][0] - 'a'].push_back(i);
        
        int num_char_can_first = 0;
        char char_can_first;
        for ( char i = 'a'; i <= 'z'; i ++ ) {
                if ( asBeg[i - 'a'] == asEnd[i - 'a'] + 1 ) 
                        num_char_can_first ++,
                        char_can_first = i;
                if ( asBeg[i - 'a'] < asEnd[i - 'a'] - 1 ) { cout << "***" << endl; exit(0); }
        }

        if ( num_char_can_first > 1 ) {
                cout << "***" << endl;
        } else if ( num_char_can_first == 1 ) {
                for ( int i = 0; i < n; i ++ ) {
                        if ( s[i][0] == char_can_first ) {
                                vis[i] = 1;
                                dfs ( {i} );
                                vis[i] = 0;
                        }
                }
        } else {
                for ( int i = 0; i < n; i ++ ) {
                        vis[i] = 1;
                        dfs ( {i} );
                        vis[i] = 0;
                }
        }
        cout << "***" << endl;
}
```

<hr>

## 洛谷P1363_幻象迷宫

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1363"><img src="https://i.loli.net/2021/10/23/utags5MohH7nNpw.png"></a>

#### 💡
对于一个点，如果在两张图中且两次到达这个点，那么这个图就可以彻底连通  
那么我们用一个vis数组来维护一个点是否被不折回跑地两次到达  
那么就是两个变量控制不取模的原始位置，一个变量控制是否走过  
如果一个取模后的位置被走过且另外两个变量有一个与当前位置不同，就代表不折回跑地到达了两次  
遍历就行了  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
int n, m;
string s[2000];
int flag = 0;
int dx[4] = {0, 0, -1, 1};
int dy[4] = {1, -1, 0, 0};
int vis[2000][2000][3];

inline void dfs ( int x, int y, int X, int Y ) {
        if ( s[x][y] == '#' ) return;
        if ( flag ) return;
        if ( vis[x][y][0] && ( vis[x][y][1] != X || vis[x][y][2] != Y ) ) {flag = 1; return;} // 走过模坐标但是有一个老坐标不和新坐标相等

        vis[x][y][0] = 1, vis[x][y][1] = X, vis[x][y][2] = Y; // 记录一下新坐标

        for ( int i = 0; i < 4; i ++ ) {
                int curx = (x + dx[i] + n) % n, cury = (y + dy[i] + m) % m;
                int curX = X + dx[i], curY = Y + dy[i];
                if ( vis[curx][cury][1] != curX || vis[curx][cury][2] != curY || !vis[curx][cury][0] ) // 三个变量控制是不是走的是走过的点
                        dfs ( curx, cury, curX, curY );
        }
}

inline void Solve () {
        flag = 0; memset ( vis, 0, sizeof vis );
        int sttx, stty;
        for ( int i = 0; i < n; i ++ ) {
                cin >> s[i];
                for ( int j = 0; j < m; j ++ ) {
                        if ( s[i][j] == 'S' ) sttx = i, stty = j;
                }
        }
        dfs ( sttx, stty, sttx, stty );
        if ( flag ) cout << "Yes" << endl;
        else        cout << "No" << endl;
}

int main () {
        while ( cin >> n >> m ) {
                Solve ();
        }
}
```

<hr>

## 洛谷P1434_滑雪

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1434"><img src="https://i.loli.net/2021/10/23/hAd9QENCRYW4mB5.png"></a>

#### 💡
对于每个点，在搜索的时候记录一下它能到达的最远距离  
然后每一次搜索都是最优子问题的汇聚过程  
每一个点对每一个可以转移的连接点进行连接，这些点的dfs()+1就是当前点的最优子问题之一  
对每一个点都dfs一边即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
int n, m;
int a[110][110];
int dp[110][110];
int dx[4] = {0, 0, -1, 1};
int dy[4] = {1, -1, 0, 0};
int res = 0;

inline int dfs ( int x, int y ) {
        if ( dp[x][y] > 1 ) return dp[x][y];
        for ( int i = 0; i < 4; i ++ ) {
                if ( x + dx[i] >= 0 && x + dx[i] < n && y + dy[i] >= 0 && y + dy[i] < m && a[x + dx[i]][y + dy[i]] < a[x][y] ) 
                        dp[x][y] = max(dp[x][y], dfs ( x + dx[i], y + dy[i] ) + 1);
        }
        return dp[x][y];
}

int main () {
        ios::sync_with_stdio(false);
        cin >> n >> m;
        for ( int i = 0; i < n; i ++ ) for ( int j = 0; j < m; j ++ ) cin >> a[i][j], dp[i][j] = 1;
        for ( int i = 0; i < n; i ++ ) for ( int j = 0; j < m; j ++ ) res = max ( res, dfs ( i, j ) );
        cout << res << endl;
}
```

<hr>


## 牛客2022寒假算法基础集训营5C_战棋小孩

#### 🔗
<a href="https://ac.nowcoder.com/acm/contest/23480/C"><img src="https://img-blog.csdnimg.cn/2708fd8a9f264f8fb798415f3d4b4c9e.png"></a>

#### 💡
首先能得到的思考是  
每一局游戏肯定是选能选的最大得分  
如果已知所有的最大得分，我们就可以降序排序，让贡献最多的放在前面  
那么问题就在于，如果去分配礼遇情况  
由于游戏局数十分少，我们看一下最大复杂度即 $\binom{20}{10}$ 其实也不是很大  
所以我们可以 $01$ 暴力搜索去分配礼遇  
递归出口的时候用最大得分 `sort` 一下与要求得分比对一下即可  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
ll n, k, s;
ll p[40];
struct node {
        ll a, b, c, d;
        bool chs;
        inline friend bool operator < ( node a, node b ) {
                int mxa, mxb;
                if ( a.chs == 1 ) mxa = max(max(a.a, a.b), max(a.c, a.d));
                else              mxa = max(a.a, a.b);
                if ( b.chs == 1 ) mxb = max(max(b.a, b.b), max(b.c, b.d));
                else              mxb = max(b.a, b.b);
                return mxa > mxb;
        }
} nd[40], tmp[40];
int RES = 0;

inline void DFS ( vector<int> chss, int num ) {
        if ( chss.size() == k ) {
                for ( int i = 1; i <= n; i ++ )          tmp[i] = nd[i];
                for ( int i = 0; i < chss.size(); i ++ ) tmp[chss[i]].chs = 1;
                sort ( tmp + 1, tmp + 1 + n );

                ll cur = s; int res = 0;
                for ( int i = 1; i <= n; i ++ ) {
                        if ( tmp[i].chs ) cur += max(max(tmp[i].a, tmp[i].b), max(tmp[i].c, tmp[i].d));
                        else              cur += max(tmp[i].a, tmp[i].b);
                        if ( cur >= p[i] ) res ++;
                } 
                RES = max(RES, res);
                return;
        }
        for ( int i = num + 1; i <= n; i ++ ) {
                chss.push_back(i);
                DFS(chss, i);
                chss.pop_back();
        }
}

int main () {
        ios::sync_with_stdio(false);
        cin >> n >> k >> s;
        for ( int i = 1; i <= n; i ++ ) cin >> p[i];
        for ( int i = 1; i <= n; i ++ ) cin >> nd[i].a >> nd[i].b >> nd[i].c >> nd[i].d;
        DFS({}, 0);
        cout << RES << endl;
}
```
<hr>

## CodeForces1647D_MadokaAndTheBestSchoolInRussia

#### 🔗
<a href="https://codeforces.com/contest/1647/problem/D">![20220314171101](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220314171101.png)</a>

#### 💡
先将问题抽象出来  
求 $a_1a_2\dots a_nd^n=x$ 其中 $a$ 均不为 $d$ 的倍数  
问我们是否可以构造出来至少两组  
这个 $a$ 可以采用爆搜，由于每次都是枚举的当前 $x$ 的因数，所以 $\sqrt{n}$ 即可  
每次填入一个 $a$ 就代表 $x$ 要下降一层 $d$  
若下降不了就只能退出  
出口可以设置为我们已经找出来了两种构造方式或者我们当前的数过大  
 
#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
ll x, d;
int cnt;

map<pair<ll, ll>, bool> mp;

inline void DFS ( ll tgt, ll cur, ll bak ) {
        if ( cnt == 2 || cur > tgt ) return;
        if ( cur == tgt ) {
                cnt ++;
                return;
        }

        if ( mp.count({tgt, cur}) ) return; mp[{tgt, cur}] = true;
        if ( tgt % d ) return; tgt /= d;

        for ( ll i = bak; i * i <= tgt; i ++ ) {
                if ( tgt % i == 0 ) {
                        if (i % d)          DFS(tgt, cur * i, i);
                        if (i * i != tgt && (tgt / i) % d)  DFS(tgt, cur * (tgt / i), tgt / i);
                }
        }
}

inline void Solve () {
        cin >> x >> d;
        cnt = 0;
        mp.clear();

        DFS(x, 1, 1);

        if (cnt == 2) cout << "YES\n";
        else cout << "NO\n";
}

int main () {
        cin.tie(0)->sync_with_stdio(0);
        cin.exceptions(cin.failbit);
        int cass; cin >> cass; while ( cass -- ) {
                Solve ();
        }
}
```
<hr>

## ICPC2020沈阳D_JourneyToUn'Goro

#### 🔗
<a href="https://codeforces.com/gym/103202/problem/D">![20220315215209](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20220315215209.png)</a>

#### 💡
从题中要求的 $1$ 的个数为奇数，我们从<b>奇偶性</b>入手  
令 $P_i$ 表示前缀为 $i$ 的串的 $1$ 的个数  
$P_i-P_j$ 为奇数，即 $P_i$ 与 $P_j$ 的奇偶性不同的对均满足  
那么就意味着我们 $[P]$ 的奇偶要对半开  
令参数 $cnt0$ 表示 $P_i$ 为偶数的个数，$cnt1$ 表示 $P_i$ 为奇数的个数，那么 $max(cnt0,cnt1)\le\left\lceil\frac{n+1}{2}\right\rceil$  
利用这个条件进行前缀剪枝 $DFS$   
要求字典序最小就优先开 $b$  
  
开 $b$ 时奇偶性不变，顺接上一层的奇偶状态  
开 $r$ 后奇偶变化，改变奇偶状态  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >
```cpp
int n;
int nres;
char s[100005];
 
inline void DFS ( int idx, int cnt0, int cnt1, bool st ) {
        if ( max(cnt0, cnt1) > (n + 2) / 2 ) return;
        if ( idx == n ) {
                cout << s << endl;
                if ( ++ nres == 100 ) exit(0);
                return;
        }
 
        s[idx] = 'b'; DFS(idx + 1, cnt0 + (!st), cnt1 + st, st);
        s[idx] = 'r'; DFS(idx + 1, cnt0 + st, cnt1 + (!st), !st);
}
 
int main () {
        cin.tie(0)->sync_with_stdio(0);
        cin.exceptions(cin.failbit);
 
        cin >> n;
        ll res = 0; for ( int i = 1; i <= n; i += 2 ) res += 1ll * n - i + 1;
        cout << res << endl;
        DFS(0, 1, 0, 0);
}
```
<hr>


