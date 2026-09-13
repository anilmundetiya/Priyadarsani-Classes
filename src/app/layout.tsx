import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Priyadarshani Classes — Smart Learning. Better Future.",
  description:
    "AI-powered coaching platform for Maharashtra State Board students in Mumbai. Expert teachers, personalized learning, and 24/7 AI doubt solving.",
  keywords:
    "Priyadarshani Classes, coaching, Mumbai, Maharashtra State Board, Prem Sir, AI learning, tuition",
  openGraph: {
    title: "Priyadarshani Classes",
    description: "Smart Learning. Better Future.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#f8fafc" },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#f8fafc" },
            },
          }}
        />
      </body>
    </html>
  );
}
