import { Loader2 } from "lucide-react";

interface FullScreenLoaderProps {
  message?: string;
}

export default function FullScreenLoader({
  message = "Loading...",
}: FullScreenLoaderProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col justify-center items-center z-50">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-lg font-semibold text-foreground">{message}</p>
    </div>
  );
}
