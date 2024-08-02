import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
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
  const { values, touched, getTextInputProps } = useFormLogin({ initialValue: { username: '', password: '' } });
  const { loginMutation } = useAuth();

  const handleSubmit = () => {
    loginMutation.mutate(values, {
      onSuccess: (data) => {
        console.log('Login successful:', data);
        navigation.replace(stackNavigations.MAIN);
      },
      onError: (error) => {
        console.error('error:', error);
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>로그인</Text>
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

export default AuthHome;
