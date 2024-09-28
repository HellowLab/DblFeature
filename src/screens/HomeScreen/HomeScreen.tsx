import React, { useState, useRef, useEffect } from "react";
import { View, Animated, useWindowDimensions, Text } from "react-native";
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

import { DjangoMovie } from "@/src/utils/types/types";
import { getMovieResults } from "@/src/utils/APIs/api";

import { getTmdbIndex, updateTmdbIndex } from "@/src/utils/APIs/api";
import { tmdb_index_type } from "@/src/utils/types/types";
import { tmdbCredits } from "@/src/utils/types/types";
import MyText from "@/src/components/TextOutput/TextOutput";
/**
 * HomeScreen Component
 *
 * This component renders the home screen of the app, displaying a swiper interface
 * for browsing through a list of movies. It fetches movies from the TMDB API, and
 * allows users to swipe left or right to indicate their preference for each movie.
 */
const HomeScreen = () => {
  const { width: screenWidth } = useWindowDimensions(); // Get device screen width
  const likeOpacity = useRef(new Animated.Value(0)).current; // Animation value for the like icon
  const nopeOpacity = useRef(new Animated.Value(0)).current; // Animation value for the nope icon
  const cardPositionX = useRef(new Animated.Value(0)).current; // X position of the card for swiping

  const [loading, setLoading] = useState(true); // Loading state to show a loader while fetching movies
  const [movies, setMovies] = useState<MovieCardProps[]>([]); // State to store fetched movies
  const [currentMovie, setCurrentMovie] = useState<MovieCardProps | null>(null); // Current movie card
  const [nextMovie, setNextMovie] = useState<MovieCardProps | null>(null); // Next movie card
  const [currentIndex, setCurrentIndex] = useState(0); // Index of the current movie card
  const [fetchMoreMovies, setFetchMoreMovies] = useState(true); // State to trigger fetching more movies
  const [tmdbIndex, setTmdbIndex] = useState(1); // Index for fetching movies from the TMDB API
  const [tmdbType, setTmdbType] = useState<tmdb_index_type>("popular"); // Type of movies to fetch from the TMDB API

  const REM_MOVIES_THRESHOLD = 15; // Threshold for fetching more movies when remaining movies are less than this value

  // Fetch movies on component mount or when fetchMoreMovies changes.
  useEffect(() => {
    const getMovies = async () => {
      let fetchMoreData = true; // Controls the loop for fetching additional movies
      let myMoviesList: number[] = []; // List of TMDB IDs fetched from your backend
      let newMovies: tmdbMovie[] = []; // New movies fetched from TMDB API
      let allMovies: MovieCardProps[] = []; // Combined list of all fetched movies
      let moviesWithDetails: MovieCardProps[] = []; // Movies with detailed cast and crew info
      let tempIndex = tmdbIndex; // Index for tracking the page number for the TMDB API

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

      // Fetch the list of movies from your backend
      try {
        const response = await getMovieResults();
        if (response.status === 200) {
          // Extract the TMDB IDs from the response
          const myMoviesList = response.data.map((movie: DjangoMovie) =>
            Number(movie.tmdb_id)
          );
        }
      } catch (error) {
        console.error("Error fetching my movies from the backend:", error);
        return;
      }

      // Loop to fetch movies from the TMDB API until conditions are met
      while (fetchMoreData) {
        try {
          console.log("Fetching movies from TMDB API... index:", tempIndex);
          newMovies = await fetchMovies(tempIndex); // Fetch new list of movies from TMDB API
          tempIndex += 1; // Increment the page index for the next API call

          // Add detailed cast and crew information to each new movie item
          moviesWithDetails = await Promise.all(
            newMovies.map(async (movie) => {
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

          // Filter out movies already in myMoviesList
          if (myMoviesList.length > 0) {
            moviesWithDetails = moviesWithDetails.filter(
              (movie) => !myMoviesList.includes(movie.id)
            );
          }

          // Combine previously fetched movies with newMovies into a list, but using a set to ensure uniqueness
          allMovies = [...new Set([...allMovies, ...moviesWithDetails])];

          // Stop fetching if more than 20 movies are accumulated
          if (allMovies.length > 20) {
            fetchMoreData = false;
          }

          // Update state with the new movie list
          setMovies((prevMovies) => [
            ...new Set([...prevMovies, ...moviesWithDetails]),
          ]);

          // Set the current movie card and the next movie card if they are not already set
          if (!currentMovie) {
            setCurrentMovie(allMovies[0]);
          }
          if (!nextMovie) {
            setNextMovie(allMovies[1]);
          }
        } catch (error) {
          console.error("Error fetching movies. App will not retry:", error);
          fetchMoreData = false;
        } finally {
          setLoading(false);
          setTmdbIndex(tempIndex);
          setFetchMoreMovies(false);
          updateTmdbIndex(tempIndex - 1); // Update backend index to avoid skipping movies
        }
      }
    };

    console.log("Movies Remaining in Queue: ", movies.length);
    // Trigger the movie fetching if the queue is too low
    if (movies.length < REM_MOVIES_THRESHOLD){
      console.log("Fetching movies...");
      getMovies();
    }
  }, [currentIndex]); // Re-run the effect when the currentIndex changes (Each time a movie is swiped)

  // Animation for scaling the next card based on the swiping progress of the current card
  const scaleAnim = cardPositionX.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: [1.0, 0.8, 1.0], // Card scales down while swiping
    extrapolate: "clamp",
  });

  // Handle swipe actions (left for nope, right for like)
  const handleSwipe = (direction: string) => {
    if (currentMovie) {
      if (direction === "right") {
        onSwipeRight(currentMovie); // Trigger the right swipe action
      } else if (direction === "left") {
        onSwipeLeft(currentMovie); // Trigger the left swipe action
      }
    }
    cardPositionX.setValue(0); // Reset card position after the swipe

    const shiftedMovies = movies.slice(1); // Remove the current movie from the queue 
    setMovies(shiftedMovies); // Update the movie queue
    setCurrentMovie(shiftedMovies[0]); // Update the current movie card
    setNextMovie(shiftedMovies[1]); // Update the next movie card
    setCurrentIndex(currentIndex + 1); // Increment the index -- this is used to track the current movie card / swiper
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
