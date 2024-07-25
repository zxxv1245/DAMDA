import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { stackNavigations } from '../constants';
import Feed from '../components/Feed';
import AccountBook from '../components/AccountBook';
import QRCodeScannerScreen from '../components/QRCodeScannerScreen';

export type MainStackParamList = {
  [stackNavigations.FEED]: undefined;
  [stackNavigations.ACCOUNTBOOK]: undefined;
  [stackNavigations.QRCODESCANNERSCREEN]: undefined; // QR 스캔 페이지 타입 추가
};

function MainStackNavigator() {
  const Stack = createStackNavigator<MainStackParamList>();

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
        name={stackNavigations.FEED}
        component={Feed}
        options={{ headerTitle: '피드' }}
      />
      <Stack.Screen
        name={stackNavigations.ACCOUNTBOOK}
        component={AccountBook}
        options={{ headerTitle: '가계부' }}
      />
      <Stack.Screen
        name={stackNavigations.QRCODESCANNERSCREEN}
        component={QRCodeScannerScreen}
        options={{ headerTitle: 'QR 스캔' }}
      />
    </Stack.Navigator>
  );
}

export default MainStackNavigator;
