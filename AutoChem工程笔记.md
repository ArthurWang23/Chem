# AutoChem web上位机工程笔记

xy 2023-11

------

## 一. 



## 二. web 播放usb摄像头视频流

### 2.1 方案概述

**采取方案：**

摄像头：HIKVISION DS-UVC-U64-Pro， USB3.0接口，默认情况下分辨率2.5K（2560*1440），帧率30fps , 输出MJPEG码流；

前端 bootstrap + websocket；

后端 nodejs + express框架 + websocket + opencv4nodejs；

​		USB摄像头连接至主机，网页后端nodejs使用opencv相关API打开摄像头并捕获视频流，发送摄像头捕获到的帧到websocket连接发送给前端。

​		前端websocket接收数据，google浏览器原生支持mjpeg格式视频的播放。

**可行性分析：**

<img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20231106130906473.png" alt="image-20231106130906473" style="zoom: 67%;" />

​		通常以太网帧的最大长度是1518字节（不考虑jumbo frame），而以太网传输时需要在帧前传输7个字节的preamble和一个字节的SFD，帧之间还需要96 bit的IFG（Inter-Frame Gap），即12字节，这样千兆网每秒可以传输的以太网帧的数量至少为 125000000/(1518+7+1+12)=81274个。（另外，由于以太网帧最小为64字节，所以千兆网每秒最多能传输的以太网帧数量为125000000/(64+20)=1488095，这个值是帧速率）
​		回到TCP带宽的计算，带宽是针对负载的，所以要去掉TCP,IP头，加上TCP的timestamp option，共52字节，那么千兆网的TCP带宽 = 81274*(1500-52) = 117684752,约为117MB/s （或112 MiB/s）。

> **Motion JPEG**（**M-JPEG**或**MJPEG**，Motion Joint Photographic Experts Group是一种视频压缩格式，其中每一帧图像都分别使用JPEG编码。M-JPEG常用在数码相机和摄像头之类的图像采集设备上。包括Mozilla Firefox，Google Chrome，Safari在内许多网页浏览器原生支持M-JPEG。
>
> https://www.cnblogs.com/wzk1992/p/5961393.html

> 备选方案：
>
> ref：
>
> wfs.js相关：
>
> ​		 https://github.com/ChihChengYang/wfs.js
>
> ​		 https://segmentfault.com/a/1190000024534120
>
> ​		 https://blog.csdn.net/lanye233/article/details/102739842
>
> ​	 	https://www.cnblogs.com/programmer-wfq/p/7281894.html
>
> ​		 https://www.zhihu.com/question/27996269
>
> ​		 https://blog.csdn.net/u013379032/article/details/124570715
>
> ​		 https://blog.csdn.net/g0415shenw/article/details/80372580
>
> fluent-ffmeg相关：
>
> ​		 https://blog.csdn.net/qq_19788257/article/details/83011732（ffmpeg下载及环境配置）
>
> ​	 	https://blog.csdn.net/athrunsunny/article/details/122319491
>
> ​		 https://luneshao.github.io/2020/2020-04-07-fluent-ffmpeg-api/
>
> ​		 https://www.cnblogs.com/dch0/p/11149266.html
>
> ​		 https://www.cnblogs.com/wainiwann/p/4128154.html
>
> 配置好环境后，连接2个usb摄像头（HIKVISION DS-UVC-U64-Pro），cmd输入以下命令查看连接的摄像头：
>
> ```
> ffmpeg -list_devices true -f dshow -i dummy
> ```
>
> ![image-20231031101238487](C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20231031101238487.png)
>
> 其中Alternative name就是可使用音视频设备名
>



### 2.2 环境搭建

opencv4nodejs环境配置：

https://www.npmjs.com/package/opencv4nodejs?activeTab=readme#how-to-install

https://blog.csdn.net/Apple_Coco/article/details/109426608

windows-build-tools --vs2015

python:2.7.15

visual studio: 2015

opencv: 4.1.0

node版本：14.15.4，如有需要可使用nvm管理node版本	 原生节点模块是通过 node-gyp 构建的		

npm版本：6.14.10

git: version 2.42.0.windows.2

cmake: version 3.28.0-rc1

前五项最好按照我列出的版本，踩了无数坑查了无数资料帖子issue找到的解决办法。版本过高不是啥好事

#### 2.2.1 安装windows-build-tools

