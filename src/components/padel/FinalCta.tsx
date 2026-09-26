import { formatPrice } from "@/lib/padel/config";
import CtaButton from "./CtaButton";
import { BouncingBall, CourtLines } from "./Visuals";

export default function FinalCta() {
  return (
    <section className="grain relative isolate overflow-hidden bg-court py-24 text-center text-white sm:py-32">
      <CourtLines className="absolute inset-0 -z-10 h-full w-full" strokeOpacity={0.14} />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="flex justify-center" data-reveal>
          <BouncingBall className="h-10 w-10" />
        </div>
        <h2 className="font-display mt-6 text-[clamp(52px,13vw,120px)]" data-reveal>
          La pista está esperando.
        </h2>
        <p className="font-display mt-4 text-[clamp(32px,8vw,56px)] text-ball" data-reveal>
          ¿ICADE o CUNEF?
        </p>
        <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-white/80 sm:text-base" data-reveal>
          Pareja ICADE 🆚 Pareja CUNEF
        </p>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-white/60" data-reveal>
          🎾 Torneo + 🎧 DJ + 🥂 2 copas
        </p>
        <div className="mt-10 flex flex-col items-center" data-reveal>
          <CtaButton size="xl" className="w-full max-w-sm sm:w-auto">
            Comprar entrada · {formatPrice()}
          </CtaButton>
          <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.2em] text-white/50">
            Plazas limitadas · Representa a tu universidad
          </p>
        </div>
      </div>
    </section>
  );
}
