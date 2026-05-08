export function IconBadge({
  label,
  className = ""
}: {
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-sm font-black text-teal-600 ring-1 ring-teal-100 ${className}`}
      aria-hidden="true"
    >
      {label}
    </div>
  );
}
