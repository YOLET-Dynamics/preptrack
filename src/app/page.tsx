import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Differentiator from "@/components/Differentiator";
import CTA from "@/components/CTA";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Differentiator />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
