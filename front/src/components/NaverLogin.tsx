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

const NAVER_CLIENT_ID = `YOUR_KEY`;
const REDIRECT_URI = `https://i11c103.p.ssafy.io/oauth/naver/callback`;
const state = "damda"
const INJECTED_JAVASCRIPT = "window.ReactNativeWebView.postMessage('')";

function NaverLogin() {
  const {naverLoginMutation} = useAuth();
  const [isChangeNavigate, setIsChangeNavigate] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleOnMessage = (event: WebViewMessageEvent) => {
    if (event.nativeEvent.url.includes(`${REDIRECT_URI}?code=`)) {
      const authorizationCode = event.nativeEvent.url.split('code=')[1].split('&')[0]
      naverLoginMutation.mutate({ authorizationCode, state }, {
        onSuccess: () => {
          setIsLoading(false); 
          navigation.reset({
            index: 0,
            routes: [{ name: stackNavigations.MAIN }],
          });
        },
        onError: () => {
          setIsLoading(false);
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
        <View style={styles.naverLoadingContiner}>
          <ActivityIndicator size={'small'} color={colors.BLACK} />
        </View>
      )}
      <WebView
        style={styles.container}
        source={{
          uri: `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${state}`,
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
  naverLoadingContiner: {
    backgroundColor: colors.WHITE,
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NaverLogin;