import { ActivityIndicator } from "react-native";
import React from "react";
import { useTheme } from "@react-navigation/native";

/**
 * LoadingIndicator component that displays a spinning activity indicator.
 *
 * @returns {JSX.Element} The loading indicator component.
 */
const LoadingIndicator: React.FC<{}> = () => {
  const { colors } = useTheme();
  return <ActivityIndicator size="large" color={colors.primary} />;
};

export default LoadingIndicator;
