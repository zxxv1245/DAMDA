import React from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import InputField from './InputField';
import CustomButton from './CustomButton';
import useFormChangePassword from '../hooks/useFormChangePassword';
import { changePassword } from '../api/auth';
import { useNavigation } from '@react-navigation/native';
import { stackNavigations } from '../constants';

interface ChangePasswordProps {}

function ChangePassword({}: ChangePasswordProps) {
  const { values, touched, errors, getTextInputProps, validate, resetForm } = useFormChangePassword({
    initialValue: { currentPassword: '', newPassword: '', newPasswordConfirm: '' },
  });

  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (validate()) {
      try {
        await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
        Alert.alert('비밀번호 변경', '비밀번호가 성공적으로 변경되었습니다.');
        resetForm();
        navigation.reset({
          index: 0,
          routes: [{ name: stackNavigations.MAIN }],
        });
      } catch (error) {
        Alert.alert('비밀번호 변경 실패', '비밀번호를 변경하는 중에 오류가 발생했습니다.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <InputField
        placeholder='현재 비밀번호'
        error={touched.currentPassword && errors.currentPassword}
        touched={touched.currentPassword}
        secureTextEntry
        {...getTextInputProps('currentPassword')}
      />
      <InputField
        placeholder='새 비밀번호'
        error={touched.newPassword && errors.newPassword}
        touched={touched.newPassword}
        secureTextEntry
        {...getTextInputProps('newPassword')}
      />
      <InputField
        placeholder='새 비밀번호 확인'
        error={touched.newPasswordConfirm && errors.newPasswordConfirm}
        touched={touched.newPasswordConfirm}
        secureTextEntry
        {...getTextInputProps('newPasswordConfirm')}
      />
      <CustomButton
        label="비밀번호 변경"
        variant='filled'
        onPress={handleSubmit}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
});

export default ChangePassword;
