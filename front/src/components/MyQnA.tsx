import React from 'react';
import {StyleSheet, View,Text} from 'react-native';
import { colors } from '../constants/color';

interface MyQnAProps {

}

function MyQnA({}: MyQnAProps) {
  return (
    <View style = {styles.container}>
      <Text style = {styles.cardText}>아직 아무 질문도 하지 않았어요</Text>
      <Text style = {styles.cardText}>질문을 해주세요!</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex : 1,
    justifyContent : 'center'
  },
  cardText : {
    textAlign : 'center',
    marginBottom : 100,
    color : colors.BLACK,
    fontSize : 20
  }
});

export default MyQnA;