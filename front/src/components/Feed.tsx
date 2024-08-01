import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';
import { StackParamList } from '../Navigations/StackNavigator';
import { TabParamList } from '../Navigations/TabNavigator';
import { colors } from '../constants/color';
import { stackNavigations } from '../constants';
import useAuth from '../hooks/queries/useAuth';
import { fetchTotalPriceByMonth } from '../api/purchaseApi';

type FeedNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabParamList, 'FeedStack'>,
  StackNavigationProp<StackParamList>
>;

function Feed() {
  const { isLogin } = useAuth();
  const [totalPrice, setTotalPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<FeedNavigationProp>();

  useEffect(() => {
    const getTotalPrice = async () => {
      try {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const price = await fetchTotalPriceByMonth(year, month);
        console.log(isLogin);
        if (isLogin) {
          setTotalPrice(price);
        }
        
      } finally {
        setLoading(false);
      }
    };

    if (isLogin) {
      getTotalPrice();
    }
  }, [isLogin]);

  return (
    <View style={styles.container}>
      {isLogin ? (
        <>
          <TouchableOpacity style={styles.header} onPress={() => navigation.navigate('가계부')}>
            <Text style={styles.title}>이번 달 사용 금액</Text>
            {loading ? (
              <ActivityIndicator size="large" color={colors.PINK_500} />
            ) : (
              <Text style={styles.amount}>{totalPrice?.toLocaleString()}원</Text>
            )}
          </TouchableOpacity>
          <View style={styles.recentOrders}>
            <Text style={styles.subTitle}>최근 주문 목록</Text>
            <View style={styles.orderList}>
              {['땅콩 피넛버터 크런치 피넛버터 300g 1개', '땅콩 피넛버터 크런치 피넛버터 300g 1개', '땅콩 피넛버터 크런치 피넛버터 300g 1개'].map((item, index) => (
                <View key={index} style={styles.orderItem}>
                  <Text style={styles.orderDate}>24.07.31</Text>
                  <Text style={styles.orderText}>{item}</Text>
                  <Text style={styles.orderPrice}>14,400원</Text>
                  <Text style={styles.orderSubText}>롯데마트 첨단점</Text>
                </View>
              ))}
            </View>
          </View>
        </>
      ) : (
        <View style={styles.loggedOutContainer}>
          <TouchableOpacity onPress={() => navigation.navigate(stackNavigations.AUTH_HOME)}>
            <Text style={styles.loggedOutText}>로그인하고 이번 달 사용 금액을 조회하세요.</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.content}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.largeButton]}
            onPress={() => navigation.navigate(stackNavigations.MAPSCREEN)}
          >
            <Text style={styles.buttonText}>주변 마트 찾기</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.largeButton]}
            onPress={() => navigation.navigate('QR결제')}
          >
            <Text style={styles.buttonText}>QR 결제</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.adContainer}>
          <Text style={styles.adText}>광고 공간</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: colors.GRAY_200,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginTop: 20,
    width: '100%',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  amount: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginTop: 10,
  },
  recentOrders: {
    width: '100%',
    paddingVertical: 20,
    backgroundColor: colors.WHITE,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.BLACK,
    marginBottom: 15,
  },
  orderList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderItem: {
    width: '30%',
    padding: 15,
    backgroundColor: colors.GRAY_100,
    borderRadius: 10,
    alignItems: 'center',
  },
  orderDate: {
    fontSize: 12,
    color: colors.GRAY_500,
    marginBottom: 5,
  },
  orderText: {
    fontSize: 14,
    color: colors.BLACK,
    marginBottom: 5,
    textAlign: 'center',
  },
  orderSubText: {
    fontSize: 12,
    color: colors.GRAY_500,
    marginBottom: 5,
    textAlign: 'center',
  },
  orderPrice: {
    fontSize: 14,
    color: colors.PINK_500,
    fontWeight: 'bold',
  },
  loggedOutContainer: {
    backgroundColor: colors.GRAY_200,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 15,
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loggedOutText: {
    fontSize: 18,
    color: colors.GRAY_700,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    width: '100%',
  },
  button: {
    backgroundColor: colors.GRAY_200,
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: '48%',
    alignItems: 'flex-start', 
  },
  largeButton: {
    height: 170,
  },
  buttonText: {
    fontSize: 16,
    color: colors.BLACK,
    fontWeight: 'bold',
  },
  adContainer: {
    backgroundColor: colors.GRAY_200,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 120,
  },
  adText: {
    fontSize: 18,
    color: colors.BLACK,
    fontWeight: 'bold',
  },
});

export default Feed;
