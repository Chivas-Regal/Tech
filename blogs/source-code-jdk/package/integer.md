---
title: java.lang.Integer
---

## parseInt(java.lang.String s, int radix)

**给定一个数的字符串版（第一个参数），其进制必须符合给定的进制（第二个参数），将该数转换为 int 范围内的十进制。**  

这个方法前面比较好理解，分别校验空、给定进制不属于 $[2,36]$ 的范围，就抛出异常。

```java
if (s == null) {
    throw new NumberFormatException("null");
}

if (radix < Character.MIN_RADIX) {
    throw new NumberFormatException("radix " + radix +
                                    " less than Character.MIN_RADIX");
}

if (radix > Character.MAX_RADIX) {
    throw new NumberFormatException("radix " + radix +
                                    " greater than Character.MAX_RADIX");
}
```

然后启用了几个变量，这里注释列一下都表示什么意思

```java
// - |转换结果|
int result = 0;
// 该字符串是否表示负数
boolean negative = false;
// 迭代用的下标和范围
int i = 0, len = s.length();
// result 的范围限制
int limit = -Integer.MAX_VALUE;
// result 乘“进制基数radix”前的范围限制
int multmin;
// s[i]的数字
int digit;
```

::: tip 负数累减

此处需要先说明一点的是，`result` 的计算方法并不是入门时学进制转换时的 `result * radix + digit`，而是采用了负数累减的形式，也就是 `result * radix - digit`，所以上面标记了 `result` 是转换结果绝对值的相反数。  
同时 `limit` 使用负数，当首位为 '-' 时将其设为 `Integer.MIN_VALUE`。    
  
这是用了一种简化代码的方式，在处理边界溢出时更加容易，在绝对值中，`Integer.MIN_VALUE` 相比于 `MAX_VALUE` 多了 1，这样做和 “正数累加到最后再判断 `negative`” 的效果是一样的，同时不至于使用正数累加时还要额外处理 "-2147483648" 的情况。  

:::

后面套了一层 size 检测的判断，和最后的根据 `negative` 判断返回正负值。

```java
if (len > 0) {
    ...
} else {
    throw NumberFormatException.forInputString(s);
}

return negative ? result : -result;
```

省略的在下面，前面是对首字符的判断，对一些边界情况处理，主要目的是设定正确的 

- `negative`：首位为负，则为 true
- `limit`：首位为负，则边界扩展 1，到 "-2147483648"
- `multmin`：`result` 乘 `radix` 之前不能超过 `limit`，否则会溢出 Integer 的边界

<div/>

```java
char firstChar = s.charAt(0);
if (firstChar < '0') { // 主要处理 "+" 或 "-"
    if (firstChar == '-') {
        negative = true;
        limit = Integer.MIN_VALUE;
    } else if (firstChar != '+') // 不能既不是 "+" 也不是 "-"
        throw NumberFormatException.forInputString(s);

    if (len == 1) // 不能只有 "+" 或 "-"
        throw NumberFormatException.forInputString(s);
    i++;
}
// 设定原因同上介绍
multmin = limit / radix;
```

接着就是核心的 “负数累减” 逻辑了，实际逻辑就是 `result = result * radix - digit`，但是每一步操作前都加了一些校验。  
细致的逻辑讲解都在代码注释里面了，至于 Character.digit 的实现逻辑后面会说（还没说，先打个 TODO 捏）

```java
// i 往后扫描所有字符
while (i < len) {
    // 对于当前字符，在 radix 进制下实际表示的值
    digit = Character.digit(s.charAt(i++),radix);
    // 当前字符如果不在 radix 进制内，上面一行会返回 -1
    if (digit < 0) {
        throw NumberFormatException.forInputString(s);
    }

    // 乘进制的步骤，乘之前先校验一下防止溢出
    if (result < multmin) {
        throw NumberFormatException.forInputString(s);
    }
    result *= radix;

    // 可变更为 result - digit < limit，是减之前校验防止溢出的
    if (result < limit + digit) {
        throw NumberFormatException.forInputString(s);
    }
    result -= digit;
}
```