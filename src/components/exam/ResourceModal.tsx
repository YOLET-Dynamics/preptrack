import clsx from "clsx";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Markdown from "react-markdown";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Define a type for the resource items if not already defined globally
interface ResourceItem {
  id: string; // Assuming resources have an ID
  type: string; // Or other types as needed
  resource_url?: string; // URL for image type
  content?: string; // Content for text type (Markdown)
}

interface ResourceModalProps {
  visible: boolean;
  onClose: () => void;
  resources?: ResourceItem[];
}

const ResourceModal = ({
  visible,
  onClose,
  resources = [], // Default to empty array
}: ResourceModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset index when modal opens or resources change
  useState(() => {
    if (visible) {
      setCurrentIndex(0);
    }
  });

  if (!visible || resources.length === 0) return null;

  const currentResource = resources[currentIndex];

  const handleNext = () => {
    if (currentIndex < resources.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Use Shadcn Dialog component
  return (
    <Dialog open={visible} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Resource {currentIndex + 1} of {resources.length}
          </DialogTitle>
          {/* Close button is usually part of DialogContent in shadcn */}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-4 my-4 border rounded-md min-h-[200px] flex items-center justify-center">
          {currentResource.type === "image" && currentResource.resource_url ? (
            <Image
              src={currentResource.resource_url}
              alt={`Resource ${currentIndex + 1}`}
              width={500} // Adjust size as needed
              height={400} // Adjust size as needed
              className="rounded-lg object-contain max-w-full max-h-[60vh]"
            />
          ) : currentResource.type === "text" && currentResource.content ? (
            <div className="prose dark:prose-invert max-w-none">
              <Markdown>{currentResource.content}</Markdown>
            </div>
          ) : (
            <p className="text-muted-foreground">Invalid resource format.</p>
          )}
        </div>

        {resources.length > 1 && (
          <DialogFooter className="flex justify-between w-full">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentIndex === resources.length - 1}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResourceModal;
