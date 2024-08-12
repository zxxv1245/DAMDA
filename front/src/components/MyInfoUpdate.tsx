import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { colors } from '../constants/color';
import useAuth from '../hooks/queries/useAuth';
import { getUserInfo, updateUserInfo } from '../api/auth';
import { useNavigation } from '@react-navigation/native';
import { stackNavigations } from '../constants';
import InputField from '../components/InputField'; // InputField 컴포넌트 임포트

function MyInfoUpdate() {
  const { isLogin } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const navigation = useNavigation();
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo();
        setUsername(userInfo.data.username);
        setEmail(userInfo.data.email);
        setBirthDate(userInfo.data.birthDate);
        setNickname(userInfo.data.nickname);
        setPhoneNumber(userInfo.data.phoneNumber);
      } catch (error) {
      }
    };

    if (isLogin) {
      fetchUserInfo();
    }
  }, [isLogin]);

  const handleSave = async () => {
    try {
      await updateUserInfo({ username, birthDate, nickname, phoneNumber });
      navigation.reset({
        index: 0,
        routes: [{ name: stackNavigations.MAIN }],
      });
    } catch (error) {
    }
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>이메일 주소</Text>
        <Text style={styles.emailText}>{email}</Text>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>이름</Text>
        <InputField
          value={username}
          onChangeText={setUsername}
          onBlur={() => handleBlur('username')}
          placeholder="ex) 이주호"
          error={touched.username && !username ? '이름을 입력해주세요.' : ''}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>닉네임</Text>
        <InputField
          value={nickname}
          onChangeText={setNickname}
          onBlur={() => handleBlur('nickname')}
          placeholder="ex) 담다"
          error={touched.nickname && !nickname ? '닉네임을 입력해주세요.' : ''}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>핸드폰 번호</Text>
        <InputField
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          onBlur={() => handleBlur('phoneNumber')}
          placeholder="'-'없이 11자리만 입력"
          error={touched.phoneNumber && !phoneNumber ? '핸드폰 번호를 입력해주세요.' : ''}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>생년월일</Text>
        <InputField
          value={birthDate}
          onChangeText={setBirthDate}
          onBlur={() => handleBlur('birthDate')}
          placeholder="생년월일 (예: 1990-01-01)"
          error={touched.birthDate && !birthDate ? '생년월일을 입력해주세요.' : ''}
        />
      </View>
      <Pressable style={[styles.saveButton, styles.pressableContainer]} onPress={handleSave}>
        <Text style={styles.saveButtonText}>저장</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  inputContainer: {
    width: '100%',
    marginVertical: 8,
  },
  disabledInput: {
    backgroundColor: colors.GRAY_200,
    color: colors.GRAY_700,
  },
  saveButton: {
    backgroundColor: colors.BLUE_250,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginVertical: 5,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.WHITE,
  },
  labelText: {
    marginVertical: 5,
    color: colors.BLACK,
  },
  emailText: {
    marginVertical: 5,
    color: colors.GRAY_700,
    fontSize: 18
  },
});

export default MyInfoUpdate;