​		在 Windows 上，需要 Windows 构建工具来编译 OpenCV 和 opencv4nodejs。在此过程中会安装python2.7.15。

管理员模式cmd输入：

`C:\WINDOWS\system32>npm install --global --production windows-build-tools --vs2015`

```
C:\WINDOWS\system32>npm install --global --production windows-build-tools --vs2015
npm WARN config global `--global`, `--local` are deprecated. Use `--location=global` instead.
npm WARN deprecated windows-build-tools@5.2.2: Node.js now includes build tools for Windows. You probably no longer need this tool. See https://github.com/felixrieseberg/windows-build-tools for details.
npm WARN deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
npm WARN deprecated har-validator@5.1.5: this library is no longer supported
npm WARN deprecated uuid@3.4.0: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.

> windows-build-tools@5.2.2 postinstall D:\nodejs\node_modules\windows-build-tools
> node ./dist/index.js



Downloading python-2.7.15.amd64.msi
[============================================>] 100.0% of 20.2 MB (920 kB/s)
Downloaded python-2.7.15.amd64.msi. Saved to C:\Users\Lenovo\.windows-build-tools\python-2.7.15.amd64.msi.
Downloading BuildTools_Full.exe
[============================================>] 100.0% of 3.29 MB (2.63 MB/s)
Downloaded BuildTools_Full.exe. Saved to C:\Users\Lenovo\.windows-build-tools\BuildTools_Full.exe.

Starting installation...
Launched installers, now waiting for them to finish.
This will likely take some time - please be patient!

Status from the installers:
---------- Visual Studio Build Tools ----------
Still waiting for installer log file...
------------------- Python --------------------
Still waiting for installer log file...
```

这里就一直卡住了: https://blog.csdn.net/originalzzZ/article/details/119612887

解决方案：根据命令行提示的python和buildtools-full安装路径，手动安装。安装python很顺利，手动安装vs buildtools时安装失败，将exe文件替换为：https://download.microsoft.com/download/E/E/D/EEDF18A8-4AED-4CE0-BEBE-70A83094FC5A/BuildTools_Full.exe。重新手动安装

#### 2.2.2 手动安装opencv

下载地址：https://opencv.org/releases/page/4/    下载4.1.0版本

自行设置 OpenCV 需要设置一个环境变量来阻止自动构建脚本运行：

```
set OPENCV4NODEJS_DISABLE_AUTOBUILD=1
```

<img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20231101191215601.png" alt="image-20231101191215601" style="zoom:50%;" />

在使用自己的 OpenCV 安装 opencv4nodejs 之前，需要公开以下环境变量：

- *OPENCV_INCLUDE_DIR*指向包含头文件的子文件夹 *opencv2* 的目录
- *OPENCV_LIB_DIR*指向包含 OpenCV .lib 文件的 lib 目录

<img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20231107140307117.png" alt="image-20231107140307117" style="zoom:50%;" />

此外，还需要将 OpenCV 二进制文件添加到系统路径中：

- 添加一个环境变量*OPENCV_BIN_DIR*指向包含 OpenCV .dll文件的二进制目录
- 追加到系统路径变量`;%OPENCV_BIN_DIR%;`

<img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20231107140534156.png" alt="image-20231107140534156" style="zoom:50%;" /> <img src="C:\Users\Lenovo\AppData\Roaming\Typora\typora-user-images\image-20231101191551200.png" alt="image-20231101191551200" style="zoom:50%;" />

注意：在对环境进行更改后，需重新启动当前的控制台会话。

#### 2.2.3 安装opencv4nodejs

项目路径中，不能包含空格、中文等特殊字符，不然后面是编译不过的。但是 `_` 和 `-` 这两个字符可以包含。

```
npm install --save opencv4nodejs
```

下载前最好连接稳定的VPN。在网络没有问题的情况下，安装程序会按照 拉取github仓库 -> 设置编译配置项 -> 开始编译 -> 编译完成 -> 安装成功 这个步骤进行下去，下载时间比较久。

