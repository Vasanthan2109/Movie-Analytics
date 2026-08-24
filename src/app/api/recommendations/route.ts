import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') || 'cmt7ech7d0040ngkzxi5iarq2';

  // Gather user signals
  const activities = await db.userActivity.findMany({
    where: { userId },
    include: {
      movie: {
        include: {
          genres: { include: { genre: true } },
          streaming: { include: { platform: true } },
        },
      },
    },
  });

  const watchlist = await db.watchlist.findMany({
    where: { userId },
    include: { movie: { include: { genres: { include: { genre: true } }, streaming: { include: { platform: true } } } } },
  });

  // Build user profile
  const genreFreq: Record<string, number> = {};
  const platformFreq: Record<string, number> = {};
  const viewedIds = new Set<string>();
  const watchlistIds = new Set<string>();

  activities.forEach((a) => {
    viewedIds.add(a.movieId);
    a.movie.genres.forEach((g) => {
      genreFreq[g.genre.name] = (genreFreq[g.genre.name] || 0) + 1;
    });
    a.movie.streaming.forEach((s) => {
      platformFreq[s.platform.name] = (platformFreq[s.platform.name] || 0) + 1;
    });
  });

  watchlist.forEach((w) => {
    watchlistIds.add(w.movieId);
    w.movie.genres.forEach((g) => {
      genreFreq[g.genre.name] = (genreFreq[g.genre.name] || 0) + 0.5;
    });
  });

  const excludeIds = new Set([...viewedIds, ...watchlistIds]);

  // Get all unviewed movies
  const candidates = await db.movie.findMany({
    where: { id: { notIn: Array.from(excludeIds) } },
    include: { genres: { include: { genre: true } }, streaming: { include: { platform: true } }, director: { select: { name: true } } },
  });

  // Score candidates
  const maxGenreFreq = Math.max(...Object.values(genreFreq), 1);
  const maxPop = Math.max(...candidates.map((c) => c.popularity), 1);
  const currentYear = new Date().getFullYear();

  const scored = candidates.map((mv) => {
    // Genre match (30%)
    const genreMatch = mv.genres.reduce((sum, g) => sum + (genreFreq[g.genre.name] || 0), 0);
    const genreScore = (genreMatch / (mv.genres.length * maxGenreFreq)) * 30;

    // Rating quality (25%)
    const ratingScore = (mv.rating / 10) * 25;

    // Platform match (15%)
    const platMatch = mv.streaming.reduce((sum, s) => sum + (platformFreq[s.platform.name] || 0), 0);
    const maxPlatFreq = Math.max(...Object.values(platformFreq), 1);
    const platScore = platMatch > 0 ? 15 : 0;

    // Popularity (15%)
    const popScore = (mv.popularity / maxPop) * 15;

    // Recency (10%)
    const age = currentYear - mv.releaseYear;
    const recencyScore = Math.max(0, 10 - age * 0.15);

    // Activity similarity (5%)
    const activityScore = platMatch > 0 && genreMatch > 0 ? 5 : 0;

    const totalScore = +(genreScore + ratingScore + platScore + popScore + recencyScore + activityScore).toFixed(2);

    // Generate reason
    const topGenres = mv.genres
      .map((g) => ({ name: g.genre.name, freq: genreFreq[g.genre.name] || 0 }))
      .sort((a, b) => b.freq - a.freq)
      .slice(0, 2);

    let reason = '';
    if (topGenres[0]?.freq > 0) {
      reason = `Matches your interest in ${topGenres.map((g) => g.name).join(' & ')}`;
    } else if (mv.rating >= 8) {
      reason = `Highly rated (${mv.rating}/10) — a critically acclaimed choice`;
    } else {
      reason = `Popular pick with ${mv.popularity.toFixed(0)} popularity score`;
    }

    return {
      id: mv.id,
      title: mv.title,
      rating: mv.rating,
      popularity: mv.popularity,
      releaseYear: mv.releaseYear,
      runtime: mv.runtime,
      director: mv.director?.name || 'Unknown',
      genres: mv.genres.map((g) => g.genre.name),
      platforms: mv.streaming.map((s) => s.platform.name),
      score: totalScore,
      reason,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  return NextResponse.json(scored.slice(0, 20));
}
