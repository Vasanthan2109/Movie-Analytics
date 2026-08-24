import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const platforms = await db.streamingPlatform.findMany({
    include: {
      movies: {
        include: {
          movie: {
            include: {
              genres: { include: { genre: true } },
            },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const result = platforms.map((p) => {
    const movies = p.movies.map((ms) => ms.movie);
    const movieCount = movies.length;
    const avgRating = movieCount > 0
      ? +(movies.reduce((s, m) => s + m.rating, 0) / movieCount).toFixed(1)
      : 0;
    const avgPopularity = movieCount > 0
      ? +(movies.reduce((s, m) => s + m.popularity, 0) / movieCount).toFixed(1)
      : 0;

    // Genre breakdown
    const genreFreq: Record<string, number> = {};
    movies.forEach((m) => m.genres.forEach((g) => { genreFreq[g.genre.name] = (genreFreq[g.genre.name] || 0) + 1; }));
    const topGenres = Object.entries(genreFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);

    // Top rated movies on platform
    const topMovies = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 5).map((m) => ({
      id: m.id,
      title: m.title,
      rating: m.rating,
      popularity: m.popularity,
      releaseYear: m.releaseYear,
    }));

    return {
      id: p.id,
      name: p.name,
      description: p.description,
      brandColor: p.brandColor,
      movieCount,
      avgRating,
      avgPopularity,
      topGenres,
      topMovies,
    };
  });

  return NextResponse.json(result);
}
