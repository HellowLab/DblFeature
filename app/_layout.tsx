import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import App from "./index";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <App />
    </GestureHandlerRootView>
  );
}
