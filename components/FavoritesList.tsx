"use client";

import Image from "next/image";
import type { FavoriteMovie } from "@/types/tmdb";
import { clampRating, posterUrl, yearFromReleaseDate } from "@/lib/tmdb";

export default function FavoritesList({
  favorites,
  onOpenDetails,
  onRemove,
  onUpdate
}: {
  favorites: FavoriteMovie[];
  onOpenDetails: (id: number) => void;
  onRemove: (fav: FavoriteMovie) => void;
  onUpdate: (id: number, patch: Partial<Pick<FavoriteMovie, "userRating" | "note">>) => void;
}) {
  return (
    <div className="panel">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <strong>Favorites</strong>
        <span className="badge">{favorites.length}</span>
      </div>

      {favorites.length === 0 ? (
        <div className="small" style={{ marginTop: 10 }}>
          No favorites yet. Add one from search results.
        </div>
      ) : (
        <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
          {favorites.map((f) => {
            const poster = posterUrl(f.poster_path, "w92");
            return (
              <div
                key={f.id}
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  padding: 10,
                  background: "rgba(255,255,255,0.02)"
                }}
              >
                <div className="row" style={{ alignItems: "flex-start" }}>
                  <div className="poster" style={{ width: 60, height: 90 }} aria-hidden>
                    {poster ? (
                      <Image
                        src={poster}
                        alt={`${f.title} poster`}
                        width={60}
                        height={90}
                        style={{ width: "60px", height: "90px", objectFit: "cover" }}
                      />
                    ) : (
                      <span className="small">No image</span>
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>{f.title}</div>
                        <div className="small">{yearFromReleaseDate(f.release_date)}</div>
                      </div>
                      <div className="row">
                        <button className="btn" onClick={() => onOpenDetails(f.id)}>
                          View
                        </button>
                        <button className="btn btnDanger" onClick={() => onRemove(f)}>
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="row" style={{ marginTop: 8, justifyContent: "space-between" }}>
                      <label className="small" htmlFor={`rating-${f.id}`}>
                        Rating
                      </label>
                      <select
                        id={`rating-${f.id}`}
                        className="select"
                        value={clampRating(f.userRating ?? 3)}
                        onChange={(e) => onUpdate(f.id, { userRating: clampRating(Number(e.target.value)) })}
                      >
                        {[1, 2, 3, 4, 5].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <label className="small" htmlFor={`note-${f.id}`}>
                        Note (optional)
                      </label>
                      <textarea
                        id={`note-${f.id}`}
                        className="textarea"
                        value={f.note ?? ""}
                        onChange={(e) => onUpdate(f.id, { note: e.target.value })}
                        placeholder="Why did you like it?"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
