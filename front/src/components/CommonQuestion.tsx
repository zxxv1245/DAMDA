import React from 'react';
import {StyleSheet, View,Text} from 'react-native';
import { colors } from '../constants/color';

interface CommonQuestionProps {

}

function CommonQuestion({}: CommonQuestionProps) {
  return (
    <View style = {styles.container}>
      <Text style = {styles.cardText}>아직 자주 묻는 질문이 존재하지 않아요!</Text>
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

export default CommonQuestion;