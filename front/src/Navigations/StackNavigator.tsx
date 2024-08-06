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
import useAuth from '../hooks/queries/useAuth';
import MyInfo from '../components/MyInfo';
import Login from '../components/Login';
import ChangePassword from '../components/ChangePassword';
import ServiceCenter from '../components/ServiceCenter';
import ServiceInformation from '../components/ServiceInformation';
import MyCard from '../components/MyCard';
import Payment from '../components/Payment';

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
  [stackNavigations.MYINFO]: undefined;
  [stackNavigations.CHANGE_PASSWORD]: undefined;
  [stackNavigations.SERVICE_CENTER]: undefined;
  [stackNavigations.SERVICE_INFORMATION]: undefined;
  [stackNavigations.MYCARD]: undefined;
  [stackNavigations.PAYMENT]: undefined;
};

function StackNavigator() {
  const {isLogin} = useAuth();
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        cardStyle: { backgroundColor: 'white' },
        headerStyle: { 
          backgroundColor: 'white', 
          shadowColor: 'gray',
        },
        // headerTitle: () => (
        //   <Image
        //     source={logo}
        //     style={{ width: 100, height: 40 }}
        //     resizeMode="contain"
        //   />
        // ),
        headerTitleAlign: 'center',
        headerRight: () => (
          isLogin && <TouchableOpacity onPress={() => { /* 알림 모달을 여는 로직을 여기에 추가 */ }}>
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
        name={stackNavigations.LOGIN}
        component={Login}
      />
      <Stack.Screen
        name={stackNavigations.SIGNUP}
        component={Signup}
      />
      <Stack.Screen
        name={stackNavigations.FEED}
        component={Feed}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={stackNavigations.ACCOUNTBOOK}
        component={AccountBook}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={stackNavigations.QRCODESCANNERSCREEN}
        component={QRCodeScannerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={stackNavigations.MAPSCREEN}
        component={MapScreen}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name={stackNavigations.MYINFO}
        component={MyInfo}
      />
      <Stack.Screen
        name={stackNavigations.CHANGE_PASSWORD}
        component={ChangePassword}
      />
      <Stack.Screen
        name={stackNavigations.SERVICE_CENTER}
        component={ServiceCenter}
      />
      <Stack.Screen
        name={stackNavigations.SERVICE_INFORMATION}
        component={ServiceInformation}
      />
      <Stack.Screen
        name={stackNavigations.MYCARD}
        component={MyCard}
      />
      <Stack.Screen
        name={stackNavigations.PAYMENT}
        component={Payment}
      />
    </Stack.Navigator>
  );
}

export default StackNavigator;
