import axios from 'axios';
import React, {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {
  WebView,
  WebViewMessageEvent,
  WebViewNavigation,
} from 'react-native-webview';

import useAuth from '../hooks/queries/useAuth';
import { colors } from '../constants/color';
import { useNavigation } from '@react-navigation/native';
import { stackNavigations } from '../constants';

const KAKAO_REST_API_KEY = `8e644af4ae32404b66874db91b2f325e`;
const REDIRECT_URI = `https://i11c103.p.ssafy.io/oauth/kakao/callback`;
const INJECTED_JAVASCRIPT = "window.ReactNativeWebView.postMessage('')";

function KakaoLogin() {
  const {kakaoLoginMutation} = useAuth();
  const [isChangeNavigate, setIsChangeNavigate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleOnMessage = (event: WebViewMessageEvent) => {
    if (event.nativeEvent.url.includes(`${REDIRECT_URI}?code=`)) {
      const authorizationCode = event.nativeEvent.url.replace(`${REDIRECT_URI}?code=`, '');

      kakaoLoginMutation.mutate(authorizationCode, {
        onSuccess: () => {
          setIsLoading(false); // 로딩 상태 해제
          navigation.reset({
            index: 0,
            routes: [{ name: stackNavigations.MYINFO_UPDATE }], // 로그인 후 이동할 화면 설정
          });
        },
        onError: () => {
          setIsLoading(false); // 오류 발생 시에도 로딩 상태 해제
        },
      });
    }
  };

  const handleNavigationStateChange = (event: WebViewNavigation) => {
    const isMatched = event.url.includes(`${REDIRECT_URI}?code=`);
    setIsLoading(isMatched);
    setIsChangeNavigate(event.loading);
  };

  return (
    <SafeAreaView style={styles.container}>
      {(isChangeNavigate || isLoading) && (
        <View style={styles.kakaoLoadingContiner}>
          <ActivityIndicator size={'small'} color={colors.BLACK} />
        </View>
      )}
      <WebView
        style={styles.container}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        onMessage={handleOnMessage}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  kakaoLoadingContiner: {
    backgroundColor: colors.WHITE,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default KakaoLogin;