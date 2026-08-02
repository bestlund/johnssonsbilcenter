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
