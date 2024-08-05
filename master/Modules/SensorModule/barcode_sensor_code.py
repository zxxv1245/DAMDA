import usb.core
import usb.util
import time

class HIDParser:
    def __init__(self):
        self.keys = {
            0x04: 'a', 0x05: 'b', 0x06: 'c', 0x07: 'd', 0x08: 'e', 0x09: 'f', 0x0a: 'g',
            0x0b: 'h', 0x0c: 'i', 0x0d: 'j', 0x0e: 'k', 0x0f: 'l', 0x10: 'm', 0x11: 'n',
            0x12: 'o', 0x13: 'p', 0x14: 'q', 0x15: 'r', 0x16: 's', 0x17: 't', 0x18: 'u',
            0x19: 'v', 0x1a: 'w', 0x1b: 'x', 0x1c: 'y', 0x1d: 'z', 0x1e: '1', 0x1f: '2',
            0x20: '3', 0x21: '4', 0x22: '5', 0x23: '6', 0x24: '7', 0x25: '8', 0x26: '9',
            0x27: '0', 0x28: ' ', 0x29: '-', 0x2a: '=', 0x2b: '[', 0x2c: ']', 0x2d: '\\',
            0x2e: ';', 0x2f: "'", 0x30: ',', 0x31: '.', 0x32: '/', 0x33: '`'
        }
        self.buffer = ""

    def key_to_ascii(self, upper, key):
        if key in self.keys:
            char = self.keys[key]
            if upper:
                return char.upper()
            return char
        return None

    def parse(self, data):
        ascii_string = ""
        is_upper = False
        for i in range(2, 8):
            key = data[i]
            if key == 0:  # Skip empty values
                continue
            if key == 0x28:  # Enter key
                if self.buffer:
                    print(f"Parsed Data: {self.buffer} - Finished")
                    self.buffer = ""
                continue
            ascii_char = self.key_to_ascii(is_upper, key)
            if ascii_char is not None:
                self.buffer += ascii_char

        #if self.buffer:
            #print(f"Parsed Data: {self.buffer}")

def main():
    VENDOR_ID = 0x0483
    PRODUCT_ID = 0x0011

    # USB 장치 찾기
    dev = usb.core.find(idVendor=VENDOR_ID, idProduct=PRODUCT_ID)
    if dev is None:
        raise ValueError("Device not found")

    # 장치가 커널 드라이버를 사용하는 경우, 드라이버를 분리합니다.
    if dev.is_kernel_driver_active(0):
        dev.detach_kernel_driver(0)

    # 장치의 활성화
    dev.set_configuration()

    # 첫 번째 인터페이스의 첫 번째 엔드포인트를 얻습니다.
    cfg = dev.get_active_configuration()
    interface_number = cfg[(0, 0)].bInterfaceNumber
    intf = usb.util.find_descriptor(cfg, bInterfaceNumber=interface_number)

    # 읽기 엔드포인트를 찾습니다.
    endpoint = usb.util.find_descriptor(
        intf,
        custom_match=lambda e: usb.util.endpoint_direction(e.bEndpointAddress) == usb.util.ENDPOINT_IN
    )

    assert endpoint is not None

    parser = HIDParser()

    print("Barcode scanner ready. Scan a barcode...")

    try:
        while True:
            try:
                # 데이터 읽기
                data = dev.read(endpoint.bEndpointAddress, endpoint.wMaxPacketSize)
                # Raw Data (Hex) 출력 주석 처리
                # print(f"Raw Data (Hex): {' '.join(f'{x:02x}' for x in data)}")
                parser.parse(data)
            except usb.core.USBError as e:
                if e.args == ('Operation timed out',):
                    continue
            time.sleep(0.1)  # Adjust sleep time as needed

    except KeyboardInterrupt:
        print("Program interrupted. Closing...")
    finally:
        # 리소스 정리
        usb.util.dispose_resources(dev)

if __name__ == "__main__":
    main()

