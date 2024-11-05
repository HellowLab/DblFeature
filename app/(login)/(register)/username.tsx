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
    router.push({
      pathname: "email",
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
    </View>
  );
}
