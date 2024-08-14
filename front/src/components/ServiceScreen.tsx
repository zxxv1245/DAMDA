import React from 'react';
import {StyleSheet, View, Text } from 'react-native';
import { colors } from '../constants/color';
import Icon from 'react-native-vector-icons/Ionicons';

interface ServiceScreenProps {

}

function ServiceScreen({}: ServiceScreenProps) {
  return (
    <View style = {styles.container}>
      <Text style = {styles.serviceText}>UWB 기반 사용자 추적과  YOLO V7을 이용한 물품 인식을 갖춘 IoT 스마트 쇼핑카트</Text>    
      <Text style = {styles.serviceText}>이 프로젝트는 UWB 기반의 사용자 위치 추적과 YOLO V7을 활용한 물품 인식 기능을 탑재한 IoT 스마트 쇼핑카트를 개발하는 것을 목표로 합니다. 이를 통해 사용자 편의성을 극대화하고 쇼핑 경험을 혁신하고자 합니다.</Text>    
      <View style={styles.AnnouncementContent}>
        <View style={styles.AnnouncenmentTextContainer}>
          <Text style={styles.AnnouncenmentText}>1.</Text>
          <Text style={styles.AnnouncenmentText}>[쇼핑카트] 실내 사용자 위치 추적 및 트래킹</Text>
        </View>
      </View>
      <View style={styles.AnnouncementContent}>
        <View style={styles.AnnouncenmentTextContainer}>
          <Text style={styles.AnnouncenmentText}>2.</Text>
          <Text style={styles.AnnouncenmentText}>[쇼핑카트] 물품 카메라 인식 및 바코드 인식</Text>
        </View>
      </View>
      <View style={styles.AnnouncementContent}>
        <View style={styles.AnnouncenmentTextContainer}>
          <Text style={styles.AnnouncenmentText}>3.</Text>
          <Text style={styles.AnnouncenmentText}>[쇼핑카트] 인식된 상품을 카트에 등록</Text>
        </View>
      </View>
      <View style={styles.AnnouncementContent}>
        <View style={styles.AnnouncenmentTextContainer}>
          <Text style={styles.AnnouncenmentText}>4.</Text>
          <Text style={styles.AnnouncenmentText}>[쇼핑카트] 상품의 위치 검색 기능</Text>
        </View>
      </View>
      <View style={styles.AnnouncementContent}>
        <View style={styles.AnnouncenmentTextContainer}>
          <Text style={styles.AnnouncenmentText}>5.</Text>
          <Text style={styles.AnnouncenmentText}>[담다 앱] 성인 인증 및 결제 기능</Text>
        </View>
      </View>
      <View style={styles.AnnouncementContent}>
        <View style={styles.AnnouncenmentTextContainer}>
          <Text style={styles.AnnouncenmentText}>6.</Text>
          <Text style={styles.AnnouncenmentText}>[담다 앱] 과거 결제 내역 및 가계부 기능</Text>
        </View>
      </View>
      <View style={styles.AnnouncementContent}>
        <View style={styles.AnnouncenmentTextContainer}>
          <Text style={styles.AnnouncenmentText}>7.</Text>
          <Text style={styles.AnnouncenmentText}>[담다 앱] 주변 마트 찾기 기능</Text>
        </View>
      </View>    
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  AnnouncementContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_400,
  },
  AnnouncenmentTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  AnnouncenmentText: {
    fontSize: 16,
    color: colors.BLACK,
    marginLeft: 10,
  },
  serviceText : {
    textAlign : 'center',
    paddingHorizontal : 15,
    marginVertical : 15,
  }
});

export default ServiceScreen;