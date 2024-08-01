// axios.ts
import axios from 'axios';
import { getEncryptedStorage, removeEncryptedStorage } from '../utils';
import { NavigationContainerRef, useNavigation } from '@react-navigation/native';
import { stackNavigations } from '../constants';
import { StackParamList } from '../Navigations/StackNavigator';

const axiosInstance = axios.create({
  // baseURL: 'http://192.168.100.38:8080',
  // baseURL: 'http://192.168.25.7:8080',
  baseURL: 'https://i11c103.p.ssafy.io',
  withCredentials: true,
});

let navigationRef: React.RefObject<NavigationContainerRef<StackParamList>> | null = null;

export const setNavigationRef = (ref: React.RefObject<NavigationContainerRef<StackParamList>>) => {
  navigationRef = ref;
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await removeEncryptedStorage('accessToken');
      delete axiosInstance.defaults.headers.common['Authorization'];
      
      if (navigationRef && navigationRef.current) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: stackNavigations.LOGIN }],
        });
      }
    }
    return Promise.reject(error);
  }
);


export default axiosInstance;
