---
title: 第一个cgi程序
---

我们在配置的解析路径内创建一个 `.cpp` 程序，主要是以输出 `html` 为主  

```cpp
# include <iostream>

int main () {
    std::cout << "Content-Type:text/html;charset=utf-8\r\n\r\n\r\n"; // 头一定要加，用作解释

    std::string html = "<!DOCTYPE html>\n"
                       "<html lang='en'>\n"
                       "<head>\n"
                       "    <meta charset='utf-8'>\n"
                       "    <title>数据库</title>\n"
                       "</head>\n"
                       "<body>\n"
                       "<h1>Hello CGI!</h1>\n"
                       "</body>\n"
                       "</html>";
    std::cout << html << std::endl;
}
```

编译生成 `.cgi` 后进入对应网页  
![20221215224324](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221215224324.png)  

解析成功