'use client';

import { Film, BarChart3, Star, Tv, Database, Shield, Zap } from 'lucide-react';

export function About() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h2 className="text-2xl font-bold gradient-text">About CineVerse</h2>
        <p className="text-muted-foreground text-sm mt-1">Your intelligent movie discovery and analytics companion</p>
      </div>

      {/* Hero */}
      <div className="rounded-xl border border-border bg-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/20 to-transparent rounded-bl-full" />
        <h3 className="text-xl font-bold mb-2">Movie & Streaming Analytics Platform</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          CineVerse combines movie catalog exploration, weighted rankings, streaming platform comparisons,
          personalized recommendations, and user activity tracking into a single, powerful experience.
          All analytics and recommendation logic runs on the server using structured data processing.
        </p>
      </div>

      {/* Features */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Core Features</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Film, title: 'Movie Discovery', desc: 'Search, filter, and sort through a curated movie catalog with advanced filtering by genre, decade, rating, platform, and language.' },
            { icon: BarChart3, title: 'Deep Analytics', desc: 'Interactive charts showing trends by year, genre performance, runtime distribution, popularity analysis, and audience vote patterns.' },
            { icon: Star, title: 'Weighted Rankings', desc: 'A fair ranking system that considers both rating quality and vote volume to prevent low-vote films from dominating.' },
            { icon: Tv, title: 'Platform Comparison', desc: 'Compare streaming services by catalog size, average quality, genre strength, and top-rated titles.' },
            { icon: Zap, title: 'Smart Recommendations', desc: 'Deterministic, explainable recommendations based on genre preferences, platform usage, recency, and activity patterns.' },
            { icon: Shield, title: 'Activity Tracking', desc: 'Track your views, likes, and ratings. Your activity powers better recommendations and provides personal insights.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="rounded-xl border border-border bg-card p-4">
              <Icon className="w-5 h-5 text-primary mb-2" />
              <h4 className="font-semibold text-sm mb-1">{title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ranking Formula */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <Database className="w-5 h-5 text-cinema-purple" />
          Weighted Ranking Formula
        </h3>
        <div className="bg-background rounded-lg p-4 font-mono text-sm text-foreground mb-3">
          weighted = (v / (v + m)) × R + (m / (v + m)) × C
        </div>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <p><span className="text-foreground font-medium">R</span> = movie rating</p>
          <p><span className="text-foreground font-medium">v</span> = vote count</p>
          <p><span className="text-foreground font-medium">m</span> = minimum vote threshold (500,000)</p>
          <p><span className="text-foreground font-medium">C</span> = catalog average rating</p>
        </div>
      </div>

      {/* Recommendation Signals */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-3">Recommendation Signals</h3>
        <div className="space-y-2">
          {[
            { label: 'Genre Match', weight: 30, color: 'bg-primary' },
            { label: 'Rating Quality', weight: 25, color: 'bg-gold' },
            { label: 'Platform Match', weight: 15, color: 'bg-cinema-purple' },
            { label: 'Popularity', weight: 15, color: 'bg-success' },
            { label: 'Recency', weight: 10, color: 'bg-chart-5' },
            { label: 'Activity Similarity', weight: 5, color: 'bg-chart-2' },
          ].map(({ label, weight, color }) => (
            <div key={label} className="flex items-center gap-3">
              <span className="text-sm w-40 flex-shrink-0">{label}</span>
              <div className="flex-1 h-3 rounded-full bg-accent overflow-hidden">
                <div className={`h-full rounded-full ${color} transition-all duration-500`} style={{ width: `${weight * 3.3}%` }} />
              </div>
              <span className="text-sm font-medium w-10 text-right">{weight}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold mb-3">Technology</h3>
        <div className="flex flex-wrap gap-2">
          {['Next.js 16', 'TypeScript', 'Prisma', 'SQLite', 'Recharts', 'Tailwind CSS', 'shadcn/ui', 'Zustand'].map((t) => (
            <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-accent text-muted-foreground border border-border">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
