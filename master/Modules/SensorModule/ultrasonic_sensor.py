# -*- coding: utf-8 -*-
from gpiozero import DistanceSensor
from time import sleep

# Ultrasonic sensor setup
sensor1 = DistanceSensor(echo=19, trigger=26)
sensor2 = DistanceSensor(echo=16, trigger=13)
sensor3 = DistanceSensor(echo=12, trigger=6)
sensor4 = DistanceSensor(echo=23, trigger=24)


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

    sleep(1)
