import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { View } from "react-native";
import { useRouter } from "expo-router";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";

// Import Custom Components
import { AppLogo } from "@/src/components/images/AppLogo";
import MyButton from "@/src/components/Buttons/Button";

// Import Styles
import { myStyles } from "@/src/utils/constants/styles";

// Import Stores
import useThemeStore from "@/src/utils/store/ThemeStore";
import { useUserStore } from "@/src/utils/store/UserStore";
import { deleteToken } from "@/src/utils/store/TokenStore";
import MyText from "@/src/components/TextOutput/TextOutput";

import { updateMovieResult } from "@/src/utils/APIs/api";
import React from "react";

/**
 * Layout component responsible for rendering the app's main navigation drawer.
 * This includes multiple screens such as Home, My Movies, My Matches, Search, and a Tab Navigator.
 * @returns The root view with gesture handling enabled and a configured drawer component.
 */
export default function Layout() {
  return (
    // GestureHandlerRootView is required to enable gesture handling in the app
    // Flex 1 ensures that the component takes up the full height of its parent
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        // Custom drawer content defined by CustomDrawerContent component
        drawerContent={(props) => {
          return <CustomDrawerContent {...props} />;
        }}
        // Screen options with header hidden
        screenOptions={{ headerShown: false }}
        initialRouteName="(tabs)"
      >
        {/* Define different screens available in the drawer */}
        <Drawer.Screen name="(tabs)" options={{ title: "Home" }}/>
        {/* <Drawer.Screen name="(home)" options={{ title: "Home" }} />
        <Drawer.Screen name="(mymovies)" options={{ title: "My Movies" }} />
        <Drawer.Screen name="(matches)" options={{ title: "My Matches" }} />
        <Drawer.Screen name="(search)" options={{ title: "Search" }} /> */}
      </Drawer>
    </GestureHandlerRootView>
  );
}

/**
 * CustomDrawerContent component to render custom content inside the navigation drawer.
 * @param props The properties passed from the Drawer component.
 * @returns The custom drawer UI, including a logo, user greeting, drawer items, and action buttons.
 */
function CustomDrawerContent(props: any) {
  // Access theme toggle function from the theme store
  const { toggleTheme } = useThemeStore();

  // Access user management functions from the user store
  const { clearUser, user } = useUserStore();

  // Access the router for navigation
  const router = useRouter();

  /**
   * Handles the logout button press. Clears user data, deletes the token,
   * and redirects the user to the login screen.
   */
  const handleLogoutPress = () => {
    clearUser();
    deleteToken();
    router.replace("/(login)");
  };

  return (
    <DrawerContentScrollView {...props}>
      {/* Display the app logo */}
      <View style={myStyles.LogoStyle}>
        <AppLogo />
      </View>

      {/* Display a greeting message with the username */}
      <View style={{ alignItems: "center", marginBottom: 8 }}>
        <MyText size="large">Welcome {user?.username}</MyText>
      </View>

      {/* Render the list of drawer items */}
      <DrawerItemList {...props} />

      {/* Render action buttons for logout and theme toggling */}
      <View
        style={{
          flex: 1,
          alignContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Logout button */}
        <MyButton
          width="full"
          color="primary"
          textcolor="white"
          rounded={false}
          onPress={handleLogoutPress}
        >
          Logout
        </MyButton>

        {/* Theme toggle button */}
        <MyButton width="full" onPress={toggleTheme} rounded={false}>
          Toggle Theme
        </MyButton>
      </View>
    </DrawerContentScrollView>
  );
}
