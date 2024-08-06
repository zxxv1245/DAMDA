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
  const { values, touched, errors, getTextInputProps, validate, isEmailChecking } = useFormSignup({ initialValue: { email: '', password: '', passwordConfirm: '', username: '', birthDate: '' } });
  const { signupMutation } = useAuth();

  const formatDate = (dateString: string): string => {
    if (dateString.length === 8) {
      return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
    }
    return dateString;
  };

  const handleSubmit = () => {
    if (validate() && !isEmailChecking && !errors.email) {
      const { email, password, username, birthDate } = values;
      const formattedBirthDate = formatDate(birthDate);

      signupMutation.mutate(
        { email, password, username, birthDate: formattedBirthDate },
        {
          onSuccess: () => {
            console.log('Signup successful');
            navigation.navigate(stackNavigations.AUTH_HOME);
          },
          onError: (error) => {
            // console.error('Signup error:', error);
          },
        }
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>회원가입</Text>
        <InputField
          placeholder='이메일'
          error={touched.email && errors.email}
          touched={touched.email}
          {...getTextInputProps('email')}
        />
        <InputField
          placeholder='비밀번호'
          error={touched.password && errors.password}
          touched={touched.password}
          {...getTextInputProps('password')}
          secureTextEntry
        />
        <InputField
          placeholder='비밀번호 확인'
          error={touched.passwordConfirm && errors.passwordConfirm}
          touched={touched.passwordConfirm}
          {...getTextInputProps('passwordConfirm')}
          secureTextEntry
        />
        <InputField
          placeholder='닉네임'
          error={touched.username && errors.username}
          touched={touched.username}
          {...getTextInputProps('username')}
        />
        <InputField
          placeholder='생년월일 8자리'
          error={touched.birthDate && errors.birthDate}
          touched={touched.birthDate}
          {...getTextInputProps('birthDate')}
        />
        <CustomButton
          label="회원가입"
          variant='outlined'
          onPress={handleSubmit}
          disabled={Object.keys(errors).length > 0 || isEmailChecking}
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
