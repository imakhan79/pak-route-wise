import { Navbar } from '@/components/marketing/Navbar';
import { Hero } from '@/components/marketing/Hero';
import { StatsCounter } from '@/components/marketing/StatsCounter';
import { FeatureGrid } from '@/components/marketing/FeatureGrid';
import { DashboardPreview } from '@/components/marketing/DashboardPreview';
import { WorldMap } from '@/components/marketing/WorldMap';
import { WhyChooseUs } from '@/components/marketing/WhyChooseUs';
import { Testimonials } from '@/components/marketing/Testimonials';
import { CTASection } from '@/components/marketing/CTASection';
import { Footer } from '@/components/marketing/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[hsl(1,20%,8%)]">
      <Navbar />
      <Hero />
      <StatsCounter />
      <FeatureGrid />
      <DashboardPreview />
      <WorldMap />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
      <Footer />
    </div>
  );
}
