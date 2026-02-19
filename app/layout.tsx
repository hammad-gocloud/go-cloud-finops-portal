"use client"; // ✅ make sure this is uncommented — needed for hooks like useRouter/useState


import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { queryClient } from "@/config/react.query";
import { AuthProvider } from "./contexts/AuthContext";
import { AIChatbot } from "@/components/ai-chatbot";




export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {/* ✅ Wrap your entire app in AuthProvider */}
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster richColors position="top-right" />
            <AIChatbot />
          </QueryClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