```
E:\5_ECNU_LAB\0_NetGroup\2_WebPC\1_MyProject\Chem\myapp>npm install --save opencv4nodejs

> opencv4nodejs@5.6.0 install E:\5_ECNU_LAB\0_NetGroup\2_WebPC\1_MyProject\Chem\myapp\node_modules\opencv4nodejs
> node ./install/install.js

info install using lib dir: D:/Opencv/opencv/build/x64/vc14/lib
info install found the following libs:
info install world : D:\Opencv\opencv\build\x64\vc14\lib\opencv_world410.lib

info install setting the following defines:
info defines OPENCV4NODEJS_FOUND_LIBRARY_WORLD

info install setting the following includes:
info includes D:/Opencv/opencv/build/include

info install setting the following libs:
info libs D:/Opencv/opencv/build/x64/vc14/lib/opencv_world410.lib
info install spawning node gyp process: node-gyp rebuild --jobs max

E:\5_ECNU_LAB\0_NetGroup\2_WebPC\1_MyProject\Chem\myapp\node_modules\opencv4nodejs>if not defined npm_config_node_gyp (node "D:\nvm\nvm\v14.15.4\node_modules\npm\node_modules\npm-lifecycle\node-gyp-bin\\..\..\node_modules\node-gyp\bin\node-gyp.js" rebuild --jobs max )  else (node "D:\nvm\nvm\v14.15.4\node_modules\npm\node_modules\node-gyp\bin\node-gyp.js" rebuild --jobs max )
  opencv4nodejs.cc
  CustomMatAllocator.cc
  ExternalMemTracking.cc
  core.cc
  coreConstants.cc
  HistAxes.cc
  Mat.cc
  Point.cc
  Vec.cc
  Size.cc
  Rect.cc
  RotatedRect.cc
  TermCriteria.cc
  imgproc.cc
  imgprocConstants.cc
  MatImgproc.cc
  Contour.cc
  Moments.cc
  calib3d.cc
  calib3dConstants.cc
  MatCalib3d.cc
  io.cc
  ioConstants.cc
  VideoCapture.cc
  VideoWriter.cc
  photo.cc
  photoConstants.cc
  MatPhoto.cc
  video.cc
  BackgroundSubtractor.cc
  BackgroundSubtractorMOG2.cc
  BackgroundSubtractorKNN.cc
  ximgproc.cc
  MatXimgproc.cc
  SuperpixelSEEDS.cc
  SuperpixelSLIC.cc
  SuperpixelLSC.cc
  objdetect.cc
  CascadeClassifier.cc
  HOGDescriptor.cc
  DetectionROI.cc
  machinelearning.cc
  machinelearningConstants.cc
  ParamGrid.cc
  StatModel.cc
  SVM.cc
  TrainData.cc
  dnn.cc
  Net.cc
  face.cc
  FaceRecognizer.cc
  EigenFaceRecognizer.cc
  FisherFaceRecognizer.cc
  LBPHFaceRecognizer.cc
  Facemark.cc
  FacemarkAAM.cc
  FacemarkAAMData.cc
  FacemarkAAMParams.cc
  FacemarkLBF.cc
  FacemarkLBFParams.cc
  text.cc
  OCRHMMClassifier.cc
  OCRHMMDecoder.cc
  tracking.cc
  Tracker.cc
  MultiTracker.cc
  TrackerBoosting.cc
  TrackerBoostingParams.cc
  TrackerKCF.cc
  TrackerKCFParams.cc
  TrackerMIL.cc
  TrackerMILParams.cc
  TrackerMedianFlow.cc
  TrackerTLD.cc
  TrackerGOTURN.cc
  TrackerCSRT.cc
  TrackerCSRTParams.cc
  TrackerMOSSE.cc
  features2d.cc
  KeyPoint.cc
  KeyPointMatch.cc
  DescriptorMatch.cc
  BFMatcher.cc
  FeatureDetector.cc
  descriptorMatching.cc
  descriptorMatchingKnn.cc
  AGASTDetector.cc
  AKAZEDetector.cc
  BRISKDetector.cc
  FASTDetector.cc
  GFTTDetector.cc
  KAZEDetector.cc
  MSERDetector.cc
  ORBDetector.cc
  SimpleBlobDetector.cc
  SimpleBlobDetectorParams.cc
  xfeatures2d.cc
  SIFTDetector.cc
  SURFDetector.cc
  win_delay_load_hook.cc
    ���ڴ����� E:\5_ECNU_LAB\0_NetGroup\2_WebPC\1_MyProject\Chem\myapp\node_modules\opencv4nodejs\build\Release\opencv4nodejs.lib �Ͷ��� E:\5_ECNU_LAB\0_NetGroup\2_WebPC\1_MyProject\Chem\myapp\node_modules\opencv4nodejs\build\Release\opencv4nodejs.exp
  opencv4nodejs.vcxproj -> E:\5_ECNU_LAB\0_NetGroup\2_WebPC\1_MyProject\Chem\myapp\node_modules\opencv4nodejs\build\Release\\opencv4nodejs.node
  opencv4nodejs.vcxproj -> E:\5_ECNU_LAB\0_NetGroup\2_WebPC\1_MyProject\Chem\myapp\node_modules\opencv4nodejs\build\Release\opencv4nodejs.pdb (Full PDB)
+ opencv4nodejs@5.6.0
updated 1 package and audited 297 packages in 127.16s

18 packages are looking for funding
  run `npm fund` for details

found 9 vulnerabilities (2 low, 1 moderate, 3 high, 3 critical)
  run `npm audit fix` to fix them, or `npm audit` for details
```



