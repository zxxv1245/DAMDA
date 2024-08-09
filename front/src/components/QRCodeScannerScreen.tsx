import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text, Modal } from 'react-native';
import { CameraScreen } from 'react-native-camera-kit';
import { colors } from '../constants/color';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { stackNavigations } from '../constants';
import CustomButton from './CustomButton';

const QRCodeScannerScreen = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [qrData, setQrData] = useState('');
  const navigation = useNavigation();
  const [scanning, setScanning] = useState(true);

  useFocusEffect(
    useCallback(() => {
      // 화면에 포커스가 올 때 스캐닝을 활성화합니다
      setScanning(true);
      return () => {
        // 화면을 떠날 때 스캐닝을 비활성화합니다
        setScanning(false);
      };
    }, [])
  );


  const onSuccess = (event) => {
    const data = event.nativeEvent.codeStringValue;
    setQrData(data);
    setIsModalVisible(true);
    setScanning(false);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setScanning(true); 
  };

  const handleNavigate = () => {
    setIsModalVisible(false);
    navigation.navigate(stackNavigations.PAYMENT, {qrData})
  };

  return (
    <View style={styles.container}>
      {!isModalVisible && (
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
    width: 250, // 원하는 프레임의 너비
    height: 250, // 원하는 프레임의 높이
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
