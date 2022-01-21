---
title: 最短路
---

## 洛谷P1027_Car的旅行路线

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1027"><img src="https://i.loli.net/2021/11/08/jh9RDYaMGVCAg1t.png"></a>

#### 💡
其实刚开始想的是一个dp的解法  
想着全排列一下然后从a到b每一个城市四个点由上一个城市四个点跑火车和跑飞机推过来  
想到时间复杂度过不去， <img src="https://latex.codecogs.com/svg.image?\inline&space;O(n\times&space;n!)" title="\inline O(n\times n!)" />   
然后~~这一看不就是个图论吗~~  
建好边然后四个点各跑一次  <img src="https://latex.codecogs.com/svg.image?\inline&space;Dijkstra" title="\inline Dijkstra" />   
从  <img src="https://latex.codecogs.com/svg.image?\inline&space;a" title="\inline a" /> 城市的四个点到  <img src="https://latex.codecogs.com/svg.image?\inline&space;b" title="\inline b" /> 城市的四个点一共  <img src="https://latex.codecogs.com/svg.image?\inline&space;16" title="\inline 16" /> 种走法选最短的就行了...

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 15;
const int NN = 100;
const int M = 1e6;
const double eps = 1e-9;

struct Contry {
        double x[4], y[4];
        double T;
} cty[N];
int n, a, b;
double t;

namespace Map {
        struct Edge {
                int nxt, to;
                double val;
        } edge[M];
        int head[M], cnt;
        inline void add_Edge ( int from, int to, double val ) {
                edge[ ++ cnt ] = { head[from], to, val };
                head[from] = cnt;
        }
} using namespace Map;

namespace ShortestPath {
        struct node {
                int id;
                double dis;
                inline friend bool operator < (node a, node b) {
                        return a.dis > b.dis;
                }
        };
        double dis[NN]; bool vis[NN];
        inline void Dijkstra ( int id ) {
                for ( int i = 0; i < NN; i ++ ) dis[i] = 0x3f3f3f3f, vis[i] = 0;
                priority_queue<node> pque;
                dis[id] = 0;
                pque.push({id, dis[id]});
                while ( pque.size() ) {
                        node stt = pque.top(); pque.pop();
                        if ( vis[stt.id] ) continue; vis[stt.id] = 1;
                        for ( int i = head[stt.id]; i; i = edge[i].nxt ) {
                                int to = edge[i].to;
                                if ( dis[to] - dis[stt.id] - edge[i].val >= eps ) {
                                        dis[to] = dis[stt.id] + edge[i].val;
                                        pque.push({to, dis[to]});
                                }
                        }
                }
        }
} using namespace ShortestPath;

inline double Dis ( double x1, double y1, double x2, double y2 ) {
        double dirx = x1 - x2;
        double diry = y1 - y2;
        return sqrt ( dirx * dirx + diry * diry );
}

