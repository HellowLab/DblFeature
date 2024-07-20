// CustomTextInput.tsx
import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { DarkTheme, Theme } from '@react-navigation/native';

interface CustomTextInputProps extends TextInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({ value, onChangeText, placeholder, ...props }) => {
  return (
    // <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        
        {...props}
      />
    // </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#151718',
    borderWidth: 1,
    borderRadius: 2,
    paddingHorizontal: 10,
    backgroundColor: '#151718',
  },
});

export default CustomTextInput;
