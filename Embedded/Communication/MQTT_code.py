from gpiozero import DigitalOutputDevice, DigitalInputDevice
from time import sleep
import paho.mqtt.client as mqtt
from hx711_gpiozero import HX711


broker_address = "i11c103.p.ssafy.io"  
client = mqtt.Client("Raspberry_Publisher")

def on_connect(client, userdata, flags, rc):
    print(f"Connected with result code {rc}")

def on_message(client, userdata, msg):
    print(f"Message received: {msg.payload.decode()}")

client.on_connect = on_connect
client.on_message = on_message

client.connect(broker_address)
client.loop_start()


sck_pin1 = 19
dt_pin1 = 26
sck_pin2 = 16
dt_pin2 = 13

hx1 = HX711(sck=sck_pin1, dt=dt_pin1)
hx2 = HX711(sck=sck_pin2, dt=dt_pin2)

print("Initializing first load cell...")
sleep(1)
init_reading1 = hx1.value
zero_offset1 = init_reading1

print("Initializing second load cell...")
sleep(1)
init_reading2 = hx2.value
zero_offset2 = init_reading2

print("First load cell calibration step.")
input("Press enter to continue...")
calib_weight1 = float(input("Enter first calibration weight (g): "))
calib_reading1 = hx1.value - zero_offset1

if calib_reading1 == 0:
    print("Error: Calibration reading for the first load cell is zero. Check the load cell connection and try again.")
    exit()

scale_ratio1 = calib_weight1 / calib_reading1

print("Second load cell calibration step.")
input("Press enter to continue...")
calib_weight2 = float(input("Enter second calibration weight (g): "))
calib_reading2 = hx2.value - zero_offset2

if calib_reading2 == 0:
    print("Error: Calibration reading for the second load cell is zero. Check the load cell connection and try again.")
    exit()

scale_ratio2 = calib_weight2 / calib_reading2

print("Starting load cell measurement.")

while True:

    raw_weight1 = hx1.value
    weight1 = (raw_weight1 - zero_offset1) * scale_ratio1

    raw_weight2 = hx2.value
    weight2 = (raw_weight2 - zero_offset2) * scale_ratio2


    avg_value = (weight1 + weight2) / 2
    print(f"Weight: {avg_value:.2f} g")

    # Publish average weight via MQTT
    client.publish("weight/data", avg_value)

    sleep(1)
