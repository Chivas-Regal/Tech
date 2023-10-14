---
title: 拓扑排序
---
###  
<hr>

## 牛客2000_食物链

#### 🔗
https://ac.nowcoder.com/acm/problem/20000

#### 💡
dp思想太好用了，没想到可以用dp推链数  
拓扑包含入读和出度  
开始选择入队元素时要特判只有出度不为0的才能入  
并每个入队的链数dp设为1  
每次有一个新元素要进队就加上起点的链数dp  
最后统计所有出度为0的元素的dp和  

#### ✅  
  

```cpp
#pragma region
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
#pragma endregion

//全局变量
#pragma region
const int maxn = 1e5 + 10;
//----------------前向星变量
struct Edge{
    int nxt, to;
}edge[maxn << 1];
int head[maxn];
int cnt = 0;
//------------------------   
int n, m;//生物个数、关系数
int in[maxn], out[maxn];//入度，出度
int dp[maxn];//dp[i]表示到i的食物链有多少条
#pragma endregion

//辅助函数
void Init(){
    for(int i = 0; i < maxn; i ++){
        head[i] = -1;
        in[i] = 0;
        out[i] = 0;
        dp[i] = 0;
    }
    cnt = 0;
}
void Add_Edge(int from, int to){
    edge[++cnt] = {head[from], to};
    head[from] = cnt;
}
void TopSort(){
    queue<int> que;
    for(int i = 1; i <= n; i ++){//初始化队列和首位置的食物链条数
        if(in[i] == 0 && out[i] != 0){//没出度的不算，就自己一个不是一条链
            que.push(i);
            dp[i] = 1;
        }
    }
    while(!que.empty()){
        int cur_start = que.front();
        que.pop();
        for(int i = head[cur_start]; ~i; i = edge[i].nxt){
            int cur_end = edge[i].to;
            in[cur_end]--;
            dp[cur_end] += dp[cur_start];//关键：链数传递
            if(!in[cur_end]){
                que.push(cur_end);
            }
        }
    }
}

//主函数
Chivas{
    IOS;
    Init();
    cin >> n >> m;
    while(m --){
        int x, y;
        cin >> x >> y;
        Add_Edge(x, y);
        in[y] ++;
        out[x] ++;
    }
    TopSort();
    int res = 0;
    for(int i = 1; i <= n; i++){
        if(out[i] == 0){
            res += dp[i];//统计最后的点的食物链条数总和
        }
    }
    cout << res << endl;
    Regal;
}

```

<hr>

## abc223D_RestrictedPermutation

#### 🔗
<a href="https://atcoder.jp/contests/abc223/tasks/abc223_d"><img src="https://i.loli.net/2021/10/17/Lo2YI3EAjRsVSt5.png"></a>

#### 💡
首先不合法的情况肯定就是有环的  
这道题的关系网内，每一个点都会通过一个优先顺序转移得到另一个点  
那么我们可以利用这个顺序建立拓扑结构  
在拓扑结构内使用优先队列来保证构造的是最小的字典序  
然后如果最后出来的不是n个数说明有环，就-1  
否则输出这n个数  

#### ✅

```cpp
const int N = 3e5 + 10;
int in[N];

struct CMP{
        int x;
        inline friend bool operator < ( CMP a, CMP b ) {
                return a.x > b.x;
        }
};

int head[N], cnt;
struct Edge {
        int nxt, to;
}edge[N];
inline void add_Edge ( int from, int to ) {
        edge[ ++ cnt ] = { head[from], to };
        head[from] = cnt;
}

int main () {
        ios::sync_with_stdio(false);
        memset ( head, -1, sizeof head );
        priority_queue<CMP> que;
        int n, m; cin >> n >> m;
        for ( int i = 0, x, y; i < m; i ++ ) {
                cin >> x >> y;
                add_Edge ( x, y );
                in[y] ++;
        }
        for ( int i = 1; i <= n; i ++ ) {
                if ( in[i] == 0 ) que.push({i});
        }
        vector<int> res;
        while ( que.size() ) {
                res.push_back(que.top().x);
                int x = que.top().x; que.pop();
                for ( int i = head[x]; ~i; i = edge[i].nxt ) {
                        in[edge[i].to] --;
                        if ( !in[edge[i].to] ) que.push({edge[i].to});
                }
        }
        if ( res.size() != n ) { cout << "-1" << endl; return 0;}
        for ( int i = 0; i < res.size(); i ++ ) cout << res[i] << " ";
}
```

<hr>

## CodeForces1593E_GardenerAndTree

#### 🔗
<a href="https://codeforces.com/contest/1593/problem/E"><img src="https://i.loli.net/2021/10/14/bWhzEKde5MxsJBo.png"></a>

