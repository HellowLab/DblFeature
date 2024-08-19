import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosInstance,
} from "axios";
import { getToken, getRefreshToken, saveToken } from "../store/TokenStore";
import { router } from "expo-router";
import { APIResponse } from "../types/types";

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
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const token = await getToken();
    // If a token exists, add it to the Authorization header
    if (token) {
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
export const myfetch = async (
  url: string,
  fetchtype: "GET" | "POST" | "PATCH" | "PUT",
  data?: object,
  params?: object
) => {
  console.log(fetchtype + ": " + (API_BASE_URL + url));
  console.log(JSON.stringify(params));

  const maxRetries = 3;
  let retry = 0;
  let res = null;
  while (retry < maxRetries) {
    // try to make the api call
    try {
      if (fetchtype == "POST") {
        res = await api.post(url, data);
      }

      if (fetchtype == "PATCH") {
        res = await api.patch(url, data, { params });
      }

      if (fetchtype == "GET") {
        res = await api.get(url, { params });
      }
      if (fetchtype == "PUT") {
        res = await api.put(url, data, { params });
      }
      return res;
    } catch (error) {
      // handle any errors that occur
      // if the error is an Axios error caused by the api response.status
      if (axios.isAxiosError(error)) {
        // if error is caused by user not being authenticated, try to refresh the users token
        if (error.response?.status == 401) {
          const refreshSuccess = await refreshToken();
          if (refreshSuccess) {
            console.log("Token refreshed");
            retry += 1;
          } else {
            retry = maxRetries + 1; // exit loop
            router.push("/(login)");
          }
        } else {
          // Axios error
          const errorResponse = handleAxiosError(
            error as AxiosError<ErrorResponse>
          );
          return errorResponse;
        }
      } else {
        // Non-Axios error
        console.error("Error:", error);
        return error;
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
    console.error("Error response:", axiosError.response.data);
    console.error("Status code:", axiosError.response.status);
    // setError(`Error: ${axiosError.response.data.message}`);
    return axiosError.response;
  } else if (axiosError.request) {
    // The request was made, but no response was received
    console.error("No response received:", axiosError.request);
    // setError('Error: No response received from server.');
    return axiosError.request;
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("Error message:", axiosError.message);
    // setError(`Error: ${axiosError.message}`);
  }
  return axiosError;
};

/**
 *
 * @param username username for user to be logged in
 * @param password password for user to be logged in
 * @returns api response
 */
export const login = async (username: string, password: string) => {
  const data = { username: username, password: password };
  try {
    const response = await myfetch("auth/login/", "POST", data);
    console.log("response: ", response?.data);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error
      const errorResponse = handleAxiosError(
        error as AxiosError<ErrorResponse>
      );
      return errorResponse;
    } else {
      // Non-Axios error
      console.error("Error:", error);
      // setError('Error: An unexpected error occurred.');
    }
  }
};

/**
 * Attempt to refresh the user's access token using the refresh token in an API call to the backend.
 *
 * @returns true if the token was successfully refreshed, false otherwise
 */
export const refreshToken = async () => {
  const refreshToken = await getRefreshToken();
  const data = { refresh: refreshToken };
  console.log("Refreshing token from this point");
  try {
    const response = await axios.post(
      API_BASE_URL + "auth/token/refresh/",
      data
    );
    console.log("refresh response: ", response);
    console.log(
      "Refresh Response Status (may fail with status of undefined): ",
      response.status
    );
    if (response.status == 200) {
      saveToken(
        response.data.access,
        response.data.refresh,
        response.data.access_expiration,
        response.data.refresh_expiration
      );
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error in refreshToken function in api.tsx");
    const errorResponse = handleAxiosError(error as AxiosError<ErrorResponse>);
    return false;
  }
};

/**
 * Checks if the current token is valid by making an API call to the backend.
 * @param token The current users access token
 * @returns true if the token is valid, false otherwise
 */
export const isTokenValid = async (token: string) => {
  const data = { token: token };
  try {
    const response = await myfetch("auth/token/verify/", "POST", data);
    // console.log(response)
    if (response.status == 200) {
      return true;
    }
    return false;
  } catch (error) {
    console.log("Error in isTokenValid function in api.tsx");
    if (axios.isAxiosError(error)) {
      // Axios error
      const errorResponse = handleAxiosError(
        error as AxiosError<ErrorResponse>
      );
    } else {
      // Non-Axios error
      console.error("Error:", error);
      // setError('Error: An unexpected error occurred.');
    }
    return false;
  }
};

/**
 *
 * @param email email for new user
 * @param password1 password for new user
 * @param password2 password again for new user
 * @param firstname first name for new user
 * @param lastname last name for new user
 * @param username username for new user
 * @returns api response
 */
export const registerUser = async (
  email: string,
  password1: string,
  password2: string,
  firstname: string,
  lastname: string,
  username: string
) => {
  const data = {
    email: email,
    password1: password1,
    password2: password2,
    username: username,
  };
  try {
    const response = await myfetch("auth/register/", "POST", data);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error
      const errorResponse = handleAxiosError(
        error as AxiosError<ErrorResponse>
      );
      return errorResponse;
    } else {
      // Non-Axios error
      console.error("Error:", error);
      // setError('Error: An unexpected error occurred.');
    }
  }
};

/**
 *
 * @param movieId tmdb ID of the movie
 * @param movieName name of the move
 * @param liked integer for if the movie was added to watchlist by user[0:disliked, 1: liked, 2: null/neither]
 * @param poster movie poster url
 * @returns api response
 */
export const createMovieResult = async (
  movieId?: number,
  movieName?: string,
  liked?: number,
  poster?: string,
  myRating?: number
) => {
  const data = {
    tmdb_id: movieId,
    name: movieName,
    liked: liked,
    poster: poster,
    myRating: myRating,
  };

  try {
    const response = await myfetch("dblfeature/movieresult/", "POST", data);
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error
      const errorResponse = handleAxiosError(
        error as AxiosError<ErrorResponse>
      );
      return errorResponse;
    } else {
      // Non-Axios error
      console.error("Error:", error);
      // setError('Error: An unexpected error occurred.');
    }
  }
};

// Get Movie Results
export const getMovieResults = async () => {
  try {
    const response = await myfetch("dblfeature/movieresult/", "GET");
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error
      const errorResponse = handleAxiosError(
        error as AxiosError<ErrorResponse>
      );
      return errorResponse;
    } else {
      // Non-Axios error
      console.error("Error:", error);
      // setError('Error: An unexpected error occurred.');
    }
  }
};

