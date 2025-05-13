// src/app/layout.tsx
import "@/styles/globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata = { title: "Proctoring System" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
