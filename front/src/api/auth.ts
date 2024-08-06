import axiosInstance from './axios';
import { setEncryptStorage, removeEncryptedStorage, getEncryptedStorage } from '../utils/encryptStorage';
import { setHeader } from '../utils/header';
import axios from 'axios';

type RequestUser = {
  email: string;
  password: string;
}

type ResponseToken = {
  accessToken: string;
};

const postLogin = async ({ email, password }: RequestUser): Promise<ResponseToken> => {
  try {
    // console.log('Login request data:', { email, password }); // 요청 데이터 로그 추가
    const response = await axiosInstance.post('/api/v1/login', { email, password });
    // console.log('Login response:', response.data); // 응답 로그 추가
    const authorizationToken = response.headers['authorization']; // Extract the token
    if (authorizationToken) {
      await setEncryptStorage('accessToken', authorizationToken);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authorizationToken}`;
      // console.log('Authorization Token:', authorizationToken);
      return { accessToken: authorizationToken };
    } else {
      throw new Error('Authorization token not found in response headers');
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // console.error('Login error response data:', error.response?.data); // 에러 응답 데이터 로그 추가
      // console.error('Login error response status:', error.response?.status); // 에러 응답 상태 로그 추가
    }
    // console.error('Login error:', error); // 에러 로그 추가
    throw error;
  }
};

type RequestUserSignup = {
  email: string;
  password: string;
  username: string;
  birthDate: string;
}

const postSignup = async ({ email, password, username, birthDate }: RequestUserSignup): Promise<void> => {
  try {
    const response = await axiosInstance.post('/api/v1/register', {
      email,
      password,
      username,
      birthDate
    });
    console.log('Signup response:', response);
  } catch (error) {
    console.error('Signup error:', error);
    if (axios.isAxiosError(error)) {
      // console.error('Response data:', error.response?.data);
      // console.error('Response status:', error.response?.status);
    }
    throw error;
  }
};

const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(`/api/v1/${email}/exists`);
    return response.data.exists;
  } catch (error) {
    // console.error('Email check error:', error);
    throw error;
  }
};

const getUserInfo = async (): Promise<void> => {
  try {
    const response = await axiosInstance.get('api/v1/user/profile');
    return response.data;
  } catch (error) {
    // console.error('getUserInfo error:', error);
    throw error;
  }
};

const deleteAccount = async (): Promise<void> => {
  try {
    const response = await axiosInstance.delete('/api/v1/user/delete');
    return response.data;
  } catch (error) {
    // console.error('deleteAccount error:', error);
    throw error;
  }
};

type RequestChangePassword = {
  currentPassword: string;
  newPassword: string;
};

const changePassword = async (data: RequestChangePassword): Promise<void> => {
  try {
    await axiosInstance.put('/api/v1/user/password', data);
  } catch (error) {
    // console.error('Password change error:', error);
    throw error;
  }
};

export { postSignup, postLogin, getUserInfo, deleteAccount, checkEmailExists,changePassword };
export type { RequestUser, RequestUserSignup, ResponseToken,RequestChangePassword };
