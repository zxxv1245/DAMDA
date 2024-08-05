from time import sleep

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

while True:
    # Collecting data from load cells
    raw_weight1 = hx1.value
    weight1 = (raw_weight1 - zero_offset1) * scale_ratio1

    raw_weight2 = hx2.value
    weight2 = (raw_weight2 - zero_offset2) * scale_ratio2

    #print(f"first weight: {weight1:.2f} g")
    #print(f"second weight: {weight2:.2f} g")
    avg_value = (weight1 +  weight2)/2
    print(f"Weight: {avg_value:.2f} g")

    sleep(1)
