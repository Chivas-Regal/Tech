---
title: 数据类型
---

## cvRect  

`cvRect`：通过矩形的左上角坐标和宽高确定一个矩形区域  

```cpp
typedef struct cvRect {
    int x;
  	int y;
  	int width;
  	int height;
}
```

## 通道与位深

矩阵数据类型 `– CV_<bit_depth>(S|U|F)C<number_of_channels>`   

- `bit_depth` 位深：表示每个值由多少位来存储，一般图片是 $8bit$（位）的
- `(S|U|F)` 类型： `S` = 符号整型，`U` = 无符号整型，`F` = 浮点型
- `number_of_channels` 通道数
    - $1$ 通道的是灰度图。
    - $2$ 通道的图像是 $RGB555$ 和 $RGB565$。$RGB555$ 是 $16$ 位的，$2$ 个字节，$5+6+5$，第一字节的前 $5$ 位是 $R$，后三位+第二字节是 $G$，第二字节后 $5$ 位是 $B$，可见对原图像进行压缩了。
    - $3$ 通道的是彩色图像，比如 $RGB$ 图像。
    - $4$ 通道的图像是 $RGBA$，是 $RGB$ 加上一个 $A$ 通道，也叫 $alpha$ 通道，表示透明度

## 线条类型

$8$ 联通线条<br>![](https://gss0.baidu.com/94o3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/d043ad4bd11373f05ada557ba30f4bfbfaed0468.jpg)  
$4$ 联通线条<br>![](https://gss0.baidu.com/9fo3dSag_xI4khGko9WTAnF6hhy/zhidao/wh%3D600%2C800/sign=9ebd7e55870a19d8cb568c0303caaeb3/64380cd7912397ddf346bfe05e82b2b7d0a28712.jpg)

## 边界处理方式

- `BORDER_DEFAULT` 边界默认：自动填充图像边界
- `BORDER_CONSTANT` 边界常数：用指定像素值填充边界
- `BORDER_REPLICATE` 边界复制：填充边缘像素用已知的边缘像素值，复制原图中邻近的行或列
- `BORDER_WRAP` 边界包装：用另外一边的像素值来补偿填充