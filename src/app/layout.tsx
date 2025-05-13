// src/app/layout.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";

export default function RootLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If not authenticated, always send to /auth
      if (!user && router.pathname !== "/auth") {
        router.replace("/auth");
      }
      // If authenticated, landing at "/" send to dashboard
      if (user && router.pathname === "/") {
        router.replace(`/${user.role}/dashboard`);
      }
    }
  }, [user, loading, router]);

  return <>{children}</>;
}
