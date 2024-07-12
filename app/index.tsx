import { View, StyleSheet } from "react-native";
import Card, { CardProps } from "@/src/components/MovieCard";
import movies from "../src/assets/data/users";

const elon_musk: CardProps = {
  name: "Elon Musk",
  image: "https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/elon.png",
  bio: "A dude with a rocket is looking for a gal with fuel",
};

export default function Index() {
  return (
    <View style={styles.pageContainer}>
      <Card movie={movies[0]} />
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});
