import { formatPrice } from "@/lib/padel/config";
import CtaButton from "./CtaButton";
import { CourtLines } from "./Visuals";

export default function Pricing() {
  return (
    <section id="entradas" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <div
          className="grain relative isolate overflow-hidden rounded-[2rem] bg-court px-6 py-10 text-center text-white shadow-[0_40px_80px_-40px_rgba(15,61,46,0.8)] sm:px-10 sm:py-12"
          data-reveal
        >
          <CourtLines className="absolute inset-0 -z-10 h-full w-full" strokeOpacity={0.12} />
          <p className="eyebrow text-white/60">Entrada</p>
          <p className="font-display text-metal mt-4 text-[96px] leading-none sm:text-[120px]">{formatPrice()}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">Por persona</p>

          <div className="mx-auto my-7 h-px w-16 bg-white/20" />

          <p className="text-base font-extrabold uppercase tracking-[0.06em]">Torneo + Tardeo con DJ + 2 copas</p>
          <ul className="mt-4 space-y-1.5 text-sm text-white/75">
            <li>🎾 Torneo ICADE vs CUNEF</li>
            <li>🎧 Tardeo con DJ</li>
            <li>🥂 2 copas incluidas</li>
            <li>🏆 Premios para los ganadores</li>
          </ul>

          <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-ball/40 bg-ball/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-[0.18em] text-ball">
            <span className="h-1.5 w-1.5 rounded-full bg-ball" aria-hidden="true" />
            Plazas limitadas
          </p>

          <CtaButton size="xl" className="mt-7 w-full">
            Quiero mi entrada
          </CtaButton>
        </div>
      </div>
    </section>
  );
}
