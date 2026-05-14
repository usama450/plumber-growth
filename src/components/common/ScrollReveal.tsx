"use client";

import { useEffect, useRef } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  type?: "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale-up" | "stagger";
  delay?: number;
  threshold?: number;
}

export function ScrollReveal({
  children,
  className = "",
  type = "fade-up",
  delay = 0,
  threshold = 0.12,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (delay) el.style.animationDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold]);

  const isStagger = type === "stagger";

  return (
    <div
      ref={ref}
      {...(isStagger ? { "data-stagger": "" } : { "data-reveal": type })}
      className={className}
    >
      {children}
    </div>
  );
}
