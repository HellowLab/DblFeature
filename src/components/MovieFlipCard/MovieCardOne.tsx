import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, Button } from "react-native";
import FlipCard from "react-native-flip-card";
import { styles } from "./MovieFlipCard.styles";
import { Ionicons } from "@expo/vector-icons"; // Import icons for the add button
import { useTheme } from "@react-navigation/native";
import { tmdbMovie, DjangoMovie, APIResponse } from "@/src/utils/types/types";
import StarRating from "../StarRating/StarRating";
import MyText from "../TextOutput/TextOutput";

import { createMovieResult, updateMovieResult } from "@/src/utils/APIs/api";

// Define the props for the MovieFlipCard component
interface MovieCardProps {
  movie: tmdbMovie;
  movieResult?: DjangoMovie | null;
}

/**
 * MovieFlipCard component that displays a movie card with flip functionality.
 * The card shows the movie poster on the front and details on the back.
 *
 * @param {MovieCardProps} props - The props for the component.
 * @param {tmdbMovie} props.movie - The movie object containing details such as title, poster path, overview, release date, and rating.
 * @param {DjangoMovie} [props.movieResult] - The movie result object containing additional custom details from the backend api. Optional.
 * @returns {JSX.Element} The MovieFlipCard component.
 */
const MovieCardOne: React.FC<MovieCardProps> =  ({ movie, movieResult }) => {
  const { colors } = useTheme();
  const [showMovieText, setShowMovieText] = React.useState<boolean>(true);
  const [isLiked, setIsLiked] = React.useState<boolean>(movieResult?.liked === 1);
  const [isDisliked, setIsDisliked] = React.useState<boolean>(movieResult?.liked === 0);

  const fullPosterPath = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;

  const handleLikeButtons = async (button: number) => {
    let likedValue = 2; // set default value to "neither"
    if (button === 1) {
      // this if statement is based on the previous value of isLiked -- so we check if the prev value was false
      if (!isLiked) {
        likedValue = 1 // set to "liked" if prev val of isLiked is false
      }
      setIsLiked(!isLiked); // toggle the like state
      setIsDisliked(false); // anytime like is pressed, set dislike to false
    } 
    else if (button === 0) {
      // this if statement is based on the previous value of isLiked -- so we check if the prev value was false
      if (!isDisliked) {
        likedValue = 0 // set to "liked" if prev val of isLiked is false
      }
      setIsDisliked(!isDisliked); // toggle the dislike state
      setIsLiked(false); // anytime dislike is pressed, set like to false
    }

    let res: APIResponse
    // if the movie exists update the result. otherwise create a new movieResult in 
    if (movieResult) {
      res = await updateMovieResult(movieResult.id, likedValue)
    }
    else {
      // const fullPosterPath = "https://image.tmdb.org/t/p/w500/" + movie.poster_path;
      res = await createMovieResult(movie.id, movie.title, likedValue, fullPosterPath)
    }

    // if res is successful 200 or 201, set the movieResult to the response data
    // else set error text and revert the button state
    if (res.status === 200 || res.status === 201) {
        movieResult = res.data
      }
    else {
      console.error(res.message)
      if (button === 1) {
        setIsLiked(!isLiked)
      }
      else {
        setIsDisliked(!isDisliked)
      }
    }
  }

  const handleStarPress = async (rating: number) => {
    let res: APIResponse;
    if (movieResult) {
      res = await updateMovieResult(movieResult?.id, movieResult.liked,rating)
    }
    else {
      // const fullPosterPath = "https://image.tmdb.org/t/p/w500${movie.poster_path}";
      // create a new movie result with the rating, set the liked to 2 (neither liked nor disliked)
      res = await createMovieResult(movie.id, movie.title, 2, fullPosterPath, rating)
    }

    // if res is successful 200 or 201, set the movieResult to the response data
    // else set error text and revert the button state
    if (res.status === 200 || res.status === 201) {
        movieResult = res.data
      }
    else {
      console.error(res.message)
      // TODO: set the rating back to the previous value
    }
  }

  return (
    <ImageBackground
      source={{uri: fullPosterPath,}}
      style={styles.cardImageBackground}
      imageStyle={styles.backgroundImage}
    >
      {/* pressable component, on press call handleBackgroundPress */}
      <TouchableOpacity style={styles.movieCardContainer} onPress={() => setShowMovieText(!showMovieText)}>
        {showMovieText && (
          <View style={styles.footer}>
            <MyText color='white' size="xxlarge" bold={true} align="center">{movie.title}</MyText>
            <MyText color='white' size="large" bold={true} align="center">{movie.overview}</MyText>
            <View style={{gap: 8}}> 
              <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                <TouchableOpacity onPress={() => handleLikeButtons(0)}>
                  <Ionicons
                    name={isDisliked ? "thumbs-down" : "thumbs-down-outline"}
                    type="ionicons"
                    color={isDisliked ? "red" : colors.white}
                    size={30}
                  />
                </TouchableOpacity>
                <StarRating maxStars={5} initialRating={movieResult?.myRating ?? 0} onRatingChange={handleStarPress} />
                <TouchableOpacity onPress={() => handleLikeButtons(1)}>
                  <Ionicons
                    name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
                    type="ionicons"
                    color={isLiked? "green" : colors.white}
                    size={30}
                  />
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: "row", justifyContent:"space-between", width: "100%"}}>
                <MyText color="white" align="center">Release Date: {movie.release_date}</MyText>
                <MyText color="white" align="center">TMDB Rating: {movie.vote_average}</MyText>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    </ImageBackground>
  );
};

export default MovieCardOne;
