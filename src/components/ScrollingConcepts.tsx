import React, { useState, useRef, useEffect, useCallback } from "react";

const concepts = [
  "Brachytherapy",
  "IMRT",
  "VMAT",
  "SBRT",
  "Proton Therapy",
  "Gamma Knife",
  "CyberKnife",
  "Linear Accelerator",
  "Treatment Planning",
  "Dosimetry",
  "Radiation Safety",
  "Clinical Trials",
  "Radiobiology",
  "Patient Positioning",
  "Image-Guided RT",
];

const duplicatedConcepts = [...concepts, ...concepts];

const ScrollingConcepts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const [centeredIndex, setCenteredIndex] = useState<number | null>(null);
  const scrollWidthRef = useRef<number>(0);

  const animationDuration = 30000;

  const calculateCenter = useCallback((translateX: number) => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const parentElement = container.parentElement;
    if (!parentElement) return;

    const containerVisibleWidth = parentElement.offsetWidth;
    const containerCenter = containerVisibleWidth / 2;

    let minDistance = Infinity;
    let closestIndex = -1;

    Array.from(container.children).forEach((child, index) => {
      if (child instanceof HTMLElement) {
        const childVisualCenter =
          child.offsetLeft + translateX + child.offsetWidth / 2;
        const distance = Math.abs(childVisualCenter - containerCenter);

        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      }
    });

    setCenteredIndex((prevIndex) =>
      prevIndex !== closestIndex ? closestIndex : prevIndex
    );
  }, []);

  const animate = useCallback(
    (timestamp: number) => {
      if (!containerRef.current || scrollWidthRef.current === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      if (startTimeRef.current === undefined) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current;
      const progress = (elapsed / animationDuration) % 1;

      const translateX = -progress * scrollWidthRef.current;
      containerRef.current.style.transform = `translateX(${translateX}px)`;

      calculateCenter(translateX);

      animationFrameRef.current = requestAnimationFrame(animate);
    },
    [animationDuration, calculateCenter]
  );

  useEffect(() => {
    let isMounted = true;
    const calculateWidthAndStartAnimation = () => {
      if (!containerRef.current || !isMounted) return;

      const children = Array.from(containerRef.current.children);
      if (children.length > concepts.length) {
        let totalWidth = 0;
        const firstHalfChildren = children.slice(0, concepts.length);
        firstHalfChildren.forEach((child) => {
          if (child instanceof HTMLElement) {
            const style = window.getComputedStyle(child);
            const marginLeft = parseFloat(style.marginLeft);
            const marginRight = parseFloat(style.marginRight);
            totalWidth += child.offsetWidth + marginLeft + marginRight;
          }
        });
        scrollWidthRef.current = totalWidth;

        startTimeRef.current = undefined;
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    };

    const timeoutId = setTimeout(calculateWidthAndStartAnimation, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animate, concepts.length]);

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden py-4 mt-12 md:mt-16">
      <div ref={containerRef} className="relative flex whitespace-nowrap">
        {duplicatedConcepts.map((concept, index) => (
          <span
            key={index}
            className={`text-sm mx-4 font-funnel-sans transition-colors duration-300 ease-in-out ${
              index === centeredIndex
                ? "text-cyan-500 font-semibold"
                : "text-gray-400"
            }`}
          >
            {concept}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ScrollingConcepts;
