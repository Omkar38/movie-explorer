import { NextResponse } from "next/server";
import { tmdbGet } from "@/lib/tmdbServer";


export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const movieId = Number(id);

  if (!Number.isFinite(movieId) || movieId <= 0) {
    return NextResponse.json({ error: "Invalid movie id" }, { status: 400 });
  }
  try {
    const { res, json } = await tmdbGet(`/movie/${id}`, {
      language: "en-US"
    });

    if (!res.ok) {
      return NextResponse.json({ error: json?.status_message || "TMDB request failed" }, { status: res.status });
    }

    return NextResponse.json(json, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}


