import { colors } from "../constants/color";
import React from 'react';
import { Text } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DayOfWeeks from "./DayOfWeeks";
import { getDateWithSeparator, isSameAsCurrentDate, MonthYear } from "../utils/date";
import { FlatList } from "react-native-gesture-handler";
import DateBox from "./DateBox";
import YearSelector from "./YearSelector";
import useModal from "../hooks/useModal";

interface CalendarProps {
  monthYear: MonthYear;
  selectedDate: number;
  onPressDate: (date: number) => void;
  onChangeMonth: (increment: number) => void;
  purchaseDates: string[];
}

function Calendar({ monthYear, selectedDate, onChangeMonth, onPressDate, purchaseDates }: CalendarProps) {
  const { month, year, lastDate, firstDOW } = monthYear;
  const yearSelector = useModal()
  const handleChangeYear = (selectYear: number) => {
    onChangeMonth((selectYear - year) * 12);
    yearSelector.hide();
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Pressable onPress={() => onChangeMonth(-1)} style={styles.monthButtonContainer}>
          <Icons name="arrow-back" size={25} color={colors.BLACK} />
        </Pressable>
        <Pressable style={styles.monthYearContainer} onPress={YearSelector.show}>
          <Text style={styles.titleText}>{year}년 {month}월</Text>
          <MaterialIcons
            name="keyboard-arrow-down" size={23} color={colors.GRAY_500} />
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
              selectedDate={selectedDate}
              onPressDate={onPressDate}
              hasPurchase={purchaseDates.includes(getDateWithSeparator(new Date(year, month - 1, item.date), '-'))}
            />
          )}
          keyExtractor={item => String(item.id)}
          numColumns={7}
        />
      </View>
      <YearSelector 
      isVisible = {yearSelector.isVisible}
      currentYear = {year}
      onChangeYear = {handleChangeYear}
      hide = {yearSelector.hide}/>
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
    padding: 10
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.BLACK
  },
  bodyContainer: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.GRAY_500,
    backgroundColor: colors.GRAY_100
  }
});

export default Calendar;
