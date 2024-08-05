from gpiozero import Servo
from time import sleep
from PCA9685 import PCA9685

# 서보 모터 설정
servoPin = 18
SERVO_MIN = -1
SERVO_MAX = 1

servo = Servo(servoPin)

current_angle = 77  # 초기 각도 설정 (예: 60도)

def setServoPos(degree):
    global current_angle
    if degree > 170:
        degree = 170
    elif degree < 0:
        degree = 0
    # degree를 -30에서 150까지의 값에서 -1에서 1까지의 값으로 변환
    servo_value = (degree + 30) / 180.0 * 2 - 1
    servo.value = servo_value
    current_angle = degree
    print("Degree: {} to {}(Value)".format(degree, servo_value))

def getServoPos():
    return current_angle

# 모터 드라이버 설정
Dir = ['forward', 'backward']
pwm = PCA9685(0x40, debug=False)
pwm.setPWMFreq(50)

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

# 서보 모터와 DC 모터 통합 제어
def handle_and_drive():
    Motor = Motor_Driver()
    
    # 좌회전
    setServoPos(0)
    Motor.Run(0, 'forward', 100)
    Motor.Run(1, 'forward', 100)
    sleep(2)
    
    # 우회전
    setServoPos(154)
    Motor.Run(0, 'forward', 100)
    Motor.Run(1, 'forward', 100)
    sleep(2)
    
    # 직진
    setServoPos(77)
    Motor.Run(0, 'forward', 100)
    Motor.Run(1, 'forward', 100)
    sleep(2)
    
    # 정지
    Motor.Stop(0)
    Motor.Stop(1)
    sleep(2)

if __name__ == "__main__":
    handle_and_drive()
    print("Current Servo Angle: ", getServoPos())

