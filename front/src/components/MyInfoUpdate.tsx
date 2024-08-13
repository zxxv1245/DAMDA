import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import { colors } from '../constants/color';
import useAuth from '../hooks/queries/useAuth';
import { getUserInfo, updateUserInfo } from '../api/auth';
import { useNavigation } from '@react-navigation/native';
import { stackNavigations } from '../constants';
import InputField from '../components/InputField'; 
import CustomButton from './CustomButton';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';

function MyInfoUpdate() {
  const { isLogin } = useAuth();
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [nickname, setNickname] = useState<string | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const navigation = useNavigation();
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [isSaveButtonEnabled, setIsSaveButtonEnabled] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await getUserInfo();
      setUsername(userInfo.data.username);
      setEmail(userInfo.data.email);
      setNickname(userInfo.data.nickname);
      setPhoneNumber(userInfo.data.phoneNumber);
      setDate(new Date(userInfo.data.birthDate));
    };

    if (isLogin) {
      fetchUserInfo();
    }
  }, [isLogin]);

  useEffect(() => {
    // username, nickname, phoneNumber 중 하나라도 null 또는 빈 값이면 저장 버튼을 비활성화
    setIsSaveButtonEnabled(!!username && !!nickname && !!phoneNumber);
  }, [username, nickname, phoneNumber]);

  const handleSave = async () => {
    if (!isSaveButtonEnabled) return; // 버튼이 비활성화 상태라면 함수 실행하지 않음

    try {
      const birthDate = format(date, 'yyyy-MM-dd');
      await updateUserInfo({ username, birthDate, nickname, phoneNumber });
      navigation.reset({
        index: 0,
        routes: [{ name: stackNavigations.MAIN }],
      });
    } catch (error) {
      // 오류 처리
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
      <Pressable 
        style={[styles.saveButton, !isSaveButtonEnabled && styles.disabledButton]} 
        onPress={handleSave}
        disabled={!isSaveButtonEnabled} // 버튼 비활성화 조건 추가
      >
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
  disabledButton: {
    backgroundColor: colors.GRAY_300,
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
    fontSize: 18,
  },
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginLeft: 10,
    backgroundColor: colors.BLUE_250,
  },
  birthDateContainer: {
    flexDirection: 'row',
    padding: 16,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: colors.GRAY_500,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default MyInfoUpdate;
