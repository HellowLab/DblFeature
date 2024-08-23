import React, { useState, useRef, useEffect } from "react";
import { View, Animated, useWindowDimensions } from "react-native";
import { fetchMovies } from "@/src/utils/APIs/TMDB";
import LoadingIndicator from "../../components/LoadingIndicator";
//@ts-ignore
import LIKE from "../../assets/images/LIKE.png";
//@ts-ignore
import nope from "../../assets/images/nope.png";
import MovieCard, { MovieCardProps } from "@/src/components/MovieCard";
import { styles } from "@/src/screens/HomeScreen/HomeScreen.styles";
import Swiper from "@/src/components/Swiper";
import { onSwipeLeft, onSwipeRight } from "@/src/utils/callbacks";
import { tmdbMovie } from "@/src/utils/types/types"

import { DjangoMovie } from "@/src/utils/types/types";
import { getMovieResults } from "@/src/utils/APIs/api";

import { getTmdbIndex, updateTmdbIndex } from "@/src/utils/APIs/api";
import { tmdb_index_type } from "@/src/utils/types/types";

/**
 * HomeScreen Component
 *
 * This component renders the home screen of the app, displaying a swiper interface
 * for browsing through a list of movies. It fetches movies from the TMDB API, and
 * allows users to swipe left or right to indicate their preference for each movie.
 */
const HomeScreen = () => {
  // Get the screen width using the useWindowDimensions hook.
  const { width: screenWidth } = useWindowDimensions();

  // Create animated values for handling swipe interactions.
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const nopeOpacity = useRef(new Animated.Value(0)).current;
  const cardPositionX = useRef(new Animated.Value(0)).current;

  // State to hold the list of movies and loading state.
  const [movies, setMovies] = useState<MovieCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchMoreMovies, setFetchMoreMovies] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [tmdbIndex, setTmdbIndex] = useState(1);
  const [tmdbType, setTmdbType] = useState<tmdb_index_type>("popular");

  // Fetch movies on component mount or when fetchMoreMovies changes.
  useEffect(() => {
    const getMovies = async () => {
      let fetchMoreData = true; // Controls the loop for fetching additional movies
      let myMoviesList: number[] = []; // List of TMDB IDs fetched from your backend
      let newMovies: tmdbMovie[] = []; // New movies fetched from TMDB API
      let allMovies: tmdbMovie[] = []; // Combined list of all fetched movies
      let tempIndex = tmdbIndex; // Index for tracking the page number for the TMDB API

      // Fetch the list of movies from your backend
      try {
        const response = await getMovieResults();
        if (response.status === 200) {
          // Extract the TMDB IDs from the response
          myMoviesList = response.data.map((movie: DjangoMovie) =>
            Number(movie.tmdb_id)
          );
        }
      } catch (error) {
        console.error("Error fetching my movies from the backend:", error);
      }

      // Fetch the current TMDB index from your backend
      try {
        const res = await getTmdbIndex(tmdbType);
        if (res.status === 200) {
          // If the date from the backend matches today's date, update the tempIndex
          if (res.data.date === new Date().toISOString().split("T")[0]) {
            tempIndex = res.data.index;
          }
        }
      } catch (error) {
        console.error("Error fetching TMDB index from backend:", error);
      }

      // Loop to fetch movies from the TMDB API until conditions are met
      while (fetchMoreData) {
        try {
          console.log("Fetching movies from TMDB API... index:", tempIndex);
          newMovies = await fetchMovies(tempIndex); // Fetch movies from TMDB API
          tempIndex += 1; // Increment the page index for the next API call

          // Filter out movies already in myMoviesList
          if (myMoviesList.length > 0) {
            newMovies = newMovies.filter(
              (movie) => !myMoviesList.includes(movie.id)
            );
          }

          // Combine previously fetched movies with newMovies, ensuring uniqueness
          allMovies = Array.from(new Set([...allMovies, ...newMovies]));

          // Stop fetching if more than 15 movies are accumulated
          if (allMovies.length > 15) {
            fetchMoreData = false;
          }
        } catch (error) {
          console.error("Error fetching movies. App will not retry:", error);
          fetchMoreData = false;
        } finally {
          // Format the fetched movies for display
          const formattedMovies: MovieCardProps[] = allMovies.map((movie) => ({
            id: movie.id,
            name: movie.title,
            image: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "",
            bio: movie.overview,
            cast: [], // TODO: Fetch array of cast members
            crew: [], // TODO: Fetch array of crew members
            reviews: [], // TODO: Fetch array of reviews
          }));

          // Update state with the new movie list and manage loading indicators
          setMovies((prevMovies) => [...prevMovies, ...formattedMovies]);
          setLoading(false);
          setTmdbIndex(tempIndex);
          setFetchMoreMovies(false);
          updateTmdbIndex(tempIndex - 1); // Update backend index to avoid skipping movies
        }
      }
    };

    // Trigger the movie fetching if conditions are met
    if (fetchMoreMovies && movies.length - currentIndex < 5) {
      console.log("Fetching movies...");
      getMovies();
    }
  }, [fetchMoreMovies]); // Re-run the effect when fetchMoreMovies changes

  // Interpolation for card scaling based on swipe position.
  const scaleAnim = cardPositionX.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: [1.0, 0.8, 1.0],
    extrapolate: "clamp",
  });

  // Current and next movies to be displayed in the swiper.
  const currentMovie = movies[currentIndex] ?? null;
  const nextMovie = movies[currentIndex + 1] ?? null;

  /**
   * Handles the swipe action by the user.
   *
   * @param {string} direction - The direction of the swipe ("left" or "right").
   */
  const handleSwipe = (direction: string) => {
    if (direction === "right") {
      // console.log("Swiped Right:", currentMovie);
      onSwipeRight(currentMovie);
    } else if (direction === "left") {
      // console.log("Swiped Left:", currentMovie);
      onSwipeLeft(currentMovie);
    }
    // Reset card position and update the index for the next movie.
    cardPositionX.setValue(0);
    setCurrentIndex((prevIndex) => prevIndex + 1);

    // check the remaining qty of movies in the queue, if less than 5, pull more movies
    if (movies.length - currentIndex < 5) {
      console.log("Fetching more movies...");
      setFetchMoreMovies(true);
      // fetch more movies
    }

    console.log("Movies Remaining in Queue: ", movies.length - currentIndex);
  };

  // Display a loading indicator while movies are being fetched.
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {/* Render the next movie card with a scale animation */}
      {nextMovie && (
        <Animated.View
          style={[
            styles.nextCardContainer,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          <MovieCard movie={nextMovie} />
        </Animated.View>
      )}

      {/* Render the current movie card and the swipe interface */}
      {currentMovie && (
        <Swiper
          key={currentIndex}
          onSwipe={handleSwipe}
          overlay={{ likeOpacity, nopeOpacity }}
          preventSwipe={["up", "down"]}
          cardPositionX={cardPositionX}
        >
          <Animated.View style={styles.currentCardContainer}>
            <Animated.Image
              source={LIKE}
              style={[styles.png, { left: 10, opacity: likeOpacity }]}
              resizeMode="contain"
            />
            <Animated.Image
              source={nope}
              style={[
                styles.png,
                {
                  right: 10,
                  top: 10,
                  opacity: nopeOpacity,
                  transform: [{ scale: 1.15 }],
                },
              ]}
              resizeMode="contain"
            />
            <MovieCard movie={currentMovie} />
          </Animated.View>
        </Swiper>
      )}
    </View>
  );
};

export default HomeScreen;
