import {StyleSheet, useColorScheme, TextInput, Text, KeyboardAvoidingView, Alert, View, ScrollView, Button} from 'react-native';
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
          width: '100%',
          // marginTop: -120
      }}>
        <View style={myStyles.LogoStyle}>
          {colorScheme === 'dark' ? (<AppLogoDarkMode/>) : (<AppLogoLightMode/>)}
        </View>
          <CustomTextInput placeholder="Username" autoCapitalize="none"/>
          <CustomTextInput placeholder="Password" autoCapitalize="none" secureTextEntry />
          {/* <Button title="Submit" onPress={() => alert('Logged In')} /> */}
          {/* <Button title="Login" onPress={() => router.replace('/(drawer)')} /> */}
          <SubmitButton buttonText='Login' onButtonClick={() => router.replace('/(drawer)')}/>
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