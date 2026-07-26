"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { SokBil } from "./heroVal";

const MAX_TRAFFAR = 6;

function SokIkon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth="1.7"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" />
      <path
        d="m20 20-3.2-3.2"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

const formatPris = (n: number) =>
  n > 0 ? `${n.toLocaleString("sv-SE")} kr` : "";

/**
 * Hero-typeahead. Filtrerar det medskickade lagret (SokBil[]) på klientsidan —
 * ingen extra API-runda — och länkar direkt till bilens detaljvy i Nextlease-
 * widgeten (`/objekt#/details/{uid}`, den enda fungerande deep-linken). "Se alla"
 * går till vår egen browse på /bilar.
 */
export default function HeroSok({ bilar }: { bilar: SokBil[] }) {
  const router = useRouter();
  const rotRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [aktiv, setAktiv] = useState(0);

  const traffar = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    const ord = s.split(/\s+/);
    return bilar
      .map((b) => ({
        b,
        h: `${b.brand} ${b.model} ${b.modelDescription} ${b.modelYear}`.toLowerCase(),
      }))
      .filter(({ h }) => ord.every((o) => h.includes(o)))
      .slice(0, MAX_TRAFFAR)
      .map(({ b }) => b);
  }, [q, bilar]);

  const visa = open && q.trim().length > 0;

  // Nollställ aktiv rad när träffarna ändras.
  useEffect(() => setAktiv(0), [q]);

  // Stäng vid klick utanför.
  useEffect(() => {
    if (!visa) return;
    const stang = (e: MouseEvent) => {
      if (!rotRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", stang);
    return () => document.removeEventListener("mousedown", stang);
  }, [visa]);

  const tillBil = (b: SokBil) => `/objekt#/details/${b.uid}`;

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!visa || traffar.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setAktiv((v) => Math.min(v + 1, traffar.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setAktiv((v) => Math.max(v - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      router.push(tillBil(traffar[aktiv]));
    }
  }

  return (
    <div ref={rotRef} className="relative">
      {/* Sökfält */}
      <div className="flex h-12 items-center gap-3 rounded-lg border border-line-strong bg-card px-4 transition-colors focus-within:border-highlight">
        <SokIkon className="h-5 w-5 shrink-0 text-fog" />
        <input
          type="text"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Sök märke eller modell…"
          role="combobox"
          aria-expanded={visa}
          aria-controls="hero-sok-lista"
          aria-autocomplete="list"
          className="hero-sok-input w-full bg-transparent text-base text-linen outline-none placeholder:text-fog"
        />
      </div>

      {/* Resultat */}
      {visa && (
        <div
          id="hero-sok-lista"
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-lg border border-line bg-card shadow-xl shadow-black/40"
        >
          {traffar.length > 0 ? (
            <ul className="divide-y divide-line" role="listbox">
              {traffar.map((b, idx) => (
                <li key={b.uid} role="option" aria-selected={idx === aktiv}>
                  <Link
                    href={tillBil(b)}
                    onMouseEnter={() => setAktiv(idx)}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between gap-4 px-4 py-3 transition-colors ${
                      idx === aktiv ? "bg-elevated" : ""
                    }`}
                  >
                    <span className="min-w-0 truncate text-sm text-linen">
                      {b.brand} {b.model}
                      {b.modelDescription ? (
                        <span className="text-mist"> {b.modelDescription}</span>
                      ) : null}
                    </span>
                    <span className="data shrink-0 text-xs text-mist">
                      {b.modelYear}
                      {formatPris(b.price) ? ` · ${formatPris(b.price)}` : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-3 text-sm text-mist">
              Inga träffar på &ldquo;{q.trim()}&rdquo;
            </p>
          )}

          {/* Escape-lucka till hela lagret (Nextlease kan ej förfiltreras via URL) */}
          <Link
            href="/bilar"
            onClick={() => setOpen(false)}
            className="flex items-center justify-between border-t border-line px-4 py-3 text-sm font-medium text-cobalt-400 transition-colors hover:bg-elevated"
          >
            Se alla bilar i lager
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
