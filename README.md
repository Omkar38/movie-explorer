# Movie Explorer (Take-Home)

A small Next.js + TypeScript web app to:
- Search movies by title
- Open a details view (modal)
- Save favorites with a personal **rating (1–5)** and optional **note**
- Persist favorites in **LocalStorage**

## Live Demo

- Hosted URL: _add your deployed link here_

## Setup

### 1) Get a TMDB API credential

You can use either:
- **TMDB_API_KEY** (v3 API key), or
- **TMDB_READ_ACCESS_TOKEN** (v4 read access token)

Create a file named `.env.local` in the project root:

```bash
TMDB_API_KEY=your_tmdb_key_here
# optional
# TMDB_API_BASE=https://api.themoviedb.org/3
```

### 2) Install & run

```bash
npm install
npm run dev
```

Open http://localhost:3000

## How it works

- **Frontend**: Next.js App Router + client components for search/results/favorites.
- **Backend**: Next.js Route Handlers proxy TMDB calls so the API key is not exposed in the browser.
  - `GET /api/tmdb/search?query=...`
  - `GET /api/tmdb/movie/:id`
- **Persistence**: Favorites are stored in LocalStorage under `movie_explorer_favorites_v1`.

## Technical Decisions & Tradeoffs

- **API key safety**: All TMDB calls happen through server-side routes (proxy pattern). This keeps credentials off the client.
- **State management**: Plain React state + a small `useFavorites()` hook. This keeps the prototype lightweight.
- **Persistence**: LocalStorage meets the baseline requirement quickly; server-side DB persistence is a clear next step.
- **UI**: Minimal CSS (no component library) to prioritize functionality and readability.

## Known Limitations / Next Improvements

- No pagination or infinite scroll for search results.
- No caching for details (easy to add a simple in-memory map keyed by movieId).
- Basic error states only (could add retries, skeleton loaders).
- Optional server-side persistence not implemented (could add a Postgres table keyed by user/device id).

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import into Vercel.
3. Set environment variables in Vercel:
   - `TMDB_API_KEY` (or `TMDB_READ_ACCESS_TOKEN`)
4. Deploy.

---

This project is intentionally scoped to a short take-home window.
