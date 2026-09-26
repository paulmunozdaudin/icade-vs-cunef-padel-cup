import { formatPrice } from "@/lib/padel/config";
import CtaButton from "./CtaButton";
import { BouncingBall, CourtLines } from "./Visuals";

export default function Hero() {
  return (
    <section
      id="top"
      className="grain relative isolate flex min-h-[100svh] items-center overflow-hidden bg-court pb-10 pt-20 sm:pb-14 sm:pt-24 text-white"
    >
      <CourtLines className="absolute inset-0 -z-10 h-full w-full" strokeOpacity={0.16} />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(5,20,15,0.75)_100%)]" />

      <div className="mx-auto flex w-full max-w-6xl flex-col items-center px-4 text-center sm:px-6">
        <p className="eyebrow animate-fade-up text-white/60">Torneo universitario de pádel</p>

        <h1 className="mt-3 flex flex-col items-center sm:mt-6 md:flex-row md:items-center md:gap-8">
          <span className="font-display animate-fade-up text-[clamp(76px,21vw,200px)] [animation-delay:80ms]">ICADE</span>
          <span className="animate-fade-up my-0.5 flex items-center gap-3 [animation-delay:160ms] md:my-0 md:flex-col md:gap-1">
            <span className="h-px w-10 bg-white/30 md:h-10 md:w-px" aria-hidden="true" />
            <span className="font-display text-[clamp(30px,7vw,64px)] text-ball">VS</span>
            <span className="h-px w-10 bg-white/30 md:h-10 md:w-px" aria-hidden="true" />
          </span>
          <span className="font-display animate-fade-up text-[clamp(76px,21vw,200px)] [animation-delay:240ms]">CUNEF</span>
        </h1>

        <div className="animate-fade-up mt-1 flex items-end gap-3 [animation-delay:320ms]">
          <p className="font-display text-metal text-[clamp(30px,8vw,64px)] tracking-[0.12em]">Padel Cup</p>
          <BouncingBall className="h-7 w-7 sm:h-9 sm:w-9" />
        </div>

        <p className="animate-fade-up mt-5 max-w-xs text-[14px] font-extrabold uppercase leading-snug tracking-[0.12em] [animation-delay:400ms] sm:max-w-none sm:text-lg">
          Una pista. Dos universidades. Una sola ganadora.
        </p>
        <p className="animate-fade-up mt-2 text-sm font-medium text-white/65 [animation-delay:440ms] sm:text-base">
          Pareja ICADE 🆚 Pareja CUNEF
        </p>

        <div className="animate-fade-up mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 [animation-delay:500ms]">
          <span className="chip border-white/15 bg-white/5 px-2.5 text-[11px] sm:px-3 sm:text-[12px]">🎾 Torneo</span>
          <span className="text-xs text-white/40">+</span>
          <span className="chip border-white/15 bg-white/5 px-2.5 text-[11px] sm:px-3 sm:text-[12px]">🎧 Tardeo con DJ</span>
          <span className="text-xs text-white/40">+</span>
          <span className="chip border-white/15 bg-white/5 px-2.5 text-[11px] sm:px-3 sm:text-[12px]">🥂 2 copas</span>
        </div>

        <div className="animate-fade-up mt-7 flex sm:mt-9 w-full flex-col items-center [animation-delay:580ms]">
          <CtaButton size="xl" className="w-full max-w-sm sm:w-auto">
            Comprar entrada
            <span aria-hidden="true" className="text-xl">→</span>
          </CtaButton>
          <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.18em] text-white/55">
            {formatPrice()} · Plazas limitadas
          </p>
        </div>
      </div>

      <a
        href="#evento"
        className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/40 transition hover:text-white/80 sm:block"
      >
        ↓ Descubre el formato
      </a>
    </section>
  );
}
