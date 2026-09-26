// =============================================================================
// Votación "¿Quién domina la pista?" — recuento en Upstash Redis (solo servidor)
// =============================================================================
// Se activa al conectar una base de datos Upstash Redis al proyecto en Vercel
// (Storage -> Upstash -> Redis). Vercel crea las variables KV_REST_API_URL y
// KV_REST_API_TOKEN automáticamente. Sin ellas, la votación aparece como
// "se abrirá muy pronto": nunca se muestran cifras inventadas.
// =============================================================================

import { createHash } from "node:crypto";
import { UNIVERSITIES, type University } from "./config";

export type VoteCounts = Record<University, number>;

const KEY = (u: University) => `padel-cup:votes:${u}`;
/** Límite anti-bots por IP. Alto a propósito: en el campus mucha gente comparte wifi. */
const MAX_VOTES_PER_IP_PER_HOUR = 60;

function credentials() {
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url: url.replace(/\/$/, ""), token } : null;
}

export function isVotingConfigured(): boolean {
  return credentials() !== null;
}

async function pipeline(commands: (string | number)[][]): Promise<unknown[]> {
  const creds = credentials();
  if (!creds) throw new Error("Votación sin configurar.");
  const res = await fetch(`${creds.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${creds.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Upstash ${res.status}`);
  const results = (await res.json()) as { result?: unknown; error?: string }[];
  const failed = results.find((r) => r.error);
  if (failed) throw new Error(`Upstash: ${failed.error}`);
  return results.map((r) => r.result);
}

export async function getVoteCounts(): Promise<VoteCounts> {
  const [values] = await pipeline([["MGET", ...UNIVERSITIES.map(KEY)]]);
  const list = values as (string | null)[];
  return { ICADE: Number(list[0] ?? 0), CUNEF: Number(list[1] ?? 0) };
}

/** Suma un voto. Devuelve `null` si esa IP ha superado el límite. */
export async function addVote(university: University, ip: string): Promise<VoteCounts | null> {
  const ipKey = `padel-cup:vote-ip:${createHash("sha256").update(ip).digest("hex").slice(0, 32)}`;
  const [attempts] = await pipeline([
    ["INCR", ipKey],
    ["EXPIRE", ipKey, 3600, "NX"],
  ]);
  if (Number(attempts) > MAX_VOTES_PER_IP_PER_HOUR) return null;

  await pipeline([["INCR", KEY(university)]]);
  return getVoteCounts();
}
