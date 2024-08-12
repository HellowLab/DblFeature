import { MovieCardProps } from "@/src/components/MovieCard/MovieCard";
import { updateMovieResult } from "../APIs/api";

/**
 * Handler for when a movie card is swiped left.
 *
 * @param {MovieCardProps} movie - The movie card that was swiped left.
 */
export const onSwipeLeft = (movie: MovieCardProps) => {
  // console.warn("swipe left", movie);
  // Call the API to update the movie swipe result
  updateMovieResult(movie.id, movie.name, false, movie.image);        
};

/**
 * Handler for when a movie card is swiped right.
 *
 * @param {MovieCardProps} movie - The movie card that was swiped right.
 */
export const onSwipeRight = (movie: MovieCardProps) => {
  // console.warn("swipe right", movie);
  // Call the API to update the movie swipe result
  updateMovieResult(movie.id, movie.name, true, movie.image);
};
