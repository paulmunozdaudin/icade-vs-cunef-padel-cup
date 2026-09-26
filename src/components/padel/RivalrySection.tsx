import RivalryVote from "./RivalryVote";

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

        <div className="mt-12" data-reveal>
          <RivalryVote />
        </div>

        <p className="font-display mt-14 text-[clamp(36px,9vw,72px)]" data-reveal>
          ¿Quién domina la pista?
        </p>
      </div>
    </section>
  );
}
