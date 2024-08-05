import threading
import serial
from time import sleep
from gpiozero import DistanceSensor
from hx711_gpiozero import HX711

data_lock = threading.Lock()

# UltraSonic sensor setup
# sensor1 = DistanceSensor(echo=19, trigger=26)
# sensor2 = DistanceSensor(echo=16, trigger=13)
# sensor3 = DistanceSensor(echo=12, trigger=6)
# sensor4 = DistanceSensor(echo=23, trigger=24)

# Load cell setup and initialization
hx1 = HX711(sck=22, dt=27)
hx2 = HX711(sck=17, dt=18)

sleep(1)
init_reading1 = hx1.value
zero_offset1 = init_reading1

sleep(1)
init_reading2 = hx2.value
zero_offset2 = init_reading2

# Calibration for first load cell
calib_weight1 = float(input("Enter first calibration weight (g): "))
calib_reading1 = hx1.value - zero_offset1

if calib_reading1 == 0:
    # print("Error: Calibration reading for the first load cell is zero. Check the load cell connection and try again.")
    exit()

scale_ratio1 = calib_weight1 / calib_reading1

calib_weight2 = float(input("Enter second calibration weight (g): "))
calib_reading2 = hx2.value - zero_offset2

if calib_reading2 == 0:
    # print("Error: Calibration reading for the second load cell is zero. Check the load cell connection and try again.")
    exit()

scale_ratio2 = calib_weight2 / calib_reading2

def receive_from_arduino():
    try:
        ser_arduino = serial.Serial('/dev/ttyAMA0', 115200, timeout=1)
        while True:
            line = ser_arduino.readline().decode('utf-8').rstrip()
            if line:
                try:
                    values = line.split(',')
                    value1 = float(values[0])
                    value2 = float(values[1])
                    print(f"Value 1: {value1}, Value 2: {value2}")
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
            # Collecting data from ultrasonic sensors
            # distance1 = sensor1.distance * 100  # unit: cm
            # distance2 = sensor2.distance * 100
            # distance3 = sensor3.distance * 100
            # distance4 = sensor4.distance * 100

            # flag1 = 1 if distance1 <= 50 else 0
            # flag2 = 1 if distance2 <= 50 else 0
            # flag3 = 1 if distance3 <= 50 else 0
            # flag4 = 1 if distance4 <= 50 else 0

            # if flag1 == 1 or flag2 == 1 or flag3 == 1 or flag4 == 1:
            #     print("Stop Event!!")
            # else:
            #     print("go!")

            # Collecting data from load cells
            raw_weight1 = hx1.value
            weight1 = (raw_weight1 - zero_offset1) * scale_ratio1

            raw_weight2 = hx2.value
            weight2 = (raw_weight2 - zero_offset2) * scale_ratio2
            avg_value = (weight1 + weight2) / 2

            data = f"{avg_value:.2f}"
            uart.write(data.encode('utf-8'))
            print(f"Sent to Jetson: {data}")

            sleep(1)  # Adjust the delay as needed

    except serial.SerialException as e:
        print(f"Serial error: {e}")
    finally:
        uart.close()

if __name__ == "__main__":
    receive_thread = threading.Thread(target=receive_from_arduino)
    send_thread = threading.Thread(target=send_to_jetson)

    receive_thread.start()
    send_thread.start()

    try:
        receive_thread.join()
        send_thread.join()
    except KeyboardInterrupt:
        print("Interrupted by user")


