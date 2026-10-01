import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resume Builder — Free Professional Resume Builder",
  description:
    "Build ATS-friendly and modern resumes for free. No login required. All data stays in your browser.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Caladea:ital,wght@0,400;0,700;1,400;1,700&family=Carlito:ital,wght@0,400;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#e6e6e6] text-[#1d1d1f] selection:bg-[#305CDE] selection:text-white">
        {children}
      </body>
    </html>
  );
}
