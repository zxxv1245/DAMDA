import React, { useState } from 'react';
import { StyleSheet, View, Text, SafeAreaView, TextInput, Modal, Dimensions,TouchableOpacity,Button } from 'react-native';
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
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';

type SignupProps = StackScreenProps<
  StackParamList,
  typeof stackNavigations.SIGNUP
>;

function Signup({ navigation }: SignupProps) {
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const { values, touched, errors, getTextInputProps, validate, isEmailChecking } = useFormSignup({ initialValue: { email: '', password: '', passwordConfirm: '', username: '', nickname : '', phoneNumber : ''} });
  const { signupMutation } = useAuth();

  const handleSubmit = () => {
    if (validate() && !isEmailChecking && !errors.email && isVerified) {
      const { email, password, username,nickname,phoneNumber} = values;
      const birthDate = format(date,'yyyy-MM-dd')
      signupMutation.mutate(
        { email, password, username, nickname, phoneNumber, birthDate },
        {
          onSuccess: () => {
            console.log('Signup successful');
            navigation.navigate(stackNavigations.AUTH_HOME);
          },
          onError: (error) => {
            if (error.response?.status === 400) {
              setIsModalVisible(true);
            }
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
    }
  };

  const handleVerifyCode = async () => {
    try {
      const dataSuccess = await verifyCode(values.email, verificationCode);
      if (dataSuccess) {
        setIsVerified(true);
        setEmailVerified(true);
      }
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
            editable={!emailVerified} 
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
            placeholder='영문/숫자/특수문자 포함 6자리 이상 입력'
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
          <Text style={styles.labelText}>이름</Text>
          <InputField
            placeholder='ex) 이주호'
            error={touched.username && errors.username}
            touched={touched.username}
            {...getTextInputProps('username')}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>닉네임</Text>
          <InputField
            placeholder='ex) 담다'
            error={touched.nickname && errors.nickname}
            touched={touched.nickname}
            {...getTextInputProps('nickname')}
          />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.labelText}>핸드폰 번호</Text>
          <InputField
            placeholder="'-'없이 숫자 11자리만 입력"
            error={touched.phoneNumber && errors.phoneNumber}
            touched={touched.phoneNumber}
            {...getTextInputProps('phoneNumber')}
          />
        </View>
        <View style={styles.fieldContainer}>
          <View style={styles.birthDateContainer}>
            <Text style={styles.dateText}>생년월일: {format(date, 'yyyy-MM-dd')}</Text>
            <CustomButton
              label="선택"
              onPress={() => setOpen(true)}
              style={styles.smallButton}
            />
            <DatePicker
              modal
              open={open}
              date={date}
              mode="date"
              locale="ko"
              onConfirm={(date) => {
                setOpen(false);
                setDate(date);
              }}
              onCancel={() => {
                setOpen(false);
              }}
              title="생년월일 선택"
              confirmText="확인" 
              cancelText="취소"  
              theme="light"
            />
          </View>  
        </View>
        <CustomButton
          label="회원가입"
          variant='outlined'
          onPress={handleSubmit}
          disabled={Object.keys(errors).length > 0 || isEmailChecking || !isVerified}
        />
        <Modal
          visible={isModalVisible}
          transparent
          animationType="slide"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>입력이 잘못되었습니다.</Text>
              <TouchableOpacity style={[styles.button, styles.buttonClose]} onPress={() => setIsModalVisible(false)}>
                <Text style={styles.closeButton}>닫기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
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
  scrollViewContainer: {
    flexGrow: 1,
  },
  fieldContainer: {
    minHeight: 70,
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
    paddingVertical: 8, 
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
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colors.WHITE,
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
    color: colors.WHITE,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: colors.BLUE_250,
  },
  birthDateContainer: {
    flexDirection : 'row',
    padding: 16,
  },
  dateText: {
    flex : 1,
    fontSize: 16,
    color: colors.GRAY_500 ,
    alignItems : 'center',
    marginTop : 10,
  },
  
});

export default Signup;
