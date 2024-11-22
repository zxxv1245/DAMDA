<img src="https://capsule-render.vercel.app/api?type=waving&color=BDBDC8&height=150&section=header" width="100%" >


<div align="center">


# 프로젝트에 대한 정보
***

  ### 1. 프로젝트 제목

  스마트 쇼핑카트 “**담다**”

  ### 2. 로고 및 이미지 

  ![image (22).png](Picture/logo.png)


  ### 3. 프로젝트 정보 🗂

  딥러닝 객체 탐지 기술과 실내 측위 기술을 사용한 스마트 쇼핑카트

  `SSAFY 11th AIoT PJT`

  `개발기간: 24.07.08 ~ 24.08.16 (6주)`

  ### 4. 배포 주소 🌐

  개발버전 : 1. 0. 0

  백엔드 서버: https://i11c103.p.ssafy.io/

</div>
<div>



## 프로젝트 소개 🛒

  대형 마트 쇼핑 시 계산을 하기 위해 상품을 꺼내고 담는 **현재 쇼핑 프로세스의 불편함과 고객이 중간 상품 총액을 정확하게 알지 못하는 불편함을 해소하기 위한 스마트 쇼핑카트** 프로젝트

  ---

  이 프로젝트는 YOLO 객체 인식 기술을 활용하여 **상품을 쇼핑카트가 자동으로 인식**하고 쇼핑카트Qt 를 활용하여 **중간 총액을 고객에게 제공**한다.<br>
  UWB 모듈의 활용으로 사용자가 가지고 있는 태그를 따라가는 **트래킹 기능**을 제공한다.<br>
  쇼핑카트에 표시되는 QR코드 스캔으로 **간편 결제 기능**을 제공한다.<br>
  이후 **담다 앱을 통해 주변 마트 찾기, 가계부 기능, 성인 인증 등을 제공**한다.<br>

</div>



## 주요기능 🔍

<div align="center">

  <h3>📌 쇼핑카트에서 QR 스캔으로 간편 결제 기능</h3>
  <ul style="text-align: center;">
    <li>지금까지의 상품 리스트 정보를 담은 QR 코드 생성 (QT)</li>
    <li>사용자 App QR 코드 스캔 기능 구현</li>
    <li>사용자 App에서 구매 목록 리스트 저장</li>
    <li>자체 DB를 통해 인터넷이 불안정한 상황에서도 상품 인식 및 장바구니 정보 제공 가능</li>
  </ul>

  <h3>📌 쇼핑카트에 부착된 모니터로 편의성 증가</h3>
  <ul style="text-align: center;">
    <li>상품 검색 기능을 통한 손쉬운 상품 찾기</li>
    <li>장바구니 화면을 통해 중간 총 상품 금액 파악 가능</li>
  </ul>

  <h3>📌 사용자 트래킹하는 쇼핑카트</h3>
  <ul style="text-align: center;">
    <li>실내 측위 기술을 통해 사용자 위치 추적 및 트래킹 (UWB)</li>
    <li>장애물 또는 사용자가 접근 시 쇼핑카트 정지</li>
  </ul>

  <h3>📌 담다 앱</h3>
  <ul style="text-align: center;">
    <li>근처 마트 찾기</li>
    <li>쇼핑카트의 상품정보가 담긴 QR코드를 인식하고 결제 기능</li>
    <li>결제 내역 및 가계부 기능</li>
  </ul>

</div>



