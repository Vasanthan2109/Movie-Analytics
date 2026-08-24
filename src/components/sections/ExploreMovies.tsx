'use client';

import { useEffect, useState } from 'react';
import { useAppStore } from '@/lib/store';
import { MovieCard } from '@/components/shared/MovieCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface FilterOptions {
  genres: string[];
  platforms: string[];
  languages: string[];
  decades: number[];
}

export function ExploreMovies() {
  const { refreshKey } = useAppStore();
  const [filters, setFilters] = useState<FilterOptions>({ genres: [], platforms: [], languages: [], decades: [] });
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');
  const [decade, setDecade] = useState('');
  const [minRating, setMinRating] = useState('');
  const [platform, setPlatform] = useState('');
  const [language, setLanguage] = useState('');
  const [sort, setSort] = useState('weighted');
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch('/api/filters').then((r) => r.json()).then(setFilters);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data-fetching loading state
    setLoading(true);
    const params = new URLSearchParams({ sort, page: String(page), limit: '24' });
    if (search) params.set('search', search);
    if (genre) params.set('genre', genre);
    if (decade) params.set('decade', decade);
    if (minRating) params.set('minRating', minRating);
    if (platform) params.set('platform', platform);
    if (language) params.set('language', language);
    fetch(`/api/movies?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setMovies(data.movies);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setLoading(false);
      });
  }, [search, genre, decade, minRating, platform, language, sort, page, refreshKey]);

  const updateFilter = (setter: (v: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  const clearFilters = () => {
    setSearch(''); setGenre(''); setDecade(''); setMinRating(''); setPlatform(''); setLanguage(''); setSort('weighted');
    setPage(1);
  };

  const hasFilters = search || genre || decade || minRating || platform || language;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Explore Movies</h2>
        <p className="text-muted-foreground text-sm mt-1">Search, filter, and discover your next favorite film</p>
      </div>

      {/* Search + Filter toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, director, or description..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10 bg-card border-border"
          />
        </div>
        <Button
          variant={showFilters ? 'default' : 'outline'}
          size="icon"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={clearFilters}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-xl border border-border bg-card">
          <Select value={genre} onValueChange={(v) => updateFilter(setGenre, v === '_all' ? '' : v)}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Genre" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Genres</SelectItem>
              {filters.genres.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={decade} onValueChange={(v) => updateFilter(setDecade, v === '_all' ? '' : v)}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Decade" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Decades</SelectItem>
              {filters.decades.map((d) => <SelectItem key={d} value={String(d)}>{d}s</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={minRating} onValueChange={(v) => updateFilter(setMinRating, v === '_all' ? '' : v)}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Min Rating" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">Any Rating</SelectItem>
              <SelectItem value="7">7+</SelectItem>
              <SelectItem value="7.5">7.5+</SelectItem>
              <SelectItem value="8">8+</SelectItem>
              <SelectItem value="8.5">8.5+</SelectItem>
              <SelectItem value="9">9+</SelectItem>
            </SelectContent>
          </Select>
          <Select value={platform} onValueChange={(v) => updateFilter(setPlatform, v === '_all' ? '' : v)}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Platform" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Platforms</SelectItem>
              {filters.platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={language} onValueChange={(v) => updateFilter(setLanguage, v === '_all' ? '' : v)}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Language" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Languages</SelectItem>
              {filters.languages.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={sort} onValueChange={(v) => { updateFilter(setSort, v); }}>
            <SelectTrigger className="bg-background"><SelectValue placeholder="Sort By" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="weighted">Weighted Rank</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="title">Title A–Z</SelectItem>
              <SelectItem value="runtime">Runtime</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Results info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{total} movies found</span>
        {hasFilters && (
          <span>Sorted by: <span className="text-foreground font-medium capitalize">{sort.replace(/([A-Z])/g, ' $1')}</span></span>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 12 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      ) : movies.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No movies match your criteria</p>
          <Button variant="outline" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {movies.map((m: any) => (
            <MovieCard
              key={m.id}
              id={m.id}
              title={m.title}
              rating={m.rating}
              popularity={m.popularity}
              releaseYear={m.releaseYear}
              runtime={m.runtime}
              weightedScore={m.weightedScore}
              genres={m.genres}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button variant="outline" size="icon" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
          <Button variant="outline" size="icon" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
