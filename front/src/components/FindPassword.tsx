import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, Alert } from 'react-native';
import InputField from './InputField';
import CustomButton from './CustomButton';
import { colors } from '../constants/color';
import { findPassword } from '../api/auth';

interface FindPasswordProps {}

function FindPassword({}: FindPasswordProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const SimpleLogo = require('../assets/simpleLogo.png');

  const validateInput = () => {
    if (!email) {
      setError('이메일을 입력해주세요.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async () => {
    try {
      Alert.alert('성공', '임시 비밀번호가 이메일로 전송되었습니다.');
      await findPassword(email)
    } catch (error) {
      console.error('비밀번호 찾기 중 오류 발생:', error.response?.data || error.message);
      Alert.alert('오류', '비밀번호를 찾는 중 문제가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={SimpleLogo} style={styles.imgContainer} />
      <Text style={styles.labelText}>이메일</Text>
      <InputField
        placeholder="example@example.com"
        value={email}
        onChangeText={setEmail}
        error={error}
        touched={!!error}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <CustomButton
        label="임시 비밀번호 전송"
        variant="filled"
        onPress={handleSubmit}
        style={styles.button}
      />
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

export default FindPassword;
