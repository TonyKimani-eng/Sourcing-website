import { Container } from "@/components/Container";
import { IconBadge } from "@/components/IconBadge";
import { SectionHeader } from "@/components/SectionHeader";
import { siteContent } from "@/data/site";

export function Services() {
  return (
    <section id="services" className="bg-white py-16 sm:py-24">
      <Container>
        <SectionHeader
          eyebrow="Services"
          title="Freight and sourcing support for personal and business imports"
          description="Choose the support you need, from a single product search to consolidated cargo movement."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {siteContent.services.map((service) => (
            <article
              className="group rounded-lg border border-slate-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-teal-100"
              key={service.title}
            >
              <IconBadge label={service.icon} className="transition group-hover:bg-teal-500 group-hover:text-white" />
              <h3 className="mt-6 text-2xl font-black text-navy-950">{service.title}</h3>
              <p className="mt-3 max-w-xl leading-7 text-slate-600">{service.description}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
