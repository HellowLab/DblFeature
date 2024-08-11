import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

// Import API functions
import { getMovieResults } from "@/src/utils/APIs/api";

// Import Types
import { MovieResult } from "@/src/utils/types/types";

// Import theme / colors
import { useTheme } from "@react-navigation/native";
import MyText from "@/src/components/TextOutput/TextOutput";

/**
 * Displays a list of movies that the user has swiped left (disliked) or right (liked) on.
 * Fetches movie results from an API and allows the user to refresh the list.
 *
 * @returns {JSX.Element} The rendered component displaying the list of movies.
 */
const MovieResultsScreen = (): JSX.Element => {
  const { colors } = useTheme(); // Access theme colors

  // State to hold movie results, loading status, and refresh status
  const [movieResults, setMovieResults] = useState<MovieResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State to control the collapse/expand status of liked and disliked movie sections
  const [likedCollapsed, setLikedCollapsed] = useState(false);
  const [dislikedCollapsed, setDislikedCollapsed] = useState(true);

  /**
   * Fetches movie results from the API, sorts them by ID in descending order,
   * and filters out duplicate movies based on their tmdb_id.
   */
  const fetchMovieResults = async () => {
    try {
      const response = await getMovieResults();

      // Sort data by movie ID in descending order
      const sortedData: MovieResult[] = response.data.sort(
        (a: MovieResult, b: MovieResult) => b.id - a.id
      );

      // Filter out duplicate movies based on their tmdb_id
      const uniqueData: MovieResult[] = sortedData.filter(
        (item: MovieResult, index: number, self: MovieResult[]) =>
          index ===
          self.findIndex((t: MovieResult) => t.tmdb_id === item.tmdb_id)
      );

      setMovieResults(uniqueData); // Update state with unique, sorted data
    } catch (error) {
      console.error(error); // Log any errors
    } finally {
      setLoading(false); // Set loading to false after data is fetched
      setRefreshing(false); // Stop the refresh indicator
    }
  };

  // Fetch movie results on component mount
  useEffect(() => {
    fetchMovieResults();
  }, []);

  // Refresh the list of movies when the user pulls down to refresh
  const handleRefresh = () => {
    setRefreshing(true);
    fetchMovieResults();
  };

  /**
   * Renders a single movie item in the list.
   *
   * @param {Object} param0 - Object containing the movie item to be rendered.
   * @param {MovieResult} param0.item - The movie item to be displayed.
   * @returns {JSX.Element} The rendered movie item.
   */
  const renderMovieItem = ({ item }: { item: MovieResult }) => (
    <View
      style={{
        marginBottom: 8,
        padding: 8,
        flexDirection: "row",
        backgroundColor: colors.card,
        alignItems: "center",
      }}
    >
      {item.poster && (
        <Image
          source={{ uri: item.poster }}
          style={{ width: 66, height: 99 }}
        />
      )}
      <View
        style={{
          flex: 1,
          marginLeft: 10,
          justifyContent: "space-evenly",
        }}
      >
        <MyText size="large">{item.name}</MyText>
        <MyText size="medium">
          {item.liked ? "Swiped Right -- Liked" : "Swiped Left -- Not Liked"}
        </MyText>
      </View>
      <View style={{ alignItems: "center" }}>
        {item.liked ? (
          <AntDesign name="checkcircle" size={24} color="green" />
        ) : (
          <AntDesign name="closecircle" size={24} color="red" />
        )}
      </View>
    </View>
  );

  // Separate movies into liked and disliked categories
  const likedMovies = movieResults.filter((movie) => movie.liked);
  const dislikedMovies = movieResults.filter((movie) => !movie.liked);

  // Show a loading indicator while data is being fetched
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView
      style={{ flex: 1, padding: 8, marginBottom: 50 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Liked Movies Section */}
      <TouchableOpacity onPress={() => setLikedCollapsed(!likedCollapsed)}>
        <View
          style={{
            padding: 10,
            backgroundColor: colors.card,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <MyText size="large">Liked Movies</MyText>
          <AntDesign
            name={likedCollapsed ? "down" : "up"}
            size={24}
            color={colors.text}
          />
        </View>
      </TouchableOpacity>
      {!likedCollapsed && (
        <FlatList
          data={likedMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          scrollEnabled={false} // Disable scrolling inside FlatList
        />
      )}

      {/* Disliked Movies Section */}
      <TouchableOpacity
        onPress={() => setDislikedCollapsed(!dislikedCollapsed)}
      >
        <View
          style={{
            padding: 10,
            backgroundColor: colors.card,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <MyText size="large">Disliked Movies</MyText>
          <AntDesign
            name={dislikedCollapsed ? "down" : "up"}
            size={24}
            color={colors.text}
          />
        </View>
      </TouchableOpacity>
      {!dislikedCollapsed && (
        <FlatList
          data={dislikedMovies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          scrollEnabled={false} // Disable scrolling inside FlatList
        />
      )}
    </ScrollView>
  );
};

export default MovieResultsScreen;
