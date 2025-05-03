import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TrackPage() {
  return (
    <div className="h-full flex flex-col bg-black text-white">
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold font-funnel-sans bg-gradient-to-r from-cyan-400 to-teal-400 text-transparent bg-clip-text">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-funnel-sans">
            We're working on something amazing. Stay tuned for updates!
          </p>
          <div className="pt-8">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-teal-400 rounded-lg blur opacity-25"></div>
              <Link href="/dashboard">
                <Button className="relative px-8 py-3 bg-black rounded-lg text-white font-semibold hover:bg-gray-900 transition-colors">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
