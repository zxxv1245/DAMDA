import { useState, useEffect } from "react";
import { checkEmailExists } from '../api/auth';

interface useFormProps<T> {
  initialValue: T;
}

function useForm<T>({ initialValue }: useFormProps<T>) {
  const [values, setValues] = useState(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isEmailChecking, setIsEmailChecking] = useState(false);

  const handleChangeText = (name: keyof T, text: string) => {
    setValues({ ...values, [name]: text });
    setTouched({ ...touched, [name]: true });

    if (name === 'email') {
      checkEmail(text);
    }
  };

  const handleBlur = (name: keyof T) => {
    setTouched({ ...touched, [name]: true });
  };

  const getTextInputProps = (name: keyof T) => {
    const value = values[name];
    const onChangeText = (text: string) => handleChangeText(name, text);
    const onBlur = () => handleBlur(name);

    return { value, onChangeText, onBlur };
  };

  useEffect(() => {
    validate();
  }, [values]);

  const validate = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};
    const regexPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,15}$/g;
    
    if (!values.email) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!values.email.includes('@')) {
      newErrors.email = '올바르지 않은 이메일 형식입니다';
    }
    if (values.password.trim() === '') {
      newErrors.password = '비밀번호를 입력하세요';
    } else if (values.password.length < 6) {
      newErrors.password = '비밀번호가 너무 짧습니다'
    } else if (regexPw.test(values.password) === false) {
      newErrors.password = '비밀번호에 영문/숫자/특수문자를 모두 포함해주세요'
    }
    if (values.passwordConfirm.trim() === '' || values.password !== values.passwordConfirm) {
      newErrors.passwordConfirm = '비밀번호가 일치하지 않습니다';
    } 
    if (values.username.trim() === '') {
      newErrors.username = '이름을 입력하세요';
    }
    if (values.nickname.trim() === '') {
      newErrors.nickname = '닉네임을 입력하세요';
    }
    if (values.phoneNumber.trim() === '') {
      newErrors.phoneNumber = '핸드폰 번호을 입력하세요';
    }
    if (values.phoneNumber.length > 11) {
      newErrors.phoneNumber = '핸드폰 번호를 11자리만 입력해주세요';
    }
    if (values.phoneNumber.length < 11) {
      newErrors.phoneNumber = '핸드폰 번호 11자리를 입력해주세요';
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const checkEmail = async (email: string) => {
    if (email.trim() === '' || !email.includes('@')) return;
    setIsEmailChecking(true);
    try {
      const exists = await checkEmailExists(email);
      if (exists) {
        setErrors(prevErrors => ({ ...prevErrors, email: '이미 사용 중인 이메일입니다' }));
      } else {
        setErrors(prevErrors => ({ ...prevErrors, email: undefined }));
      }
    } catch (error) {
      setErrors(prevErrors => ({ ...prevErrors, email: '이미 사용 중인 이메일입니다' }))
      // console.error('Error checking email:', error);
    } finally {
      setIsEmailChecking(false);
    }
  };

  const resetForm = () => {
    setValues(initialValue);
    setTouched({});
    setErrors({});
  };

  return { values, touched, errors, getTextInputProps, validate, resetForm, isEmailChecking };
}

export default useForm;
