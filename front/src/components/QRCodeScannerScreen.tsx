import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text, Modal, PermissionsAndroid } from 'react-native';
import { CameraScreen } from 'react-native-camera-kit';
import { colors } from '../constants/color';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { stackNavigations } from '../constants';
import CustomButton from './CustomButton';

const QRCodeScannerScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [qrData, setQrData] = useState('');
  const navigation = useNavigation();
  const [scanning, setScanning] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false); // 권한 상태 추가

  // 카메라 권한 요청 함수 (Android만)
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: '카메라 권한',
          message: 'QR 코드를 스캔하려면 카메라 접근 권한이 필요합니다.',
          buttonNeutral: '나중에',
          buttonNegative: '취소',
          buttonPositive: '확인',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    // 컴포넌트가 마운트될 때 권한 요청
    const checkPermissions = async () => {
      const hasPermission = await requestCameraPermission();
      setHasCameraPermission(hasPermission);
      if (hasPermission) {
        setScanning(true);
      }
    };

    checkPermissions();
  }, []);

  useFocusEffect(
    useCallback(() => {
      // 화면에 포커스가 올 때 스캐닝을 활성화
      if (hasCameraPermission) {
        setScanning(true);
      }

      return () => {
        setScanning(false); // 화면을 떠날 때 스캐닝 비활성화
      };
    }, [hasCameraPermission])
  );

  const onSuccess = (event) => {
    if (scanning) { // 스캐닝 중일 때만 처리
      setScanning(false); // 스캐닝 중지
      const data = event.nativeEvent.codeStringValue;
      setQrData(data);
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setScanning(true); // 모달을 닫으면 다시 스캐닝 활성화
  };

  const handleNavigate = () => {
    setIsModalVisible(false);
    navigation.navigate(stackNavigations.PAYMENT, { qrData });
  };

  return (
    <View style={styles.container}>
      {!isModalVisible && scanning && hasCameraPermission && (
        <CameraScreen
          scanBarcode={true}
          onReadCode={onSuccess} 
          showFrame={false} 
          frameColor={colors.WHITE} 
        />
      )}
      <View style={styles.overlay}>
        <View style={styles.squareFrame} />
      </View>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>결제하시겠습니까?</Text>
            <View style={styles.buttonRow}>
              <CustomButton
                label="닫기"
                onPress={handleCloseModal}
                style={styles.smallButton}
              />
              <CustomButton
                label="결제하기"
                onPress={handleNavigate}
                style={styles.smallButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
    width: 250,
    height: 250,
    borderWidth: 2,
    borderColor: colors.WHITE,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: colors.WHITE,
    borderRadius: 10,
    alignItems: 'center',
  },
  smallButton: {
    paddingVertical: 8, 
    paddingHorizontal: 20,
    marginLeft: 10,
    backgroundColor: colors.BLUE_250,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 20,
  },  
});

export default QRCodeScannerScreen;
