import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraScreen } from 'react-native-camera-kit';
import { colors } from '../constants/color';

const QRCodeScannerScreen = () => {
  const onSuccess = (event) => {
    const qrData = event.nativeEvent.codeStringValue;
    console.log(qrData); // QR 코드 데이터를 콘솔에 출력
    Alert.alert('QR code found', qrData); // QR 코드 데이터로 Alert 표시
  };

  return (
    <View style={styles.container}>
      <CameraScreen
        scanBarcode={true}
        onReadCode={onSuccess} // QR 코드 발견 시 onSuccess 콜백 호출
        showFrame={false} // CameraScreen의 기본 프레임을 숨깁니다
        laserColor='red' // 레이저 색상
        frameColor='white' // 프레임 색상
      />
      <View style={styles.overlay}>
        <View style={styles.squareFrame} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareFrame: {
    width: 250, // 원하는 프레임의 너비
    height: 250, // 원하는 프레임의 높이
    borderWidth: 2,
    borderColor: 'white',
  },
});

export default QRCodeScannerScreen;
