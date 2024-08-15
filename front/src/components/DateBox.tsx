import React from 'react';
import { StyleSheet, View, Text, Dimensions, Pressable } from 'react-native';
import { colors } from '../constants/color';

interface DateBoxProps {
  date: number;
  selectedDates: number[];
  onPressDate: (date: number) => void;
  isToday: boolean;
  hasPurchase: boolean;
}

const deviceWidth = Dimensions.get('window').width;

function DateBox({ date, selectedDates, onPressDate, isToday, hasPurchase }: DateBoxProps) {
  const isSelected = selectedDates.includes(date);

  return (
    <Pressable style={styles.container} onPress={() => onPressDate(date)}>
      {date > 0 &&
        <View style={[
          styles.dateContainer,
          isSelected && styles.selectedContainer,
          isSelected && isToday && styles.selectedTodayContainer
        ]}>
          <Text style={[
            styles.dateText,
            isToday && styles.todayText,
            isSelected && styles.selectedDateText
          ]}>
            {date}
          </Text>
          {hasPurchase && !isSelected && <View style={styles.purchaseDot} />}
        </View>
      }
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {
    width: deviceWidth / 7,
    height: deviceWidth / 7,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.GRAY_200,
    alignItems: 'center',
  },
  dateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.WHITE,
  },
  selectedContainer: {
    backgroundColor: colors.BLACK,
  },
  dateText: {
    fontSize: 17,
    color: colors.BLACK,
  },
  selectedDateText: {
    color: colors.WHITE,
    fontWeight: 'bold',
  },
  todayText: {
    color: colors.PINK_700,
    fontWeight: 'bold',
  },
  selectedTodayContainer: {
    backgroundColor: colors.PINK_700,
  },
  purchaseDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.RED_500,
    position: 'absolute',
    bottom: -4,
  },
});

export default DateBox;
