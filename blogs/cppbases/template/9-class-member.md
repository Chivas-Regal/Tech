---
title: 类 “是/否” 含有成员
---

这里也用到前面我们的 SFINAE 设计模式或者与 `concept` 关键字孪生的 `requires` 关键字  

## SFINAE

根据前面说的如果都匹配不上是会报 error 的，为了避免次情况我们要用 `void` 规避掉错误语句  
然后利用我们重载函数的 **更优匹配** 的思想，而 “优” 就来自于我们规避掉的 “存不存在（报不报错）”  


![20230327174556](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20230327174556.png)