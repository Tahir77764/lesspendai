import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Spend Optimizer",
  description: "Audit your team's AI stack in 60 seconds and get personalized recommendations to save money and boost productivity.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#f8fafc]">
        {children}
      </body>
    </html>
  );
}
