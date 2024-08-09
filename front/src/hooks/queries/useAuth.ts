import { useCallback, useEffect } from "react";
import { getEncryptedStorage, removeEncryptedStorage, setEncryptStorage } from "../../utils";
import axiosInstance from "../../api/axios";
import { removeHeader, setHeader } from "../../utils/header";
import queryClient from "../../api/queryClient";
import { queryKeys } from "../../constants/keys";
import { useMutation, useQuery } from "@tanstack/react-query";
import { kakaoLogin, naverLogin, postLogin, postSignup } from "../../api/auth";
import { UseMutationCustomOptions } from "../../types/common";

function useAuth() {
  const { data: isLogin, refetch: checkLoginStatus } = useQuery({
    queryKey: [queryKeys.AUTH, 'isLogin'],
    queryFn: async () => {
      const token = await getEncryptedStorage('accessToken');
      return !!token;
    },
    staleTime: Number.MAX_SAFE_INTEGER,
  });

  const signupMutation = useMutation({
    mutationFn: postSignup,
    onSuccess: () => {
      console.log('Signup successful');
    },
  });

  const loginMutation = useMutation({
    mutationFn: postLogin,
    onSuccess: async ({ accessToken }) => {
      await setEncryptStorage('accessToken', accessToken);
      setHeader('Authorization', `Bearer ${accessToken}`);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      queryClient.setQueryData([queryKeys.AUTH, 'isLogin'], true);
    },
  });

  const kakaoLoginMutation = useMutation({
    mutationFn: kakaoLogin,
    onSuccess: async ({ accessToken }) => {
      try {
        // accessToken이 존재하는지 확인
        if (!accessToken) {
          throw new Error('AccessToken is undefined or null');
        }
  
        await setEncryptStorage('accessToken', accessToken);
        setHeader('Authorization', `Bearer ${accessToken}`);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        queryClient.setQueryData([queryKeys.AUTH, 'isLogin'], true);
      } catch (error) {
        console.error('Error during onSuccess processing:', error.message);
      }
    },
  });

  const naverLoginMutation = useMutation({
    mutationFn: naverLogin,
    onSuccess: async ({ accessToken }) => {
      try {
        // accessToken이 존재하는지 확인
        if (!accessToken) {
          throw new Error('AccessToken is undefined or null');
        }
  
        await setEncryptStorage('accessToken', accessToken);
        setHeader('Authorization', `Bearer ${accessToken}`);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        queryClient.setQueryData([queryKeys.AUTH, 'isLogin'], true);
      } catch (error) {
        console.error('Error during onSuccess processing:', error.message);
      }
    },
  });

  const logout = useCallback(async () => {
    removeHeader('Authorization');
    await removeEncryptedStorage('accessToken');
    queryClient.setQueryData([queryKeys.AUTH, 'isLogin'], false);
    queryClient.invalidateQueries({ queryKey: [queryKeys.AUTH] });
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return { signupMutation, loginMutation,kakaoLoginMutation,naverLoginMutation, isLogin, logout, checkLoginStatus };
}

export default useAuth;