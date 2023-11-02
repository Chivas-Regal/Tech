---
title: SpringCache 注解增删改
---

我们在 [起步程序](./0-begin.html#起步案例) 中简单实用了 `@Cacheable` 注解  
接下来介绍几个功能性注解。

## 注解属性与 key 生成

先说明一下 SpringCache 在注解里面的一些属性名：  

属性名|作用
-|-
`cacheNames` / `value` | 缓存的名字，可以理解为 key 的前缀（“姓”）
`key` | 缓存时 key 的主体（“名”）
`keyGenerator` | 缓存生成策略，和 key 二选一，可自定义工具自动生成对应格式的 key
`cacheManager` / `cacheResolver` | 缓存管理器，两者二选一
`condition` | 指定缓存的条件，如 `condition = "#star>100"` 就是当参数中的 `star` 超过 $100$ 了才进行缓存
`unless` | 不进行缓存的条件，和上面使用方法一样但是是不进行缓存
`sync` | 是否使用异步缓存，默认为 false

其中对于 key 的生成，SpringCache 给出了一个 root 对象可以获得全局的一些信息  

属性名|表示信息|示例
-|-|-
`methodName` | 当前方法名 | `#root.methodName`
`method` | 当前方法 | `#root.method.name`
`target` | 当前被调用对象 | `#root.target`
`targetClass` | 当前被调用对象的类 | `#root.targetClass`
`args` | 当前方法组成的数组 | `#root.args[0]`
`caches` | 当前方法使用的 Cache | `#root.caches`

比如下面代码  

```java
...
    @Cacheable(value = "website", key = "#root.methodName+'_'+#name")
    public Website get (String name) {
        return new Website(name, 0);
    }
...
```

调用 `get(snopzyz)` 生成的缓存就叫做 `website::get_snopzyz`  

## @Cacheable

注解内的属性这里都有。  
一般标注在方法上，用作缓存结果，key 通常为参数中的信息。  
在方法运行开始之前用配置的注解属性生成 key 的 String 值，并判断该 key 是否存在于缓存库中  
- 如果不存在：执行方法体，并将结果添加进缓存中
- 如果存在：绕过方法体，直接通过缓存库中的 value 进行返回

示例：根据网站 name 获取网站信息 (name,star)  

```java
@Cacheable(key = "#name")
public Website get (String name) {
    return new Website(name, 0);
}
```

## @CachePut

注解属性没有 sync ，别的都有。  
一般标注在方法上，不管有没有对应 key 的缓存，本方法体全部执行，然后将返回值加入缓存，一般用作缓存的修改

示例：根据网站 name，做网站关注给关注量 star 加一，并将结果返回    
（这里启用两个是因为在同一个类的时候，get 也会被展开强制调用，使用将 @Cacheable 的信息提到另一个类）  
```java
@Service
public class WebsiteService {

    @Autowired
    private WebsiteCacheableService cacheableService;

    public Website get (String name) {
        return cacheableService.get(name);
    }

    /**
     * 根据 name 给网站添加 star 收藏数
     * @param name 网站名
     * @return 添加 star 后的网站
     */
    @CachePut(value = "website", key = "#name")
    public Website star (String name) {
        Website website = cacheableService.get(name);
        website.setStar(website.getStar() + 1);
        return website;
    }
}
@Service
class WebsiteCacheableService {

    /**
     * 根据网站 name 查询网站信息，封装为 Website 类的 json 返回
     * @param name 网站名
     * @return 网站信息的 Website json 格式
     */
    @Cacheable(value = "website", key = "#name")
    public Website get (String name) {
        return new Website(name, 0);
    }
}
```

## CacheEvict

用作缓存的移除，表示从缓存库中删除对应的 key

```java
@CacheEvict(value = "website", key = "#name")
public Boolean delete (String name) {
    return true;
}
```

## Caching  

用于组合多个 Cache 注解