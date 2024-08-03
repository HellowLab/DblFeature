import { Text, View, Button } from "react-native";
import { Link, useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href="/details">Nav to Details page</Link>
      <Button title="Logout" onPress={() => router.replace('/(login)')} />
      <Text>THIS IS STACK 2.</Text>

    </View>
  );
}
