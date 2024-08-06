import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputField from './InputField';
import CustomButton from './CustomButton';
import { stackNavigations } from '../constants';
import { StackParamList } from '../Navigations/StackNavigator';
import { StackScreenProps } from '@react-navigation/stack';
import useFormSignup from '../hooks/useFormSignup';
import useAuth from '../hooks/queries/useAuth';
import { sendVerificationRequest, verifyCode } from '../api/auth';
import { colors } from '../constants/color';
import { TouchableOpacity } from 'react-native-gesture-handler';

type SignupProps = StackScreenProps<
  StackParamList,
  typeof stackNavigations.SIGNUP
>;

function Signup({ navigation }: SignupProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const { values, touched, errors, getTextInputProps, validate, isEmailChecking } = useFormSignup({ initialValue: { email: '', password: '', passwordConfirm: '', username: '', birthDate: '' } });
  const { signupMutation } = useAuth();

  const formatDate = (dateString: string): string => {
    if (dateString.length === 8) {
      return `${dateString.slice(0, 4)}-${dateString.slice(4, 6)}-${dateString.slice(6, 8)}`;
    }
    return dateString;
  };

  const handleSubmit = () => {
    if (validate() && !isEmailChecking && !errors.email && isVerified) {
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
            console.error('Signup error:', error);
          },
        }
      );
    }
  };

  const handleCheckingEmail = async () => {
    if (!values.email) {
      validate();
      return;
    }
    try {
      setIsCodeSent(true);
      await sendVerificationRequest(values.email);
    } catch (error) {
      console.error('Error sending verification email:', error);
    }
  };

  const handleVerifyCode = async () => {
    try {
      await verifyCode(values.email, verificationCode);
      setIsVerified(true);
      setEmailVerified(true);
    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>이메일 주소</Text>
          <InputField
            placeholder='example@naver.com'
            error={touched.email && errors.email}
            touched={touched.email}
            {...getTextInputProps('email')}
            editable={!emailVerified} // 이메일 인증 완료 후 수정 불가
          />
        </View>
        <CustomButton
          label={emailVerified ? "이메일 인증 완료" : "이메일 인증하기"}
          variant='filled'
          onPress={handleCheckingEmail}
          disabled={isCodeSent || emailVerified}
          style={isCodeSent || emailVerified ? styles.disabledButton : styles.enabledButton}
          textStyle={isCodeSent || emailVerified ? styles.disabledButtonText : styles.enabledButtonText}
        />
        {isCodeSent && !emailVerified && (
          <View>
            <View style={styles.verificationContainer}>
              <TextInput
                placeholder='인증 코드 6자리 입력'
                value={verificationCode}
                onChangeText={setVerificationCode}
                style={styles.verificationInput}
              />
              <CustomButton
                label="확인"
                onPress={handleVerifyCode}
                style={styles.smallButton}
              />
            </View>
            <TouchableOpacity onPress={handleCheckingEmail}>
              <Text style={styles.resendText}>이메일을 받지 못하셨나요?</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>비밀번호</Text>
          <InputField
            placeholder='영문/숫자/특수문자 포함 6자리 이상'
            error={touched.password && errors.password}
            touched={touched.password}
            {...getTextInputProps('password')}
            secureTextEntry
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>비밀번호 확인</Text>
          <InputField
            placeholder='비밀번호와 동일하게 입력'
            error={touched.passwordConfirm && errors.passwordConfirm}
            touched={touched.passwordConfirm}
            {...getTextInputProps('passwordConfirm')}
            secureTextEntry
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>닉네임</Text>
          <InputField
            placeholder='ex) 담다'
            error={touched.username && errors.username}
            touched={touched.username}
            {...getTextInputProps('username')}
          />
          
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>생년월일</Text>
          <InputField
            placeholder='ex) 19980804'
            error={touched.birthDate && errors.birthDate}
            touched={touched.birthDate}
            {...getTextInputProps('birthDate')}
          />
          
        </View>
        <CustomButton
          label="회원가입"
          variant='outlined'
          onPress={handleSubmit}
          disabled={Object.keys(errors).length > 0 || isEmailChecking || !isVerified}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  fieldContainer: {
    minHeight: 70, // 필드 컨테이너의 최소 높이 설정
    marginBottom: 10,
  },
  labelText: {
    marginVertical: 5,
    color: colors.BLACK,
  },
  errorText: {
    color: colors.RED_500,
    fontSize: 12,
    marginTop: 5,
  },
  verificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.GRAY_500,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 5,
    backgroundColor: colors.GRAY_200,
  },
  verificationInput: {
    flex: 1,
  },
  smallButton: {
    paddingVertical: 8, // 상하 패딩을 줄입니다.
    paddingHorizontal: 20,
    marginLeft: 10,
    backgroundColor: colors.BLUE_250,
  },
  disabledButton: {
    backgroundColor: colors.GRAY_200,
    borderColor: colors.GRAY,
    borderWidth: 1,
  },
  disabledButtonText: {
    color: colors.GRAY,
    fontWeight: '700',
  },
  enabledButton: {
    backgroundColor: colors.BLUE_250,
  },
  enabledButtonText: {
    color: colors.WHITE,
    fontWeight: 'normal',
  },
  verifiedText: {
    color: 'green',
    fontWeight: 'bold',
    marginVertical: 10,
  },
  resendText : {
    color: colors.GRAY_500,
    marginBottom: 10,
    textDecorationLine: 'underline',
  }
});

export default Signup;
