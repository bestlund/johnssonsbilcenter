"use client";

import { useEffect, useRef, useState } from "react";
import { BilkortSkelettGrid } from "@/app/components/Skelett";

/**
 * Renderar Nextlease-embedden (/nextlease-embed) i en iframe för att isolera
 * widgetens globala CSS/JS från resten av sajten. Parent-hashen (t.ex.
 * `#/details/{uid}` från våra bilkort) skickas in i iframens URL så deep-links
 * funkar. Höjden autojusteras efter innehållet (samma origin → vi kan mäta det).
 */
export default function NextleaseFrame() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = useState<string>("");
  const [laddar, setLaddar] = useState(true);

  // Spegla parent-hashen till iframens src.
  useEffect(() => {
    const sync = () => setSrc(`/nextlease-embed${window.location.hash}`);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  // Autojustera höjd efter iframens innehåll.
  useEffect(() => {
    const iframe = ref.current;
    if (!iframe || !src) return;
    setLaddar(true);

    let ro: ResizeObserver | undefined;
    const resize = () => {
      const doc = iframe.contentWindow?.document;
      if (doc) iframe.style.height = `${doc.documentElement.scrollHeight}px`;
    };
    const onLoad = () => {
      resize();
      setLaddar(false);
      try {
        const doc = iframe.contentWindow?.document;
        if (doc) {
          ro = new ResizeObserver(resize);
          ro.observe(doc.documentElement);
        }
      } catch {
        /* cross-origin bör ej hända (samma origin) — ignorera tyst */
      }
    };

    iframe.addEventListener("load", onLoad);
    // Extra mätningar för asynkront widget-innehåll (bilder, sen rendering).
    const timers = [500, 1200, 2500].map((t) => window.setTimeout(resize, t));

    return () => {
      iframe.removeEventListener("load", onLoad);
      ro?.disconnect();
      timers.forEach((t) => clearTimeout(t));
    };
  }, [src]);

  return (
    <div className="relative min-h-[600px]">
      {src && (
        <iframe
          ref={ref}
          src={src}
          title="Nextlease – objekt"
          scrolling="no"
          className="w-full transition-opacity duration-300"
          style={{ border: 0, minHeight: 600, opacity: laddar ? 0 : 1 }}
        />
      )}
      {laddar && (
        <div className="absolute inset-0" aria-hidden="true">
          <BilkortSkelettGrid
            antal={6}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          />
        </div>
      )}
    </div>
  );
}
