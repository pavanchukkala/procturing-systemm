
import type { ReactNode } from 'react';
import { AppLogo } from '@/components/shared/app-logo';
import { Users } from 'lucide-react'; // Using Users icon for live interaction

export default function LiveInterviewSessionLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <AppLogo size="md" />
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Users className="h-5 w-5" />
            <span>Live Interview Session</span>
          </div>
        </div>
      </header>
      {/* Ensure main content area can fill height for RealtimeInterviewUI */}
      <main className="flex-1 flex flex-col"> {/* Removed container and padding for full-width/height UI */}
        {children}
      </main>
      {/* Footer is generally omitted in full-screen call UIs to maximize space */}
    </div>
  );
}