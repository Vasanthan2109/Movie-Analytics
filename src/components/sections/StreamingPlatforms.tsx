'use client';

import { useEffect, useState } from 'react';
import { MovieCard } from '@/components/shared/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tv, Star, TrendingUp } from 'lucide-react';

interface PlatformData {
  id: string;
  name: string;
  description: string;
  brandColor: string;
  movieCount: number;
  avgRating: number;
  avgPopularity: number;
  topGenres: Array<[string, number]>;
  topMovies: Array<{ id: string; title: string; rating: number; popularity: number; releaseYear: number }>;
}

export function StreamingPlatforms() {
  const [platforms, setPlatforms] = useState<PlatformData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/platforms').then((r) => r.json()).then(setPlatforms).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-80 rounded-xl" />)}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Streaming Platforms</h2>
        <p className="text-muted-foreground text-sm mt-1">Compare streaming services, their catalogs, and content quality</p>
      </div>

      {/* Platform summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {platforms.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card p-3 text-center card-glow transition-all">
            <div className="w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center" style={{ backgroundColor: p.brandColor + '20' }}>
              <Tv className="w-5 h-5" style={{ color: p.brandColor }} />
            </div>
            <p className="font-semibold text-sm truncate">{p.name}</p>
            <p className="text-lg font-bold text-foreground mt-1">{p.movieCount}</p>
            <p className="text-xs text-muted-foreground">titles</p>
          </div>
        ))}
      </div>

      {/* Detailed platform cards */}
      <div className="space-y-6">
        {platforms.map((p) => (
          <div key={p.id} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="p-5 border-b border-border" style={{ borderLeft: `4px solid ${p.brandColor}` }}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.brandColor }} />
                    {p.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 max-w-lg">{p.description}</p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Titles</p>
                    <p className="text-xl font-bold">{p.movieCount}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Star className="w-3 h-3 text-gold" />Avg Rating</p>
                    <p className="text-xl font-bold text-gold">{p.avgRating}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><TrendingUp className="w-3 h-3 text-success" />Avg Pop.</p>
                    <p className="text-xl font-bold text-success">{p.avgPopularity}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Top Genres */}
              <div>
                <p className="text-sm font-medium mb-2">Top Genres</p>
                <div className="space-y-1.5">
                  {p.topGenres.map(([name, count]) => (
                    <div key={name} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{name}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Movies */}
              <div className="md:col-span-2">
                <p className="text-sm font-medium mb-2">Top Rated</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {p.topMovies.map((m) => (
                    <MovieCard key={m.id} {...m} compact />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