inline void Solve() {
        cin >> n >> t >> a >> b;
        for ( int i = 1; i <= n; i ++ ) {
                cin >> cty[i].x[0] >> cty[i].y[0]; 
                cin >> cty[i].x[1] >> cty[i].y[1]; 
                cin >> cty[i].x[2] >> cty[i].y[2]; 
                double ds01 = (cty[i].x[0] - cty[i].x[1]) * (cty[i].x[0] - cty[i].x[1]) + (cty[i].y[0] - cty[i].y[1]) * (cty[i].y[0] - cty[i].y[1]);
                double ds02 = (cty[i].x[0] - cty[i].x[2]) * (cty[i].x[0] - cty[i].x[2]) + (cty[i].y[0] - cty[i].y[2]) * (cty[i].y[0] - cty[i].y[2]);
                double ds12 = (cty[i].x[2] - cty[i].x[1]) * (cty[i].x[2] - cty[i].x[1]) + (cty[i].y[2] - cty[i].y[1]) * (cty[i].y[2] - cty[i].y[1]);
                if ( ds01 + ds02 == ds12 ) cty[i].x[3] = cty[i].x[1] + cty[i].x[2] - cty[i].x[0], cty[i].y[3] = cty[i].y[1] + cty[i].y[2] - cty[i].y[0];
                if ( ds01 + ds12 == ds02 ) cty[i].x[3] = cty[i].x[0] + cty[i].x[2] - cty[i].x[1], cty[i].y[3] = cty[i].y[0] + cty[i].y[2] - cty[i].y[1];
                if ( ds02 + ds12 == ds01 ) cty[i].x[3] = cty[i].x[0] + cty[i].x[1] - cty[i].x[2], cty[i].y[3] = cty[i].y[0] + cty[i].y[1] - cty[i].y[2];
                cin >> cty[i].T;
        }
        for ( int i = 1; i <= n; i ++ ) {
                for ( int i1 = 0; i1 < 4; i1 ++ ) {
                        for ( int i2 = 0; i2 < 4; i2 ++ ) {
                                if ( i1 == i2 ) continue;
                                add_Edge ( i * 4 + i1, i * 4 + i2, Dis(cty[i].x[i1], cty[i].y[i1], cty[i].x[i2], cty[i].y[i2]) * cty[i].T );
                        }
                }
                for ( int j = 1; j <= n; j ++ ) {
                        if ( i == j ) continue;
                        for ( int ii = 0; ii < 4; ii ++ ) {
                                for ( int jj = 0; jj < 4; jj ++ ) {
                                        add_Edge ( i * 4 + ii, j * 4 + jj, Dis(cty[i].x[ii], cty[i].y[ii], cty[j].x[jj], cty[j].y[jj]) * t );
                                }
                        }
                }
        }
        double res = 0x3f3f3f3f;
        for ( int i = 0; i < 4; i ++ ) {
                Dijkstra(a * 4 + i);
                for ( int j = 0; j < 4; j ++ ) res = min ( res, dis[b * 4 + j] );
        }
        printf("%.1f\n", res);
}

int main () {
        int cass; cin >> cass; while ( cass -- ) Solve ();
}
```

<hr>

## 洛谷P1070_道路游戏

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1070"><img src="https://i.loli.net/2021/11/09/mv7uyJrnicTWbqR.png"></a>

#### 💡
想不出来去看了题解，一堆单调队列(2021/11/09: 没学过)题解，然后就看到了一个题解说用SPFA能过  
~~真是小刀划屁股给👴开了眼~~  
  
然后想了半天发现雀食是这么回事  
这是一个要转移最优解的问题  
而每一次转移都是从一个已有的优解转移出一个新的优解，这份转移价值就是你在这个时间哪个工场买了机器人跑几次  
可以发现时间与时间之间还有制约关系，就是你a时间买了个机器人让它跑b次那么你一定会在a+b时间继续抉择  
就相当于a时间和a+b时间连了个边  
  
（那不就最短路更新了？  
由于会出现负权，我们要使用  <img src="https://latex.codecogs.com/svg.image?\inline&space;SPFA" title="\inline SPFA" />   
我们使用基本的bfs，队内塞时间点，每次对一个时间点枚举一下此时选择哪个工厂造使用多长时间的机器人  
由于会推到另一个时间点，我们设置类似于最段路的best数组，和是否在队内的inq数组  
对下一个时间点本身的best和它是否在队内决定吧更不更新和入不入队  
  
在时间p和总时间m和spfa的优化下不会太长时间  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <queue>
#include <cstring>


#define ll long long

using namespace std;

const int N = 1e3 + 10;
const int M = 1e3 + 10;
int n, m, p;
int pth[N][N];
int dty[N];

int best[M]; // best[i]: i时刻的最多钱数
bool inq[M]; // inq[i] : i时刻在队里面没有

int main () {
        ios::sync_with_stdio(false);
        memset ( best, -0x3f3f3f3f, sizeof best );
        cin >> n >> m >> p;
        for ( int i = 0; i < n; i ++ ) for ( int j = 0; j < m; j ++ ) cin >> pth[i][j];
        for ( int i = 0; i < n; i ++ ) cin >> dty[i];

        int res = -0x3f3f3f3f;
        queue<int> que; // 存的是时间
        que.push(0); best[0] = 0;
        while ( que.size() ) {
                int cur_time = que.front(); que.pop(); inq[cur_time] = false; // 当前时间
                res = max ( res, best[cur_time] );
                for ( int dtyid = 0; dtyid < n; dtyid ++ ) {                                // 选择哪个工厂买机器人
                        int getmoney = -dty[dtyid];                                         // 获得钱数
                        for ( int sttm = 1; sttm <= p && sttm + cur_time <= m; sttm ++ ) {  // 设置多长时间
                                getmoney += pth[(dtyid + sttm - 1) % n][(cur_time + sttm - 1) % m]; 

                                int nxt_time = cur_time + sttm;             // 新产生的时间
                                int nxt_money = best[cur_time] + getmoney;  // 新产生的钱数
                                if ( best[nxt_time] < nxt_money ) {         // 有更优的方案
                                        best[nxt_time] = nxt_money;         // 更新一下
                                        if ( !inq[nxt_time] )               // 如果不在队列里面那么更新不起递推作用，要放进去
                                                que.push(nxt_time),
                                                inq[nxt_time] = true;
                                }
                        }
                }
        }
        cout << res << endl;
}
```

