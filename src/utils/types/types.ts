// define custom color scheme name
export type ColorSchemeName = "light" | "dark" | "system" | null | undefined;

// Define the Movie interface to type the movie data
export interface tmdbMovie {
  id: number;
  title: string;
  poster_path: string; // Movie poster path, can be null
  overview: string; // Short description of the movie
  release_date: string; // Release date of the movie
  vote_average: number; // Average rating of the movie out of 10
  vote_count: number; // Number of votes (ratings) a movie has
  popularity: number; // Popularity rating of a movie (the higher, the more popular a movie is) - used for search relevance
}

export interface DjangoMovie {
  id: number; // Unique ID for the movie -- primary key from Django
  user: number; // ForeignKey referencing the user ID
  tmdb_id: number; // The ID of the movie on TMDB
  name: string; // The name of the movie
  poster?: string | null; // Optional or can be null
  liked: number; // Whether the movie is liked or disliked
  swipeDate: string; // Dates are typically represented as strings in JSON
  watched: boolean; // Whether the movie has been watched
  myRating?: number | null; // Optional or can be null
  myComments?: string | null; // Optional or can be null
}

// API response object
export interface APIResponse {
  data: any;
  status: number;
  message?: string;
}

// Define the type for the TMDB index
export type tmdb_index_type = "popular" | "top_rated" | "upcoming" | "now_playing" | "none";

// Define the structure for a Cast member
export interface CastMember {
  cast_id: number;
  character: string;
  credit_id: string;
  gender: number | null; // 1 for female, 2 for male, null if not specified
  id: number;
  name: string;
  order: number; // The order of the cast member in credits
  profile_path: string | null; // Path to the profile image, can be null
}

// Define the structure for a Crew member
export interface CrewMember {
  credit_id: string;
  department: string; // Department like Directing, Writing, etc.
  gender: number | null; // 1 for female, 2 for male, null if not specified
  id: number;
  job: string; // Job title, like Director, Writer, etc.
  name: string;
  profile_path: string | null; // Path to the profile image, can be null
}

// Define the structure for TMDB credits, including cast and crew
export interface tmdbCredits {
  id: number; // Movie ID
  cast: CastMember[]; // Array of cast members
  crew: CrewMember[]; // Array of crew members
}
