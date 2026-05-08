export function HeroVisual() {
  return (
    <div className="relative mx-auto aspect-[1.08] w-full max-w-xl overflow-hidden rounded-lg border border-white/15 bg-white/10 p-4 shadow-2xl backdrop-blur">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(32,197,180,0.22),transparent_34%),radial-gradient(circle_at_80%_70%,rgba(245,200,95,0.18),transparent_36%)]" />
      <svg
        viewBox="0 0 620 574"
        role="img"
        aria-label="Illustration showing a shipping route from China to Kenya"
        className="relative h-full w-full"
      >
        <rect x="22" y="26" width="576" height="522" rx="32" fill="#f8fbff" opacity="0.95" />
        <path
          d="M115 155c42-32 93-39 151-21 31 10 60 10 88-2 43-18 90-3 119 32 36 44 29 100-17 138-35 29-68 30-111 25-53-6-86 31-132 34-61 4-116-28-136-80-17-45-4-94 38-126Z"
          fill="#dceafe"
        />
        <path
          d="M103 363c30-30 73-40 123-28 34 8 64 4 91-13 38-23 88-12 119 23 38 42 38 95 0 131-34 32-81 37-131 17-31-12-60-12-88 1-47 22-97 8-126-30-25-33-21-72 12-101Z"
          fill="#c8f5ef"
        />
        <path
          d="M404 196c48 18 73 61 58 99-14 37-62 57-110 39-48-19-73-61-58-99 14-38 62-57 110-39Z"
          fill="#f8df9b"
          opacity="0.75"
        />
        <circle cx="424" cy="190" r="12" fill="#11a99d" />
        <circle cx="377" cy="386" r="12" fill="#d9a92d" />
        <path
          d="M424 190C394 221 369 252 351 283c-25 44-23 77 26 103"
          fill="none"
          stroke="#0a2d55"
          strokeWidth="5"
          strokeLinecap="round"
          className="route-dash"
        />
        <path d="m456 172 34 8-29 18-8 35-18-29-35-8 30-18 8-35 18 29Z" fill="#0a2d55" />
        <path d="M250 414h130l25 28H226l24-28Z" fill="#0a2d55" />
        <path d="M253 371h98l32 43H226l27-43Z" fill="#11a99d" />
        <path d="M380 414h59l-31 28h-3l-25-28Z" fill="#d9a92d" />
        <rect x="257" y="348" width="71" height="36" rx="5" fill="#f8fbff" />
        <rect x="340" y="346" width="54" height="38" rx="5" fill="#f5c85f" />
        <path d="M203 443c55 20 139 22 210 0 29-9 60-9 93 4" fill="none" stroke="#8accc6" strokeWidth="8" strokeLinecap="round" />
        <text x="389" y="167" fill="#061f3d" fontSize="24" fontWeight="800">
          China
        </text>
        <text x="318" y="421" fill="#061f3d" fontSize="24" fontWeight="800">
          Kenya
        </text>
      </svg>
      <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/60 bg-white/[0.85] p-4 shadow-soft backdrop-blur">
        <p className="text-sm font-black text-navy-950">Air or sea freight</p>
        <p className="mt-1 text-sm text-slate-600">Sourcing, consolidation, and delivery updates in one flow.</p>
      </div>
    </div>
  );
}
