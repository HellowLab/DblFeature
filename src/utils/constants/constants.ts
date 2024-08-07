// Constants used for styling
export const BORDERRADIUS = 3

// Constants used for card animations

// The angle of rotation for the card when swiped
export const ROTATION = -35;

// The minimum swipe velocity required to trigger a swipe action
export const SWIPE_VELOCITY = 800;

// The threshold for vertical swipe movement
export const SWIPE_THRESHOLD_Y = 80;

// backend API route
import Constants from "expo-constants";
// export const API_BASE_URL = "http://" + Constants.expoConfig?.hostUri?.slice(0, -5) + ":8000/"; // this is used for android emulator accessing the localhost IP
export const API_BASE_URL = "http://10.0.2.2:8000/"; // this is used for android emulator accessing the localhost IP
// export const API_BASE_URL = "http://127.0.0.1:8000/"; // this is used for android emulator accessing the localhost IP

