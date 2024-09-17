import React, { useState, useRef, useEffect } from "react";
import { View, Animated, useWindowDimensions } from "react-native";
import {
  fetchMovies,
  getMovieCredits,
  getMovieReviews,
} from "@/src/utils/APIs/TMDB";
import LoadingIndicator from "../../components/LoadingIndicator";
//@ts-ignore
import LIKE from "../../assets/images/LIKE.png";
//@ts-ignore
import nope from "../../assets/images/nope.png";
import MovieCard, { MovieCardProps } from "@/src/components/MovieCard";
import { styles } from "@/src/screens/HomeScreen/HomeScreen.styles";
import Swiper from "@/src/components/Swiper";
import { onSwipeLeft, onSwipeRight } from "@/src/utils/callbacks";
import { tmdbMovie } from "@/src/utils/types/types";

const HomeScreen: React.FC = () => {
  const { width: screenWidth } = useWindowDimensions(); // Get device screen width
  const likeOpacity = useRef(new Animated.Value(0)).current; // Animation value for the like icon
  const nopeOpacity = useRef(new Animated.Value(0)).current; // Animation value for the nope icon
  const cardPositionX = useRef(new Animated.Value(0)).current; // X position of the card for swiping

  const [movies, setMovies] = useState<MovieCardProps[]>([]); // State to store fetched movies
  const [loading, setLoading] = useState(true); // Loading state to show a loader while fetching movies
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the current movie card

  // Fetch movie data and additional details (cast, crew, reviews) when the component mounts
  useEffect(() => {
    const getMovies = async () => {
      try {
        const moviesData: tmdbMovie[] = await fetchMovies(1); // Fetch list of movies from TMDB
        const moviesWithDetails: MovieCardProps[] = await Promise.all(
          moviesData.map(async (movie) => {
            const [credits, reviews] = await Promise.all([
              getMovieCredits(movie.id), // Fetch credits (cast and crew)
              getMovieReviews(movie.id), // Fetch reviews
            ]);

            return {
              id: movie.id,
              name: movie.title,
              image: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` // Movie poster image
                : "",
              bio: movie.overview, // Movie description
              cast: credits.cast.slice(0, 10), // Take the first 10 cast members
              crew: credits.crew.slice(0, 10), // Take the first 10 crew members
              reviews: reviews.slice(0, 5), // Take the first 5 reviews
            };
          })
        );

        setMovies(moviesWithDetails); // Set the movies state with detailed movie data
      } catch (error) {
        console.error("Error fetching movies:", error); // Log error if fetching fails
      } finally {
        setLoading(false); // Stop loading indicator
      }
    };

    getMovies(); // Trigger the movie fetch on component mount
  }, []);

  // Animation for scaling the next card based on the swiping progress of the current card
  const scaleAnim = cardPositionX.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: [1.0, 0.8, 1.0], // Card scales down while swiping
    extrapolate: "clamp",
  });

  // Current and next movies based on the current index
  const currentMovie = movies[currentIndex] ?? null;
  const nextMovie = movies[currentIndex + 1] ?? null;

  // Handle swipe actions (left for nope, right for like)
  const handleSwipe = (direction: string) => {
    if (direction === "right") {
      console.log("Swiped Right:", currentMovie);
      onSwipeRight(currentMovie); // Trigger the right swipe action
    } else if (direction === "left") {
      console.log("Swiped Left:", currentMovie);
      onSwipeLeft(currentMovie); // Trigger the left swipe action
    }
    cardPositionX.setValue(0); // Reset card position after the swipe
    setCurrentIndex((prevIndex) => prevIndex + 1); // Move to the next movie
  };

  // Show a loading indicator while fetching data
  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {nextMovie && (
        <Animated.View
          style={[
            styles.nextCardContainer,
            { transform: [{ scale: scaleAnim }] }, // Scale down the next card during swipe
          ]}
        >
          <MovieCard movie={nextMovie} />
        </Animated.View>
      )}
      {currentMovie && (
        <Swiper
          key={currentIndex} // Ensure the swiper resets on index change
          onSwipe={handleSwipe} // Handle swipe directions
          overlay={{ likeOpacity, nopeOpacity }} // Opacity controls for like/nope overlays
          preventSwipe={["up", "down"]} // Restrict swipe to left and right only
          cardPositionX={cardPositionX} // Card position for swiping
          swipeThreshold={0.5} // Threshold for completing the swipe
        >
          <Animated.View style={styles.currentCardContainer}>
            <Animated.Image
              source={LIKE}
              style={[styles.png, { left: 10, opacity: likeOpacity }]} // Like overlay
              resizeMode="contain"
            />
            <Animated.Image
              source={nope}
              style={[
                styles.png,
                {
                  right: 10,
                  top: 10,
                  opacity: nopeOpacity, // Nope overlay
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