<hr>

## 洛谷P1119_灾后重建

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1119"><img src="https://i.loli.net/2021/11/13/pUWGAtQkuLPnavR.png"></a>

#### 💡
这个题就是最短路加上点更新  
由于问我们的点比较随机加上点数比较少  
  
考虑到  <img src="https://latex.codecogs.com/svg.image?\inline&space;Floyd" title="\inline Floyd" /> 的更新机制就是以点为中转  
那么我们可以直接使用其  <img src="https://latex.codecogs.com/svg.image?\inline&space;Dp" title="\inline Dp" /> 思想进行更新  
出现一个点时，所有以它为中转的点都可以更新一下看看  
如果问的两个点都不在时间内或者中间无法转移  
那么就输出-1  
否则就是  <img src="https://latex.codecogs.com/svg.image?\inline&space;Floyd" title="\inline Floyd" /> 的那个数组  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int N = 1e4 + 10;
int dis[N][N];
int t[N], n, m, q;

vector<int> tims[N]; // tims[i]: 时间i的时候已经建成的村庄集合

int main () {
        cin >> n >> m;
        for ( int i = 0; i < n; i ++ ) cin >> t[i], tims[t[i]].push_back(i);
        for ( int i = 0; i < n; i ++ ) {
                for ( int j = 0; j < n; j ++ ) {
                        if ( i == j ) dis[i][j] = 0;
                        else          dis[i][j] = 0x3f3f3f3f;
                }
        }
        for ( int i = 0; i < m; i ++ ) {
                int a, b, c; cin >> a >> b >> c;
                dis[a][b] = dis[b][a] = c;
        }


        function<void(int)> update = [&]( int x ) { // 点更新
                for ( int i = 0; i < n; i ++ ) {
                        for ( int j = 0; j < n; j ++ ) {
                                if ( dis[i][j] > dis[i][x] + dis[x][j] ) 
                                        dis[i][j] = dis[j][i] = dis[i][x] + dis[x][j];
                        }
                }
        };

        int curtime = 0, q; 
        cin >> q;
        while ( q -- ) {
                int x, y, tm; cin >> x >> y >> tm;
                while ( curtime <= tm ) {
                        for ( auto i : tims[curtime] ) update ( i );
                        curtime ++;
                }
                if ( t[x] > tm || t[y] > tm || dis[x][y] == 0x3f3f3f3f ) cout << "-1" << endl;
                else                                                     cout << dis[x][y] << endl;
        }
}
```

<hr>

## CodeForces1611E1_EscapeTheMaze(easyversion)

#### 🔗
<a href="https://codeforces.com/contest/1611/problem/E1"><img src="https://i.loli.net/2021/11/26/Q61oAS5wfDUqRdI.png"></a>

#### 💡
玩家想抓到Vlad，Vlad想逃脱  
每一个玩家往上跑，Vlad往下跑  
如果一个点Vlad先到了玩家才到，那么玩家是赶不上Vlad的  

所以应该预处理出来玩家到达每一个节点的最短时间  <img src="https://latex.codecogs.com/svg.image?\inline&space;\{tim\}" title="\inline \{tim\}" />   
然后让Vlad往下跑，如果一个点玩家会先到，那么Vlad就不能走这个点  
看看有没有一种方法让Vlad到达叶子节点  

  
那么问题的关键就在处理  <img src="https://latex.codecogs.com/svg.image?\inline&space;\{tim\}" title="\inline \{tim\}" />  数组上了  
这个可以想到最短路的更新方式，以所有玩家为起始点入队进行  <img src="https://latex.codecogs.com/svg.image?\inline&space;BFS" title="\inline BFS" />   
如果  <img src="https://latex.codecogs.com/svg.image?\inline&space;to" title="\inline to" />  点的  <img src="https://latex.codecogs.com/svg.image?\inline&space;tim[to]" title="\inline tim[to]" />  被  <img src="https://latex.codecogs.com/svg.image?\inline&space;tim[x]+1" title="\inline tim[x]+1" />  更新了，那么就入队，一个一个向上更新  


#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
int n, k;
const int N = 2e5 + 10;
const int M = 4e5 + 10;
int a[N];
bool flag;

namespace Tree {
        int head[M], cnt;
        struct Edge {
                int nxt, to;
        } edge[M];

        inline void add_Edge ( int from, int to ) {
                edge[ ++ cnt ] = { head[from], to };
                head[from] = cnt;
        }

        int dep[N];
        int tim[N];
        inline void Init () {
                for ( int i = 0; i <= n; i ++ )
                        head[i] = 
                        dep[i]  = 0,
                        tim[i] = 0x3f3f3f3f;
                cnt = 0;
                flag = false;
        }

        inline void pre_Dfs ( int x, int fath ) { // 处理 {dep}
                if ( x != 1 ) dep[x] = dep[fath] + 1;
                for ( int i = head[x]; i; i = edge[i].nxt ) {
                        int to = edge[i].to;
                        if ( to == fath ) continue;
                        pre_Dfs ( to, x );
                }
        }

        inline void pre_Bfs () { // 最短路处理 {tim}
                queue<int> que;
                for ( int i = 0; i < k; i ++ ) 
                        que.push(a[i]),
                        tim[a[i]] = 0;

                while ( que.size() ) {
                        int x = que.front(); que.pop();
                        for ( int i = head[x]; i; i = edge[i].nxt ) {
                                int to = edge[i].to;
                                if ( dep[to] > dep[x] ) continue; // 要往上跑
                                if ( tim[to] > tim[x] + 1 ) // 更新就入队
                                        tim[to] = tim[x] + 1,
                                        que.push(to);
                        }
                }
        }

        inline void Solve_Dfs ( int x, int fath ) { // 求答案看看往哪搜
                if ( dep[x] >= tim[x] || flag ) return; // 先到了

                bool has_son = false;
                for ( int i = head[x]; i; i = edge[i].nxt ) {
                        int to = edge[i].to;
                        if ( to == fath ) continue;
                        Solve_Dfs ( to, x );
                        has_son = true;
                }
                if ( !has_son ) flag = true;
        }

} using namespace Tree;



inline void Solve () {
        scanf("%d%d", &n, &k); Init();
        for ( int i = 0; i < k; i ++ ) scanf("%d", &a[i]);
        for ( int i = 0, x, y; i < n - 1; i ++ )
                scanf("%d%d", &x, &y),
                add_Edge ( x, y ),
                add_Edge ( y, x );
        pre_Dfs ( 1, 1 );
        pre_Bfs ();
        Solve_Dfs ( 1, 1 );
        if ( flag ) puts("YES");
        else        puts("NO");
}

int main () {
        int cass; scanf("%d", &cass); while ( cass -- ) {
                Solve ();
        }
}
```

