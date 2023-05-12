---
title: 起步
---

开这篇文章的起因其实是想尝试一下 QT 的 `qmake` ，然后发现指令好多 ... ，包含  

```
编译：
$ qmake -project QT+=widgets
$ qmake ./$project_name.pro
$ make
运行：
$ ./$project_name.app/Contents/MacOS/$project_name
```

懒人噩梦罢了，然后看到网上说可以把命令用 shell 封装成一个 `.sh` 文件，需要执行的时候直接 `bash 文件名.sh` 即可  
看起来很好玩，开整