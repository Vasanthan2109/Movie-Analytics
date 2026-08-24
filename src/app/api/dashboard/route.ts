import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') || 'cmt6vc5pl0040t03x6xgkez59';

  const [movieCount, avgRating, genreCount, platformCount, totalVotes, avgRuntime, avgPopularity, streamingCount] =
    await Promise.all([
      db.movie.count(),
      db.movie.aggregate({ _avg: { rating: true } }),
      db.genre.count(),
      db.streamingPlatform.count(),
      db.movie.aggregate({ _sum: { voteCount: true } }),
      db.movie.aggregate({ _avg: { runtime: true } }),
      db.movie.aggregate({ _avg: { popularity: true } }),
      db.movieStreaming.count(),
    ]);

  // Weighted ranking: weighted = (v / (v + m)) * R + (m / (v + m)) * C
  const allMovies = await db.movie.findMany({
    select: { id: true, title: true, rating: true, voteCount: true, popularity: true, releaseYear: true, posterUrl: true },
  });
  const C = avgRating._avg.rating || 7.5;
  const m = 500000;
  const ranked = allMovies
    .map((mv) => ({
      ...mv,
      weightedScore: (mv.voteCount / (mv.voteCount + m)) * mv.rating + (m / (mv.voteCount + m)) * C,
    }))
    .sort((a, b) => b.weightedScore - a.weightedScore);

  const trending = ranked.slice(0, 10).map((m) => ({
    id: m.id,
    title: m.title,
    rating: m.rating,
    popularity: m.popularity,
    releaseYear: m.releaseYear,
    weightedScore: +m.weightedScore.toFixed(4),
  }));

  // Popular genres
  const genreCounts = await db.movieGenre.groupBy({
    by: ['genreId'],
    _count: { movieId: true },
    orderBy: { _count: { movieId: 'desc' } },
    take: 8,
  });
  const genreNames = await Promise.all(
    genreCounts.map((g) => db.genre.findUnique({ where: { id: g.genreId }, select: { name: true } }))
  );
  const popularGenres = genreCounts.map((g, i) => ({
    name: genreNames[i]?.name || 'Unknown',
    count: g._count.movieId,
  }));

  // Platform snapshot
  const platformData = await db.streamingPlatform.findMany({
    include: { _count: { select: { movies: true } } },
    orderBy: { movies: { _count: 'desc' } },
  });
  const platformSnapshot = platformData.map((p) => ({
    id: p.id,
    name: p.name,
    brandColor: p.brandColor,
    movieCount: p._count.movies,
  }));

  // Personalized picks
  const userActivities = await db.userActivity.findMany({
    where: { userId },
    include: { movie: { include: { genres: { include: { genre: true } } } } },
    take: 20,
  });
  const userGenreIds = new Set<string>();
  userActivities.forEach((a) => a.movie.genres.forEach((g) => userGenreIds.add(g.genreId)));

  let personalizedPicks: Array<{ id: string; title: string; rating: number; popularity: number; releaseYear: number; weightedScore: number }> = [];
  if (userGenreIds.size > 0) {
    const candidates = await db.movie.findMany({
      where: {
        genres: { some: { genreId: { in: Array.from(userGenreIds) } } },
        id: { notIn: userActivities.map((a) => a.movieId) },
      },
      include: { genres: { include: { genre: true } } },
      take: 30,
    });
    const scored = candidates.map((mv) => {
      const matchCount = mv.genres.filter((g) => userGenreIds.has(g.genreId)).length;
      return {
        id: mv.id,
        title: mv.title,
        rating: mv.rating,
        popularity: mv.popularity,
        releaseYear: mv.releaseYear,
        weightedScore: +(mv.rating * 0.6 + (matchCount / mv.genres.length) * 4).toFixed(4),
      };
    });
    scored.sort((a, b) => b.weightedScore - a.weightedScore);
    personalizedPicks = scored.slice(0, 6);
  }

  return NextResponse.json({
    kpis: {
      movieCount,
      avgRating: +(avgRating._avg.rating || 0).toFixed(1),
      genreCount,
      platformCount,
      totalVotes: totalVotes._sum.voteCount || 0,
      avgRuntime: Math.round(avgRuntime._avg.runtime || 0),
      avgPopularity: +(avgPopularity._avg.popularity || 0).toFixed(1),
      streamingCount,
    },
    trending,
    popularGenres,
    platformSnapshot,
    personalizedPicks,
  });
}