## 기술 스택 📖
<div align="center">

  ### Frontend

  ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
  ![React Native](https://img.shields.io/badge/react_native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![Qt](https://img.shields.io/badge/Qt-%23217346.svg?style=for-the-badge&logo=Qt&logoColor=white)

  ### Infrastructure

  ![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
  ![Jenkins](https://img.shields.io/badge/jenkins-%232C5263.svg?style=for-the-badge&logo=jenkins&logoColor=white)
  ![AWS](https://img.shields.io/badge/AWS-%23FF9900.svg?style=for-the-badge&logo=amazon-aws&logoColor=white)
  ![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

  ### AI

  ![PyTorch](https://img.shields.io/badge/PyTorch-%23EE4C2C.svg?style=for-the-badge&logo=PyTorch&logoColor=white)
  <img src="Picture/yolo.png" alt="YoloV7" width="75" height="25">

  ### Backend

  ![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
  ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
  <img src ="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=Spring-Security&logoColor=white">
  <img src="https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">

  ### DB

  ![Redis](https://img.shields.io/badge/redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)
  ![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)
  ![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)

  ### Embedded

  ![Linux](https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=black)
  ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
  ![C++](https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white)
  <img src="https://img.shields.io/badge/Jetson Nano-83B81A?style=flat&logo=NVIDIA&logoColor=white"/>
  <img src="https://img.shields.io/badge/Raspberry Pi-A22846?style=flat&logo=Raspberry Pi&logoColor=white"/>
  <img src="https://img.shields.io/badge/Arduino-00979D?style=flat&logo=Arduino&logoColor=white"/>  
</div>



## 아키텍쳐 📑

<div align="center">
  
  ![architecture.JPG](Picture/architecture.JPG)
</div>



## ERD 

<div align="center">
  
  ![erd.png](Picture/erd.png)
</div>

<div>



## 쇼핑카트

 ![shopping_cart1.JPG](Picture/shopping_cart1.jpg)
 
 ![shopping_cart2.JPG](Picture/shopping_cart2.jpg)



## 사용자 App 및 Qt 이미지
<div align="center">

### 사용자 App 📱

  ### 앱의 메인화면
  <img src="Picture/logo.jpg" alt="Logo" width="200px"/>

  <img src="Picture/sign_up.jpg" alt="sing_up" width="200px"/>

  <img src="Picture/sign_up1.jpg" alt="sign_up1" width="200px"/>

  <img src="Picture/homepage.jpg" alt="homepage" width="200px"/>

  <img src="Picture/homepage2.jpg" alt="homepage2" width="200px"/>

  ### 결제 화면
  <img src="Picture/pay.jpg" alt="pay" width="200px"/>

  <img src="Picture/qr.jpg" alt="qr" width="200px"/>

  <img src="Picture/pay_button.jpg" alt="pay_button" width="200px"/>

  ### 앱의 가계부 기능
  <img src="Picture/planner.jpg" alt="planner" width="200px"/>

  ### 주변마트찾기 기능
  <img src="Picture/find_mart.jpg" alt="find_mart" width="200px"/>

  ### 기타 기능
  <img src="Picture/change_password.jpg" alt="change_password" width="200px"/>

  <img src="Picture/change_mypage.jpg" alt="change_mypage" width="200px"/>

  <img src="Picture/naver_login.jpg" alt="naver_login" width="200px"/>

  <img src="Picture/login.jpg" alt="login" width="200px"/>

  <img src="Picture/login2.jpg" alt="login2" width="200px"/>

  <img src="Picture/adult.jpg" alt="adult" width="200px"/>

  ### 사용자 Qt 화면

  ![1.PNG](Picture/qt1.PNG)

  ![2 (1).PNG](Picture/qt2.PNG)

  ![find_snack.PNG](Picture/find_snack.png)

  ![find_pos.PNG](Picture/find_pos.PNG)

  ![4 (1).PNG](Picture/qt4.PNG)

  ![5 (1).PNG](Picture/qt5.PNG)

  ![6 (1).PNG](Picture/qt6.PNG)

  ![7 (1).PNG](Picture/qt7.PNG)

  ### 기존 쇼핑과 담다의 쇼핑의 차별점 👍

  | 비고 | 기존의 쇼핑 | 담다의 쇼핑 |
  |---|:---:|:---:|
  |상품 탐색|직접 탐색 또는 직원에게 문의|`쇼핑카트에서 위치 검색`|
  |이동 방식|사용자가 쇼핑카트를 끌고 다님|`쇼핑카트가 사용자를 따라다님`|
  |중간 정산|사용자가 직접 계산|`쇼핑카트가 현재까지 총액을 LCD에 표시`|
  |결제 방법|계산대에서 결제|`쇼핑카트에서 즉시 결제 가능`|
  |결제 이후|영수증 수령 후 사용자가 가계부 작성|`담다 앱에서 자동으로 가계부 기능 제공`|

</div>

  위 표를 통해 담다는 기존의 쇼핑 시스템과 비교하여 다음 다섯가지의 불편함을 해소할 수 있다.

  1. 쇼핑카트를 끌고 다니는 불편함 해소     
    - 쇼핑카트가 사용자를 자동으로 따라다니므로 직접 끌 필요가 없음.     

  2. 상품 탐색의 편리함     
    - 쇼핑카트의 위치 검색 기능을 통해 즉시 상품을 탐색할 수 있음.     

  3. 실시간 금액 확인      
    - 쇼핑 중에 쇼핑카트의 LCD 화면을 통해 현재까지 담긴 금액을 즉시 확인 가능.  

  4. 계산대 대기 시간 감소      
    - 계산대에서 기다리거나 상품을 다시 꺼내지 않아도 되어 쇼핑이 더욱 편리해짐.      

  5. 결제 내역 관리 및 가계부 정리 용이     
    - 결제 후에도 담다 앱을 통해 결제 내역을 관리하고 자동으로 가계부를 정리할 수 있음.     



## 시연 영상

<div align="center">

### 사용자 트래킹
[![User Tracking](http://img.youtube.com/vi/Y9gdJKtYebw/0.jpg)](https://youtu.be/Y9gdJKtYebw)
</div>

<div align="center">

### 사용자 트래킹 및 장애물 탐지
[![User Tracking and Detect Obstacle](http://img.youtube.com/vi/tbFH3UCyoNc/0.jpg)](https://youtu.be/tbFH3UCyoNc)
</div>

<div align="center">

### 상품 바코드 인식
[![Barcode Detect Product](http://img.youtube.com/vi/a96pfDbsXpI/0.jpg)](https://youtu.be/a96pfDbsXpI)
</div>

<div align="center">

### AI 상품 인식
[![AI Detect Product](http://img.youtube.com/vi/chF4CFTtKdY/0.jpg)](https://youtu.be/chF4CFTtKdY)
</div>

<div align="center">

### 담다 앱 시연 영상
[![Damda App](http://img.youtube.com/vi/zpk5nVSYzbk/0.jpg)](https://youtu.be/DVBAKg1N4L8)

</div>



## 팀 소개 👨‍👨‍👦 
  
<div align="center">

<table>
  <tbody>
    <tr>
      <td align="center">
        <img src="Picture/tg.jpeg" alt="EM 팀장 : 이택규" width="100px"/>
        <br />
        <sub><b>EM 팀장 : 이택규</b></sub>
      </td>
      <td align="center">
        <img src="Picture/woong.jpg" alt="EM 부팀장 : 윤의웅" width="100px"/>
        <br />
        <sub><b>EM 부팀장 : 윤의웅</b></sub>
      </td>
      <td align="center">
        <img src="Picture/jong.jpg" alt="EM 팀원 : 이종하" width="100px"/>
        <br />
        <sub><b>EM 팀원 : 이종하</b></sub>
      </td>
    </tr>
    <tr>
      <td>
        <ul>
          <li><strong>SSAFY 11th Embedded</strong></li>
          <li>PM & 3D Modeling</li>
          <li>UWB 사용자 트래킹 기능 구현</li>
        </ul>
      </td>
      <td>
        <ul>
          <li><strong>SSAFY 11th Embedded</strong></li>
          <li>YOLO 사물인식 기능 구현</li>
          <li>IPC 구현</li>
        </ul>
      </td>
      <td>
        <ul>
          <li><strong>SSAFY 11th Embedded</strong></li>
          <li>UWB 사용자 트래킹 기능 구현</li>
          <li>센서 및 모터 총괄 제어</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td align="center">
        <img src="Picture/hm.jpg" alt="EM 팀원 : 주현민" width="100px"/>
        <br />
        <sub><b>EM 팀원 : 주현민</b></sub>
      </td>
      <td align="center">
        <img src="Picture/ys.jpg" alt="BE 팀원 : 천요성" width="100px"/>
        <br />
        <sub><b>BE 팀원 : 천요성</b></sub>
      </td>
      <td align="center">
        <img src="Picture/ju.JPG" alt="FE 팀원 : 이주호" width="100px"/>
        <br />
        <sub><b>FE 팀원 : 이주호</b></sub>
      </td>
    </tr>
    <tr>
      <td>
        <ul>
          <li><strong>SSAFY 11th Embedded</strong></li>
          <li>장애물 인지 기능 구현</li>
          <li>사용자 Qt 제작</li>
        </ul>
      </td>
      <td>
        <ul>
          <li><strong>SSAFY 11th Python</strong></li>
          <li>API 서버 개발 및 관리</li>
          <li>인프라 구축 담당</li>
        </ul>
      </td>
      <td>
        <ul>
          <li><strong>SSAFY 11th Python</strong></li>
          <li>사용자 App 제작</li>
          <li>Qt 보조</li>
        </ul>
      </td>
    </tr>
  </tbody>
</table>

</div>
