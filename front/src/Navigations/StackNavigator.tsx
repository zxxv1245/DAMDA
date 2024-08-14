import * as React from 'react';
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
import ServiceInformation from '../components/ServiceInformation';
import MyCard from '../components/MyCard';
import Payment from '../components/Payment';
import MyInfoUpdate from '../components/MyInfoUpdate';
import NotificationsModal from '../components/NotificationsModal';
import KakaoLogin from '../components/KakaoLogin';
import NaverLogin from '../components/NaverLogin';
import Quiz from '../components/Quiz';
import Announcement from '../components/Announcement';
import MyQnA from '../components/MyQnA';
import CommonQuestion from '../components/CommonQuestion';

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
  [stackNavigations.SERVICE_INFORMATION]: undefined;
  [stackNavigations.MYCARD]: undefined;
  [stackNavigations.PAYMENT]: undefined;
  [stackNavigations.KAKAO_LOGIN]: undefined;
  [stackNavigations.MYINFO_UPDATE]: undefined;
  [stackNavigations.NAVER_LOGIN]: undefined;
  [stackNavigations.QUIZ]: undefined;
  [stackNavigations.ANNOUNCEMENT]: undefined;
  [stackNavigations.MYQNA]: undefined;
  [stackNavigations.COMMONQUESTION]: undefined;
  
};

function StackNavigator() {
  const { isLogin } = useAuth();
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <>
      <Stack.Navigator
        screenOptions={({ navigation }) => ({
          cardStyle: { backgroundColor: 'white' },
          headerStyle: { 
            backgroundColor: 'white', 
            shadowColor: 'gray',
          },
          headerTitleAlign: 'center',
          headerRight: () => (
            isLogin && <TouchableOpacity onPress={() => { setModalVisible(true) }}>
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
        <Stack.Screen
          name={stackNavigations.MYINFO_UPDATE}
          component={MyInfoUpdate}
        />
        <Stack.Screen
          name={stackNavigations.KAKAO_LOGIN}
          component={KakaoLogin}
        />
        <Stack.Screen
          name={stackNavigations.NAVER_LOGIN}
          component={NaverLogin}
        />
        <Stack.Screen
          name={stackNavigations.QUIZ}
          component={Quiz}
        />
        <Stack.Screen
          name={stackNavigations.ANNOUNCEMENT}
          component={Announcement}
        />
        <Stack.Screen
          name={stackNavigations.MYQNA}
          component={MyQnA}
        />
        <Stack.Screen
          name={stackNavigations.COMMONQUESTION}
          component={CommonQuestion}
        />
      </Stack.Navigator>

      {/* 알림 모달 */}
      {modalVisible && (
        <NotificationsModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </>
  );
}

export default StackNavigator;
