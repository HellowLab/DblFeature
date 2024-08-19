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
