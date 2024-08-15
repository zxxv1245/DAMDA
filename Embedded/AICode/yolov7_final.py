import argparse
import time
from pathlib import Path
import Jetson.GPIO as GPIO
import sqlite3
import re
import usb.core
import usb.util
import threading
import queue

import sys
from PyQt5.QtWidgets import QApplication, QMainWindow, QDialog, QLabel, QVBoxLayout, QPushButton
from PyQt5.QtGui import QPixmap, QFont, QImage
from PyQt5.QtCore import QTimer, QDateTime, Qt
from mainUI_1 import Ui_MainWindow  # mainUI 파일에서 Ui_MainWindow 클래스 임포트
from subUI import Ui_SecondWindow  # subUI 파일에서 Ui_SecondWindow 클래스 임포트
from thirdUI import Ui_ThirdWindow  # thirdUI 파일에서 Ui_ThirdWindow 클래스 임포트
from fourthUI import Ui_FourthWindow  # fourthUI 파일에서 Ui_FourthWindow 클래스 임포트
from dialogUI import Ui_Dialog
from fifthUI_1 import Ui_FifthWindow
from PyQt5.QtCore import QTimer, QDateTime, Qt, QRect

import os
import qrcode
import io

import cv2
import torch
import torch.backends.cudnn as cudnn
from numpy import random

import usb.core
import usb.util
import time

from models.experimental import attempt_load
from utils.datasets import LoadStreams, LoadImages
from utils.general import check_img_size, check_requirements, check_imshow, non_max_suppression, apply_classifier, \
    scale_coords, xyxy2xywh, strip_optimizer, set_logging, increment_path
from utils.plots import plot_one_box
from utils.torch_utils import select_device, load_classifier, time_synchronized, TracedModel
import requests

TRIG_PIN = 16  # physical pin 16
ECHO_PIN = 18  # physical pin 18

# 바코드 변수
# 바코드에서 읽을때마다 갱신 후 초기화
barcodeNum = None

# 전역선언 이벤트
barcode_queue = queue.Queue()
event = threading.Event()

n = None

#옵션 넣기
def get_opt():
    parser = argparse.ArgumentParser()
    parser.add_argument('--weights', nargs='+', type=str, default='best.pt', help='model.pt path(s)')
    parser.add_argument('--source', type=str, default='0', help='source')  # file/folder, 0 for webcam
    parser.add_argument('--img-size', type=int, default=640, help='inference size (pixels)')
    parser.add_argument('--conf-thres', type=float, default=0.8, help='object confidence threshold')
    parser.add_argument('--iou-thres', type=float, default=0.8, help='IOU threshold for NMS')
    parser.add_argument('--device', default='0', help='cuda device, i.e. 0 or 0,1,2 ,3 or cpu')
    parser.add_argument('--view-img', action='store_true', help='display results')
    parser.add_argument('--save-txt', action='store_true', help='save results to *.txt')
    parser.add_argument('--save-conf', action='store_true', help='save confidences in --save-txt labels')
    parser.add_argument('--nosave', action='store_true', help='do not save images/videos')
    parser.add_argument('--classes', nargs='+', type=int, help='filter by class: --class 0, or --class 0 2 3')
    parser.add_argument('--agnostic-nms', action='store_true', help='class-agnostic NMS')
    parser.add_argument('--augment', action='store_true', help='augmented inference')
    parser.add_argument('--update', action='store_true', help='update all models')
    parser.add_argument('--project', default='runs/detect', help='save results to project/name')
    parser.add_argument('--name', default='exp', help='save results to project/name')
    parser.add_argument('--exist-ok', action='store_true', help='existing project/name ok, do not increment')
    parser.add_argument('--no-trace', action='store_true', help='don`t trace model')
    parser.add_argument('--distance-threshold', type=float, default=10.0, help='distance threshold for triggering detection')
    parser.add_argument('--duration', type=float, default=20, help='duration for processing (in seconds)')
    opt = parser.parse_args()
    return opt
