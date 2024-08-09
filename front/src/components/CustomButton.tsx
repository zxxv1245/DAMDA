// CustomButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { colors } from '../constants/color';

interface CustomButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'filled' | 'outlined';
  textStyle?: object;
  style?: object;
}

const CustomButton = ({ label, variant = 'filled', textStyle, style, ...props }: CustomButtonProps) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'outlined' && styles.outlined,
        style
      ]}
      {...props}
    >
      <Text style={[styles.buttonText, variant === 'outlined' && styles.outlinedText, textStyle]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.BLUE_300,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginVertical : 5,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlined: {
    backgroundColor: 'transparent',
    borderColor: colors.BLUE_300,
    borderWidth: 1,
  },
  buttonText: {
    color: colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  outlinedText: {
    color: colors.BLUE_300,
  },
  smallButton: {
    paddingVertical: 8, // 상하 패딩을 줄입니다.
    paddingHorizontal: 15,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CustomButton;
