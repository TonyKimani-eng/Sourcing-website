import { ContactCta } from "@/components/ContactCta";
import { Faq } from "@/components/Faq";
import { CustomerChat } from "@/components/CustomerChat";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { ImportCostAnalyzer } from "@/components/ImportCostAnalyzer";
import { Pricing } from "@/components/Pricing";
import { Services } from "@/components/Services";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { WarehouseAddresses } from "@/components/WarehouseAddresses";
import { Testimonials } from "@/components/Testimonials";

export default function Home() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Services />
      <WhyChooseUs />
      <Testimonials />
      <Pricing />
      <ImportCostAnalyzer />
      <WarehouseAddresses />
      <Faq />
      <ContactCta />
      <CustomerChat />
    </main>
  );
}
