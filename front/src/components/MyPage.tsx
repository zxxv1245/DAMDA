// MyPage.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/queries/useAuth';
import Icon from 'react-native-vector-icons/Ionicons';
import { stackNavigations } from '../constants';
import { colors } from '../constants/color';
import { getUserInfo } from '../api/auth';

function MyPage() {
  const { isLogin, logout } = useAuth();
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null); // State for nickname

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setNickname(userInfo.data.nickname);
      } catch (error) {
      }
    };

    if (isLogin) {
      fetchUserInfo();
    }
  }, [isLogin]);

  const handleLogout = async () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: stackNavigations.MAIN }],
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(previousState => !previousState);
  };

  const toggleNotification = () => {
    setIsNotificationEnabled(previousState => !previousState);
  };

  const handleSprayPress = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleMyInfoPress = () => {
    navigation.navigate(stackNavigations.MYINFO);
  };
  const handleServiceCenterPress = () => {
    navigation.navigate(stackNavigations.SERVICE_CENTER);
  };
  const handleServiceInformationPress = () => {
    navigation.navigate(stackNavigations.SERVICE_INFORMATION);
  };
  const handleMyCardPress = () => {
    navigation.navigate(stackNavigations.MYCARD);
  };
  const handlePaymentPress = () => {
    navigation.navigate(stackNavigations.PAYMENT);
  };
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Icon name="person-circle-outline" size={80} color={colors.GRAY_500} style={styles.profileIcon} />
        <View style={styles.profileTextContainer}>
          {isLogin ? (
            <>
              <Text style={styles.nickname}>{nickname || '로그인을 해주세요'}</Text>
              <TouchableOpacity style={styles.authButton} onPress={handleLogout}>
                <Icon name="log-out-outline" size={14} color={colors.BLACK} style={styles.authButtonIcon} />
                <Text style={styles.authButtonText}>로그아웃</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.loginPrompt}>로그인하고 시작하기</Text>
              <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate(stackNavigations.LOGIN)}>
                <Icon name="log-in-outline" size={14} color={colors.BLACK} style={styles.authButtonIcon} />
                <Text style={styles.authButtonText}>로그인</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.menuContainer}>
        <View style={styles.rowMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={handleMyCardPress}>
            <Icon name="wallet-outline" size={24} color={colors.BLUE_300} />
            <Text style={styles.menuText}>나의 지갑</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.menuItem} onPress={handleServiceInformationPress}>
            <Icon name="phone-portrait" size={24} color={colors.BLUE_300} />
            <Text style={styles.menuText}>서비스 안내</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.menuItem} onPress={handleServiceCenterPress}>
            <Icon name="headset-outline" size={24} color={colors.BLUE_300} />
            <Text style={styles.menuText}>고객 센터</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.verticalMenu}>
          <TouchableOpacity style={styles.verticalMenuItem} onPress={toggleDarkMode}>
            <View style={styles.verticalMenuTextContainer}>
              <Icon name="moon-outline" size={20} color={colors.BLACK} style={styles.verticalMenuIcon} />
              <Text style={styles.verticalMenuText}>다크 모드</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: colors.GRAY_300, true: colors.BLUE_300 }}
              thumbColor={isDarkMode ? colors.BLUE_300 : '#f4f3f4'}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.verticalMenuItem} onPress={toggleNotification}>
            <View style={styles.verticalMenuTextContainer}>
              <Icon name="notifications-outline" size={20} color={colors.BLACK} style={styles.verticalMenuIcon} />
              <Text style={styles.verticalMenuText}>알림 설정</Text>
            </View>
            <Switch
              value={isNotificationEnabled}
              onValueChange={toggleNotification}
              trackColor={{ false: colors.GRAY_200, true: colors.BLUE_300 }}
              thumbColor={isNotificationEnabled ? colors.BLUE_300 : colors.GRAY_450}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.verticalMenuItem} onPress={handleMyInfoPress}>
            <View style={styles.verticalMenuTextContainer}>
              <Icon name="person-outline" size={20} color={colors.BLACK} style={styles.verticalMenuIcon} />
              <Text style={styles.verticalMenuText}>나의 정보</Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color={colors.BLACK} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.verticalMenuItem} onPress={handleSprayPress}>
            <View style={styles.verticalMenuTextContainer}>
              <Icon name="information-circle-outline" size={20} color={colors.BLACK} style={styles.verticalMenuIcon} />
              <Text style={styles.verticalMenuText}>스프레이</Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color={colors.BLACK} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 모달 컴포넌트 추가 */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalCloseButton} onPress={closeModal}>
            <Icon name="close" size={30} color={colors.WHITE} />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: colors.WHITE,
    marginBottom: 20,
  },
  profileIcon: {
    marginRight: 20,
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nickname: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  loginPrompt: {
    fontSize: 18,
    color: colors.BLACK,
  },
  authButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.GRAY_200,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  authButtonText: {
    color: colors.BLACK,
    fontSize: 12,
    marginLeft: 5,
  },
  authButtonIcon: {
    marginRight: 5,
  },
  menuContainer: {
    paddingHorizontal: 20,
  },
  rowMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.GRAY_200,
    borderRadius: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  separator: {
    width: 1,
    backgroundColor: colors.GRAY_250,
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    marginTop: 10,
    fontSize: 14,
    color: colors.BLACK,
  },
  verticalMenu: {
    borderRadius: 10,
    paddingVertical: 10,
  },
  verticalMenuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_400,
  },
  verticalMenuTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalMenuText: {
    fontSize: 16,
    color: colors.BLACK,
    marginLeft: 10,
  },
  verticalMenuIcon: {
    marginRight: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // 반투명 검은 배경
  },
  modalCloseButton: {
    position: 'absolute',
    top: 30,
    right: 30,
    zIndex: 1,
  },
  modalImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'contain',
  },
});

export default MyPage;
