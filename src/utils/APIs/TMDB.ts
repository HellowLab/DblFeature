import axios from "axios";
import { tmdbCredits, tmdbMovie, tmdbReview, tmdbContentRating } from "../types/types";

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

/**
 * DBL-17: Fetch the content rating (e.g., PG, PG-13, R, etc.) for a movie from The Movie Database (TMDB).
 * 
 * @param {number} movieId - The ID of the movie to fetch the content rating for.
 * @param {string} country - The ISO 3166-1 country code for the country to fetch the content rating from.
 * @returns {Promise<string>} - A promise that resolves to the content rating for the movie in the specified country.
 */
export const getMovieContentRating = async (
  movieId: number,
  country: string
): Promise<string> => {
  
/**
 * TMDB Release Types
 * Type Value	Description
 * 1	Premiere
 * 2	Theatrical (Limited)
 * 3	Theatrical
 * 4	Digital
 * 5	Physical (e.g., DVD, Blu-ray)
 * 6	TV
 *  */ 
  const releaseTypeList: number[] = [2, 3,4,5,6]; // Specify the release type for theatrical release. Ignore Premieres.
  let contentRating: string = "";

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/release_dates`,
      {
        headers: {
          accept: "application/json", // Specify that the response should be JSON
          Authorization: `Bearer ${TMDB_ACCESS_TOKEN}`, // Use the API token for authentication
        },
      }
    );
    // filter the response based on the selected country code. Only show the release dates for the selected country
    const filteredResponse = response.data.results.find(item => item.iso_3166_1 === country);
    
    if (filteredResponse?.release_dates?.length > 0 && contentRating === "") {
      // Find the first release_date that matches the criteria
      const matchingRelease = filteredResponse.release_dates.find(
          (item) => releaseTypeList.includes(item.type) && item.certification
      );
  
      // If a match is found, set the contentRating
      if (matchingRelease) {
          contentRating = matchingRelease.certification;
          console.log("contentRating to return: ", contentRating);
      }
  }

  // original version of code below is the same as the optimized version above. keeping this while testing refactored code
    // if (filteredResponse) {
    //   if (filteredResponse.release_dates.length > 0) {
    //     // if the content rating is not specified, find the first accurate content rating found
    //     if (contentRating == "") {
    //       // for each release_date in filteredResponse, check the type and certification
    //       filteredResponse.release_dates.forEach((item) => {
    //         console.log("releaseDates: ", item);
    //         if (releaseTypeList.includes(item.type)) {
    //           if (item.certification) {
    //             // if the content rating is found, set the content rating
    //             contentRating = item.certification;
    //             console.log("contentRating to return: ", item.certification);
    //           }
    //         }
    //       });
    //     }
    //   }        
    // }
  } catch (error) {
    console.error("Error fetching content rating:", error);
  }
  if (contentRating == "") console.log("No content rating found, returning empty string");
  
  return contentRating; // Return the content rating for the movie in the specified country, or an empty string if no content rating was found
}
