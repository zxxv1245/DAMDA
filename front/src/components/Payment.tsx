import React from 'react';
import { StyleSheet, View, Text, SafeAreaView, Dimensions } from 'react-native';
import CustomButton from './CustomButton';
import { colors } from '../constants/color';

interface PaymentProps {
  route: any;
}

function Payment({ route }: PaymentProps) {
  const { qrData } = route.params;
  const arrQrData = qrData.split(',');
  // console.log(qrData)
  // console.log(arrQrData)
  const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  const items = chunkArray(arrQrData, 3);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.contextContainer}>
          <Text>상품명</Text>
          <Text style={styles.separator}> | </Text>
          <Text>수량</Text>
          <Text style={styles.separator}> | </Text>
          <Text>금액</Text>
        </View>
        {items.map((item, index) => (
          <View key={index} style={styles.verticalMenuItem}>
            <Text>{item[0]}</Text>
            <Text>{item[1]}개</Text>
            <Text>{item[2]}원</Text>
          </View>
        ))}
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton
          style={styles.paymentButton}
          label="결제하기"
        />
      </View>
    </SafeAreaView>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  content: {
    flex: 1,
  },
  contextContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_400,
  },
  separator: {
    marginHorizontal: 50,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    paddingBottom: height * 0.02,
  },
  paymentButton: {
    width: '100%',
    alignSelf: 'center',
  },
  verticalMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_400,
  },
});

export default Payment;
