"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { FavoriteMovie, TmdbMovieSummary } from "@/types/tmdb";

const STORAGE_KEY = "movie_explorer_favorites_v1";

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);

  // Load once
  useEffect(() => {
    const parsed = safeParse<FavoriteMovie[]>(
      typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null
    );
    if (Array.isArray(parsed)) setFavorites(parsed);
  }, []);

  // Persist on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const favoriteIds = useMemo(() => new Set(favorites.map((f) => f.id)), [favorites]);

  const isFavorite = useCallback((id: number) => favoriteIds.has(id), [favoriteIds]);

  const toggleFavorite = useCallback((movie: TmdbMovieSummary) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === movie.id);
      if (exists) return prev.filter((f) => f.id !== movie.id);
      const next: FavoriteMovie = {
        ...movie,
        addedAt: new Date().toISOString(),
        userRating: 3
      };
      return [next, ...prev];
    });
  }, []);

  const updateFavorite = useCallback((id: number, patch: Partial<Pick<FavoriteMovie, "userRating" | "note">>) => {
    setFavorites((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return { favorites, isFavorite, toggleFavorite, updateFavorite, clearFavorites };
}
