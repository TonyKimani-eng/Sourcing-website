import Link from "next/link";
import { ReactNode } from "react";

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className = ""
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "gold";
  className?: string;
}) {
  const variants = {
    primary:
      "bg-teal-500 text-white shadow-glow hover:bg-teal-600 focus-visible:outline-teal-400",
    secondary:
      "border border-white/30 bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white",
    gold:
      "bg-gold-400 text-navy-950 shadow-soft hover:bg-gold-500 focus-visible:outline-gold-400"
  };

  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-extrabold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${variants[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