<hr>

## CodeForces1611E2_EscapeTheMaze(hardversion)

#### 🔗
<a href="https://codeforces.com/contest/1611/problem/E2"><img src="https://i.loli.net/2021/11/26/RTpWMdm5ZLg3jcG.png"></a>

#### 💡
和 <a href="https://github.com/Chivas-Regal/ACM/blob/main/Code/%E5%9B%BE%E8%AE%BA/%E6%9C%80%E7%9F%AD%E8%B7%AF/CodeForces1611E1_EscapeTheMaze%20(easy%20version).md">这个题</a>没什么大区别，就是任务稍微改了一下而已  
  
如果Vlad可以逃脱，那么谁都抓不住他，输出-1  
否则能抓住他的就是在最后一个dfs中看一下Vlad走的时候会被断多少次  
因为每个人最多会断它一次，因为从上往下走的时候不会有多次相邻一个点

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
int n, k;
const int N = 2e5 + 10;
const int M = 4e5 + 10;
int a[N];
bool flag;
int can_catch; // 可以抓住的
 
namespace Tree {
        int head[M], cnt;
        struct Edge {
                int nxt, to;
        } edge[M];
 
        inline void add_Edge ( int from, int to ) {
                edge[ ++ cnt ] = { head[from], to };
                head[from] = cnt;
        }
 
