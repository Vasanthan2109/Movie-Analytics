import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const yearStart = parseInt(sp.get('yearStart') || '1970');
  const yearEnd = parseInt(sp.get('yearEnd') || '2025');
  const genre = sp.get('genre') || '';
  const platform = sp.get('platform') || '';

  const where: Record<string, unknown> = {
    releaseYear: { gte: yearStart, lte: yearEnd },
  };
  if (genre) {
    (where as any).genres = { some: { genre: { name: genre } } };
  }
  if (platform) {
    (where as any).streaming = { some: { platform: { name: platform } } };
  }

  const movies = await db.movie.findMany({
    where,
    include: { genres: { include: { genre: true } } },
  });

  // Movies by year
  const byYear: Record<number, number> = {};
  movies.forEach((m) => { byYear[m.releaseYear] = (byYear[m.releaseYear] || 0) + 1; });
  const yearData = Object.entries(byYear)
    .map(([year, count]) => ({ year: parseInt(year), count }))
    .sort((a, b) => a.year - b.year);

  // Avg rating by year
  const ratingByYear: Record<number, number[]> = {};
  movies.forEach((m) => {
    if (!ratingByYear[m.releaseYear]) ratingByYear[m.releaseYear] = [];
    ratingByYear[m.releaseYear].push(m.rating);
  });
  const ratingYearData = Object.entries(ratingByYear)
    .map(([year, ratings]) => ({
      year: parseInt(year),
      avgRating: +(ratings.reduce((s, r) => s + r, 0) / ratings.length).toFixed(1),
    }))
    .sort((a, b) => a.year - b.year);

  // Genre performance
  const genreMap: Record<string, { count: number; totalRating: number; totalPop: number }> = {};
  movies.forEach((m) => {
    m.genres.forEach((g) => {
      if (!genreMap[g.genre.name]) genreMap[g.genre.name] = { count: 0, totalRating: 0, totalPop: 0 };
      genreMap[g.genre.name].count++;
      genreMap[g.genre.name].totalRating += m.rating;
      genreMap[g.genre.name].totalPop += m.popularity;
    });
  });
  const genreData = Object.entries(genreMap)
    .map(([name, d]) => ({
      name,
      count: d.count,
      avgRating: +(d.totalRating / d.count).toFixed(1),
      avgPopularity: +(d.totalPop / d.count).toFixed(1),
    }))
    .sort((a, b) => b.count - a.count);

  // Runtime distribution
  const runtimeBuckets = [
    { label: '< 90 min', min: 0, max: 90 },
    { label: '90-120 min', min: 90, max: 120 },
    { label: '120-150 min', min: 120, max: 150 },
    { label: '150-180 min', min: 150, max: 180 },
    { label: '> 180 min', min: 180, max: 999 },
  ];
  const runtimeData = runtimeBuckets.map((b) => ({
    range: b.label,
    count: movies.filter((m) => m.runtime >= b.min && m.runtime < b.max).length,
  }));

  // Rating distribution
  const ratingBuckets = [
    { label: '7.0-7.4', min: 7.0, max: 7.5 },
    { label: '7.5-7.9', min: 7.5, max: 8.0 },
    { label: '8.0-8.4', min: 8.0, max: 8.5 },
    { label: '8.5-8.9', min: 8.5, max: 9.0 },
    { label: '9.0+', min: 9.0, max: 10.0 },
  ];
  const ratingDist = ratingBuckets.map((b) => ({
    range: b.label,
    count: movies.filter((m) => m.rating >= b.min && m.rating < b.max).length,
  }));

  // Popularity analysis
  const popBuckets = [
    { label: 'Low (<70)', min: 0, max: 70 },
    { label: 'Medium (70-80)', min: 70, max: 80 },
    { label: 'High (80-90)', min: 80, max: 90 },
    { label: 'Very High (90+)', min: 90, max: 100 },
  ];
  const popData = popBuckets.map((b) => ({
    range: b.label,
    count: movies.filter((m) => m.popularity >= b.min && m.popularity < b.max).length,
  }));

  // Vote analysis
  const voteBuckets = [
    { label: '< 500K', min: 0, max: 500000 },
    { label: '500K-1M', min: 500000, max: 1000000 },
    { label: '1M-2M', min: 1000000, max: 2000000 },
    { label: '> 2M', min: 2000000, max: Infinity },
  ];
  const voteData = voteBuckets.map((b) => ({
    range: b.label,
    count: movies.filter((m) => m.voteCount >= b.min && m.voteCount < b.max).length,
  }));

  return NextResponse.json({
    yearData,
    ratingYearData,
    genreData,
    runtimeData,
    ratingDist,
    popData,
    voteData,
    totalFiltered: movies.length,
  });
}
