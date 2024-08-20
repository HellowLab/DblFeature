import { MovieCardProps } from "@/src/components/MovieCard/MovieCard";
import { createMovieResult } from "../APIs/api";

/**
 * Handler for when a movie card is swiped left.
 *
 * @param {MovieCardProps} movie - The movie card that was swiped left.
 */
export const onSwipeLeft = (movie: MovieCardProps) => {
  // console.warn("swipe left", movie);
  // Call the API to update the movie swipe result
  createMovieResult(movie.id, movie.name, 0, movie.image);        
};

/**
 * Handler for when a movie card is swiped right.
 *
 * @param {MovieCardProps} movie - The movie card that was swiped right.
 */
export const onSwipeRight = (movie: MovieCardProps) => {
  // console.warn("swipe right", movie);
  // Call the API to update the movie swipe result
  createMovieResult(movie.id, movie.name, 1, movie.image);
};
