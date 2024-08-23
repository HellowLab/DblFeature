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

  // Fetch movies on component mount.
  useEffect(() => {
    const getMovies = async () => {
      let fetchMoreData: boolean = true; // controls the while loop for fetching movies
      let myMoviesList: number[] = []; // list of tmdb id's fetched from dbl feature backend
      let newMovies: tmdbMovie[] = []; // list of tmdb movies fetched from tmdb api
      let allMovies: tmdbMovie[] = []; // list of all tmdb movies fetched from tmdb api -- new movies combined with previous movie list
      let tempIndex: number = tmdbIndex; // index to keep track of the page number for tmdb api

      // fetch my movies from dbl feature backend
      try {
        const response = await getMovieResults();
        if (response.status === 200) {
          const myMoviesResponse = response.data;

          // map each ID from response.status to a list of just the tmdb_id
          myMoviesList = myMoviesResponse.map((movie: DjangoMovie) =>
            Number(movie.tmdb_id)
          );
        }
      } catch (error) {
        console.error(
          "Error fetching my movies from dblfeature backend:",
          error
        );
      }

      // fetch tmdb index from backend
      const res = await getTmdbIndex(tmdbType);
      if (res.status === 200) {
        // if date equals todays date, set the tempIndex to the tmdb_index from the response
        console.log("todays date: ", new Date().toISOString().split("T")[0]);
        console.log("Response date: ", res.data.date);

        if (res.data.date === new Date().toISOString().split("T")[0]) {
          tempIndex = res.data.index;
        }
      }

      // fetch movies from tmdb api
      while (fetchMoreData) {
        try {
          console.log("Fetching movies from TMDB API... index: ", tempIndex);
          newMovies = await fetchMovies(tempIndex); // fetch movies from tmdb api
          tempIndex += 1; // increase the tmdbIndex by 1 after making api call

          // if a movie is in myMoviesList, remove it from moviesDataResponse
          if (myMoviesList.length > 0) {
            newMovies = newMovies.filter(
              (movie) => !myMoviesList.includes(movie.id)
            );
          }

          // if moviesData is not null, then set moviesData to a new array of unique values from the previous moviesData and newMovies
          if (allMovies) {
            allMovies = Array.from(new Set(allMovies.concat(newMovies)));
          } else {
            allMovies = newMovies;
          }

          // if allMovies has more than 15 movies in it, set fetchMoreData to false, otherwise continue fetching movies
          if (allMovies.length > 15) {
            fetchMoreData = false;
          }
        } catch (error) {
          console.error("Error fetching movies. App will not retry:", error);
          fetchMoreData = false;
        } finally {
          // Format the fetched movies data and update the state.
          const formattedMovies: MovieCardProps[] = allMovies.map((movie) => ({
            id: movie.id,
            name: movie.title,
            image: movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "",
            bio: movie.overview,
            cast: [], // TODO: get array of cast members
            crew: [], // TODO: get array of crew members
            reviews: [], /// TODO: get array of reviews
          }));

          // Update the state with the formatted movies
          setMovies((prevMovies) => [...prevMovies, ...formattedMovies]);
          setLoading(false);
          setTmdbIndex(tempIndex);
          setFetchMoreMovies(false);
          updateTmdbIndex(tempIndex-1); // update the tmdb index in the backend (use tempIndex-1 to ensure we don't skip any movies if we need to refetch the page we just got)
        }
      }
    };

    console.log("Fetching movies...");
    if (fetchMoreMovies && (movies.length - currentIndex < 5)) {
      getMovies();
    }
  }, [fetchMoreMovies]);

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
