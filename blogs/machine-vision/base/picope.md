---
title: 图像操作
---

## 视频的生成

视频是由一帧一帧的图像构成  
首先打开默认摄像头 `VideoCapture cap(0);`   
然后使用循环对帧进行读取和打印  

```cpp
cv::Mat frame;
while (true) {
  	cap >> frame;
  	cv::imshow("output", frame); // 显示图像
}
```

## 画圆函数

### 函数原型

```cpp
cvCircle (
	cv::Mat img,
  cvPoint center,
  int radius,
  cvScalar color,
  int thickness = 1,
  int lineType = 8,
  int shift = 0
)
```

### 参数分析

- `img`：源图像
- `center`：圆心坐标
- `radius`：圆半径
- `color`：圆的颜色
- `thickness`：正数表示线条粗细程度，负数表示圆是否被填充
- `line_type`：线条类型
    - $8$ 联通线条<br>![](https://gss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/d043ad4bd11373f05ada557ba30f4bfbfaed0468.jpg)
    - $4$ 联通线条<br>![](https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=9ebd7e55870a19d8cb568c0303caaeb3/64380cd7912397ddf346bfe05e82b2b7d0a28712.jpg)
- `shift`：圆心点坐标与小数点位数