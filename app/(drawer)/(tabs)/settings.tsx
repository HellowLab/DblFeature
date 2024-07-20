import { Text, View } from "react-native";
import { Link } from 'expo-router';

export default function Settings() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/details">Nav to Details page</Link>
      <Text>Settings Screen</Text>
    </View>
  );
}
