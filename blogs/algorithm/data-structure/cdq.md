---
key: 2021-10-07-三维偏序_CDQ分治
layout: article
title: 三维偏序_CDQ分治
subtitle: 好几个都要小？那怎么找？🤔
categories: 离线算法
tags: [离线算法]
aside:
  toc: true
sidebar:
  nav: docs-en
---

# 导引问题
$n$ 个元素， $3$ 个属性，对于每个 $i$ 需要快速找到有多少个 $j(j\neq i)$ ，使得 $\{a_j\le a_i,\;b_j\le b_i,\;c_j\le c_i\}$

# 一维偏序
<span style="font-size: 20px">· $a_j\le a_i$</span>  
可以对所有元素进行<span style="color: red;">排序</span>，那么排序后的第 $i$ 个元素前就有 $i-1$ 个元素比它小

# 二维偏序

<span style="font-size: 20px">· $a_j\le a_i$ ， $b_j\le b_i$</span>  
先双关键字排序，排序后<span style="color: red;">第一关键字已经正序</span>，所以先不用管了  
问题就变成了<mark>“当前序列中，每一个元素前面的元素的 $b$ 比它小的有多少个”</mark>
## 做法1-树状数组  

和<span style="color: red;">求逆序对</span>是一个道理，只不过这次是找小的  
对于每一个位置，都会`update`一下这个位置的元素，让它在树状数组中映射的一系列位置`+ val`  
在求每一个数之前，让这个数的 `res` 加上查询这个数在树状数组中的前缀 `query()`  
  
**这样就保证了：**  
1.每一个更新过的的树状数组元素都是前面出现过的数。  
2.每一次查询的前缀都是 $\le$ 自己的数  

## 做法2-归并排序  

我们在双关键字排序之后，虽然可以保证对 $i$ 满足二维偏序的 $j$ 都在 $i$ 的前面，但是不能保证前面的都是满足二维偏序的，因为有可能 $a_j\lt b_i$ 但是 $b_j\gt b_i$  
但是既然<span style="color: red;">满足的都在前面</span>，我们只要<span style="color: red;">对前面的 $b$ 再排个序</span>就可以直接快速查询了  
但我们不想浪费时间重复进行一样的操作，那么就可以在排序的时候顺带对每个位置的 `res` 进行获取了  
<mark>想要排序的时候进行每一个位置的统计</mark>，可以使用归并排序  
  
我们将这个数组拆成两半  
由于归并的特性，此时这<span style="color: red;">两半均都已经排好序</span>了  
那么我们可以使用<span style="color: red;">双指针</span>分别推动两个区间的进行  
使用 $i$ 推动左指针， $j$ 推动右指针  
如果 $b_i\le b_j$ 那么就推动 $i$ 并让计数器 $+1$ ，直到 $b_i\gt b_j$ 推动 $j$ ，并在推动之前让这个点的 `res` 加上计数器的值  
那么一层层递归下去，最终每一个点的所有情况都会被考虑完，也就记录好了

# 三维偏序

<span style="font-size: 20px">· $a_j\le a_i$ ， $b_j\le b_i$</span>  
我们采用<mark><span style="color: red;"><b>CDQ分治</b></span></mark>的做法  
<mark>前面的都是和二维偏序的归并排序一样的做法</mark>  
在第三维的时候，由于第二维每走一个数对`sum + 1`是<span style="color: blue;">不安全</span>的  
一样的道理，前面的 $c$ <span style="color: blue;">不一定均满足 $c_j\le c_i$</span>  
那么我们可以用**树状数组**  
<span style="color: red;">每走一步都是满足 $a_j\le a_i$ 和 $b_j\le b_i$ 的</span>，那么我们在计入 $j$ 位置的元素时对 $c_j$ `update` 一下，那么在<span style="color: red;">查询前缀</span>了的时候就保证了在满足 $a_j\le a_i$ 和 $b_j\le b_i$ 的情况下，查询的是 $c_j\le c_i$ 的点了  
就是<span style="color: red;">三维都满足</span>的点了 

# CDQ分治算法架构

|--存入元素结构体  
|--对第一关键字排序  
|--归并排序  
|----指针移动按第二关键字排序  
|----左指针移动加入树状数组  
|----右指针移动元素累加答案  
|----走完没有走完的指针
|----按排序后的顺序挪进原数组  
|--输出答案

# 例题
<span style="font-size: 20px;">AcWing2815. 三维偏序</span>  
[题目地址](https://www.acwing.com/problem/content/description/2817/)  
[题解地址](https://github.com/Chivas-Regal/ACM/blob/main/Code/%E7%A6%BB%E7%BA%BF%E7%AE%97%E6%B3%95/%E5%A4%9A%E7%BB%B4%E5%81%8F%E5%BA%8F/%E4%B8%89%E7%BB%B4%E5%81%8F%E5%BA%8F/%E4%B8%89%E7%BB%B4%E5%81%8F%E5%BA%8F.md)  
  
<span style="font-size: 20px;">AcWing2847. 老C的任务</span>  
[题目地址](https://www.acwing.com/problem/content/2849/)  
[题解地址](https://github.com/Chivas-Regal/ACM/blob/main/Code/%E7%A6%BB%E7%BA%BF%E7%AE%97%E6%B3%95/%E5%A4%9A%E7%BB%B4%E5%81%8F%E5%BA%8F/%E4%B8%89%E7%BB%B4%E5%81%8F%E5%BA%8F/%E8%80%81C%E7%9A%84%E4%BB%BB%E5%8A%A1.md)  
  
<span style="font-size: 20px;">AcWing2819. 动态逆序对</span>  
[题目地址](https://www.acwing.com/problem/content/2821/)  
[题解地址](https://github.com/Chivas-Regal/ACM/blob/main/Code/%E7%A6%BB%E7%BA%BF%E7%AE%97%E6%B3%95/%E5%A4%9A%E7%BB%B4%E5%81%8F%E5%BA%8F/%E4%B8%89%E7%BB%B4%E5%81%8F%E5%BA%8F/%E5%8A%A8%E6%80%81%E9%80%86%E5%BA%8F%E5%AF%B9.md)
