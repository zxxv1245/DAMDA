// auth.ts
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
    }
    throw error;
  }
};

const kakaoLogin = async (authorizationCode: string): Promise<ResponseToken> => {
  try {
    console.log('Sending authorizationCode to server:', authorizationCode);
    const response = await axiosInstance.post('/api/v1/auth/kakao',
      { 'authorizationCode' : authorizationCode },
      { headers: { 'Content-Type': 'application/json' } } );
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
    console.error('kakao Login error:', error.response);
    throw error;
  }
};

const naverLogin = async ({ authorizationCode, state }: { authorizationCode: string; state: string }): Promise<ResponseToken> => {
  try {
    console.log(authorizationCode);
    console.log(state)
    const response = await axiosInstance.post('/api/v1/auth/naver',
      { 'authorizationCode' : authorizationCode,
        'state' : state
      },
      { headers: { 'Content-Type': 'application/json' } } );
    const authorizationToken = response.headers['authorization'];
    if (authorizationToken) {
      await setEncryptStorage('accessToken', authorizationToken);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authorizationToken}`;
      return { accessToken: authorizationToken };
    } else {
        throw new Error('Authorization token not found in response headers');
      }
  } catch (error) {
    console.error('naver Login error:', error.response);
    throw error;
  }
};

type RequestUserSignup = {
  email: string;
  password: string;
  username: string;
  birthDate: string;
  nickname: string;
  phoneNumber: string;
}

const postSignup = async ({ email, password, username, birthDate,nickname,phoneNumber }: RequestUserSignup): Promise<void> => {
  try {
    const response = await axiosInstance.post('/api/v1/register', {
      email,
      password,
      username,
      nickname,
      birthDate,
      phoneNumber
    });
    console.log('Signup response:', response);
  } catch (error) {
    // console.error(error);
    if (axios.isAxiosError(error)) {
    }
    throw error;
  }
};

const checkEmailExists = async (email: string): Promise<boolean> => {
  try {
    const response = await axiosInstance.get(`/api/v1/${email}/exists`);
    // console.log(response.data)
    return response.data.exists;
  } catch (error) {
    // console.error('Email check error:', error);
    throw error;
  }
};

const getUserInfo = async (): Promise<void> => {
  try {
    const token = await getEncryptedStorage('accessToken');
    const response = await axiosInstance.get('api/v1/user/profile', {
      headers : {
        Authorization : token
      }
    });
    return response.data;
  } catch (error) {
    // console.error('getUserInfo error:', error);
    throw error;
  }
};

type RequestUpdateUser = {
  username: string;
  birthDate: string;
  nickname: string;
  phoneNumber: string;
};

const updateUserInfo = async (data: RequestUpdateUser): Promise<void> => {
  try {
    const response = await axiosInstance.put('/api/v1/user/update', data);
    console.log('Update user info response:', response.data);
  } catch (error) {
    throw error;
  }
};

const deleteAccount = async (): Promise<void> => {
  try {
    const response = await axiosInstance.delete('/api/v1/user/delete');
    console.log(response.data)
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

const sendVerificationRequest = async (email: string): Promise<void> => {
  try {
    const response = await axiosInstance.post('/api/v1/emails/verification-requests', null, {
      params: { email }
    });
    // console.log('Verification request response:', response.data);
  } catch (error) {
    // console.error('Error sending verification email:', error);
    if (axios.isAxiosError(error)) {
      // console.error('Response data:', error.response?.data);
      // console.error('Response status:', error.response?.status);
    }
    throw error;
  }
};

const verifyCode = async (email: string, code: string): Promise<void> => {
  try {
    const response = await axiosInstance.get('/api/v1/emails/verifications', {
      params: { email, code }
    });
    console.log('Verification response:', response.data);
    return response.data.data.success;
  } catch (error) {
    // console.error('Error verifying code:', error);
    if (axios.isAxiosError(error)) {
      // console.error('Response data:', error.response?.data);
      // console.error('Response status:', error.response?.status);
    }
    throw error;
  }
};

export { postSignup, postLogin, getUserInfo, deleteAccount, checkEmailExists,changePassword,sendVerificationRequest,verifyCode,updateUserInfo,kakaoLogin,naverLogin };
export type { RequestUser, RequestUserSignup, ResponseToken,RequestChangePassword,RequestUpdateUser };
