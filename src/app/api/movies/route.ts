import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { Prisma } from '@prisma/client';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const search = sp.get('search') || '';
  const genre = sp.get('genre') || '';
  const decade = sp.get('decade') || '';
  const minRating = parseFloat(sp.get('minRating') || '0');
  const platform = sp.get('platform') || '';
  const language = sp.get('language') || '';
  const sort = sp.get('sort') || 'weighted';
  const page = parseInt(sp.get('page') || '1');
  const limit = parseInt(sp.get('limit') || '24');

  const where: Prisma.MovieWhereInput = {};

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { director: { name: { contains: search } } },
    ];
  }
  if (genre) {
    where.genres = { some: { genre: { name: genre } } };
  }
  if (decade) {
    const decStart = parseInt(decade);
    where.releaseYear = { gte: decStart, lt: decStart + 10 };
  }
  if (minRating > 0) {
    where.rating = { gte: minRating };
  }
  if (platform) {
    where.streaming = { some: { platform: { name: platform } } };
  }
  if (language) {
    where.language = language;
  }

  // Get avg for weighted calc
  const avgResult = await db.movie.aggregate({ _avg: { rating: true } });
  const C = avgResult._avg.rating || 7.5;
  const m = 500000;

  const [movies, total] = await Promise.all([
    db.movie.findMany({
      where,
      include: {
        genres: { include: { genre: true } },
        director: { select: { id: true, name: true } },
        streaming: { include: { platform: { select: { id: true, name: true, brandColor: true } } } },
      },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.movie.count({ where }),
  ]);

  // Compute weighted scores
  const withScores = movies.map((mv) => ({
    ...mv,
    weightedScore: +((mv.voteCount / (mv.voteCount + m)) * mv.rating + (m / (mv.voteCount + m)) * C).toFixed(4),
  }));

  // Sort
  switch (sort) {
    case 'weighted':
      withScores.sort((a, b) => b.weightedScore - a.weightedScore);
      break;
    case 'rating':
      withScores.sort((a, b) => b.rating - a.rating);
      break;
    case 'popularity':
      withScores.sort((a, b) => b.popularity - a.popularity);
      break;
    case 'newest':
      withScores.sort((a, b) => b.releaseYear - a.releaseYear);
      break;
    case 'oldest':
      withScores.sort((a, b) => a.releaseYear - b.releaseYear);
      break;
    case 'title':
      withScores.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case 'runtime':
      withScores.sort((a, b) => b.runtime - a.runtime);
      break;
  }

  return NextResponse.json({
    movies: withScores,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}
