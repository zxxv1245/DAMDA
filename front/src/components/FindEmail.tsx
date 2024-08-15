import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Alert } from 'react-native';
import InputField from './InputField';
import CustomButton from './CustomButton';
import { colors } from '../constants/color';
import { findEmail } from '../api/auth';

interface FindEmailProps {}

function FindEmail({}: FindEmailProps) {
  const [username, setUsername] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState({ username: '', phoneNumber: '' });

  const SimpleLogo = require('../assets/simpleLogo.png');

  const validateInputs = () => {
    let valid = true;
    const errors = { username: '', phoneNumber: '' };

    if (!username) {
      errors.username = '이름을 입력해주세요.';
      valid = false;
    }

    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneNumber) {
      errors.phoneNumber = '핸드폰 번호를 입력해주세요.';
      valid = false;
    } else if (!phoneRegex.test(phoneNumber)) {
      errors.phoneNumber = "'-' 없이 숫자 11자리만 입력해주세요.";
      valid = false;
    }

    setError(errors);
    return valid;
  };

  const handleSubmit = async () => {
    if (validateInputs()) {
      try {
        const email = await findEmail({username : username, phoneNumber : phoneNumber});
        if (email) {
          Alert.alert('아이디 찾기 성공', `등록된 이메일: ${email}`);
        } else {
          Alert.alert('아이디 찾기 실패', '입력하신 정보와 일치하는 이메일이 없습니다.');
        }
      } catch (error) {
        console.error('이메일 찾기 중 오류 발생:', error);
        Alert.alert('오류', '이메일을 찾는 중 문제가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Image source={SimpleLogo} style={styles.imgContainer} />
        <Text style={styles.labelText}>이름</Text>
        <InputField
          placeholder='ex) 이주호'
          value={username}
          onChangeText={setUsername}
          error={error.username}
          touched={!!error.username}
        />
        <Text style={styles.labelText}>핸드폰 번호</Text>
        <InputField
          placeholder="'-'없이 숫자 11자리만 입력"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="numeric"
          maxLength={11}
          error={error.phoneNumber}
          touched={!!error.phoneNumber}
        />
        <CustomButton
          label="아이디 찾기"
          variant='filled'
          onPress={handleSubmit}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imgContainer: {
    width: '100%',
    height: 150,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  labelText: {
    marginVertical: 10,
    color: colors.BLACK,
    fontSize: 16,
  },
  button: {
    marginTop: 20,
  },
});

export default FindEmail;
