import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import useAuth from '../hooks/queries/useAuth';
import Icon from 'react-native-vector-icons/Ionicons';
import { removeEncryptedStorage } from '../utils/encryptStorage';
import { stackNavigations } from '../constants';
import { colors } from '../constants/color';

function MyPage() {
  const { isLogin, logout } = useAuth();
  const navigation = useNavigation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleLogout = async () => {
    await removeEncryptedStorage('accessToken');
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: 'FeedStack' }],
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

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        <Icon name="person-circle-outline" size={80} color={colors.GRAY_500} style={styles.profileIcon} />
        <View style={styles.profileTextContainer}>
          {isLogin ? (
            <>
              <Text style={styles.username}>사용자 이름</Text>
              <TouchableOpacity style={styles.authButton} onPress={handleLogout}>
                <Icon name="log-out-outline" size={14} color={colors.BLACK} style={styles.authButtonIcon} />
                <Text style={styles.authButtonText}>로그아웃</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.loginPrompt}>로그인하고 시작하기</Text>
              <TouchableOpacity style={styles.authButton} onPress={() => navigation.navigate(stackNavigations.AUTH_HOME)}>
                <Icon name="log-in-outline" size={14} color={colors.BLACK} style={styles.authButtonIcon} />
                <Text style={styles.authButtonText}>로그인</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.menuContainer}>
        <View style={styles.rowMenu}>
          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Icon name="wallet-outline" size={24} color="#000" />
            <Text style={styles.menuText}>나의 지갑</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Icon name="information-circle-outline" size={24} color="#000" />
            <Text style={styles.menuText}>서비스 안내</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.menuItem} onPress={() => {}}>
            <Icon name="headset-outline" size={24} color="#000" />
            <Text style={styles.menuText}>고객 센터</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.verticalMenu}>
          <TouchableOpacity style={styles.verticalMenuItem} onPress={toggleDarkMode}>
            <View style={styles.verticalMenuTextContainer}>
              <Icon name="moon-outline" size={20} color="#000" style={styles.verticalMenuIcon} />
              <Text style={styles.verticalMenuText}>다크 모드</Text>
            </View>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.verticalMenuItem} onPress={toggleNotification}>
            <View style={styles.verticalMenuTextContainer}>
              <Icon name="notifications-outline" size={20} color="#000" style={styles.verticalMenuIcon} />
              <Text style={styles.verticalMenuText}>알림 설정</Text>
            </View>
            <Switch value={isNotificationEnabled} onValueChange={toggleNotification} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.verticalMenuItem} onPress={() => {}}>
            <View style={styles.verticalMenuTextContainer}>
              <Icon name="person-outline" size={20} color="#000" style={styles.verticalMenuIcon} />
              <Text style={styles.verticalMenuText}>나의 정보</Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.verticalMenuItem} onPress={handleSprayPress}>
            <View style={styles.verticalMenuTextContainer}>
              <Icon name="information-circle-outline" size={20} color="#000" style={styles.verticalMenuIcon} />
              <Text style={styles.verticalMenuText}>스프레이</Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color="#000" />
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
            <Icon name="close" size={30} color="#fff" />
          </TouchableOpacity>
          <Image source={require('../assets/spray.png')} style={styles.modalImage} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  loginPrompt: {
    fontSize: 18,
    color: '#000',
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
    backgroundColor: '#ddd',
  },
  menuItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  menuText: {
    marginTop: 10,
    fontSize: 14,
    color: '#000',
  },
  verticalMenu: {
    backgroundColor: colors.GRAY_200,
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
    borderBottomColor: '#ddd',
  },
  verticalMenuTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalMenuText: {
    fontSize: 16,
    color: '#000',
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
