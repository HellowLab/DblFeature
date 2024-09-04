import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { getToken, getRefreshToken } from "@/src/utils/store/TokenStore";
import { View, ActivityIndicator } from "react-native";
import { AppLogo } from "@/src/components/images/AppLogo";
import Loader from "@/src/components/loaders/Loader";

import { getMyUserInfo, isTokenValid } from "@/src/utils/APIs/api";
import { useUserStore } from "@/src/utils/store/UserStore";

// This can be used as the splash screen to perform any api calls or other async tasks
// and then redirect to the login screen or any other screen if the user is already logged in.
const Index = () => {
  const { setUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check if the user is logged in by checking if a token exists in the store
   * @returns Redirects to the login screen if no token is found, otherwise redirects to the home screen
   */
  const isLoggedIn = async () => {
    try {
      // Check if the token is valid
      const validToken = await isTokenValid();
      
      if (validToken) {
        // if token is valid, get my user info using token
        const userRes = await getMyUserInfo();

        // if user info is successfully fetched, navigate to the drawer screen
        if (userRes.status === 200) {
          setUser(userRes.data);
          router.push("/(drawer)");
        }
        else {
          // if user info cannot be fetched, redirect to the login screen
          router.push("/(login)");
        } 
      //   // Add a 3-second delay before navigating to the drawer screen
      //   setTimeout(() => {
      //     // this is a good opportunity to refresh other app level data while still in the splash screen
      //     router.push("/(drawer)");
      //   }, 3000);
      }
      else {
        // if the token cannot be found or refreshed, redirect to the login screen
        router.push("/(login)");
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error in isLoggedIn:", error);
      router.push("/(login)");
      setIsLoading(false);
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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null; // Return nothing once the loading is done to prevent loader from staying
};

export default Index;
