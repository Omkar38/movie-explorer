import "server-only";

const TMDB_API_BASE = process.env.TMDB_API_BASE ?? "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_READ_ACCESS_TOKEN = process.env.TMDB_READ_ACCESS_TOKEN;

export function requireTmdbCredentials() {
  if (!TMDB_API_KEY && !TMDB_READ_ACCESS_TOKEN) {
    throw new Error(
      "Missing TMDB credentials. Set TMDB_API_KEY (v3) or TMDB_READ_ACCESS_TOKEN (v4) in .env.local"
    );
  }
}

export async function tmdbGet(path: string, params: Record<string, string | number | undefined> = {}) {
  requireTmdbCredentials();

  const url = new URL(`${TMDB_API_BASE}${path}`);
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined) continue;
    url.searchParams.set(k, String(v));
  }

  // Prefer bearer token if provided; otherwise use v3 api_key query param
  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };
  if (TMDB_READ_ACCESS_TOKEN) {
    headers.Authorization = `Bearer ${TMDB_READ_ACCESS_TOKEN}`;
  } else if (TMDB_API_KEY) {
    url.searchParams.set("api_key", TMDB_API_KEY);
  }

  const res = await fetch(url.toString(), {
    method: "GET",
    headers,
    // Search results should feel fresh; avoid caching while developing.
    cache: "no-store"
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  return { res, json };
}
