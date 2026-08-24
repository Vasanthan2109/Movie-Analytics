import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing movie id' }, { status: 400 });

  const movie = await db.movie.findUnique({
    where: { id },
    include: {
      genres: { include: { genre: true } },
      cast: { include: { person: { select: { id: true, name: true } } } },
      director: { select: { id: true, name: true } },
      streaming: { include: { platform: true } },
    },
  });

  if (!movie) return NextResponse.json({ error: 'Movie not found' }, { status: 404 });

  // Weighted score
  const avgResult = await db.movie.aggregate({ _avg: { rating: true } });
  const C = avgResult._avg.rating || 7.5;
  const m = 500000;
  const weightedScore = +((movie.voteCount / (movie.voteCount + m)) * movie.rating + (m / (movie.voteCount + m)) * C).toFixed(4);

  // Check if user has this in watchlist or activity
  const userId = req.nextUrl.searchParams.get('userId') || 'cmt7ech7d0040ngkzxi5iarq2';
  const [watchlistEntry, activities] = await Promise.all([
    db.watchlist.findUnique({ where: { userId_movieId: { userId, movieId: id } } }),
    db.userActivity.findMany({ where: { userId, movieId: id } }),
  ]);

  const userLiked = activities.some((a) => a.activityType === 'LIKE');
  const userRating = activities.find((a) => a.activityType === 'RATE')?.userRating || null;

  return NextResponse.json({
    ...movie,
    weightedScore,
    inWatchlist: !!watchlistEntry,
    watchlistStatus: watchlistEntry?.status || null,
    userLiked,
    userRating,
  });
}
