/**
 * Best-effort spam-skydd för lead-formulären (M2). Två lager utöver honeypot:
 *  1. Min-ifyllnadstid — bots skickar direkt; människor tar sekunder.
 *  2. In-memory per-IP rate-limit — fångar uppenbara flooder på en varm instans.
 *
 * OBS: Map:en lever i modulscope = per serverinstans. På Vercel är den inte
 * durabel över cold starts / horisontell skalning. Uppgradera till Upstash Redis
 * om spam blir ett verkligt problem. Här räcker det för trafiknivån.
 */

const MIN_IFYLLNAD_MS = 1500;
const FONSTER_MS = 10 * 60 * 1000; // 10 min
const MAX_PER_FONSTER = 5;

const traffar = new Map<string, number[]>();

/**
 * Sant om formuläret fylldes i misstänkt snabbt. Endast när klienten satte `dt`
 * (JS på) — saknas det hoppar vi kontrollen så no-JS-submits (progressive
 * enhancement) inte blockeras.
 */
export function forSnabb(dt: FormDataEntryValue | null): boolean {
  if (dt == null || dt === "") return false;
  const n = Number(dt);
  return Number.isFinite(n) && n < MIN_IFYLLNAD_MS;
}

/** Registrerar en (giltig) inskickning och returnerar true om IP:t är över gränsen. */
export function rateLimitad(ip: string): boolean {
  const nu = Date.now();
  const lista = (traffar.get(ip) ?? []).filter((t) => nu - t < FONSTER_MS);
  if (lista.length >= MAX_PER_FONSTER) {
    traffar.set(ip, lista);
    return true;
  }
  lista.push(nu);
  traffar.set(ip, lista);
  return false;
}
