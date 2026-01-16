export const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export function posterUrl(posterPath?: string | null, size: "w92" | "w154" | "w185" | "w342" | "w500" | "original" = "w342") {
  if (!posterPath) return null;
  return `${TMDB_IMAGE_BASE}/${size}${posterPath}`;
}

export function yearFromReleaseDate(releaseDate?: string) {
  if (!releaseDate) return "—";
  const year = releaseDate.split("-")[0];
  return year || "—";
}

export function clampRating(value: number) {
  if (Number.isNaN(value)) return 1;
  return Math.min(5, Math.max(1, Math.round(value)));
}
