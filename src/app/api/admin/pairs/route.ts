import { timingSafeEqual } from "node:crypto";
import { buildMatchups, buildPairs } from "@/lib/padel/pairing";
import { isStripeConfigured, listPaidRegistrations } from "@/lib/padel/stripe";

function authorized(request: Request): boolean {
  const token = process.env.ADMIN_TOKEN;
  const header = request.headers.get("authorization") ?? "";
  if (!token || !header.startsWith("Bearer ")) return false;
  const given = Buffer.from(header.slice(7));
  const expected = Buffer.from(token);
  return given.length === expected.length && timingSafeEqual(given, expected);
}

/**
 * Para la organización: parejas formadas, jugadores esperando a su pareja,
 * incidencias y cruces de primera ronda (siempre ICADE vs CUNEF).
 *
 *   curl -H "Authorization: Bearer $ADMIN_TOKEN" https://tu-dominio/api/admin/pairs
 */
export async function GET(request: Request) {
  if (!authorized(request)) return new Response("Not found", { status: 404 });
  if (!isStripeConfigured()) {
    return Response.json({ message: "Stripe no está configurado." }, { status: 503 });
  }

  const registrations = await listPaidRegistrations();
  const { pairs, waitingForPartner, conflicts } = buildPairs(registrations);
  const { matchups, withoutRival } = buildMatchups(pairs);

  return Response.json({
    totals: {
      paidTickets: registrations.length,
      pairs: pairs.length,
      icadePairs: pairs.filter((p) => p.university === "ICADE").length,
      cunefPairs: pairs.filter((p) => p.university === "CUNEF").length,
      waitingForPartner: waitingForPartner.length,
      conflicts: conflicts.length,
    },
    matchups,
    withoutRival,
    waitingForPartner,
    conflicts,
  });
}
