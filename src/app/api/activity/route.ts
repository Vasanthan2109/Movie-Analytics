import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') || 'cmt6vc5pl0040t03x6xgkez59';

  const activities = await db.userActivity.findMany({
    where: { userId },
    include: {
      movie: {
        include: {
          genres: { include: { genre: true } },
          director: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  // User stats
  const views = activities.filter((a) => a.activityType === 'VIEW').length;
  const likes = activities.filter((a) => a.activityType === 'LIKE').length;
  const ratings = activities.filter((a) => a.activityType === 'RATE');
  const avgRating = ratings.length > 0 ? +(ratings.reduce((s, r) => s + (r.userRating || 0), 0) / ratings.length).toFixed(1) : 0;

  const watchlistCount = await db.watchlist.count({ where: { userId } });

  // Fav genre
  const genreFreq: Record<string, number> = {};
  activities.forEach((a) => a.movie.genres.forEach((g) => { genreFreq[g.genre.name] = (genreFreq[g.genre.name] || 0) + 1; }));
  const favGenres = Object.entries(genreFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Fav platform
  const platFreq: Record<string, number> = {};
  const movieIds = [...new Set(activities.map((a) => a.movieId))];
  const moviePlats = await db.movieStreaming.findMany({
    where: { movieId: { in: movieIds } },
    include: { platform: true },
  });
  moviePlats.forEach((mp) => { platFreq[mp.platform.name] = (platFreq[mp.platform.name] || 0) + 1; });
  const favPlatforms = Object.entries(platFreq).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Recent activity (last 10)
  const recent = activities.slice(0, 10).map((a) => ({
    id: a.id,
    type: a.activityType,
    movieTitle: a.movie.title,
    movieId: a.movie.id,
    genres: a.movie.genres.map((g) => g.genre.name),
    rating: a.userRating,
    createdAt: a.createdAt,
  }));

  return NextResponse.json({
    stats: {
      views,
      likes,
      ratings: ratings.length,
      avgRating,
      watchlistCount,
      favGenre: favGenres[0]?.[0] || 'N/A',
      favPlatform: favPlatforms[0]?.[0] || 'N/A',
    },
    favGenres,
    favPlatforms,
    recent,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, movieId, activityType, userRating } = body;
  if (!userId || !movieId || !activityType) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // Check for existing LIKE or RATE activity (update instead of duplicate)
  if (activityType === 'LIKE' || activityType === 'RATE') {
    const existing = await db.userActivity.findFirst({
      where: { userId, movieId, activityType },
    });
    if (existing) {
      if (activityType === 'RATE') {
        await db.userActivity.update({ where: { id: existing.id }, data: { userRating } });
      }
      return NextResponse.json(existing);
    }
  }

  const activity = await db.userActivity.create({
    data: { userId, movieId, activityType, userRating: userRating || null },
  });
  return NextResponse.json(activity, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const userId = sp.get('userId') || 'cmt6vc5pl0040t03x6xgkez59';
  const movieId = sp.get('movieId');
  const activityType = sp.get('type');

  if (!movieId || !activityType) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  await db.userActivity.deleteMany({ where: { userId, movieId, activityType } });
  return NextResponse.json({ success: true });
}
