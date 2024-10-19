import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useRouter } from "expo-router";
import { RegistrationData } from "@/src/utils/types/types";
import MyText from "@/src/components/TextOutput/TextOutput";
import MyTextInput from "@/src/components/TextInput/TextInput";
import MyButton from "@/src/components/Buttons/Button";

export default function UsernameScreen() {
  const [username, setUsername] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleNext = () => {
    setErrorText(""); // reset error text
    if (!username) {
      setErrorText("Please enter a valid username");
      return;
    }
    if (username.length < 4) {
      setErrorText("Username must be at least 4 characters long");
      return;
    }
    if (username.length > 20) {
      setErrorText("Username must be at most 20 characters long");
      return
    }
    if (!/^[a-zA-Z0-9_]*$/.test(username)) {
      setErrorText("Username must contain only alphanumeric characters and underscores");
      return;
    }

    router.push({
      pathname: "/email",
      params: { username },
    });
  };

  return (
    <View style={{flex:1, alignItems: "center", gap:16, marginTop:20, margin: 8}}>
      <MyText align="left" size="xlarge" bold>Enter your desired username</MyText>
      <MyText align="left" size="medium">This username will be your default login and the name other users will use to communicate with you</MyText>
      <MyTextInput
        width="nearfull"
        placeholder="Enter username"
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <MyButton width="nearfull" onPress={handleNext}>Next</MyButton>
      {errorText != '' ? (
          <MyText align="center" color='error'> {errorText} </MyText>
        ) : null}
    </View>
  );
}
