import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('userId') || 'cmt6vc5pl0040t03x6xgkez59';
  const status = req.nextUrl.searchParams.get('status');

  const where: Record<string, unknown> = { userId };
  if (status && status !== 'ALL') where.status = status;

  const items = await db.watchlist.findMany({
    where,
    include: {
      movie: {
        include: {
          genres: { include: { genre: true } },
          director: { select: { name: true } },
          streaming: { include: { platform: { select: { name: true, brandColor: true } } } },
        },
      },
    },
    orderBy: { addedAt: 'desc' },
  });

  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { userId, movieId, status } = body;
  if (!userId || !movieId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const item = await db.watchlist.create({
    data: { userId, movieId, status: status || 'PLAN_TO_WATCH' },
  });
  return NextResponse.json(item, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;
  if (!id || !status) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const item = await db.watchlist.update({
    where: { id },
    data: { status, updatedAt: new Date() },
  });
  return NextResponse.json(item);
}

export async function DELETE(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const id = sp.get('id');
  const userId = sp.get('userId');
  const movieId = sp.get('movieId');

  if (id) {
    await db.watchlist.delete({ where: { id } });
  } else if (userId && movieId) {
    await db.watchlist.delete({ where: { userId_movieId: { userId, movieId } } });
  } else {
    return NextResponse.json({ error: 'Missing id or userId+movieId' }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}
