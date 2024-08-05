import { colors } from "../constants/color";
import React, { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, FlatList } from 'react-native';
import Calendar from "./Calendar";
import { getMonthYearDetails, getNewMonthYear, getDateWithSeparator, formatDateWithDay, MonthYear } from "../utils/date";
import { fetchPurchases, fetchPurchaseDates, PurchaseResponseDto } from '../api/purchaseApi';
import YearSelector from "./YearSelector";
import useModal from "../hooks/useModal";

interface AccountBookProps {
}

function AccountBook({onChangeMonth }: AccountBookProps) {
  const currentMonthYear = getMonthYearDetails(new Date());
  const [monthYear, setMonthYear] = useState(currentMonthYear);
  const [selectedDate, setSelectedDate] = useState(0);
  const [purchases, setPurchases] = useState<PurchaseResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseDates, setPurchaseDates] = useState<string[]>([]);
  
  const handlePressDate = (date: number) => {
    setSelectedDate(date);
  }

  const handleUpdateMonth = (increment: number) => {
    setMonthYear(prev => getNewMonthYear(prev, increment));
    setSelectedDate(0);
    setPurchases([]);
  };

  const handleChangeYear = (selectYear: number) => {
    onChangeMonth((selectYear - year) * 12);
    yearSelector.hide();
  };


  useEffect(() => {
    const fetchPurchaseData = async () => {
      if (selectedDate > 0) {
        setIsLoading(true);
        try {
          const purchaseDate = getDateWithSeparator(new Date(monthYear.year, monthYear.month - 1, selectedDate), '-');
          const data = await fetchPurchases(purchaseDate);
          setPurchases(data);
        } 
        finally {
          setIsLoading(false);
        }
      }
    };

    fetchPurchaseData();
  }, [selectedDate, monthYear]);

  useEffect(() => {
    const fetchPurchaseDatesData = async () => {
      setIsLoading(true);
      try {
        const dates = await fetchPurchaseDates(monthYear.year, monthYear.month);
        setPurchaseDates(dates);
      } 
      finally {
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
        selectedDate={selectedDate}
        onPressDate={handlePressDate}
        purchaseDates={purchaseDates}
      />
      {selectedDate > 0 && (
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
                      <Text style={styles.productStore}>롯데마트 첨단점</Text>
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
    backgroundColor: colors.WHITE
  },
  listContainer: {
    flex: 1,
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 20,
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
    padding : 10,
    borderWidth : 1,
    borderColor : colors.BLACK,
    borderRadius : 15,
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
    borderLeftColor: colors.BLUE_500,
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
  productStore: {
    fontSize: 12,
    color: colors.GRAY_500,
  },
});

export default AccountBook;
