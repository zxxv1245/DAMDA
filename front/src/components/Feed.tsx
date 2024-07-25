import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../constants/color';
import { stackNavigations } from '../constants';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParamList } from '../Navigations/StackNavigator';

type FeedProps = StackScreenProps<
  StackParamList,
  typeof stackNavigations.FEED
>;

function Feed({ navigation }: FeedProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>USERNAME</Text>
      <View style={styles.content}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.largeButton]}
            onPress={() => navigation.navigate(stackNavigations.ACCOUNTBOOK)}
          >
            <Text style={styles.buttonText}>가계부</Text>
            <Text style={styles.buttonText}>확인하기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.largeButton]}
            onPress={() => navigation.navigate('QRCodeScannerScreen')} // QR 코드 스캐너로 이동
          >
            <Text style={styles.buttonText}>QR 스캔하고</Text>
            <Text style={styles.buttonText}>결제하기</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>서비스 안내</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerButton}>
          <Text style={styles.footerButtonText}>고객센터</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginVertical: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    width: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: colors.PINK_500,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
  },
  largeButton: {
    height: 120,
  },
  buttonText: {
    fontSize: 16,
    color: colors.WHITE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: colors.GRAY_200,
    width: '100%',
  },
  footerButton: {
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 16,
    color: colors.BLACK,
  },
});

export default Feed;
