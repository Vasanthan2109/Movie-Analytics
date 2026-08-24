'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { KpiCard } from '@/components/shared/KpiCard';
import { MovieCard } from '@/components/shared/MovieCard';
import { Film, Star, Tv, Tag, Vote, Clock, TrendingUp, Wifi } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardData {
  kpis: {
    movieCount: number;
    avgRating: number;
    genreCount: number;
    platformCount: number;
    totalVotes: number;
    avgRuntime: number;
    avgPopularity: number;
    streamingCount: number;
  };
  trending: Array<{ id: string; title: string; rating: number; popularity: number; releaseYear: number; weightedScore: number }>;
  popularGenres: Array<{ name: string; count: number }>;
  platformSnapshot: Array<{ id: string; name: string; brandColor: string; movieCount: number }>;
  personalizedPicks: Array<{ id: string; title: string; rating: number; popularity: number; releaseYear: number; weightedScore: number }>;
}

export function Dashboard() {
  const { userId } = useAppStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/dashboard?userId=${userId}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <DashboardSkeleton />;
  if (!data) return <p className="text-destructive">Failed to load dashboard.</p>;

  const { kpis, trending, popularGenres, platformSnapshot, personalizedPicks } = data;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">Your movie ecosystem at a glance</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Total Movies" value={kpis.movieCount} icon={Film} />
        <KpiCard label="Avg Rating" value={kpis.avgRating} icon={Star} color="text-gold" />
        <KpiCard label="Platforms" value={kpis.platformCount} icon={Tv} color="text-cinema-purple" />
        <KpiCard label="Genres" value={kpis.genreCount} icon={Tag} />
        <KpiCard label="Total Votes" value={`${(kpis.totalVotes / 1000000).toFixed(1)}M`} icon={Vote} color="text-success" />
        <KpiCard label="Avg Runtime" value={`${kpis.avgRuntime}m`} icon={Clock} />
        <KpiCard label="Avg Popularity" value={kpis.avgPopularity} icon={TrendingUp} color="text-gold" />
        <KpiCard label="Availability Records" value={kpis.streamingCount} icon={Wifi} color="text-cinema-purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trending */}
        <div className="lg:col-span-2">
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Trending by Weighted Rank
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto pr-1">
            {trending.map((m, i) => (
              <div key={m.id} className="relative">
                {i < 3 && (
                  <span className="absolute -top-1.5 -left-1.5 z-10 w-6 h-6 rounded-full bg-gradient-to-br from-gold to-yellow-600 text-[10px] font-bold text-black flex items-center justify-center">
                    {i + 1}
                  </span>
                )}
                <MovieCard {...m} />
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar cards */}
        <div className="space-y-6">
          {/* Popular Genres */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Popular Genres</h3>
            <div className="space-y-2">
              {popularGenres.map((g) => (
                <div key={g.name} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{g.name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 rounded-full bg-accent overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-primary to-cinema-purple"
                        style={{ width: `${(g.count / popularGenres[0].count) * 100}%` }}
                      />
                    </div>
                    <span className="text-muted-foreground w-6 text-right">{g.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Snapshot */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Streaming Platforms</h3>
            <div className="space-y-2">
              {platformSnapshot.map((p) => (
                <div key={p.id} className="flex items-center justify-between text-sm rounded-lg border border-border p-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: p.brandColor }} />
                    <span className="text-foreground">{p.name}</span>
                  </div>
                  <span className="text-muted-foreground font-medium">{p.movieCount}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Personalized Picks */}
      {personalizedPicks.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-gold" />
            Personalized Picks For You
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {personalizedPicks.map((m) => (
              <MovieCard key={m.id} {...m} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
