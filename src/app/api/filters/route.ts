import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const [genres, platforms, languages] = await Promise.all([
    db.genre.findMany({ orderBy: { name: 'asc' } }),
    db.streamingPlatform.findMany({ orderBy: { name: 'asc' }, select: { name: true } }),
    db.movie.findMany({ select: { language: true }, distinct: ['language'], orderBy: { language: 'asc' } }),
  ]);

  const decades = await db.movie.groupBy({
    by: ['releaseYear'],
    _count: true,
    orderBy: { releaseYear: 'asc' },
  });
  const decadeSet = new Set(decades.map((d) => Math.floor(d.releaseYear / 10) * 10));

  return NextResponse.json({
    genres: genres.map((g) => g.name),
    platforms: platforms.map((p) => p.name),
    languages: languages.map((l) => l.language),
    decades: Array.from(decadeSet).sort(),
  });
}