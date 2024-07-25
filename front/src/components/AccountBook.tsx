// AccountBook.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { Calendar, DateData, CalendarProps } from 'react-native-calendars';
import moment from 'moment';
import 'moment/locale/ko';  // 한국어 로케일 추가
import { colors } from '../constants/color';  // colors 파일 import
import { fetchPurchases } from '../api/productApi';


const { width, height } = Dimensions.get('window');

interface Purchase {
  id: string;
  item: string;
  amount: string;
}

interface MarkingProps {
  selected?: boolean;
  marked?: boolean;
  selectedColor?: string;
  dotColor?: string;
}

const years = Array.from({ length: 20 }, (_, i) => (2024 + i).toString());

function AccountBook() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>(moment().format('YYYY-MM'));
  const [yearModalVisible, setYearModalVisible] = useState<boolean>(false);

  // 임의의 데이터: 날짜별 구매 목록
  const data: { [key: string]: Purchase[] } = {
    '2024-07-25': [{ id: '1', item: '진로', amount: '1500원' }],
    '2024-07-26': [{ id: '2', item: '사이다', amount: '1400원' }, { id: '3', item: '초코과자', amount: '3000원' }],
  };

  // const [data, setData] = useState<{ [key: string]: Purchase[] }>({});
  // useEffect(() => {
  //   const loadPurchases = async () => {
  //     try {
  //       const apiData = await fetchPurchases(currentMonth);
  //       setData(apiData);
  //     } catch (error) {
  //       console.error('Error loading purchases:', error);
  //     }
  //   };

  //   loadPurchases();
  // }, [currentMonth]);

  const markedDates = Object.keys(data).reduce<Record<string, MarkingProps>>((acc, date) => {
    acc[date] = { marked: true, dotColor: colors.GREEN_500 };
    return acc;
  }, {});

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
    setPurchases(data[day.dateString] || []);
  };

  const onVisibleMonthsChange = (months: DateData[]) => {
    const month = months[0].year + '-' + String(months[0].month).padStart(2, '0');
    setCurrentMonth(month);
  };

  const renderHeader = () => {
    const header = moment(currentMonth, 'YYYY-MM').locale('ko').format('YYYY년 MM월');
    return (
      <View style={styles.header}>
        <Text style={styles.headerText}>{header}</Text>
        <TouchableOpacity onPress={() => setYearModalVisible(true)}>
          <Text style={styles.dropdownArrow}>⌄</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Modal visible={yearModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.yearContainer}>
              {years.map((year) => (
                <TouchableOpacity 
                  key={year} 
                  style={[
                    styles.yearButton, 
                    currentMonth.startsWith(year) && styles.selectedYearButton
                  ]} 
                  onPress={() => {
                    setCurrentMonth(`${year}-${currentMonth.split('-')[1]}`);
                    setYearModalVisible(false);
                  }}>
                  <Text 
                    style={[
                      styles.yearButtonText, 
                      currentMonth.startsWith(year) && styles.selectedYearButtonText
                    ]}>
                    {year}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setYearModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>닫기 ⌃</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Calendar
        onDayPress={onDayPress}
        onVisibleMonthsChange={onVisibleMonthsChange}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, marked: true, selectedColor: colors.PINK_500 },
        }}
        style={styles.calendar}
        renderHeader={renderHeader}
        theme={{
          calendarBackground: colors.WHITE,
          textSectionTitleColor: colors.GRAY_500,
          selectedDayBackgroundColor: colors.PINK_500,
          selectedDayTextColor: colors.WHITE,
          todayTextColor: colors.PINK_500,
          dayTextColor: colors.GRAY_700,
          textDisabledColor: colors.GRAY_200,
          monthTextColor: colors.BLACK,
          arrowColor: colors.PINK_500,
          textDayFontWeight: 'bold',
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          'stylesheet.calendar.header': {
            week: {
              marginTop: 5,
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingHorizontal: 10,
            },
            dayTextAtIndex0: {
              color: colors.RED_500,
            },
            dayTextAtIndex6: {
              color: colors.PINK_500,
            },
          },
        }}
        firstDay={1}
      />
      <View style={styles.listContainer}>
        <Text style={styles.title}>{selectedDate}의 구매 목록</Text>
        <FlatList
          data={purchases}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.item}</Text>
              <Text>{item.amount}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  calendar: {
    width: width,
    height: height * 0.5,
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: colors.GRAY_700,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.GRAY_200,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.BLACK,
  },
  dropdownArrow: {
    fontSize: 20,
    color: colors.BLACK,
    marginLeft: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  yearContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  yearButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    margin: 5,
    borderWidth: 1,
    borderColor: colors.GRAY_200,
    borderRadius: 5,
  },
  selectedYearButton: {
    backgroundColor: colors.PINK_500,
  },
  yearButtonText: {
    fontSize: 18,
    color: colors.GRAY_700,
  },
  selectedYearButtonText: {
    color: colors.WHITE,
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.BLACK,
  },
});

export default AccountBook;
