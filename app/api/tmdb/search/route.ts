import { NextResponse } from "next/server";
import { tmdbGet } from "@/lib/tmdbServer";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = (searchParams.get("query") || "").trim();

  if (query.length < 2) {
    return NextResponse.json({ error: "Query must be at least 2 characters." }, { status: 400 });
  }

  try {
    const { res, json } = await tmdbGet("/search/movie", {
      query,
      include_adult: false,
      language: "en-US",
      page: 1
    });

    if (!res.ok) {
      return NextResponse.json({ error: json?.status_message || "TMDB request failed" }, { status: res.status });
    }

    return NextResponse.json(json, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
