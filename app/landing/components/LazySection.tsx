"use client";
import React, { useState, useEffect, useRef } from "react";

interface LazySectionProps {
  children: React.ReactNode;
  id: string;
  className?: string;
}

export const LazySection: React.FC<LazySectionProps> = ({
  children,
  id,
  className = "",
}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect(); // Once loaded, keep it mounted
        }
      },
      {
        rootMargin: "500px 0px", // Preload when within 500px of viewport
        threshold: 0.0,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      id={id}
      className={`w-full relative ${className}`}
    >
      {isInView ? children : <div className="min-h-screen w-full" />}
    </div>
  );
};

export default LazySection;
