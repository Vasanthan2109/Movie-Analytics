'use client';

import { cn } from '@/lib/utils';
import { useAppStore } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Calendar } from 'lucide-react';

interface MovieCardProps {
  id: string;
  title: string;
  rating: number;
  popularity: number;
  releaseYear: number;
  genres?: Array<{ genre: { name: string } }> | string[];
  runtime?: number;
  weightedScore?: number;
  score?: number;
  reason?: string;
  similarity?: number;
  director?: string;
  platforms?: string[];
  compact?: boolean;
}

export function MovieCard({
  id, title, rating, popularity, releaseYear, genres, runtime,
  weightedScore, score, reason, similarity, director, platforms, compact,
}: MovieCardProps) {
  const { setSelectedMovieId } = useAppStore();

  const genreList = genres
    ? genres.map((g: any) => (typeof g === 'string' ? g : g.genre?.name || '')).filter(Boolean)
    : [];

  return (
    <button
      onClick={() => setSelectedMovieId(id)}
      className={cn(
        'w-full text-left rounded-xl border border-border bg-card p-4 transition-all duration-200 hover:border-primary/40 card-glow group',
        compact ? 'p-3' : 'p-4'
      )}
    >
      {/* Title row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-sm leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>
        {similarity !== undefined && (
          <span className="flex-shrink-0 text-xs font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-full">
            {similarity}%
          </span>
        )}
        {weightedScore !== undefined && (
          <span className="flex-shrink-0 text-xs font-bold text-cinema-purple bg-cinema-purple/10 px-2 py-0.5 rounded-full">
            #{Math.round(weightedScore * 10)}
          </span>
        )}
      </div>

      {/* Rating + Year */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
        <span className="flex items-center gap-1">
          <Star className="w-3 h-3 text-gold fill-gold" />
          <span className="font-medium text-foreground">{rating.toFixed(1)}</span>
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {releaseYear}
        </span>
        {runtime && (
          <span>{runtime} min</span>
        )}
        {popularity > 0 && (
          <span className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-success" />
            {popularity.toFixed(0)}
          </span>
        )}
      </div>

      {/* Genres */}
      {genreList.length > 0 && !compact && (
        <div className="flex flex-wrap gap-1 mb-2">
          {genreList.slice(0, 3).map((g) => (
            <Badge key={g} variant="secondary" className="text-[10px] px-1.5 py-0 h-5">
              {g}
            </Badge>
          ))}
          {genreList.length > 3 && (
            <span className="text-[10px] text-muted-foreground self-center">+{genreList.length - 3}</span>
          )}
        </div>
      )}

      {/* Platforms */}
      {platforms && platforms.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {platforms.map((p) => (
            <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground">
              {p}
            </span>
          ))}
        </div>
      )}

      {/* Director */}
      {director && (
        <p className="text-xs text-muted-foreground mb-1">Dir. {director}</p>
      )}

      {/* Reason / Score */}
      {reason && (
        <p className="text-xs text-cinema-purple mt-1 line-clamp-1">{reason}</p>
      )}
      {score !== undefined && (
        <div className="mt-2">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-1">
            <span>Match Score</span>
            <span className="font-medium text-gold">{score.toFixed(0)}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-accent overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-cinema-purple transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>
      )}
    </button>
  );
}
