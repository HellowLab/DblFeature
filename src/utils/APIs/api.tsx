import axios, { AxiosError, InternalAxiosRequestConfig, AxiosInstance  } from 'axios';
import { getToken, getRefreshToken, saveToken } from '../store/TokenStore';
import { router } from 'expo-router';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

interface ErrorResponse {
  message: string;
  statusCode: number;
}

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000, // Timeout set to 5000 milliseconds (5 seconds)
});

/**
 * Interceptor is called every time an api call is made. This applies the proper headers 
 * and bearer token to the request.
 */
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      const token = await getToken();
      // If a token exists, add it to the Authorization header
      if (token) {
          // console.log("token: ", token)
          config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
  },
  (error) => {
      return Promise.reject(error);
  }
);


/**
 * 
 * @param url ending of the url for the backend api. EX: 'auth/login/'
 * 
 * NOTE: Do not include the base url in the url parameter
 * 
 * NOTE: The url must end with a '/'
 * @param fetchtype type of API call. EX: "GET", "POST", "PATCH"
 * @param params data to send for the API call
 * @returns API response
 */
export const myfetch = async (url: string, fetchtype: "GET" | "POST" | "PATCH", params?: object,) => {
  console.log(fetchtype +": " + (API_BASE_URL + url));
  console.log(JSON.stringify(params));
  let retry = true;
  let res = null;
  while (retry) {
    // try to make the api call
    try {
      if (fetchtype == "POST") {
        res = await api.post(url,params)
      }
    
      if (fetchtype == "PATCH") {
        res = await api.patch(url,params)
      }
    
      if (fetchtype == "GET") {
        res = await api.get(url, params=params)
      }
      return res;
    }
    catch (error) {
      // handle any errors that occur
      // if the error is an Axios error caused by the api response.status
      if (axios.isAxiosError(error)) {
        // if error is caused by user not being authenticated, try to refresh the users token
        handleAxiosError(error as AxiosError<ErrorResponse>);
        if (error.response?.status == 401) {
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            console.log("Token refreshed")
            retry = true;
          }
          else {
            retry = false;
            router.push("/(login)");
          }
        }
        else {
          // Axios error
          const errorResponse = handleAxiosError(error as AxiosError<ErrorResponse>);
          return errorResponse
        }
      } else {
        // Non-Axios error
        console.error('Error:', error);
        return error
      }
    }
  }
};

/**
 * 
 * @param axiosError error object from axios
 * @returns appropriate error response
 */
const handleAxiosError = (axiosError: AxiosError<ErrorResponse>) => {
  if (axiosError.response) {
    // The server responded with a status code outside the 2xx range
    console.error('Error response:', axiosError.response.data);
    console.error('Status code:', axiosError.response.status);
    // setError(`Error: ${axiosError.response.data.message}`);
    return axiosError.response

  } else if (axiosError.request) {
    // The request was made, but no response was received
    console.error('No response received:', axiosError.request);
    // setError('Error: No response received from server.');
    return axiosError.request
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error message:', axiosError.message);
    // setError(`Error: ${axiosError.message}`);
  }
  return axiosError
}
// login
export const login = async (username: string, password: string) => {
  const data = {username: username, password: password};
  try {
    const response = await myfetch('auth/login/', "POST", data);
    console.log("response: ", response?.data)
    return response;
  } 
  catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error
      const errorResponse = handleAxiosError(error as AxiosError<ErrorResponse>);
      return errorResponse
    } else {
      // Non-Axios error
      console.error('Error:', error);
      // setError('Error: An unexpected error occurred.');
    }
    
  }
}

/**
 * Attempt to refresh the user's access token using the refresh token in an API call to the backend. 
 * 
 * @returns true if the token was successfully refreshed, false otherwise
 */
export const refreshToken = async () => {
  const refreshToken = await getRefreshToken();
  const data = {refresh: refreshToken};
  console.log("Refreshing token from this point")
  try {
    const response = await axios.post(API_BASE_URL + 'auth/token/refresh/', data);
    console.log("refresh response: ", response);
    if (response.status == 200) {
      saveToken(response.data.access, response.data.refresh, response.data.access_expiration, response.data.refresh_expiration);
      return true;
    }
    return false;
  } 
  catch (error) {
    const errorResponse = handleAxiosError(error as AxiosError<ErrorResponse>);
    return false
  }
}

/**
 * Checks if the current token is valid by making an API call to the backend.
 * @param token The current users access token
 * @returns true if the token is valid, false otherwise
 */
export const isTokenValid = async (token: string) => {
  const data = {token: token};
  try {
    const response = await myfetch('auth/token/verify/', "POST", data);
    if (response.status == 200) {
      return true;
    }
    return false;
  } 
  catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error
      const errorResponse = handleAxiosError(error as AxiosError<ErrorResponse>);
    } else {
      // Non-Axios error
      console.error('Error:', error);
      // setError('Error: An unexpected error occurred.');
    }
    return false;
  }
}

// register new user
export const registerUser = async (email: string, password1: string, password2: string, firstname: string, lastname: string, username: string) => {
  const data = {
    email: email, 
    password1: password1, 
    password2: password2,
    username: username,
  };
  try {
    const response = await myfetch('auth/register/', "POST", data);
    return(response)
  } 
  catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error
      const errorResponse = handleAxiosError(error as AxiosError<ErrorResponse>);
      return errorResponse
    } else {
      // Non-Axios error
      console.error('Error:', error);
      // setError('Error: An unexpected error occurred.');
    }
  }
}

// Update Movie Swipe
export const updateMovieResult = async (movieId: number, movieName: string, liked: boolean, poster: string) => {
  const data = {
    tmdb_id: movieId, 
    name: movieName, 
    liked: liked,
    poster: poster,  
  };
  try {
    const response = await myfetch('dblfeature/movieresult/', "POST", data);
    return response;
  } 
  catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error
      const errorResponse = handleAxiosError(error as AxiosError<ErrorResponse>);
      return errorResponse
    } else {
      // Non-Axios error
      console.error('Error:', error);
      // setError('Error: An unexpected error occurred.');
    }
  }
}

// Get Movie Results
export const getMovieResults = async () => {
  try {
    const response = await myfetch('dblfeature/movieresult/', "GET");
    return response;
  } 
  catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error
      const errorResponse = handleAxiosError(error as AxiosError<ErrorResponse>);
      return errorResponse
    } else {
      // Non-Axios error
      console.error('Error:', error);
      // setError('Error: An unexpected error occurred.');
    }
  }
}