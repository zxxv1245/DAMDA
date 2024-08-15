// InputField.tsx
import React, { useRef } from 'react';
import { StyleSheet, View, TextInput, Dimensions, TextInputProps, Text, Pressable } from 'react-native';
import { colors } from '../constants/color';

interface InputFieldProps extends TextInputProps {
  disabled?: boolean;
  error?: string;
  touched?: boolean;
}

const deviceHeight = Dimensions.get("screen").height;

function InputField({ disabled = false, error, touched, ...props }: InputFieldProps) {
  const innerRef = useRef<TextInput | null>(null);

  return (
    <Pressable onPress={() => { innerRef.current?.focus() }}>
      <View style={[
        styles.container, 
        disabled && styles.disabled, 
        touched && Boolean(error) && styles.inputError
      ]}>
        <TextInput 
          ref={innerRef}
          editable={!disabled}
          placeholderTextColor={colors.GRAY_500}
          style={[styles.input, disabled && styles.disabled]} 
          autoCapitalize='none'
          spellCheck={false}
          autoCorrect={false}
          {...props}
        />
      </View>
      {touched && error && <Text style={styles.error}>{error}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.GRAY_500,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginVertical: 5,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 50,
  },
  input: {
    fontSize: 16,
    color: colors.BLACK,
    flex: 1,
    textAlignVertical: 'center',
    padding: 0,
  },
  disabled: {
    backgroundColor: colors.GRAY_200,
    color: colors.GRAY_700,
  },
  inputError: {
    borderColor: colors.RED_300,
  },
  error: {
    color: colors.RED_500,
    fontSize: 12,
    paddingTop: 5,
  },
});

export default InputField;
