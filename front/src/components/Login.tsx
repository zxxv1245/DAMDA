import React from 'react';
import { StyleSheet, View, Image, Pressable, Text } from 'react-native';
import CustomButton from './CustomButton';
import { stackNavigations } from '../constants';
import { StackParamList } from '../Navigations/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import { colors } from '../constants/color';

// 이미지 파일 경로를 설정합니다.
const LoginLogo = require('../assets/loginLogo.png');

// StackScreenProps를 사용하여 props 타입을 정의합니다.
type LoginProps = StackScreenProps<StackParamList, 'Login'>;

function Login({ navigation }: LoginProps) {
  return (
    <View style={styles.container}>
      <Image source={LoginLogo} style={styles.loginLogo} />
      <Pressable style={[styles.kakaoLogin, styles.pressableContainer]} onPress={() => {}}>
        <Text style={styles.pressableText}>카카오로 로그인</Text>
      </Pressable>
      <Pressable style={[styles.naverLogin, styles.pressableContainer]} onPress={() => {}}>
        <Text style={styles.pressableText}>네이버로 로그인</Text>
      </Pressable>
      <CustomButton
        label="이메일로 로그인"
        variant="filled"
        onPress={() => navigation.navigate(stackNavigations.AUTH_HOME)}
      />
      <CustomButton
        label="회원가입"
        variant="outlined"
        onPress={() => navigation.navigate(stackNavigations.SIGNUP)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressableContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
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
    width: 150, // 로고의 가로 크기 조정
    height: 150, // 로고의 세로 크기 조정
    marginBottom: 70, // 로고와 버튼 사이의 간격 조정
  },
});

export default Login;
