import { siteContent } from "@/data/site";

export function FloatingWhatsApp() {
  return (
    <a
      href={siteContent.brand.whatsappUrl}
      aria-label="Chat with Teekay Sourcing and Shipping on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-sm font-black text-white shadow-glow ring-4 ring-white transition hover:scale-105 hover:bg-teal-600 sm:h-16 sm:w-16"
    >
      WA
    </a>
  );
}
