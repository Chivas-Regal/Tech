---
key: 2021-07-20-背包DP
layout: article
title: 背包DP
subtitle: DP奇奇怪怪的模型？🤔
categories: 动态规划
tags: [动态规划]
aside:
  toc: true
sidebar:
  nav: docs-en
---

## 定义
背包问题是DP的<span style="color: red;">经典模型</span>  
一般会给定背包的一些属性、一些物品和这些物品的一些属性  
<mark>询问针对某些物品的属性，在背包对应属性的约束下，出现的一些最值情况</mark>
  
背包常考种类：<span style="color: red;">01背包</span>、完全背包、多重背包、精准装满的背包、分组背包、二维费用背包、混合背包、有依赖性物品的背包、物品泛化价值的背包.  
<span style="color: red;">以01背包为主体</span>，其他背包在子问题、状态、转移方程上大同小异

## 01背包
<mark>01背包是最为简单的背包，但也是最为重要的背包，是作为所有背包类型的一个基础</mark>  
### 模型
给定一个背包，容量为 $V$ ，也有 $n$ 个物品，每个物品价值为 $w[i]$ ，体积为 $v[i]$ ，这些物品<span style="color: red;">只有拿或者不拿两种情况</span>  
问最多使背包容纳下多少价值的物品

### 子问题
遇上了一个 $(体积， 价值) = (v[i], w[i])$ 的物品，此时背包剩余体积为 $V$   
那么子问题则是：在拿这个物品之前（也就是体积" $V-v[i]$ 或者 $V$ "）的背包在 $i$ 之前的物品中拿到的最大总价值。


### 状态
$dp[i][j]$ 表示在前 $i$ 个物品中，用容量为 $j$ 的背包存放最多能存放多少价值 

