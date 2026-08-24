'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAppStore, NavSection } from '@/lib/store';
import { Sidebar } from '@/components/layout/Sidebar';
import { Dashboard } from '@/components/sections/Dashboard';
import { ExploreMovies } from '@/components/sections/ExploreMovies';
import { Analytics } from '@/components/sections/Analytics';
import { StreamingPlatforms } from '@/components/sections/StreamingPlatforms';
import { Recommendations } from '@/components/sections/Recommendations';
import { Watchlist } from '@/components/sections/Watchlist';
import { MyActivity } from '@/components/sections/MyActivity';
import { About } from '@/components/sections/About';
import { MovieDetailDialog } from '@/components/sections/MovieDetailDialog';

export default function Home() {
  const { activeSection, selectedMovieId, setSelectedMovieId } = useAppStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard': return <Dashboard />;
      case 'explore': return <ExploreMovies />;
      case 'analytics': return <Analytics />;
      case 'platforms': return <StreamingPlatforms />;
      case 'recommendations': return <Recommendations />;
      case 'watchlist': return <Watchlist />;
      case 'activity': return <MyActivity />;
      case 'about': return <About />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 min-h-screen flex flex-col overflow-x-hidden">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 py-3 border-b border-border bg-background/95 backdrop-blur-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold gradient-text">CineVerse</h1>
        </header>
        <div className="flex-1 p-4 md:p-6 lg:p-8">
          {renderSection()}
        </div>
        <footer className="mt-auto border-t border-border px-4 md:px-6 lg:px-8 py-4 text-center text-sm text-muted-foreground">
          <p>CineVerse &copy; {new Date().getFullYear()} — Movie & Streaming Analytics Platform</p>
        </footer>
      </main>
      <MovieDetailDialog
        movieId={selectedMovieId}
        open={!!selectedMovieId}
        onClose={() => setSelectedMovieId(null)}
      />
    </div>
  );
}
