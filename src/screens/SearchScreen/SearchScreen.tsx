import React, { useState } from "react";
import { SafeAreaView, FlatList, ActivityIndicator } from "react-native";
import { styles } from "./SearchScreen.styles";
import SearchBar from "@/src/components/SearchBar";
import MovieFlipCard from "@/src/components/MovieFlipCard";
import { searchMovies, getMovieDetails, Movie } from "@/src/utils/APIs/TMDB";
import SearchItem from "@/src/components/SearchItem";

const SearchScreen = () => {
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  /**
   * Handles the search input and fetches movie results.
   *
   * @param {string} text - The search query.
   */
  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length > 2) {
      setLoading(true);
      try {
        let movies = await searchMovies(text);
        // Sort by relevance to the query (closest match)
        movies = movies.sort((a, b) => {
          const aTitle = a.title.toLowerCase();
          const bTitle = b.title.toLowerCase();
          const queryLower = text.toLowerCase();
          const aRelevance = aTitle.includes(queryLower) ? 0 : 1;
          const bRelevance = bTitle.includes(queryLower) ? 0 : 1;
          if (aRelevance !== bRelevance) {
            return aRelevance - bRelevance;
          }
          // Then sort by popularity in descending order
          return b.popularity - a.popularity;
        });
        setResults(movies);
      } catch (error) {
        console.error("Error fetching search results:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  /**
   * Handles the selection of a movie and fetches its details.
   *
   * @param {Movie} movie - The selected movie.
   */
  const handleSelectMovie = async (movie: Movie) => {
    setLoading(true);
    try {
      // Fetch detailed information about the selected movie
      const movieDetails = await getMovieDetails(movie.id);
      setSelectedMovie(movieDetails);
      setResults([]);
      setQuery(movie.title);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders a movie item in the search results.
   *
   * @param {Object} item - The movie item.
   * @returns {JSX.Element} The rendered movie item.
   */
  const renderMovieItem = ({ item }: { item: Movie }) => (
    <SearchItem movie={item} onPress={() => handleSelectMovie(item)} />
  );

  return (
    <SafeAreaView style={styles.root}>
      {/* Search bar for movie queries */}
      <SearchBar query={query} onSearch={handleSearch} />
      {/* Show loading indicator while fetching data */}
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      {/* Render search results or selected movie details */}
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          style={styles.resultsList}
        />
      ) : (
        selectedMovie && <MovieFlipCard movie={selectedMovie} />
      )}
    </SafeAreaView>
  );
};

export default SearchScreen;
