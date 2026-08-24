'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieCard } from '@/components/shared/MovieCard';
import {
  Star, TrendingUp, Calendar, Clock, Globe, Award, Bookmark, Heart,
  Film, User, X, ArrowRight,
} from 'lucide-react';
import { toast } from 'sonner';

interface MovieDetail {
  id: string;
  title: string;
  description: string;
  releaseYear: number;
  runtime: number;
  language: string;
  country: string;
  ageCertification: string | null;
  rating: number;
  popularity: number;
  voteCount: number;
  weightedScore: number;
  director: { id: string; name: string } | null;
  genres: Array<{ genreId: string; genre: { id: string; name: string } }>;
  cast: Array<{ personId: string, person: { id: string, name: string }, character: string }>;
  streaming: Array<{ platformId: string, platform: { id: string, name: string, brandColor: string, description: string } }>;
  inWatchlist: boolean;
  watchlistStatus: string | null;
  userLiked: boolean;
  userRating: number | null;
}

export function MovieDetailDialog({ movieId, open, onClose }: { movieId: string | null; open: boolean; onClose: () => void }) {
  const { userId, triggerRefresh } = useAppStore();
  const [movie, setMovie] = useState<MovieDetail | null>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [ratingValue, setRatingValue] = useState(0);
  const [userLike, setUserLike] = useState(false);

  useEffect(() => {
    if (!movieId || !open) return;
    let cancelled = false;
    (async () => {
      const [detail, sim] = await Promise.all([
        fetch(`/api/movies/details?id=${movieId}&userId=${userId}`).then((r) => r.json()),
        fetch(`/api/movies/similar?id=${movieId}`).then((r) => r.json()),
      ]);
      if (cancelled) return;
      setMovie(detail);
      setSimilar(sim);
      setUserLike(detail.userLiked || false);
      setRatingValue(detail.userRating || 0);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [movieId, open, userId]);

  const handleWatchlist = async () => {
    if (!movie) return;
    if (movie.inWatchlist) {
      await fetch(`/api/watchlist?userId=${userId}&movieId=${movie.id}`, { method: 'DELETE' });
      toast.success('Removed from watchlist');
    } else {
      await fetch('/api/watchlist', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, movieId: movie.id }) });
      toast.success('Added to watchlist');
    }
    // Record view
    fetch('/api/activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, movieId: movie.id, activityType: 'VIEW' }) });
    triggerRefresh();
  };

  const handleLike = async () => {
    if (!movie) return;
    const newVal = !userLike;
    if (newVal) {
      await fetch('/api/activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, movieId: movie.id, activityType: 'LIKE' }) });
      toast.success('Liked!');
    } else {
      await fetch(`/api/activity?userId=${userId}&movieId=${movie.id}&type=LIKE`, { method: 'DELETE' });
      toast.success('Unliked');
    }
    setUserLike(newVal);
    triggerRefresh();
  };

  const handleRate = async (val: number) => {
    if (!movie) return;
    setRatingValue(val);
    await fetch('/api/activity', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ userId, movieId: movie.id, activityType: 'RATE', userRating: val }) });
    toast.success(`Rated ${val}/10`);
    triggerRefresh();
  };

  if (!open || !movieId) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
        {loading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : movie ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl md:text-2xl gradient-text pr-8">{movie.title}</DialogTitle>
            </DialogHeader>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-gold fill-gold" /><span className="font-semibold text-gold">{movie.rating.toFixed(1)}</span>/10</span>
              <span className="flex items-center gap-1"><TrendingUp className="w-4 h-4" />{movie.popularity.toFixed(0)} pop.</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />{movie.releaseYear}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{movie.runtime}m</span>
              <span className="flex items-center gap-1"><Globe className="w-4 h-4" />{movie.language}</span>
              <span>{movie.country}</span>
              {movie.ageCertification && (
                <Badge variant="outline" className="border-gold/50 text-gold"><Award className="w-3 h-3 mr-1" />{movie.ageCertification}</Badge>
              )}
              <Badge variant="secondary" className="text-cinema-purple border-cinema-purple/30">Weighted: {movie.weightedScore}</Badge>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={userLike ? 'default' : 'outline'}
                size="sm"
                onClick={handleLike}
                className={userLike ? 'bg-primary' : ''}
              >
                <Heart className={`w-4 h-4 mr-1.5 ${userLike ? 'fill-current' : ''}`} />
                {userLike ? 'Liked' : 'Like'}
              </Button>
              <Button
                variant={movie.inWatchlist ? 'default' : 'outline'}
                size="sm"
                onClick={handleWatchlist}
              >
                <Bookmark className={`w-4 h-4 mr-1.5 ${movie.inWatchlist ? 'fill-current' : ''}`} />
                {movie.inWatchlist ? 'In Watchlist' : 'Watchlist'}
              </Button>
            </div>

            {/* User Rating */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Your Rating:</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((v) => (
                  <button
                    key={v}
                    onClick={() => handleRate(v)}
                    className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                      v <= (ratingValue || 0)
                        ? 'bg-gold text-black'
                        : 'bg-accent text-muted-foreground hover:bg-accent/80'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((g) => (
                <Badge key={g.genreId} variant="secondary" className="text-xs">{g.genre.name}</Badge>
              ))}
            </div>

            {/* Synopsis */}
            <p className="text-sm text-muted-foreground leading-relaxed">{movie.description}</p>

            <Separator />

            {/* Director */}
            {movie.director && (
              <div className="flex items-center gap-2 text-sm">
                <Film className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Director:</span>
                <span className="font-medium text-foreground">{movie.director.name}</span>
              </div>
            )}

            {/* Cast */}
            {movie.cast.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1"><User className="w-4 h-4" /> Cast</p>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((c) => (
                    <Badge key={c.personId} variant="outline" className="text-xs">{c.person.name}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Streaming */}
            {movie.streaming.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Available On:</p>
                <div className="flex flex-wrap gap-2">
                  {movie.streaming.map((s) => (
                    <div key={s.platformId} className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.platform.brandColor }} />
                      <span className="text-sm font-medium">{s.platform.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Similar Movies */}
            {similar.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4 text-primary" />
                  Similar Movies
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto">
                  {similar.slice(0, 6).map((s: any) => (
                    <MovieCard key={s.id} {...s} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
