# JetPack, OpenCV with Cuda, Pytorch 설치 및 openCV cuda 가속화 설정

### JetPack 설치
Jetson nano 에 맞는 SD Card image 다운
https://developer.nvidia.com/embedded/jetpack

balenaEtcher 를 이용해 OS 설치용으로 변경
https://etcher.balena.io/

### Jetson Orin Nano Pytorch 설치
OS 를 설정하면서 JetPack, cuda, cuDNN, python 등이 자동으로 설치됨
```bash
# PyTorch 1.8.0 다운로드 및 dependencies 설치
wget https://nvidia.box.com/shared/static/p57jwntv436lfrd78inwl7iml6p13fzh.whl -O torch-1.8.0-cp36-cp36m-linux_aarch64.whl
sudo apt-get install python3-pip libopenblas-base libopenmpi-dev 
 
# Cython, numpy, pytorch 설치
pip3 install Cython
pip3 install numpy torch-1.8.0-cp36-cp36m-linux_aarch64.whl
 
# torchvision dependencies 설치
sudo apt-get install libjpeg-dev zlib1g-dev libpython3-dev libavcodec-dev libavformat-dev libswscale-dev
git clone --branch v0.9.0 https://github.com/pytorch/vision torchvision
cd torchvision
export BUILD_VERSION=0.9.0
python3 setup.py install --user
cd ../  # attempting to load torchvision from build dir will result in import error

# pytorch 버전 에러가 뜰 경우
# https://pytorch.org/  로 가서 원하는 Cuda 버전을 설정하여 pip로 다운 가능
# pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
# python 버전 호환 문제로 설치를 못 하는 경우
# python3.9 -m pip install 패키지
# 로 다운 가능

# 토치 버전이 호환이 안 돼서 2.2 버전으로 다운 받아줌
# pip install torch==2.2.0 torchvision==0.17.0 torchaudio==2.2.0
```

### Jetson Orin Nano swap 공간 설정
Jetson 의 메모리가 크지 않기 때문에 swap 공간을 설정해주어야함.
```bash
# 이미 했다면 안해도 됨
sudo apt-get update
sudo apt-get upgrade

sudo apt-get install nano
sudo apt-get install dphys-swapfile
 
# /sbin/dphys-swapfile 파일 open
sudo nano /sbin/dphys-swapfile

## Swap파일의 값이 다음과 같도록 값을 추가하거나, 파일 내 주석을 해제
# CONF_SWAPSIZE=4096
# CONF_SWAPFACTOR=2
# CONF_MAXSWAP=4096
 
# 값을 수정 후 [Ctrl] + [X], [y], [Enter]를 눌러 저장하고 닫으면 됨.
 
# /etc/dphys-swapfile 파일 open
sudo nano /etc/dphys-swapfile

## Swap파일의 값이 다음과 같도록 값을 추가하거나, 파일 내 주석을 해제
# CONF_SWAPSIZE=4096
# CONF_SWAPFACTOR=2
# CONF_MAXSWAP=4096
 
# 값을 수정 후 [Ctrl] + [X], [y], [Enter]를 눌러 저장하고 닫으면 됨.
 
# 재부팅
sudo reboot
```

### 기존에 설치되어 있는 CUDA 버전 확인 후 삭제
```bash
# 기존 cuda 버전 확인
pkg-config --modversion opencv

# 기존에 설치 된 cuda가 있다면 버전이 뜰 것.
# 설치 된 cuda가 없다면 'No package 'opencv' found' 출력 됨.

# 기존에 설치 된 cuda 버전 및 의존 패키지 삭제
sudo apt-get remove libopencv*
sudo apt-get autoremove
sudo find /usr/local -name "*opencv*" -exec rm {} \;
```

### 추가로 필요한 패키지 설치
```bash
sudo apt-get update
# sudo apt-get upgrade -> 이건 자주 안하는 걸 권장한다 함..
sudo apt-get install -y build-essential cmake git unzip pkg-config
sudo apt-get install -y libjpeg-dev libpng-dev libtiff-dev
sudo apt-get install -y libavcodec-dev libavformat-dev libswscale-dev
sudo apt-get install -y libgtk2.0-dev libcanberra-gtk*
sudo apt-get install -y python3-dev python3-numpy python3-pip
sudo apt-get install -y python3-dev python3-numpy libtbb2 libtbb-dev
sudo apt-get install -y libxvidcore-dev libx264-dev libgtk-3-dev
sudo apt-get install -y libtbb2 libtbb-dev libdc1394-22-dev
sudo apt-get install -y libv4l-dev v4l-utils
sudo apt-get install -y libgstreamer1.0-dev libgstreamer-plugins-base1.0-dev
sudo apt-get install -y libavresample-dev libvorbis-dev libxine2-dev
sudo apt-get install -y libfaac-dev libmp3lame-dev libtheora-dev
sudo apt-get install -y libopencore-amrnb-dev libopencore-amrwb-dev
sudo apt-get install -y libopenblas-dev libatlas-base-dev libblas-dev
sudo apt-get install -y liblapack-dev libeigen3-dev gfortran
sudo apt-get install -y libhdf5-dev protobuf-compiler
sudo apt-get install -y libprotobuf-dev libgoogle-glog-dev libgflags-dev
```

