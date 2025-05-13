// src/app/layout.tsx
import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/auth-context";

export const metadata = {
  title: "Proctoring System",
  description: "Secure exam & recruitment platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
