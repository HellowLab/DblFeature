import React, { useState, useCallback } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { createStyles } from "./MyMoviesScreen.styles";
import { getMovieResults } from "@/src/utils/APIs/api";
import { getMovieDetails } from "@/src/utils/APIs/TMDB";
import { DjangoMovie, tmdbMovie } from "@/src/utils/types/types";
import { useTheme } from "@react-navigation/native";
import MyText from "@/src/components/TextOutput/TextOutput";
import LoadingIndicator from "@/src/components/LoadingIndicator";
import MovieCardOne from "@/src/components/MovieFlipCard/MovieCardOne";

const MovieResultsScreen = (): JSX.Element => {
  const { colors } = useTheme();
  const styles = createStyles(colors); // Pass colors to the styles
  const [movieResults, setMovieResults] = useState<DjangoMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0); // 0 for Liked, 1 for Disliked, 2 for Lists
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<tmdbMovie | null>(null);
  const [selectedMovieResult, setSelectedMovieResult] =
    useState<DjangoMovie | null>(null);

  const fetchMovieResults = async () => {
    if (!modalVisible) {
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
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMovieResults();
    }, [modalVisible])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMovieResults();
  };

  const handleMoviePress = async (item: DjangoMovie) => {
    const tmdbMovieDetails = await getMovieDetails(item.tmdb_id);
    setSelectedMovie(tmdbMovieDetails);
    setSelectedMovieResult(item);
    setModalVisible(true);
  };

  const likedMovies = movieResults.filter((movie) => movie.liked === 1);
  const dislikedMovies = movieResults.filter((movie) => movie.liked === 0);

  const getCurrentMovies = () => {
    switch (selectedCategory) {
      case 0:
        return likedMovies;
      case 1:
        return dislikedMovies;
      case 2:
        return []; // Placeholder for "Lists"
      default:
        return [];
    }
  };

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

    return null; // No stars or rating
  };

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

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

      {selectedCategory === 2 && getCurrentMovies().length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <MyText size="large" color={colors.text as any}>
            You have no movie lists.
          </MyText>
        </View>
      ) : (
        <FlatList
          data={getCurrentMovies()}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
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
                <View>
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
    </View>
  );
};

export default MovieResultsScreen;
