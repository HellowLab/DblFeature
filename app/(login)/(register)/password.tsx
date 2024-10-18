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
import { registerUser } from "@/src/utils/APIs/api";

export default function PasswordScreen() {
  const router = useRouter();
  const { setUser } = useUserStore();

  // Get the current theme colors from the navigation context
  const { colors } = useTheme();
  
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [password, setPassword] = useState("");
  const { username, email } = useLocalSearchParams<{
    username: string;
    email: string;
  }>();

  const handleSubmit = async () => {
    setErrorText("");
    if (!password) {
      setErrorText("Please enter a valid password");
      return;
    }

    //Show Loader
    setLoading(true);
    const formData: RegistrationData = { username, email, password };
    try {
      // send api request to register new user
      const res = await registerUser(
        formData.email,
        formData.password,
        formData.password,
        formData.username
      );
      // if the login is successful
      if (res?.status == 201) {
        console.log("registration success");
        saveToken(res.data.access, res.data.refresh);
        setUser(res.data.user);
        setLoading(false);
        router.replace("/(drawer)");
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

  return (
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
      {errorText != "" ? <MyText color="error"> {errorText} </MyText> : null}

      {/* Show loading indicator when fetching data */}
      {loading && <ActivityIndicator size="large" color={colors.primary} />}
    </View>
  );
}
