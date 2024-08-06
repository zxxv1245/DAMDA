// CustomButton.tsx

import React from 'react';
import {
  StyleSheet,
  Pressable,
  Text,
  PressableProps,
  Dimensions,
} from 'react-native';
import { colors } from '../constants/color';

interface CustomButtonProps extends PressableProps {
  label: string;
  variant?: 'filled' | 'outlined';
  size?: 'large' | 'medium';
}

const deviceHeight = Dimensions.get('screen').height;


function CustomButton({
  label,
  variant = 'filled',
  size = 'large',
  ...props
}: CustomButtonProps) {
  return (
    <Pressable
      style={[styles.container, styles[variant], styles[size]]}
      {...props}>
      <Text style={[styles.text, styles[`${variant}Text`]]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  container : {
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 20,
    justifyContent : 'center'
  },
  filled : {
    backgroundColor : colors.BLUE_300,
  },
  outlined : {
    borderColor : colors.BLUE_300,
    borderWidth : 1,
  },
  large : {
    width : '100%',
    paddingVertical: deviceHeight > 700 ? 15 : 12,
    alignItems : 'center',
    justifyContent : 'center'
  },
  medium : {
    width : '100%',
    paddingVertical: deviceHeight > 700 ? 12 : 8,
    alignItems : 'center',
    justifyContent : 'center'
  },
  text : {
    fontSize : 16,
    fontWeight : "700",
  },
  filledText : {
    color : colors.BLACK
  },
  outlinedText : {
    color : colors.BLACK
  }
});

export default CustomButton;