# db값 변경(discount 테이블)
def change_db():
    response = requests.get("https://i11c103.p.ssafy.io/api/v1/getDiscount")
    data = response.json()
    conn = sqlite3.connect('/home/coach-jetson/yolo/shopping.db')
    cursor = conn.cursor()

    # discount 테이블 생성 (이미 존재하면 무시)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS discounts (
        discountId INTEGER PRIMARY KEY,
        discountType TEXT
    )
    ''')

    # 기존 데이터 삭제
    cursor.execute('DELETE FROM discounts')

    # 새로운 데이터 삽입
    for item in data['data']:
        cursor.execute('''
        INSERT INTO discounts (discountId, discountType)
        VALUES (?, ?)
        ''', (item['discountId'], item['discountType']))

    # 변경사항 저장 및 DB 연결 종료
    # 데이터 삽입 후 데이터 확인
    cursor.execute('SELECT * FROM discounts')
    rows = cursor.fetchall()
    print("discounts 테이블 데이터:")
    for row in rows:
        print(row)
    conn.commit()
    conn.close()

    print("데이터베이스에 데이터가 성공적으로 저장되었습니다.")
# db값 업데이트(본 테이블)
def update_products():
    # API request to get the product data
    response = requests.get("https://i11c103.p.ssafy.io/api/v1/getProduct")
    data = response.json()
    
    # Connect to the SQLite database
    conn = sqlite3.connect('/home/coach-jetson/yolo/shopping.db')
    cursor = conn.cursor()

    # Create the products table if it doesn't exist
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        serialNumber VARCHAR(255),
        productName VARCHAR(255),
        productPrice FLOAT,
        productLocation VARCHAR(255),
        productAdult BOOLEAN,
        productDescription TEXT,
        productImage VARCHAR(255),
        detectName VARCHAR(255),
        productBarcode INTEGER
    )
    ''')

    # Delete existing data in the products table
    cursor.execute('DELETE FROM products')

    # Insert new data into the products table
    for item in data['data']:
        cursor.execute('''
        INSERT INTO products (id, serialNumber, productName, productPrice, productLocation, productAdult, productDescription, productImage, detectName, productBarcode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            item['id'], item['serialNumber'], item['productName'], item['productPrice'], 
            item['productLocation'], item['productAdult'], item['productDescription'], 
            item['productImage'], item.get('detectName'), item['productBarcode']
        ))

    # Commit the changes and close the connection
    conn.commit()
    
    # Fetch and print the inserted data to verify
    cursor.execute('SELECT * FROM products')
    rows = cursor.fetchall()
    print("products table data:")
    for row in rows:
        print(row)
    
    conn.close()

    print("Data successfully updated in the database.")
# gpio 셋업
def setup_gpio():
    GPIO.setmode(GPIO.BOARD)  # Use physical pin numbering
    GPIO.setup(TRIG_PIN, GPIO.OUT)
    GPIO.setup(ECHO_PIN, GPIO.IN)
    GPIO.output(TRIG_PIN, GPIO.LOW)
    print("Waiting for sensor to settle")
    time.sleep(2)
# 거리 받아오기
def get_distance():
    # Send 10us pulse to trigger pin
    GPIO.output(TRIG_PIN, GPIO.HIGH)
    time.sleep(0.00001)
    GPIO.output(TRIG_PIN, GPIO.LOW)

    # Measure the time between sending and receiving the pulse
    pulse_start = time.time()
    timeout = pulse_start + 0.04  # 40ms timeout for pulse reception

    while GPIO.input(ECHO_PIN) == 0:
        pulse_start = time.time()
        if pulse_start > timeout:
            return -1  # Timeout, return -1 to indicate failure

    pulse_end = time.time()
    while GPIO.input(ECHO_PIN) == 1:
        pulse_end = time.time()
        if pulse_end > timeout:
            return -1  # Timeout, return -1 to indicate failure

    pulse_duration = pulse_end - pulse_start
    distance = pulse_duration * 17150  # Speed of sound is 34300 cm/s, and we divide by 2 for round trip
    distance = round(distance, 2)
    return distance
# gpio 세팅 클린 깨끗하게 클린업~
def cleanup_gpio():
    GPIO.cleanup()
#sqlite랑 연결
def start_sqlite():
    conn = None
    conn = sqlite3.connect('/home/coach-jetson/yolo/shopping.db')
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM products')
    rows = cursor.fetchall()
    for row in rows:
        print(row)
    conn.close()

    return rows
# label 값 받아서 db에서 데이터 불러오기
def find_info(label):
    if label == None:
        print ("label이 None 값입니다")
        discount_ret = None
        if label == None :
            row = [0]
        if discount_ret == None :
                discount_ret = [0]
        return [row, discount_ret]
    else:

        if isinstance(label, (int, float)):
            conn = None
            conn = sqlite3.connect('/home/coach-jetson/yolo/shopping.db')
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM products WHERE productBarcode = ?',(label,))
            row = cursor.fetchone()
            if row == None :
                print("등록된 상품이 아닙니다")
            cursor.execute('SELECT discountType FROM discounts WHERE discountId = ?', (row[0],))
            discount_ret = cursor.fetchone()
            if discount_ret == None :
                    discount_ret = [0]
            # 결과 출력
            if row:
                    print(row)
            else : print("일치 결과가 없습니다")

            # 연결 종료
            conn.close()

            return [row, discount_ret]

        else :
            conn = None
            cleaned_label = re.sub(r'\d+\.\d+|\s+', '', label)
            # 데이터베이스 파일에 연결
            conn = sqlite3.connect('/home/coach-jetson/yolo/shopping.db')
            cursor = conn.cursor()
            # 특정 조건에 맞는 단일 행 조회

            query = 'SELECT * FROM products WHERE detectName = ?'

            print(f"Executing query: {query} with label: {cleaned_label}")

            cursor.execute(query, (cleaned_label,))
            # 결과 가져오기 
            row = cursor.fetchone()
            if row == None:
                print("등록된 상품이 아닙니다")
            
            cursor.execute('SELECT discountType FROM discounts WHERE discountId = ?', (row[0],))
            discount_ret = cursor.fetchone()

            # 결과 출력
            if row:
                    print(row)
            else : print("일치 결과가 없습니다")

            # 연결 종료
            conn.close()

            return [row, discount_ret]
# yolo 시작을 위한 기본 세팅
def detect(opt):
    source, weights, view_img, save_txt, imgsz, trace = opt.source, opt.weights, opt.view_img, opt.save_txt, opt.img_size, not opt.no_trace
    save_img = not opt.nosave and not source.endswith('.txt')  # save inference images
    webcam = source.isnumeric() or source.endswith('.txt') or source.lower().startswith(
        ('rtsp://', 'rtmp://', 'http://', 'https://'))

    # 시작
    set_logging()
    device = select_device(opt.device)
    half = device.type != 'cpu'  # half precision only supported on CUDA

    # 모델 불러오기
    model = attempt_load(weights, map_location=device)  # load FP32 model
    stride = int(model.stride.max())  # model stride
    imgsz = check_img_size(imgsz, s=stride)  # check img_size

    dataset = LoadStreams(source, img_size=imgsz, stride=stride)

    if trace:
        model = TracedModel(model, device, opt.img_size)


    if half:
        model.half()  # to FP16

    # Second-stage classifier
    classify = False
    if classify:
        modelc = load_classifier(name='resnet101', n=2)  # initialize
        modelc.load_state_dict(torch.load('weights/resnet101.pt', map_location=device)['model']).to(device).eval()

    return [dataset, model, classify]
# 바코드 탐색 실행 코드
def detection(opt, dataset, model, classify):
    try:
        print("detect 함수 진입")
        dev = None

        source, weights, view_img, save_txt, imgsz, trace = opt.source, opt.weights, opt.view_img, opt.save_txt, opt.img_size, not opt.no_trace
        save_img = not opt.nosave and not source.endswith('.txt')  # save inference images
        webcam = source.isnumeric() or source.endswith('.txt') or source.lower().startswith(
            ('rtsp://', 'rtmp://', 'http://', 'https://'))
        device = select_device(opt.device)
        half = device.type != 'cpu'
        if classify:
            modelc = load_classifier(name='resnet101', n=2)  # initialize
            modelc.load_state_dict(torch.load('weights/resnet101.pt', map_location=device)['model']).to(device).eval()
        
        if webcam:
            view_img = True
            cudnn.benchmark = True  # 이미지 인퍼런스 가져오기

        while True:
            try:
                print(f"yolo thread")
                ################################
                ## 첨가 부분 ##
                # 바코드 이벤트가 있을때
                # 이 부분을 위한 이벤트 전역 선언이 필요하긴 할듯
                    
                
                if event.is_set():
                    print("Event 발생 확인")
                    if not barcode_queue.empty():
                        time.sleep(0.1)
                        barcode_data = barcode_queue.get()
                        # 바코드 데이터가 출력되면 성공
                        print(f"Barcode Data: {barcode_data}")
                        label = int(barcode_data)
                        event.clear()
                        return label
                    else : 
                        label = None
                        time.sleep(0.1)
                        event.clear()
                        return label    
                    time.sleep(0.1)
                    ## 이때 변수 뽑고 이벤트 클리어 ##
                    # event.clear()  # Reset the event
                    
                n = None
                flag = 0
                vid_path, vid_writer = None, None
                distance = get_distance()
                print(f"Measured distance: {distance} cm")
                time.sleep(0.1)

    

                view_img = True
                cudnn.benchmark = True  # 이미지 인퍼런스 가져오기

               
                
                # 이름이랑 색 정하기
                names = model.module.names if hasattr(model, 'module') else model.names
                colors = [[random.randint(0, 255) for _ in range(3)] for _ in names]

                # Run inference
                if device.type != 'cpu':
                    model(torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(next(model.parameters())))  # run once
                old_img_w = old_img_h = imgsz
                old_img_b = 1
                


                    
                if distance == -1 or distance >= opt.distance_threshold:
                    print("Measurement timed out.")
                    time.sleep(0.1)
                    label = None

                    return label

                
                if distance < opt.distance_threshold:
                    print(f"Distance below threshold ({opt.distance_threshold} cm). Starting detection...")
                    time.sleep(1)  # 실행전 잠깐 정지
                    # 웹캠 쓸건지 이미지나 영상 쓸건지

                    t0 = time.time()
                    # 코드 시작 시간 담기
                    start_time = time.perf_counter()

                    for path, img, im0s, vid_cap in dataset:
                        if flag == 1:
                            flag = 0
                            break                                         
                        # 데이터 읽기

                        img = torch.from_numpy(img).to(device)
                        img = img.half() if half else img.float()  # uint8 to fp16/32
                        img /= 255.0  # 0 - 255 to 0.0 - 1.0
                        if img.ndimension() == 3:
                            img = img.unsqueeze(0)

                        # Warmup
                        if device.type != 'cpu' and (old_img_b != img.shape[0] or old_img_h != img.shape[2] or old_img_w != img.shape[3]):
                            old_img_b = img.shape[0]
                            old_img_h = img.shape[2]
                            old_img_w = img.shape[3]
                            for i in range(3):
                                model(img, augment=opt.augment)[0]

                        # Inference
                        t1 = time_synchronized()
                        with torch.no_grad():   # Calculating gradients would cause a GPU memory leak
                            pred = model(img, augment=opt.augment)[0]
                        t2 = time_synchronized()

                        # Apply NMS
                        pred = non_max_suppression(pred, opt.conf_thres, opt.iou_thres, classes=opt.classes, agnostic=opt.agnostic_nms)
                        t3 = time_synchronized()

                        # Apply Classifier
                        if classify:
                            pred = apply_classifier(pred, modelc, img, im0s)

                        # 탐색 시작
                    
                        for i, det in enumerate(pred):  # detections per image

                        # 현재 시간과 시작 시간의 차이 계산
                            elapsed_time = time.perf_counter() - start_time
                            time.sleep(1)
                            print(f"elapsed_time: {elapsed_time} sec")

                            #시간 초과 되면 종료
                            if elapsed_time > opt.duration:
                                if dataset:
                                    dataset.cap.release()
                                if vid_writer:
                                    vid_writer.release()
                                cv2.destroyAllWindows()
                                print("Time over!")
                                flag = 1
                                break

                            if webcam:  # batch_size >= 1
                                p, s, im0, frame = path[i], '%g: ' % i, im0s[i].copy(), dataset.count
                            else:
                                p, s, im0, frame = path, '', im0s, getattr(dataset, 'frame', 0)

                            p = Path(p)  # to Path

                            gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]  # normalization gain whwh
                            if len(det):
                                # Rescale boxes from img_size to im0 size
                                det[:, :4] = scale_coords(img.shape[2:], det[:, :4], im0.shape).round()
                                
                                
                                # Print results
                                for c in det[:, -1].unique():
                                    n = (det[:, -1] == c).sum()  # detections per class
                                    s += f"{n} {names[int(c)]}{'s' * (n > 1)}, "  # add to string
                                # Write results
                                for *xyxy, conf, cls in reversed(det):
                                    if save_txt:  # Write to file
                                        xywh = (xyxy2xywh(torch.tensor(xyxy).view(1, 4)) / gn).view(-1).tolist()  # normalized xywh
                                        line = (cls, *xywh, conf) if opt.save_conf else (cls, *xywh)  # label format
                                        with open(txt_path + '.txt', 'a') as f:
                                            f.write(('%g ' * len(line)).rstrip() % line + '\n')

                                    if save_img or view_img:  # Add bbox to image
                                        label = f'{names[int(cls)]} {conf:.2f}'
                                        plot_one_box(xyxy, im0, label=label, color=colors[int(cls)], line_thickness=1)

                            # Print time (inference + NMS)
                            print(f'{s}Done. ({(1E3 * (t2 - t1)):.1f}ms) Inference, ({(1E3 * (t3 - t2)):.1f}ms) NMS')

                            # Stream results   
                            if view_img:
                                cv2.imshow(str(p), im0)
                                cv2.waitKey(1)  # 1 millisecond
                                # q 누르면 끄게
                                if cv2.waitKey(1) == ord('q'):  
                                    if dataset:
                                        dataset.cap.release()
                                    if vid_writer:
                                        vid_writer.release()
                                    cv2.destroyAllWindows()
                                    flag = 1
                                    break
                                
                            
                            # 물건 값 한개 받아오면
                            if n == 1:
                                print(f"{label}발견!")
                                
                                if dataset:
                                    dataset.cap.release()
                                if vid_writer:
                                    vid_writer.release()
                                cv2.destroyAllWindows()
                                n = None
                                flag = 1

                                return label
                
       
                    
            except usb.core.USBError as e:
                if e.args == ('Operation timed out',):
                    continue
            time.sleep(0.1)  # Adjust sleep time as needed

    finally:
       pass
        #usb.util.dispose_resources(dev)
# 상품 확인 창 객체
class ProductDialog(QDialog, Ui_Dialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setupUi(self)
        self.setWindowTitle("상품 확인")
        self.setGeometry(100, 100, 400, 300)

        # Ui_Dialog에서 정의된 위젯들을 그대로 사용
        self.label_2.setText("주문하신 상품이 맞습니까?")

        # 버튼 클릭 이벤트 연결
        self.pushButton_2.clicked.connect(self.accept)  # 확인 버튼에 이벤트 연결
        self.pushButton.clicked.connect(self.reject)  # 취소 버튼에 이벤트 연결



    def keyPressEvent(self, event):

        if event.key() == Qt.Key_F11:
            if self.is_fullscreen:
                self.showNormal()  # 전체 화면 모드 해제
            else:
                self.showFullScreen()  # 전체 화면 모드로 전환
            self.is_fullscreen = not self.is_fullscreen  # 상태 토글
# 쇼핑 카드 앱 객체
class ShoppingCartApp(QMainWindow, Ui_MainWindow):

    def __init__(self):
        super().__init__()
        self.setupUi(self)

        self.showFullScreen()
        self.is_fullscreen = True

        self.second_window = None
        self.third_window = None
        self.fourth_window = None
        self.fifth_window = None

        self.count = 0
        self.row = None
        self.discount_ret = None

        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_time)
        self.timer.start(1000)

        self.show_main_window()

        self.detection_timer = QTimer(self)
        self.detection_timer.timeout.connect(self.perform_detection)
        self.detection_timer.start(1000)

        self.cart = [[None for _ in range(5)] for _ in range(7)]

        # 버튼 클릭 이벤트 연결
        for i in range(1, 8):
            # plusbutton과 minusbutton의 클릭 이벤트에 각기 다른 슬롯 인덱스를 전달하는 람다 함수 사용
            getattr(self, f'plusbutton_{i}').clicked.connect(lambda _, x=i: self.increment_count(x - 1))
            getattr(self, f'minusbutton_{i}').clicked.connect(lambda _, x=i: self.decrement_count(x - 1))
            # 초기에는 버튼을 숨김
            getattr(self, f'plusbutton_{i}').hide()
            getattr(self, f'minusbutton_{i}').hide()

        self.cleanbutton.clicked.connect(self.delete_all_product)

        self.cashbutton.clicked.connect(self.show_fifth_window_with_qr) # 결제 버튼 클릭 시 QR 생성

        self.display_initial_info()  # 초기 화면 설정

        self.opt = get_opt()  # 옵션 받아오기
        self.dataset, self.model, self.classify = detect(self.opt)

    def keyPressEvent(self, event):
        if event.key() == Qt.Key_F11:
            if self.is_fullscreen:
                self.showNormal()  # 전체 화면 모드 해제
            else:
                self.showFullScreen()  # 전체 화면 모드로 전환
            self.is_fullscreen = not self.is_fullscreen  # 상태 토글

    def display_initial_info(self):  # 초기 화면
        self.productLabel_1.setText("장바구니에 상품을 담아주세요")
        self.priceLabel_1.setText("0원")
        self.discountLabel_1.setText("0퍼센트")
        self.countlabel_1.setText("0개")
        self.realPricelabel_1.setText("0원")
        self.totalrealPricelabel.setText("0원")

    # dialog 물건 받기
    def show_product_dialog(self):
        print(f"현재 self.row: {self.row},{self.discount_ret}")

        if self.discount_ret is None:
            self.discount_ret = [0]
        else:
            for i in self.discount_ret:
                print(i)

        if self.row:
            try:
                # 다이얼로그를 띄우기 전에 MainWindow의 화면을 강제로 새로고침
                self.repaint()

                dialog = ProductDialog(self)
                dialog.label.setText(f"{self.row[2]}가 맞습니까?")
                result = dialog.exec_()

                if result == QDialog.Accepted:
                    print("주문 확인됨")
                    self.count = 1
                    self.add_product(self.row)
                else:
                    print("주문 취소됨")
            except Exception as e:
                print(f"다이얼로그 표시 중 오류 발생: {e}")

    def perform_detection(self):  # 물건 탐색
        label = detection(self.opt, self.dataset, self.model, self.classify)
        self.label = label
        self.row, self.discount_ret = find_info(self.label)
        self.show_product_dialog()

    def display_product_info(self, row, item):
        if item is not None:
            label_name = getattr(self, f"productLabel_{row + 1}", None)
            label_price = getattr(self, f"priceLabel_{row + 1}", None)
            label_count = getattr(self, f"countlabel_{row + 1}", None)
            label_discount = getattr(self, f"discountLabel_{row + 1}", None)
            label_real_price = getattr(self, f"realPricelabel_{row + 1}", None)
            label_total_price = getattr(self, f"totalrealPricelabel", None)

            # 디버깅 출력
            print(f"productLabel_{row + 1}: {label_name}")
            print(f"priceLabel_{row + 1}: {label_price}")
            print(f"countlabel_{row + 1}: {label_count}")
            print(f"discountLabel_{row + 1}: {label_discount}")
            print(f"realPriceLabel_{row + 1}: {label_real_price}")
            print(f"totalPriceLabel: {label_total_price}")


            # QLabel 객체가 None이 아닐 때만 값 설정
            if label_name:
                label_name.setText(item['name'])
                label_name.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
            if label_price:
                label_price.setText(f"{item['price']}원")
                label_price.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
            if label_count:
                label_count.setText(f"{item['count']}개")
                label_count.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
            if label_discount:
                label_discount.setText(f"{item['discount']}퍼센트")
                label_discount.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
            if label_real_price:
                label_real_price.setText(f"{item['total_price']}원")
                label_real_price.setAlignment(Qt.AlignRight | Qt.AlignVCenter)
            return

    def add_product(self, row):
        row = self.row
        product_name = row[2]
        product_price = int(row[3])
        discount_price = int(self.discount_ret[0])  # 할인 가격
        if discount_price is None:
            discount_price = 0
        discounted_price = int(product_price * (100 - discount_price) / 100)  # 할인 적용된 가격
        total_price = int(discounted_price * self.count)  # 총 가격 계산

        for i in range(7):  # 상품이 그 줄에 있는지 판단하고 상품 이름과 일치하는지 판단
            if self.cart[i][0] and self.cart[i][0]['name'] == product_name:
                # 상품이 있다면 count 값
                self.cart[i][0]['count'] += 1
                self.cart[i][0]['total_price'] = self.cart[i][0]['discounted_price'] * self.cart[i][0]['count']
                self.update_product_info()
                return

        # 장바구니에 상품 추가
        for i in range(7):
            if self.cart[i][0] is None :
        
                self.cart[i][0] = {
                    'name': product_name,
                    'price': int(product_price),
                    'discount': int(discount_price),
                    'discounted_price': int(discounted_price),
                    'total_price': int(total_price),
                    'count': 1
                }
                
                # 상품이 추가되면 해당 행의 버튼을 표시
                getattr(self, f'plusbutton_{i + 1}').show()
                getattr(self, f'minusbutton_{i + 1}').show()
                
                self.update_product_info()
                return


    def update_time(self):
        current_time = QDateTime.currentDateTime()
        formatted_time = current_time.toString("yyyy-MM-dd HH:mm:ss")
        self.timelabel.setText(formatted_time)
        self.timelabel.setAlignment(Qt.AlignCenter)

    def increment_count(self, index):  # 수량 증가
        if self.cart[index][0]:  # 장바구니에 항목이 있는 경우에만 수량 증가
            self.cart[index][0]['count'] += self.count
            self.cart[index][0]['total_price'] = self.cart[index][0]['discounted_price'] * self.cart[index][0]['count']
            self.update_product_info()  # 제품 정보 업데이트

            return
            
    def decrement_count(self, index):  # 수량 감소
        if self.cart[index][0] and self.cart[index][0]['count'] > 0:
            self.cart[index][0]['count'] -= self.count
            if self.cart[index][0]['count'] == 0:  # 수량이 0이 되면
                self.cart[index][0] = None  # 장바구니에서 항목 제거
                # 항목을 위로 이동
                for i in range(index, len(self.cart) - 1):
                    self.cart[i][0] = self.cart[i + 1][0]
                self.cart[-1] = [None] * 5  # 마지막 항목을 초기화
                # 버튼 숨기기
                getattr(self, f'plusbutton_{index + 1}').hide()
                getattr(self, f'minusbutton_{index + 1}').hide()
                self.update_product_info()
            else:
                self.cart[index][0]['total_price'] = self.cart[index][0]['discounted_price'] * self.cart[index][0]['count']
                self.update_product_info()  # 제품 정보 업데이트
        return

            

    def update_product_info(self):
        # 장바구니의 각 항목을 업데이트합니다
        total_cart_price = 0
        for i in range(len(self.cart)):
            if self.cart[i][0]:
                self.display_product_info(i, self.cart[i][0])
                total_cart_price += self.cart[i][0]['total_price']
            else:
                self.clear_product_display(i)

        for i in range(len(self.cart)):
            if self.cart[i][0]:
                getattr(self, f'plusbutton_{i + 1}').show()
                getattr(self, f'minusbutton_{i + 1}').show()
            else:
                getattr(self, f'plusbutton_{i + 1}').hide()
                getattr(self, f'minusbutton_{i + 1}').hide()

        label_total_price = getattr(self, f"totalrealPricelabel", None)
        if label_total_price:
            label_total_price.setText(f"{total_cart_price}원")
            label_total_price.setAlignment(Qt.AlignRight | Qt.AlignVCenter)

    def clear_product_display(self, index):

        label_name = getattr(self, f"productLabel_{index + 1}", None)
        label_price = getattr(self, f"priceLabel_{index + 1}", None)
        label_count = getattr(self, f"countlabel_{index + 1}", None)
        label_discount = getattr(self, f"discountLabel_{index + 1}", None)
        label_real_price = getattr(self, f"realPricelabel_{index + 1}", None)
        label_total_price = getattr(self, f"totalrealPricelabel", None)
        
        if label_name:
            label_name.setText("")
        if label_price:
            label_price.setText("")
        if label_count:
            label_count.setText("")
        if label_discount:
            label_discount.setText("")
        if label_real_price:
            label_real_price.setText("")
        if label_total_price:
            label_total_price.setText("")

    def delete_all_product(self):
        # 장바구니 초기화
        
        for i in range(len(self.cart)):
            self.cart[i] = [None] * 5  # 항목 초기화
        for i in range(1, 8):
            # 초기에는 버튼을 숨김
            getattr(self, f'plusbutton_{i}').hide()
            getattr(self, f'minusbutton_{i}').hide()
        # 장바구니 UI 업데이트
        self.update_product_info()
        return


    def show_fifth_window_with_qr(self):
        cart_info = ""
        for i in range(7):
            if self.cart[i][0] is not None:  # None 체크 추가
                item = self.cart[i][0]
                cart_info += f"{item['name']},{item['count']},{item['total_price']},"

        print(cart_info)  # 디버깅용 출력
        if not cart_info:
            cart_info = "장바구니에 상품이 없습니다."

        if self.fifth_window is None:
            self.fifth_window = FifthWindow(self, cart_info)
        else:
            self.fifth_window.update_qr_code(cart_info)
        self.fifth_window.showFullScreen()
        self.fifth_window.show()

    def show_second_window(self):
        if self.second_window is None:
            self.second_window = SecondWindow(self)
        self.hide()
        self.second_window.showFullScreen()  # 전체 화면으로 설정
        self.second_window.show()

    def show_third_window(self):
        if self.third_window is None:
            self.third_window = ThirdWindow(self)
        self.hide()
        self.third_window.showFullScreen()  # 전체 화면으로 설정
        self.third_window.show()

    def show_fourth_window(self):
        if self.fourth_window is None:
            self.fourth_window = FourthWindow(self)
        self.hide()
        self.fourth_window.showFullScreen()  # 전체 화면으로 설정
        self.fourth_window.show()

    def show_fifth_window(self):
        if self.fifth_window is None:
            self.fifth_window = FifthWindow(self)
        self.hide()
        self.fifth_window.showFullScreen()  # 전체 화면으로 설정
        self.fifth_window.show()

    def show_main_window(self):
        self.showFullScreen()  # 전체 화면으로 설정
        self.show()

    # def process_row(self, row):
    #     #product_name = row[2]
    #     price = int(row[3])
    #     discount = 100
    #     real_price = (price - discount) * self.count
    #     #total_price = real_price

    #     self.plusbutton_1.show()
    #     self.minusbutton_1.show()

class SecondWindow(QDialog, Ui_SecondWindow):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setupUi(self)
        self.main_window = parent
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_time)
        self.timer.start(1000)  # 매 초마다 업데이트

        self.showFullScreen()  # 전체 화면 모드로 설정

        self.is_fullscreen = True

        # 초기 텍스트 설정
        self.initial_text = {
            'maplabel_1': self.maplabel_1.text(),
            'maplabel_2': self.maplabel_2.text(),
            'maplabel_3': self.maplabel_3.text(),
            'maplabel_4': self.maplabel_4.text(),
            'maplabel_5': self.maplabel_5.text(),
            'maplabel_6': self.maplabel_6.text(),
        }

        # 버튼 클릭 연결
        self.Drinkbutton.clicked.connect(self.on_drink_button_clicked)
        self.alcolebutton.clicked.connect(self.on_alcole_button_clicked)
        self.snackbutton.clicked.connect(self.on_snack_button_clicked)
        self.housebutton.clicked.connect(self.on_house_button_clicked)
        self.icebutton.clicked.connect(self.on_ice_button_clicked)
        self.freshbutton.clicked.connect(self.on_fresh_button_clicked)

    def keyPressEvent(self, event):
        if event.key() == Qt.Key_F11:
            if self.is_fullscreen:
                self.showNormal()  # 전체 화면 모드 해제
            else:
                self.showFullScreen()  # 전체 화면 모드로 전환
            self.is_fullscreen = not self.is_fullscreen  # 상태 토글

    def update_time(self):
        current_time = QDateTime.currentDateTime()
        formatted_time = current_time.toString("yyyy-MM-dd HH:mm:ss")
        self.timelabel_1.setText(formatted_time)
        self.timelabel_1.setAlignment(Qt.AlignCenter)

    def show_main_window(self):
        self.hide()
        self.main_window.showFullScreen()  # 전체 화면으로 설정
        self.main_window.show()

    def show_third_window(self):
        if self.main_window.third_window is None:
            self.main_window.third_window = ThirdWindow(self.main_window)
        self.hide()
        self.main_window.third_window.showFullScreen()  # 전체 화면으로 설정
        self.main_window.third_window.show()

    def show_fourth_window(self):
        if self.main_window.fourth_window is None:
            self.main_window.fourth_window = FourthWindow(self.main_window)
        self.hide()
        self.main_window.fourth_window.showFullScreen()  # 전체 화면으로 설정
        self.main_window.fourth_window.show()

    def reset_labels(self):
        default_style = "QLabel{\n" \
                        "    color: black;\n" \
                        "    background-color: white;\n" \
                        "    border: 2px solid rgb(0,0,0);\n" \
                        "}"
        default_font = QFont()
        default_font.setPointSize(48)

        self.maplabel_1.setStyleSheet(default_style)
        self.maplabel_1.setText(self.initial_text['maplabel_1'])
        self.maplabel_1.setFont(default_font)
        self.maplabel_1.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

        self.maplabel_2.setStyleSheet(default_style)
        self.maplabel_2.setText(self.initial_text['maplabel_2'])
        self.maplabel_2.setFont(default_font)
        self.maplabel_2.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

        self.maplabel_3.setStyleSheet(default_style)
        self.maplabel_3.setText(self.initial_text['maplabel_3'])
        self.maplabel_3.setFont(default_font)
        self.maplabel_3.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

        self.maplabel_4.setStyleSheet(default_style)
        self.maplabel_4.setText(self.initial_text['maplabel_4'])
        self.maplabel_4.setFont(default_font)
        self.maplabel_4.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

        self.maplabel_5.setStyleSheet(default_style)
        self.maplabel_5.setText(self.initial_text['maplabel_5'])
        self.maplabel_5.setFont(default_font)
        self.maplabel_5.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

        self.maplabel_6.setStyleSheet(default_style)
        self.maplabel_6.setText(self.initial_text['maplabel_6'])
        self.maplabel_6.setFont(default_font)
        self.maplabel_6.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

    def on_drink_button_clicked(self):
        self.reset_labels()
        self.change_maplabel_1_color()

    def on_alcole_button_clicked(self):
        self.reset_labels()
        self.change_maplabel_2_color()

    def on_snack_button_clicked(self):
        self.reset_labels()
        self.change_maplabel_3_color()

    def on_house_button_clicked(self):
        self.reset_labels()
        self.change_maplabel_4_color()

    def on_ice_button_clicked(self):
        self.reset_labels()
        self.change_maplabel_5_color()

    def on_fresh_button_clicked(self):
        self.reset_labels()
        self.change_maplabel_6_color()

    def change_maplabel_1_color(self):
        self.maplabel_1.setStyleSheet("QLabel{\n"
                                      "    color: black;\n"
                                      "    background-color: rgb(160, 191, 250);\n"
                                      "}")
        self.maplabel_1.setText("음료")
        font = QFont()
        font.setPointSize(24)  # 텍스트 크기를 24로 줄임
        self.maplabel_1.setFont(font)
        self.maplabel_1.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

    def change_maplabel_2_color(self):
        self.maplabel_2.setStyleSheet("QLabel{\n"
                                      "    color: black;\n"
                                      "    background-color: rgb(160, 191, 250);\n"
                                      "}")
        self.maplabel_2.setText("술")
        self.maplabel_2.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

    def change_maplabel_3_color(self):
        self.maplabel_3.setStyleSheet("QLabel{\n"
                                      "    color: black;\n"
                                      "    background-color: rgb(160, 191, 250);\n"
                                      "}")
        self.maplabel_3.setText("과자")
        font = QFont()
        font.setPointSize(24)  # 텍스트 크기를 24로 줄임
        self.maplabel_3.setFont(font)
        self.maplabel_3.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

    def change_maplabel_4_color(self):
        self.maplabel_4.setStyleSheet("QLabel{\n"
                                      "    color: black;\n"
                                      "    background-color: rgb(160, 191, 250);\n"
                                      "}")
        self.maplabel_4.setText("생활용품")
        font = QFont()
        font.setPointSize(20)  # 텍스트 크기를 20으로 줄임
        self.maplabel_4.setFont(font)
        self.maplabel_4.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

    def change_maplabel_5_color(self):
        self.maplabel_5.setStyleSheet("QLabel{\n"
                                      "    color: black;\n"
                                      "    background-color: rgb(160, 191, 250);\n"
                                      "}")
        self.maplabel_5.setText("냉동식품")
        self.maplabel_5.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

    def change_maplabel_6_color(self):
        self.maplabel_6.setStyleSheet("QLabel{\n"
                                      "    color: black;\n"
                                      "    background-color: rgb(160, 191, 250);\n"
                                      "}")
        self.maplabel_6.setText("신선식품")
        font = QFont()
        font.setPointSize(20)  # 텍스트 크기를 20으로 줄임
        self.maplabel_6.setFont(font)
        self.maplabel_6.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

class ThirdWindow(QMainWindow, Ui_ThirdWindow):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setupUi(self)
        self.main_window = parent

        self.showFullScreen()  # 전체 화면 모드로 설정
        self.is_fullscreen = True

        # 이미지 파일 경로 설정
        image_path1 = os.path.join(os.path.dirname(__file__), 'img/mart1.png')
        image_path2 = os.path.join(os.path.dirname(__file__), 'img/mart2.png')

        # 이미지 설정
        self.set_image(self.imageLabel_1, image_path1)
        self.set_image(self.imageLabel_2, image_path2)

        # 타이머 설정
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_time)
        self.timer.start(1000)  # 매 초마다 업데이트

    def keyPressEvent(self, event):
        if event.key() == Qt.Key_F11:
            if self.is_fullscreen:
                self.showNormal()  # 전체 화면 모드 해제
            else:
                self.showFullScreen()  # 전체 화면 모드로 전환
            self.is_fullscreen = not self.is_fullscreen  # 상태 토글

    def set_image(self, label, image_path):
        if os.path.exists(image_path):
            pixmap = QPixmap(image_path)
            label.setPixmap(pixmap)
        else:
            label.clear()  # 이미지 경로가 잘못된 경우 이미지 클리어

    def update_time(self):
        current_time = QDateTime.currentDateTime()
        formatted_time = current_time.toString("yyyy-MM-dd HH:mm:ss")
        self.timelabel_1.setText(formatted_time)
        self.timelabel_1.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

    def show_main_window(self):
        self.hide()
        self.main_window.showFullScreen()  # 전체 화면으로 설정
        self.main_window.show()

    def show_second_window(self):
        if self.main_window.second_window is None:
            self.main_window.second_window = SecondWindow(self.main_window)
        self.hide()
        self.main_window.second_window.showFullScreen()  # 전체 화면으로 설정
        self.main_window.second_window.show()

    def show_fourth_window(self):
        if self.main_window.fourth_window is None:
            self.main_window.fourth_window = FourthWindow(self.main_window)
        self.hide()
        self.main_window.fourth_window.showFullScreen()  # 전체 화면으로 설정
        self.main_window.fourth_window.show()

class FourthWindow(QMainWindow, Ui_FourthWindow):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setupUi(self)
        self.main_window = parent

        self.showFullScreen()  # 전체 화면 모드로 설정
        self.is_fullscreen = True

        # 이미지 파일 경로 설정
        image_path1 = os.path.join(os.path.dirname(__file__), 'img/bar.png')
        image_path2 = os.path.join(os.path.dirname(__file__), 'img/camera.png')

        # 이미지 설정
        self.set_image(self.barcordlabe_1, image_path1)
        self.set_image(self.barcordlabe_2, image_path2)

        # 타이머 설정
        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_time)
        self.timer.start(1000)  # 매 초마다 업데이트

    def keyPressEvent(self, event):
        if event.key() == Qt.Key_F11:
            if self.is_fullscreen:
                self.showNormal()  # 전체 화면 모드 해제
            else:
                self.showFullScreen()  # 전체 화면 모드로 전환
            self.is_fullscreen = not self.is_fullscreen  # 상태 토글

    def set_image(self, label, image_path):
        if os.path.exists(image_path):
            pixmap = QPixmap(image_path)
            label.setPixmap(pixmap)
        else:
            label.clear()  # 이미지 경로가 잘못된 경우 이미지 클리어

    def update_time(self):
        current_time = QDateTime.currentDateTime()
        formatted_time = current_time.toString("yyyy-MM-dd HH:mm:ss")
        self.timelabel.setText(formatted_time)
        self.timelabel.setAlignment(Qt.AlignCenter)  # 텍스트 가운데 정렬

    def show_main_window(self):
        self.hide()
        self.main_window.showFullScreen()  # 전체 화면으로 설정
        self.main_window.show()

    def show_second_window(self):
        if self.main_window.second_window is None:
            self.main_window.second_window = SecondWindow(self.main_window)
        self.hide()
        self.main_window.second_window.showFullScreen()  # 전체 화면으로 설정
        self.main_window.second_window.show()

    def show_third_window(self):
        if self.main_window.third_window is None:
            self.main_window.third_window = ThirdWindow(self.main_window)
        self.hide()
        self.main_window.third_window.showFullScreen()  # 전체 화면으로 설정
        self.main_window.third_window.show()

# 5번창 qr 코드
class FifthWindow(QMainWindow, Ui_FifthWindow):
    def __init__(self, parent=None, data=None):
        super().__init__(parent)
        self.main_window = parent
        self.setupUi(self)
        self.showFullScreen()  # 전체 화면 모드로 설정
        self.qrCodeLabel.setGeometry(QRect(240, 40, 471, 471))
        self.is_fullscreen = True
        self.data = data
        if self.data:
            self.generate_qr_code(self.data)
        self.completebutton.clicked.connect(self.complete_purchase)
    def complete_purchase(self):
    # 장바구니 비우기 및 QR 코드 초기화
        if isinstance(self.main_window, ShoppingCartApp):
            self.main_window.delete_all_product()

        if self.qrCodeLabel:
            self.qrCodeLabel.clear()    

        self.main_window.show_main_window()

    def generate_qr_code(self, data):
        try:
            print("generate_qr_code")
            qr = qrcode.QRCode(
                version=1,
                error_correction=qrcode.constants.ERROR_CORRECT_L,
                box_size=10,
                border=4,
            )
            print("qr data:", data)  # 디버깅용 출력
            qr.add_data(data)
            qr.make(fit=True)
            img = qr.make_image(fill='black', back_color='white')

            buffer = io.BytesIO()
            img.save(buffer)
            buffer.seek(0)
            qimg = QImage.fromData(buffer.getvalue())
            pixmap = QPixmap.fromImage(qimg)
            self.qrCodeLabel.setPixmap(pixmap)
        except Exception as e:
            print(f"QR 코드 생성 오류: {e}")

    def update_qr_code(self, data):
        self.generate_qr_code(data)

    def show_main_window(self):
        self.hide()
        self.main_window.showFullScreen()  # 전체 화면으로 설정
        self.main_window.show()

    def keyPressEvent(self, event):
        if event.key() == Qt.Key_F11:
            if self.is_fullscreen:
                self.showNormal()  # 전체 화면 모드 해제
            else:
                self.showFullScreen()  # 전체 화면 모드로 전환
            self.is_fullscreen = not self.is_fullscreen  # 상태 토글


## 바코드 인지 클래스 ##
## 첨가부분 ##
class HIDParser:
    def __init__(self):
        self.keys = {
            0x04: 'a', 0x05: 'b', 0x06: 'c', 0x07: 'd', 0x08: 'e', 0x09: 'f', 0x0a: 'g',
            0x0b: 'h', 0x0c: 'i', 0x0d: 'j', 0x0e: 'k', 0x0f: 'l', 0x10: 'm', 0x11: 'n',
            0x12: 'o', 0x13: 'p', 0x14: 'q', 0x15: 'r', 0x16: 's', 0x17: 't', 0x18: 'u',
            0x19: 'v', 0x1a: 'w', 0x1b: 'x', 0x1c: 'y', 0x1d: 'z', 0x1e: '1', 0x1f: '2',
            0x20: '3', 0x21: '4', 0x22: '5', 0x23: '6', 0x24: '7', 0x25: '8', 0x26: '9',
            0x27: '0', 0x28: ' ', 0x29: '-', 0x2a: '=', 0x2b: '[', 0x2c: ']', 0x2d: '\\',
            0x2e: ';', 0x2f: "'", 0x30: ',', 0x31: '.', 0x32: '/', 0x33: '`'
        }
        self.buffer = ""

    def key_to_ascii(self, upper, key):
        if key in self.keys:
            char = self.keys[key]
            if upper:
                return char.upper()
            return char
        return None

    ## 여기서 print해봤자 안나오는거 확인함
    ## barcode_thread내에서 parsed_data로 확인
    def parse(self, data):
        ascii_string = ""
        is_upper = False
        for i in range(2, 8):
            key = data[i]
            if key == 0:  # Skip empty values
                continue
            if key == 0x28:  # Enter key
                if self.buffer:
                    print(f"Parsed Data: {self.buffer} - Finished")
                    parsed_data = self.buffer
                    self.buffer = ""
                    return parsed_data  # Enter key detected, return buffer
                continue
            ascii_char = self.key_to_ascii(is_upper, key)
            if ascii_char is not None:
                self.buffer += ascii_char

## 바코드 인지 thread ##
## 첨가 부분 ##
def barcode_thread(event, barcode_queue):
    VENDOR_ID = 0x0483
    PRODUCT_ID = 0x0011
    
    dev = usb.core.find(idVendor=VENDOR_ID, idProduct=PRODUCT_ID)
    if dev is None:
        raise ValueError("Device not found")

    if dev.is_kernel_driver_active(0):
        dev.detach_kernel_driver(0)

    dev.set_configuration()
    # 정상적으로 바코드 스캐너 인식
    print("Barcode scanner ready. Scan a barcode...")

    cfg = dev.get_active_configuration()
    interface_number = cfg[(0, 0)].bInterfaceNumber
    intf = usb.util.find_descriptor(cfg, bInterfaceNumber=interface_number)

    endpoint = usb.util.find_descriptor(
        intf,
        custom_match=lambda e: usb.util.endpoint_direction(e.bEndpointAddress) == usb.util.ENDPOINT_IN
    )

    assert endpoint is not None

    parser = HIDParser()

 
    # 쓰레드가 실행되면 계속 데이터가 있는지 확인
    while True:
        try:
            print("barcode thread 실행 중")
            data = dev.read(endpoint.bEndpointAddress, endpoint.wMaxPacketSize)
            parsed_data = parser.parse(data)
            time.sleep(0.1)
            if parsed_data:
                print("data 발생")
                # 여기서 바코드 4자리 찍어보자
                print("parsed_data: ",parsed_data)
                barcode_queue.put(parsed_data)
                # 이때 이벤트가 set되는것을 yolo측에서 확인해보자
                event.set()  # Signal that new data is available
                # 데이터는 계속 읽기 때문에 초기화 필요 없긴할 듯
                barcodeNum = parsed_data
                print("barcodeNum빼오기:", barcodeNum)

                # 바코드 이벤트 발생 확인 print
                print("바코드 이벤트 발생!!")

        except usb.core.USBError as e:
            if e.args == ('Operation timed out',):
                continue
        time.sleep(0.1)



def main():
    # Argument parsing

    # 338번째 줄로 이동
    #barcode_queue = queue.Queue()
    #event = threading.Event()

    # 바코드 읽기 쓰레드 시작
    barcode_thread_instance = threading.Thread(target=barcode_thread, args=(event, barcode_queue))

    # 여기 안에서 while문 돌리자
    barcode_thread_instance.start()

    try:
        # GPIO셋업
        setup_gpio()
        change_db()
        update_products()
        start_sqlite()
        

        # DPI 스케일링 설정
        if hasattr(Qt, 'AA_EnableHighDpiScaling'):
            QApplication.setAttribute(Qt.AA_EnableHighDpiScaling, True)
        if hasattr(Qt, 'AA_UseHighDpiPixmaps'):
            QApplication.setAttribute(Qt.AA_UseHighDpiPixmaps, True)

        # 환경 변수 설정
        os.environ["QT_AUTO_SCREEN_SCALE_FACTOR"] = "1"

        app = QApplication(sys.argv)
        #print("shoppping")
        window = ShoppingCartApp()
        window.show()

        sys.exit(app.exec())

    except Exception as e:
        cleanup_gpio()
        print(f"Unhandled Exception: {e}")

        
if __name__ == '__main__':

    main()