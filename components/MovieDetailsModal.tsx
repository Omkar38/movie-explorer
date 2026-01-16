"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { TmdbMovieDetails, TmdbMovieSummary } from "@/types/tmdb";
import { posterUrl, yearFromReleaseDate } from "@/lib/tmdb";

type Props = {
  open: boolean;
  movieId: number | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (movie: TmdbMovieSummary) => void;
};

export default function MovieDetailsModal({
  open,
  movieId,
  onClose,
  isFavorite,
  onToggleFavorite
}: Props) {
  const [details, setDetails] = useState<TmdbMovieDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !movieId) return;
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError(null);
      setDetails(null);
      try {
        const res = await fetch(`/api/tmdb/movie/${movieId}`);
        if (!res.ok) {
          const payload = (await res.json().catch(() => null)) as any;
          throw new Error(payload?.error || `Request failed (${res.status})`);
        }
        const data = (await res.json()) as TmdbMovieDetails;
        if (!cancelled) setDetails(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load movie details");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, movieId]);

  if (!open) return null;

  return (
    <div className="modalOverlay" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div
        className="modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modalHeader">
          <strong>{details?.title || (isLoading ? "Loading…" : "Details")}</strong>
          <button className="close" onClick={onClose} aria-label="Close">
            Close
          </button>
        </div>

        <div className="modalBody">
          <div className="poster" style={{ width: 220, height: 330 }} aria-hidden>
            {details?.poster_path ? (
              <Image
                src={posterUrl(details.poster_path, "w342")!}
                alt={`${details.title} poster`}
                width={220}
                height={330}
                style={{ width: "220px", height: "330px", objectFit: "cover" }}
              />
            ) : (
              <span className="small">No image</span>
            )}
          </div>

          <div>
            {isLoading && <div className="small">Loading details…</div>}
            {error && <div className="small" style={{ color: "#fb7185" }}>{error}</div>}

            {details && (
              <>
                <div className="row" style={{ flexWrap: "wrap", marginBottom: 8 }}>
                  <span className="badge">{yearFromReleaseDate(details.release_date)}</span>
                  {typeof details.runtime === "number" && details.runtime > 0 && (
                    <span className="badge">{details.runtime} min</span>
                  )}
                  {details.genres?.slice(0, 3).map((g) => (
                    <span className="badge" key={g.id}>{g.name}</span>
                  ))}
                </div>

                {details.tagline && <div className="small" style={{ marginBottom: 10 }}><em>{details.tagline}</em></div>}

                <p className="cardDesc" style={{ marginTop: 0 }}>
                  {details.overview || "No overview available."}
                </p>

                <div className="row" style={{ justifyContent: "flex-end" }}>
                  <button
                    className={`btn ${isFavorite ? "btnDanger" : ""}`}
                    onClick={() => onToggleFavorite(details)}
                  >
                    {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                  </button>
                </div>
              </>
            )}

            {!isLoading && !error && !details && (
              <div className="small">Select a movie to view details.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
