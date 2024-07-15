import { MovieCardProps } from "@/src/components/MovieCard/MovieCard";

/**
 * Handler for when a movie card is swiped left.
 *
 * @param {MovieCardProps} movie - The movie card that was swiped left.
 */
export const onSwipeLeft = (movie: MovieCardProps) => {
  console.warn("swipe left", movie);
};

/**
 * Handler for when a movie card is swiped right.
 *
 * @param {MovieCardProps} movie - The movie card that was swiped right.
 */
export const onSwipeRight = (movie: MovieCardProps) => {
  console.warn("swipe right", movie);
};
