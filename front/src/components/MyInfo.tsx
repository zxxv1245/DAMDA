import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Pressable,Image, TouchableOpacity } from 'react-native';
import { colors } from '../constants/color';
import useAuth from '../hooks/queries/useAuth';
import { deleteAccount, getUserInfo, saveProfileImage } from '../api/auth';
import { useNavigation } from '@react-navigation/native';
import { stackNavigations } from '../constants';
import { removeEncryptStorage } from '../utils';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';

function MyInfo() {
  const { isLogin } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [nickname, setnickname] = useState<string | null>(null);
  const [phoneNumber, setphoneNumber] = useState<string | null>(null);
  const [profileImg, setProfileImg] = useState<any | null>(null); 
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setUsername(userInfo.data.username);
        setEmail(userInfo.data.email);
        setBirthDate(userInfo.data.birthDate);
        setnickname(userInfo.data.nickname);
        setphoneNumber(userInfo.data.phoneNumber);
        setProfileImg(userInfo.data.profileImg);
      } catch (error) {
      }
    };

    if (isLogin) {
      fetchUserInfo();
    }
  }, [isLogin]);

  const handleDeleteAccount = async() => {
    await deleteAccount();
    await removeEncryptStorage('accessToken');
    await removeEncryptStorage('refreshToken');
    navigation.reset({
      index: 0,
      routes: [{ name: stackNavigations.MAIN }],
    });
  }

  const handleProfileImg = async () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, async (response) => {
      const image = response.assets[0];
      await saveProfileImage(image);
      navigation.replace(stackNavigations.MYINFO);
    });
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleProfileImg} style = {styles.TouchContainer}>
        {profileImg ? 
          <Image source={{uri : profileImg}} style = {styles.profileImg}/> :
          <Icon name="person-circle-outline" size={100} color={colors.GRAY_500}/>
          }
        <Text style = {styles.profileUpdateText}>사진첩에서 사진 선택</Text>
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.label}>이메일</Text>
        <Text style={styles.value}>{email}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>이름</Text>
        <Text style={styles.value}>{username}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>닉네임</Text>
        <Text style={styles.value}>{nickname}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>핸드폰 번호</Text>
        <Text style={styles.value}>{phoneNumber}</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.label}>생년월일</Text>
        <Text style={styles.value}>{birthDate}</Text>
      </View>
      <Pressable style={[styles.passwordForm, styles.pressableContainer]} onPress={() => navigation.navigate(stackNavigations.MYINFO_UPDATE)}>
        <Text style={styles.pressableText}>회원정보 수정</Text> 
      </Pressable>
      <Pressable style={[styles.passwordForm, styles.pressableContainer]} onPress={() => navigation.navigate(stackNavigations.CHANGE_PASSWORD)}>
        <Text style={styles.pressableText}>비밀번호 변경</Text>
      </Pressable>
      <Pressable style={[styles.passwordForm, styles.pressableContainer]} onPress={handleDeleteAccount}>
        <Text style={styles.pressableText}>회원 탈퇴</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  textContainer : {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
    padding: 16,
    backgroundColor: colors.WHITE,
    borderWidth: 1,
    borderRadius: 20,
  },
  label : {
    fontSize: 16,
    fontWeight: '600',
    color: colors.BLACK,
  },
  value : {
    fontSize: 16,
    fontWeight: '400',
    color: colors.GRAY_700,
  },
  passwordForm : {
    backgroundColor : colors.BLUE_250,
  },
  pressableContainer : {
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  pressableText : {
    fontSize: 16,
    fontWeight: '700',
    color: colors.BLACK,
  },
  profileImg : {
    width : 100,
    height : 100,
    borderRadius : 50,
  },
  TouchContainer : {
    marginBottom : 20,
  },
  profileUpdateText : {
    color : colors.BLUE_500,
    marginTop : 10,
  }
});

export default MyInfo;
