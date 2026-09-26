import { PlayerIcon } from "./Visuals";

function DuoCard({ university, tone }: { university: "ICADE" | "CUNEF"; tone: "dark" | "court" }) {
  const styles =
    tone === "dark"
      ? "bg-ink text-white"
      : "bg-court text-white";
  return (
    <div className={`${styles} flex flex-1 flex-col items-center rounded-3xl px-4 py-8 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)] sm:py-12`}>
      <div className="flex gap-1.5 text-white/85">
        <PlayerIcon className="h-7 w-7 sm:h-9 sm:w-9" />
        <PlayerIcon className="h-7 w-7 sm:h-9 sm:w-9" />
      </div>
      <p className="font-display mt-4 text-[clamp(40px,11vw,76px)]">{university}</p>
      <p className="eyebrow mt-2 text-ball">Duo</p>
    </div>
  );
}

export default function RivalrySection() {
  return (
    <section id="evento" className="bg-paper py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
        <p className="eyebrow text-court" data-reveal>
          La rivalidad
        </p>
        <h2 className="font-display mt-3 text-[clamp(52px,13vw,112px)]" data-reveal>
          ICADE <span className="text-court">vs</span> CUNEF
        </h2>
        <p className="mt-4 text-base font-extrabold uppercase tracking-[0.12em] sm:text-lg" data-reveal>
          Dos universidades. Dos parejas. Una pista.
        </p>
        <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-ink/70 sm:text-lg" data-reveal>
          Cada enfrentamiento enfrenta <strong className="text-ink">exclusivamente</strong> a una pareja de ICADE
          contra una pareja de CUNEF.
        </p>

        <div className="mt-12 flex items-stretch gap-3 sm:gap-6" data-reveal>
          <DuoCard university="ICADE" tone="dark" />
          <div className="flex shrink-0 items-center">
            <span className="text-3xl sm:text-5xl" role="img" aria-label="contra">
              🆚
            </span>
          </div>
          <DuoCard university="CUNEF" tone="court" />
        </div>

        <p className="font-display mt-14 text-[clamp(36px,9vw,72px)]" data-reveal>
          ¿Quién domina la pista?
        </p>
      </div>
    </section>
  );
}
