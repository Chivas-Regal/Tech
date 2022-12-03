---
title: 环境配置
---

## MacOS

由于作者的 `homebrew` 在下载这个的时候不断出问题，于是这里使用非 `homebrew` 的安装方案  

### 安装 Xcode

首先在 `AppStore` 上搜索 `Xcode` 然后手动点击下载即可  
终端输入命令 `sudo xcodebuild -licens` ，然后按它的协议不断按下 `enter` 直到给出询问是否同意，写入 `agree` 即可  
再输入 `sudo xcode-select --install`

### 安装 conda

前往 [Github下载链接](https://github.com/conda-forge/miniforge)  
在这里选择对应电脑系统的版本复制其路径  
![20221203110238](https://raw.githubusercontent.com/Tequila-Avage/PicGoBeds/master/20221203110238.png)  
在终端输入命令 `curl -L -O <复制下来的路径>`   
或者直接用链接下载后 `cd` 到下载目录内  
  
对下载的 `.sh` 文件加入可执行权限  
如作者下载的是 `OS X - x86_64` 版本，就 `chmod +x Miniforge3-MacOSX-x86_64.sh`  
然后执行 `./Miniforge3-MacOSX-x86_64.sh -u`
  
`source ~/.zshrc` 用作保存  

### 安装 numpy

终端输入 `conda search numpy` 发现里面有 `numpy`  
于是直接 `conda install numpy`

完成后测试一下：  

```
python -v
>>> import numpy
>>>
```
发现无报错，说明安装好了  

### 编译 OpencCV

终端依次输入以下命令  

```
wget -O opencv.zip https://github.com/opencv/opencv/archive/4.5.0.zip
wget -O opencv_contrib.zip https://github.com/opencv/opencv_contrib/archive/4.5.0.zip
unzip opencv.zip
unzip opencv_contrib.zip
cd opencv-4.5.0
mkdir build && cd build
```

打入编译配置命令，以 `x86_64` 为例  

```
cmake \
  -DCMAKE_SYSTEM_PROCESSOR=x86_64 \
  -DCMAKE_OSX_ARCHITECTURES=x86_64 \
  -DWITH_OPENJPEG=OFF \
  -DWITH_IPP=OFF \
  -D CMAKE_BUILD_TYPE=RELEASE \
  -D CMAKE_INSTALL_PREFIX=/usr/local \
  -D OPENCV_EXTRA_MODULES_PATH=/Users/snopzyz/opencv_contrib-4.5.0/modules \
  -D PYTHON3_EXECUTABLE=/Users/snopzyz/miniforge3/bin/python3 \
  -D BUILD_opencv_python2=OFF \
  -D BUILD_opencv_python3=ON \
  -D INSTALL_PYTHON_EXAMPLES=ON \
  -D INSTALL_C_EXAMPLES=OFF \
  -D OPENCV_ENABLE_NONFREE=ON \
  -D BUILD_EXAMPLES=ON ..
```

然后执行 `make -j8` 和 `sudo make install`
