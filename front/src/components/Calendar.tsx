import React from 'react';
import { Text } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import DayOfWeeks from "./DayOfWeeks";
import { getDateWithSeparator, isSameAsCurrentDate, MonthYear } from "../utils/date";
import { FlatList } from "react-native-gesture-handler";
import DateBox from "./DateBox";
import { colors } from '../constants/color';

interface CalendarProps {
  monthYear: MonthYear;
  selectedDates: number[];
  onPressDate: (date: number) => void;
  onChangeMonth: (increment: number) => void;
  purchaseDates: string[];
}

function Calendar({ monthYear, selectedDates, onChangeMonth, onPressDate, purchaseDates }: CalendarProps) {
  const { month, year, lastDate, firstDOW } = monthYear;

  return (
    <>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => onChangeMonth(-1)} style={styles.monthButtonContainer}>
          <Icons name="arrow-back" size={25} color={colors.BLACK} />
        </Pressable>
        <Pressable style={styles.monthYearContainer}>
          <Text style={styles.titleText}>{year}년 {month}월</Text>
        </Pressable>
        <Pressable onPress={() => onChangeMonth(+1)} style={styles.monthButtonContainer}>
          <Icons name="arrow-forward" size={25} color={colors.BLACK} />
        </Pressable>
      </View>
      <DayOfWeeks />
      <View>
        <FlatList
          data={Array.from({ length: lastDate + firstDOW }, (_, i) => ({
            id: i,
            date: i - firstDOW + 1,
          }))}
          renderItem={({ item }) => (
            <DateBox
              date={item.date}
              isToday={isSameAsCurrentDate(year, month, item.date)}
              selectedDates={selectedDates}
              onPressDate={onPressDate}
              hasPurchase={purchaseDates.includes(getDateWithSeparator(new Date(year, month - 1, item.date), '-'))}
            />
          )}
          keyExtractor={item => String(item.id)}
          numColumns={7}
        />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 25,
    marginVertical: 16,
  },
  monthYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  monthButtonContainer: {
    padding: 10,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.BLACK,
  },
  bodyContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.GRAY_500,
    backgroundColor: colors.GRAY_100,
  },
});

export default Calendar;
