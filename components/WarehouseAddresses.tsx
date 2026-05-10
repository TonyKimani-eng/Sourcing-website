import { Container } from "@/components/Container";
import { SectionHeader } from "@/components/SectionHeader";
import { siteContent } from "@/data/site";

export function WarehouseAddresses() {
  return (
    <section id="warehouses" className="bg-white py-16 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Warehouses and pick-up"
          title="Send cargo to China and collect in Nairobi"
          description="Use the sea or air warehouse details after confirming your shipment method, then collect arrived goods from our Nairobi pick-up point."
        />
        <div className="grid gap-5 lg:grid-cols-2">
          {siteContent.warehouses.map((warehouse) => (
            <article
              className="min-w-0 rounded-lg border border-gold-400/30 bg-[#fbfdff] p-5 shadow-soft sm:p-6"
              key={warehouse.title}
            >
              <p className="text-sm font-black uppercase text-teal-600">
                {warehouse.title}
              </p>
              <div className="mt-5 space-y-4 text-navy-950">
                <div>
                  <p className="text-sm font-bold text-slate-500">Address</p>
                  <p className="mt-1 break-words text-base font-black leading-7 sm:text-lg sm:leading-8">{warehouse.address}</p>
                </div>
                {warehouse.navigation ? (
                  <div>
                    <p className="text-sm font-bold text-slate-500">Navigation</p>
                    <p className="mt-1 break-words text-base font-black leading-7 sm:text-lg sm:leading-8">{warehouse.navigation}</p>
                  </div>
                ) : null}
                <div>
                  <p className="text-sm font-bold text-slate-500">Contact</p>
                  <p className="mt-1 break-words text-base font-black leading-7 sm:text-lg sm:leading-8">{warehouse.contact}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
        <article className="mt-5 min-w-0 rounded-lg border border-teal-500/30 bg-navy-950 p-5 text-white shadow-soft sm:p-6">
          <p className="text-sm font-black uppercase text-gold-400">
            {siteContent.kenyaPickup.title}
          </p>
          <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-sm font-bold text-white/60">Pick-up address</p>
              <p className="mt-1 break-words text-base font-black leading-7 sm:text-lg sm:leading-8">
                {siteContent.kenyaPickup.address}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-white/60">Contacts</p>
              <p className="mt-1 break-words text-base font-black leading-7 sm:text-lg sm:leading-8">
                {siteContent.kenyaPickup.contact}
              </p>
            </div>
          </div>
        </article>
      </Container>
    </section>
  );
}
