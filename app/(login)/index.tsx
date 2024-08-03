import {useColorScheme, TextInput, Text, KeyboardAvoidingView, Alert, View, ScrollView, Button} from 'react-native';
import { Link, useRouter } from 'expo-router';

// Import custom style
import { myStyles } from '@/src/utils/constants/styles';

// Import Custom Components 
import Loader from '@/src/components/loaders/Loader'
import {AppLogoLightMode, AppLogoDarkMode} from '@/src/components/images/AppLogo';
import CustomTextInput from '@/src/components/TextInput/TextInput';
import SubmitButton from '@/src/components/Buttons/SubmitButton';

// Import your global CSS file
import "@/global.css"

export default function Index() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  return (
    <KeyboardAvoidingView enabled className='flex flex-col items-center justify-center border'>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'space-between',
          padding: 0,
          borderColor: "white",
          gap: 12,
          // marginTop: -120
      }}>
        <View style={myStyles.LogoStyle}>
          {colorScheme === 'dark' ? (<AppLogoDarkMode/>) : (<AppLogoLightMode/>)}
        </View>
        <CustomTextInput placeholder="Username" autoCapitalize="none" />
        <CustomTextInput placeholder="Password" autoCapitalize="none" secureTextEntry />
        {/* <Button title="Submit" onPress={() => alert('Logged In')} /> */}
        {/* <Button title="Login" onPress={() => router.replace('/(drawer)')} /> */}
        <SubmitButton buttonText='Login' onButtonClick={() => router.replace('/(drawer)')}/>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}