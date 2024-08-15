import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Modal, Dimensions, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import useAuth from '../hooks/queries/useAuth';
import Icon from 'react-native-vector-icons/Ionicons';
import { stackNavigations } from '../constants';
import { colors } from '../constants/color';
import { getUserInfo } from '../api/auth';

function MyPage() {
  const { isLogin, logout } = useAuth();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [nickname, setNickname] = useState<string | null>(null);
  const [profileImg, setProfileImg] = useState<any | null>(null); 

  const fetchUserInfo = async () => {
    const userInfo = await getUserInfo();
    setNickname(userInfo.data.nickname);
    setProfileImg(userInfo.data.profileImg);
  };

  useEffect(() => {
    if (isLogin && isFocused) {
      fetchUserInfo();
    }
  }, [isLogin, isFocused]);

  const handleLogout = async () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: stackNavigations.MAIN }],
    });
  };

  const handleAnnouncementPress = () => {
    navigation.navigate(stackNavigations.ANNOUNCEMENT);
  };

  const handleSprayPress = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const handleMyInfoPress = () => {
    if (isLogin) {
      navigation.navigate(stackNavigations.MYINFO);
    } else {
      navigation.navigate(stackNavigations.LOGIN);
    }
  };

  const handleQuizPress = () => {
    navigation.navigate(stackNavigations.QUIZ);
  };

  const handleServiceInformationPress = () => {
    navigation.navigate(stackNavigations.SERVICE_INFORMATION);
  };

  const handleMyCardPress = () => {
    if (isLogin) {
      navigation.navigate(stackNavigations.MYCARD);
    } else {
      navigation.navigate(stackNavigations.LOGIN);
    }
  };

  const handleAllProductPress = () => {
    navigation.navigate(stackNavigations.ALLPRODUCT);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {profileImg ? 
        <Image source={{uri : profileImg}} style = {styles.profileImg}/> :
        <Icon name="person-circle-outline" size={80} color={colors.GRAY_500} style={styles.profileIcon} />
        }
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
          <TouchableOpacity style={styles.menuItem} onPress={handleQuizPress}>
            <Icon name="help" size={24} color={colors.BLUE_300} />
            <Text style={styles.menuText}>퀴즈</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.verticalMenu}>
          <TouchableOpacity style={styles.verticalMenuItem} onPress={handleAnnouncementPress}>
            <View style={styles.verticalMenuTextContainer}>
              <Icon name="notifications-outline" size={20} color={colors.BLACK} style={styles.verticalMenuIcon} />
              <Text style={styles.verticalMenuText}>공지사항</Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color={colors.BLACK} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.verticalMenuItem} onPress={handleMyInfoPress}>
            <View style={styles.verticalMenuTextContainer}>
              <Icon name="person-outline" size={20} color={colors.BLACK} style={styles.verticalMenuIcon} />
              <Text style={styles.verticalMenuText}>나의 정보</Text>
            </View>
            <Icon name="chevron-forward-outline" size={20} color={colors.BLACK} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.verticalMenuItem} onPress={handleAllProductPress}>
            <View style={styles.verticalMenuTextContainer}>
              <Icon name="basket-outline" size={20} color={colors.BLACK} style={styles.verticalMenuIcon} />
              <Text style={styles.verticalMenuText}>물품 목록</Text>
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
          <Image source={require('../assets/spray.png')} style={styles.modalImage} />
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
  profileImg : {
    width : 80,
    height : 80,
    borderRadius : 50,
  },
  profileTextContainer: {
    flex: 1,
    justifyContent: 'center',
    marginLeft : 15,
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
