import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Alert, ScrollView } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";

import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useUserStore } from "@/src/utils/store/UserStore";
import { deleteToken } from "@/src/utils/store/TokenStore";
import { getStyles } from "./AccountSettingsScreenStyles";
import {
  deleteUserAccount,
  editMyUserInfo,
  getMyUserInfo,
  updateProfilePicture,
} from "@/src/utils/APIs/api";
import { BORDERRADIUS } from "@/src/utils/constants";
import {
  selectImage,
  resizeImage,
} from "@/src/utils/callbacks/selectImageCallback";

import MyText from "@/src/components/TextOutput/TextOutput";
import MyButton from "@/src/components/Buttons/Button";
import MyTextInput from "@/src/components/TextInput/TextInput";
import ProfilePicture from "@/src/components/images/ProfilePicture";

export default function UserDetailsScreen() {
  const { colors } = useTheme();
  const styles = getStyles(colors); // Pass colors to the styles function
  const router = useRouter();
  const { user, setUser } = useUserStore(); // Access the user data from the global store

  // Initialize the state variables with the user data
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string>("");

  const [bio, setBio] = useState(user?.bio || "");
  const [profilePicture, setProfilePicture] = useState(
    user?.profile_picture || ""
  );
  const [firstName, setFirstName] = useState(user?.first_name || "");
  const [lastName, setLastName] = useState(user?.last_name || "");
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (
      firstName == user?.first_name &&
      lastName == user?.last_name &&
      email == user?.email &&
      bio == user?.bio
    ) {
      setShowUpdateButton(false);
    } else {
      setShowUpdateButton(true);
    }
  }, [firstName, lastName, email, bio, user]);

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

  const updateAccount = async () => {
    if (!showUpdateButton) {
      console.log("No changes to update");
      return;
    }
    //   auth/update-account
    const response = await editMyUserInfo({
      first_name: firstName,
      last_name: lastName,
      email: email,
      bio: bio,
    });
    if (response.status == 200) {
      console.log("Account updated successfully");
      setUser(response.data);
      return;
    } else {
      console.log("Failed to update account");
    }
  };

  const clickProfilePicture = async () => {
    console.log("Change profile picture");

    // Select an image from the device and upload it to the backend
    try {
      // Get the image URI from the image picker
      const image = await selectImage();
      console.log("Selected image URI: ", image);

      // Resize the image to reduce upload size
      const resizedImage = await resizeImage(image, 200, 200, 0.8);

      if (resizedImage) {
        // Upload the selected image to the server
        const response = await updateProfilePicture(resizedImage);

        if (response.status == 200) {
          // Update the user data and profile picture on successful upload
          console.log("Profile picture updated successfully");
          setUser(response.data);
          setProfilePicture(response.data.profile_picture);
        } else {
          // Display an error message on failed upload
          console.log("Failed to update profile picture");
          Alert.alert("Error", "Failed to update profile picture");
        }
      } else {
        console.log("No image selected");
      }
    } catch (error) {
      // Display an error message on image picker failure
      Alert.alert("Error", error?.toString() || "An unknown error occurred.");
    }
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
            paddingBottom: 24,
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
            {/* Account overview card (not touchable) */}
            <View
              style={{
                flexDirection: "column",
                padding: 8,
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
                  backgroundColor: colors.card,
                }}
              >
                {/* User Icon / Profile Image */}
                <ProfilePicture
                  size={100}
                  onPress={clickProfilePicture}
                  color={colors.primary}
                />
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
            </View>
            {/* Email */}
            <View style={{ flex: 1, gap: 2 }}>
              <MyText size="small">Email</MyText>
              <MyTextInput
                width="full"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
              />
            </View>
            {/* First Name */}
            <View style={{ flex: 1, gap: 2 }}>
              <MyText size="small">First Name</MyText>
              <MyTextInput
                width="full"
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="none"
              />
            </View>
            {/* Last Name */}
            <View style={{ flex: 1, gap: 2 }}>
              <MyText size="small">Last Name</MyText>
              <MyTextInput
                width="full"
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="none"
              />
            </View>
            {/* Use Bio */}
            <View style={{ flex: 1, gap: 2 }}>
              <MyText size="small">
                Bio (Tell your friends about yourself)
              </MyText>
              <MyTextInput
                width="full"
                value={bio}
                multiline={true}
                numberOfLines={4}
                height="fourlines"
                onChangeText={(text) => {
                  setBio(text);
                }}
                textAlign="left"
                textAlignVertical="top"
              />
            </View>
            {/* Cancel and Submit button for user info changes */}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <MyButton
                width="small"
                onPress={() => {
                  setBio(user?.bio || "");
                  setProfilePicture(user?.profile_picture || "");
                  setFirstName(user?.first_name || "");
                  setLastName(user?.last_name || "");
                  setUsername(user?.username || "");
                  setEmail(user?.email || "");
                }}
                color="card"
                textcolor="primary"
              >
                Cancel
              </MyButton>
              <MyButton
                width="small"
                onPress={updateAccount}
                color="primary"
                textcolor="white"
                disabled={!showUpdateButton}
              >
                Submit Changes
              </MyButton>
            </View>
          </View>

          <MyButton width="full" onPress={deleteAccount} color="error">
            Delete Account
          </MyButton>
        </View>
      </ScrollView>
    </View>
  );
}
