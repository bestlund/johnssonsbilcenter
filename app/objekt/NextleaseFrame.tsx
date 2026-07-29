"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Renderar Nextlease-embedden (/nextlease-embed) i en iframe för att isolera
 * widgetens globala CSS/JS från resten av sajten. Parent-hashen (t.ex.
 * `#/details/{uid}` från våra bilkort) skickas in i iframens URL så deep-links
 * funkar. Höjden autojusteras efter innehållet (samma origin → vi kan mäta det).
 */
export default function NextleaseFrame() {
  const ref = useRef<HTMLIFrameElement>(null);
  const [src, setSrc] = useState<string>("");

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

    let ro: ResizeObserver | undefined;
    const resize = () => {
      const doc = iframe.contentWindow?.document;
      if (doc) iframe.style.height = `${doc.documentElement.scrollHeight}px`;
    };
    const onLoad = () => {
      resize();
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

  if (!src) return null;

  return (
    <iframe
      ref={ref}
      src={src}
      title="Nextlease – objekt"
      scrolling="no"
      className="w-full"
      style={{ border: 0, minHeight: 600 }}
    />
  );
}
