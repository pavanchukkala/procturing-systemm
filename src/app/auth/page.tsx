// src/app/auth/page.tsx
"use client";

import { useState } from "react";                        // we'll track submission state
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { Loader2 } from "lucide-react";
import { AuthPanel } from "@/components/auth/auth-panel";
import { AppLogo } from "@/components/shared/app-logo";
import { User, Briefcase } from "lucide-react";

export default function AuthPage() {
  const { signIn, user, loading } = useAuth();          // assume your context exposes signIn()
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);  // track form submit

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // Handle candidate panel submit
  const handleCandidate = async (credentials) => {
    setSubmitting(true);
    const success = await signIn("candidate", credentials);
    setSubmitting(false);
    if (success) router.push("/candidate/dashboard");
  };

  // Handle recruiter panel submit
  const handleRecruiter = async (credentials) => {
    setSubmitting(true);
    const success = await signIn("recruiter", credentials);
    setSubmitting(false);
    if (success) router.push("/recruiter/dashboard");
  };

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
          onSubmit={handleCandidate}
          loading={submitting}
        />
        <AuthPanel
          role="recruiter"
          title="Recruiter Portal"
          description="Manage interviews, invite candidates, and analyze results."
          icon={Briefcase}
          onSubmit={handleRecruiter}
          loading={submitting}
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
