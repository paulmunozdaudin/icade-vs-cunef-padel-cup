// =============================================================================
// Emparejamiento de jugadores y cruces ICADE 🆚 CUNEF
// =============================================================================
// Reglas del torneo:
//   1. Una pareja son dos jugadores de LA MISMA universidad que se han
//      nombrado mutuamente al comprar su entrada.
//   2. Cada partido enfrenta SIEMPRE a una pareja ICADE contra una pareja
//      CUNEF. Nunca ICADE vs ICADE ni CUNEF vs CUNEF.
// =============================================================================

import type { University } from "./config";
import { normalizeName, type Registration } from "./registration";

export interface PaidRegistration extends Registration {
  /** Id de la sesión de pago (Stripe) o de la fila en la base de datos. */
  id: string;
  /** Momento del pago, en ms desde epoch. */
  paidAt: number;
}

export interface Pair<U extends University = University> {
  university: U;
  players: [PaidRegistration, PaidRegistration];
}

/** Un partido: por construcción, un lado es ICADE y el otro CUNEF. */
export interface Matchup {
  icade: Pair<"ICADE">;
  cunef: Pair<"CUNEF">;
}

export type ConflictReason =
  /** Se han nombrado mutuamente pero son de universidades distintas. */
  | "mixed-universities"
  /** Tu pareja existe, pero ha puesto a otra persona como pareja. */
  | "partner-chose-someone-else"
  /** Hay varias entradas con el mismo nombre: revisar a mano. */
  | "duplicate-name";

export interface Conflict {
  reason: ConflictReason;
  registrations: PaidRegistration[];
}

export interface PairingResult {
  pairs: Pair[];
  /** Han pagado pero su pareja todavía no ha comprado su entrada. */
  waitingForPartner: PaidRegistration[];
  conflicts: Conflict[];
}

/** Agrupa las entradas pagadas en parejas válidas (misma universidad). */
export function buildPairs(registrations: PaidRegistration[]): PairingResult {
  const byName = new Map<string, PaidRegistration[]>();
  for (const reg of registrations) {
    const key = normalizeName(reg.fullName);
    byName.set(key, [...(byName.get(key) ?? []), reg]);
  }

  const pairs: Pair[] = [];
  const waitingForPartner: PaidRegistration[] = [];
  const conflicts: Conflict[] = [];
  const done = new Set<string>();

  for (const [, sameName] of byName) {
    if (sameName.length > 1) {
      conflicts.push({ reason: "duplicate-name", registrations: sameName });
      sameName.forEach((reg) => done.add(reg.id));
    }
  }

  const sorted = [...registrations].sort((a, b) => a.paidAt - b.paidAt);
  for (const player of sorted) {
    if (done.has(player.id)) continue;

    const candidates = (byName.get(normalizeName(player.partnerName)) ?? []).filter(
      (reg) => !done.has(reg.id),
    );
    const partner = candidates[0];

    if (!partner) {
      waitingForPartner.push(player);
      done.add(player.id);
      continue;
    }

    const mutual = normalizeName(partner.partnerName) === normalizeName(player.fullName);
    if (!mutual) {
      // El compañero se evaluará por su cuenta; aquí solo marcamos a este jugador.
      conflicts.push({ reason: "partner-chose-someone-else", registrations: [player, partner] });
      done.add(player.id);
      continue;
    }

    done.add(player.id);
    done.add(partner.id);

    if (player.university !== partner.university) {
      conflicts.push({ reason: "mixed-universities", registrations: [player, partner] });
      continue;
    }

    pairs.push({ university: player.university, players: [player, partner] });
  }

  return { pairs, waitingForPartner, conflicts };
}

function isUniversityPair<U extends University>(university: U) {
  return (pair: Pair): pair is Pair<U> => pair.university === university;
}

/**
 * Cruza parejas ICADE contra parejas CUNEF (primera ronda). Las parejas que
 * sobran en la universidad con más inscritos quedan en `withoutRival` para
 * que la organización decida (esperar más inscripciones, doble partido...).
 */
export function buildMatchups(pairs: Pair[]): { matchups: Matchup[]; withoutRival: Pair[] } {
  const icade = pairs.filter(isUniversityPair("ICADE"));
  const cunef = pairs.filter(isUniversityPair("CUNEF"));
  const count = Math.min(icade.length, cunef.length);

  const matchups: Matchup[] = [];
  for (let i = 0; i < count; i++) matchups.push({ icade: icade[i], cunef: cunef[i] });

  return { matchups, withoutRival: [...icade.slice(count), ...cunef.slice(count)] };
}

/**
 * Comprobación ANTES de cobrar: ¿la pareja que indica este jugador ya compró
 * su entrada representando a la otra universidad? Si es así, la compra se
 * bloquea para que nunca exista una pareja mixta.
 */
export function findUniversityClash(
  incoming: Pick<Registration, "fullName" | "partnerName" | "university">,
  existing: PaidRegistration[],
): string | null {
  const partnerKey = normalizeName(incoming.partnerName);
  const selfKey = normalizeName(incoming.fullName);

  const partner = existing.find((reg) => normalizeName(reg.fullName) === partnerKey);
  if (partner && partner.university !== incoming.university) {
    return `${partner.fullName} ya tiene entrada representando a ${partner.university}. Las parejas deben ser de la misma universidad: elige ${partner.university} o cambia de pareja.`;
  }

  const namedMe = existing.find(
    (reg) => normalizeName(reg.partnerName) === selfKey && reg.university !== incoming.university,
  );
  if (namedMe) {
    return `${namedMe.fullName} te ha indicado como pareja representando a ${namedMe.university}. Las parejas deben ser de la misma universidad.`;
  }

  return null;
}
