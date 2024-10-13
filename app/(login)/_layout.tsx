import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import React from "react";

export default function HomeLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        options={{ title: "Login", headerShown: false }}
        name="index"
      />
      <Stack.Screen
        options={{ title: "Forgot Password" }}
        name="forgotpassword"
      />
      <Stack.Screen options={{ title: "Register" }} name="(register)" />
      {/* <Stack.Screen options={{title:"Create Account"}} name="register" /> */}
    </Stack>
  );
}
