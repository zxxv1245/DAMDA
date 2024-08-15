import serial

# 수신 측의 UART 포트
UART_PORT = '/dev/ttyTHS0'  # 실제 포트명으로 변경 필요
BAUD_RATE = 115200

def read_sensor_data():
    try:
        ser = serial.Serial(UART_PORT, BAUD_RATE, timeout=1)  # 적절한 타임아웃 설정
        print(f"Listening for messages on {UART_PORT}")

        while True:
            # 데이터가 버퍼에 있는 동안 계속 읽어오기
            while ser.in_waiting > 0:
                # 한 줄씩 읽기
                line = ser.readline().decode('utf-8').rstrip()
                if line:
                    print(f"Received Kg: {line}")

    except serial.SerialException as e:
        print(f"Serial error: {e}")
    finally:
        ser.close()

if __name__ == "__main__":
    read_sensor_data()
