'use client';

import { useEffect, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const COLORS = ['oklch(0.55 0.24 25)', 'oklch(0.55 0.20 290)', 'oklch(0.78 0.15 85)', 'oklch(0.65 0.20 145)', 'oklch(0.65 0.15 200)', 'oklch(0.70 0.15 60)', 'oklch(0.50 0.20 330)', 'oklch(0.60 0.18 30)'];

interface AnalyticsData {
  yearData: Array<{ year: number; count: number }>;
  ratingYearData: Array<{ year: number; avgRating: number }>;
  genreData: Array<{ name: string; count: number; avgRating: number; avgPopularity: number }>;
  runtimeData: Array<{ range: string; count: number }>;
  ratingDist: Array<{ range: string; count: number }>;
  popData: Array<{ range: string; count: number }>;
  voteData: Array<{ range: string; count: number }>;
  totalFiltered: number;
}

export function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [yearStart, setYearStart] = useState('1970');
  const [yearEnd, setYearEnd] = useState('2025');
  const [genre, setGenre] = useState('');
  const [platform, setPlatform] = useState('');
  const [filterOptions, setFilterOptions] = useState({ genres: [], platforms: [] });

  useEffect(() => {
    fetch('/api/filters').then((r) => r.json()).then(setFilterOptions);

    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- standard data-fetching loading state
    setLoading(true);
    const sp = new URLSearchParams({ yearStart, yearEnd });
    if (genre && genre !== '_all') sp.set('genre', genre);
    if (platform && platform !== '_all') sp.set('platform', platform);
    fetch(`/api/analytics?${sp}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        setData(json);
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, [yearStart, yearEnd, genre, platform]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Analytics</h2>
        <p className="text-muted-foreground text-sm mt-1">Deep dive into movie trends, genres, and patterns</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={yearStart} onValueChange={setYearStart}>
          <SelectTrigger className="w-32 bg-card border-border"><SelectValue /></SelectTrigger>
          <SelectContent>
            {[1970, 1980, 1990, 2000, 2010, 2015, 2020].map((y) => <SelectItem key={y} value={String(y)}>From {y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={yearEnd} onValueChange={setYearEnd}>
          <SelectTrigger className="w-32 bg-card border-border"><SelectValue /></SelectTrigger>
          <SelectContent>
            {[2000, 2010, 2015, 2020, 2024, 2025].map((y) => <SelectItem key={y} value={String(y)}>To {y}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={genre || '_all'} onValueChange={setGenre}>
          <SelectTrigger className="w-40 bg-card border-border"><SelectValue placeholder="All Genres" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All Genres</SelectItem>
            {filterOptions.genres.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={platform || '_all'} onValueChange={setPlatform}>
          <SelectTrigger className="w-44 bg-card border-border"><SelectValue placeholder="All Platforms" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="_all">All Platforms</SelectItem>
            {filterOptions.platforms.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
          </SelectContent>
        </Select>
        {data && <span className="self-center text-sm text-muted-foreground">{data.totalFiltered} movies</span>}
      </div>

      {loading ? <AnalyticsSkeleton /> : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Movies by Year */}
          <ChartCard title="Movies Released by Year" icon={<BarChart3 className="w-4 h-4 text-primary" />}>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={data.yearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 280)" />
                <XAxis dataKey="year" tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'oklch(0.17 0.01 280)', border: '1px solid oklch(0.28 0.02 280)', borderRadius: 8 }} />
                <Area type="monotone" dataKey="count" stroke={COLORS[0]} fill={COLORS[0]} fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Avg Rating by Year */}
          <ChartCard title="Average Rating by Year" icon={<BarChart3 className="w-4 h-4 text-gold" />}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={data.ratingYearData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 280)" />
                <XAxis dataKey="year" tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }} />
                <YAxis domain={[6, 10]} tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'oklch(0.17 0.01 280)', border: '1px solid oklch(0.28 0.02 280)', borderRadius: 8 }} />
                <Line type="monotone" dataKey="avgRating" stroke={COLORS[2]} strokeWidth={2} dot={{ fill: COLORS[2] }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Genre Performance */}
          <ChartCard title="Genre Distribution" icon={<BarChart3 className="w-4 h-4 text-cinema-purple" />}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.genreData.slice(0, 12)} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 280)" />
                <XAxis type="number" tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={80} tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'oklch(0.17 0.01 280)', border: '1px solid oklch(0.28 0.02 280)', borderRadius: 8 }} />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.genreData.slice(0, 12).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Rating Distribution */}
          <ChartCard title="Rating Distribution" icon={<BarChart3 className="w-4 h-4 text-success" />}>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.ratingDist}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 280)" />
                <XAxis dataKey="range" tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'oklch(0.17 0.01 280)', border: '1px solid oklch(0.28 0.02 280)', borderRadius: 8 }} />
                <Bar dataKey="count" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Runtime Distribution */}
          <ChartCard title="Runtime Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.runtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 280)" />
                <XAxis dataKey="range" tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'oklch(0.17 0.01 280)', border: '1px solid oklch(0.28 0.02 280)', borderRadius: 8 }} />
                <Bar dataKey="count" fill={COLORS[1]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Popularity Analysis */}
          <ChartCard title="Popularity Analysis">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={data.popData} dataKey="count" nameKey="range" cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`}>
                  {data.popData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: 'oklch(0.17 0.01 280)', border: '1px solid oklch(0.28 0.02 280)', borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Vote Analysis */}
          <ChartCard title="Audience Vote Analysis" className="lg:col-span-2">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={data.voteData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 280)" />
                <XAxis dataKey="range" tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'oklch(0.65 0.02 280)', fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: 'oklch(0.17 0.01 280)', border: '1px solid oklch(0.28 0.02 280)', borderRadius: 8 }} />
                <Bar dataKey="count" fill={COLORS[3]} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      ) : null}
    </div>
  );
}

function ChartCard({ title, icon, children, className }: { title: string; icon?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-border bg-card p-4 ${className || ''}`}>
      <h3 className="font-semibold mb-3 flex items-center gap-2">{icon}{title}</h3>
      {children}
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-80 rounded-xl" />
      ))}
    </div>
  );
}
