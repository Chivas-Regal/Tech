---
title: SpringCache 注解增删改
---

我们在 [起步程序](./0-begin.html#起步案例) 中简单实用了 `@Cacheable` 注解  
接下来介绍几个功能性注解。

## 功能性注解

### 注解属性与 key 生成

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

### @Cacheable

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

### @CachePut

注解属性没有 sync ，别的都有。  
一般标注在方法上，不管有没有对应 key 的缓存，本方法体全部执行，然后将返回值加入缓存，一般用作缓存的修改

示例：根据网站 name，做网站关注给关注量 star 加一，并将结果返回    
（这里启用两个是因为在<mark>同一个类做内部方法互相调用的时候，会导致 proxy 失效那么 aop 切面就会失效，所以将要被调用的方法切到另一个类中</mark>）  

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

### @CacheEvict

用作缓存的移除，表示从缓存库中删除对应的 key

```java
@CacheEvict(value = "website", key = "#name")
public Boolean delete (String name) {
    return true;
}
```

### @Caching  

用于组合多个 Cache 注解

```java
    @Caching(
        cacheable = {
            @Cacheable(value = "website1", key = "#name"),
            @Cacheable(value = "website2", key = "#root.methodName")
        },
        put = {
            @CachePut(value = "website", key = "#name")
        },
        evict = {
            @CacheEvict(value = "website-demo", key = "#root.methodName")
        }
    )
    public void groupOpe (String name) {
        ...
    }

```

这样可以完成缓存操作的嵌套

### @CacheConfig

放在类名上，可以通过 `cacheNames` 注解属性为本类所有的添加了缓存的方法设置公共的 `value`  

```java
@Service
@CacheConfig(cacheNames = "website")
class WebsiteCacheableService {

    /**
     * 根据网站 name 查询网站信息，封装为 Website 类的 json 返回
     * @param name 网站名
     * @return 网站信息的 Website json 格式
     */
    @Cacheable(key = "#name")
    public Website get (String name) {
        return new Website(name, 0);
    }
}
```

这个 `get` 实际上的 `@Cacheable` 相当于 `@Cacheable(value = "website", key = "#name")`   

## 实际使用：网站的创建、点赞与删除

### 代码部分

这里不加任何复杂的应用（如 MySQL 持久化），纯用 SpringCache 集成 Redis 在缓存中完成操作。  

将我们上面演示注解用的方法拼成如下的 Service 层代码  

```java
// com.snopzyz.service. WebsiteService.java

@Service
@CacheConfig(cacheNames = "website")
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
    @CachePut(key = "#name")
    public Website star (String name) {
        Website website = cacheableService.get(name);
        website.setStar(website.getStar() + 1);
        return website;
    }

    /**
     * 根据 name 删除网站
     * @param name 网站名
     * @return 删除后的结果，都为 true
     */
    @CacheEvict(key = "#name")
    public Boolean delete (String name) {
        return true;
    }

}

@Service
@CacheConfig(cacheNames = "website")
class WebsiteCacheableService {

    /**
     * 根据网站 name 查询网站信息，封装为 Website 类的 json 返回
     * @param name 网站名
     * @return 网站信息的 Website json 格式
     */
    @Cacheable(key = "#name")
    public Website get (String name) {
        return new Website(name, 0);
    }
}

```

然后修改一下 Controller ，直接调用自动装配的 service  

```java
// com.snopzyz.controller. WebsiteController.java

@RestController
@RequestMapping("/website")
public class WebsiteController {

    @Autowired
    private WebsiteService websiteService;

    @GetMapping("/{name}")
    public Website get (@PathVariable String name) {
        System.out.println("WebsiteController 执行 get(" + name + ") 方法");
        return websiteService.get(name);
    }

    @PutMapping
    public Website star (@RequestBody Website website) {
        String name = website.getName();
        System.out.println("WebsiteController 执行 star(" + name + ") 方法");
        return websiteService.star(name);
    }

    @DeleteMapping("/{name}")
    public Boolean delete (@PathVariable String name) {
        System.out.println("WebsiteController 执行 delete(" + name + ") 方法");
        return websiteService.delete(name);
    }
}
```

### 测试环节

这里就是用了 RestFul 开发风格的请求格式，先确定一下 Redis 库中是否什么数据都没有。  
![20231103092848](https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231103092848.png)

<ol>
  <li>
    <b>GET请求 <code>http://localhost:8080/website/snopzyz</code></b>
    <ol>
      <li>
        控制台：<br><img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231103093001.png" style="width: 400px;">
      </li>
      <li>
        响应体：<br><img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231103093044.png" style="height: 400px;">
      </li>
      <li>
        缓存库：<br><img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231103093135.png" style="width: 500px;">
      </li>
    </ol>
  </li>
  <li>
    <b>POST请求 <code>http://localhost:8080/website/</code> 并夹带 json 请求体 <code>{"name": "snopzyz"}</code></b>
    <ol>
       <li>
         控制台：<br><img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231103093820.png" style="width: 400px;">
       </li>
       <li>
         响应体：<br><img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231103093859.png" style="height: 400px;">
       </li>
    </ol>
  </li>
  <li>
    <b>DELETE请求 <code>http://localhost:8080/website/snopzyz</code></b>
    <ol>
      <li>
        控制台：<br><img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231103094033.png" style="width: 400px;">
      </li>
      <li>
        响应体：<br> <code>true</code>
      </li>
      <li>
        缓存库：<br><img src="https://cr-demo-blog-1308117710.cos.ap-nanjing.myqcloud.com/chivas-regal/20231103094111.png"><br>数据消失
      </li>
    </ol>
  </li>
</ol>

测试符合逻辑与预期，成功