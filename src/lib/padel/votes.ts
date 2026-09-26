// =============================================================================
// Votación "¿Quién domina la pista?" — recuento en Redis (solo servidor)
// =============================================================================
// Funciona con cualquier Redis que se conecte al proyecto desde Vercel
// (Storage -> Create Database):
//   - Upstash for Redis  -> usa KV_REST_API_URL + KV_REST_API_TOKEN (API REST)
//   - Redis (Redis Cloud) -> usa REDIS_URL (conexión TCP)
// También vale si Vercel les pone un prefijo (p. ej. STORAGE_KV_REST_API_URL).
// Sin ninguna, la votación aparece como "se abrirá muy pronto": nunca se
// muestran cifras inventadas.
// =============================================================================

import { createHash } from "node:crypto";
import { createClient } from "redis";
import { UNIVERSITIES, type University } from "./config";

export type VoteCounts = Record<University, number>;
type Command = (string | number)[];

const KEY = (u: University) => `padel-cup:votes:${u}`;
/** Límite anti-bots por IP. Alto a propósito: en el campus mucha gente comparte wifi. */
const MAX_VOTES_PER_IP_PER_HOUR = 60;

/** Busca una variable por su final, admitiendo el prefijo que añada Vercel. */
function envEndingWith(suffix: string): { name: string; value: string } | null {
  const name = Object.keys(process.env)
    .filter((key) => key === suffix || key.endsWith(`_${suffix}`))
    .sort((a, b) => a.length - b.length)[0];
  const value = name ? process.env[name] : undefined;
  return name && value ? { name, value } : null;
}

function restCredentials() {
  for (const [urlSuffix, tokenSuffix] of [
    ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
    ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  ]) {
    const url = envEndingWith(urlSuffix);
    if (!url) continue;
    const prefix = url.name.slice(0, url.name.length - urlSuffix.length);
    const token = process.env[`${prefix}${tokenSuffix}`] ?? envEndingWith(tokenSuffix)?.value;
    if (token) return { url: url.value.replace(/\/$/, ""), token };
  }
  return null;
}

function redisUrl(): string | null {
  const found = envEndingWith("REDIS_URL") ?? envEndingWith("KV_URL");
  return found && /^rediss?:\/\//.test(found.value) ? found.value : null;
}

export function isVotingConfigured(): boolean {
  return restCredentials() !== null || redisUrl() !== null;
}

async function runRest(creds: { url: string; token: string }, commands: Command[]): Promise<unknown[]> {
  const res = await fetch(`${creds.url}/pipeline`, {
    method: "POST",
    headers: { Authorization: `Bearer ${creds.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(commands),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Redis REST ${res.status}`);
  const results = (await res.json()) as { result?: unknown; error?: string }[];
  const failed = results.find((r) => r.error);
  if (failed) throw new Error(`Redis REST: ${failed.error}`);
  return results.map((r) => r.result);
}

// Una conexión TCP reutilizada entre peticiones de la misma función.
const globalForRedis = globalThis as unknown as { padelRedis?: Promise<ReturnType<typeof createClient>> };

function tcpClient(url: string) {
  if (!globalForRedis.padelRedis) {
    const client = createClient({ url, socket: { connectTimeout: 5000 } });
    client.on("error", (err) => console.error("[vote] Redis", err));
    globalForRedis.padelRedis = client.connect().catch((err) => {
      globalForRedis.padelRedis = undefined;
      throw err;
    });
  }
  return globalForRedis.padelRedis;
}

async function pipeline(commands: Command[]): Promise<unknown[]> {
  const rest = restCredentials();
  if (rest) return runRest(rest, commands);

  const url = redisUrl();
  if (!url) throw new Error("Votación sin configurar.");
  const client = await tcpClient(url);
  const results: unknown[] = [];
  for (const command of commands) results.push(await client.sendCommand(command.map(String)));
  return results;
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
