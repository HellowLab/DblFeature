// Import React and Component
import { useState } from "react";
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { saveToken } from "@/src/utils/store/TokenStore";
import { useRouter } from "expo-router";

// Import Custom Components
import MyButton from "@/src/components/Buttons/Button";
import MyText from "@/src/components/TextOutput/TextOutput";
import MyTextInput from "@/src/components/TextInput/TextInput";
import { registerUser } from "@/src/utils/APIs/api";
import { AppLogo } from "@/src/components/images/AppLogo";
import React from "react";

const RegisterScreen = () => {
  const router = useRouter();

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userPasswordOne, setUserPasswordOne] = useState("");
  const [userPasswordTwo, setUserPasswordTwo] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const handleSubmitButton = async () => {
    setErrorText("");
    if (
      !userName ||
      !userEmail ||
      !firstName ||
      !lastName ||
      !userPasswordOne ||
      !userPasswordTwo
    ) {
      setErrorText("All fields must be filled in");
      // Alert.alert('All fields must be filled in');
      return;
    }
    if (userPasswordOne != userPasswordTwo) {
      setErrorText("Passwords must match");
      // Alert.alert('Passwords must match');
      return;
    }
    //Show Loader
    setLoading(true);
    try {
      // send api request to register new user
      const res = await registerUser(
        userEmail,
        userPasswordOne,
        userPasswordTwo,
        firstName,
        lastName,
        userName
      );
      // if the login is successful
      // console.log(res.status);
      if (res?.status == 201) {
        console.log("registration success");
        saveToken(res.data.access, res.data.refresh);
        setIsRegistraionSuccess(true);
        return;
      } else {
        // handle failed registration
        // Get the keys of the object
        const keys = Object.keys(res.data);
        // Assuming there's only one key and you want the first one
        const firstKey = keys[0];
        // Access the first item in the list associated with the first key - this is our error code
        setErrorText(res.data[firstKey][0]);
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErrorText("Unable to create new account, please try again");
    }
  };

  const handleRegistrationSuccessButton = () => {
    router.replace("/(login)");
  };

  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <AppLogo />
        <MyText size="xlarge">Registration was successful!</MyText>
        <MyButton
          width="large"
          textsize="medium"
          onPress={handleRegistrationSuccessButton}
        >
          Return to Login
        </MyButton>
      </View>
    );
  }
  
  return (
    <KeyboardAvoidingView enabled style={{    
      flex: 1,
      flexDirection: "column",
      margin: 0,
      padding: 0,
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
    }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: "flex-start",
          alignContent: "center",
          gap: 20,
          margin: 0,
          paddingTop: 32,
        }}
      >
        <MyTextInput
          width="large"
          placeholder="Enter email"
          onChangeText={setUserEmail}
        />
        <MyTextInput
          width="large"
          placeholder="Enter User Name"
          onChangeText={setUserName}
        />
        <MyTextInput
          width="large"
          placeholder="Enter First Name"
          onChangeText={setFirstName}
        />
        <MyTextInput
          width="large"
          placeholder="Enter Last Name"
          onChangeText={setLastName}
        />
        <MyTextInput
          width="large"
          placeholder="Enter Password"
          intent="password"
          onChangeText={setUserPasswordOne}
        />
        <MyTextInput
          width="large"
          placeholder="Re-enter Password"
          intent="password"
          onChangeText={setUserPasswordTwo}
        />
        <MyButton width="large" textsize="medium" onPress={handleSubmitButton}>
          Register
        </MyButton>
        {errorText != "" ? <MyText color="error"> {errorText} </MyText> : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
