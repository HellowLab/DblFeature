// Import necessary components from external libraries
import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import App from "./index";

// Define the RootLayout component as the default export
export default function RootLayout() {
  return (
    // GestureHandlerRootView is required to enable gesture handling in the app
    // Flex 1 ensures that the component takes up the full height of its parent
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Render the main App component */}
      <App />
    </GestureHandlerRootView>
  );
}
