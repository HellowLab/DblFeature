// CustomTextInput.tsx
import React, {useState} from 'react';
import { View, TextInput, StyleSheet, TextInputProps, Pressable } from 'react-native';
import { useTheme } from '@react-navigation/native';
import sv from 'style-variants';
import { EyeIcon, EyeOffIcon } from '@/src/components/SVG/svg'; 

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
