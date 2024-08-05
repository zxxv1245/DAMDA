// TabNavigator.tsx
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Image, TouchableOpacity, View, Modal, Text, StyleSheet } from 'react-native';
import FeedStackNavigator from './FeedStackNavigator'; 
import AccountBook from '../components/AccountBook';
import QRCodeScannerScreen from '../components/QRCodeScannerScreen';
import MyPage from '../components/MyPage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/color'; 
import NotificationsModal from '../components/NotificationsModal'; 
import useAuth from '../hooks/queries/useAuth';

// 이미지 파일 경로를 설정합니다.
const logo = require('../assets/logo.png');

const Tab = createBottomTabNavigator();

function TabNavigator() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const {isLogin} = useAuth();
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          cardStyle: { backgroundColor: 'white' },
          headerStyle: { 
            backgroundColor: 'white', 
            shadowColor: 'gray' 
          },
          headerTitle: () => (
            <Image
              source={logo}
              style={{ width: 100, height: 40 }} 
              resizeMode="contain"
            />
          ),
          headerTitleAlign: 'flex-start',
          headerRight: () => (
            isLogin && <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="notifications-outline" size={25} color={colors.BLACK} style={{ marginRight: 15 }} />
            </TouchableOpacity>
          ),
          tabBarShowLabel: false, // 라벨 숨기기
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'FeedStack') {
              iconName = 'home-outline';
            } else if (route.name === 'QR결제') {
              iconName = 'qr-code-outline';
            } else if (route.name === '가계부') {
              iconName = 'calendar-clear-outline';
            } else if (route.name === '마이페이지') {
              iconName = 'person-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.BLUE_300,
          tabBarInactiveTintColor: colors.GRAY_300,
          tabBarStyle: {
            height: 70, 
            display: 'flex',
          },
          tabBarItemStyle: {
            paddingVertical: 10, // 탭 아이템의 상하 패딩을 조정합니다.
            marginHorizontal: 15, // 탭 아이템의 좌우 마진을 조정합니다.
          },
        })}
      >
        <Tab.Screen name="FeedStack" component={FeedStackNavigator} />
        <Tab.Screen name="QR결제" component={QRCodeScannerScreen} />
        <Tab.Screen name="가계부" component={AccountBook} />
        <Tab.Screen name="마이페이지" component={MyPage} />
      </Tab.Navigator>

      {/* 알림 모달 */}
      <NotificationsModal 
        modalVisible={modalVisible} 
        setModalVisible={setModalVisible} 
      />
    </>
  );
}

export default TabNavigator;
