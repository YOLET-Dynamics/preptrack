"use client";
import React, { useEffect, useRef, useState } from "react";

const concepts = [
  "Dosimetry",
  "Treatment Planning",
  "Brachytherapy",
  "IMRT",
  "VMAT",
  "Quality Assurance",
  "Patient Safety",
  "Radiation Physics",
  "Anatomy",
  "Radiobiology",
  "CT Simulation",
  "MRI Fusion",
  "Electron Therapy",
  "Stereotactic",
  "Image-Guided RT",
];

const ScrollingConcepts: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [centeredIndex, setCenteredIndex] = useState<number | null>(null);
  const duplicatedConcepts = [...concepts, ...concepts];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const scroll = () => {
      scrollPosition += scrollSpeed;
      if (scrollPosition >= container.scrollWidth / 2) {
        scrollPosition = 0;
      }
      container.style.transform = `translateX(-${scrollPosition}px)`;

      const containerRect = container.parentElement?.getBoundingClientRect();
      if (containerRect) {
        const centerX = containerRect.left + containerRect.width / 2;
        const children = container.children;
        let closestIndex: number | null = null;
        let closestDistance = Infinity;

        for (let i = 0; i < children.length; i++) {
          const childRect = children[i].getBoundingClientRect();
          const childCenterX = childRect.left + childRect.width / 2;
          const distance = Math.abs(childCenterX - centerX);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = i;
          }
        }
        if (closestIndex !== null) {
          setCenteredIndex(closestIndex % concepts.length);
        }
      }

      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden py-6 mt-16 md:mt-20">
      <div ref={containerRef} className="relative flex whitespace-nowrap">
        {duplicatedConcepts.map((concept, index) => (
          <span
            key={index}
            className={`text-sm mx-4 font-dm-sans transition-all duration-300 ease-in-out ${
              index === centeredIndex
                ? "text-brand-green font-semibold scale-110"
                : "text-brand-indigo/40"
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
