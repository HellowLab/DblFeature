// Import React and Component
import React, {useState, useRef} from 'react';
import {Alert,StyleSheet, TextInput, View, Text, Image, KeyboardAvoidingView, Keyboard, TouchableOpacity, ScrollView,} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

// Import Custom Styles

// Import Custom Components

const RegisterScreen = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userToken, setUserToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const emailInputRef = useRef<TextInput | null>(null);
  const ageInputRef = useRef<TextInput | null>(null);
  const addressInputRef = useRef<TextInput | null>(null);
  const passwordInputRef = useRef<TextInput | null>(null);

  const handleSubmitButton = () => {
    setErrortext('');
    if (!userName) {
      Alert.alert('Please fill username');
      return;
    }
    if (!userEmail) {
      Alert.alert('Please fill Email');
      return;
    }
    if (!firstName) {
      Alert.alert('Please fill first name');
      return;
    }
    if (!lastName) {
      Alert.alert('Please fill last name');
      return;
    }
    if (!userPassword) {
      Alert.alert('Please fill Password');
      return;
    }
    //Show Loader
    setLoading(true);
    var dataToSend = {
      username: userName,
      first_name: firstName,
      last_name: lastName,
      email: userEmail,
      password: userPassword,
    };

  //   registerUser(dataToSend)
  //     .then(res => {
  //       const token = res.data.token;
  //       setUserToken(token);
  //       AsyncStorage.setItem('userToken', token);
  //       AsyncStorage.setItem('username', userName)
  //       axios.defaults.headers.common.Authorization = `Token ${token}`; // this applies the token to all future axios requests
  //       setLoading(false);
  //       setIsRegistraionSuccess(true)
  //       // RootNavigation.replace('DrawerNavigationRoutes');
  //     })
  //     .catch(err => {
  //       setIsRegistraionSuccess(false)
  //       console.log('err: ', err);
  //       setLoading(false);
  //       Alert.alert(JSON.stringify(err)); // displays error code to user
  //       // TO DO -- ADD TRANSLATIONS FOR ERRORS
  //     });
  };
  
  if (isRegistraionSuccess) {
    return (
      <View style={{}}>
        {/* <AppLogo/>
        <StandardText text_string='Registration was successful!' />
        <SubmitButton buttonText='Login Now' onButtonClick={() => RootNavigation.replace('DrawerNavigationRoutes')} /> */}
      </View>
    );
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
          {/* <View style={myStyles.SectionStyle}>
            <StandardTextInput textplaceholder='Enter User Name' setText={setUserName} />
          </View>
          <View style={myStyles.SectionStyle}>
            <StandardTextInput textplaceholder='Enter First Name' setText={setFirstName} />
          </View>
          <View style={myStyles.SectionStyle}>
            <StandardTextInput textplaceholder='Enter Last Name' setText={setLastName} />
          </View>
          <View style={myStyles.SectionStyle}>
            <StandardTextInput textplaceholder='Enter Email' setText={setUserEmail} />
          </View>
          <View style={myStyles.SectionStyle}>
            <PasswordTextInput textplaceholder='Enter Password' setText={setUserPassword} />
          </View>
          {errortext != '' ? (
            <Text style={myStyles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null}
          <SubmitButton buttonText='Register' onButtonClick={handleSubmitButton} /> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

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