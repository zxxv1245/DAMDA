import { useState, useEffect } from 'react';

interface useFormProps<T> {
  initialValue: T;
}

function useFormChangePassword<T>({ initialValue }: useFormProps<T>) {
  const [values, setValues] = useState(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [isValid, setIsValid] = useState<boolean>(false);

  useEffect(() => {
    setIsValid(validate());
  }, [values]);

  const handleChangeText = (name: keyof T, text: string) => {
    setValues({ ...values, [name]: text });
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

  const validate = (): boolean => {
    const newErrors: Record<string, string | undefined> = {};
    const regexPw = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{6,15}$/g;
    if (!values.currentPassword.trim()) {
      newErrors.currentPassword = '현재 비밀번호를 입력하세요';
    }
    if (values.newPassword.trim() === '') {
      newErrors.newPassword = '새 비밀번호를 입력하세요';
    } else if (values.newPassword.length < 6) {
      newErrors.newPassword = '6자리 이상 입력해주세요';
    } else if (regexPw.test(values.newPassword) === false) {
      newErrors.newPassword = '비밀번호에 영문/숫자/특수문자를 모두 포함해주세요';
    }
    if (values.newPassword !== values.newPasswordConfirm) {
      newErrors.newPasswordConfirm = '새 비밀번호가 일치하지 않습니다';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setValues(initialValue);
    setTouched({});
    setErrors({});
    setIsValid(false);
  };

  return { values, touched, errors, isValid, getTextInputProps, validate, resetForm };
}

export default useFormChangePassword;
