// auth.ts
import axiosInstance from './axios';
import { setEncryptStorage, removeEncryptedStorage } from '../utils/encryptStorage';
import { setHeader } from '../utils/header';
import axios from 'axios';

type RequestUser = {
  username: string;
  password: string;
}

type ResponseToken = {
  accessToken: string;
};

const postLogin = async ({ username, password }: RequestUser): Promise<ResponseToken> => {
  try {
    const response = await axiosInstance.post('/api/v1/login', { username, password });
    // console.log('Response Headers:', response.headers); // Log all headers for debugging

    const authorizationToken = response.headers['authorization']; // Extract the token
    if (authorizationToken) {
      await setEncryptStorage('accessToken', authorizationToken);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authorizationToken}`;
      console.log('Authorization Token:', authorizationToken);
      return { accessToken: authorizationToken };
    } else {
      throw new Error('Authorization token not found in response headers');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

const postSignup = async ({ username, password }: RequestUser): Promise<void> => {
  try {
    // /register
    const response = await axiosInstance.post('/api/v1/register', {
      username,
      password,
    });
    console.log('Signup response:', response);
  } catch (error) {
    console.error('Signup error:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
    }
    throw error;
  }
};

export { postSignup, postLogin };
export type { RequestUser, ResponseToken };
