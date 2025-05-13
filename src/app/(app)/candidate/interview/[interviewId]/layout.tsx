
import type { ReactNode } from 'react';
import { AppLogo } from '@/components/shared/app-logo';
import { Video } from 'lucide-react'; 

export default function InterviewLayout({
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
            <Video className="h-5 w-5" />
            <span>Secure Interview Mode</span>
          </div>
        </div>
      </header>
      {/* Ensure main content area can fill height for RealtimeInterviewUI */}
      <main className="flex-1 container py-0 sm:py-0 px-0 sm:px-0 lg:px-0 flex flex-col">
        {children}
      </main>
      {/* Footer might be intrusive for full-height real-time UI, consider conditional rendering or removal from RealtimeInterviewUI itself */}
      {/* <footer className="py-4 text-center border-t bg-card/95">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Proctoring System. Best of luck with your interview!
        </p>
      </footer> */}
    </div>
  );
}