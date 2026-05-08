import { siteContent } from "@/data/site";

export function FloatingWhatsApp() {
  const { brand, chat } = siteContent;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(86vw,238px)] rounded-lg border border-gold-400/50 bg-white p-2.5 shadow-2xl">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[10px] font-black text-gold-400">
          LIVE
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-black text-navy-950">{chat.title}</p>
          <p className="truncate text-[11px] font-semibold text-slate-500">Fast replies</p>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-1.5">
        <a
          href={brand.whatsappUrl}
          aria-label="Chat with Teekay Sourcing and Shipping on WhatsApp"
          className="inline-flex min-h-9 items-center justify-center rounded-full bg-teal-500 px-2 text-xs font-black text-white transition hover:bg-teal-600"
        >
          {chat.whatsappLabel}
        </a>
        <a
          href="#contact"
          aria-label={`Contact Teekay on WeChat at ${brand.wechat}`}
          className="inline-flex min-h-9 items-center justify-center rounded-full bg-navy-950 px-2 text-xs font-black text-gold-400 transition hover:bg-navy-800"
        >
          {chat.wechatLabel}
        </a>
      </div>
      <p className="mt-1.5 truncate text-center text-[11px] font-bold text-navy-950">
        WeChat ID: {brand.wechat}
      </p>
    </div>
  );
}
