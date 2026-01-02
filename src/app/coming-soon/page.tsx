import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function ComingSoon() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-brand-indigo">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-8 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-bold font-inter text-brand-indigo">
            Coming <span className="text-brand-green">Soon</span>
          </h1>
          <p className="text-xl md:text-2xl text-brand-indigo/60 font-dm-sans leading-relaxed">
            We're working on something amazing. Stay tuned for updates!
          </p>
          <div className="pt-8">
            <Link href="/">
              <Button className="px-8 py-6 bg-brand-indigo text-white font-dm-sans font-medium rounded-full hover:bg-brand-indigo/90 transition-all duration-300 hover:scale-105 text-lg">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
          </div>
        </div>

        {/* Background glow effects */}
        <div className="fixed top-1/3 left-1/4 w-80 h-80 rounded-full bg-brand-green/10 blur-3xl -z-10"></div>
        <div className="fixed bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-brand-indigo/5 blur-3xl -z-10"></div>
      </main>
      <Footer />
    </div>
  );
}
