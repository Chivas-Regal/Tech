---
key: 2021-03-01-KMP
layout: article
title: KMP
subtitle: 文本识别匹配，引擎技术？🤔
categories: 字符串
tags: [字符串]
aside:
  toc: true
sidebar:
  nav: docs-en
---

# KMP算法

>**导引问题-字符串匹配：**  
>给定字符串A和字符串B，请判断A是否为B的子串  
>A串（被匹配的串）称为主串（母串），B串（用来匹配的串）成为模式串  

## 概述：
假设：  
A = "abababaababacb"   B = "ababacb"  
用i指针表示A串：A[i - j + 1 ... i] 表示A串从某位置开始到A[i]的j个字符  
用j指针表示B串：B[1 ... j] 表示B串前j个字符  
如果：A[i - j + 1 ... i] = B[1 ... j] 并且 j = b.size()   
则：B是A的子串    

## 基本思想： 
i不断增加，随着i的增加j相应地变化（i后推，j可能减小但也可能增大），且j满足以A[i]结尾的长度为j的字符串刚好匹配B串的前j个字符（j当然越大越好）。然后检验A[i + 1]和B[j + 1]的关系  
当A[i + 1] = B[j + 1]时，i和j各加一。什么时候j = b.size()了，我们就说B是A的子串（B串已经整完了），并且可以根据此时i值算出匹配的位置  
当A[i + 1] != B[j + 1]，KMP的策略是调整j的位置（减小j值），使得A[i - j + 1 ... i]与B[1 ... j]保持匹配且新的B[j + 1]恰好与A[i + 1]匹配（从而使得i和j能继续相加）  

## 图示：
当i = j = 5时的情况：  
<table>
<tr>
<th>i=</th><td>1</td><td>2</td><td>3</td><td>4</td><td><span style="color:#FF0000;">5</span></td><td>6</td><td>7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>...</td>
</tr>
<tr>
<th>A=</th><td>a</td><td>b</td><td>a</td><td>b</td><td><span style="color:#FF0000">a</span></td><td>b</td><td>a</td><td>a</td><td>b</td><td>a</td><td>b</td><td>...</td>
</tr>
<tr>
<th>B=</th><td>a</td><td>b</td><td>a</td><td>b</td><td><span style="color:#FF0000;">a</span></td><td>c</td><td>b</td>
</tr>
<tr>
<th>j=</th><td>1</td><td>2</td><td>3</td><td>4</td><td><span style="color:#FF0000">5</span></td><td>6</td><td>7</td>
</tr>
</table>

此时A[6] != B[6] -> 减小j的值  
**重点：**减小到多少呢？  
答案：B串向后移动两位，因为我们想让B的5前缀中的一个前缀做到与A的5前缀中的一个后缀匹配，但因为前5个元素已经匹配上了，所以我们求B5前缀中的最长公共前后缀  
于是i还是5，j变成3，同时再都++  
# next数组的意义：
next[i]为第i + 1个对不齐的时候要把模式串指针j移到的位置  
"ababacb"中 next[5] = 3，比5要小但又是最大的一个前缀里面的公共前后缀长度  
使得每次i不用停继续往前走，只需要向回拉j  

## 代码：

```cpp
//特别提醒：以下算法中的字符串A和B，都是从下标1开始储存
inline void KMP(string A, string B){
    int j = 0;
    for(int i = 0; i < n; i ++){ 
        while(j > 0 && B[j + 1] != A[i + 1]) j = next[j];//不能继续匹配且j还没减少到0，减小j的值
        if(B[j + 1] == A[i + 1]) j ++;//能继续匹配，j++
        if(j == m){//找到一处匹配
            printf("%d\n", i - b.size());//输出子串串首再母串中的位置
            j = next[j];//继续寻找匹配（可重叠：A = "ababa", B = "aba"）
        }
    }
}
//灵活1：如果需要统计匹配的数量，如何处理：找到一个不输出位置，换成cnt ++
//灵活2：如果不允许重叠，如何修改：匹配上之后j = 0即可
```

## 一句话理解算法：
扫描字符串A，并更新可以匹配到B的什么位置  
时间复杂度：O(n)  

# next数组的预处理
next[i]表示，当匹配到B数组的第j个字母而第j + 1个字母不能匹配时，新的j最大是多少？  

```cpp
//引申为B串自己和自己匹配的时候预处理好next数组
inline void Get_Next(string B){
    next[1] = 0;
    int j = 0;
    for(int i = 1; i < m; i ++){//i从1，j从0，错位开始，以得到公共前后缀，不错位的话完全一样。。。
        while(j > 0 && B[j + 1] != B[i + 1]) j = next[j];
        if(B[j + 1] == B[i + 1]) j ++;
        next[i + 1] = j;//每趟循环求的是i + 1位置的值
    }
}//要点：1.B串的自我匹配，2.计算匹配串的长度
```

# 例题
>例1：剪花布条

>例2：给定字符串S1和S2，请查找字符串S1的前缀中同时也是S2的后缀的最大长度是多少？  
>样例输入：  
>riemann  
>marjorie  
>样例输出：  
>rie 3  
>思路：连在一起，求总串的next值，但不能超过某个串的最短长度  