### opencv zip file 다운 및 압축 해제
검색하면 나오는 대부분의 방법들은 .sh 파일을 다운 받아서 실행시키면 cmake 관련 에러가 발생했음.
```bash
wget -O opencv.zip https://github.com/opencv/opencv/archive/4.5.0.zip
wget -O opencv_contrib.zip https://github.com/opencv/opencv_contrib/archive/4.5.0.zip

unzip opencv.zip
unzip opencv_contrib.zip
```

### build 폴더 생성
```bash
# 압축 해제 후 생성 된 opencv-4.5.0 폴더 안으로 이동
cd opencv-4.5.0

# build 폴더 생성 후 이동
mkdir build
cd build
```

### cmake로 빌드하기
```bash
cmake \
-D CMAKE_BUILD_TYPE=RELEASE \
-D CMAKE_INSTALL_PREFIX=/usr/local \
-D OPENCV_EXTRA_MODULES_PATH=~/opencv_contrib/modules \
-D EIGEN_INCLUDE_PATH=/usr/include/eigen3 \
-D WITH_OPENCLAMDBLAS=OFF \
-D WITH_GTK=OFF \
-D WITH_OPENCL=OFF \
-D WITH_CUDA=ON \
-D CUDA_FAST_MATH=ON \
-D OPENCV_DNN_CUDA=ON \
-D CUDA_ARCH_PTX="" \
-D WITH_CUDNN=ON \
-D WITH_CUBLAS=ON \
-D ENABLE_FAST_MATH=ON \
-D ENABLE_NEON=ON \
-D WITH_QT=OFF \
-D WITH_OPENMP=ON \
-D WITH_OPENGL=ON \
-D BUILD_JASPER=ON \
-D BUILD_TIFF=ON \
-D WITH_FFMPEG=ON \
-D WITH_GSTREAMER=ON \
-D WITH_TBB=ON \
-D BUILD_TBB=ON \
-D WITH_EIGEN=ON \
-D WITH_V4L=ON \
-D WITH_LIBV4L=ON \
-D WITH_VTK=ON \
-D OPENCV_ENABLE_NONFREE=ON \
-D INSTALL_PYTHON_EXAMPLES=OFF \
-D BUILD_NEW_PYTHON_SUPPORT=ON \
-D OPENCV_GENERATE_PKGCONFIG=ON \
-D BUILD_OPENCV_WORLD=ON \
-D BUILD_PERF_TESTS=OFF \
-D BUILD_TESTS=OFF \
-D BUILD_OPENCV_PYTHON_TESTS=OFF \
-D INSTALL_TESTS=OFF \
-D INSTALL_C_EXAMPLES=OFF \
-D BUILD_EXAMPLES=OFF ..
```

### build
```bash
# 현재 시스템 코어 수 확인
nproc

# 코어 수를 -j 뒤에 적으면 됨!
make -j4  # 이 과정이 2시간 정도 소요 됨. 

sudo rm -rf /usr/include/opencv4/opencv2

sudo make install
```
→ 굉장히 오랜 시간 소요 되었다. 거의 2시간 정도? 근데 중간에 에러나면 그 시간이 너무 아깝고 날려버리는 거니 꼭.. cmake 명령어 부분에서 더블 체크를 해야 한다.

→ 설치 후 /etc/ld.so.conf.d/ 파일에 저장된 내용 출력해서 /usr/local/lib 포함하는 파일이 있는지 확인을 해야 함
```bash
cat /etc/ld.so.conf.d/*

# 만약 '/usr/local/lib'이 출력되지 않았다면 아래 명령어 실행
sudo sh -c 'echo '/usr/local/lib' > /etc/ld.so.conf.d/opencv.conf'
#공유 라이브러리 정보를 갱신
$ sudo idconfig
```

참고 자료 : https://iambeginnerdeveloper.tistory.com/216