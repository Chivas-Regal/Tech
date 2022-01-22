---
title: BFS
---
###  
<hr>

## 洛谷P1132_数字生成游戏

#### 🔗
<a href="https://www.luogu.com.cn/problem/P1132"><img src="https://i.loli.net/2021/11/08/9ynElPS8fCRkUbH.png"></a>

#### 💡
一看  <img src="https://latex.codecogs.com/svg.image?\inline&space;s<10^5" title="\inline s<10^5" /> ，最多  <img src="https://latex.codecogs.com/svg.image?\inline&space;5" title="\inline 5" /> 位，那时间最多也就  <img src="https://latex.codecogs.com/svg.image?\inline&space;9^5" title="\inline 9^5" /> ，直接暴力搜然后标记  
我们发现如果一个串可以更快得到，那么它之后的所有转移出来的串都应该被更新，所以我们用  <img src="https://latex.codecogs.com/svg.image?\inline&space;bfs" title="\inline bfs" />  

对给定的串，把它能变成的所有串都标记下来并存一下要变的次数  
如果这个串搜过了就` continue`掉  
  
要注意的是： 
交换要够两个数字  
插入要够两个数字  
删除要够一个数字  

这样的话，到最后我们查数的时候看看这个数有没有被标记即可  
标记的话输出记录的次数，否则  <img src="https://latex.codecogs.com/svg.image?\inline&space;-1" title="\inline -1" />    

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
map<string, int> vis, res;
string wanna;
string s; 
struct node {
        string s;
        int num;
};
inline void bfs () {
        queue<node> que; que.push({s, 0});
        while ( que.size() ) {
                node nd = que.front(); que.pop();
                string x = nd.s; 
                if ( vis[x] ) continue; vis[x] = 1;
                res[x] = nd.num;
                // 1.
                if ( x.size() )
                for ( int i = 0; i < x.size(); i ++ ) 
                        for ( int j = i + 1; j < x.size(); j ++ )
                                swap ( x[i], x[j] ),
                                que.push({x, nd.num + 1}),
                                swap ( x[i], x[j] );
                // 2.
                if ( x.size() )
                for ( int i = 0; i < x.size(); i ++ ) {
                        string tmp; tmp += x[i];
                        x.erase(i, 1);
                        que.push({x, nd.num + 1});
                        x.insert(i, tmp);
                }
                //3.
                if ( x.size() > 1 && x.size () + 1 <= s.size() )
                for ( int i = 0; i < x.size() - 1; i ++ ) {
                        for ( char c = x[i] + 1; c <= x[i + 1] - 1; c ++ ) {
                                string tmp; tmp += c;
                                x.insert(i + 1, tmp);
                                que.push({x, nd.num + 1});
                                x.erase(i + 1, 1);
                        }
                }
        }
}

