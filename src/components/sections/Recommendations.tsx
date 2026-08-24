'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MovieCard } from '@/components/shared/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, Info } from 'lucide-react';

interface RecMovie {
  id: string;
  title: string;
  rating: number;
  popularity: number;
  releaseYear: number;
  runtime: number;
  director: string;
  genres: string[];
  platforms: string[];
  score: number;
  reason: string;
}

export function Recommendations() {
  const { userId } = useAppStore();
  const [movies, setMovies] = useState<RecMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/recommendations?userId=${userId}`)
      .then((r) => r.json())
      .then(setMovies)
      .finally(() => setLoading(false));
  }, [userId]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-gold" />
          Recommendations For You
        </h2>
        <p className="text-muted-foreground text-sm mt-1">Personalized picks based on your viewing history and preferences</p>
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3">
        <Info className="w-5 h-5 text-cinema-purple mt-0.5 flex-shrink-0" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">How Recommendations Work</p>
          <p>Our engine scores movies using: <span className="text-foreground">Genre match (30%)</span>, <span className="text-foreground">Rating quality (25%)</span>, <span className="text-foreground">Platform match (15%)</span>, <span className="text-foreground">Popularity (15%)</span>, <span className="text-foreground">Recency (10%)</span>, and <span className="text-foreground">Activity similarity (5%)</span>. Movies already on your watchlist or previously viewed are excluded.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-16">
          <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Start exploring and rating movies to get personalized recommendations!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {movies.map((m) => (
            <MovieCard
              key={m.id}
              id={m.id}
              title={m.title}
              rating={m.rating}
              popularity={m.popularity}
              releaseYear={m.releaseYear}
              runtime={m.runtime}
              director={m.director}
              genres={m.genres}
              platforms={m.platforms}
              score={m.score}
              reason={m.reason}
            />
          ))}
        </div>
      )}
    </div>
  );
}
