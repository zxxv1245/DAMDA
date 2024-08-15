import React from 'react';
import { StyleSheet, View, Image, Pressable, Text } from 'react-native';
import { stackNavigations } from '../constants';
import { StackParamList } from '../Navigations/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { colors } from '../constants/color';

const LoginLogo = require('../assets/loginLogo.png');
const KakaoLogo = require('../assets/kakao_logo.png');
const NaverLogo = require('../assets/naver_logo.png');

type LoginProps = StackScreenProps<StackParamList, 'Login'>;

function Login({ navigation }: LoginProps) {
  return (
    <View style={styles.container}>
      <Image source={LoginLogo} style={styles.loginLogo} />
      <Pressable style={[styles.kakaoLogin, styles.pressableContainer]} onPress={() => {navigation.navigate(stackNavigations.KAKAO_LOGIN)}}>
        <Image source={KakaoLogo} style = {styles.kakaoLogo}/>
        <Text style={styles.pressableText}>카카오 로그인</Text>
      </Pressable>
      <Pressable style={[styles.naverLogin, styles.pressableContainer]} onPress={() => {navigation.navigate(stackNavigations.NAVER_LOGIN)}}>
        <Image source={NaverLogo} style = {styles.naverLogo}/>
        <Text style={styles.pressableText}>네이버 로그인</Text>
      </Pressable>
      <View style={styles.forgotContainer}>
          <Text onPress={() => navigation.navigate(stackNavigations.AUTH_HOME)}>로그인</Text>
          <Text style={styles.separator}> | </Text>
          <Text onPress={() => navigation.navigate(stackNavigations.SIGNUP)}>회원 가입</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom : 100
  },
  pressableContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%',
  },
  pressableText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.BLACK,
  },
  naverLogin: {
    backgroundColor: colors.NAVER,
  },
  kakaoLogin: {
    backgroundColor: colors.KAKAO,
  },
  loginLogo: {
    width: 150,
    height: 150,
    marginBottom: 70,
  },
  googleLogin : {
    borderColor : colors.BLACK,
    borderWidth : 1,
  },
  forgotContainer : {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop : 50,
  },
  separator : {
    marginHorizontal: 40,
  },
  kakaoLogo: {
    width: 24, 
    height: 24, 
    marginRight: 10, 
    resizeMode: 'contain',
  },
  naverLogo : {
    width: 24, 
    height: 24, 
    marginRight: 10, 
    resizeMode: 'contain',
  },
});

export default Login;