int main () {
        ios::sync_with_stdio(false);
        cin >> s;
        bfs ();
        int m; cin >> m;
        while ( m -- ) {
                cin >> wanna;
                if ( !res.count(wanna) ) cout << "-1" << endl;
                else                     cout << res[wanna] << endl;
        }
}
```

<hr>

## 洛谷P1225_黑白棋

#### 🔗

<a href="https://www.luogu.com.cn/problem/P1225"><img src="https://img-blog.csdnimg.cn/eafed431a13b40aab40c6f42ea3a5235.png"></a>

#### 💡

首先要体会到一件事情，总步数不会超过 256 （感性一下  
  
这个肯定是要用 BFS 的  
硬着头皮直线搜太伤了  
每一步的矩阵判断也很伤  
但是矩阵不大，我们完全可以压成一行数，用这个数判相不相等就很好  
  
对于换位，我们枚举1到16为这行数的第几位，对这些数拆分成矩阵坐标  
从而可以得出相邻的坐标，要换的相邻坐标也可以变成数位  


```cpp
inline pair<int, int> NumToPos ( int x ) {
        return {(x - 1) / 4 + 1, (x - 1) % 4 + 1};
}
inline int PosToNum ( int x, int y ) {
        return (x - 1) * 4 + y;
}
```

交换这两个数位即可  

```cpp
inline ll new_Swap ( ll x, int i, int j ) {
        ll a = x % ksm(10, i) / ksm(10, i - 1);
        ll b = x % ksm(10, j) / ksm(10, j - 1);
        if ( a != b ) {
                if ( a ) x -= ksm(10, i - 1), x += ksm(10, j - 1);
                else     x -= ksm(10, j - 1), x += ksm(10, i - 1);
        }
        return x;
}
```

然后对每一个数存一个记录不重复搜索别的也就是普通的BFS了    

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
const int mxstp = 256;
const int N = 4;

struct pth {
        int a, b, c, d;
};
struct node {
        ll val;
        int stp;
        vector<pth> p;

} tmp, tgt;


inline ll ksm ( ll a, ll b ) { ll res = 1; while ( b > 0 ) { if ( b & 1 ) res = res * a; a = a * a; b >>= 1; } return res; }
inline ll new_Swap ( ll x, int i, int j ) {
        ll a = x % ksm(10, i) / ksm(10, i - 1);
        ll b = x % ksm(10, j) / ksm(10, j - 1);
        if ( a != b ) {
                if ( a ) x -= ksm(10, i - 1), x += ksm(10, j - 1);
                else     x -= ksm(10, j - 1), x += ksm(10, i - 1);
        }
        return x;
}
inline pair<int, int> NumToPos ( int x ) {
        return {(x - 1) / 4 + 1, (x - 1) % 4 + 1};
}
inline int PosToNum ( int x, int y ) {
        return (x - 1) * 4 + y;
}

int dx[4] = {0, 0, 1, -1};
int dy[4] = {1, -1, 0, 0};

map<ll, bool> vis;
inline void BFS () {
        queue<node> que;
        que.push(tmp);

        while ( que.size() ) {
                node cur = que.front(); que.pop();
                if ( cur.val == tgt.val ) {
                        cout << cur.stp << endl;
                        for ( int i = 0; i < cur.p.size(); i ++ ) cout << cur.p[i].a << cur.p[i].b << cur.p[i].c << cur.p[i].d << endl;
                        cout << endl;
                        exit(0);
                }
                if ( vis[cur.val] || cur.stp > 256 ) continue; vis[cur.val] = 1;

                for ( int np = 1; np <= 16; np ++ ) {
                        int x = NumToPos(np).first, y = NumToPos(np).second;
                        for ( int i = 0; i < 4; i ++ ) {
                                int nxtx = x + dx[i], nxty = y + dy[i];
                                if ( nxtx >= 1 && nxtx <= 4 && nxty >= 1 && nxty <= 4 ) {
                                        int num = PosToNum(nxtx, nxty);

                                        cur.p.push_back({x, y, nxtx, nxty});
                                        cur.stp ++;
                                        cur.val = new_Swap ( cur.val, np, num );
                                        que.push(cur);
                                        cur.val = new_Swap ( cur.val, np, num );
                                        cur.stp --;
                                        cur.p.pop_back();
                                }
                        }
                }
        }

}

int main () {
        ios::sync_with_stdio(false);

        string s1, s2;
        for ( int i = 0; i < 4; i ++ ) {
                string ss; cin >> ss;
                s1 += ss;
        }
        for ( int i = 0; i < 4; i ++ ) {
                string ss; cin >> ss;
                s2 += ss;
        }
        reverse(s1.begin(), s1.end());
        reverse(s2.begin(), s2.end());

        tmp.val = stoll ( s1 );
        tgt.val = stoll ( s2 );

        BFS();
}
```

<hr>

## ABC224_D8PuzzleOnGraph

#### 🔗
<a href="https://atcoder.jp/contests/abc224/tasks/abc224_d?lang=en"><img src="https://i.loli.net/2021/10/24/l8aiYwO6rHdM1E9.png"></a>

#### 💡
首先图上点个数只有9个，那么就模拟搜一下  
每次可以交换空位置和它相邻的节点  
那么按这种方式搜，记录状态保证不会重复搜索，看看能不能生成一个123456789  
最多也就9!次  
DFS太深了扛不下，使用BFS

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
int n;
struct Egde {
        int nxt, to;
} edge[100];
int head[100], cnt;
map<string, int> num;
queue<string> que;



inline void add_Edge ( int from, int to ) {
        edge[ ++ cnt ] = { head[from], to };
        head[from] = cnt;
}

