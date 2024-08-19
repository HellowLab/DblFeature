import React, { useState } from "react";
import { View, Modal, TouchableWithoutFeedback, SafeAreaView, FlatList, ActivityIndicator } from "react-native";
import { useTheme } from "@react-navigation/native";
import { styles } from "./SearchScreen.styles";
import SearchBar from "@/src/components/SearchBar";
import MovieFlipCard from "@/src/components/MovieFlipCard";
import MovieCardOne from "@/src/components/MovieFlipCard/MovieCardOne";

import { searchMovies, getMovieDetails } from "@/src/utils/APIs/TMDB";
import SearchItem from "@/src/components/SearchItem";
import { tmdbMovie, DjangoMovie } from "@/src/utils/types/types";
import { getMyMovie } from "@/src/utils/APIs/api";

const SearchScreen = () => {
  // Get the current theme colors from the navigation context
  const { colors } = useTheme();

  // State variables for managing search query, loading state, search results, and selected movie
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<tmdbMovie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<tmdbMovie | null>(null);

  // State to hold the selected movie item to display in the modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovieResult, setSelectedMovieResult] = useState<DjangoMovie | null>(null);
  
  /**
   * Handles the search operation by fetching movie data based on the user's query.
   * If the query is longer than 2 characters, it initiates an API call to search for movies.
   * The results are sorted by relevance and popularity before being stored in the state.
   *
   * @param text - The search query entered by the user.
   */
  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      setLoading(true);
      try {
        let movies = await searchMovies(text);

        // Sort movies by relevance (title match) and then by popularity
        movies = movies.sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          const queryLower = text.toLowerCase();
          const aRelevance = aTitle.includes(queryLower) ? 0 : 1;
          const bRelevance = bTitle.includes(queryLower) ? 0 : 1;
          if (aRelevance !== bRelevance) {
            return aRelevance - bRelevance;
          }
          return b.popularity - a.popularity;
        });

        // Update the results state with sorted movies
        setResults(movies);
      } catch (error) {
        // Log any errors encountered during the search operation
        console.error("Error fetching search results:", error);
      } finally {
        // Ensure loading state is turned off after the search operation
        setLoading(false);
      }
    } else {
      // Clear results if query is too short
      setResults([]);
    }
  };

  /**
   * Handles the selection of a movie from the search results.
   * Fetches detailed information about the selected movie and updates the state.
   *
   * @param movie - The movie selected by the user from the search results.
   */
  const handleSelectMovie = async (movie: tmdbMovie) => {
    // setLoading(true);
    const movieDetails = await getMovieDetails(movie.id);

    try {      
      const movieResultResponse = await getMyMovie(undefined, movie.id);
      console.log("movieResultResponse", movieResultResponse);
      if (movieResultResponse.status === 200) {
        setSelectedMovieResult(movieResultResponse.data);
      }
    } catch (error) {
      // Log any errors encountered while fetching movie details
      console.error("Error fetching movie details:", error);
    } finally {
      // Ensure loading state is turned off after fetching movie details
      setLoading(false);
    }

    
      // Update the selected movie and clear the search results
      setSelectedMovie(movieDetails);
      setModalVisible(true);
      // setResults([]);
      // setQuery(movie.title);
  };

  /**
   * Renders each movie item in the FlatList.
   *
   * @param item - The movie item to be rendered.
   * @returns JSX element representing a search item.
   */
  const renderMovieItem = ({ item }: { item: tmdbMovie }) => (
    <SearchItem movie={item} onPress={() => handleSelectMovie(item)} />
  );

  return (
    <SafeAreaView style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Search bar component with theme-based styling */}
      <SearchBar
        query={query}
        onSearch={handleSearch}
        style={{ backgroundColor: colors.card }}
        inputStyle={{ color: colors.text }}
      />

      {/* Show loading indicator when fetching data */}
      {loading && <ActivityIndicator size="large" color={colors.primary} />}

      {/* Display search results if available, otherwise show the selected movie */}
      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          style={styles.resultsList}
        />
      )}
      {selectedMovie && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableWithoutFeedback>
                <MovieCardOne
                  movie={selectedMovie}
                  movieResult={selectedMovieResult}
                />
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
