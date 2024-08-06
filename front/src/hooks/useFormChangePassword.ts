import { useState } from 'react';

interface useFormProps<T> {
  initialValue: T;
}

function useFormChangePassword<T>({ initialValue }: useFormProps<T>) {
  const [values, setValues] = useState(initialValue);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

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

    if (!values.currentPassword.trim()) {
      newErrors.currentPassword = '현재 비밀번호를 입력하세요';
    }
    if (!values.newPassword.trim()) {
      newErrors.newPassword = '새 비밀번호를 입력하세요';
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
  };

  return { values, touched, errors, getTextInputProps, validate, resetForm };
}

export default useFormChangePassword;
