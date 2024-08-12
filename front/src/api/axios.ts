import axios from 'axios';
import { getEncryptStorage, setEncryptStorage } from '../utils/encryptStorage';

const axiosInstance = axios.create({
  baseURL: 'https://i11c103.p.ssafy.io',
  withCredentials: true,
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.headers['Requires-Auth']) {
      const accessToken = await getEncryptStorage('accessToken');
      const refreshToken = await getEncryptStorage('refreshToken');
      if (accessToken) {
        config.headers['Authorization'] = accessToken;
      }
      if (refreshToken) {
        config.headers['Refresh-Token'] = refreshToken;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  async (response) => {
    const newAccessToken = response.headers['authorization'];
    if (newAccessToken) {

      await setEncryptStorage('accessToken', newAccessToken);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
