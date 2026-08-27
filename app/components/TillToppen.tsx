"use client";

import { useEffect, useState } from "react";

/**
 * Lowkey "till toppen"-knapp: liten cirkel med pil upp, fast nere till höger.
 * Tonar in först när man scrollat en bit, scrollar mjukt upp vid klick.
 */
export default function TillToppen() {
  const [visa, setVisa] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisa(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Till toppen"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line-strong bg-card/90 text-mist shadow-lg backdrop-blur transition-all hover:text-linen active:scale-95 ${
        visa ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12 19V5M6 11l6-6 6 6"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
