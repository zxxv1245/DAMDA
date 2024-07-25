import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { colors } from '../constants/color';

const QRCodeScannerScreen = () => {
  // const onSuccess = (event) => {
  //   console.log(event.nativeEvent.codeStringValue); // QR 코드 데이터를 콘솔에 출력
  //   // event.nativeEvent.codeStringValue를 사용하여 원하는 작업을 수행할 수 있습니다.
  // };

  return (
    <View style={styles.container}>
      <Text>QR</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
});

export default QRCodeScannerScreen;
