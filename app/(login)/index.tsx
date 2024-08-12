import {
  Text,
  KeyboardAvoidingView,
  Alert,
  View,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Link, useRouter } from "expo-router";

import React, {useState} from 'react';

// Import custom style
import { myStyles } from "@/src/utils/constants/styles";

// Import Custom Components 
import Loader from '@/src/components/loaders/Loader'
import {AppLogo} from '@/src/components/images/AppLogo';
import MyButton from '@/src/components/Buttons/Button';
import MyTextInput from '@/src/components/TextInput/TextInput';
import MyText from '@/src/components/TextOutput/TextOutput';

// Import Store / Context
import { getToken, saveToken, deleteToken } from '@/src/utils/store/TokenStore';
import { useUserStore} from '@/src/utils/store/UserStore'; 

// Import API
import { login } from '@/src/utils/APIs/api';

export default function Index() {
  const router = useRouter();
  const { user, setUser, clearUser } = useUserStore();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');


  const handleLogin = async () => {
    setErrorText('');
    if (!username || !password) {
      setErrorText('Please enter a valid username and password');
      return;
    }

    setLoading(true);
    try {
      deleteToken();
      const res = await login(username, password)

      // if the login is unsuccessful
      if (res.status != 200) {
        setErrorText(res?.data.non_field_errors[0])
        setLoading(false);
        return;
      }
      // if the login is successful
      if (res.status == 200) {
        saveToken(res.data.access, res.data.refresh);
        setUser(res.data.user);
        setLoading(false);
        router.replace('/(drawer)');
      }

    }
    catch (error) {
      console.error(error);
      setLoading(false);
      setErrorText('Invalid username or password');
    }
  }

  const selectRegister = () => {
    router.navigate("/register")
  }

  const selectForgotPassword = () => {
    router.navigate("/forgotpassword")
  }

  return (
    <KeyboardAvoidingView enabled style={styles.container}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
          gap: 12,
          margin: 0,
          padding: 0,
          // width: '100%',
      }}>
        <View style={myStyles.LogoStyle}>
          <AppLogo />
        </View>
          <MyTextInput width='large' placeholder='Username' onChangeText={setUsername} autoCapitalize='none'/>
          <MyTextInput width='large' intent='password' placeholder='Password' onChangeText={setPassword} autoCapitalize='none' />
          <MyButton width="large" height="medium" color="primary" textsize="medium" textcolor="white" onPress={() => handleLogin()}> Login </MyButton>
          <View style={{ flexDirection: 'row', justifyContent:"space-between"}}>
            <MyText onPress={selectRegister}>New User?</MyText>
            <MyText onPress={selectForgotPassword}>Forgot Password?</MyText>
          </View>
          {errorText != '' ? (
            <MyText color='error'> {errorText} </MyText>
          ) : null}
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
    width: "100%",
    // borderWidth: 1, // Assuming you want a border around the view
    // borderColor: 'white', // You can change the border color as needed
  },
});