### 转移方程 
$$dp[i][j]=
  \left\{\begin{matrix} 
   dp[i-1][j],&j\lt w[i]\\
   max(dp[i-1][j],dp[i-1][j-w[i]]+v[i]),&j\ge w[i]
\end{matrix}\right.$$ 

### 处理方式
循环最外层按顺序枚举物品，表示这是前几个物品，为第一维信息。  
最内层<span style="color: red;">倒序</span>(防止出现一个物品因性价比高在一轮里面使用多次的情况)枚举容积。  
>设有4样物品，在 ${v[i], w[i]}$ 的格式下分别为 ${1,1},{4,10},{5,4},{3,7}$ ,有背包容积 $V=10$ ，问装载最大价值
<table>
	<tr>
		<th>id\V</th><th>0</th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th>
	</tr>
	<tr>
		<th>1</th><td>0</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td><td>1</td>
	</tr>
	<tr>
		<th>2</th><td>0</td><td>1</td><td>1</td><td>1</td><td>10</td><td>11</td><td>11</td><td>11</td><td>11</td><td>11</td><td>11</td>
	</tr>
	<tr>
		<th>3</th><td>0</td><td>1</td><td>1</td><td>1</td><td>10</td><td>11</td><td>11</td><td>11</td><td>11</td><td>14</td><td>15</td>
	</tr>
	<tr>
		<th>4</th><td>0</td><td>1</td><td>1</td><td>7</td><td>8</td><td>8</td><td>8</td><td>17</td><td>18</td><td>18</td><td>18</td>
	</tr>
</table>

### 程序

```cpp
const int maxV = 1000, maxn = 10000;
int dp[maxV][maxn]

for ( int i = 1; i <= n; i ++ ) {
	for ( int j = V; j >= v[i]; j -- ) {
		dp[i][j] = MAX(dp[i - 1][j], dp[i - 1][j - v[i]] + w[i]);
	}
}
```
<br><span style="color: red;">Question：</span>如果物品较多，体积较大，两者在一个二维数组内占空间不会少，那么如何优化空间呢？  
<span style="color: red;">Answer:</span>使用滚动数组<br>  
在循环过程中， $i$ 似乎只作用于保存上一次内循环的结果，而可以看作无实际意义，但是上一次内层循环的结果在本次改变之前是不会动的，所以我们完全可以舍去这一维去进行循环  

```cpp
const int maxV = 1000;
int dp[maxV];

for ( int i = 1; i <= n; i ++ ) {
	for ( int j = V; j >= v[i]; j -- ) {
		dp[j] = MAX(dp[j], dp[j - v[i]] + w[i]);
	}
}
```
### 例题
<a style="display: block; background-image:url(https://img-blog.csdnimg.cn/20210720090230837.png); height: 800px; width: 730px;border-radius:15px;" href="https://vjudge.net/contest/447638#problem/M"> </a>
<br><br>
改了一点，这里是一个记录信息的01背包   
总音轨是体积，每个磁带的minus是体积也是价值  
对于这个问题，我们可以把问题设为：<span style="color:red;">要求最大价值，顺便记录一下内容</span>。  
那么可以开一个 `pair<vector<int>, int>dp[N]` 用来表示dp信息，其中前面的表示内部物品，后面是上文中dp出的最大价值  
在更新的时候，比较只需要跟以前一样拿后面的数进行比较，而更新的时候需要first、second一起更新  

```cpp
const int N = 10000;
pair<vector<int>, int> dp[N];
int n, num, minutes[N]; // 这里体积等于价值等于minutes[i]

int main(){
        while ( scanf("%d%d", &n, &num) == 2 ) {
                for ( int i = 0; i < N; i ++ ) dp[i] = make_pair({}, 0); //初始化
                
                for ( int i = 0; i < num; i ++ ) minutes[i] = inputInt(); 
                
                for ( int i = 0; i < num; i ++ ) {
                        for ( int j = n; j >= minutes[i]; j -- ) {
                                if ( dp[j].second < dp[j - minutes[i]].second + minutes[i] ) //朴素的比较
                                        dp[j] = dp[j - minutes[i]],
                                        dp[j].first.push_back(minutes[i]),
                                        dp[j].second += minutes[i]; //一起更新
                        }
                }
                for ( int i = 0; i < dp[n].first.size(); i ++, putchar(' ') ) outInt(dp[n].first[i]);
                printf("sum:%d\n", dp[n].second);
        }
        return 0;
}
```

## 完全背包

### 模型
给定一个背包，容量为 $V$ ，也有 $n$ 个物品，每个物品价值为 $w[i]$ ，体积为 $v[i]$ ，这些物品<span style="color: red;">可以拿任意个</span>  
问最多使背包容纳下多少价值的物品

### 处理方式
循环最外层按顺序枚举物品，表示这是前几个物品，为第一维信息。  
最内层<span style="color: red;">正序</span>(需要出现一个物品因性价比高在一轮里面使用多次的情况)枚举容积。  

### 程序

```cpp
for ( int i = 1; i <= n; i ++ ) {
	for ( int j = v[i]; j <= V; j ++ ) {
		dp[j] = MAX(dp[j], dp[j - v[i] + w[i]);
	}
}
```

### 例题
<a style="display: block; background-image:url(https://img-blog.csdnimg.cn/20210720093102465.png); height: 900px; width: 1000px;border-radius:15px;" href="http://acm.hdu.edu.cn/showproblem.php?pid=1248"> </a>
<br><br>
此时背包体积为骑士带的钱数，三种药瓶的花费既是体积也是价值  
其余的就是基本的完全背包模板

```cpp
const int N = 11000;
int dp[N];
int a[3] = {150, 200, 350};

int main(){
        int cass;
        for( cass = inputInt(); cass; cass -- ) {
                MEM(dp, 0); int V = inputInt();
                for ( int i = 0; i < 3; i ++ ) {
                        for ( int j = a[i]; j <= V; j ++) { 
                                dp[j] = MAX(dp[j], dp[j - a[i]] + a[i]);
                        }
                }
                outInt(V - dp[V]); puts("");
        }
        return 0;
}
```
## 多重背包
### 前置知识-二进制拆分
><span style="color: red;">合理性：</span>$2$ 从 $1\rightarrow n$ 的整数次幂中选若干个相加，可以表示出 $0\rightarrow 2^{n+1}-1$ 这些整数

二进制拆分是一种合理分配物品的手段，有效避免了一个个分配的高复杂度  
<mark>通过二进制拆分我们可以把一个固定很大数量的物品在很快的速度下分成一块块独立的小01背包物品</mark>
  
合并中的个数按顺序为 $2^0,\;2^1,\;2^2\;....\;2^k,\;2^{k+1},\;...$  
在无法完整拆分为一整块二次幂数量时停止，并将剩下的这些物品自己合并为一块  
例： $20\rightarrow1,\;2,\;4,\;8,\;5$

```cpp
vector<int> V, W; //拆分后每一块的物品和价值
inline void manage ( int x, int v, int w ) { // 个数，体积，价值
	int t = 1; // 拆到的块一块包含的物品数
	while(x >= t){
		V.push_back(v * t); 
		W.push_back(w * t);
		x -= t;
		t <<= 1;
	}
	if(x) V.push_back(v * x), W.push_back(w * x);
}

/*
 *当然也可以写到输入里面
 *看个人喜好
*/
```

### 模型
给定一个背包，容量为 $V$ ，也有 $n$ 个物品，每个物品价值为 $w[i]$ ，体积为 $v[i]$ , <span style="color: red;">数量</span>为 $x[i]$  
问最多使背包容纳下多少价值的物品

### 处理方式
用二进制拆分把多重背包变成01背包
循环最外层按顺序枚举物品，表示这是前几个物品，为第一维信息。  
最内层<span style="color: red;">正序</span>(需要出现一个物品因性价比高在一轮里面使用多次的情况)枚举容积。  

### 程序

```cpp
for(int i = 1; i <= n; i ++ ) {
	int x = inputInt(), v = inputInt(), w = inputInt();
	Manage(x, v, w);
}
for ( int i = 0; i < V.size(); i ++ ) {
	for ( int j = v[i]; j <= V; j ++ ) {
		dp[j] = MAX(dp[j], dp[j - V[i] + W[i]);
	}
}
```

### 例题
<a style="display: block; background-image:url(https://img-blog.csdnimg.cn/20210720101513353.png); height: 930px; width: 810px; border-radius:15px;" href="https://vjudge.net/contest/447638#problem/L"> </a>
<br><br>
这是一个<span style="color: red;">方案数类</span>的背包dp问题    
首先就是和多重背包一样要二进制拆分一下  
方案数在聚合时，类似于递推经典题的爬楼梯问题  
聚合方案数得到最终值<br><br>
在这里我们聚合方案数时就是背包的中心转移方程改编： $dp[j] += dp[j - v[i]]$

```cpp
const int N = 110, M = 1e5 + 10;
int a[N], c[N];
int dp[M];

int main(){
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
        return 0;
}
```
## 精准装满的背包
写法和上题几乎一样，都是聚合方案数，然后对每一个子问题（小容量）分析是否有方案

## 分组背包

### 模型
给定一个背包，容量为 $V$ ，也有 $n$ 个物品，每个物品价值为 $w[i]$ ，体积为 $v[i]$ , <span style="color: red;">物品被分成几组，每组的物品只能选一个放进背包</span>  
问最多使背包容纳下多少价值的物品

### 处理方式
以组为外部遍历，一组挑取一个（组号与当前枚举组相同的），以<span style="color: red;">体积为第二层循环，以物品为第三层循环</span>，这样在加了一个特判之后可以<span style="color: red;">保证每一组内的物品最多有一个被加入背包</span>

### 程序

```cpp
for ( int group = 1; group <= groups; group ++ ) {
	for ( int j = m; j >= 0; j -- ) {
		for ( int i = 1; i <= n; i ++ ) {
			if ( gp[i] == group && j >= v[i] ) dp[j] = MAX(dp[j], dp[j - v[i]] + w[i]);
		}
	}
}
```

### 例题
<a style="display: block; background-image:url(https://img-blog.csdnimg.cn/20210720161804136.png); height: 750px; width: 760px; border-radius:15px;" href="https://www.luogu.com.cn/problem/P1757"> </a>
<br><br>

就像上面说的那样，这里给了物品体积，价值，组编号， 我们就只需要照着这个顺序来写即可

```cpp
int v[1005], w[1005], s[1005];//物品占体积，价值，所占组数

int nSet = 0;//最多的组数
int dp[1005];

int main()
{
    int m, n;
    cin >> m >> n;
    for (int i = 1; i <= n; i++)
        cin >> v[i] >> w[i] >> s[i], nSet = max(nSet, s[i]);//找出枚举组数的范围

    for (int set = 1; set <= nSet; set++) //枚举组
        for (int j = m; j >= 0; j--) //枚举体积
            for (int i = 1; i <= n;i++) //枚举物品（要放在最里面，保证每一组内的物品最多有一个被加入背包）
                if(s[i] == set && j >= v[i])
                    dp[j] = max(dp[j], dp[j - v[i]] + w[i]);
    
    cout << dp[m] << endl;
    return 0;
}
```

## 二维费用

### 模型
给定一个背包，容量为 $V$ ，<span style="color: red;">最大承重</span>为 $M$ ，也有 $n$ 个物品，每个物品价值为 $w[i]$ ，体积为 $v[i]$ ， <span style="color: red;">质量</span>为 $m[i]$ 
问最多使背包容纳下多少价值的物品
>一般是这类质量问题，不过有很多的较难的题都会将第二维费用放得很隐晦

### 状态表示
此时状态也要变化，由<span style="color: red;">两维做下标</span>方便直接查到并利用这个最优解  

### 处理方式
与01背包一样，循环外层枚举物品，内层建立约束循环  

### 程序

```cpp
const int maxV = 100, maxM = 100;
int dp[maxV][maxM];

for ( int i = 0; i < n; i ++ ) {
	for ( int j = V; j >= v[i]; j -- ) {
		for ( int k = M; k >= m[i]; k -- ) {
			dp[j][k] = MAX(dp[j][k], dp[j - v[i]][k - m[i]] + w[i]);
		}
	}
}
```

### 例题
<a style="display: block; background-image:url(https://img-blog.csdnimg.cn/20210720165842590.png); height: 800px; width: 740px; border-radius:15px;" href="https://www.luogu.com.cn/problem/P1507"> </a>
<br><br>
解法上面的程序几乎没什么区别

## 混合背包

### 模型
给定一个背包，容量为 $V$ ，也有 $n$ 个物品，每个物品价值为 $w[i]$ ，体积为 $v[i]$ ， <span style="color: red;">有的物品只能拿一个，有的物品可以拿好几个，也有的物品可以拿任意个</span>

### 处理方式
物品被分为<span style="color: red;">两个遍历顺序</span>，一个是以多重背包化成的01背包和原01背包的顺序，一个是完全背包的顺序

### 程序

```cpp
int maxV = 1000;
int id[10000]; // 标记，0为01背包，1为完全背包

inline void Manage(){
	for ( int i = 1; i <= N; i ++ ) {
		if() {} // 若多重或者01就二进制拆分一下
		else {} // 若不是就自己开一个，两者做好区分标记
	}
}



for ( int i = 0; i < n; i ++ ) {
	if ( id[i] ) {
		for ( int j = v[i]; j <= V; j ++ ) { 
			dp[j] = MAX(dp[j], dp[j - v[i]] + w[i]);
		}
	} else {
		for ( int j = V; j >= v[i]; j -- ) {
			dp[j] = AMX(dp[j], dp[j - v[i]] + w[i]);
		}
	}
}
```

### 例题
<a style="display: block; background-image:url(https://img-blog.csdnimg.cn/20210720173920720.png); height: 850px; width: 740px; border-radius:15px;" href="https://www.luogu.com.cn/problem/P1833"> </a>
<br><br>

与上面一样，就是看如何去划分物品，分为两个部分。一个01背包部分，一个完全背包部分。  
划分之后的物品也要记得<span style="color: red;">标记</span>

```cpp
int T;
int N;
int t[100005], w[100005], flag[100005];//敲进去的每种花的用时、满足感、flag
int manaT[100005], manaW[100005], manaFlag[100005];//组合后的
int cnt = 1;//组合后的组数
void manage()
{
    for (int i = 1; i <= N; i++)
    {
        if (flag[i])//若01或多重就二进制一下
        {
            int x = 1;
            while (flag[i] >= x)
            {
                manaT[cnt] = t[i] * x;
                manaW[cnt] = w[i] * x;
                manaFlag[cnt++] = 1;//01与多重物品标记为1
                flag[i] -= x;
                x <<= 1;
            }
            if (flag[i])
                manaT[cnt] = t[i] * flag[i], manaW[cnt] = w[i] * flag[i], manaFlag[cnt++] = 1;
        }

        else//若完全就自己开一个
        {
            manaT[cnt] = t[i];
            manaW[cnt] = w[i];
            manaFlag[cnt++] = 0;//完全物品标记为0
        }
    }
}
int main()
{
    int h1, m1, h2, m2;
    scanf("%d:%d%d:%d", &h1, &m1, &h2, &m2);
    T = h2 * 60 + m2 - h1 * 60 - m1;//计算总时间（背包总容量）

    cin >> N;
    for (int i = 1; i <= N; i++)
        cin >> t[i] >> w[i] >> flag[i];
    manage();

    int dp[T + 10] = {0};//dp[i]表示在前i时间获取最大满足感
    for (int i = 1; i < cnt; i++)
    {
        //下面是三种背包物品的不同递推操作
        if (manaFlag[i])//01与多重
        {
            for (int j = T; j >= manaT[i]; j--)
                dp[j] = max(dp[j], dp[j - manaT[i]] + manaW[i]);
        }
        else//完全
        {
            for (int j = manaT[i]; j <= T; j++)
                dp[j] = max(dp[j], dp[j - manaT[i]] + manaW[i]);
        }
    }
    
    cout << dp[T] << endl;
    return 0;
}
```  

## 有依赖性物品的背包

### 模型
给定一个背包，容量为 $V$ ，也有 $n$ 个物品，每个物品价值为 $w[i]$ ，体积为 $v[i]$ ， <span style="color: red;">这些物品中有一些依赖关系，如果装了某样东西，也必须装另外一样东西</span>
问最多使背包容纳下多少价值的物品

### 处理方式
先预处理一下，将同依赖性物品分为一组，建立<span style="color: red;">下标关系</span>（一般可以让被依赖物品作为$0$，依赖别物品 $a$ 的物品 $x$ 作为 $a$ 数组后面的正数下标）。  
然后在选择物品时，先只选择被依赖物品，然后根据价值贡献决定是否要选依赖这个物品的物品  

### 程序
这个不好表示，详见题目与代码

### 例题
<a style="display: block; background-image:url(https://img-blog.csdnimg.cn/20210720190545335.png); height: 1150px; width: 650px; border-radius:15px;" href="https://www.luogu.com.cn/problem/P1064"> </a>
<br><br>
按上面说的处理方式  
我们首先应该对物件预处理：设置一个主导位置也就是 [0]，对附件设置[1]和[2]  
我们不用考虑是不是买这个附件连带着主件一起买，而是应该考虑买这个主件的时候要不要买附件  
这样就有了一个可操作空间去决策，买这个主件附带的这个附件是否会更优  
 
 ```cpp
 int v[100][3], w[100][3]; //v[i][j]表示第i套物品的前j件的体积，w[i][j]表示第i套物品的前j件价值
int V;//背包容量
int n;//物品个数

int main()
{
    cin >> V >> n;
    for (int i = 1; i <= n;i++)//优化：主附件并为一个组合，每次遇到附件就将它挪到主件那一组
    {
        int a, b, c;
        cin >> a >> b >> c;//a表示这件物品的体积，a*b表示这件物品的价值，c表这件物品的主件情况
        if(!c)//若为主件
            v[i][0] = a, w[i][0] = a * b;
        else//若为附件
        {
            if(!w[c][1])//主件后面第一个没有被占，放在第一个
                v[c][1] = a, w[c][1] = a * b;
            else//被占了，放在第二个
                v[c][2] = a, w[c][2] = a * b;
        }
    }

    int dp[32010];
    for (int i = 1; i <= n;i++)
    {
        for (int j = V; j >= v[i][0] && v[i][0]; j--)//稍微优化一下时间，记住：附件是没有自己的i的（地位好低）
        {
            dp[j] = max(dp[j], dp[j - v[i][0]] + w[i][0]);//只选主件
            v[i][0] + v[i][1] > j ?: dp[j] = max(dp[j], dp[j - v[i][0] - v[i][1]] + w[i][0] + w[i][1]);//买主件与第一个附件
            v[i][0] + v[i][2] > j ?: dp[j] = max(dp[j], dp[j - v[i][0] - v[i][2]] + w[i][0] + w[i][2]);//买主件与第二个附件
            v[i][0] + v[i][1] + v[i][2] > j ?: dp[j] = max(dp[j], dp[j - v[i][0] - v[i][1] - v[i][2]] + w[i][0] + w[i][1] + w[i][2]);//买主件与两个附件
        }
    }
    cout << dp[V] << endl;
    return 0;
}
 ```
 
## 泛化物品背包

### 模型
给定一个背包，容量为 $V$ ，也有 $n$ 个物品，每个物品价值为 $w(i)$ ，体积为 $v[i]$   
<span style="color: red;">⚠️：其中的物品价值是个函数，表示会随某种情况而改变</span>

### 处理方式
物品的价值没有一个固定的数组，而是<span style="color: red;">设一个计算函数，在特定的情况特定传入即可</span>

### 程序

```cpp
inline int getW ( int i ) {
	return w[i] * 10;
}
inline int getV ( int i ) {
	return v[i] * 10;
}
for ( int i = 0; i < n; i ++ ) {
	for ( int j = V; j >= v[i]; j -- ) {
		dp[j] = MAX ( dp[j], dp[j - getV ( i )] + getW ( i ) );
	}
}
```

### 例题
<a style="display: block; background-image:url(https://img-blog.csdnimg.cn/20210720193523990.png); height: 1000px; width: 750px; border-radius:15px;" href="https://www.luogu.com.cn/problem/P1417"> </a>
<br><br>

令 $d$ 表示菜  
设计一下 $v[i]$ 和 $w[i]$ ，得到 $v[i] = d[i].t ，\; w[i] = d[i].a - j * d[i].b$   
所以循环处理方式就是 $dp[j] = max(dp[j], dp[j-d[i].t]+d[i].a-j*d[i].b)$

```cpp
struct dish//菜的a,b和用时t
{
    ll a, b, t;
    friend bool operator < (node a, node b) {
	    return a.b * b.t > b.b * a.t;
    }
} d[100];

ll T, n;
int main()
{
    cin >> T >> n;
    for (int i = 1; i <= n; i++)
        cin >> d[i].a;
    for (int i = 1; i <= n; i++)
        cin >> d[i].b;
    for (int i = 1; i <= n; i++)
        cin >> d[i].t;
    sort(d + 1, d + 1 + n, cmp);

    ll dp[100005] = {0};
    ll max1 = 0;
    for (int i = 1; i <= n; i++){
        for (int j = T; j >= d[i].t; j--){
            dp[j] = max(dp[j], dp[j - d[i].t] + d[i].a - j * d[i].b);//正常01背包价值模拟，要注意时间是j
            max1 = max(max1, dp[j]);//用的是该方案中最后的时间，不一定时间越靠后越好
        }
    }
    cout << max1 << endl;
    return 0;
}
```
