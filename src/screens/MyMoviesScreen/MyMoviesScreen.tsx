import React, { useState, useCallback } from "react";
import { View, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createStyles } from "./MyMoviesScreen.styles";

// API utility functions for interacting with the backend
import {
  createMovieList, // Function to create a new movie list
  getMovieLists, // Function to fetch existing movie lists
  getMovieResults, // Function to fetch movie results
  deleteMovieList, // Function to delete a movie list
  addMovieToList, // Function to add a movie to a specific list
} from "@/src/utils/APIs/api";

import { getMovieDetails } from "@/src/utils/APIs/TMDB";
import { DjangoMovie, tmdbMovie } from "@/src/utils/types/types";
import { useTheme } from "@react-navigation/native";
import LoadingIndicator from "@/src/components/LoadingIndicator"; // Loading spinner component
import MyText from "@/src/components/TextOutput/TextOutput"; // Custom text component
import MovieGridItem from "@/src/components/MovieGrid"; // Component for displaying movies in a grid layout
import MovieModal from "@/src/components/Modals/MovieModal"; // Modal for viewing detailed movie info
import AddListModal from "@/src/components/Modals/AddListModal"; // Modal for adding movies to lists
import CreateListModal from "@/src/components/Modals/CreateListModal"; // Modal for creating a new movie list
import DeleteListModal from "@/src/components/Modals/DeleteListModal"; // Modal for deleting movie lists
import MovieList from "@/src/components/MovieList"; // Component for rendering a movie list

// Define constants for the different categories
const LikedMovies = "LikedMovies";
const MovieLists = "MovieLists";
const DislikedMovies = "DislikedMovies";

