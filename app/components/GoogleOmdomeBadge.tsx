"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { GoogleOmdomen } from "@/lib/googleReviews";

const ROTATION_MS = 7000;
const MAX_TECKEN = 150;

// Googles flerfärgade "G" — attribution.
function GoogleG({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.06L5.84 9.9C6.71 7.3 9.14 4.75 12 4.75z"
      />
    </svg>
  );
}

function Stjarnor() {
  return (
    <div className="flex gap-0.5 text-amber" role="img" aria-label="4,9 av 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path d="M10 1.6l2.5 5.1 5.6.8-4 4 1 5.6L10 14.5 4.9 17.1l1-5.6-4-4 5.6-.8L10 1.6z" />
        </svg>
      ))}
    </div>
  );
}

function korta(text: string) {
  if (text.length <= MAX_TECKEN) return text;
  return text.slice(0, MAX_TECKEN).replace(/\s+\S*$/, "") + "…";
}

/**
 * Betygsbadge + roterande citat för hero-kolumnen. Data hämtas server-side
 * (lib/googleReviews) och skickas in — den här komponenten sköter bara
 * rotationen (klient). Pausar vid hover; fade-animationen respekterar
 * prefers-reduced-motion via den globala regeln i globals.css.
 */
export default function GoogleOmdomeBadge({
  data,
  visaCitat = true,
  centrerad = false,
}: {
  data: GoogleOmdomen;
  /** Visa det roterande citat-kortet + prickar (av: bara betygsbadgen). */
  visaCitat?: boolean;
  /** Centrera badgen (utan vänsterankrad nedskalning) i stället för A:s vänsterläge. */
  centrerad?: boolean;
}) {
  const { betyg, antal, lank, recensioner } = data;
  const [i, setI] = useState(0);
  const [pausad, setPausad] = useState(false);

  useEffect(() => {
    if (pausad || recensioner.length < 2) return;
    const id = setInterval(
      () => setI((v) => (v + 1) % recensioner.length),
      ROTATION_MS,
    );
    return () => clearInterval(id);
  }, [pausad, recensioner.length]);

  const betygText = betyg.toLocaleString("sv-SE", { minimumFractionDigits: 1 });
  const aktuell = recensioner[i];

  return (
    <div
      className={
        centrerad
          ? "mt-10 flex flex-col items-center"
          : "mt-12 max-w-md origin-top-left scale-[0.8]"
      }
      onMouseEnter={() => setPausad(true)}
      onMouseLeave={() => setPausad(false)}
    >
      {/* Aggregat — länkar till alla omdömen på Google */}
      <a
        href={lank}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <GoogleG className="h-5 w-5" />
        <Stjarnor />
        <span className="text-sm font-semibold text-linen">{betygText}</span>
        <span className="text-sm text-mist">· {antal} omdömen</span>
      </a>

      {/* Roterande citat — ej klickbart (kortet), betygsbadgen ovan länkar till Google */}
      {visaCitat && aktuell && (
        <div className="mt-3 rounded-lg border border-line bg-card/60 p-4">
          <figure key={i} className="animate-fade">
            <blockquote className="text-sm leading-relaxed text-mist">
              &ldquo;{korta(aktuell.text)}&rdquo;
            </blockquote>
            <figcaption className="mt-3 flex items-center gap-2.5">
              {aktuell.avatarUrl ? (
                <Image
                  src={aktuell.avatarUrl}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 shrink-0 rounded-full"
                  unoptimized
                />
              ) : (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-elevated text-[10px] font-semibold text-cobalt-400">
                  {aktuell.forfattare.slice(0, 1)}
                </span>
              )}
              <span className="text-xs text-fog">
                <span className="font-medium text-linen">
                  {aktuell.forfattare}
                </span>
                {aktuell.nar ? ` · ${aktuell.nar}` : ""}
              </span>
            </figcaption>
          </figure>
        </div>
      )}

      {/* Rotationsprickar */}
      {visaCitat && recensioner.length > 1 && (
        <div className="mt-3 flex gap-1.5">
          {recensioner.map((_, n) => (
            <button
              key={n}
              type="button"
              aria-label={`Visa omdöme ${n + 1}`}
              onClick={() => setI(n)}
              className={`h-1.5 rounded-full transition-all ${
                n === i ? "w-4 bg-cobalt-500" : "w-1.5 bg-line-strong"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