/**
 *
 * @param movieId tmdb ID of the movie
 * @param movieName name of the move
 * @param liked boolean for if the movie was added to watchlist by user
 * @param poster movie poster url
 * @returns api response
 */
export const updateMovieResult = async (
  id: number,
  liked?: number,
  myRating?: number
) => {
  const data = {
    id: id,
    liked: liked,
    myRating: myRating,
  };

  try {
    const res = await myfetch("dblfeature/movieresult/", "PUT", data);
    if (res.status == 200) {
      const apiRes: APIResponse = {
        data: res.data,
        status: res.status,
        message: "Movie Result Updated",
      };
      return apiRes;
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error
      const errorResponse = handleAxiosError(
        error as AxiosError<ErrorResponse>
      );
      return errorResponse;
    } else {
      // Non-Axios error
      console.error("Error:", error);
      // setError('Error: An unexpected error occurred.');
    }
  }
};

/**
 *
 * @param tmdb_id tmdb ID of the movie
 * @param id django ID of the movie
 * @returns api response
 */
export const getMyMovie = async (id?: number, tmdb_id?: number) => {
  const data = {
    tmdb_id: tmdb_id,
  };

  console.log("data: ", data);
  try {
    const res = await myfetch(
      `dblfeature/singlemovieresult/`,
      "GET",
      undefined,
      data
    );
    if (res.status == 200) {
      const apiRes: APIResponse = {
        data: res.data,
        status: res.status,
        message: "Single Movie Returned",
      };
      return apiRes;
    }
    if (res.status == 404) {
      const apiRes: APIResponse = {
        data: res.data,
        status: res.status,
        message: "Movie Not Found",
      };
      return apiRes;
    }
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Axios error
      const errorResponse = handleAxiosError(
        error as AxiosError<ErrorResponse>
      );
      console.log("my errorResponse: ", errorResponse);
      return errorResponse;
    } else {
      // Non-Axios error
      console.error("Error:", error);
      // setError('Error: An unexpected error occurred.');
    }
  }
};
