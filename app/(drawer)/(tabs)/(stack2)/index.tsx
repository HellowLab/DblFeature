import { Text, View } from "react-native";
import { Link, useRouter } from 'expo-router';
import CustomButton from "@/src/components/Buttons/Button";

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
      <Text>THIS IS STACK 2.</Text>
      <CustomButton title="Primary Button" onPress={() => {}} color="primary" width="nearfull" size="large" />
      <CustomButton title="Secondary Button" onPress={() => {}} color="card" size="medium" />
      <CustomButton title="Tertiary Button" onPress={() => {}} color="opaque" width="auto" size="small" />
    </View>
  );
}
