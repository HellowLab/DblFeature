import axios from "axios";

// API endpoint to get popular movies from TMDB
const API_URL_POPULAR_MOVIES = "https://api.themoviedb.org/3/movie/popular";
// API endpoint to discover movies from TMDB
const API_URL_ALL_MOVIES = "https://api.themoviedb.org/3/discover/movie";
// Base URL for movie poster images
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Define the Movie interface to type the movie data
export interface Movie {
  id: number;
  title: string;
  poster_path: string | null; // Movie poster path, can be null
  overview: string; // Short description of the movie
}

// Import the TMDB access token from the environment variables
//@ts-ignore
import { TMDB_ACCESS_TOKEN } from "@env";

/**
 * Fetch a list of movies from TMDB
 *
 * @param {number} page - The page number to fetch
 * @returns {Promise<Movie[]>} A promise that resolves to an array of Movie objects
 */
export const fetchMovies = async (page: number): Promise<Movie[]> => {
  try {
    // Make a GET request to the discover movies API endpoint
    const response = await axios.get(API_URL_ALL_MOVIES, {
      headers: {
        // Include the TMDB access token in the Authorization header
        Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
      },
      params: {
        language: "en-US", // Set the language to English
        page: page, // Fetch the specified page of results
      },
    });
    // Return the list of movies from the response
    return response.data.results;
  } catch (error) {
    // Handle any errors that occur during the API request
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching movies:",
        error.response ? error.response.data : error.message
      );
    } else {
      console.error("Unexpected error:", error);
    }
    // Rethrow the error to be handled by the caller
    throw error;
  }
};

/**
 * Get the full URL for a movie poster image
 *
 * @param {string} path - The path of the movie poster image
 * @returns {string} The full URL to the movie poster image
 */
export const getImageUrl = (path: string): string => {
  return `${IMAGE_BASE_URL}${path}`;
};
