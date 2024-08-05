import asyncio
from bleak import BleakScanner
import numpy as np
from scipy.optimize import least_squares
import time

class KalmanFilter:
    def __init__(self, A, H, Q, R, P, x0):
        self.A = A
        self.H = H
        self.Q = Q
        self.R = R
        self.P = P
        self.x = x0

    def predict(self):
        self.x = np.dot(self.A, self.x)
        self.P = np.dot(np.dot(self.A, self.P), self.A.T) + self.Q

    def update(self, z):
        S = np.dot(self.H, np.dot(self.P, self.H.T)) + self.R
        K = np.dot(np.dot(self.P, self.H.T), np.linalg.inv(S))
        y = z - np.dot(self.H, self.x)
        self.x = self.x + np.dot(K, y)
        I = np.eye(self.P.shape[0])
        self.P = np.dot(np.dot((I - np.dot(K, self.H)), self.P), (I - np.dot(K, self.H)).T) + np.dot(np.dot(K, self.R), K.T)

    def get_state(self):
        return self.x.item()

def calculate_distance(rssi, tx_power=-16, n=2):
    distance = 10 ** ((tx_power - rssi) / (10 * n))
    return distance

def trilateration(params, points, distances):
    x, y = params
    predicted_distances = np.sqrt((x - points[:, 0])**2 + (y - points[:, 1])**2)
    return predicted_distances - distances

def estimate_position(points, distances):
    initial_guess = np.mean(points, axis=0)
    result = least_squares(trilateration, initial_guess, args=(points, distances))
    return result.x

async def scan_for_devices(target_macs):
    filters = {mac: KalmanFilter(A=np.array([[1]]), H=np.array([[1]]), Q=np.array([[1]]), R=np.array([[10]]), P=np.array([[100]]), x0=np.array([[0]])) for mac in target_macs}
    rssi_values = {mac: [] for mac in target_macs}
    distances = {mac: 0 for mac in target_macs}

    async def detection_callback(device, advertisement_data):
        if device.address.lower() in target_macs:
            print(f"Target device ({device.address}) found with RSSI: {device.rssi}")

            # Update RSSI values array
            rssi_values[device.address.lower()].append(device.rssi)

            if len(rssi_values[device.address.lower()]) > 0:
                latest_rssi = rssi_values[device.address.lower()][-1]
                filters[device.address.lower()].predict()
                filters[device.address.lower()].update(np.array([[latest_rssi]]))
                filtered_rssi = filters[device.address.lower()].get_state()
                print(f"Filtered RSSI for {device.address}: {filtered_rssi}")

                # Calculate distance
                distance = calculate_distance(filtered_rssi)
                distances[device.address.lower()] = distance
                print(f"Calculated distance for {device.address}: {distance}")

                # Ensure all distances are available for trilateration
                if all(distances[mac] != 0 for mac in target_macs):
                    distances_array = np.array([distances[mac] for mac in target_macs])
                    estimated_position = estimate_position(points, distances_array)
                    print(f"Estimated Position: {estimated_position}")

    scanner = BleakScanner(detection_callback=detection_callback)
    await scanner.start()

    start_time = time.time()
    while time.time() - start_time < 150:  # Timeout after 150 seconds
        await asyncio.sleep(0.1)

    await scanner.stop()

if __name__ == "__main__":
    target_mac_addresses = [
        "C3:00:00:1C:62:4C",
        "C3:00:00:1C:62:4D",
        "C3:00:00:1C:62:4B"
    ]

    points = np.array([[-2.25, 0], [2.25, 0], [0, -5.013]])

    asyncio.run(scan_for_devices([mac.lower() for mac in target_mac_addresses]))