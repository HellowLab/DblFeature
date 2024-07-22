// CustomTextInput.tsx
import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { useTheme } from '@react-navigation/native';

interface CustomTextInputProps extends TextInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
}


const CustomTextInput: React.FC<CustomTextInputProps> = ({ value, onChangeText, placeholder, ...props }) => {
  const { colors } = useTheme();

  return (
      <TextInput
        style={[styles.input, {backgroundColor: colors.card, color: colors.text, borderColor: colors.border}]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text}
        {...props}
      />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 10,
    
  },
});

export default CustomTextInput;
