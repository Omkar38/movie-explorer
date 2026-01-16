"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import MovieDetailsModal from "@/components/MovieDetailsModal";
import FavoritesList from "@/components/FavoritesList";
import { useFavorites } from "@/lib/useFavorites";
import type { TmdbMovieSummary, TmdbSearchResponse } from "@/types/tmdb";

export default function Home() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TmdbMovieSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { favorites, isFavorite, toggleFavorite, updateFavorite } = useFavorites();

  const hasSearched = useMemo(() => query.trim().length > 0, [query]);

  async function handleSearch(q: string) {
    const trimmed = q.trim();
    setQuery(trimmed);

    if (trimmed.length < 2) {
      setResults([]);
      setError("Please enter at least 2 characters.");
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(trimmed)}`);
      if (!res.ok) {
        const payload = (await res.json().catch(() => null)) as any;
        throw new Error(payload?.error || `Request failed (${res.status})`);
      }
      const data = (await res.json()) as TmdbSearchResponse;
      setResults(data.results || []);
    } catch (e: any) {
      setResults([]);
      setError(e?.message || "Search failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="header">
        <div>
          <h1 className="h1">Movie Explorer</h1>
          {/* <div className="sub">Search → Details → Favorite → Rate/Note (persisted in LocalStorage)</div> */}
        </div>
        {/* <div className="small">Next.js + TypeScript</div> */}
      </div> 

      <div className="grid">
        <div style={{ display: "grid", gap: 16 }}>
          <SearchBar initialQuery={query} onSearch={handleSearch} isLoading={isLoading} />

          <div className="panel">
            <div className="row" style={{ justifyContent: "space-between" }}>
              <strong>Results</strong>
              <span className="badge">{results.length}</span>
            </div>

            {error && (
              <div className="small" style={{ marginTop: 10, color: "#fb7185" }}>
                {error}
              </div>
            )}

            {!error && !isLoading && hasSearched && results.length === 0 && (
              <div className="small" style={{ marginTop: 10 }}>
                No results. Try a different title.
              </div>
            )}

            {!hasSearched && (
              <div className="small" style={{ marginTop: 10 }}>
                Start by searching for a movie title.
              </div>
            )}

            <div className="cards">
              {results.map((m) => (
                <MovieCard
                  key={m.id}
                  movie={m}
                  isFavorite={isFavorite(m.id)}
                  onToggleFavorite={toggleFavorite}
                  onOpenDetails={(id) => setSelectedId(id)}
                />
              ))}
            </div>
          </div>
        </div>

        <FavoritesList
          favorites={favorites}
          onOpenDetails={(id) => setSelectedId(id)}
          onRemove={(fav) => toggleFavorite(fav)}
          onUpdate={updateFavorite}
        />
      </div>

      <MovieDetailsModal
        open={selectedId !== null}
        movieId={selectedId}
        onClose={() => setSelectedId(null)}
        isFavorite={selectedId ? isFavorite(selectedId) : false}
        onToggleFavorite={toggleFavorite}
      />
    </main>
  );
}
