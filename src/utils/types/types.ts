
export interface MovieResult {
  id: number;
  user: number; // ForeignKey referencing the user ID
  tmdb_id: string;
  name: string;
  poster?: string | null; // Optional or can be null
  liked: boolean;
  swipeDate: string; // Dates are typically represented as strings in JSON
  watched: boolean;
  myRanking?: number | null; // Optional or can be null
  myComments?: string | null; // Optional or can be null
}