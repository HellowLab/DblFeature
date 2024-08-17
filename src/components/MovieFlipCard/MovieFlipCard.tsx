import React from "react";
import { View, Text, ImageBackground, TouchableOpacity, Button } from "react-native";
import FlipCard from "react-native-flip-card";
import { styles } from "./MovieFlipCard.styles";
import { Ionicons } from "@expo/vector-icons"; // Import icons for the add button
import { useTheme } from "@react-navigation/native";
import { tmdbMovie, DjangoMovie } from "@/src/utils/types/types";
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
const MovieFlipCard: React.FC<MovieCardProps> = ({ movie, movieResult }) => {
  const { colors } = useTheme();
  const [isLiked, setIsLiked] = React.useState<boolean>(movieResult?.liked || false);
  const [isDisliked, setIsDisliked] = React.useState<boolean>(!movieResult?.liked || false);

  const handleLikePress = () => {
    setIsLiked(!isLiked); // toggle the like state
    setIsDisliked(false); // anytime like is pressed, set dislike to false
    let likedBool = null

    if (isLiked) {
      const likedBool = true
    }


    // if the movie exists update the result. otherwise create a new movieResult in 
    if (movieResult) {
      updateMovieResult(movieResult.id, likedBool )
    }
    else {
      createMovieResult(movie.id, movie.title, isLiked)
    }
  }

  const handleDislikePress = () => {
    setIsDisliked(!isDisliked); // toggle the dislike state
    setIsLiked(false); // anytime dislike is pressed, set like to false

    // if the movie exists update the result. otherwise create a new movieResult in 
    if (movieResult) {
      updateMovieResult(movieResult?.id, )
    }
    else {
      createMovieResult(movie.id, movie.title, isLiked)
    }
  }

  // console.log("MovieResult", movieResult);
  return (
    <View style={styles.movieCardContainer}>
      <FlipCard
        style={styles.cardContainer}
        flipHorizontal={true}
        flipVertical={false}
        clickable={true}
      >
        {/* Face Side of the Card */}
        <View style={styles.cardShadow}>
          <ImageBackground
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            }}
            style={styles.cardImageBackground}
            imageStyle={styles.backgroundImage}
          >
            <View style={styles.footer}>
              <View style={[styles.card, styles.cardBack, {justifyContent: "space-between", borderColor: colors.border}]}>
                <MyText size="xxlarge" bold={true} align="center">{movie.title}</MyText>
                <MyText size="large" bold={true} color="normal" align="center">{movie.overview}</MyText>
                <View style={{gap: 8}}>
                  <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
                    <TouchableOpacity onPress={handleDislikePress}>
                      <Ionicons
                        name={isDisliked ? "thumbs-down" : "thumbs-down-outline"}
                        type="ionicons"
                        color={isDisliked ? "red" : colors.text}
                        size={30}
                      />
                    </TouchableOpacity>
                    <StarRating />
                    <TouchableOpacity onPress={handleLikePress}>
                      <Ionicons
                        name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
                        type="ionicons"
                        color={isLiked? "green" : colors.text}
                        size={30}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={{flexDirection: "row", justifyContent:"space-between"}}>
                    <MyText color="normal" align="center">Release Date: {movie.release_date}</MyText>
                    <MyText color="normal" align="center">TMDB Rating: {movie.vote_average}</MyText>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
        {/* Back Side of the Card */}
        <View style={[styles.card, styles.cardBack, {justifyContent: "space-between", backgroundColor:colors.background, borderColor: colors.border}]}>
          <MyText size="xxlarge" bold={true} align="center">{movie.title}</MyText>
          <MyText size="large" color="normal" align="center">{movie.overview}</MyText>
          <View style={{gap: 8}}>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly" }}>
              <TouchableOpacity onPress={handleDislikePress}>
                <Ionicons
                  name={isDisliked ? "thumbs-down" : "thumbs-down-outline"}
                  type="ionicons"
                  color={isDisliked ? "red" : colors.text}
                  size={30}
                />
              </TouchableOpacity>
              <StarRating />
              <TouchableOpacity onPress={handleLikePress}>
                <Ionicons
                  name={isLiked ? "thumbs-up" : "thumbs-up-outline"}
                  type="ionicons"
                  color={isLiked? "green" : colors.text}
                  size={30}
                />
              </TouchableOpacity>
            </View>
            <View style={{flexDirection: "row", justifyContent:"space-between"}}>
              <MyText color="normal" align="center">Release Date: {movie.release_date}</MyText>
              <MyText color="normal" align="center">TMDB Rating: {movie.vote_average}</MyText>
            </View>
          </View>
          
          {/* Additional movie details can be added here */}
        </View>
      </FlipCard>
    </View>
  );
};

export default MovieFlipCard;
