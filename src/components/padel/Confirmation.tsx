"use client";

import { useState } from "react";
import Link from "next/link";
import { EVENT } from "@/lib/padel/config";
import type { Registration } from "@/lib/padel/registration";
import { BouncingBall, CourtLines } from "./Visuals";

type Player = Pick<Registration, "fullName" | "age" | "university" | "partnerName">;

function toIcsDate(date: Date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

/** Genera y descarga un .ics. Solo es posible cuando la fecha está confirmada. */
function downloadCalendarFile(startsAt: string) {
  const start = new Date(startsAt);
  const end = new Date(start.getTime() + EVENT.durationHours * 3_600_000);
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ICADE vs CUNEF//Padel Cup//ES",
    "BEGIN:VEVENT",
    `UID:padel-cup-${start.getTime()}@icade-vs-cunef`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    `SUMMARY:${EVENT.name}`,
    "DESCRIPTION:Torneo + Tardeo con DJ + 2 copas. Pareja ICADE vs Pareja CUNEF.",
    ...(EVENT.venue ? [`LOCATION:${EVENT.venue.replace(/[,;]/g, "\\$&")}`] : []),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "icade-vs-cunef-padel-cup.ics";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Confirmation({ player }: { player: Player }) {
  const [shareState, setShareState] = useState<"idle" | "copied" | "error">("idle");

  async function share() {
    const url = window.location.origin;
    const text = `Yo ya represento a ${player.university} en la ICADE vs CUNEF — Padel Cup 🎾 ¿Y tú? Torneo + DJ + 2 copas.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: EVENT.name, text, url });
        return;
      }
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShareState("copied");
    } catch (err) {
      // Cerrar el menú de compartir no es un error.
      if (err instanceof DOMException && err.name === "AbortError") return;
      setShareState("error");
    }
  }

  return (
    <main className="grain relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-court px-4 py-16 text-white">
      <CourtLines className="absolute inset-0 -z-10 h-full w-full" strokeOpacity={0.14} />
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center">
          <BouncingBall className="h-10 w-10" />
        </div>
        <h1 className="font-display animate-fade-up mt-6 text-[clamp(56px,16vw,96px)]">🔥 Estás dentro</h1>
        <p className="animate-fade-up mt-3 text-lg text-white/80 [animation-delay:120ms]">
          Tu plaza para ICADE vs CUNEF está confirmada.
        </p>

        <div className="animate-fade-up mt-8 overflow-hidden rounded-3xl bg-paper text-left text-ink [animation-delay:200ms]">
          <dl className="divide-y divide-ink/5 px-5">
            {[
              ["Jugador", player.fullName],
              ["Edad", String(player.age)],
              ["Universidad", player.university],
              ["Pareja", player.partnerName],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-[12px] font-bold uppercase tracking-[0.14em] text-ink/50">{label}</dt>
                <dd className="text-right font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="bg-ink px-5 py-4 text-center text-sm font-bold uppercase tracking-[0.1em] text-white">
            🎾 Torneo + 🎧 Tardeo con DJ + 🥂 2 copas
          </p>
        </div>

        <p className="mt-5 text-sm text-white/70">
          Recuerda: <strong className="text-white">{player.partnerName}</strong> también tiene que comprar su entrada
          eligiendo {player.university}.
        </p>

        <div className="mt-8 grid gap-3">
          {EVENT.startsAt ? (
            <button type="button" onClick={() => downloadCalendarFile(EVENT.startsAt!)} className="btn-ball min-h-14 w-full">
              📅 Añadir al calendario
            </button>
          ) : (
            <button type="button" disabled className="btn-ball min-h-14 w-full cursor-not-allowed opacity-40">
              📅 Añadir al calendario · fecha por confirmar
            </button>
          )}
          <button
            type="button"
            onClick={share}
            className="btn-ghost min-h-14 w-full border-white/25 text-white hover:border-white hover:bg-white/5"
          >
            {shareState === "copied" ? "✓ Enlace copiado" : "Compartir"}
          </button>
          {shareState === "error" && (
            <p className="text-sm text-white/70">No se ha podido compartir. Copia el enlace de esta web y pásalo.</p>
          )}
        </div>

        <Link href="/" className="mt-8 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-white/50 hover:text-white">
          ← Volver a la web
        </Link>
      </div>
    </main>
  );
}
