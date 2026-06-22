import Hero from "@/components/Hero";
import TransmissionTimeline from "@/components/TransmissionTimeline";
import RegionMap from "@/components/RegionMap";
import BodaccFeed from "@/components/BodaccFeed";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <TransmissionTimeline />
      <RegionMap />
      <BodaccFeed />
      <Footer />
    </main>
  );
}
