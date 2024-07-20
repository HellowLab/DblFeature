import React from 'react';
import {TouchableOpacity, Text, Keyboard} from 'react-native';

// Import Custom Styles
import { myStyles } from '@/src/utils/constants/styles';

interface Props {
    onButtonClick: () => void,
    buttonText: string,
}

const SubmitButton: React.FC<Props> = ({ onButtonClick, buttonText }) => {
  return (
    <TouchableOpacity
        style={myStyles.buttonStyle}
        activeOpacity={0.5}
        onPress={onButtonClick}>
        <Text style={myStyles.buttonTextStyle}>
            {buttonText}
        </Text>
    </TouchableOpacity>
  )
};

export default SubmitButton;