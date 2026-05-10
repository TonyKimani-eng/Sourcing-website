import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { siteContent } from "@/data/site";

export const metadata: Metadata = {
  title: siteContent.meta.title,
  description: siteContent.meta.description
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