#### 💡
每次要删叶子节点  
可以思考一下叶子节点的性质：度=1  
  
DFS回溯是很难回溯的，因为走的是一条路，可能会走到别的树枝上  
那么可以思考BFS的队列  
队列一次维护的是相邻的层  
我们从初始的叶子节点出发  
每一次把这个节点砍掉会使它们相接的点的度数-1  
如果出现一个点度数变成1了，那么它就是新的叶子节点  
  
至于答案怎么维护  
每个节点肯定是要选最早入队的  
而每次入队都与让他们入队它们的相接节点有关  
所以可以直接用dp的思想进行转移  
每一个节点的dp表示它是第几次被删掉的  
这个dp是取让他们入队的节点的dp最小值+1  
  
最后记录一下dp>k也就是没有被删掉的节点个数  

#### ✅

```cpp
const int N = 8e5 + 10;
struct Edge { int nxt, to; } edge[N];
int head[N], cnt;
int n, k;
int du[N];
int dpth[N];
 
inline void add_Edge ( int from, int to ) {
        edge[++cnt] = {head[from], to};
        head[from] = cnt;
}
 
inline void Solve() {
        queue<int> que;
        scanf("%d%d", &n, &k);
        if ( n == 1 ) { printf("0\n"); return;}
        for ( int i = 0; i < n * 2; i ++ ) head[i] = -1, dpth[i] = 0x3f3f3f3f, du[i] = 0; cnt = 0;
        for ( int i = 0, x, y; i < n - 1; i ++ ) {
                scanf("%d%d", &x, &y);
                add_Edge ( x, y );
                add_Edge ( y, x );
                du[x] ++;
                du[y] ++;
        }
        for ( int i = 1; i <= n; i ++ ) if ( du[i] == 1 ) que.push(i), dpth[i] = 1, du[i] = 0;
        while ( que.size() ) {
                int cur = que.front(); que.pop();
                for ( int i = head[cur]; ~i; i = edge[i].nxt ) {
                        int to = edge[i].to;
                        du[to] --;
                        if ( du[to] == 1 ) que.push(to), dpth[to] = min(dpth[to], dpth[cur] + 1);
                }
        }
        int res = 0;
        for ( int i = 1; i <= n; i ++ ) if ( dpth[i] > k ) res ++;
        printf("%d\n", res);
}
 
int main () {
        int cass; scanf("%d", &cass); while ( cass -- ) {
                Solve();
        }
}
```

<hr>

## PTA_最短工期

#### 🔗
https://pintia.cn/problem-sets/1380134731032481792/problems/1380134925589520393

#### 💡


#### ✅  
  

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
#define mod 1e9 + 7
#define ll long long
#define INF 0x7FFFFFFF
#define PI acos(-1.0)
#define pb(x) push_back(x)
#define SP system("pause")
#define mm(a, b) memset(a, b, sizeof(a))
#define fir(i, a, n) for (ll i = a; i <= n; i++)
#define rif(i, a, n) for (ll i = a; i >= n; i--)
#define each_cass(cass) for (scanf("%d", &cass); cass; cass--)

using namespace std;

const int maxn=500;
int head[maxn];
struct Edge{int next;int to;int val;}edge[maxn];
int dis[maxn];
int indgr[maxn];
int cnt=0;
int n,m;

void init(){
    for(int i=0;i<maxn;i++) head[i]=-1,indgr[i]=0,dis[i]=0;
    cnt=0;
}

void add_edge(int from,int to,int dis){
    edge[++cnt]={head[from],to,dis};
    head[from]=cnt;
}

void drawMap(){
    for(int i=0,x,y,z;i<m;i++){
        cin>>x>>y>>z;
        add_edge(x,y,z);
        indgr[y]++;
    }
}

void topSort(){
    queue<int>q;
    int num_inq=0;
    
    for(int i=0;i<n;i++) if(!indgr[i]) q.push(i);
    while(!q.empty()){
        int cur_start=q.front();
        num_inq++;
        q.pop();
        for(int i=head[cur_start];~i;i=edge[i].next){
            indgr[edge[i].to]--;
            if(!indgr[edge[i].to]) q.push(edge[i].to);
            dis[edge[i].to]=max(dis[edge[i].to],dis[cur_start]+edge[i].val);
        }
    }
    
    int Max=0;
    for(int i=0;i<n;i++) Max=max(Max,dis[i]);
    
    if(num_inq==n){
        cout<<Max<<endl;
    }else{
        cout<<"Impossible"<<endl;
    }
}
int main(){
    cin>>n>>m;
    init();
    drawMap();
    topSort();
}

```

<hr>