        int dep[N];
        int tim[N];
        inline void Init () {
                for ( int i = 0; i <= n; i ++ )
                        head[i] = 
                        dep[i]  = 0,
                        tim[i] = 0x3f3f3f3f;
                cnt = can_catch = 0;
                flag = false;
        }
 
        inline void pre_Dfs ( int x, int fath ) {
                if ( x != 1 ) dep[x] = dep[fath] + 1;
                for ( int i = head[x]; i; i = edge[i].nxt ) {
                        int to = edge[i].to;
                        if ( to == fath ) continue;
                        pre_Dfs ( to, x );
                }
        }
 
        inline void pre_Bfs () {
                queue<int> que;
                for ( int i = 0; i < k; i ++ ) 
                        que.push(a[i]),
                        tim[a[i]] = 0;
 
                while ( que.size() ) {
                        int x = que.front(); que.pop();
                        for ( int i = head[x]; i; i = edge[i].nxt ) {
                                int to = edge[i].to;
                                if ( dep[to] > dep[x] ) continue;
                                if ( tim[to] > tim[x] + 1 )
                                        tim[to] = tim[x] + 1,
                                        que.push(to);
                        }
                }
        }
 
        inline void Solve_Dfs ( int x, int fath ) {
                if ( flag ) return;
                if ( dep[x] >= tim[x] ) {can_catch ++; return;}
 
                bool has_son = false;
                for ( int i = head[x]; i; i = edge[i].nxt ) {
                        int to = edge[i].to;
                        if ( to == fath ) continue;
                        Solve_Dfs ( to, x );
                        has_son = true;
                }
                if ( !has_son ) flag = true;
        }
 
} using namespace Tree;
 
 
 
inline void Solve () {
        scanf("%d%d", &n, &k); Init();
        for ( int i = 0; i < k; i ++ ) scanf("%d", &a[i]);
        for ( int i = 0, x, y; i < n - 1; i ++ )
                scanf("%d%d", &x, &y),
                add_Edge ( x, y ),
                add_Edge ( y, x );
        pre_Dfs ( 1, 1 );
        pre_Bfs ();
        Solve_Dfs ( 1, 1 );
        if ( flag ) puts("-1");
        else        printf("%d\n", can_catch);
}
 
int main () {
        int cass; scanf("%d", &cass); while ( cass -- ) {
                Solve ();
        }
}
```

<hr>

## HDUOJ1217_Arbitrage

#### 🔗
https://acm.dingbacode.com/showproblem.php?pid=1217

#### 💡
判断是否有负环</br>
使用Bellman-Ford算法</br>
松弛操作完之后判断还能不能松弛</br>
朴素就能过

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png">

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


const int M = 1000, N = 100;
string fr[M], to[M];
double val[M];
map<string, double> dis;
int n, m;
int cas = 0;

inline void Init(){
        for(int i = 0; i < M; i ++){
                val[i] = 1;
                fr[i] = to[i] = "";
        }
}

inline void DrawMap(){
        for(int i = 0; i < n; i ++){
                string s; cin >> s;
                dis[s] = 1;
        }
        cin >> m;
        for(int i = 0; i < m; i ++){
                cin >> fr[i] >> val[i] >> to[i];
        }
}

inline void BellmanFord(){
        cout << "Case " << ++cas << ": ";
        for(int k = 1; k <= n - 1; k ++){
                for(int i = 0; i < m; i ++){
                        dis[to[i]] = MAX(dis[fr[i]] * val[i], dis[to[i]]);
                }
        }
        for(int i = 0; i < m; i ++){
                if(dis[to[i]] < dis[fr[i]] * val[i]){
                        puts("Yes");
                        return;
                }
        }puts("No");
}

CHIVAS_{
        while(cin >> n, n){
                Init();
                DrawMap();
                BellmanFord();
        }
        _REGAL;
}
```

<hr>