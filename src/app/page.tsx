export default function ComingSoon() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h1
            className={`font-funnel-display text-5xl md:text-7xl lg:text-8xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400`}
          >
            preptrack.app
          </h1>

          <div className="relative">
            <div className="absolute inset-0 blur-xl bg-gradient-to-r from-cyan-500/30 to-teal-500/30 rounded-lg -z-10"></div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium mb-8 py-4">
              Coming Soon
            </h2>
          </div>

          <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
            We're working hard to bring you something amazing. Stay tuned for
            updates.
          </p>
        </div>
      </main>

      <footer className="p-6 text-center text-gray-400">
        <p>© {currentYear} PrepTrack. All rights reserved.</p>
      </footer>
    </div>
  );
}
