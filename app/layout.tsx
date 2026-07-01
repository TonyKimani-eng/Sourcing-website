import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AuthProvider } from "@/components/Auth";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { siteContent } from "@/data/site";

const gaMeasurementId =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-MBHVC43B7G";

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
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
          <GoogleAnalytics measurementId={gaMeasurementId} />
        </AuthProvider>
      </body>
    </html>
  );
}
