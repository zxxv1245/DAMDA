import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import InputField from './InputField';
import CustomButton from './CustomButton';
import useFormLogin from '../hooks/useFormLogin';
import useAuth from '../hooks/queries/useAuth';
import { stackNavigations } from '../constants';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParamList } from '../Navigations/StackNavigator';

type AuthHomeProps = StackScreenProps<
  StackParamList,
  typeof stackNavigations.AUTH_HOME
>;

function AuthHome({ navigation }: AuthHomeProps) {
  const { values, touched, getTextInputProps } = useFormLogin({ initialValue: { email: '', password: '' } });
  const { loginMutation } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleSubmit = () => {
    console.log('Login attempt with values:', values); // 로그 추가
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        console.log('Login successful:', data);
        navigation.replace(stackNavigations.MAIN);
      },
      onError: (error) => {
        if (error.response?.status === 401) {
          console.error('Login error response data:', error.response?.data); // 에러 응답 데이터 로그 추가
          console.error('Login error response status:', error.response?.status); // 에러 응답 상태 로그 추가
          setIsModalVisible(true);
        } else {
          console.error('Login error:', error);
        }
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>로그인</Text>
        <InputField
          placeholder='이메일'
          error={values.email.trim() === '' ? '이메일을 입력하세요' : undefined}
          touched={touched.email}
          {...getTextInputProps('email')}
        />
        <InputField
          placeholder='비밀번호'
          error={values.password.trim() === '' ? '비밀번호를 입력하세요' : undefined}
          touched={touched.password}
          {...getTextInputProps('password')}
          secureTextEntry
        />
        <View style={styles.forgotContainer}>
          <Text>아이디 찾기</Text>
          <Text style={styles.separator}> | </Text>
          <Text>비밀번호 찾기</Text>
        </View>
        <CustomButton
          label="로그인"
          variant='filled'
          onPress={handleSubmit}
        />
        <CustomButton
          label="회원가입"
          variant='outlined'
          onPress={() => navigation.navigate(stackNavigations.SIGNUP)}
        />
      </View>
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>아이디 또는 비밀번호를 확인해주세요</Text>
            <TouchableOpacity onPress={() => setIsModalVisible(false)}>
              <Text style={styles.closeButton}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  forgotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  separator: {
    marginHorizontal: 50,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 10,
    width: width * 0.8,
    maxWidth: 400,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    fontSize: 18,
    color: 'blue',
  },
});

export default AuthHome;
