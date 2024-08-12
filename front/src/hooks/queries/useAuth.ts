import { useCallback, useEffect } from "react";
import { getEncryptStorage, removeEncryptStorage, setEncryptStorage } from "../../utils";
import axiosInstance from "../../api/axios";
import queryClient from "../../api/queryClient";
import { queryKeys } from "../../constants/keys";
import { useMutation, useQuery } from "@tanstack/react-query";
import { kakaoLogin, naverLogin, postLogin, postSignup} from "../../api/auth";

function useAuth() {
  const { data: isLogin, refetch: checkLoginStatus } = useQuery({
    queryKey: [queryKeys.AUTH, 'isLogin'],
    queryFn: async () => {
      const token = await getEncryptStorage('accessToken');
      return !!token;
    },
    staleTime: Number.MAX_SAFE_INTEGER,
  });

  const handleTokens = async (accessToken: string, refreshToken?: string) => {
    if (refreshToken) {
      await setEncryptStorage('refreshToken', refreshToken);
    }
  
    await setEncryptStorage('accessToken', accessToken);
    queryClient.setQueryData([queryKeys.AUTH, 'isLogin'], true);
  };
  const signupMutation = useMutation({
    mutationFn: postSignup,
    onSuccess: () => {
      // Signup 성공 후 필요한 로직이 있다면 추가
    },
  });

  const loginMutation = useMutation({
    mutationFn: postLogin,
    onSuccess: async (response) => {
      const accessToken = response['authorization'];
      const refreshToken = response['refresh-token'];
      await handleTokens(accessToken, refreshToken);
    },
  });
  

  const kakaoLoginMutation = useMutation({
    mutationFn: kakaoLogin,
    onSuccess: async (response) => {
      const accessToken = response['authorization'];
      const refreshToken = response['refresh-token'];
      await handleTokens(accessToken, refreshToken);
    },
  });

  const naverLoginMutation = useMutation({
    mutationFn: naverLogin,
    onSuccess: async (response) => {
      const accessToken = response['authorization'];
      const refreshToken = response['refresh-token'];
      await handleTokens(accessToken, refreshToken);
    },
  });

  const logout = useCallback(async () => {
    await removeEncryptStorage('accessToken');
    await removeEncryptStorage('refreshToken');
    queryClient.setQueryData([queryKeys.AUTH, 'isLogin'], false);
    queryClient.invalidateQueries({ queryKey: [queryKeys.AUTH] });
  }, []);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  return { 
    signupMutation, 
    loginMutation, 
    kakaoLoginMutation, 
    naverLoginMutation, 
    isLogin, 
    logout, 
    checkLoginStatus 
  };
}

export default useAuth;
