import React from 'react';
import {
  StyleSheet,
  Pressable,
  Text,
  PressableProps,
  Dimensions,
} from 'react-native';

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
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 5, // 추가: 세로 마진
    borderRadius: 4,
    justifyContent : 'center'
  },
  filled : {
    backgroundColor : '#C63B64',
  },
  outlined : {
    borderColor : '#C63B64',
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
    color : "white"
  },
  outlinedText : {
    color : '#C63B64'
  }
});

export default CustomButton;