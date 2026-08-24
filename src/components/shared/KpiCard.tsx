'use client';

import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  subtext?: string;
}

export function KpiCard({ label, value, icon: Icon, color = 'text-primary', subtext }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-4 card-glow transition-all duration-200">
      <div className={cn('w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0', color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground truncate">{label}</p>
        <p className="text-xl font-bold text-foreground">{value}</p>
        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </div>
    </div>
  );
}
