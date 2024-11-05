import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { RegistrationData } from "@/src/utils/types/types";
import MyButton from "@/src/components/Buttons/Button";
import MyTextInput from "@/src/components/TextInput/TextInput";
import MyText from "@/src/components/TextOutput/TextOutput";

export default function EmailScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { username } = useLocalSearchParams<{ username: string }>();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  
  const handleNext = () => {
    router.push({
      pathname: "password",
      params: { username, email },
    });
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
        Enter your Email
      </MyText>
      <MyText align="left" size="medium">
        Your email will be used for password reset functionality and account communication. It will not be shared with other users.
      </MyText>
      <MyTextInput
        width="nearfull"
        placeholder="Enter email"
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <MyButton width="nearfull" onPress={handleNext}>
        Next
      </MyButton>
    </View>
  );
}
