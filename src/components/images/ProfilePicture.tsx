import React, { useState, useEffect } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useUserStore } from "@/src/utils/store/UserStore";
import { useTheme } from "@react-navigation/native";

type ProfilePictureProps = {
  size: number;
  onPress?: () => void;
  color?: string;
  [key: string]: any; // Additional props
};

const ProfilePicture: React.FC<ProfilePictureProps> = ({
  size = 100,
  onPress,
  color,
  ...props
}) => {
  const { user } = useUserStore();
  const { colors } = useTheme();
  const [ImageError, setImageError] = useState(false);
  // const [ImageComponent, setImageComponent] = useState<React.ReactNode | null>(
  //   null
  // );

  let ImageComponent;

  // Get the API_BASE_URL from the environment variables, if no value is set use a default value
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "";
  const profileURL = user?.profile_picture
    ? new URL(user.profile_picture, API_BASE_URL).href
    : null;

  if (ImageError) {
    ImageComponent = (
      <MaterialIcons
        name="account-circle"
        size={size}
        color={color ? color : colors.background}
        {...props}
      />
    );
  } else {
    ImageComponent = profileURL ? (
      <Image
        source={{ uri: profileURL }}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
        }}
        {...props}
        onError={() => setImageError(true)}
      />
    ) : (
      <MaterialIcons
        name="account-circle"
        size={size}
        color={color ? color : colors.background}
        {...props}
      />
    );
  }

  return onPress ? (
    <TouchableOpacity onPress={onPress}>{ImageComponent}</TouchableOpacity>
  ) : (
    <View>{ImageComponent}</View>
  );
};

export default ProfilePicture;
