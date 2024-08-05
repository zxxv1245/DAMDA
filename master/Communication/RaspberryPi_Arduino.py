import serial
from time import sleep
from gpiozero import  DistanceSensor
from hx711_gpiozero import HX711
import threading

# Ultrasonic sensor setup
sensor1 = DistanceSensor(echo=19, trigger=26)
sensor2 = DistanceSensor(echo=16, trigger=13)
sensor3 = DistanceSensor(echo=12, trigger=6)
sensor4 = DistanceSensor(echo=23, trigger=24)


# Load cell setup and initialization
hx1 = HX711(sck=22, dt=27)
print("First load cell reset...")
sleep(1)
init_reading1 = hx1.value
zero_offset1 = init_reading1

hx2 = HX711(sck=17, dt=18)
print("Second load cell reset...")
sleep(1)
init_reading2 = hx2.value
zero_offset2 = init_reading2


# Calibration for first load cell
print("First load cell calibration step.")
input("Press enter to continue...")
calib_weight1 = float(input("Enter first calibration weight (g): "))
calib_reading1 = hx1.value - zero_offset1

if calib_reading1 == 0:
    print("Error: Calibration reading for the first load cell is zero. Check the load cell connection and try again.")
    exit()

scale_ratio1 = calib_weight1 / calib_reading1

# Calibration for second load cell
print("Second load cell calibration step.")
input("Press enter to continue...")
calib_weight2 = float(input("Enter second calibration weight (g): "))
calib_reading2 = hx2.value - zero_offset2

if calib_reading2 == 0:
    print("Error: Calibration reading for the second load cell is zero. Check the load cell connection and try again.")
    exit()

scale_ratio2 = calib_weight2 / calib_reading2

print("Starting load cell measurement.")

arduino_ser = serial.Serial('/dev/ttyAMA0', 115200, timeout=1)
#jetson_ser = serial.Serial('/dev/ttyTHS0',115200, timeout=1)




def read_weight_sensor():
    while True:
        # Collecting data from ultrasonic sensors
        distance1 = sensor1.distance * 100  # unit: cm
        distance2 = sensor2.distance * 100
        distance3 = sensor3.distance * 100
        distance4 = sensor4.distance * 100

        flag1 = 1 if distance1 <= 50 else 0
        flag2 = 1 if distance2 <= 50 else 0
        flag3 = 1 if distance3 <= 50 else 0
        flag4 = 1 if distance4 <= 50 else 0

        if flag1 == 1 or flag2 == 1 or flag3 == 1 or flag4 == 1:
            print("Stop Event!!")
        else:
            print("go!")

        # Collecting data from load cells
        raw_weight1 = hx1.value
        weight1 = (raw_weight1 - zero_offset1) * scale_ratio1

        raw_weight2 = hx2.value
        weight2 = (raw_weight2 - zero_offset2) * scale_ratio2

        #print(f"first weight: {weight1:.2f} g")
        #print(f"second weight: {weight2:.2f} g")
        avg_value = (weight1 +  weight2)/2
        print(f"Weight: {avg_value:.2f} g")
        #jetson_ser.write(f"Weight : {avg_value:.2f} g")
    

def read_sensor_data():
    while True:

        line = arduino_ser.readline().decode('utf-8').rstrip()
        #ser.write(b'Hello from Raspberry Pi\n')
        if line:        
            try:
                values = line.split(',')
                value1 = float(values[0])
                value2 = float(values[1])
                print(f"Value 1: {value1}, Value 2: {value2}")
            except (IndexError, ValueError) as e:
                print(f"Error parsing data: {e}")

        #time.sleep(1)

if __name__ == "__main__":
    try:
        read_sensor_data()
    except KeyboardInterrupt:
        ser.close()
        print("Serial connection closed.")


thread = threading.Thread(target=uart_read_thread)
thread.start()
