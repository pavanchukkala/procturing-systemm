// src/app/auth/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { AppLogo } from "@/components/shared/app-logo";
import { User, Briefcase } from "lucide-react";

export default function AuthPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // If user already logged in, send to correct dashboard
  useEffect(() => {
    if (!loading && user) {
      if (user.role === "candidate") {
        router.replace("/candidate/dashboard");
      } else {
        router.replace("/recruiter/dashboard");
      }
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Show signup/login panels
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 animated-gradient-background">
      <div className="absolute top-6 left-6">
        <AppLogo size="lg" />
      </div>
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10">
        <AuthPanel
          role="candidate"
          title="Candidate Portal"
          description="Access your interviews, exams, and mock tests."
          icon={User}
        />
        <AuthPanel
          role="recruiter"
          title="Recruiter Portal"
          description="Manage interviews, invite candidates, and analyze results."
          icon={Briefcase}
        />
      </div>
      <footer className="absolute bottom-6 text-center w-full">
        <p className="text-sm text-foreground/70">
          &copy; {new Date().getFullYear()} Proctoring System. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
