import {StyleSheet, KeyboardAvoidingView, Alert, View, ScrollView, Button} from 'react-native';
import { Link, useRouter } from 'expo-router';

// Import custom style
import { myStyles } from '@/src/utils/constants/styles';

// Import Custom Components 
import Loader from '@/src/components/loaders/Loader'
import {AppLogoLightMode, AppLogoDarkMode} from '@/src/components/images/AppLogo';
import CustomTextInput from '@/src/components/TextInput/TextInput';
import SubmitButton from '@/src/components/Buttons/SubmitButton';
import MyButton from '@/src/components/Buttons/Button';

// Import theme
import useThemeStore from '@/src/utils/store/ThemeStore';

export default function Index() {
  const router = useRouter();
  const { theme } = useThemeStore();

  return (
    <KeyboardAvoidingView enabled style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'space-between',
          gap: 12,
          margin: 0,
          padding: 0,
          // width: '100%',
      }}>
        <View style={myStyles.LogoStyle}>
          {theme === 'dark' ? (<AppLogoDarkMode/>) : (<AppLogoLightMode/>)}
        </View>
          <CustomTextInput placeholder="Username" autoCapitalize="none"/>
          <CustomTextInput placeholder="Password" autoCapitalize="none" secureTextEntry />
          <MyButton width="small" height="medium" color="primary" textsize="medium" textcolor="white" onPress={() => router.replace('/(drawer)')}> Login </MyButton>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    margin: 0,
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    // borderWidth: 1, // Assuming you want a border around the view
    // borderColor: 'white', // You can change the border color as needed
  },
});