import React, { useState, useRef, useEffect } from "react";
import { View, Animated, useWindowDimensions } from "react-native";
import { fetchMovies, getMovieCredits } from "@/src/utils/APIs/TMDB"; // Import the getMovieCredits function
import LoadingIndicator from "../../components/LoadingIndicator";
//@ts-ignore
import LIKE from "../../assets/images/LIKE.png";
//@ts-ignore
import nope from "../../assets/images/nope.png";
import MovieCard, { MovieCardProps } from "@/src/components/MovieCard";
import { styles } from "@/src/screens/HomeScreen/HomeScreen.styles";
import Swiper from "@/src/components/Swiper";
import { onSwipeLeft, onSwipeRight } from "@/src/utils/callbacks";
import { tmdbMovie, tmdbCredits } from "@/src/utils/types/types"; // Import types

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
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch movies on component mount.
  useEffect(() => {
    const getMovies = async () => {
      try {
        const moviesData: tmdbMovie[] = await fetchMovies(1);
        const moviesWithCredits: MovieCardProps[] = await Promise.all(
          moviesData.map(async (movie) => {
            const credits: tmdbCredits = await getMovieCredits(movie.id); // Fetch credits for each movie

            // Map the cast and crew to arrays of names
            const castNames = credits.cast.map((member) => member.name); // Convert cast to string array of names
            const crewNames = credits.crew.map((member) => member.name); // Convert crew to string array of names

            return {
              id: movie.id,
              name: movie.title,
              image: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "",
              bio: movie.overview,
              cast: castNames, // Use array of cast names
              crew: crewNames, // Use array of crew names
              reviews: [], // TODO: get array of reviews
            };
          })
        );

        setMovies(moviesWithCredits); // Update state with movies and their credits
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, []);

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
      console.log("Swiped Right:", currentMovie);
      onSwipeRight(currentMovie);
    } else if (direction === "left") {
      console.log("Swiped Left:", currentMovie);
      onSwipeLeft(currentMovie);
    }
    // Reset card position and update the index for the next movie.
    cardPositionX.setValue(0);
    setCurrentIndex((prevIndex) => prevIndex + 1);
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
          swipeThreshold={0.5}
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
