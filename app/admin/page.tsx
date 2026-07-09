import type { Metadata } from "next";
import { AdminDashboard } from "@/components/AdminDashboard";
import { siteContent } from "@/data/site";

export const metadata: Metadata = {
  title: `Admin | ${siteContent.brand.name}`,
  description: "Admin dashboard for Teekay customer sourcing requests."
};

export default function AdminPage() {
  return <AdminDashboard />;
}
