import React, { useState, useRef, useEffect } from "react";
import { View, Animated, useWindowDimensions } from "react-native";
import { fetchMovies, getMovieCredits } from "@/src/utils/APIs/TMDB";
import LoadingIndicator from "../../components/LoadingIndicator";
//@ts-ignore
import LIKE from "../../assets/images/LIKE.png";
//@ts-ignore
import nope from "../../assets/images/nope.png";
import MovieCard, { MovieCardProps } from "@/src/components/MovieCard";
import { styles } from "@/src/screens/HomeScreen/HomeScreen.styles";
import Swiper from "@/src/components/Swiper";
import { onSwipeLeft, onSwipeRight } from "@/src/utils/callbacks";
import { tmdbMovie, tmdbCredits } from "@/src/utils/types/types";

const HomeScreen = () => {
  const { width: screenWidth } = useWindowDimensions();
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const nopeOpacity = useRef(new Animated.Value(0)).current;
  const cardPositionX = useRef(new Animated.Value(0)).current;

  const [movies, setMovies] = useState<MovieCardProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const moviesData: tmdbMovie[] = await fetchMovies(1);
        const moviesWithCredits: MovieCardProps[] = await Promise.all(
          moviesData.map(async (movie) => {
            const credits: tmdbCredits = await getMovieCredits(movie.id);

            // Use detailed cast and crew information
            return {
              id: movie.id,
              name: movie.title,
              image: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : "",
              bio: movie.overview,
              cast: credits.cast.slice(0, 10), // Take the top 10 cast members
              crew: credits.crew.slice(0, 10), // Take the top 10 crew members
              reviews: [], // TODO: get array of reviews
            };
          })
        );

        setMovies(moviesWithCredits);
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    getMovies();
  }, []);

  const scaleAnim = cardPositionX.interpolate({
    inputRange: [-screenWidth, 0, screenWidth],
    outputRange: [1.0, 0.8, 1.0],
    extrapolate: "clamp",
  });

  const currentMovie = movies[currentIndex] ?? null;
  const nextMovie = movies[currentIndex + 1] ?? null;

  const handleSwipe = (direction: string) => {
    if (direction === "right") {
      console.log("Swiped Right:", currentMovie);
      onSwipeRight(currentMovie);
    } else if (direction === "left") {
      console.log("Swiped Left:", currentMovie);
      onSwipeLeft(currentMovie);
    }
    cardPositionX.setValue(0);
    setCurrentIndex((prevIndex) => prevIndex + 1);
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
