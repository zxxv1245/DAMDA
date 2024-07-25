// Signup.tsx
import React from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import InputField from './InputField';
import CustomButton from './CustomButton';
import { stackNavigations } from '../constants';
import { StackParamList } from '../Navigations/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import useFormSignup from '../hooks/useFormSignup';
import useAuth from '../hooks/queries/useAuth';

type SignupProps = StackScreenProps<
  StackParamList,
  typeof stackNavigations.SIGNUP
>;

function Signup({ navigation }: SignupProps) {
  const { values, touched, getTextInputProps } = useFormSignup({ initialValue: { username: '', password: '', passwordConfirm: '' } });
  const { signupMutation } = useAuth();

  const handleSubmit = () => {
    const { username, password } = values;
    signupMutation.mutate(
      { username, password },
      {
        onSuccess: () => {
          console.log('Signup successful');
          // 회원가입 성공 후 로그인 페이지로 이동
          navigation.navigate(stackNavigations.AUTH_HOME);
        },
        onError: (error) => {
          console.error('Signup error:', error);
          // 에러 처리 (예: 사용자에게 에러 메시지 표시)
        },
      }
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>회원가입</Text>
        <InputField
          placeholder='아이디'
          error={values.username.trim() === '' ? '아이디를 입력하세요' : undefined}
          touched={touched.username}
          {...getTextInputProps('username')}
        />
        <InputField
          placeholder='비밀번호'
          error={values.password.trim() === '' ? '비밀번호를 입력하세요' : undefined}
          touched={touched.password}
          {...getTextInputProps('password')}
          secureTextEntry
        />
        <InputField
          placeholder='비밀번호 확인'
          error={values.passwordConfirm.trim() === '' ? '비밀번호를 입력하세요' : undefined}
          touched={touched.passwordConfirm}
          {...getTextInputProps('passwordConfirm')}
          secureTextEntry
        />
        <CustomButton
          label="회원가입"
          variant='outlined'
          onPress={handleSubmit}
        />
      </View>
    </SafeAreaView>
  );
}

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
});

export default Signup;
