'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { KpiCard } from '@/components/shared/KpiCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Eye, Heart, Star, Bookmark, TrendingUp, Tv } from 'lucide-react';

interface ActivityData {
  stats: {
    views: number;
    likes: number;
    ratings: number;
    avgRating: number;
    watchlistCount: number;
    favGenre: string;
    favPlatform: string;
  };
  favGenres: Array<[string, number]>;
  favPlatforms: Array<[string, number]>;
  recent: Array<{
    id: string;
    type: string;
    movieTitle: string;
    movieId: string;
    genres: string[];
    rating: number | null;
    createdAt: string;
  }>;
}

export function MyActivity() {
  const { userId, setSelectedMovieId, refreshKey } = useAppStore();
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/activity?userId=${userId}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [userId, refreshKey]);

  if (loading) return <ActivitySkeleton />;
  if (!data) return <p className="text-destructive">Failed to load activity.</p>;

  const { stats, favGenres, favPlatforms, recent } = data;

  const typeIcon = (type: string) => {
    switch (type) {
      case 'VIEW': return <Eye className="w-3.5 h-3.5 text-cinema-purple" />;
      case 'LIKE': return <Heart className="w-3.5 h-3.5 text-primary" />;
      case 'RATE': return <Star className="w-3.5 h-3.5 text-gold" />;
      default: return null;
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case 'VIEW': return 'border-cinema-purple/30 bg-cinema-purple/5';
      case 'LIKE': return 'border-primary/30 bg-primary/5';
      case 'RATE': return 'border-gold/30 bg-gold/5';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">My Activity</h2>
        <p className="text-muted-foreground text-sm mt-1">Your movie viewing history and personal statistics</p>
      </div>

      {/* Stats KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Movies Viewed" value={stats.views} icon={Eye} color="text-cinema-purple" />
        <KpiCard label="Movies Liked" value={stats.likes} icon={Heart} />
        <KpiCard label="Movies Rated" value={stats.ratings} icon={Star} color="text-gold" />
        <KpiCard label="Watchlist" value={stats.watchlistCount} icon={Bookmark} color="text-success" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <KpiCard label="Avg Rating Given" value={stats.avgRating || '—'} icon={TrendingUp} color="text-gold" />
        <KpiCard label="Favourite Genre" value={stats.favGenre} icon={Tv} color="text-cinema-purple" />
        <KpiCard label="Favourite Platform" value={stats.favPlatform} icon={Tv} color="text-primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Favourite Genres */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-semibold mb-3">Favourite Genres</h3>
          {favGenres.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet</p>
          ) : (
            <div className="space-y-2">
              {favGenres.map(([name, count]) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <span>{name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 rounded-full bg-accent overflow-hidden">
                      <div className="h-full rounded-full bg-cinema-purple" style={{ width: `${(count / favGenres[0][1]) * 100}%` }} />
                    </div>
                    <span className="text-muted-foreground w-5 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Platform Usage */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-semibold mb-3">Platform Usage</h3>
          {favPlatforms.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet</p>
          ) : (
            <div className="space-y-2">
              {favPlatforms.map(([name, count]) => (
                <div key={name} className="flex items-center justify-between text-sm">
                  <span>{name}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 rounded-full bg-accent overflow-hidden">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${(count / favPlatforms[0][1]) * 100}%` }} />
                    </div>
                    <span className="text-muted-foreground w-5 text-right">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="font-semibold mb-3">Recent Activity</h3>
          {recent.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity yet</p>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto">
              {recent.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedMovieId(a.movieId)}
                  className={`w-full text-left rounded-lg border p-2.5 transition-colors hover:bg-accent/50 ${typeColor(a.type)}`}
                >
                  <div className="flex items-center gap-2">
                    {typeIcon(a.type)}
                    <span className="text-sm font-medium flex-1 truncate">{a.movieTitle}</span>
                    {a.rating && <span className="text-xs text-gold font-medium">{a.rating.toFixed(1)}</span>}
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {a.type} · {new Date(a.createdAt).toLocaleDateString()}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActivitySkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-60 rounded-xl" />)}</div>
    </div>
  );
}
