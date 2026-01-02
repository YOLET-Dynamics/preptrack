import { Loader2 } from "lucide-react";

interface FullScreenLoaderProps {
  message?: string;
}

export default function FullScreenLoader({
  message = "Loading...",
}: FullScreenLoaderProps) {
  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm flex flex-col justify-center items-center z-50">
      <div className="relative">
        <div className="absolute inset-0 bg-brand-green/20 rounded-full blur-xl animate-pulse" />
        <Loader2 className="h-12 w-12 animate-spin text-brand-green relative z-10" />
      </div>
      <p className="text-lg font-semibold text-brand-indigo font-inter mt-6">{message}</p>
    </div>
  );
}
