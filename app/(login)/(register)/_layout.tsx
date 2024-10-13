import { Stack } from "expo-router";
import { useTheme } from "@react-navigation/native";
import React, { useState } from "react";

export default function HomeLayout() {
  const { colors } = useTheme();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  return (
    <Stack initialRouteName="username" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="username" options={{ title: "Username" }} />
      <Stack.Screen name="email" options={{ title: "Email" }} />
      <Stack.Screen name="password" options={{ title: "Password" }} />
    </Stack>
  );
}
