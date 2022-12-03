---
title: Cmake 载入 OpenCV
---

加入这段话

```
set(OpenCV_DIR /<opencv路径>/opencv-4.5.0/build/lib)

find_package(OpenCV REQUIRED)

include_directories(${OpenCV_INCLUDE_DIRS})

link_libraries(${OpenCV_LIBS})
```