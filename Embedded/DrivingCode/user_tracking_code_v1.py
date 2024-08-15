import threading
import serial
from time import sleep
from PCA9685 import PCA9685
from gpiozero import Servo

servoPin = 18
SERVO_MIN = -1
SERVO_MAX = 1

servo = Servo(servoPin)

current_angle = 77

Dir = [
    'forward',
    'backward',
]
pwm = PCA9685(0x40, debug=False)
pwm.setPWMFreq(50)


def setServoPos(degree):
    global current_angle
    if degree > 170:
        degree = 170
    elif degree < 0:
        degree = 0


    servo_value = (degree + 30) / 180.0 * 2 -1
    servo.value = servo_value
    current_angle = degree
    print("Degree {} to {}(Value)".format(degree, servo_value))

def getServoPos():
    return current_angle

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
        if(motor == 0):
            pwm.setDutycycle(self.PWMA, speed)
            if(index == Dir[0]):
                #print("Motor 0 forward")
                pwm.setLevel(self.AIN1, 0)
                pwm.setLevel(self.AIN2, 1)
            else:
                #print("Motor 0 backward")
                pwm.setLevel(self.AIN1, 1)
                pwm.setLevel(self.AIN2, 0)
        else:
            pwm.setDutycycle(self.PWMB, speed)
            if(index == Dir[0]):
                #print("Motor 1 forward")
                pwm.setLevel(self.BIN1, 0)
                pwm.setLevel(self.BIN2, 1)
            else:
                #print("Motor 1 backward")
                pwm.setLevel(self.BIN1, 1)
                pwm.setLevel(self.BIN2, 0)

    def Stop(self, motor):
        if (motor == 0):
            pwm.setDutycycle(self.PWMA, 0)
        else:
            pwm.setDutycycle(self.PWMB, 0)

    def TurnLeft(self, speed, angle):
        # Left turn: Left motor backward, Right motor forward
        setServoPos(angle)
        self.Run(0, 'forward', speed)
        self.Run(1, 'forward', speed)

    def TurnRight(self, speed, angle):
        # Right turn: Left motor forward, Right motor backward
        setServoPos(angle)
        self.Run(0, 'forward', speed)
        self.Run(1, 'forward', speed)

    def StopAll(self):
        self.Stop(0)
        self.Stop(1)

    def Forward(self, speed):
        setServoPos(0)
        self.Run(0, 'forward', speed)
        self.Run(1, 'forward', speed)


def receive_from_arduino(motor_driver):
    try:
        ser_arduino = serial.Serial('/dev/ttyAMA0', 115200, timeout=1)
        now_angle = 77

        while True:
            line = ser_arduino.readline()
            try:
                line = line.decode('utf-8').rstrip()
            except UnicodeDecodeError:
                # print("UnicodeDecodeError encountered. Ignoring the line.")
                continue

            if line:
                try:
                    values = line.split(',')
                    value1 = float(values[0])
                    value2 = float(values[1])
                    #print(f"Value 1: {value1}, Value 2: {value2}")

                    if value1 != 5000 and value2 != 5000:
                        if value1 <= 500 and value2 <= 500:
                            print("stop")
                            motor_driver.StopAll()
                        elif abs(value1 - value2) < 100:

                            now_angle = 77
                            print("forward,", now_angle)
                            motor_driver.Forward(70)
                        elif value1 > value2:
                            
                            TrPower = (value1 - value2) // 80
                            Rest = (value1 - value2) % 80

                            now_angle = 77 + (TrPower * 10) + Rest
                            if now_angle >= 170:
                                now_angle = 170
                            print(now_angle)
                            print("right,", now_angle)
                            motor_driver.TurnRight(100, now_angle)
                        else:

                            TrPower = value2 - value1 // 80
                            Rest = (value2 - value1) % 80

                            now_angle = 77 - (TrPower * 10) + Rest
                            if now_angle <=0:
                                now_angle = 0
                            print("left,", now_angle)
                            motor_driver.TurnLeft(100, now_angle)
                    else:
                        motor_driver.StopAll()
                        
                except (IndexError, ValueError) as e:
                    print(f"Error parsing data: {e}")
    except serial.SerialException as e:
        print(f"Serial error: {e}")
    finally:
        ser_arduino.close()

def send_to_jetson():
    try:
        uart = serial.Serial("/dev/ttyAMA0", 115200, timeout=1)  # Use the correct serial port
        while True:
            sleep(1)  # Adjust the delay as needed
    except serial.SerialException as e:
        print(f"Serial error: {e}")
    finally:
        uart.close()

def stop_all_after_delay(motor_driver, delay):
    sleep(delay)
    print("Stopping all motors after delay")
    motor_driver.StopAll()

if __name__ == "__main__":
    Motor = Motor_Driver()
    
    receive_thread = threading.Thread(target=receive_from_arduino, args=(Motor,))
    send_thread = threading.Thread(target=send_to_jetson)
    stop_thread = threading.Thread(target=stop_all_after_delay, args=(Motor, 20))

    receive_thread.start()
    send_thread.start()
    stop_thread.start()

    try:
        receive_thread.join()
        send_thread.join()
        stop_thread.join()
    except KeyboardInterrupt:
        print("Interrupted by user")
        Motor.StopAll()

