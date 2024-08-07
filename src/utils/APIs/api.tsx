import axios, { AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/constants';

interface DataResponse {
  // Define the structure of your expected data here
  id: number;
  name: string;
}

interface ErrorResponse {
  message: string;
  statusCode: number;
  // Additional error fields as needed
}
// NOTE -- URL MUST END WITH A SLASH 

// standard GET request
export const myfetch = async (url: string, fetchtype: "GET" | "POST" | "PATCH", params?: object, useAuth?: boolean,) => {
  console.log(fetchtype +": " + (API_BASE_URL + url));
  console.log(JSON.stringify(params));

  // console.log("POST: ", (API_BASE_URL + url));
  if (fetchtype == "POST") {
    return axios.post((API_BASE_URL + url), params, {
      timeout: 5000, // Timeout set to 5000 milliseconds (5 seconds)
    });
  }

  // try {
  //   fetch((API_BASE_URL + url), {
  //     method: fetchtype,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(params),
  //   })
  //   .then((response) => {
  //     console.log("Res: " + JSON.stringify(response.json()))
  //     return response.json();
  //   })
  // } catch (error) {
  //   console.log("error during fetch")
  //   throw error;
  // }
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