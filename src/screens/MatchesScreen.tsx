import { View, Text, StyleSheet, SafeAreaView, Image } from "react-native";
import movies from "../assets/data/users";

/**
 * MatchesScreen component that displays the movie matches.
 *
 * @returns {JSX.Element} The rendered screen.
 */
const MatchesScreen = () => {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <Text style={styles.headerText}>New Matches</Text>
        <View style={styles.movies}>
          {movies.map((movie) => (
            <View key={movie.id} style={styles.movie}>
              <Image source={{ uri: movie.image }} style={styles.image} />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

// Define the styles for the MatchesScreen component
const styles = StyleSheet.create({
  root: {
    width: "100%",
    flex: 1,
    padding: 10,
  },
  container: {
    padding: 10,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#F63A6E",
  },
  movie: {
    width: 100,
    height: 100,
    margin: 10,
    borderWidth: 3,
    borderColor: "#F63A6E",
    borderRadius: 50,
    padding: 2,
  },
  movies: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
});

export default MatchesScreen;
