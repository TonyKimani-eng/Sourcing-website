import { ContactCta } from "@/components/ContactCta";
import { Faq } from "@/components/Faq";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { Pricing } from "@/components/Pricing";
import { Services } from "@/components/Services";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { WarehouseAddresses } from "@/components/WarehouseAddresses";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Services />
      <WhyChooseUs />
      <Pricing />
      <WarehouseAddresses />
      <Faq />
      <ContactCta />
      <FloatingWhatsApp />
    </main>
  );
}
