// MyMoviesScreen.tsx

import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ViewStyle,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createStyles, flashMessageStyles } from "./MyMoviesScreen.styles";

// API utility functions
import {
  createMovieList,
  getMovieLists,
  getMovieResults,
  deleteMovieList,
  addMovieToList,
  removeMovieFromList as removeMovieFromListApi,
  removeMovieFromList,
} from "@/src/utils/APIs/api";

import { getMovieDetails } from "@/src/utils/APIs/TMDB";
import { DjangoMovie, tmdbMovie } from "@/src/utils/types/types";
import { useTheme } from "@react-navigation/native";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import MyText from "@/src/components/TextOutput/TextOutput";
import MovieGridItem from "@/src/components/MovieGridItem";
import MovieModal from "@/src/components/Modals/MovieModal";
import AddListModal from "@/src/components/Modals/AddListModal";
import CreateListModal from "@/src/components/Modals/CreateListModal";
import DeleteListModal from "@/src/components/Modals/DeleteListModal";
import MovieList from "@/src/components/MovieList";
import FlashMessage, { showMessage } from "react-native-flash-message";

// Define constants for the different categories
const LikedMovies = "LikedMovies";
const MovieLists = "MovieLists";
const DislikedMovies = "DislikedMovies";

// Main screen component for displaying movie results and managing movie lists
const MovieResultsScreen = (): JSX.Element => {
  const { colors } = useTheme(); // Access theme colors for styling
  const styles = createStyles(colors); // Generate styles based on the current theme

  // State variables for managing movie data and UI interactions
  const [movieResults, setMovieResults] = useState<DjangoMovie[]>([]);
  const [movieLists, setMovieLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(LikedMovies);
  const [modalVisible, setModalVisible] = useState(false);
  const [newListModalVisible, setNewListModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<tmdbMovie | null>(null);
  const [selectedMovieResult, setSelectedMovieResult] =
    useState<DjangoMovie | null>(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedListItem, setSelectedListItem] = useState<any | null>(null);
  const [longPressModalVisible, setLongPressModalVisible] = useState(false);
  const [longPressedMovie, setLongPressedMovie] = useState<DjangoMovie | null>(
    null
  );
  const [isAutoAddingToNewList, setIsAutoAddingToNewList] = useState(false);

  // State variables for managing selected list and its movies
  const [selectedList, setSelectedList] = useState<any | null>(null);
  const [selectedListMovies, setSelectedListMovies] = useState<any[]>([]);

  /**
   * Fetch movie results from the backend.
   * Results are sorted and filtered to ensure unique movies.
   */
  const fetchMovieResults = async () => {
    try {
      const response = await getMovieResults(); // API call to fetch movies
      const sortedData = response.data.sort(
        (a: DjangoMovie, b: DjangoMovie) => b.id - a.id
      ); // Sort movies by ID (descending)
      const uniqueData = sortedData.filter(
        (item: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.tmdb_id === item.tmdb_id)
      ); // Filter to ensure unique TMDB IDs
      setMovieResults(uniqueData); // Update state with unique movies
    } catch (error) {
      console.error("Error fetching movie results:", error); // Log any errors during fetch
    } finally {
      setLoading(false); // Hide loading indicator
      setRefreshing(false); // Stop refreshing animation
    }
  };

  /**
   * Fetch custom movie lists from the backend.
   */
  const fetchMovieLists = async () => {
    try {
      const response = await getMovieLists(); // API call to fetch lists
      if (response && response.status === 200) {
        setMovieLists(response.data); // Update state with fetched lists
      } else {
        console.error("Failed to fetch movie lists:", response); // Handle errors
      }
    } catch (error) {
      console.error("Error fetching movie lists:", error); // Log any errors during fetch
    }
  };

  /**
   * Add a selected movie to a specific list.
   * Ensures no duplicates are added to the list.
   *
   * @param list The target list object to which the movie will be added.
   * @param isNewList Indicates if this is a newly created list.
   */
  const handleAddMovieToList = async (
    list: any, // Target list object
    isNewList: boolean = false // Indicates if this is a newly created list
  ) => {
    if (!longPressedMovie) return; // Exit if no movie is selected
    try {
      const isInList = list.movies?.some(
        (movie: any) => movie.tmdb_id === longPressedMovie.tmdb_id
      ); // Check if movie is already in the list
      if (isInList) {
        // Show a warning message if the movie is already in the list
        showMessage({
          message: "Movie already in list",
          type: "warning",
          icon: "warning",
          style: flashMessageStyles.warning,
          duration: 3000, // Duration the message is displayed (in ms)
          animationDuration: 300, // Duration of the show/hide animation (in ms)
        });
        setLongPressModalVisible(false); // Close the long-press modal
        return;
      }
      const response = await addMovieToList(list.id, longPressedMovie.tmdb_id); // Add movie to list via API
      if (response && (response.status === 200 || response.status === 201)) {
        // Show a success message upon successful addition
        showMessage({
          message: `Movie added to ${list.name}`,
          type: "success",
          icon: "success",
          style: flashMessageStyles.success,
          duration: 3000,
          animationDuration: 300,
        });
        if (isNewList) setNewListModalVisible(false); // Close modal for new lists
        setLongPressModalVisible(false); // Hide the long-press modal
        await fetchMovieLists(); // Refresh lists to reflect changes
      } else {
        console.error("Failed to add movie to list:", response); // Handle unsuccessful responses
        // Show an error message when the addition fails
        showMessage({
          message: `Failed to add movie to ${list.name}`,
          type: "danger",
          icon: "danger",
          style: flashMessageStyles.danger,
          duration: 3000,
          animationDuration: 300,
        });
      }
    } catch (error) {
      console.error("Error adding movie to list:", error); // Log any errors during the API call
      // Show an error message for unexpected exceptions
      showMessage({
        message: "Error adding movie to list",
        type: "danger",
        icon: "danger",
        style: flashMessageStyles.danger,
        duration: 3000,
        animationDuration: 300,
      });
    }
  };

  /**
   * Removes a movie from the current list.
   *
   * @param list The list object from which to remove the movie.
   */
  const handleRemoveMovieFromList = async (list: any) => {
    if (!longPressedMovie) {
      // If no movie is selected, display an error message and exit early
      showMessage({
        message: "No movie selected to remove.",
        type: "danger",
        icon: "danger",
        style: flashMessageStyles.danger,
        duration: 3000,
        animationDuration: 300,
      });
      return; // Exit the function as there's no movie to remove
    }

    try {
      const response = await removeMovieFromList(
        list.id,
        longPressedMovie.tmdb_id
      ); // Remove movie from list via API
      if (response && (response.status === 200 || response.status === 204)) {
        // Show a success message upon successful removal
        showMessage({
          message: `Movie removed from ${list.name}`,
          type: "success",
          icon: "success",
          style: flashMessageStyles.success,
          duration: 3000,
          animationDuration: 300,
        });
        await fetchMovieLists(); // Refresh lists to reflect changes
      } else {
        console.error("Failed to remove movie from list:", response); // Log unsuccessful responses
        // Show an error message when the deletion fails
        showMessage({
          message: `Failed to remove movie from ${list.name}`,
          type: "danger",
          icon: "danger",
          style: flashMessageStyles.danger,
          duration: 3000,
          animationDuration: 300,
        });
      }
    } catch (error) {
      console.error("Error removing movie from list:", error); // Log any errors during the API call
      // Show an error message for unexpected exceptions
      showMessage({
        message: "Error removing movie from list",
        type: "danger",
        icon: "danger",
        style: flashMessageStyles.danger,
        duration: 3000,
        animationDuration: 300,
      });
    }
  };

  /**
   * Create a new movie list.
   *
   * @param name The name of the new list.
   * @param description The description of the new list.
   */
  const handleCreateNewList = async (name: string, description: string) => {
    try {
      const response = await createMovieList(name, description); // API call to create a list
      if (response && response.status === 201) {
        // Show a success message upon successful creation
        showMessage({
          message: `New list created: ${name}`,
          type: "success",
          icon: "success",
          style: flashMessageStyles.success,
          duration: 3000,
          animationDuration: 300,
        });
        const newList = response.data; // Retrieve the newly created list

        if (isAutoAddingToNewList && longPressedMovie) {
          await handleAddMovieToList(newList, true); // Auto-add movie to the new list
        }

        setIsAutoAddingToNewList(false); // Reset the auto-adding flag
        await fetchMovieLists(); // Refresh lists to include the new list
      } else {
        console.error("Failed to create new list:", response); // Log unsuccessful responses
        // Show an error message when the creation fails
        showMessage({
          message: `Failed to create new list: ${name}`,
          type: "danger",
          icon: "danger",
          style: flashMessageStyles.danger,
          duration: 3000,
          animationDuration: 300,
        });
      }
    } catch (error) {
      console.error("Error creating new list:", error); // Log any errors during the API call
      // Show an error message for unexpected exceptions
      showMessage({
        message: "Error creating new list",
        type: "danger",
        icon: "danger",
        style: flashMessageStyles.danger,
        duration: 3000,
        animationDuration: 300,
      });
    }
  };

  /**
   * Delete a selected movie list.
   */
  const confirmDeleteList = async () => {
    if (selectedListItem) {
      try {
        const response = await deleteMovieList(selectedListItem.id); // API call to delete the list
        if (response.status === 204) {
          // Show a success message upon successful deletion
          showMessage({
            message: `List deleted: ${selectedListItem.name}`,
            type: "success",
            icon: "success",
            style: flashMessageStyles.success,
            duration: 3000,
            animationDuration: 300,
          });
          await fetchMovieLists(); // Refresh lists to reflect deletion
        } else {
          console.error("Failed to delete list:", response); // Log unsuccessful responses
          // Show an error message when the deletion fails
          showMessage({
            message: `Failed to delete list: ${selectedListItem.name}`,
            type: "danger",
            icon: "danger",
            style: flashMessageStyles.danger,
            duration: 3000,
            animationDuration: 300,
          });
        }
      } catch (error) {
        console.error("Error deleting list:", error); // Log any errors during the API call
        // Show an error message for unexpected exceptions
        showMessage({
          message: "Error deleting list",
          type: "danger",
          icon: "danger",
          style: flashMessageStyles.danger,
          duration: 3000,
          animationDuration: 300,
        });
      } finally {
        setPopupVisible(false); // Hide the delete confirmation popup
        setSelectedListItem(null); // Clear the selected list item
      }
    }
  };

  /**
   * Fetch data when the screen comes into focus.
   * useFocusEffect ensures this function is called every time the screen is revisited.
   */
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchMovieResults(); // Fetch movie results
        await fetchMovieLists(); // Fetch movie lists
      };
      fetchData();
    }, [modalVisible]) // Dependency array ensures fetchData runs when modalVisible changes
  );

  /**
   * Fetch movies when a list is selected.
   */
  useEffect(() => {
    const fetchSelectedListMovies = async () => {
      if (selectedList) {
        const moviesInList = selectedList.movies;

        // Fetch details for each movie in the selected list
        const movieDetailsPromises = moviesInList.map(async (movie: any) => {
          const tmdbId = movie.tmdb_id;
          const tmdbMovieDetails = await getMovieDetails(tmdbId); // Fetch details from TMDB
          const djangoMovie = movieResults.find(
            (djangoMovie) => djangoMovie.tmdb_id == tmdbId
          ); // Find corresponding DjangoMovie

          // Merge djangoMovie and tmdbMovieDetails into a single object
          const mergedMovie = {
            ...(djangoMovie || {}),
            ...tmdbMovieDetails,
            image_url:
              djangoMovie?.poster ||
              (tmdbMovieDetails.poster_path
                ? `https://image.tmdb.org/t/p/w500${tmdbMovieDetails.poster_path}`
                : null),
            tmdb_id: tmdbId,
          };

          // Return both mergedMovie and djangoMovie
          return {
            mergedMovie,
            djangoMovie: djangoMovie || null,
          };
        });

        // Resolve all movie detail promises
        const moviesWithDetails = await Promise.all(movieDetailsPromises);
        setSelectedListMovies(moviesWithDetails); // Update state with detailed movies
      } else {
        setSelectedListMovies([]); // Clear selected list movies if no list is selected
      }
    };

    fetchSelectedListMovies();
  }, [selectedList, movieResults]); // Dependencies: selectedList and movieResults

  /**
   * Refresh movie data manually using pull-to-refresh.
   */
  const handleRefresh = async () => {
    setRefreshing(true); // Show refreshing indicator
    await fetchMovieResults(); // Fetch latest movie results
    await fetchMovieLists(); // Fetch latest movie lists
    setRefreshing(false); // Hide refreshing indicator
  };

  /**
   * Handle a movie selection to display detailed info.
   *
   * @param item The selected DjangoMovie item.
   */
  const handleMoviePress = async (item: DjangoMovie) => {
    try {
      const tmdbMovieDetails = await getMovieDetails(item.tmdb_id); // Fetch details from TMDB
      setSelectedMovie(tmdbMovieDetails); // Set movie details for the modal
      setSelectedMovieResult(item); // Set the selected result
      setModalVisible(true); // Show the movie detail modal
    } catch (error) {
      console.error("Error fetching movie details:", error); // Log any errors during fetch
    }
  };

  /**
   * Handle a list item press to display its movies.
   *
   * @param listItem The selected movie list item.
   */
  const handleListPress = (listItem: any) => {
    setSelectedList(listItem); // Set the selected list to display its movies
  };

  /**
   * Handle movie press within a selected list.
   *
   * @param movieItem The movie item within the selected list.
   * @param djangoMovieItem The corresponding DjangoMovie object, if any.
   */
  const handleMoviePressInList = (
    movieItem: any,
    djangoMovieItem: DjangoMovie | null
  ) => {
    setSelectedMovie(movieItem); // The merged movie object
    setSelectedMovieResult(djangoMovieItem); // Set the DjangoMovie object
    setModalVisible(true); // Show the movie detail modal
  };

  /**
   * Handle category button press (LikedMovies, MovieLists, DislikedMovies).
   *
   * @param category The category to switch to.
   */
  const handleCategoryPress = (category: string) => {
    if (selectedList) {
      setSelectedList(null); // Clear selected list if any
    }
    setSelectedCategory(category); // Set the selected category
  };

  // Render a loading indicator if data is still loading
  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Flash Message Component for displaying alerts */}
      <FlashMessage position="top" />

      {/* Category toggle buttons: Liked, Lists (or Back), Disliked */}
      <View style={styles.toggleContainer}>
        {/* Liked Movies Button */}
        <TouchableOpacity onPress={() => handleCategoryPress(LikedMovies)}>
          <Ionicons
            name="thumbs-up"
            size={30}
            color={selectedCategory === LikedMovies ? "green" : colors.text}
          />
        </TouchableOpacity>

        {selectedList ? (
          // Back button replaces the Lists button when a list is selected
          <TouchableOpacity onPress={() => setSelectedList(null)}>
            <Ionicons name="arrow-back" size={30} color={colors.text} />
          </TouchableOpacity>
        ) : (
          // Lists Button
          <TouchableOpacity
            onPress={() => {
              setSelectedCategory(MovieLists);
              setIsAutoAddingToNewList(false);
            }}
          >
            <Ionicons
              name="list"
              size={30}
              color={
                selectedCategory === MovieLists ? colors.primary : colors.text
              }
            />
          </TouchableOpacity>
        )}

        {/* Disliked Movies Button */}
        <TouchableOpacity onPress={() => handleCategoryPress(DislikedMovies)}>
          <Ionicons
            name="thumbs-down"
            size={30}
            color={selectedCategory === DislikedMovies ? "red" : colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Display the list name centered and styled when a list is selected */}
      {selectedList && (
        <MyText size="large" style={styles.listName}>
          {selectedList.name}
        </MyText>
      )}

      {/* Conditional rendering based on selected list and selected category */}
      {selectedList ? (
        // Display movies in the selected list
        <View style={styles.container}>
          {/* Grid of movies in the selected list */}
          <FlatList
            data={selectedListMovies}
            keyExtractor={(item) => item.mergedMovie.id.toString()} // Unique key for each movie
            renderItem={({ item }) => (
              <MovieGridItem
                item={item.mergedMovie}
                handleMoviePress={() =>
                  handleMoviePressInList(item.mergedMovie, item.djangoMovie)
                }
                setLongPressedMovie={setLongPressedMovie}
                setLongPressModalVisible={setLongPressModalVisible}
              />
            )}
            numColumns={3} // Display movies in a grid with 3 columns
            key={"grid"} // Unique key to ensure proper rendering
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh} // Handle pull-to-refresh action
              />
            }
          />
        </View>
      ) : (
        // Display liked/disliked movies or movie lists
        <>
          {selectedCategory === MovieLists && movieLists.length === 0 ? (
            // Show a message if there are no movie lists
            <View style={styles.centeredContainer}>
              <MyText size="large" style={{ color: colors.text, fontSize: 16 }}>
                You have no movie lists.
              </MyText>
            </View>
          ) : (
            // Display either movie grids or movie lists based on the selected category
            <FlatList
              data={
                selectedCategory === LikedMovies
                  ? movieResults.filter((movie) => movie.liked === 1) // Filter liked movies
                  : selectedCategory === DislikedMovies
                    ? movieResults.filter((movie) => movie.liked === 0) // Filter disliked movies
                    : movieLists // Display movie lists
              }
              keyExtractor={(item) => item.id.toString()} // Unique key for each item
              renderItem={
                selectedCategory === MovieLists
                  ? ({ item }) => (
                      <MovieList
                        item={item}
                        onPress={handleListPress} // Pass the handleListPress function to MovieList
                        setSelectedListItem={setSelectedListItem}
                        setPopupVisible={setPopupVisible}
                      />
                    )
                  : ({ item }) => (
                      <MovieGridItem
                        item={item}
                        handleMoviePress={handleMoviePress} // Pass the handleMoviePress function to MovieGridItem
                        setLongPressedMovie={setLongPressedMovie}
                        setLongPressModalVisible={setLongPressModalVisible}
                      />
                    )
              }
              numColumns={selectedCategory === MovieLists ? 1 : 3} // Single column for lists, grid for movies
              key={selectedCategory === MovieLists ? "list" : "grid"} // Unique key to ensure proper rendering
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh} // Handle pull-to-refresh action
                />
              }
            />
          )}

          {/* Add new list button */}
          {selectedCategory === MovieLists && (
            <View style={styles.addButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  setIsAutoAddingToNewList(false); // Reset auto-adding flag
                  setNewListModalVisible(true); // Open the 'Create New List' modal
                }}
                style={styles.addButton}
              >
                <Ionicons name="add-circle" size={50} color={colors.primary} />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {/* Movie detail modal */}
      {selectedMovie && (
        <MovieModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          selectedMovie={selectedMovie}
          selectedMovieResult={selectedMovieResult}
        />
      )}

      {/* Long press modal for adding movies to lists */}
      {longPressModalVisible && longPressedMovie && (
        <AddListModal
          longPressModalVisible={longPressModalVisible}
          setLongPressModalVisible={setLongPressModalVisible}
          movieLists={movieLists}
          longPressedMovie={longPressedMovie}
          addMovieToList={handleAddMovieToList}
          setNewListModalVisible={setNewListModalVisible}
          setIsAutoAddingToNewList={setIsAutoAddingToNewList}
          currentList={selectedList} // Pass the current list
          removeMovieFromList={handleRemoveMovieFromList} // Pass the remove function
        />
      )}

      {/* Modal for creating a new list */}
      {newListModalVisible && (
        <CreateListModal
          newListModalVisible={newListModalVisible}
          setNewListModalVisible={setNewListModalVisible}
          handleCreateNewList={handleCreateNewList}
          isAutoAddingToNewList={isAutoAddingToNewList}
        />
      )}

      {/* Modal for deleting a movie list */}
      {popupVisible && selectedListItem && (
        <DeleteListModal
          popupVisible={popupVisible}
          setPopupVisible={setPopupVisible}
          confirmDeleteList={confirmDeleteList}
          style={{ maxHeight: 150 }}
        />
      )}
    </View>
  );
};

export default MovieResultsScreen;
