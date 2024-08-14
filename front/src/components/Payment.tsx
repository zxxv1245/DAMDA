import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Dimensions, Modal, Pressable, Image } from 'react-native';
import CustomButton from './CustomButton';
import { colors } from '../constants/color';
import { stackNavigations } from '../constants';
import { useNavigation } from '@react-navigation/native';
import { savePurchases } from '../api/purchaseApi';
import { getUserInfo } from '../api/auth';

interface PaymentProps {
  route: any;
}

const jjanggo = require('../assets/jjanggo.png');

function Payment({ route }: PaymentProps) {
  const [isAdult, setIsAdult] = useState<boolean | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // const qrData= '진로,1,1500,카스,1,2430,칠성 사이다,1,770,파워에이드,3,3510,'
  const { qrData } = route.params;
  const cleanedQrData = qrData.replace(/,$/, '');
  const arrQrData = cleanedQrData.split(',');
  const navigation = useNavigation();

  const chunkArray = (array, size) => {
    const chunkedArr = [];
    for (let i = 0; i < array.length; i += size) {
      chunkedArr.push(array.slice(i, i + size));
    }
    return chunkedArr;
  };

  const items = chunkArray(arrQrData, 3);

  const purchaseProduct = items.map(item => ({
    productName: item[0],
    count: parseInt(item[1], 10),
    totalPrice: parseInt(item[2], 10)
  }));

  const totalPrice = purchaseProduct.reduce((acc, item) => acc + item.totalPrice, 0);

  const handleSubmit = async () => {
    try {
      const userInfo = await getUserInfo();
      if (userInfo.data.isAdult) {
        await savePurchases({ purchaseProduct, totalPrice });
        navigation.reset({
          index: 0,
          routes: [{ name: stackNavigations.MAIN }],
        });
      } else {
        setModalVisible(true);
      }
    } catch (error) {
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.contextContainer}>
          <Text style={styles.headerText}>상품명</Text>
          <Text style={styles.separator}> | </Text>
          <Text style={styles.headerText}>수량</Text>
          <Text style={styles.separator}> | </Text>
          <Text style={styles.headerText}>금액</Text>
        </View>
        {items.map((item, index) => (
          <View key={index} style={styles.verticalMenuItem}>
            <Text style={styles.itemText}>{item[0]}</Text>
            <Text style={styles.itemText}>{item[1]}개</Text>
            <Text style={styles.itemText}>{item[2]}원</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceLabel}>총 가격:</Text>
        <Text style={styles.totalPriceValue}>{totalPrice.toLocaleString()}원</Text>
      </View>

      <View style={styles.buttonContainer}>
        <CustomButton
          style={styles.paymentButton}
          label="결제하기"
          onPress={handleSubmit}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Image source={jjanggo} style={styles.jjanggo} />
            <Text style={styles.modalText}>성인 용품이 포함 되어 있습니다!</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>확인</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    marginHorizontal: 10,
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
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_400,
  },
  itemText: {
    flex: 1,
    textAlign: 'center',
    color: colors.BLACK,
  },
  headerText: {
    flex: 1,
    textAlign: 'center',
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  totalPriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  totalPriceLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  totalPriceValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.RED_500,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: colors.BLUE_250,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
    textAlign: 'center',
    color: colors.RED_500,
  },
});

export default Payment;
