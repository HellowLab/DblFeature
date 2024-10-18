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

  const containerSV = sv({
    base: {
      borderRadius: BORDERRADIUS,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 10,
    },
    variants: {
      color: {
        card: {
          backgroundColor: colors.card,
        },
      },
      width: {
        full: {
          width: "100%",
        },
        nearfull: {
          width: "95%",
        },
        auto: {
          width: "auto",
        },
        small: {
          width: 180,
        },
        medium: {
          width: 240,
        },
        large: {
          width: 300,
        },
      },
      height: {
        small: {
          height: 40,
        },
        medium: {
          height: 48,
        },
        large: {
          height: 56,
        },
        xlarge: {
          height: 64,
        },
      },
      intent: {
        normal: {},
        password: {
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        },
      },
    },
    defaultVariants: {
      color: "card",
      width: "auto",
      height: "medium",
      intent: "normal",
    },
  });

  const textSV = sv({
    base: {
      color: colors.text,
    },
    variants: {
      size: {
        small: {
          fontSize: 16,
        },
        medium: {
          fontSize: 18,
        },
        large: {
          fontSize: 20,
        },
        xlarge: {
          fontSize: 22,
        },
      },
      intent: {
        normal: {
          
        },
        password: {
          flex: 1,
        },
      },
    },
    defaultVariants: {
      size: "medium",
      intent: "normal",
    },
  });

  const textStyle = textSV({
    size: height,
    intent: intent,
  });

  const containerStyles = containerSV({
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
      <View
        style={containerStyles}>
        <TextInput
          style={textStyle}
          placeholderTextColor={colors.text}
          secureTextEntry={!showPassword}
          {...props}
        />
        <Pressable onPress={togglePasswordVisibility}>
          {showPassword ? <EyeIcon /> : <EyeOffIcon />}
        </Pressable>
      </View>
    );
  }

  return (
      <TextInput
        style={[containerStyles, textStyle]}
        placeholderTextColor={colors.text}
        {...props}
      />
  );
};

export default MyTextInput;
