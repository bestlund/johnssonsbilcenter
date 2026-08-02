/**
 * Delat form-tillstånd för lead-formulären (useActionState). Ligger i en egen
 * modul eftersom en `"use server"`-fil bara får exportera async-funktioner —
 * typer och konstanter måste bo utanför.
 */
export type LeadState = {
  ok: boolean;
  fel: Record<string, string>;
  meddelande: string;
};

export const TOM_LEADSTATE: LeadState = { ok: false, fel: {}, meddelande: "" };
