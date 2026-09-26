import { cookies } from "next/headers";
import { UNIVERSITIES, type University } from "@/lib/padel/config";
import { addVote, getVoteCounts, isVotingConfigured } from "@/lib/padel/votes";

const COOKIE = "padel_cup_vote";

async function myVote(): Promise<University | null> {
  const value = (await cookies()).get(COOKIE)?.value;
  return UNIVERSITIES.includes(value as University) ? (value as University) : null;
}

/** Recuento actual + el voto de este navegador (si ya votó). */
export async function GET() {
  if (!isVotingConfigured()) return Response.json({ enabled: false, reason: "not-configured" });
  try {
    return Response.json({ enabled: true, counts: await getVoteCounts(), myVote: await myVote() });
  } catch (err) {
    console.error("[vote] Error leyendo votos", err);
    return Response.json({ enabled: false, reason: "error" }, { status: 502 });
  }
}

/** Un voto por navegador. Body: { "university": "ICADE" | "CUNEF" } */
export async function POST(request: Request) {
  if (!isVotingConfigured()) return Response.json({ enabled: false }, { status: 503 });

  const body = await request.json().catch(() => null);
  const university = body?.university;
  if (!UNIVERSITIES.includes(university)) {
    return Response.json({ message: "Elige ICADE o CUNEF." }, { status: 400 });
  }

  try {
    const previous = await myVote();
    if (previous) {
      return Response.json({ enabled: true, counts: await getVoteCounts(), myVote: previous }, { status: 409 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const counts = await addVote(university, ip);
    if (!counts) {
      return Response.json({ message: "Demasiados votos desde esta red. Prueba en un rato." }, { status: 429 });
    }

    (await cookies()).set(COOKIE, university, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return Response.json({ enabled: true, counts, myVote: university });
  } catch (err) {
    console.error("[vote] Error guardando voto", err);
    return Response.json({ message: "No se pudo guardar tu voto." }, { status: 502 });
  }
}
