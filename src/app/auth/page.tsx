// src/app/auth/page.tsx
"use client";  // Make sure it is client-side

import { useRouter } from "next/navigation";  // This hooks into Next.js router
import { useAuth } from "@/contexts/auth-context";  // Assuming useAuth hook provides the auth state

export default function AuthPage() {
  const { user, loading } = useAuth();  // Get user and loading status from auth context
  const router = useRouter();

  if (loading) return <div>Loading...</div>; // Optional: loading state while checking auth

  if (user) {
    // If user is logged in, redirect to the dashboard
    router.push("/dashboard");
  }

  return (
    <div>
      <h1>Login Page</h1>
      {/* Login form here */}
    </div>
  );
}
