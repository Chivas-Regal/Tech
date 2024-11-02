---
title: java.lang.Byte
---

## valueOf(byte b)

**默认的 byte $\rightarrow$ Byte 的装箱行为**

这个方法本身没什么逻辑，甚至整体来说 Byte 这个类就没什么逻辑，但是它使用到的优化是值得一提的。  
它内部实现如下  

```java
final int offset = 128;
return ByteCache.cache[(int) b + offset];
```

可以看到它使用了一个数组中，这里面每一个对象都是被提前设定好的。    

```java
private static class ByteCache {
    // -128 ~ 0 ~ 127
    static final Byte[] cache = new Byte[-(-128) + 127 + 1];
    
    static {
        for(int i = 0; i < cache.length; i ++) {
            cache[i] = new Byte((byte) (i - 128));
        }
    }
    
    private ByteCache() {
    }
}
```

具体验证也比较好用，输出一下两个值一样的 Byte 对象他们各自的 hashCode（这里使用重写前的方式）。  

![QQ_1730553662393](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/QQ_1730553662393.png)  

::: tip 为什么 Byte 要缓存对象？

这种缓存机制不仅仅适用于 Byte 类，Short、Integer、Long 等包装类也采用了类似的缓存策略（尽管缓存的范围可能不同）  
出于性能考虑，首先这种常用的数值类肯定会被频繁使用的，因此提前创建好可以避免中途频繁创建对象的开销。  
出于空间考虑，这种做法看似提前占用了一部分内存，但实际上如果不这么做，后面每次创建都新申请一部分内存空间，也会较为麻烦。  


:::: warning 什么？你问它们是同一个对象会不会互相影响修改？  
这种数值包装类是不可变的，就算是各种运算，它们会先被自动拆箱为对应的基本类型，运算完再装箱为类对象，所以没逝的啦~
::::