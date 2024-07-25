import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet } from 'react-native';
import AuthHome from '../components/AuthHome';
import Signup from '../components/Signup';
import Feed from '../components/Feed';
import Article from '../components/Article';
import { stackNavigations } from '../constants';
import AccountBook from '../components/AccountBook';
import QRCodeScannerScreen from '../components/QRCodeScannerScreen';

export type StackParamList = {
  [stackNavigations.AUTH_HOME]: undefined;
  [stackNavigations.LOGIN]: undefined;
  [stackNavigations.SIGNUP]: undefined;
  [stackNavigations.FEED]: undefined;
  [stackNavigations.ARTICLE]: undefined;
  [stackNavigations.ACCOUNTBOOK]: undefined;
  QRCodeScannerScreen: undefined; // QR 코드 스캐너 화면 추가
};

function StackNavigator() {
  const Stack = createStackNavigator<StackParamList>();

  return (
    <Stack.Navigator
      screenOptions={{
        cardStyle: { backgroundColor: 'white' },
        headerStyle: { backgroundColor: 'white', shadowColor: 'gray' },
        headerTitleStyle: { fontSize: 20, fontWeight: 'bold' },
        headerTitleAlign: 'center',
        headerTintColor: 'gray',
      }}
    >
      <Stack.Screen
        name={stackNavigations.AUTH_HOME}
        component={AuthHome}
        options={{ headerTitle: '담다' }}
      />
      <Stack.Screen
        name={stackNavigations.SIGNUP}
        component={Signup}
        options={{ headerTitle: '회원가입' }}
      />
      <Stack.Screen
        name={stackNavigations.FEED}
        component={Feed}
        options={{ headerTitle: '피드' }}
      />
      <Stack.Screen
        name={stackNavigations.ARTICLE}
        component={Article}
        options={{ headerTitle: '기사' }}
      />
      <Stack.Screen
        name={stackNavigations.ACCOUNTBOOK}
        component={AccountBook}
        options={{ headerTitle: '가계부' }}
      />
      <Stack.Screen
        name="QRCodeScannerScreen"
        component={QRCodeScannerScreen}
        options={{ headerTitle: 'QR 코드 스캔' }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});

export default StackNavigator;
