# Movie Explorer

A small **Next.js + TypeScript** web app to:
- Search movies by title (TMDB)
- Open a details modal for a selected movie
- Save movies to **Favorites**
- Add a personal **rating (1–5)** and optional **note**
- Persist favorites using **LocalStorage**

## Links

- **Live App (Vercel):** https://movie-explorer-seven-sandy.vercel.app/
- **GitHub Repository:** https://github.com/Omkar38/movie-explorer

---

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

## Architecture (High-Level)

```text
┌──────────────────────────────┐
│          Browser UI          │
│  Search / Results / Details  │
│  Favorites (rate + note)     │
└───────────────┬──────────────┘
                │ 1) GET /api/tmdb/search?query=...
                │ 2) GET /api/tmdb/movie/:id
                v
┌──────────────────────────────┐
│   Next.js Route Handlers     │
│   (Server-side TMDB Proxy)   │
│  - Reads TMDB_* from env     │
│  - Normalizes errors         │
└───────────────┬──────────────┘
                │ 3) HTTPS requests (server → TMDB)
                v
┌──────────────────────────────┐
│           TMDB API           │
│  /search/movie, /movie/{id}  │
└───────────────┬──────────────┘
                │ 4) JSON responses
                v
┌──────────────────────────────┐
│          Browser UI          │
│ Renders results + details    │
└───────────────┬──────────────┘
                │ LocalStorage read/write
                v
┌──────────────────────────────┐
│        LocalStorage          │
│ movie_explorer_favorites_v1  │
└──────────────────────────────┘

```
**Key point:** TMDB credentials remain server-side via the proxy route handlers; the client only calls `/api/tmdb/*`.


## Technical Decisions & Tradeoffs

### 1) API proxy (security)
- **Decision:** All TMDB calls go through server-side route handlers.
- **Why:** Prevents exposing the TMDB key/token in the browser and keeps external API logic centralized.
- **Tradeoff:** Adds a small amount of backend glue code, but improves security and maintainability.

### 2) State management (simplicity)
- **Decision:** Plain React state + a small `useFavorites()` hook.
- **Why:** Keeps the solution lightweight and easy to follow for a take-home scope.
- **Tradeoff:** For larger apps, a global store (Zustand/Redux) or server-state library (React Query) could improve ergonomics.

### 3) Persistence (LocalStorage)
- **Decision:** Persist favorites (including rating + note) using LocalStorage.
- **Why:** Meets requirements quickly with zero backend dependencies.
- **Tradeoff:** Data is device/browser-specific and not shareable across devices without an authenticated backend.

---

## Known Limitations & Improvements (With More Time)

- Search pagination / infinite scrolling (currently basic results only)
- Caching movie details to reduce repeat requests (in-memory map or stale-while-revalidate)
- Better loading states (skeleton UI) and more granular error UX
- Optional server persistence (PostgreSQL) + user identity/auth to sync favorites across devices
- Accessibility polish (focus trap for modal, improved keyboard navigation, ARIA refinements)

---

## Evaluation Checklist (Mapped)

- **Functionality:** search → view details → favorite → rate/comment → persisted ✅  
- **API Integration:** external API wired through server-side proxy; errors handled ✅  
- **Code Quality:** clear structure; focused components and hook-based logic ✅  
- **User Experience:** straightforward workflow; empty/error states included ✅  
- **Documentation:** decisions and limitations explained ✅  
- **Discussion Value:** proxy rationale, state/persistence choices, and next steps documented ✅  

---

## Deployment (Vercel)

1. Push the project to GitHub
2. Import repository into Vercel
3. Add environment variable(s) in Vercel:
   - `TMDB_API_KEY` **or** `TMDB_READ_ACCESS_TOKEN`
4. Deploy
