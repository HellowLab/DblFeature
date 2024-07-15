import { ActivityIndicator } from "react-native";
import React from "react";

/**
 * LoadingIndicator component that displays a spinning activity indicator.
 *
 * @returns {JSX.Element} The loading indicator component.
 */
const LoadingIndicator: React.FC<{}> = () => {
  return <ActivityIndicator size="large" color="#F63A6E" />;
};

export default LoadingIndicator;
