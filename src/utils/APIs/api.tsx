import axios, { AxiosError, InternalAxiosRequestConfig, AxiosInstance  } from 'axios';
import { getToken } from '../store/TokenStore';


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

// Add a request interceptor
// This is called every time an api call is made
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

// NOTE -- URL MUST END WITH A SLASH OR ELSE IT WILL NOT WORK
// my fetch function to handle all api calls using Axios
export const myfetch = async (url: string, fetchtype: "GET" | "POST" | "PATCH", params?: object, useAuth?: boolean,) => {
  console.log(fetchtype +": " + (API_BASE_URL + url));
  console.log(JSON.stringify(params));

  if (fetchtype == "POST") {
    return api.post(url,params)
  }

  if (fetchtype == "PATCH") {
    return api.patch(url,params)
  }

  if (fetchtype == "GET") {
    return api.get(url, params=params)
  }
};

// handle axios errors
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
    const response = await myfetch('auth/login/', "POST", data, false);
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

// register new user
export const registerUser = async (email: string, password1: string, password2: string, firstname: string, lastname: string, username: string) => {
  const data = {
    email: email, 
    password1: password1, 
    password2: password2,
    username: username,
  };
  try {
    const response = await myfetch('auth/register/', "POST", data, false);
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
    const response = await myfetch('dblfeature/movieresult/', "POST", data, true);
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
    const response = await myfetch('dblfeature/movieresult/', "GET", undefined, true);
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