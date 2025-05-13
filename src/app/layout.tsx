// src/app/layout.tsx

import "./globals.css";
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth-context";  // path to your context
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>       {/* ← wrap everything here */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
