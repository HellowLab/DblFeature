import { View, Text, SafeAreaView, Image } from "react-native";
import { styles } from "./MatchesScreen.styles";
import movies from "../../assets/data/users";
import React from "react";

/**
 * MatchesScreen component that displays the movie matches.
 *
 * @returns {JSX.Element} The rendered screen.
 */
const MatchesScreen = () => {
  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        {/* Header text indicating new matches */}
        <Text style={styles.headerText}>New Matches</Text>
        <View style={styles.movies}>
          {/* Map through the movies array and render each movie */}
          {movies.map((movie) => (
            <View key={movie.id} style={styles.movie}>
              {/* Display the movie image */}
              <Image source={{ uri: movie.image }} style={styles.image} />
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MatchesScreen;
