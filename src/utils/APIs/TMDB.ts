import axios from "axios";
import { tmdbCredits, tmdbMovie, tmdbReview } from "../types/types";

// API endpoint to get popular movies from TMDB
const API_URL_POPULAR_MOVIES = "https://api.themoviedb.org/3/movie/popular";
// API endpoint to discover movies from TMDB
const API_URL_ALL_MOVIES = "https://api.themoviedb.org/3/discover/movie";
// API endpoint to get movie credits from TMDB
const API_URL_MOVIE_CREDITS = "https://api.themoviedb.org/3/movie";

// Base URL for movie poster images
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Access the TMDB access token from the environment variables
const TMDB_ACCESS_TOKEN = process.env.EXPO_PUBLIC_TMDB_ACCESS_TOKEN;

/**
 * Search for movies by query
 *
 * @param {string} query - The search query
 * @returns {Promise<tmdbMovie[]>} A promise that resolves to an array of Movie objects matching the query
 */
export const searchMovies = async (query: string): Promise<tmdbMovie[]> => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
        params: {
          query,
        },
      }
    );
    return response.data.results;
  } catch (error) {
    // Log any errors that occur during the search request
    console.error("Error searching movies:", error);
    return [];
  }
};

/**
 * Fetch a list of movies from TMDB
 *
 * @param {number} page - The page number to fetch
 * @returns {Promise<tmdbMovie[]>} A promise that resolves to an array of Movie objects
 */
export const fetchMovies = async (page: number): Promise<tmdbMovie[]> => {
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

/**
 * Fetch detailed information about a movie
 *
 * @param {number} movieId - The ID of the movie to fetch details for
 * @returns {Promise<tmdbMovie>} A promise that resolves to the Movie object with detailed information
 */
export const getMovieDetails = async (movieId: number): Promise<tmdbMovie> => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Log any errors that occur during the request for movie details
    console.error("Error fetching movie details:", error);
    // Rethrow the error to be handled by the caller
    throw error;
  }
};

/**
 * Fetch cast and crew information for a movie
 *
 * @param {number} movieId - The ID of the movie to fetch credits for
 * @returns {Promise<tmdbCredits>} A promise that resolves to an object containing cast and crew information
 */
export const getMovieCredits = async (
  movieId: number
): Promise<tmdbCredits> => {
  try {
    const response = await axios.get(
      `${API_URL_MOVIE_CREDITS}/${movieId}/credits`,
      {
        headers: {
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    // Log any errors that occur during the request for movie credits
    console.error("Error fetching movie credits:", error);
    // Return an empty object or rethrow the error based on your application's needs
    return { id: movieId, cast: [], crew: [] };
  }
};

/**
 * Fetch reviews for a movie from The Movie Database (TMDB).
 *
 * @param {number} movieId - The ID of the movie to fetch reviews for.
 * @returns {Promise<tmdbReview[]>} - A promise that resolves to an array of TMDB reviews.
 */
export const getMovieReviews = async (
  movieId: number
): Promise<tmdbReview[]> => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/reviews`,
      {
        headers: {
          accept: "application/json", // Specify that the response should be JSON
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`, // Use the API token for authentication
        },
        params: {
          language: "en-US", // Fetch reviews in English
          page: 1, // Specify the page of reviews to fetch
        },
      }
    );
    // console.log(`Reviews for movie ID ${movieId}:`, response.data);
    return response.data.results; // Return the array of reviews from the API response
  } catch (error) {
    console.error("Error fetching movie reviews:", error);
    return []; // Return an empty array in case of an error
  }
};
