// CustomTextInput.tsx
import React, {useState} from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import sv from 'style-variants';
import {Svg, Path } from 'react-native-svg'

import { BORDERRADIUS } from '@/src/utils/constants';


type TextInputVariantsProps = {
  color?: 'card';
  width?: 'full' | "nearfull" | 'auto' | 'small' | 'medium' | 'large';
  height?: 'small' | 'medium' | 'large' | 'xlarge';
  intent?: 'normal' | 'password'
}

type MyTextInputProps = TextInputVariantsProps & TextInputProps;


const MyTextInput: React.FC<MyTextInputProps> = ({ color, width, height, intent, ...props }) => {
  const { colors } = useTheme();

  const EyeIcon: React.FC = () => {
    return (
      <Svg viewBox="0 0 24 24" fill={colors.text} width="24" height="24">
        <Path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <Path fillRule="evenodd" clipRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" />
      </Svg>
    );
  };
  
  const EyeOffIcon: React.FC = () => {
    return (
      <Svg viewBox="0 0 24 24" fill={colors.text} width="24" height="24">
        <Path d="M3.53 2.47a.75.75 0 0 0-1.06 1.06l18 18a.75.75 0 1 0 1.06-1.06l-18-18ZM22.676 12.553a11.249 11.249 0 0 1-2.631 4.31l-3.099-3.099a5.25 5.25 0 0 0-6.71-6.71L7.759 4.577a11.217 11.217 0 0 1 4.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113Z" />
        <Path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0 1 15.75 12ZM12.53 15.713l-4.243-4.244a3.75 3.75 0 0 0 4.244 4.243Z" />
        <Path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 0 0-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 0 1 6.75 12Z" />
      </Svg>
    );
  };

  const textinput = sv({
    base: {
      borderRadius: BORDERRADIUS,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      paddingHorizontal: 10
    },
    variants: {
      color: {
        card: {
          backgroundColor: colors.card,
        },
      },
      width: {
        full: {
          width: '100%',
        },
        nearfull: {
          width: '90%',
        },
        auto: {
          width: 'auto',
        },
        small: {
          width: 180
        },
        medium: {
          width: 240
        },
        large: {
          width: 300,
        },
      },
      height: {
        small: {
          height: 32,
        },
        medium: {
          height: 40,
        },
        large: {
          height: 48,
        },
        xlarge: {
          height: 56,
        },
      },
      intent: {
        normal: {

        },
        password: {
          flexDirection: "row",
          alignItems: "center", 
          justifyContent: "space-between"
        }
      }
    },
    defaultVariants: {
      color: 'card',
      width: 'auto',
      height: 'medium',
      intent: 'normal',
    },
  });

  const textInputStyles = textinput({
    width, 
    height,
    color,
    intent
  });

  // TODO add secureTextEntry if intent == 'password'
  // TODO add eyeBall to toggle secureTextEntry when eye is pressed
  if (intent == "password") {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
      setShowPassword((prevShowPassword) => !prevShowPassword);
    };
    return (
      <View style={textInputStyles} >
        <TextInput 
          style={{flex:1, color:colors.text}}
          placeholderTextColor={colors.text}
          secureTextEntry={!showPassword}
          {...props}
        />
        <Pressable onPress={togglePasswordVisibility}>
          {showPassword ? <EyeIcon /> : <EyeOffIcon /> }
        </Pressable>
        
      </View>
    )
  }

  return (
      <TextInput
        style={textInputStyles}
        placeholderTextColor={colors.text}
        {...props}
      />
  );
};

export default MyTextInput;
