import React, { useEffect, useState } from "react";
import AnimatedStack from "@/src/components/AnimatedStack";
import { onSwipeLeft, onSwipeRight } from "@/src/utils/callbacks";
import { fetchMovies, Movie } from "@/src/utils/APIs/TMDB";
import { MovieCardProps } from "@/src/components/MovieCard";
import LoadingIndicator from "../components/LoadingIndicator";

const HomeScreen = () => {
  const [movies, setMovies] = useState<MovieCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  // Effect hook to fetch movies when the component mounts
  useEffect(() => {
    // Async function to fetch and format movies data
    const getMovies = async () => {
      try {
        // Fetch the movies data from the API (currently just getting the 1st page)
        const moviesData: Movie[] = await fetchMovies(1);
        // Format the movies data to match the MovieCardProps structure
        const formattedMovies: MovieCardProps[] = moviesData.map((movie) => ({
          id: movie.id,
          name: movie.title,
          image: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "", // Provide a default value for image if poster_path is null
          bio: movie.overview,
        }));
        // Update the movies state with the formatted data
        setMovies(formattedMovies);
      } catch (error) {
        // Log any errors that occur during the fetch operation
        console.error("Error fetching movies:", error);
      } finally {
        // Ensure loading is set to false once the fetch operation is complete
        setLoading(false);
      }
    };

    // Call the async function to fetch movies
    getMovies();
  }, []);

  // Show a loading indicator while the movies data is being fetched
  if (loading) {
    return <LoadingIndicator />;
  }

  // Render the AnimatedStack component with the fetched movies data
  return (
    <AnimatedStack
      data={movies}
      onSwipeRight={onSwipeRight}
      onSwipeLeft={onSwipeLeft}
    />
  );
};

export default HomeScreen;
