import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const WORDS = ["accurate", "found", "synced", "listed", "trusted"] as const;
const LONGEST_CH = Math.max(...WORDS.map((w) => w.length));

export function RotateWord() {
  const ref = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const [motion, setMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;
    let timer: number | undefined;
    const sync = () => {
      window.clearInterval(timer);
      timer = undefined;
      if (media.matches) {
        setMotion(false);
        setIndex(0);
      } else if (visible && !document.hidden) {
        timer = window.setInterval(() => {
          // The initial heading is already visible. Animate only subsequent words.
          setMotion(true);
          setIndex((i) => (i + 1) % WORDS.length);
        }, 2400);
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    if (ref.current) observer.observe(ref.current);
    media.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      media.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  const word = WORDS[index];
  // Reserve width without duplicating heading text in the DOM.
  return (
    <span ref={ref} className="inline-block text-center italic text-brand" style={{ minWidth: `${LONGEST_CH}ch` }}>
      <span key={word} className={cn(motion && "animate-word-in")}>{word}</span>
    </span>
  );
}
