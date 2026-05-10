import { siteContent } from "@/data/site";

export function FloatingWhatsApp() {
  const { brand, chat } = siteContent;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[168px] rounded-lg border border-gold-400/50 bg-white p-2 shadow-2xl sm:w-[238px] sm:p-2.5">
      <div className="hidden items-center gap-2 sm:flex">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[10px] font-black text-gold-400">
          LIVE
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-black text-navy-950">{chat.title}</p>
          <p className="truncate text-[11px] font-semibold text-slate-500">Fast replies</p>
        </div>
      </div>
      <div className="sm:mt-2">
        <a
          href={brand.whatsappUrl}
          aria-label="Chat with Teekay Sourcing and Shipping on WhatsApp"
          className="inline-flex min-h-9 w-full items-center justify-center rounded-full bg-teal-500 px-2 text-xs font-black text-white transition hover:bg-teal-600"
        >
          {chat.whatsappLabel}
        </a>
      </div>
    </div>
  );
}
