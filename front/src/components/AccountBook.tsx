import { colors } from "../constants/color";
import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, FlatList, Pressable } from 'react-native';
import Calendar from "./Calendar";
import { getMonthYearDetails, getNewMonthYear, getDateWithSeparator, formatDateWithDay, MonthYear } from "../utils/date";
import { fetchPurchases, fetchPurchaseDates, PurchaseResponseDto } from '../api/purchaseApi';
import { useNavigation } from '@react-navigation/native';
import { stackNavigations } from '../constants';
import Icon from 'react-native-vector-icons/Ionicons';

interface AccountBookProps {
  onChangeMonth?: (increment: number) => void;
}

function AccountBook({ onChangeMonth }: AccountBookProps) {
  const currentMonthYear = getMonthYearDetails(new Date());
  const [monthYear, setMonthYear] = useState(currentMonthYear);
  const [selectedDates, setSelectedDates] = useState<number[]>([]);
  const [purchases, setPurchases] = useState<PurchaseResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseDates, setPurchaseDates] = useState<string[]>([]);
  const navigation = useNavigation();
  
  const handlePressDate = (date: number) => {
    setSelectedDates(prev => {
      const newDates = prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date];
      return newDates.sort((a, b) => a - b); // 날짜를 항상 정렬
    });
  };

  const handleUpdateMonth = (increment: number) => {
    setMonthYear(prev => getNewMonthYear(prev, increment));
    setSelectedDates([]);
    setPurchases([]);
  };

  useEffect(() => {
    const fetchPurchaseData = async () => {
      if (selectedDates.length > 0) {
        setIsLoading(true);
        try {
          const data = await Promise.all(
            selectedDates.map(async date => {
              const purchaseDate = getDateWithSeparator(new Date(monthYear.year, monthYear.month - 1, date), '-');
              return await fetchPurchases(purchaseDate);
            })
          );
          setPurchases(data.flat());
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPurchaseData();
  }, [selectedDates, monthYear]);

  useEffect(() => {
    const fetchPurchaseDatesData = async () => {
      setIsLoading(true);
      try {
        const dates = await fetchPurchaseDates(monthYear.year, monthYear.month);
        setPurchaseDates(dates);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPurchaseDatesData();
  }, [monthYear]);

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        monthYear={monthYear}
        onChangeMonth={handleUpdateMonth}
        selectedDates={selectedDates}
        onPressDate={handlePressDate}
        setSelectedDates={setSelectedDates} // 드래그 이벤트를 위한 setter 전달
        purchaseDates={purchaseDates}
      />
      <Pressable style={styles.pressableContainer} onPress={() => navigation.navigate(stackNavigations.PURCHASESADD)}>
        <Icon name="add" size={40} color={colors.BLUE_300} />
      </Pressable>
      {selectedDates.length > 0 && (
        <View style={styles.listContainer}>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Text>Loading...</Text>
            </View>
          ) : (
            <FlatList
              data={purchases}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemDate}>{formatDateWithDay(new Date(item.purchaseDate))}</Text>
                    <Text style={styles.itemTotalPrice}>-{item.totalPrice.toLocaleString()}원</Text>
                  </View>
                  {item.purchaseProducts.map((product, index) => (
                    <View style={styles.productItem} key={`${item.id}-${product.productName}-${index}`}>
                      <Text style={styles.productName}>{product.productName} {product.count}개</Text>
                      <Text style={styles.productPrice}>{product.totalPrice.toLocaleString()}원</Text>
                    </View>
                  ))}
                </View>
              )}
              keyExtractor={item => item.id}
            />
          )}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
    width: '100%',
    paddingHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: colors.BLACK,
  },
  item: {
    marginBottom: 15, // 간격 추가
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.WHITE,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.BLACK,
    borderRadius: 15,
  },
  itemDate: {
    fontSize: 16,
    color: colors.BLACK,
  },
  itemTotalPrice: {
    fontSize: 16,
    color: colors.RED_500,
  },
  productItem: {
    paddingVertical: 5,
    borderLeftWidth: 3,
    borderLeftColor: colors.BLUE_250,
    marginVertical: 5,
    paddingLeft: 10,
  },
  productName: {
    fontSize: 16,
    color: colors.BLACK,
  },
  productPrice: {
    fontSize: 14,
    color: colors.GRAY_700,
  },
  pressableContainer : {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    borderColor : colors.BLUE_250
  },
  pressableText : {
    fontSize: 16,
    fontWeight: '700',
    color: colors.BLACK,
  },
});

export default AccountBook;
