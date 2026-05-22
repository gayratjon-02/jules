import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Scalerrs Assessment",
  description: "Google Docs powered article preview and quality check",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
