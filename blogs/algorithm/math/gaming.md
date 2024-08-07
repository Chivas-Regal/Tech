---
key: 2022-01-02-博弈论
layout: article
title: 博弈论
aside:
  toc: true
sidebar:
  nav: docs-en
---

## 博弈论

### 特点

<ul>
  <li>两个以上玩家</li>
  <li>状态为有限的集合</li>
  <li>双方轮流操作</li>
  <li>具有规则</li>
  <li>有限次操作结束</li>  
  <li>有胜负</li>
  <li><span style="color: red;">两人足够聪明</span></li>
</ul>

### 必定点

必胜（败）点：在该点进行操作的人必胜（败）

#### 属性

$1.$ 所有<span style="color: red;">终结点</span>为必败点\
$2.$ <mark>每个必胜点至少有一个操作进入必败点</mark>\
$3.$ <mark>必败点只能走入必胜点</mark>

#### 图示

<img src="https://s2.loli.net/2022/01/02/XPn3aRLEVf8j9tW.png">




## 巴什博弈

<b>$2$ 人， $n$ 枚石子，双方轮流选取，不能拿或且不可拿超过 $x$ 枚，没石子可拿的人就输了</b>\
这个问题由于两个人一定足够聪明，他们会有一种“跟着选”的策略\
即：如果当前石子数为 $x+1$ 的倍数，那么如果一个人拿了 $a$ 个，那么第二个人只要跟着拿 $(x+1)-a$ 个就一定可以赢

那么如果 $n$ 是 $x+1$ 的倍数，那么第一个人就一定会输\
同时如果不是的话，<span style="color: red;">第一个人可以把这 $n$ 个石子变成 $x+1$ 的倍数</span>，他就一定可以获胜了



## 尼姆博弈

$2$ 人，多堆石子，每个人选取其中一堆石子取走任意个石子

::: tip
<b>三堆石子分析</b>\
$(0,0,0)$ 必败\
$(0,0,x)$ 必胜\
$(0,1,1)$ 必败\
$(0,x,x)$ 必败\
$(x,y,z)$ $?$
:::

### 尼姆和

按位的异或（上面是 $x\oplus y\oplus z$)\
<span style="color: red;">其中 $0$ 必败，否则必胜</span>

::: tip
<b>证明:</b>
例如三堆石子为 $13,12,8$<br>
$\frac{\begin{aligned}13&=1101_2\\12&=1100_2\\\oplus\;\;\;\;8&=1000_2\end{aligned}}{nim\_sum=1001_2=9}$<br>
  
<br>
  
如果有方法令 $9$ 变成 $0$ 则必胜（属性 $②$ ）<br>
可以令第一个数变成 $0100$ ，则<br>
$\frac{\begin{aligned}13&=0100_2\\12&=1100_2\\\oplus\;\;\;\;8&=1000_2\end{aligned}}{nim\_sum=0000_2=0}$<br>
朴素做法：结果从前往后，第一个 $1$ 上面一定是有奇数个 $1$ ，选择一行该位置为 $1$ 的，这个位置变成 $0$ ，后面再遇到选取同行并取反\
$\therefore$ 满足<br>
  
<br>
  
如果任意方法都会让结果非 $0$ 则必败（属性 $③$ ）\
本身已经是 $0000$ 平衡了，即任意位置都有偶数个 $1$\
操作后必定会改变其中一列的 $1$ 的个数成为奇数个，打破平衡使结果非 $0$ ，必败\
$\therefore$ 满足
:::


**问题**

| $Question$                 | $Answer$                                                     |
| -------------------------- | ------------------------------------------------------------ |
| 判断先手输赢               | 根据起始状态的尼姆和                                         |
| 求先手拿石子可赢的方案数量 | 看尼姆和第一位 $1$ 上面有多少个 $1$ ，因为<span style="color: red;">不可以加石子</span> |



## $SG$ 函数

$x$ 节点的 $sg$ 值是不等于 $x$ 后继节点的 $sg$ 值的最小非负整数\
即： $sg(x)=mex(\{sg[son_x]\})$

<span style="color: red;">其中 $0$ 必败，否则必胜</span>

::: tip
<b>证明：</b>看巴什博弈(最多可以拿三个)\
<img src="https://s2.loli.net/2022/01/02/NUyx4wjbIA1tYnd.png">
终结状态 $sg$ 必 $0$ ，非零必胜 （属性 $①$ ）\
能转移到 $0$ 的均必胜（属性 $②$ ），在 $sg$ 内必定不为 $0$\
不能转移到 $0$ ，即必须转移到正整数，本身一定是 $0$ ，必败（属性 $③$ ）
:::

## 例

### 1

<b>$3$ 堆石子， $5,7,9$ 个。轮流拿石子，必拿但不超过三个。讨论先手的输赢</b>\
\
看作 $3$ 个巴什博弈：\
$sg(5)=5\%4=1$\
$sg(7)=7\%4=3$\
$sg(9)=9\%4=1$\
<mark><span style="color: red;">多用尼姆和与 $sg$ 函数相结合，全局输赢 $=sg(x_1)\oplus sg(x_2)\oplus\dots\oplus sg(x_n)$</span></mark>\
本问题中讨论即 $res\_sg$ 为 $0$ 则先手必败，否则先手必胜

### 2

<b>给定规则数 $n$ ，即可以拿走 $a[1～n]$ 个石子</b>\
<b>给定情况数 $m$ ，每种情况有 $o$ 堆牌，每堆 $x[1～o]$ 张，讨论每种情况的先手输赢</b>



程序采用记忆化搜索

```cpp
int n, m;   // 规则数，情况数
int a[100]; // 规则

int sg[10001];
inline int SG ( int all ) {
        bool vis[101] = {0};
        for ( int i = 0; i < n; i ++ ) {
                int remain = all - a[i]; // 剩余的石子数
                if (remain < 0) break;   // 少于0个不存在
                if ( sg[remain] == -1 ) sg[remain] = SG(remain); // 继续递归子状态的sg值
                vis[sg[remain]] = 1;     // 子状态sg值标记一下
        }
        for ( int i = 0; ; i ++ ) if ( !vis[i] ) return i; // sg定义
}

int main () {
        cin >> n; 
        for ( int i = 0; i < n; i ++ ) cin >> a[i];
        
        sort(a, a + n); // 可以在sg内部选取拿走的石子数量上进行 break 优化
        memset(sg, -1, sizeof sg);
        sg[0] = 0;

        cin >> m; while ( m -- ) {
                int res_sg = 0;

                int o; cin >> o; while ( o -- ) {
                        int x; cin >> x;
                        if ( x == -1 ) sg[x] = SG(x);
                        res_sg ^= sg[x];
                }

                if ( res_sg == 0 ) cout << "先手必败" << endl;
                else cout << "先手必胜" << endl;
        }
}
```

