
"use client";

import type { ReactNode } from 'react';
import type { CandidateInterview } from '@/types';
import { InterviewCard } from './interview-card';
import { FileText } from 'lucide-react';

interface DisplayItemsGridProps {
  items: CandidateInterview[];
  title: string;
  emptyContext: string; // e.g., "ongoing assessments", "mock sessions to practice"
  actionButton?: ReactNode;
}

export function DisplayItemsGrid({ items, title, emptyContext, actionButton }: DisplayItemsGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-10 border border-dashed rounded-lg bg-card">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-xl font-semibold">No {emptyContext}</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          There are no items in this section yet.
        </p>
        {actionButton}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <InterviewCard key={item.id} interview={item} />
        ))}
      </div>
    </div>
  );
}
