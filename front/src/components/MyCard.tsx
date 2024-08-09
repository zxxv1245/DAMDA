import { StyleSheet, View, Text, Button } from 'react-native';
import React, { useState } from 'react';
import DatePicker from 'react-native-date-picker';
import { format } from 'date-fns';
import { colors } from '../constants/color';
import CustomButton from './CustomButton';

interface MyCardProps {}

function MyCard({}: MyCardProps) {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.birthDateContainer}>
      <Text style={styles.dateText}>생년월일: {format(date, 'yyyy-MM-dd')}</Text>
      <CustomButton
        label="선택"
        onPress={() => setOpen(true)}
        style={styles.smallButton}
      />
      <DatePicker
        modal
        open={open}
        date={date}
        mode="date"
        locale="ko"
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        title="생년월일 선택"
        confirmText="확인" 
        cancelText="취소"  
        theme="light"
        
      />
    </View>
  );
}

const styles = StyleSheet.create({
  birthDateContainer: {
    flexDirection : 'row',
    padding: 16,
  },
  dateText: {
    flex : 1,
    fontSize: 18,
    color: colors.GRAY ,
    marginTop : 10
  },
  smallButton : {
    paddingVertical: 8, 
    paddingHorizontal: 20,
    marginLeft: 10,
    backgroundColor: colors.BLUE_250,
  }
});

export default MyCard;
