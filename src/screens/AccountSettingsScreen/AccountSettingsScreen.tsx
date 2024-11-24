import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";

import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useUserStore } from "@/src/utils/store/UserStore";
import { deleteToken } from "@/src/utils/store/TokenStore";
import { getStyles } from "./AccountSettingsScreenStyles";
import { deleteUserAccount } from "@/src/utils/APIs/api";

export default function AccountSettingsScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors); // Pass colors to the styles function
  const router = useRouter();
  const { user } = useUserStore(); // Access the user data from the global store

  // Initialize the state variables with the user data
  const [profilePicture, setProfilePicture] = useState(user?.profile_picture || "");
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "")

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

  const updateUserInfo = async () => {

  }

  return (
    <ScrollView>
      <View style={styles.container}>
        {/* Profile Picture Placeholder */}
        <View style={styles.profilePictureContainer}>
          <MaterialIcons
            name="account-circle"
            size={100}
            color={colors.primary}
          />
        </View>

        {/* Add Bio */}
        <View style={styles.bioContainer}>
          <TextInput
            style={styles.bioInput}
            placeholder={user?.bio || "No Bio..."}
            placeholderTextColor={colors.text}
            editable={false}
            multiline={true}
            textAlign="center"
          />
        </View>

        {/* First Name and Last Name */}
        <View style={styles.rowContainer}>
          <View style={styles.halfInputContainer}>
            <TextInput
              style={styles.input}
              placeholder={user?.first_name || "First Name"}
              placeholderTextColor={colors.text}
              editable={false}
              textAlign="center"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <TextInput
              style={styles.input}
              placeholder={user?.last_name || "Last Name"}
              placeholderTextColor={colors.text}
              editable={false}
              textAlign="center"
            />
          </View>
        </View>

        {/* Username and Email */}
        <View style={styles.rowContainer}>
          <View style={styles.halfInputContainer}>
            <TextInput
              style={styles.input}
              placeholder={user?.username || "Username"}
              placeholderTextColor={colors.text}
              editable={false}
              textAlign="center"
            />
          </View>
          <View style={styles.halfInputContainer}>
            <TextInput
              style={styles.input}
              placeholder={user?.email || "Email"}
              placeholderTextColor={colors.text}
              editable={false}
              textAlign="center"
            />
          </View>
        </View>

        {/* Password Fields */}
        <View style={styles.optionContainer}>
          <TextInput
            style={styles.fullWidthInput}
            placeholder="Change Password"
            placeholderTextColor={colors.text}
            editable={true}
            textAlign="center"
          />
        </View>
        <View style={styles.optionContainer}>
          <TextInput
            style={styles.fullWidthInput}
            placeholder="Confirm Change Password"
            placeholderTextColor={colors.text}
            editable={false}
            textAlign="center"
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: colors.error, marginTop: 10 },
          ]}
          onPress={deleteAccount}
        >
          <Text style={styles.logoutText}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
