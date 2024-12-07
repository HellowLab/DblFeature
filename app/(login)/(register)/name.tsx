import React, { useState } from "react";
import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import MyButton from "@/src/components/Buttons/Button";
import MyTextInput from "@/src/components/TextInput/TextInput";
import MyText from "@/src/components/TextOutput/TextOutput";

export default function EmailScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const router = useRouter();
  const { username, email } = useLocalSearchParams<{
    username: string;
    email: string;
  }>();
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleNext = () => {
    setErrorText(""); // reset error text
    if (!firstName || !lastName) {
      setErrorText("Please enter a valid first and last name");
      return;
    }

    router.push({
      pathname: "/password",
      params: { username, email, firstName, lastName },
    });
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
          Enter your First and Last Name
        </MyText>
        <MyTextInput
          width="nearfull"
          placeholder="Enter first name"
          onChangeText={setFirstName}
          autoCapitalize="words"
        />
        <MyTextInput
          width="nearfull"
          placeholder="Enter last name"
          onChangeText={setLastName}
          autoCapitalize="words"
        />
        <MyButton width="nearfull" onPress={handleNext}>
          Next
        </MyButton>
        {errorText != "" ? (
          <MyText align="center" color="error">
            {" "}
            {errorText}{" "}
          </MyText>
        ) : null}
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
