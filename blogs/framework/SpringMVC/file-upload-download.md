---
title: 浏览器对文件的上传下载
---

客户端有这样的请求行为：  
- 向某个地址 upload 一个文件 
- 向某个地址请求 download 一个文件  

## upload  

客户端用 post 发送文件，MVC 提供了接受类 `MultipartFile`  
通过它可以获取到文件名以及转存功能  

转存的时候本地需要一个路径，每次写文件夹都太麻烦并且容易写错  
于是将文件夹名加入配置类  

```properties
upload.base-path.img = /A/B/C
```

然后后端核心功能语句就是  

```java

public class XxxController {

    @Value("${upload.base-path.img}")
    private String baseDir;

    ...

    @PostMapping("/upload")
    public R<String> upload (MultipartFile file) {
        /* 获取文件名 */
        String fileName = file.getOriginalFilename();
        try {
            /* 另存为(文件：baseDir+fileName) */
            file.transferTo(new File(baseDir + fileName));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

...
}
```

当然里面还涉及到一些问题    

1. 存储的文件名重复问题：截取后缀，然后用 uuid 生成随机文件名再存  
2. `baseDir` 不存在，先判断一下，不存在的时候创建  

这些都是细枝末节，自己实现即可  

## download

要下载的肯定都是之前存过的文件，假设还在那个 `base-path` 内    
  
这里的核心是 **读取本地文件** 并 **response给浏览器**  
自然就需要用到两个流：`FileInputStream` 和 `ServletOutputStream`  
采用的策略是读写同步，也就是我们一次读多少就响应回去多少直到读完为止  

```java
FileInputStream inputStream = ...;
ServletOutputStream outputStream = ...;

int len = 0;
byte[] bytes = new byte[1024];
while ( (len = inputStream.read(bytes)) != -1 ) {
    outputStream.write(bytes, 0, len);
    outputStream.flush();
}
```

我们应当直到要获取的是哪个文件，所以需要请求中带有文件名  
我们需要获得指定响应体的 `ServletOutputStream` ，所以要有 `HttpServletResponse` 参数  

参数有了，主体有了，请求处理方法就有了  

```java
@GetMapping("/download")
public void download (String name, HttpServletResponse response) {
    try {
        /* 创建 本地读取流 与 http输入流 */
        File srcFile = new File(basePath + name);
        FileInputStream inputStream = new FileInputStream(srcFile);
        ServletOutputStream outputStream = response.getOutputStream();

        /* 写 response ，同步读写 */
        response.setContentType("image/jpeg");
        int len = 0;
        byte[] bytes = new byte[1024];
        while ( (len = inputStream.read(bytes)) != -1 ) {
            outputStream.write(bytes, 0, len);
            outputStream.flush();
        }

        inputStream.close();
        outputStream.close();
    } catch (Exception e) {
        e.printStackTrace();
    }
}
```