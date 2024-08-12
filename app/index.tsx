import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { getToken } from "@/src/utils/store/TokenStore";
import { View } from "react-native";
import { AppLogo } from "@/src/components/images/AppLogo";
import Loader from "@/src/components/loaders/Loader";

// This can be used as the splash screen to perform any api calls or other async tasks
// and then redirect to the login screen or any other screen if the user is already logged in.
const Index = () => {
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check if the user is logged in by checking if a token exists in the store
   * @returns Redirects to the login screen if no token is found, otherwise redirects to the home screen
   */
  const isLoggedIn = async () => {
    try {
      const token = await getToken();
      console.log("token: ", token);

      if (token) {
        router.push("/(drawer)");
      } else {
        router.push("/(login)");
      }
    } catch (error) {
      console.error("Error in isLoggedIn:", error);
    } finally {
      setIsLoading(false); // Stop showing the loader after navigation
    }
  };

  useEffect(() => {
    isLoggedIn(); // Check for stored token when the component mounts
  }, []);

  if (isLoading) {
    // Display the app logo and a loading spinner while the user's login status is checked -- acts as a splash screen
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <AppLogo />
        <Loader />
      </View>
    );
  }

  return null; // Return nothing once the loading is done to prevent loader from staying
};

export default Index;
