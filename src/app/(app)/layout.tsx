"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { AppLogo } from "@/components/shared/app-logo";
import { ShieldCheck } from "lucide-react";

interface ExamLayoutProps {
  children: ReactNode;
}

export default function ExamLayout({ children }: ExamLayoutProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/auth');
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur-sm">
        <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <AppLogo size="md" />
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <ShieldCheck className="h-5 w-5" />
            <span>Secure Exam Mode</span>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="py-4 text-center border-t bg-card/95">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Proctoring System. Best of luck!
        </p>
      </footer>
    </div>
  );
}