int main () {
        ios::sync_with_stdio(false);
        for ( int i = 0; i < 100; i ++ ) head[i] = -1;
        cin >> n;
        for ( int i = 0, x, y; i < n; i ++ ) {
                cin >> x >> y; x --, y --;
                add_Edge ( x, y );
                add_Edge ( y, x );
        }
        string s = "999999999";
        for ( int i = 1, x; i <= 8; i ++ )
                cin >> x, x --,
                s[x] = i + '0';
        que.push(s);
        num[s] = 0;
        while ( que.size() ) {
                s = que.front(); que.pop();
                if ( s == "123456789" ) break;
                int x; for ( int i = 0; i < 9; i ++ ) if ( s[i] == '9' ) x = i;
                for ( int i = head[x]; ~i; i = edge[i].nxt ) {
                        int to = edge[i].to; 
                        string t = s;
                        swap ( t[x], t[to] ); 
                        if ( !num[t] )  
                                que.push(t), 
                                num[t] = num[s] + 1; 
                }
        }
        if ( !num.count("123456789") ) cout << "-1" << endl;
        else                           cout << num["123456789"] << endl;
}
```

<hr>

## CodeForces1063B_Labyrinth

#### 🔗
<a href="https://codeforces.com/problemset/problem/1063/B"><img src="https://i.loli.net/2021/09/15/yvlqKuNwCxRb3LP.png"></a>

#### 💡
即然要记录能到达的点数  
其实每个点访问一次就行了  
那么主要设计好标记不重复走每一格，时间复杂度允许我们开BFS搜索遍历的  
  
关键问题在于：如何让没怎么消耗左右走机会的访问节点优先走  
没怎么消耗左右节点也就意味着尽可能上下走的节点  
那就只需要**对上下走优先遍历**即可  
  
DFS肯定爆栈，我们可以对BFS中遍历队列设为**双端队列**  
我们每次优先将上下走的节点压入队首，左右走压入队尾  
每次遍历时取队头即可满足优先上下走的条件了  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
#include <iostream>
#include <algorithm>
#include <vector>
#include <map>
#include <queue>
#define ll long long

using namespace std;
const int mod = 1e9 + 7;
const int N = 2100;

int n, m;
int r, c;
int _l, _r;
char s[N][N];
struct node {
        int x, y, nl, nr;
};
int vis[N * N * 2];
int res;

inline void BFS () {
        deque<node> dq;
        dq.push_back({r, c, _l, _r});
        while ( dq.size() ) {
                node cur = dq.front(); dq.pop_front();
                if ( cur.x < 1 || cur.x > n || cur.y < 1 || cur.y > m ) continue;
                if ( vis[(cur.x - 1) * m + cur.y] ) continue; vis[(cur.x - 1) * m + cur.y] = 1;
                if ( s[cur.x][cur.y] == '*' ) continue;

                res ++;
                dq.push_front({cur.x + 1, cur.y, cur.nl, cur.nr}); // 优先上下走
                dq.push_front({cur.x - 1, cur.y, cur.nl, cur.nr});
                if ( cur.nl ) dq.push_back({cur.x, cur.y - 1, cur.nl - 1, cur.nr}); // 其次左右走
                if ( cur.nr ) dq.push_back({cur.x, cur.y + 1, cur.nl, cur.nr - 1});
        }
}

int main () {
#ifndef ONLINE_JUDGE
        freopen("in.in", "r", stdin);
        freopen("out.out", "w", stdout);
#endif
        scanf("%d%d%d%d%d%d", &n, &m, &r, &c, &_l, &_r);
        for ( int i = 1; i <= n; i ++ ) scanf("%s", s[i] + 1);
        BFS();
        printf("%d\n", res);
}

```

<hr>

## CodeForces1536B_PrinzessinDerVerurteilung

#### 🔗
<a href="https://codeforces.com/problemset/problem/1536/B"><img src="https://img-blog.csdnimg.cn/20210607110235819.png?"></a>

#### 💡
首先明白  
如果一个个字符串按顺序向后搜索查找  
我们搜到的字符串数量不会超过$26 * log_{26}(1000)$  
这是根据容斥出来的最坏情况  
  
这么看来可以用搜索，但是DFS是一条路径向后找，会有很多不必要搜的字符串  
所以我们用BFS  

#### <img src="https://img-blog.csdnimg.cn/20210713144601841.png" >

```cpp
struct cmp{
        bool operator ()(string a, string b){//保证两个字符串是先按长度再按字典序排序
                if(a.size() != b.size()) return a.size() > b.size();
                return a > b;
        }
};
string in;//输入字符串
string none;//空字符串

inline void BFS(){
        priority_queue<string, vector<string>, cmp> pque;
        for(char i = 'a'; i <= 'z'; i ++) pque.push(none + i);//先都初始化为一个字符
        while(pque.size()){
                string cur = pque.top(); pque.pop();
                if(in.find(cur) == in.npos){//找不到了就输出
                        cout << cur << endl;
                        return;
                }
                for(char i = 'a'; i <= 'z'; i ++) pque.push(cur + i);
        }
}

inline void solve(){
        int n; cin >> n >> in;
        BFS();
}

CHIVAS_{
        int cass;
        EACH_CASE(cass){
                solve();
        }
        _REGAL;
}
```

<hr>
