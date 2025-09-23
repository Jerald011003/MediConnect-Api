"use client"

import { useEffect } from "react";
import { QueryProvider } from "@/providers/QueryProvider";
import { useUserStore } from "@/store/useAuthStore";

import "./globals.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    (useUserStore.getState() as { hydrate: () => void }).hydrate();
  }, [])

  return (
    <html lang="en">
      <body>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}