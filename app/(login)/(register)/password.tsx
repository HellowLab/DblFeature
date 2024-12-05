import React, { useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useTheme } from "@react-navigation/native";

import { useUserStore } from "@/src/utils/store/UserStore";
import { saveToken } from "@/src/utils/store/TokenStore";

import { RegistrationData } from "@/src/utils/types/types";
import MyText from "@/src/components/TextOutput/TextOutput";
import MyTextInput from "@/src/components/TextInput/TextInput";
import MyButton from "@/src/components/Buttons/Button";
import { getMyUserInfo, registerUser } from "@/src/utils/APIs/api";

export default function PasswordScreen() {
  const router = useRouter();
  const { setUser } = useUserStore();

  // Get the current theme colors from the navigation context
  const { colors } = useTheme();

  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [password, setPassword] = useState("");
  const { username, email, firstName, lastName } = useLocalSearchParams<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  }>();

  const handleSubmit = async () => {
    setErrorText("");
    // data quality checks
    if (password.length < 8) {
      setErrorText("Password must be at least 8 characters long");
      return;
    }
    if (password.length > 50) {
      setErrorText("Password must be at most 20 characters long");
      return;
    }
    // password must contain at least 1 letter, 1 number, and 1 special character
    if (
      !/[a-zA-Z]/.test(password) ||
      !/[0-9]/.test(password) ||
      !/[^a-zA-Z0-9]/.test(password)
    ) {
      setErrorText(
        "Password must contain at least 1 letter, 1 number, and 1 special character"
      );
      return;
    }

    //Show Loader
    setLoading(true);
    const formData: RegistrationData = {
      username,
      email,
      password1: password,
      password2: password,
      first_name: firstName,
      last_name: lastName,
    };

    try {
      // if any data is null return
      if (
        !formData.email ||
        !formData.password1 ||
        !formData.password2 ||
        !formData.username ||
        !firstName ||
        !lastName
      ) {
        setErrorText(
          "Email, password, Name, and username are required. Please go back and ensure all fields are filled out."
        );
        setLoading(false);
        return;
      }
      // send api request to register new user
      const res = await registerUser(formData);
      // if the login is successful
      if (res?.status == 201) {
        console.log("registration success");
        saveToken(res.data.access, res.data.refresh);
        const res2 = await getMyUserInfo();
        if (res2?.status == 200) {
          console.log("User: ", res2.data);
          setUser(res2.data);
          setLoading(false);
          router.replace("/(drawer)");
          return;
        }
        setErrorText("Unable to create new account, please try again");
      } else {
        // handle failed registration
        // Get the keys of the object
        const keys = Object.keys(res.data);
        // Assuming there's only one key and you want the first one
        const firstKey = keys[0];

        // Access the first item in the list associated with the first key - this is our error code
        if (res.data[firstKey]) {
          setErrorText(res.data[firstKey][0]);
        } else {
          // If the error code is not found, display a generic error message
          setErrorText("Unable to create new account, please try again");
        }
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
      setErrorText("Unable to create new account, please try again");
    }
  };

  return (
    <View
      style={{
        flex: 1,
        alignContent: "space-between",
        marginVertical: 20,
        margin: 8,
      }}
    >
      {/* Detail at top of screen to enter user info */}
      <View
        style={{
          flex: 1,
          alignItems: "center",
          gap: 16,
          marginTop: 20,
          margin: 8,
        }}
      >
        <MyText align="left" size="xlarge" bold>
          Enter your password
        </MyText>
        <MyText align="left" size="medium">
          You only need to enter your password once. Please double check that it
          is correct prior to submiting.
        </MyText>
        <MyTextInput
          intent="password"
          width="nearfull"
          placeholder="Enter password"
          onChangeText={setPassword}
          autoCapitalize="none"
        />
        <MyButton width="nearfull" onPress={handleSubmit}>
          Submit
        </MyButton>
        {errorText != "" ? (
          <MyText align="center" color="error">
            {" "}
            {errorText}{" "}
          </MyText>
        ) : null}
        {/* Show loading indicator when fetching data */}
        {loading && <ActivityIndicator size="large" color={colors.primary} />}
      </View>
      {/* Button to return to login page */}
      <MyButton
        width="nearfull"
        rounded="full"
        color="card"
        textcolor="primary"
        onPress={() => router.replace("/")}
      >
        Return to Login Page
      </MyButton>
    </View>
  );
}
