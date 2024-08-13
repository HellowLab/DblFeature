import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { styles } from "./MyMoviesScreen.styles";

// Import API functions
import { getMovieResults } from "@/src/utils/APIs/api";
import { getMovieDetails } from "@/src/utils/APIs/TMDB";

// Import Types
import { DjangoMovie } from "@/src/utils/types/types";
import { tmdbMovie } from "@/src/utils/types/types";

// Import theme / colors
import { useTheme } from "@react-navigation/native";
import MyText from "@/src/components/TextOutput/TextOutput";
import MyButton from "@/src/components/Buttons/Button";
import MovieFlipCard from "@/src/components/MovieFlipCard";

/**
 * Displays a list of movies that the user has swiped left (disliked) or right (liked) on.
 * Fetches movie results from an API and allows the user to refresh the list.
 *
 * @returns {JSX.Element} The rendered component displaying the list of movies.
 */
const MovieResultsScreen = (): JSX.Element => {
  const { colors } = useTheme(); // Access theme colors

  // State to hold movie results, loading status, and refresh status
  const [movieResults, setMovieResults] = useState<DjangoMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // State to control the collapse/expand status of liked and disliked movie sections
  const [likedCollapsed, setLikedCollapsed] = useState(false);
  const [dislikedCollapsed, setDislikedCollapsed] = useState(true);

  // State to hold the selected movie item to display in the modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<tmdbMovie | null>(null);
  const [selectedMovieResult, setSelectedMovieResult] =
    useState<DjangoMovie | null>(null);
  /**
   * Fetches movie results from the API, sorts them by ID in descending order,
   * and filters out duplicate movies based on their tmdb_id.
   */
  const fetchMovieResults = async () => {
    try {
      const response = await getMovieResults();

      // Sort data by movie ID in descending order
      const sortedData: DjangoMovie[] = response.data.sort(
        (a: DjangoMovie, b: DjangoMovie) => b.id - a.id
      );

      // Filter out duplicate movies based on their tmdb_id
      const uniqueData: DjangoMovie[] = sortedData.filter(
        (item: DjangoMovie, index: number, self: DjangoMovie[]) =>
          index ===
          self.findIndex((t: DjangoMovie) => t.tmdb_id === item.tmdb_id)
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
   * Set modal visibility to true and set the selected movie item when a movie is pressed.
   * @param {DjangoMovie} item - The movie item that was pressed.
   */
  const handleMoviePress = async (item: DjangoMovie) => {
    const tmdbMovieDetails = await getMovieDetails(item.tmdb_id);
    setSelectedMovie(tmdbMovieDetails);
    setSelectedMovieResult(item);
    setModalVisible(true);
  };

  /**
   * Renders a single movie item in the list.
   *
   * @param {Object} param0 - Object containing the movie item to be rendered.
   * @param {DjangoMovie} param0.item - The movie item to be displayed.
   * @returns {JSX.Element} The rendered movie item.
   */
  const renderMovieItem = ({ item }: { item: DjangoMovie }) => (
    <TouchableOpacity onPress={() => handleMoviePress(item)}>
      <View
        style={[styles.movieItemContainer, { backgroundColor: colors.card }]}
      >
        {item.poster && (
          <Image source={{ uri: item.poster }} style={styles.posterImage} />
        )}
        <View style={styles.movieInfoContainer}>
          <MyText size="large">{item.name}</MyText>
          <MyText size="medium">
            {item.liked ? "Swiped Right -- Liked" : "Swiped Left -- Not Liked"}
          </MyText>
        </View>
        <View style={styles.iconContainer}>
          {item.liked ? (
            <AntDesign name="checkcircle" size={24} color="green" />
          ) : (
            <AntDesign name="closecircle" size={24} color="red" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Separate movies into liked and disliked categories
  const likedMovies = movieResults.filter((movie: DjangoMovie) => movie.liked);
  const dislikedMovies = movieResults.filter(
    (movie: DjangoMovie) => !movie.liked
  );

  // Show a loading indicator while data is being fetched
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Show a message if there are no movie results
  if (!movieResults.length) {
    return (
      <ScrollView
        style={{ flex: 1, padding: 8, marginBottom: 50 }}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
        }} // Use contentContainerStyle
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
          }}
        >
          <MyText size="large">You don't have any matches yet</MyText>
          <MyText size="large">
            Swipe right on movies to like them and find your matches here
          </MyText>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Liked Movies Section */}
      <TouchableOpacity onPress={() => setLikedCollapsed(!likedCollapsed)}>
        <View style={[styles.sectionHeader, { backgroundColor: colors.card }]}>
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
        <View style={[styles.sectionHeader, { backgroundColor: colors.card }]}>
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
                <MovieFlipCard
                  movie={selectedMovie}
                  movieResult={selectedMovieResult}
                />
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </ScrollView>
  );
};

export default MovieResultsScreen;
