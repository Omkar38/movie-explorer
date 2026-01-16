export type TmdbMovieSummary = {
  id: number;
  title: string;
  release_date?: string;
  overview?: string;
  poster_path?: string | null;
};

export type TmdbMovieDetails = TmdbMovieSummary & {
  runtime?: number | null;
  genres?: { id: number; name: string }[];
  tagline?: string;
};

export type TmdbSearchResponse = {
  page: number;
  results: TmdbMovieSummary[];
  total_pages: number;
  total_results: number;
};

export type FavoriteMovie = TmdbMovieSummary & {
  addedAt: string;
  userRating?: number; // 1-5
  note?: string;
};
