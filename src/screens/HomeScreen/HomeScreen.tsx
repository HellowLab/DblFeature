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
import { tmdbMovie, DjangoMovie, tmdb_index_type, tmdbCredits, tmdbReview } from "@/src/utils/types/types";


import { getTmdbIndex, updateTmdbIndex, getMovieResults } from "@/src/utils/APIs/api";


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
  const [tmdbIndex, setTmdbIndex] = useState(1); // Index for fetching movies from the TMDB API
  const [tmdbType, setTmdbType] = useState<tmdb_index_type>("popular"); // Type of movies to fetch from the TMDB API

  const REM_MOVIES_THRESHOLD = 15; // Threshold for fetching more movies when remaining movies are less than this value

  // Fetch movies on component mount or when fetchMoreMovies changes.
  useEffect(() => {
    const getMovies = async () => {
      try {
        let tempIndex: number = await fetchTmdbIndex();
        const myMoviesList: number[] = await fetchMyMovies();
        const allMovies: MovieCardProps[] = await fetchAndCompileMovies(
          tempIndex,
          myMoviesList
        );

        setMovies(allMovies);
        
        // Set current and next movies if not already set
        if (!currentMovie && allMovies.length > 0)
          setCurrentMovie(allMovies[0]);
        if (!nextMovie && allMovies.length > 1) setNextMovie(allMovies[1]);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false); // Set loading to false after fetching movies
        setCurrentIndex(currentIndex+1); // Increment the index/key after fetching movies to trigger card re-render with latest movies
      }
    };

    const fetchTmdbIndex = async () => {
      const res = await getTmdbIndex(tmdbType);
      if (
        res.status === 200 &&
        res.data.date === new Date().toISOString().split("T")[0]
      ) {
        return res.data.index;
      }
      return tmdbIndex; // Return original index if no valid response
    };

    const fetchMyMovies = async () => {
      const response = await getMovieResults();
      if (response.status === 200) {
        return response.data.map((movie: DjangoMovie) => Number(movie.tmdb_id));
      }
      return [];
    };

    const fetchAndCompileMovies = async (
      startIndex: number,
      myMoviesList: number[]
    ) => {
      let tempIndex: number = startIndex;
      let allMovies: MovieCardProps[] = movies;

      while (allMovies.length <= 17) {
        console.log("Fetching movies - Current length: ", allMovies.length);
        try {
          const newMovies: tmdbMovie[] = await fetchMovies(tempIndex++);

          // Filter out already existing movies
          const filteredMovies = newMovies.filter(
            (movie) => !myMoviesList.includes(movie.id)
          );

          const moviesWithDetails: MovieCardProps[] =
            await getMoviesWithDetails(filteredMovies);

          // Combine allMovies and moviesWithDetails, ensuring unique IDs
          allMovies = getUniqiuMovies(allMovies, moviesWithDetails);
          
          // if (newMovies.length === 0) break; // Break if no new movies are fetched
        } catch (error) {
          console.error("Error fetching movies from TMDB API:", error);
          break; // Break the loop on error
        }
      }

      // Update the index for the next fetch
      tempIndex = tempIndex - 1;
      updateTmdbIndex(tempIndex);

      return allMovies;
    };

    const getMoviesWithDetails = async (movies: tmdbMovie[]) => {
      return Promise.all(
        movies.map(async (movie) => {
          const [credits, reviews] = await Promise.all([
            getMovieCredits(movie.id),
            getMovieReviews(movie.id),
          ]);

          return {
            id: movie.id,
            name: movie.title,
            image: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "",
            bio: movie.overview,
            cast: credits.cast.slice(0, 10),
            crew: credits.crew.slice(0, 10),
            reviews: reviews.slice(0, 5),
          };
        })
      );
    };

    const getUniqiuMovies = (movies1: MovieCardProps[], movies2:MovieCardProps[]) => {
      const movieMap = new Map();

      // Combine allMovies and moviesWithDetails, ensuring unique IDs
      [...movies1, ...movies2].forEach((movie) => {
        movieMap.set(movie.id, movie); // Map uses 'id' as the key to ensure uniqueness
      });

      return Array.from(movieMap.values()); // Convert the Map back to an array
    }

    console.log("Movie Queue: ", movies.length); // Print the number of movies in the queue
      // Trigger the movie fetching if the queue is too low
    if (movies.length < REM_MOVIES_THRESHOLD) {
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
    updateCurrentMovie(); // Update the current and next movie cards
  };

  // Update the current movie card and the next movie card by slicing the first item off of the movies array
  const updateCurrentMovie = () => {
    const shiftedMovies = movies.slice(1); // Remove the current movie from the queue
    setMovies(shiftedMovies); // Update the movies queue

    // this can be deleted, the movies are already filtered for uniqueness in the fetchAndCompileMovies function
    // setMovies(() => {
    //   const movieMap = new Map();

    //   // Populate the Map, using movie IDs as keys to ensure uniqueness
    //   shiftedMovies.forEach((movie) => {
    //     movieMap.set(movie.id, movie); // Map uses 'id' as the key to ensure uniqueness
    //   });

    //   return Array.from(movieMap.values()); // Convert the Map back to an array
    // });
     
    setCurrentMovie(shiftedMovies[0]); // Update the current movie card
    setNextMovie(shiftedMovies[1]); // Update the next movie card
    setCurrentIndex(currentIndex + 1); // Increment the index -- this is used to track the current movie card / swiper
    printMovies(shiftedMovies);
  }   
  
  // Print the movie IDs to the console -- for testing purposes only
  const printMovies = (movies: MovieCardProps[]) => {
    movies.forEach((movie) => {
      console.log(movie.id);
    });

  }

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
