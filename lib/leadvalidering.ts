/**
 * Delad lead-validering (M2). Dependency-fri — samma regler används på klient
 * (snabb feedback) och server (auktoritativt). Varje `validera*`-funktion
 * returnerar ett felmeddelande på svenska, eller `null` om fältet är giltigt.
 */

/** Trimmar och kollapsar whitespace. */
export function sanera(v: string): string {
  return v.trim().replace(/\s+/g, " ");
}

/** Regnr → versaler utan mellanslag/bindestreck (för lagring + jämförelse). */
export function saneraRegnr(v: string): string {
  return v.toUpperCase().replace(/[^0-9A-ZÅÄÖ]/g, "");
}

/** Telefon → endast siffror, med bevarat inledande +. */
export function saneraTelefon(v: string): string {
  const t = v.trim();
  const plus = t.startsWith("+");
  return (plus ? "+" : "") + t.replace(/[^\d]/g, "");
}

/**
 * Svenskt registreringsnummer: 3 bokstäver + 3 tecken där sista får vara
 * siffra (gammalt ABC123) eller bokstav (nytt ABC12X). Saneras först.
 */
export function valideraRegnr(v: string): string | null {
  const r = saneraRegnr(v);
  if (!r) return "Fyll i registreringsnummer.";
  if (!/^[A-ZÅÄÖ]{3}\d{2}[\dA-ZÅÄÖ]$/.test(r))
    return "Ange ett giltigt registreringsnummer, t.ex. ABC12X.";
  return null;
}

/**
 * Svenskt telefonnummer. Accepterar 0… och +46…; normaliserar +46 → 0 och
 * kräver 9–10 siffror (mobil 10, fasta 9).
 */
export function valideraTelefon(v: string): string | null {
  let t = saneraTelefon(v);
  if (!t) return "Fyll i telefonnummer.";
  if (t.startsWith("+46")) t = "0" + t.slice(3);
  if (!/^0\d{8,9}$/.test(t))
    return "Ange ett giltigt telefonnummer, t.ex. 073-302 90 19.";
  return null;
}

/** E-post — enkel men praktisk kontroll. */
export function valideraEpost(v: string): string | null {
  const e = v.trim();
  if (!e) return "Fyll i e-postadress.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return "Ange en giltig e-postadress.";
  return null;
}

/** Obligatoriskt frittextfält. */
export function valideraObligatorisk(v: string, falt: string): string | null {
  if (!v.trim()) return `Fyll i ${falt}.`;
  return null;
}

/** Miltal — endast siffror, rimligt intervall. */
export function valideraMiltal(v: string): string | null {
  const m = v.replace(/[^\d]/g, "");
  if (!m) return "Fyll i miltal.";
  if (Number(m) > 100000) return "Ange miltal i mil (inte km).";
  return null;
}

/* ------------------------------------------------------------------ *
 * Formatering för visning (live i inputfält + i lead-mejlet). Gör värdena
 * lättlästa så både kund och Simon ser tydligt vad som står. Idempotenta —
 * kan köras på redan formaterad text.
 * ------------------------------------------------------------------ */

/** Regnr → versaler + mellanslag efter 3 tecken: "ABC12X" → "ABC 12X". */
export function formateraRegnr(v: string): string {
  const r = saneraRegnr(v).slice(0, 6);
  return r.length > 3 ? `${r.slice(0, 3)} ${r.slice(3)}` : r;
}

/** Heltal med tusentalsmellanslag: "185000" → "185 000". */
export function formateraTal(v: string): string {
  const d = v.replace(/\D/g, "");
  if (!d) return "";
  return d.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** Svenskt telefonnummer, grupperat: "0701990600" → "070-199 06 00". */
export function formateraTelefon(v: string): string {
  const plus = v.trim().startsWith("+");
  let d = v.replace(/\D/g, "");
  if (plus && d.startsWith("46")) d = "0" + d.slice(2); // +46 → 0 för visning
  d = d.slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
  if (d.length <= 8) return `${d.slice(0, 3)}-${d.slice(3, 6)} ${d.slice(6)}`;
  return `${d.slice(0, 3)}-${d.slice(3, 6)} ${d.slice(6, 8)} ${d.slice(8)}`;
}
