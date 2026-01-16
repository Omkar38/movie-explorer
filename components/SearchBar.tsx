"use client";

import { useEffect, useState } from "react";

export default function SearchBar({
  initialQuery,
  onSearch,
  isLoading
}: {
  initialQuery?: string;
  onSearch: (query: string) => void;
  isLoading?: boolean;
}) {
  const [q, setQ] = useState(initialQuery ?? "");

  useEffect(() => {
    setQ(initialQuery ?? "");
  }, [initialQuery]);

  return (
    <div className="panel">
      <div className="row">
        <input
          className="input"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search movies by title…"
          onKeyDown={(e) => {
            if (e.key === "Enter") onSearch(q.trim());
          }}
          aria-label="Search movies by title"
        />
        <button
          className="btn"
          onClick={() => onSearch(q.trim())}
          disabled={isLoading}
        >
          {isLoading ? "Searching…" : "Search"}
        </button>
      </div>
      {/* <div className="small" style={{ marginTop: 8 }}>
        Uses TMDB through a server-side proxy (your API key stays on the server).
      </div> */}
    </div>
  );
}
