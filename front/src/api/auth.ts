import axiosInstance from './axios';
import ImageResizer from 'react-native-image-resizer';

type RequestUser = {
  email: string;
  password: string;
};

type ResponseToken = {
  accessToken: string;
  refreshToken: string;
};

type RequestUserSignup = {
  email: string;
  password: string;
  username: string;
  birthDate: string;
  nickname: string;
  phoneNumber: string;
};

type RequestUpdateUser = {
  username: string;
  birthDate: string;
  nickname: string;
  phoneNumber: string;
};

type RequestChangePassword = {
  currentPassword: string;
  newPassword: string;
};

// 회원가입
const postSignup = async ({ email, password, username, birthDate, nickname, phoneNumber }: RequestUserSignup): Promise<void> => {
  await axiosInstance.post('/api/v1/register', { email, password, username, birthDate, nickname, phoneNumber });
};

// 로그인
const postLogin = async ({ email, password }: RequestUser): Promise<ResponseToken> => {
  const data = await axiosInstance.post('/api/v1/login', { email, password });
  return data.headers;
};

// 카카오 로그인
const kakaoLogin = async (authorizationCode: string): Promise<ResponseToken> => {
  const data = await axiosInstance.post('/api/v1/auth/kakao',{authorizationCode},{ headers: { 'Content-Type': 'application/json' } });
  console.log('카카오 로그인',data)
  return data.headers;
};

// 네이버 로그인
const naverLogin = async ({ authorizationCode, state }: { authorizationCode: string; state: string }): Promise<ResponseToken> => {
  const data = await axiosInstance.post('/api/v1/auth/naver', { authorizationCode, state },{ headers: { 'Content-Type': 'application/json' } });
  return data.headers;
};

// 이메일 중복 조회
const checkEmailExists = async (email: string): Promise<boolean> => {
  const data = await axiosInstance.get(`/api/v1/${email}/exists`);
  return data.data.exists;
};

// 유저 정보 조회
const getUserInfo = async (): Promise<any> => {
  const data = await axiosInstance.get('api/v1/user/profile', {
    headers: {
      'Requires-Auth': 'true',
    },
  });
  return data.data;
};

// 유저 정보 업데이트
const updateUserInfo = async ({ username, birthDate, nickname, phoneNumber }: RequestUpdateUser): Promise<void> => {
  await axiosInstance.put('/api/v1/user/update', { username, birthDate, nickname, phoneNumber }, {
    headers: {
      'Requires-Auth': 'true',
    },
  });
};

// 계정 삭제
const deleteAccount = async (): Promise<void> => {
  await axiosInstance.delete('/api/v1/user/delete', {
    headers: {
      'Requires-Auth': 'true',
    },
  });
};

// 비밀번호 변경
const changePassword = async ({ currentPassword, newPassword }: RequestChangePassword): Promise<void> => {
  await axiosInstance.put('/api/v1/user/password', { currentPassword, newPassword }, {
    headers: {
      'Requires-Auth': 'true',
    },
  });
};

// 이메일 인증
const sendVerificationRequest = async (email: string): Promise<void> => {
  await axiosInstance.post('/api/v1/emails/verification-requests', null, {
    params: { email },
  });
};

// 이메일 인증번호 확인
const verifyCode = async (email: string, code: string): Promise<boolean> => {
  const { data } = await axiosInstance.get('/api/v1/emails/verifications', {
    params: { email, code },
  });
  return data.data.success;
};

// 프로필 이미지 저장
const saveProfileImage = async (image : any): Promise<boolean> => {
  console.log('이미지',image)
  const resizedImage = await ImageResizer.createResizedImage(
    image.uri,
    1000, 
    1000, 
    'JPEG', 
    80 
  );

  const formData = new FormData();
  formData.append('image', {
    uri: resizedImage.uri,
    type: 'image/jpeg', 
    name: resizedImage.name || `profile_${Date.now()}.jpg`,
  });

  console.log('폼 데이터', formData)
  const data= await axiosInstance.post('/api/v1/user/update/profileImg', formData,{
    headers : {
      'Requires-Auth': 'true',
      'Content-Type': 'multipart/form-data',
    }
  });
  return data.data.success;
};

export { 
  postSignup, 
  postLogin, 
  getUserInfo, 
  deleteAccount, 
  checkEmailExists, 
  changePassword, 
  sendVerificationRequest, 
  verifyCode, 
  updateUserInfo, 
  kakaoLogin, 
  naverLogin,
  saveProfileImage 
};

export type { 
  RequestUser, 
  RequestUserSignup, 
  ResponseToken, 
  RequestChangePassword, 
  RequestUpdateUser 
};
