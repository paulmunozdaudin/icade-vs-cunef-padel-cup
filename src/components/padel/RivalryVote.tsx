"use client";

import { useEffect, useState } from "react";
import type { University } from "@/lib/padel/config";
import { PlayerIcon } from "./Visuals";

type Counts = Record<University, number>;
type State =
  | { status: "loading" }
  | { status: "disabled" }
  | { status: "ready"; counts: Counts; myVote: University | null };

const TONES: Record<University, string> = { ICADE: "bg-ink", CUNEF: "bg-court" };

function percent(counts: Counts, u: University) {
  const total = counts.ICADE + counts.CUNEF;
  return total === 0 ? 50 : Math.round((counts[u] / total) * 100);
}

export default function RivalryVote() {
  const [state, setState] = useState<State>({ status: "loading" });
  const [pending, setPending] = useState<University | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/vote", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) =>
        setState(data.enabled ? { status: "ready", counts: data.counts, myVote: data.myVote } : { status: "disabled" }),
      )
      .catch(() => setState({ status: "disabled" }));
  }, []);

  async function vote(university: University) {
    if (state.status !== "ready" || state.myVote || pending) return;
    setPending(university);
    setError(null);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ university }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.counts) setState({ status: "ready", counts: data.counts, myVote: data.myVote });
      else setError(data.message ?? "No se pudo guardar tu voto. Inténtalo otra vez.");
    } catch {
      setError("Sin conexión. Inténtalo otra vez.");
    }
    setPending(null);
  }

  const ready = state.status === "ready";
  const voted = ready ? state.myVote : null;
  const total = ready ? state.counts.ICADE + state.counts.CUNEF : 0;

  const card = (u: University) => {
    const mine = voted === u;
    const pct = ready && voted ? percent(state.counts, u) : null;
    return (
      <button
        type="button"
        onClick={() => vote(u)}
        disabled={!ready || Boolean(voted) || pending !== null}
        aria-pressed={mine}
        className={`${TONES[u]} group relative flex flex-1 flex-col items-center rounded-3xl px-3 py-7 text-white shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] outline-none transition duration-300 sm:py-10 ${
          ready && !voted ? "cursor-pointer hover:-translate-y-1 focus-visible:ring-4 focus-visible:ring-ball" : "cursor-default"
        } ${mine ? "ring-4 ring-ball" : ""} ${voted && !mine ? "opacity-70" : ""}`}
      >
        <span className="flex gap-1.5 text-white/85">
          <PlayerIcon className="h-7 w-7 sm:h-9 sm:w-9" />
          <PlayerIcon className="h-7 w-7 sm:h-9 sm:w-9" />
        </span>
        <span className="font-display mt-4 text-[clamp(40px,11vw,76px)]">{u}</span>
        <span className="eyebrow mt-2 text-ball">Duo</span>

        {pct !== null ? (
          <span className="font-display mt-4 text-4xl text-ball sm:text-5xl">{pct}%</span>
        ) : (
          ready && (
            <span className="mt-5 inline-flex min-h-10 items-center whitespace-nowrap rounded-full bg-ball px-5 text-[12px] font-extrabold uppercase tracking-[0.12em] text-ink transition group-hover:scale-105 sm:px-5 sm:text-[13px]">
              {pending === u ? "Votando…" : "Votar"}
            </span>
          )
        )}
        {mine && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-ball px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.12em] text-ink">
            ✓ Tu voto
          </span>
        )}
      </button>
    );
  };

  return (
    <div>
      <div className="flex items-stretch gap-3 sm:gap-6">
        {card("ICADE")}
        <div className="flex shrink-0 items-center">
          <span className="text-3xl sm:text-5xl" role="img" aria-label="contra">
            🆚
          </span>
        </div>
        {card("CUNEF")}
      </div>

      <div className="mx-auto mt-6 max-w-xl" aria-live="polite">
        {ready && voted && (
          <>
            <div className="flex h-3 overflow-hidden rounded-full bg-ink/10">
              <div className="bg-ink transition-all duration-700" style={{ width: `${percent(state.counts, "ICADE")}%` }} />
              <div className="flex-1 bg-court" />
            </div>
            <p className="mt-3 text-sm font-semibold text-ink/60">
              {total.toLocaleString("es-ES")} {total === 1 ? "voto" : "votos"} · Ahora demuéstralo en la pista.
            </p>
          </>
        )}
        {ready && !voted && (
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/60">
            Vota por tu universidad y mira cómo va la rivalidad
          </p>
        )}
        {state.status === "disabled" && (
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/50">La votación se abrirá muy pronto</p>
        )}
        {error && <p className="mt-2 text-sm font-medium text-red-700">{error}</p>}
      </div>
    </div>
  );
}
