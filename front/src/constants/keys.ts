const queryKeys = {
  AUTH: "auth",
  GET_PROFILE: 'getProfile'
} as const;

const storageKeys = {
  GET_ACCESS_TOKEN: 'accessToken', // accessToken만 사용
} as const;

export { queryKeys, storageKeys };