// Main screen component for displaying movie results and managing movie lists
const MovieResultsScreen = (): JSX.Element => {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // State variables for managing movie data and UI interactions
  const [movieResults, setMovieResults] = useState<DjangoMovie[]>([]); // Stores fetched movie results
  const [movieLists, setMovieLists] = useState<any[]>([]); // Stores fetched custom movie lists
  const [loading, setLoading] = useState(true); // Tracks whether data is being loaded
  const [refreshing, setRefreshing] = useState(false); // Tracks the pull-to-refresh state
  const [selectedCategory, setSelectedCategory] = useState(LikedMovies); // Use named categories
  const [modalVisible, setModalVisible] = useState(false); // Controls the visibility of the movie detail modal
  const [newListModalVisible, setNewListModalVisible] = useState(false); // Controls the visibility of the new list modal
  const [selectedMovie, setSelectedMovie] = useState<tmdbMovie | null>(null); // Holds the movie selected for detailed view
  const [selectedMovieResult, setSelectedMovieResult] =
    useState<DjangoMovie | null>(null); // Holds the selected movie's backend data
  const [popupVisible, setPopupVisible] = useState(false); // Controls the visibility of the delete list modal
  const [selectedListItem, setSelectedListItem] = useState<any | null>(null); // Holds the selected list for deletion
  const [longPressModalVisible, setLongPressModalVisible] = useState(false); // Controls the visibility of the long-press modal
  const [longPressedMovie, setLongPressedMovie] = useState<DjangoMovie | null>(
    null
  ); // Holds the movie selected for adding to a list
  const [isAutoAddingToNewList, setIsAutoAddingToNewList] = useState(false); // Tracks if a movie should auto-add to a new list

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
      console.error("Error fetching movie results:", error);
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
      console.error("Error fetching movie lists:", error);
    }
  };

  /**
   * Add a selected movie to a specific list.
   * Ensures no duplicates are added to the list.
   */
  const handleAddMovieToList = async (
    list: any, // Target list object
    isNewList: boolean = false // Indicates if this is a newly created list
  ) => {
    if (!longPressedMovie) return; // Exit if no movie is selected
    try {
      const isInList = list.movies?.some(
        (movie: { id: number }) => movie.id === longPressedMovie.id
      ); // Check if movie is already in the list
      if (isInList) {
        console.log("Movie already in list, skipping addition.");
        return;
      }
      const response = await addMovieToList(list.id, longPressedMovie.id); // Add movie to list
      if (response && (response.status === 200 || response.status === 201)) {
        console.log(`Movie added to ${list.name}`);
        if (isNewList) setNewListModalVisible(false); // Close modal for new lists
        setLongPressModalVisible(false); // Hide the long-press modal
        await fetchMovieLists(); // Refresh lists
      } else {
        console.error("Failed to add movie to list:", response);
      }
    } catch (error) {
      console.error("Error adding movie to list:", error);
    }
  };

  /**
   * Create a new movie list.
   */
  const handleCreateNewList = async (name: string, description: string) => {
    try {
      const response = await createMovieList(name, description); // API call to create a list
      if (response && response.status === 201) {
        console.log(`New list created: ${name}`);
        const newList = response.data;

        if (isAutoAddingToNewList && longPressedMovie) {
          await handleAddMovieToList(newList, true); // Auto-add movie to the new list
        }

        setIsAutoAddingToNewList(false); // Reset flag
        await fetchMovieLists(); // Refresh lists
      } else {
        console.error("Failed to create new list:", response);
      }
    } catch (error) {
      console.error("Error creating new list:", error);
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
          await fetchMovieLists(); // Refresh lists
        } else {
          console.error("Failed to delete list:", response);
        }
      } catch (error) {
        console.error("Error deleting list:", error);
      } finally {
        setPopupVisible(false); // Hide popup
        setSelectedListItem(null); // Clear selection
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
        await fetchMovieResults();
        await fetchMovieLists();
      };
      fetchData();
    }, [modalVisible])
  );

  /**
   * Refresh movie data manually using pull-to-refresh.
   */
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMovieResults();
    await fetchMovieLists();
    setRefreshing(false);
  };

  /**
   * Handle a movie selection to display detailed info.
   */
  const handleMoviePress = async (item: DjangoMovie) => {
    try {
      const tmdbMovieDetails = await getMovieDetails(item.tmdb_id); // Fetch details from TMDB
      setSelectedMovie(tmdbMovieDetails); // Set movie details for the modal
      setSelectedMovieResult(item); // Set the selected result
      setModalVisible(true); // Show the modal
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  // Render a loading indicator if data is still loading
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Category toggle buttons: Liked, Lists, Disliked */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setSelectedCategory(LikedMovies)}>
          <Ionicons
            name="thumbs-up"
            size={30}
            color={selectedCategory === LikedMovies ? "green" : colors.text}
          />
        </TouchableOpacity>
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
        <TouchableOpacity onPress={() => setSelectedCategory(DislikedMovies)}>
          <Ionicons
            name="thumbs-down"
            size={30}
            color={selectedCategory === DislikedMovies ? "red" : colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Conditional rendering based on selected category */}
      {selectedCategory === MovieLists && movieLists.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <MyText size="large" style={{ color: colors.text, fontSize: 16 }}>
            You have no movie lists.
          </MyText>
        </View>
      ) : (
        <FlatList
          data={
            selectedCategory === LikedMovies
              ? movieResults.filter((movie) => movie.liked === 1) // Filter liked movies
              : selectedCategory === DislikedMovies
                ? movieResults.filter((movie) => movie.liked === 0) // Filter disliked movies
                : movieLists // Use movie lists
          }
          keyExtractor={(item) => item.id.toString()} // Unique key for each item
          renderItem={
            selectedCategory === MovieLists
              ? ({ item }) => (
                  <MovieList
                    item={item}
                    setSelectedListItem={setSelectedListItem}
                    setPopupVisible={setPopupVisible}
                  />
                )
              : ({ item }) => (
                  <MovieGridItem
                    item={item}
                    handleMoviePress={handleMoviePress}
                    setLongPressedMovie={setLongPressedMovie}
                    setLongPressModalVisible={setLongPressModalVisible}
                  />
                )
          }
          numColumns={selectedCategory === MovieLists ? 1 : 3}
          key={selectedCategory === MovieLists ? "list" : "grid"}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      {/* Add new list button */}
      {selectedCategory === MovieLists && (
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            onPress={() => {
              setIsAutoAddingToNewList(false);
              setNewListModalVisible(true);
            }}
            style={styles.addButton}
          >
            <Ionicons name="add-circle" size={50} color={colors.primary} />
          </TouchableOpacity>
        </View>
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
