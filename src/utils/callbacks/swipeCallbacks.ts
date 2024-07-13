import { MovieCardProps } from "@/src/components/MovieCard/MovieCard";

export const onSwipeLeft = (movie: MovieCardProps) => {
  console.warn("swipe left", movie);
};

export const onSwipeRight = (movie: MovieCardProps) => {
  console.warn("swipe right", movie);
};
