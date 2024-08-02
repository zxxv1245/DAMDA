// StackNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Image, TouchableOpacity } from 'react-native';
import { stackNavigations } from '../constants';
import TabNavigator from './TabNavigator';
import AuthHome from '../components/AuthHome';
import Signup from '../components/Signup';
import Feed from '../components/Feed';
import AccountBook from '../components/AccountBook';
import QRCodeScannerScreen from '../components/QRCodeScannerScreen';
import MapScreen from '../components/MapScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

// 이미지 파일 경로를 설정합니다.
const logo = require('../assets/logo.png');

const Stack = createStackNavigator();

export type StackParamList = {
  [stackNavigations.MAIN]: undefined;
  [stackNavigations.AUTH_HOME]: undefined;
  [stackNavigations.LOGIN]: undefined;
  [stackNavigations.SIGNUP]: undefined;
  [stackNavigations.FEED]: undefined;
  [stackNavigations.ACCOUNTBOOK]: undefined;
  [stackNavigations.MAPSCREEN]: undefined;
  [stackNavigations.QRCODESCANNERSCREEN]: undefined;
};

function StackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        cardStyle: { backgroundColor: 'white' },
        headerStyle: { 
          backgroundColor: 'white', 
          shadowColor: 'gray',
        },
        headerTitle: () => (
          <Image
            source={logo}
            style={{ width: 100, height: 40 }} // 이미지 크기를 조정합니다.
            resizeMode="contain"
          />
        ),
        headerTitleAlign: 'center', // 제목을 중앙 정렬합니다.
        headerRight: () => (
          <TouchableOpacity onPress={() => { /* 알림 모달을 여는 로직을 여기에 추가 */ }}>
            <Ionicons name="notifications-outline" size={24} color="black" style={{ marginRight: 15 }} />
          </TouchableOpacity>
        ),
      })}
    >
      <Stack.Screen
        name={stackNavigations.MAIN}
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={stackNavigations.AUTH_HOME}
        component={AuthHome}
      />
      <Stack.Screen
        name={stackNavigations.SIGNUP}
        component={Signup}
      />
      <Stack.Screen
        name={stackNavigations.FEED}
        component={Feed}
      />
      <Stack.Screen
        name={stackNavigations.ACCOUNTBOOK}
        component={AccountBook}
      />
      <Stack.Screen
        name={stackNavigations.QRCODESCANNERSCREEN}
        component={QRCodeScannerScreen}
      />
      <Stack.Screen
        name={stackNavigations.MAPSCREEN}
        component={MapScreen}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