## 三. processing page拓扑表示

![image-20231121184315769](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20231121184315769.png)

![image-20231121184511607](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20231121184511607.png)



## 四. matlab获取压力传感器并与后端建立websocket通信

### 4.1 环境搭建

#### 4.1.1 MatlabWebsocket

matlab运行websocket 库：

[GitHub - jebej/MatlabWebSocket: A simple event-based WebSocket library for MATLAB.](https://github.com/jebej/MatlabWebSocket)

matlab java环境配置：

[Java 类路径的静态路径 - MATLAB 和 Simulink - MathWorks 中国](https://ww2.mathworks.cn/help/matlab/matlab_external/static-path-of-java-class-path.html?searchHighlight=static java class path&s_tid=srchtitle_support_results_1_static java class path)

1. 将MatlabWebsocket库保存到固定位置.

   例如我保存到：`D:\software\Matlab\MatlabWebSocket`

   <img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20231129200342902.png" alt="image-20231129200342902" style="zoom:67%;" />

   

2. 新建`javaclasspath.txt`,里面写入MatlabWebsocket库中`.jar`文件（java library）的位置。

   ```
   D:\software\Matlab\MatlabWebSocket\jar\matlab-websocket-1.6.jar
   ```

3. matlab命令行输入`prefdir`,查看MATLAB 启动文件夹。

   <img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20231129200739931.png" alt="image-20231129200739931" style="zoom:67%;" />

   将`javaclasspath.txt`保存至返回的路径文件夹下。

4. 重新启动MATLAB，并通过在matlab命令行运行`javaclasspath`命令检查MATLAB是否正确读取了该行(应该在STATIC JAVA PATH的最后一行）。

![image-20231129200944861](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20231129200944861.png)

> Note that seeing the entry here does not mean that MATLAB necessarily found the jar file properly. You must make sure that the actual `jar` file is indeed at this location.

至此，MatlabWebsocket库的java环境就配置完了。具体详细操作参照我给的GitHub和matlab链接。

#### 4.1.2 安装Fluigent SDK Matlab Toolbox

进入官方`压力传感器`文件夹,打开路径`\压力传感器\法国Fluigent SDK开发包934\fgt-SDK-master\MATLAB\Toolbox`

![image-20231129204434219](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20231129204434219.png)

双击mtlbx文件，打开方式选择matlab，开始安装厂家提供的matlab toolbox。安装完成后点击`主页-附加功能-管理附加功能`查看是否有Fluigent SDK。若有，则安装成功。

![image-20231129204640029](C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20231129204640029.png)



### 4.2 传感器关键信息

<img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20231129202733546.png" alt="image-20231129202733546" style="zoom:80%;" />

<img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20231129202751063.png" alt="image-20231129202751063" style="zoom:80%;" />

<img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20231129122417774.png" alt="image-20231129122417774" style="zoom:80%;" />

<img src="C:\Users\Administrator\AppData\Roaming\Typora\typora-user-images\image-20231129130225202.png" alt="image-20231129130225202" style="zoom:80%;" />

### 4.2 运行

​		首先运行vscode的工程，接着运行`PressureSensor_Matlab`文件夹下的`PressureSenor.m`。

​		 经电脑重启与USB插拔测试，调试代码我发现只要两个USB压力传感器同时插在电脑上运行脚本sensorInfoArray 里面第一个设备一定是 SN=10774（硬件上有标注） indexID=1.3863e+09；第二个设备一定是SN = 10792（硬件上有标注） indexID=1.3864e+09。因此不存在电脑重启或者USB重新插拔后代码失效的问题。（不像那个脑瘫摄像头...）



## 五. 结构体设计
