import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing movie id' }, { status: 400 });

  const movie = await db.movie.findUnique({
    where: { id },
    include: { genres: { include: { genre: true } }, director: { select: { id: true, name: true } } },
  });
  if (!movie) return NextResponse.json({ error: 'Movie not found' }, { status: 404 });

  const movieGenreIds = movie.genres.map((g) => g.genreId);
  const directorId = movie.directorId;

  const candidates = await db.movie.findMany({
    where: { id: { not: id } },
    include: { genres: { include: { genre: true } }, director: { select: { id: true, name: true } } },
    take: 50,
  });

  const scored = candidates.map((c) => {
    const sharedGenres = c.genres.filter((g) => movieGenreIds.includes(g.genreId)).length;
    const maxShared = Math.max(movieGenreIds.length, c.genres.length) || 1;
    const genreSim = sharedGenres / maxShared;
    const directorMatch = directorId && c.directorId === directorId ? 0.3 : 0;
    const ratingProx = 1 - Math.abs(movie.rating - c.rating) / 10;
    const similarity = Math.round((genreSim * 0.5 + directorMatch + ratingProx * 0.2) * 100);

    let reason = '';
    if (directorMatch > 0) reason = `Also directed by ${c.director?.name}`;
    else if (sharedGenres > 0) {
      const names = c.genres.filter((g) => movieGenreIds.includes(g.genreId)).map((g) => g.genre.name);
      reason = `Shares ${names.join(', ')} genres`;
    } else reason = 'Similar rating and style';

    return {
      id: c.id,
      title: c.title,
      rating: c.rating,
      popularity: c.popularity,
      releaseYear: c.releaseYear,
      genres: c.genres.map((g) => g.genre.name),
      similarity: Math.min(similarity, 99),
      reason,
    };
  });

  scored.sort((a, b) => b.similarity - a.similarity);
  return NextResponse.json(scored.slice(0, 12));
}
