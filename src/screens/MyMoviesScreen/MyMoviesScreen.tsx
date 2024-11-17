import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { createStyles } from "./MyMoviesScreen.styles";
import {
  createMovieList,
  getMovieLists,
  getMovieResults,
  deleteMovieList,
} from "@/src/utils/APIs/api";
import { getMovieDetails } from "@/src/utils/APIs/TMDB";
import { DjangoMovie, tmdbMovie } from "@/src/utils/types/types";
import { useTheme } from "@react-navigation/native";
import MyText from "@/src/components/TextOutput/TextOutput";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import MovieCardOne from "@/src/components/MovieFlipCard/MovieCardOne";

/**
 * MovieResultsScreen Component
 * Displays movie results categorized into "Liked", "Disliked", and custom movie lists.
 * Provides functionality for viewing movie details, managing lists, and refreshing data.
 */
const MovieResultsScreen = (): JSX.Element => {
  /** State and Hook Initializations */
  const { colors } = useTheme(); // Theme colors for consistent styling
  const styles = createStyles(colors); // Dynamic styles based on theme colors

  // States for managing component data and UI
  const [movieResults, setMovieResults] = useState<DjangoMovie[]>([]); // Fetched movie results
  const [movieLists, setMovieLists] = useState<any[]>([]); // User-created movie lists
  const [loading, setLoading] = useState(true); // Loading indicator state
  const [refreshing, setRefreshing] = useState(false); // Pull-to-refresh state
  const [selectedCategory, setSelectedCategory] = useState(0); // Selected category (0: Liked, 1: Disliked, 2: Lists)
  const [modalVisible, setModalVisible] = useState(false); // Movie detail modal visibility
  const [newListModalVisible, setNewListModalVisible] = useState(false); // New list modal visibility
  const [selectedMovie, setSelectedMovie] = useState<tmdbMovie | null>(null); // Selected movie for modal
  const [popupVisible, setPopupVisible] = useState(false); // List options popup visibility
  const [selectedListItem, setSelectedListItem] = useState<any | null>(null); // Currently selected list item
  const [selectedMovieResult, setSelectedMovieResult] =
    useState<DjangoMovie | null>(null); // Selected movie result
  const [newListName, setNewListName] = useState(""); // Name for new movie list
  const [newListDescription, setNewListDescription] = useState(""); // Description for new movie list

  /** CRUD Functions for Movie Lists */

  // Deletes the selected movie list and refreshes the list after deletion.
  const confirmDeleteList = async () => {
    if (selectedListItem) {
      try {
        const response = await deleteMovieList(selectedListItem.id);
        if (response.status === 204) {
          await fetchMovieLists(); // Refresh the list
        } else {
          console.error("Failed to delete list:", response);
        }
      } catch (error) {
        console.error("Error deleting list:", error);
      } finally {
        setPopupVisible(false);
        setSelectedListItem(null);
      }
    }
  };

  // Creates a new movie list using user input.
  const createNewList = async () => {
    if (!newListName.trim()) return;

    try {
      const response = await createMovieList(
        newListName,
        newListDescription || ""
      );
      if (response && response.status === 201) {
        await fetchMovieLists(); // Refresh lists after creation
        setSelectedCategory(2); // Switch to "Lists" category
        setNewListName("");
        setNewListDescription(""); // Reset inputs
        setNewListModalVisible(false); // Close modal
      } else {
        console.error("Failed to create new list:", response);
      }
    } catch (error) {
      console.error("Error creating new list:", error);
    }
  };

  /** Data Fetching Functions */

  // Fetches movie results from the server.
  const fetchMovieResults = async () => {
    try {
      const response = await getMovieResults();
      const sortedData = response.data.sort(
        (a: DjangoMovie, b: DjangoMovie) => b.id - a.id
      );
      const uniqueData = sortedData.filter(
        (item: any, index: any, self: any) =>
          index === self.findIndex((t: any) => t.tmdb_id === item.tmdb_id)
      );
      setMovieResults(uniqueData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetches custom movie lists from the server.
  const fetchMovieLists = async () => {
    try {
      const response = await getMovieLists();
      if (response && response.status === 200) {
        setMovieLists(response.data);
      } else {
        console.error("Failed to fetch movie lists:", response);
      }
    } catch (error) {
      console.error("Error fetching movie lists:", error);
    }
  };

  /** Lifecycle and Refresh Handlers */

  // Fetches data when the screen gains focus.
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await fetchMovieResults();
        await fetchMovieLists();
      };
      fetchData();
    }, [modalVisible])
  );

  // Handles pull-to-refresh functionality.
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMovieResults();
    await fetchMovieLists();
    setRefreshing(false);
  };

  /** UI Event Handlers */

  // Handles user interaction with a movie card.
  const handleMoviePress = async (item: DjangoMovie) => {
    try {
      const tmdbMovieDetails = await getMovieDetails(item.tmdb_id);
      setSelectedMovie(tmdbMovieDetails);
      setSelectedMovieResult(item);
      setModalVisible(true);
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  // Handles long press on a movie list item to show options.
  const handleLongPress = (item: any) => {
    setSelectedListItem(item);
    setPopupVisible(true);
  };

  /** Rendering Logic */

  // Renders a movie card.
  const renderMovieItem = ({ item }: { item: DjangoMovie }) => (
    <TouchableOpacity
      onPress={() => handleMoviePress(item)}
      style={styles.gridItem}
    >
      <Image
        source={{ uri: item.poster || "https://via.placeholder.com/100x150" }}
        style={styles.posterImage}
      />
      <View style={styles.ratingContainer}>{renderStars(item)}</View>
    </TouchableOpacity>
  );

  // Renders a star rating for movies.
  const renderStars = (item: DjangoMovie) => {
    if (item.myRating != null && item.myRating > 0) {
      const fullStars = Math.floor(item.myRating);
      const hasHalfStar = item.myRating % 1 !== 0;
      const stars = [];

      for (let i = 0; i < fullStars; i++) {
        stars.push(
          <Ionicons
            key={`full-${i}`}
            name="star"
            size={14}
            color={colors.text}
            style={{ marginRight: 2 }}
          />
        );
      }

      if (hasHalfStar) {
        stars.push(
          <MyText key="half" size="medium">
            ½
          </MyText>
        );
      }

      return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {stars}
        </View>
      );
    }

    return null;
  };

  // Renders a movie list item.
  const renderListItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => console.log("List pressed:", item)}
      onLongPress={() => handleLongPress(item)}
      style={styles.listItem}
    >
      <View style={styles.listContent}>
        <MyText size="large" color="normal">
          {item.name}
        </MyText>
        {item.description && (
          <MyText size="medium" color="primary">
            {item.description}
          </MyText>
        )}
      </View>
      <MyText size="medium" color="primary" style={styles.movieCount}>
        {item.movies?.length || 0} movies
      </MyText>
    </TouchableOpacity>
  );

  /** Main Render Function */
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Category Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity onPress={() => setSelectedCategory(0)}>
          <Ionicons
            name="thumbs-up"
            size={30}
            color={selectedCategory === 0 ? "green" : colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory(2)}>
          <Ionicons
            name="list"
            size={30}
            color={selectedCategory === 2 ? colors.primary : colors.text}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedCategory(1)}>
          <Ionicons
            name="thumbs-down"
            size={30}
            color={selectedCategory === 1 ? "red" : colors.text}
          />
        </TouchableOpacity>
      </View>

      {/* Movie or List Display */}
      {selectedCategory === 2 && movieLists.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <MyText size="large" color={colors.text as any}>
            You have no movie lists.
          </MyText>
        </View>
      ) : (
        <FlatList
          data={
            selectedCategory === 0
              ? movieResults.filter((movie) => movie.liked === 1)
              : selectedCategory === 1
                ? movieResults.filter((movie) => movie.liked === 0)
                : movieLists
          }
          keyExtractor={(item) => item.id.toString()}
          renderItem={selectedCategory === 2 ? renderListItem : renderMovieItem}
          numColumns={selectedCategory === 2 ? 1 : 3}
          key={selectedCategory === 2 ? "list" : "grid"}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}

      {/* Add New List Button */}
      {selectedCategory === 2 && (
        <View style={styles.addButtonContainer}>
          <TouchableOpacity
            onPress={() => setNewListModalVisible(true)}
            style={styles.addButton}
          >
            <Ionicons name="add-circle" size={50} color={colors.primary} />
          </TouchableOpacity>
        </View>
      )}

      {/* Modals for Movie Details, New List Creation, and List Options */}
      {popupVisible && selectedListItem && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={popupVisible}
          onRequestClose={() => setPopupVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setPopupVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <MyText
                    size="large"
                    style={{ marginBottom: 20, color: colors.text }}
                    color="normal"
                  >
                    Options
                  </MyText>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      style={[
                        styles.createButton,
                        {
                          backgroundColor: colors.error,
                          flex: 1,
                          marginRight: 10,
                          alignItems: "center",
                          justifyContent: "center",
                        },
                      ]}
                      onPress={confirmDeleteList}
                    >
                      <MyText size="medium" color="white">
                        Delete
                      </MyText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.createButton,
                        {
                          backgroundColor: colors.primary,
                          flex: 1,
                          alignItems: "center",
                          justifyContent: "center",
                        },
                      ]}
                      onPress={() => setPopupVisible(false)}
                    >
                      <MyText size="medium" color="white">
                        Cancel
                      </MyText>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {selectedMovie && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <MovieCardOne
                    movie={selectedMovie}
                    movieResult={selectedMovieResult}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={newListModalVisible}
        onRequestClose={() => setNewListModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setNewListModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <MyText size="large">Create New List</MyText>
                <TextInput
                  placeholder="List Name"
                  placeholderTextColor={colors.primary}
                  value={newListName}
                  onChangeText={setNewListName}
                  style={styles.input}
                />
                <TextInput
                  placeholder="Description (Optional)"
                  placeholderTextColor={colors.primary}
                  value={newListDescription}
                  onChangeText={setNewListDescription}
                  style={[styles.input, { marginTop: 10 }]}
                />
                <TouchableOpacity
                  onPress={createNewList}
                  style={styles.createButton}
                >
                  <MyText size="medium" color={colors.primary as any}>
                    Create
                  </MyText>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default MovieResultsScreen;
