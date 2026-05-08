import { siteContent } from "@/data/site";

export function FloatingWhatsApp() {
  const { brand, chat } = siteContent;

  return (
    <div className="fixed bottom-3 left-3 right-3 z-50 rounded-lg border border-gold-400/50 bg-white p-2 shadow-2xl sm:left-auto sm:right-4 sm:w-[238px] sm:p-2.5">
      <div className="hidden items-center gap-2 sm:flex">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy-950 text-[10px] font-black text-gold-400">
          LIVE
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-black text-navy-950">{chat.title}</p>
          <p className="truncate text-[11px] font-semibold text-slate-500">Fast replies</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-1.5 sm:mt-2">
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
      <p className="mt-1.5 truncate text-center text-[11px] font-bold text-navy-950 sm:block">
        WeChat ID: {brand.wechat}
      </p>
    </div>
  );
}
