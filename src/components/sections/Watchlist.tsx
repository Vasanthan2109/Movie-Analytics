'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MovieCard } from '@/components/shared/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bookmark, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface WatchlistItem {
  id: string;
  status: string;
  addedAt: string;
  movie: {
    id: string;
    title: string;
    rating: number;
    popularity: number;
    releaseYear: number;
    runtime: number;
    description: string;
    genres: Array<{ genreId: string; genre: { name: string } }>;
    director: { name: string } | null;
    streaming: Array<{ platform: { name: string; brandColor: string } }>;
  };
}

export function Watchlist() {
  const { userId, refreshKey, triggerRefresh } = useAppStore();
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data-fetching loading state
    setLoading(true);
    const params = new URLSearchParams({ userId });
    if (statusFilter !== 'ALL') params.set('status', statusFilter);
    fetch(`/api/watchlist?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setItems(data);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [userId, statusFilter, refreshKey]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    await fetch('/api/watchlist', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status: newStatus }) });
    toast.success(`Updated to ${newStatus.replace(/_/g, ' ')}`);
    triggerRefresh();
  };

  const handleRemove = async (id: string) => {
    await fetch(`/api/watchlist?id=${id}`, { method: 'DELETE' });
    toast.success('Removed from watchlist');
    triggerRefresh();
  };

  const statusColor = (s: string) => {
    switch (s) {
      case 'PLAN_TO_WATCH': return 'text-gold border-gold/30 bg-gold/10';
      case 'WATCHING': return 'text-primary border-primary/30 bg-primary/10';
      case 'COMPLETED': return 'text-success border-success/30 bg-success/10';
      default: return '';
    }
  };

  const statusLabel = (s: string) => s.replace(/_/g, ' ');

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-bold gradient-text">My Watchlist</h2>
          <p className="text-muted-foreground text-sm mt-1">Movies you&apos;ve saved for later</p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 bg-card border-border"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PLAN_TO_WATCH">Plan to Watch</SelectItem>
            <SelectItem value="WATCHING">Watching</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-xl" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <Bookmark className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Your watchlist is empty</p>
          <p className="text-sm text-muted-foreground mt-1">Start exploring movies and save them here!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row gap-4 card-glow transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <button
                    onClick={() => useAppStore.getState().setSelectedMovieId(item.movie.id)}
                    className="text-left"
                  >
                    <h3 className="font-semibold text-foreground hover:text-primary transition-colors">{item.movie.title}</h3>
                  </button>
                  <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${statusColor(item.status)}`}>
                    {statusLabel(item.status)}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{item.movie.releaseYear}</span>
                  <span>·</span>
                  <span>{item.movie.runtime}m</span>
                  <span>·</span>
                  <span className="text-gold">{item.movie.rating}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.movie.genres.map((g) => (
                    <span key={g.genreId} className="text-[10px] px-1.5 py-0.5 rounded bg-accent text-muted-foreground">{g.genre.name}</span>
                  ))}
                </div>
              </div>
              <div className="flex sm:flex-col gap-2 items-center sm:items-end">
                <Select value={item.status} onValueChange={(v) => handleStatusChange(item.id, v)}>
                  <SelectTrigger className="w-36 h-8 text-xs bg-background border-border"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PLAN_TO_WATCH">Plan to Watch</SelectItem>
                    <SelectItem value="WATCHING">Watching</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleRemove(item.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
