"use client"

import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";
import "./globals.css";
import { useUserStore } from "@/store/useAuthStore";

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (useUserStore.getState() as { hydrate: () => void }).hydrate();
  }, [])

  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {/* <AuthProvider> */}
          {children}
          {/* </AuthProvider> */}
        </QueryProvider>
      </body>
    </html>
  );
}