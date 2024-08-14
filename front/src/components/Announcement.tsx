import React from 'react';
import {StyleSheet, View,Text} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/color';
interface AnnouncementProps {

}

function Announcement({}: AnnouncementProps) {
  return (
    <View style={styles.container}>
      <View style={styles.AnnouncementContent}>
        <View style={styles.AnnouncenmentTextContainer}>
          <Text style={styles.AnnouncenmentText}>1.</Text>
          <Text style={styles.AnnouncenmentText}>담다가 시작 되었습니다!</Text>
        </View>
        <Icon name="chevron-forward-outline" size={20} color={colors.BLACK} />
      </View>
      <View style={styles.AnnouncementContent}>
        <View style={styles.AnnouncenmentTextContainer}>
          <Text style={styles.AnnouncenmentText}>2.</Text>
          <Text style={styles.AnnouncenmentText}>업데이트 - 0.0.1</Text>
        </View>
        <Icon name="chevron-forward-outline" size={20} color={colors.BLACK} />
      </View>
      <View style={styles.AnnouncementContent}>
        <View style={styles.AnnouncenmentTextContainer}>
          <Text style={styles.AnnouncenmentText}>3.</Text>
          <Text style={styles.AnnouncenmentText}>업데이트 - 0.0.2</Text>
        </View>
        <Icon name="chevron-forward-outline" size={20} color={colors.BLACK} />
      </View>
      <View style={styles.AnnouncementContent}>
        <View style={styles.AnnouncenmentTextContainer}>
          <Text style={styles.AnnouncenmentText}>4.</Text>
          <Text style={styles.AnnouncenmentText}>업데이트 - 0.0.3</Text>
        </View>
        <Icon name="chevron-forward-outline" size={20} color={colors.BLACK} />
      </View>
      <View style={styles.AnnouncementContent}>
        <View style={styles.AnnouncenmentTextContainer}>
          <Text style={styles.AnnouncenmentText}>5.</Text>
          <Text style={styles.AnnouncenmentText}>서비스 종료 안내</Text>
        </View>
        <Icon name="chevron-forward-outline" size={20} color={colors.BLACK} />
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
});

export default Announcement;