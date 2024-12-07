import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";

import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserStore } from "@/src/utils/store/UserStore";
import { deleteToken } from "@/src/utils/store/TokenStore";
import { getStyles } from "./AccountSettingsScreenStyles";
import { deleteUserAccount, getMyUserInfo } from "@/src/utils/APIs/api";

import MyText from "@/src/components/TextOutput/TextOutput";
import MyButton from "@/src/components/Buttons/Button";
import ThemeBottomsheet from "@/src/components/Modals/ThemeBottomSheet";
import ProfilePicture from "@/src/components/images/ProfilePicture";
import { BORDERRADIUS } from "@/src/utils/constants";

export default function AccountSettingsScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors); // Pass colors to the styles function
  const router = useRouter();
  const { user, setUser } = useUserStore(); // Access the user data from the global store

  // Initialize the state variables with the user data
  const [updatedUser, setUpdatedUser] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState(
    user?.profile_picture || ""
  );
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const [showThemeSwitcher, setShowThemeSwitcher] = useState(false);

  useEffect(() => {
    // on mount pull user data from backend
    const fetchUserData = async () => {
      try {
        const response = await getMyUserInfo();
        if (response.status == 200) {
          console.log("User data fetched successfully");
          setUser(response.data);
        } else {
          console.log("Failed to fetch user data");
        }
      } catch (error) {
        console.log("Failed to fetch user data");
      }
    };
    fetchUserData();
  }, []);

  const logout = () => {
    // Clear the user data from the global store
    useUserStore.setState({ user: null });

    // Clear the user token from the secure store
    deleteToken();

    // Navigate to the login screen
    router.replace("/(login)");
  };

  const deleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            //   auth/delete-account
            try {
              const response = await deleteUserAccount();

              if (response.status == 200) {
                // Clear user data on successful deletion
                useUserStore.setState({ user: null });
                deleteToken();
                router.replace("/(login)");
              } else {
                const errorData = await response.json();
                Alert.alert(
                  "Error",
                  errorData.message || "Failed to delete account."
                );
              }
            } catch (error) {
              Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={{ width: "100%" }}
      >
        {/* Wrapper to entire screen */}
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 16,
            gap: 8,
          }}
        >
          {/* View for items at top of screen */}
          <View
            style={{
              flexDirection: "column",
              justifyContent: "flex-start",
              gap: 8,
            }}
          >
            {/* Account overview card with touchable wrapper */}
            <TouchableOpacity
              onPress={() => router.push("./UserDetails")}
              activeOpacity={0.5}
            >
              <View
                style={{
                  flexDirection: "column",
                  padding: 16,
                  gap: 16,
                  backgroundColor: colors.card,
                  borderRadius: BORDERRADIUS,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                {/* View for profile picture and user info */}
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    gap: 16,
                  }}
                >
                  {/* User Icon / Profile Image */}
                  <ProfilePicture size={100} />
                  {/* User info */}
                  <View
                    style={{
                      alignItems: "flex-start",
                      justifyContent: "center",
                      gap: 4,
                    }}
                  >
                    <MyText size="large">{user?.username}</MyText>
                    <MyText>{user?.first_name + " " + user?.last_name}</MyText>
                    <MyText>{user?.email}</MyText>
                  </View>
                </View>
                {/* User Bio */}
                <View style={{ flexDirection: "column", gap: 4 }}>
                  {user?.bio && <MyText bold={true}>ABOUT ME:</MyText>}
                  {user?.bio && <MyText>{user?.bio}</MyText>}
                </View>
              </View>
            </TouchableOpacity>
            {/* Change theme */}
            <MyButton
              width="full"
              color="card"
              textcolor="primary"
              onPress={() => setShowThemeSwitcher(true)}
            >
              Change Theme
            </MyButton>
          </View>

          <MyButton width="full" onPress={logout}>
            Logout
          </MyButton>
        </View>
      </ScrollView>
      {/* Bottom sheet modal for theme selection */}
      <ThemeBottomsheet
        isVisible={showThemeSwitcher}
        setIsVisible={setShowThemeSwitcher}
      />
    </View>
  );
}
