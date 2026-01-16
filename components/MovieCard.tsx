"use client";

import Image from "next/image";
import type { TmdbMovieSummary } from "@/types/tmdb";
import { posterUrl, yearFromReleaseDate } from "@/lib/tmdb";

export default function MovieCard({
  movie,
  isFavorite,
  onToggleFavorite,
  onOpenDetails
}: {
  movie: TmdbMovieSummary;
  isFavorite: boolean;
  onToggleFavorite: (movie: TmdbMovieSummary) => void;
  onOpenDetails: (id: number) => void;
}) {
  const poster = posterUrl(movie.poster_path, "w185");
  const year = yearFromReleaseDate(movie.release_date);

  return (
    <div className="card">
      <div className="poster" aria-hidden>
        {poster ? (
          <Image
            src={poster}
            alt={`${movie.title} poster`}
            width={80}
            height={120}
            style={{ width: "80px", height: "120px", objectFit: "cover" }}
          />
        ) : (
          <span className="small">No image</span>
        )}
      </div>

      <div>
        <h3 className="cardTitle">{movie.title}</h3>
        <div className="cardMeta">
          <span className="badge">{year}</span>
          {isFavorite && <span className="badge">Favorite</span>}
        </div>
        <p className="cardDesc">
          {(movie.overview || "No description available.").slice(0, 170)}
          {(movie.overview || "").length > 170 ? "…" : ""}
        </p>

        <div className="row" style={{ marginTop: 10, justifyContent: "flex-end" }}>
          <button className="btn" onClick={() => onOpenDetails(movie.id)}>
            Details
          </button>
          <button
            className={`btn ${isFavorite ? "btnDanger" : ""}`}
            onClick={() => onToggleFavorite(movie)}
          >
            {isFavorite ? "Remove" : "Favorite"}
          </button>
        </div>
      </div>
    </div>
  );
}
