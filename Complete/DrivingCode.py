import threading
import serial
import time
from PCA9685 import PCA9685
from gpiozero import Servo, DistanceSensor
import math
from scipy.optimize import fsolve

servoPin = 18
SERVO_MIN = -1
SERVO_MAX = 1

stop_signal = False

sensor1 = DistanceSensor(echo=19, trigger=26)
sensor2 = DistanceSensor(echo=16, trigger=13)
sensor3 = DistanceSensor(echo=12, trigger=6)
value1 = 100001
value2 = 100001

servo = Servo(servoPin)

Dir = [
    'forward',
    'backward',
]

pwm = PCA9685(0x40, debug=False)
pwm.setPWMFreq(50)

ser_arduino = serial.Serial('/dev/ttyAMA0', 115200, timeout=1)

lock = threading.Lock()

def setServoPos(degree):
    if degree > 150:
        degree = 150
    elif degree < 30:
        degree = 30

    servo_value = (degree / 180.0) * 2 - 1  
    servo.value = servo_value

def equations(vars, d1, d2):
    tx, ty = vars
    eq1 = tx**2 + ty**2 - d1**2
    eq2 = (tx - 60)**2 + ty**2 - d2**2
    return [eq1, eq2]

def calculate_angle(d1, d2, d3=60):
    initial_guess = [0, 0]
    a = d1/20 + 15 
    b = d2/20 + 15
    a2 = a**2
    b2 = b**2
        
    a = abs(math.sqrt(abs(a2 - 625)))
    b = abs(math.sqrt(abs(b2 - 625)))
    solution = fsolve(equations, initial_guess, args=(a, b))
    tx, ty = solution
    
    theta_degrees = 90
    ty2 = ty**2
    d2 = 2500
    
    if a < b and (ty2 + d2) < b2:
        theta_degrees = 35
    elif a > b and (ty2 + d2) < a2:
        theta_degrees = 145
      
    return theta_degrees

class Motor_Driver():
    def __init__(self):
        self.PWMA = 0
        self.AIN1 = 1
        self.AIN2 = 2
        self.PWMB = 5
        self.BIN1 = 3
        self.BIN2 = 4

    def Run(self, motor, index, speed):
        if speed > 100:
            return
        if motor == 0:
            pwm.setDutycycle(self.PWMA, speed)
            if index == Dir[0]:
                pwm.setLevel(self.AIN1, 0)
                pwm.setLevel(self.AIN2, 1)
            else:
                pwm.setLevel(self.AIN1, 1)
                pwm.setLevel(self.AIN2, 0)
        else:
            pwm.setDutycycle(self.PWMB, speed)
            if index == Dir[0]:
                pwm.setLevel(self.BIN1, 0)
                pwm.setLevel(self.BIN2, 1)
            else:
                pwm.setLevel(self.BIN1, 1)
                pwm.setLevel(self.BIN2, 0)

    def Stop(self, motor):
        if motor == 0:
            pwm.setDutycycle(self.PWMA, 0)
        else:
            pwm.setDutycycle(self.PWMB, 0)

    def StopAll(self):
        self.Stop(0)
        self.Stop(1)

    def Forward(self, speed, angle):
        setServoPos(angle)
        self.Run(0, 'forward', speed)
        self.Run(1, 'forward', speed)

def get_UWB_data():
    global value1, value2
    try:
        while True:
            line = ser_arduino.readline()
            try:
                line = line.decode('utf-8').rstrip()
            except UnicodeDecodeError:
                continue
            
            if line:
                try:
                    values = line.split(',')
                    #with lock:
                    value1 = float(values[0])
                    value2 = float(values[1])
                except (IndexError, ValueError) as e:
                    print(f"Error parsing data: {e}")
    except serial.SerialException as e:
        print(f"Serial error: {e}")
    finally:
        ser_arduino.close()

def receive_from_arduino(motor_driver):
    global stop_signal, value1, value2
    while True:
        #print(sensor1.distance, "     ", sensor2.distance, "    ", sensor3.distance)
        if sensor1.distance <= 0.8 or sensor2.distance <= 0.8 or sensor3.distance <= 0.8:
            with lock:
                stop_signal = True
            motor_driver.StopAll()
        else:
            with lock:
                stop_signal = False
                
        if stop_signal:
            motor_driver.StopAll()
            continue
        
        #print(value1, "    ", value2)
        with lock:
            if value1 <= 10000 and value2 <= 10000:
                if value1 <= 1200 and value2 <= 1200:
                    angle = calculate_angle(value1, value2)
                    setServoPos(angle)
                    motor_driver.StopAll()
                    #print("this")
                    time.sleep(0.4)
                else:
                    angle = calculate_angle(value1, value2)
                    speed = 90
                    #setServoPos(angle)
                    if angle == 90:
                        speed = 60
                    motor_driver.Forward(speed, angle)
                    #print("that")
                    time.sleep(0.4)
            else:
                motor_driver.StopAll()

if __name__ == "__main__":
    Motor = Motor_Driver()
    
    receive_thread = threading.Thread(target=receive_from_arduino, args=(Motor,))
    UWB_thread = threading.Thread(target=get_UWB_data)
    
    receive_thread.start()
    UWB_thread.start()

    try:
        receive_thread.join()
        UWB_thread.join()
        
    except KeyboardInterrupt:
        print("except ERROR")
        Motor.StopAll()
